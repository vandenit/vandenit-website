"""The vandenit-website verify guards: spec-guard, path-assertion-guard,
secret-guard (T0 verify foundation, task NEXT16-CONTENT-PIPELINE).

Guard semantics (documented in .factory/spec.json, origin field):
- spec-guard:      invalid/missing .factory/spec.json halts the run
                   (DRAFT_NEEDS_SPEC); remaining guards SKIP with neutral
                   defaults so the escalation review still gets full evidence.
- path-guard:      changes on sensor paths versus the sensor base ->
                   ESCALATE_PATH_GUARD; weakened assertions in existing e2e
                   test files count the same way.
- secret-guard:    secret-shaped strings in the diff -> FAIL (values echoed masked).

The path guard and secret guard record their verdicts and let the run continue
so the escalation review still receives complete evidence; only the spec-guard
halts (No-Spec, No-Run).
"""
from __future__ import annotations

import json
import re
from pathlib import Path

from .gitutil import DiffScope, git_out

# --- path-assertion-guard ------------------------------------------------------
# Sensor paths (frozen at the T0 baseline): the verify entry + its python
# package, the Playwright runner config and the e2e suite. When `verify` is
# still absent from origin/main (the T0 introduction PR), the sensor compares
# these against VERIFY_INTRO_SHA instead (see gitutil.resolve_sensor_base).
#
# Exemptions inside .factory/:
#   .factory/spec.json            - the per-task intent setpoint every task touches
#   .factory/baseline-next14.json - T0 baseline evidence artifact (task-scoped)
#   .factory/evidence/            - untracked run evidence (.gitignore)
# Everything else under .factory/ stays guarded.
FACTORY_EXEMPT = {".factory/spec.json", ".factory/baseline-next14.json", ".factory/evidence"}

TEST_FILE_PATTERN = re.compile(r"^tests/e2e/.*\.spec\.tsx?$")


def is_sensor_path(path: str) -> bool:
    from .gitutil import SENSOR_FILES, SENSOR_PREFIXES
    if path in SENSOR_FILES:
        return True
    return any(path == pre.rstrip("/") or path.startswith(pre) for pre in SENSOR_PREFIXES)


def _path_guard_reason(path: str, old_path: str | None) -> str | None:
    if is_sensor_path(path):
        if TEST_FILE_PATTERN.match(path):
            return "frozen e2e suite file"
        if path.startswith("scripts/verify/"):
            return "verify script package"
        return "verify entry script"
    if path in FACTORY_EXEMPT or path.startswith(".factory/evidence/"):
        return None
    if path.startswith(".factory/"):
        return ".factory/ sensor file"
    if old_path:
        reason = _path_guard_reason(old_path, None)
        if reason:
            return f"renamed away from guarded path ({reason})"
    return None


# --- assertion-weakening analysis ------------------------------------------------

def _iter_hunk_lines(patch: str):
    """Yield (kind, content) for '-|+'-prefixed lines and 'HUNK' sentinels,
    having skipped the '--- '/'+++ ' headers before classifying lines. Content
    keeps its leading whitespace: a re-indent is a block change, while a
    '-x' / '+x' pair identical modulo line ending is normalization only."""
    in_test_file = False
    for raw in patch.splitlines():
        if raw.startswith("diff --git"):
            in_test_file = False
        elif raw.startswith("--- "):
            p = raw[4:].strip()
            in_test_file = p != "/dev/null" and TEST_FILE_PATTERN.match(
                p[2:] if p.startswith("a/") else p) is not None
        elif raw.startswith("@@ "):
            if in_test_file:
                yield ("HUNK", raw)
        elif in_test_file and raw[:1] in ("+", "-", " "):
            yield (raw[:1], raw[1:])


def _weakened_count(lines: list) -> int:
    """Count '-' lines that are neither a newline-normalization pair nor part
    of a trailing pure-append run (a trailing append is all '+' lines with no
    '-' line, so it never counts here)."""
    weakenings = 0
    i = 0
    while i < len(lines):
        kind, content = lines[i]
        if kind == "-":
            nxt = lines[i + 1] if i + 1 < len(lines) else None
            if nxt is not None and nxt[0] == "+" and nxt[1] == content:
                i += 2  # newline normalization pair, not a weakening
                continue
            weakenings += 1
        i += 1
    return weakenings


def _test_file_line_count(repo_root, path: str) -> int:
    import subprocess
    p = subprocess.run(["git", "-C", str(repo_root), "show", f"HEAD:{path}"],
                       capture_output=True, text=True, check=False)
    return len(p.stdout.splitlines()) if p.returncode == 0 else 0


# --- path guard runner ------------------------------------------------------------


def check_paths(scope: DiffScope, sensor_base: str, sensor_mode: str,
                repo_root: Path):
    """Return (triggered, failures, assertions_weakened, sensor_changes)."""
    from .gitutil import sensor_changes as _sensor_changes
    failures = []
    changes = _sensor_changes(repo_root, sensor_base)
    base_name = "T0 baseline commit" if sensor_mode == "intro" else "origin/main"
    for change in changes:
        failures.append(_gf(
            "path-guard", change["path"], 0, "ESCALATE_PATH_GUARD",
            f"diff {change['status']} on sensor path '{change['path']}' versus the "
            f"{base_name} (frozen sensor — automatic human review required)",
            "ESCALATE"))
    weakened = _assertions_weakened(repo_root, sensor_base, changes)
    if weakened:
        failures.append(_gf(
            "assertion-guard", "(diff)", 0, "ESCALATE_PATH_GUARD",
            f"{weakened} line(s) weakened in existing e2e test file(s) — every "
            "change to an existing test is human-reviewed", "ESCALATE"))
    return bool(failures), failures, weakened, changes


def _assertions_weakened(repo_root, sensor_base: str, sensor_changes: list) -> int:
    """Count weakened lines in test files that already exist at the sensor base."""
    if not sensor_base:
        return 0
    total = 0
    for change in sensor_changes:
        path = change["path"]
        if not TEST_FILE_PATTERN.match(path):
            continue
        exists_at_base = subprocess_result(
            repo_root, "cat-file", "-e", f"{sensor_base}:{path}").returncode == 0
        if not exists_at_base:
            continue  # brand-new test file: clean addition, not a weakening
        if change["status"] in ("D", "R"):
            total += _test_file_line_count(repo_root, path)
            continue
        patch = subprocess_result(repo_root, "diff", "-U0", f"{sensor_base}..HEAD",
                                  "--", path).stdout
        segments: list[list] = [[]]
        for t in _iter_hunk_lines(patch):
            if t[0] == "HUNK":
                segments.append([])
                continue
            segments[-1].append(t)
        total += sum(_weakened_count(seg) for seg in segments)
    return total


def subprocess_result(repo_root, *args: str):
    import subprocess
    return subprocess.run(["git", "-C", str(repo_root), *args],
                          capture_output=True, text=True, check=False)


# --- secret-guard ------------------------------------------------------------------
# Patterns are deliberately precise so this guard's own source does not
# self-match when the diff (which contains this file) is scanned: the character
# class or punctuation right after each literal prefix breaks the match on the
# source line itself.

SECRET_PATTERNS: list = [
    ("openai-api-key", re.compile(r"sk-[A-Za-z0-9_-]{20,}")),
    ("anthropic-api-key", re.compile(r"sk-ant-[A-Za-z0-9_-]{20,}")),
    ("github-token", re.compile(r"\b(?:ghp|gho|ghu|ghs|ghr)_[A-Za-z0-9]{30,}\b")),
    ("aws-access-key", re.compile(r"\bAKIA[0-9A-Z]{16}\b")),
    ("slack-token", re.compile(r"\bxox[abprs]-[A-Za-z0-9-]{10,}\b")),
    ("private-key-block", re.compile(
        "-----BEGIN " + "(?:RSA |EC |DSA |OPENSSH )?PRIVATE KEY-----")),
    ("google-api-key", re.compile(r"\bAIza[0-9A-Za-z_-]{30,}\b")),
    ("npm-token", re.compile(r"\bnpm_[A-Za-z0-9]{30,}\b")),
    ("credentials-in-url", re.compile(r"https?://[^/\s]*:[A-Za-z0-9_~.-]{12,}@")),
]


def _iter_secret_hits(scope: DiffScope):
    file_a = file_b = None
    old_line = new_line = 0
    expect_plus_header = False
    for raw in scope.patch.splitlines():
        if raw.startswith("diff --git"):
            file_a = file_b = None
            expect_plus_header = False
        elif file_a is None and raw.startswith("--- "):
            p = raw[4:].strip()
            file_a = None if p == "/dev/null" else (p[2:] if p.startswith("a/") else p)
            expect_plus_header = True
        elif expect_plus_header and raw.startswith("+++ "):
            p = raw[4:].strip()
            file_b = None if p == "/dev/null" else (p[2:] if p.startswith("b/") else p)
            expect_plus_header = False
        elif raw.startswith("@@ "):
            expect_plus_header = False
            m = re.match(r"@@ -(\d+)(?:,\d+)? \+(\d+)(?:,\d+)? @@", raw)
            if m:
                old_line, new_line = int(m.group(1)), int(m.group(2))
        elif raw[:1] in "+-":
            for name, pattern in SECRET_PATTERNS:
                m = pattern.search(raw[1:])
                if m:
                    added = raw.startswith("+")
                    yield {
                        "file": (file_b or file_a or "?") if added else (file_a or file_b or "?"),
                        "line": new_line if added else old_line,
                        "pattern": name, "preview": _mask(m.group(0)),
                    }
            if raw.startswith("+"):
                new_line += 1
            else:
                old_line += 1
        elif raw[:1] == " ":
            old_line += 1
            new_line += 1


def _mask(value: str) -> str:
    return (value[:3] + "***REDACTED***") if len(value) > 3 else "***REDACTED***"


def check_secrets(scope: DiffScope):
    hits = list(_iter_secret_hits(scope))
    failures = [_gf(
        f"secret-guard:{h['pattern']}", h["file"], h["line"], "SECRET_IN_DIFF",
        f"pattern '{h['pattern']}' matched at {h['file']}:{h['line']} "
        f"(value masked: {h['preview']}) — remove the secret; rotate if ever valid",
        "BLOCKER") for h in hits]
    return bool(hits), failures


# --- spec-guard + failure schema -----------------------------------------------------


def check_spec(repo_root: Path):
    """Return (spec_present, change_class, failure_message)."""
    spec_path = Path(repo_root) / ".factory" / "spec.json"
    if not spec_path.exists():
        return False, "unclassified", (
            "missing .factory/spec.json — create it with numbered ACs "
            "(AC-1, AC-2, ...); No-Spec, No-Run")
    try:
        spec = json.loads(spec_path.read_text())
    except ValueError as e:
        return False, "unclassified", f"invalid JSON in .factory/spec.json: {e}"
    acs = spec.get("acceptance_criteria")
    if not isinstance(acs, list) or not any(
        isinstance(a, str) and re.match(r"^AC-\d+\b", a) for a in acs
    ):
        return False, "unclassified", (
            ".factory/spec.json has no numbered acceptance criteria "
            "(AC-1, AC-2, ...); No-Spec, No-Run")
    return True, str(spec.get("change_class", "unclassified")), None


def _gf(test: str, path: str, line: int, type_: str, message: str,
        severity: str) -> dict:
    location = f"{path}:{line}" if line else path
    return {"test": test, "location": location, "type": type_,
            "message": message, "severity": severity}