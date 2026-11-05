"""Tool steps for the vandenit-website verify tiers.

Every step self-detects whether its tooling is configured in this repo and
SKIPs (with an actionable skip_reason) instead of failing when it is not.
Failures are parsed into actionable_failures with test, location (file:line),
type and a concrete message.

Steps: typecheck (tsc --noEmit), lint (package.json lint script),
production-build (build script; full only), playwright-smoke
(tests/e2e on the production build; full only).
"""
from __future__ import annotations

import json
import re
import shutil
from pathlib import Path

from . import report as rep
from .cleanup import ProcessRegistry

STEP_TIMEOUT_S = 900


def _failure(type_: str, message: str, test="-", location="-") -> dict:
    return {"test": test, "location": location, "type": type_, "message": message}


def _step(name: str, runner) -> dict:
    import time
    t0 = time.monotonic()
    try:
        status, skip_reason, failures, notes, output = runner()
    except Exception as e:  # a step crashing must not kill the report
        status, skip_reason, failures, notes, output = (
            "FAIL", None, [_failure("step-crash", f"{type(e).__name__}: {e}")], [], "")
    step = {"name": name, "status": status,
            "duration_ms": int((time.monotonic() - t0) * 1000),
            "actionable_failures": failures}
    if skip_reason:
        step["skip_reason"] = skip_reason
    if notes:
        step["notes"] = notes
    step["_output"] = output
    return step


def _pnpm_available() -> bool:
    return shutil.which("pnpm") is not None


def _node_modules_ok(repo_root: Path) -> bool:
    return (repo_root / "node_modules").exists()


def _scripts(repo_root: Path) -> dict:
    pkg = repo_root / "package.json"
    if not pkg.exists():
        return {}
    try:
        return json.loads(pkg.read_text()).get("scripts", {})
    except ValueError:
        return {}


def _typecheck(repo_root: Path, registry: ProcessRegistry) -> tuple:
    if not (repo_root / "tsconfig.json").exists():
        return "SKIP", "no tsconfig.json in this repo", [], [], ""
    if not _node_modules_ok(repo_root):
        return "SKIP", "node_modules not installed (pnpm install first)", [], [], ""
    if not _pnpm_available():
        return "SKIP", "pnpm not on PATH", [], [], ""
    if (repo_root / "contentlayer.config.ts").exists() and \
            not (repo_root / ".contentlayer").exists():
        # Contentlayer generates .contentlayer/generated during build; tsc
        # cannot compile lib/contentlayer.ts without it on the Next 14 stack.
        return "SKIP", ("contentlayer generated output missing (run `pnpm run build` "
                        "or `pnpm exec contentlayer build` once)"), [], [], ""
    p = registry.run(["pnpm", "exec", "tsc", "--noEmit"],
                     cwd=repo_root, timeout=STEP_TIMEOUT_S)
    out = (p.stdout or "") + (p.stderr or "")
    if p.returncode == 0:
        return "PASS", None, [], [], out
    fails = []
    for line in out.splitlines():
        m = re.match(r"^(.+?\.tsx?)\((\d+),(\d+)\):\s*error\s+(\w\d{4}):\s*(.+)$", line)
        if m:
            fails.append(_failure("tsc-error", m.group(5), test=m.group(4),
                                  location=f"{m.group(1)}:{m.group(2)}"))
    return "FAIL", None, fails or [_failure("tsc-run", out.strip()[-800:])], [], out


def _script_step(name: str, script_key: str, repo_root: Path,
                 registry: ProcessRegistry) -> tuple:
    scripts = _scripts(repo_root)
    if script_key not in scripts:
        return "SKIP", f"package.json has no '{script_key}' script", [], [], ""
    if not _node_modules_ok(repo_root):
        return "SKIP", f"node_modules not installed (pnpm install first) — '{script_key}' cannot run", [], [], ""
    if not _pnpm_available():
        return "SKIP", "pnpm not on PATH", [], [], ""
    p = registry.run(["pnpm", "run", script_key], cwd=repo_root,
                     timeout=STEP_TIMEOUT_S)
    out = (p.stdout or "") + (p.stderr or "")
    if p.returncode == 0:
        return "PASS", None, [], [], out
    if name == "lint":
        fails = []
        for line in out.splitlines():
            m = re.match(r"^(.*?):(\d+):(\d+):\s*(error|warning)\s+(.+?)[\s]{2,}(.+)$", line)
            if m and m.group(4) == "error":
                fails.append(_failure("eslint-error", f"{m.group(6)}: {m.group(5)}",
                                      location=f"{m.group(1)}:{m.group(2)}"))
        return ("FAIL", None,
                fails or [_failure(f"{name}-run", out.strip()[-800:]
                                   or f"exit code {p.returncode}")], [], out)
    return "FAIL", None, [
        _failure(f"{name}-run", out.strip()[-1200:] or f"exit code {p.returncode}")], [], out


def _playwright_smoke(repo_root: Path, registry: ProcessRegistry) -> tuple:
    if not any((repo_root / f"playwright.config.{ext}").exists()
               for ext in ("ts", "js", "mjs")):
        return "SKIP", "no playwright.config in this repo", [], [], ""
    if not (repo_root / "tests" / "e2e").exists():
        return "SKIP", "no tests/e2e suite in this repo", [], [], ""
    if not (repo_root / "node_modules" / "@playwright").exists():
        return "SKIP", "node_modules not installed (pnpm install first)", [], [], ""
    if not _pnpm_available():
        return "SKIP", "pnpm not on PATH", [], [], ""
    env_extra = {"CI": "1"}
    p = registry.run(["pnpm", "exec", "playwright", "test"],
                     cwd=repo_root, timeout=STEP_TIMEOUT_S, env_extra=env_extra)
    out = (p.stdout or "") + (p.stderr or "")
    if p.returncode == 0:
        return "PASS", None, [], [], out
    fails = []
    for line in out.splitlines():
        m = re.match(r"^[\s]*[×✘x]\s+\d+\].*", line)
        tail = line.strip()
        if m or tail.startswith("[chromium]") or (tail.startswith("✘") is False and False):
            fails.append(_failure("playwright-failure", tail, location="(stdout)"))
    return "FAIL", None, fails or [_failure(
        "playwright-run", out.strip()[-1500:] or f"exit code {p.returncode}")], [], out


def run_tool_steps(repo_root: Path, registry: ProcessRegistry, tier: str,
                   changed_paths: list, halted: str | None,
                   evidence_dir: Path) -> list:
    """Run the tool steps for this tier; guard halts turn steps into SKIPs."""
    def maybe(name: str, runner) -> dict:
        if halted:
            return {"name": name, "status": "SKIP", "duration_ms": 0,
                    "skip_reason": f"halted: {halted}", "actionable_failures": []}
        step = _step(name, runner)
        output = step.pop("_output", "")
        if output:
            rep.write_step_log(evidence_dir, name, output)
        return step

    steps_out = [
        maybe("typecheck", lambda: _typecheck(repo_root, registry)),
        maybe("lint", lambda: _script_step("lint", "lint", repo_root, registry)),
    ]
    if tier == "full":
        steps_out += [
            maybe("production-build",
                  lambda: _script_step("production-build", "build", repo_root, registry)),
            maybe("playwright-smoke", lambda: _playwright_smoke(repo_root, registry)),
        ]
    return steps_out