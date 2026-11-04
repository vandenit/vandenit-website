"""Git plumbing for the vandenit-website verify sensor: diff scope, changed
files, diffstat, and the sensor-base resolution used by the path guard.

Diff base resolution (deterministic, documented): the MR diff is
`origin/main...HEAD`. In repos/remotes where that ref does not exist we fall
back to `main`, then `HEAD~1`, then the empty tree (first commit: the whole
repo is the change). Uncommitted work is never part of the diff scope; a dirty
working tree is reported as a note instead.

Sensor-base resolution for the path-assertion-guard (documented in
.factory/spec.json origin): while `verify` does NOT exist on origin/main (the
T0 introduction PR), the sensor compares its guarded paths against the first
commit on the task branch that introduced them (VERIFY_INTRO_SHA = the T0
baseline commit). After the T0 PR merges, `verify` exists on origin/main and
the guard compares against origin/main like every later task.
"""
from __future__ import annotations

import subprocess
from dataclasses import dataclass, field

GIT_TIMEOUT_S = 120
MAX_PATCH_BYTES = 2_000_000
MAX_DIFFSTAT_CHARS = 4_000
EMPTY_TREE_SHA = "4b825dc642cb6eb9a060e54bf8d69288fbee4904"

# Paths the sensor freezes (see guards.SENSOR_PREFIXES / SENSOR_FILES).
SENSOR_FILES = ("playwright.config.ts",)
SENSOR_PREFIXES = ("verify", "scripts/verify/", "tests/e2e/")


def git(repo_root, *args: str, timeout: int = GIT_TIMEOUT_S) -> subprocess.CompletedProcess:
    """Run git in repo_root; never raises, caller checks returncode."""
    return subprocess.run(
        ["git", "-C", str(repo_root), *args],
        capture_output=True, text=True, timeout=timeout, check=False,
    )


def git_out(repo_root, *args: str, timeout: int = GIT_TIMEOUT_S) -> str:
    p = git(repo_root, *args, timeout=timeout)
    if p.returncode != 0:
        raise RuntimeError(f"git {' '.join(args)} failed (rc={p.returncode}): {p.stderr.strip()}")
    return p.stdout


def head_sha(repo_root) -> str:
    try:
        return git_out(repo_root, "rev-parse", "HEAD").strip()
    except RuntimeError:
        return "unknown"


def current_branch(repo_root) -> str:
    p = git(repo_root, "rev-parse", "--abbrev-ref", "HEAD")
    return p.stdout.strip() if p.returncode == 0 else "unknown"


def is_dirty(repo_root) -> bool:
    p = git(repo_root, "status", "--porcelain")
    return p.returncode == 0 and bool(p.stdout.strip())


def resolve_base(repo_root) -> str:
    """Return the diff base ref/sha for this checkout (see module docstring)."""
    head = head_sha(repo_root)
    for candidate in ("origin/main", "main", "HEAD~1"):
        p = git(repo_root, "rev-parse", "--verify", "--quiet", candidate)
        if p.returncode == 0 and p.stdout.strip():
            sha = p.stdout.strip()
            if sha != head or candidate == "HEAD~1":
                return candidate
    return EMPTY_TREE_SHA  # single-commit repo: diff against the empty tree


def resolve_sensor_base(repo_root) -> tuple[str, str]:
    """Resolve the path-guard comparison base.

    Returns (mode, base_sha):
      - ("post-merge", "<origin-main-sha>"): `verify` exists on origin/main —
        later tasks are guarded against origin/main.
      - ("intro", "<verify-intro-sha>"): the T0 sensor does not exist on
        origin/main yet; the guard compares against the first commit on
        origin/main..HEAD that introduced a sensor path (empty string when no
        commit introduced one yet — the sensor is not committed, nothing to
        compare).
    """
    merge_base = None
    for candidate in ("origin/main", "main"):
        p = git(repo_root, "rev-parse", "--verify", "--quiet", candidate)
        if p.returncode == 0 and p.stdout.strip() and p.stdout.strip() != head_sha(repo_root):
            merge_base = candidate
            break
    if merge_base is not None:
        p = git(repo_root, "cat-file", "-e", f"{merge_base}:verify")
        if p.returncode == 0:
            sha = git_out(repo_root, "rev-parse", "--verify", "--quiet", merge_base).strip()
            return "post-merge", sha

    if merge_base is None:
        return "intro", ""  # nothing to compare against yet
    try:
        log = git_out(repo_root, "log", "--reverse", "--format=%H", f"{merge_base}..HEAD")
    except RuntimeError:
        return "intro", ""
    for sha in log.split():
        try:
            touched = git_out(repo_root, "diff-tree", "--no-commit-id",
                              "--name-only", "-r", "--root", sha)
        except RuntimeError:
            continue
        paths = touched.splitlines()
        if any(_is_sensor_path(p) for p in paths if p):
            return "intro", sha
    return "intro", ""


def _is_sensor_path(path: str) -> bool:
    if path in SENSOR_FILES:
        return True
    return any(path == pre.rstrip("/") or path.startswith(pre) for pre in SENSOR_PREFIXES)


@dataclass
class DiffScope:
    base: str
    head: str
    changes: list = field(default_factory=list)   # [{"path": str, "status": str, "old_path": str|None}]
    patch: str = ""
    diffstat: str = ""
    truncated: bool = False

    def paths(self) -> list:
        return [c["path"] for c in self.changes]

    def by_status(self, statuses: str) -> list:
        return [c for c in self.changes if c["status"][0] in statuses]


def diff_scope(repo_root) -> DiffScope:
    base = resolve_base(repo_root)
    head = head_sha(repo_root)
    # three-dot against the empty tree is invalid; two-dot gives the same MR
    # result for real bases and the full first-commit diff for the tree.
    diff_args = [f"{base}...HEAD"] if base != EMPTY_TREE_SHA else [base, "HEAD"]

    ns = git_out(repo_root, "diff", "--name-status", "-M", *diff_args)
    changes = []
    for line in ns.splitlines():
        parts = [p for p in line.split("\t")]
        if not parts or not parts[0]:
            continue
        status = parts[0][0]
        if status == "R":
            changes.append({"path": parts[2], "status": status, "old_path": parts[1]})
        else:
            changes.append({"path": parts[1], "status": status, "old_path": None})

    p = git(repo_root, "diff", *diff_args)
    patch = p.stdout
    truncated = len(patch.encode("utf-8", "replace")) > MAX_PATCH_BYTES
    if truncated:
        patch = patch[:MAX_PATCH_BYTES]

    d = git(repo_root, "diff", "--stat", *diff_args)
    diffstat = d.stdout[:MAX_DIFFSTAT_CHARS]

    return DiffScope(base=base, head=head, changes=changes, patch=patch,
                      diffstat=diffstat, truncated=truncated)


def sensor_changes(repo_root, sensor_base: str) -> list:
    """Name-status changes on sensor paths between sensor_base and HEAD.

    Empty sensor_base ("intro" mode with nothing committed to compare) yields
    an empty list: the guard then passes neutrally (documented in spec origin).
    """
    if not sensor_base:
        return []
    head = head_sha(repo_root)
    if sensor_base == head:
        return []
    ns = git_out(repo_root, "diff", "--name-status", "-M", sensor_base, head)
    changes = []
    for line in ns.splitlines():
        parts = [p for p in line.split("\t")]
        if not parts or not parts[0]:
            continue
        path = parts[2] if parts[0][0] == "R" else parts[1]
        if _is_sensor_path(path):
            changes.append({
                "path": path, "status": parts[0][0],
                "old_path": parts[1] if parts[0][0] == "R" else None,
            })
    return changes