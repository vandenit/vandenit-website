#!/usr/bin/env python3
"""vandenit-website ./verify orchestration (T0 verify foundation).

Tiers: fast (< 30 s, inner loop) | full (< 10 min, before review/MR).

Overall status precedence (documented in .factory/spec.json origin):
    DRAFT_NEEDS_SPEC > ESCALATE_PATH_GUARD > FAIL > PASS
Exit code 0 only on PASS. The JSON report is written to
.factory/evidence/<run-id>/report.json and printed to stdout; progress notes
go to stderr so stdout stays parseable.
"""
from __future__ import annotations

import argparse
import atexit
import json
import signal
import sys
import time
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[2]))

from scripts.verify import guards, gitutil, report as rep, steps  # noqa: E402
from scripts.verify.cleanup import ProcessRegistry  # noqa: E402

REPO_NAME = "vandenit-website"


def note(msg: str) -> None:
    print(f"[verify] {msg}", file=sys.stderr)


def guard_step(name: str, started: float, status: str, failures: list,
               extra: dict | None = None) -> dict:
    step = {"name": name, "status": status,
            "duration_ms": int((time.monotonic() - started) * 1000),
            "actionable_failures": failures}
    if extra:
        step.update(extra)
    return step


def run(repo_root: Path, tier: str) -> str:
    registry = ProcessRegistry()
    atexit.register(registry.cleanup)

    def on_signal(signum, frame):
        note(f"signal {signum} received — cleaning up started processes")
        sys.exit(130)

    for sig in (signal.SIGINT, signal.SIGTERM, signal.SIGHUP):
        signal.signal(sig, on_signal)

    t_start = time.monotonic()
    evidence_root = repo_root / ".factory" / "evidence"
    run_id = rep.make_run_id(tier, evidence_root)
    evidence_dir = evidence_root / run_id
    notes = ["guards report the verdict about the diff, not sensor health; "
             "overall_status takes the worst verdict "
             "(DRAFT_NEEDS_SPEC > ESCALATE_PATH_GUARD > FAIL > PASS; "
             "semantics documented in .factory/spec.json origin)"]

    # --- guards -----------------------------------------------------------------
    t = time.monotonic()
    spec_present, change_class, spec_failure = guards.check_spec(repo_root)
    step_spec = guard_step(
        "spec-guard", t,
        "PASS" if spec_present else "FAIL",
        [] if spec_present else [guards._gf("spec-guard", ".factory/spec.json", 0,
                                           "DRAFT_NEEDS_SPEC",
                                           spec_failure or "spec-guard failed",
                                           "BLOCKER")])
    halted = None if spec_present else "DRAFT_NEEDS_SPEC"

    sensor_mode, sensor_base = gitutil.resolve_sensor_base(repo_root)
    notes.append(f"path-assertion-guard base: mode={sensor_mode}, base="
                 f"{(sensor_base or 'none-yet')[:12]}")

    scope = gitutil.diff_scope(repo_root)
    if gitutil.is_dirty(repo_root):
        notes.append("working tree is dirty; guards ran on the committed diff "
                     f"({scope.base}...HEAD) only — commit before review")
    if scope.truncated:
        notes.append("diff text truncated at 2 MB for guard scanning")

    if halted:
        # 'No-Spec, No-Run' stops the run directly: the remaining guards are not
        # evaluated and report neutral defaults.
        notes.append("run halted at spec-guard; remaining guards not evaluated "
                     "(neutral defaults in guards{})")
        guard_steps = [step_spec] + [
            {"name": n, "status": "SKIP", "duration_ms": 0,
             "skip_reason": f"halted: {halted}", "actionable_failures": []}
            for n in ("path-assertion-guard", "secret-guard")]
        path_triggered = secret_triggered = False
        weakened = 0
        overall = "DRAFT_NEEDS_SPEC"
    else:
        t = time.monotonic()
        path_triggered, path_failures, weakened, sensor_changes = guards.check_paths(
            scope, sensor_base, sensor_mode, repo_root)
        step_path = guard_step("path-assertion-guard", t,
                               "FAIL" if path_triggered else "PASS",
                               path_failures,
                               {"sensor_base": sensor_base or None,
                                "sensor_mode": sensor_mode,
                                "sensor_changes": sensor_changes})
        notes.append(f"sensor changes on frozen paths since base: {len(sensor_changes)}")

        t = time.monotonic()
        secret_triggered, secret_failures = guards.check_secrets(scope)
        step_secret = guard_step("secret-guard", t,
                                 "FAIL" if secret_triggered else "PASS",
                                 secret_failures)

        guard_steps = [step_spec, step_path, step_secret]

        # --- overall status from guards --------------------------------------
        if path_triggered or weakened > 0:
            overall = "ESCALATE_PATH_GUARD"
        elif secret_triggered:
            overall = "FAIL"
        else:
            overall = "PASS"

    # --- tool steps ---------------------------------------------------------------
    changed_paths = scope.paths()
    tool_steps = steps.run_tool_steps(
        repo_root, registry, tier, changed_paths, halted, evidence_dir)
    all_steps = guard_steps + tool_steps
    if overall == "PASS" and any(s["status"] == "FAIL" for s in tool_steps):
        overall = "FAIL"
    if registry.active_count:
        notes.append("[cleanup-check] process registry still has active children after "
                     "the run — cleanup trap failed; report marked FAIL")
        if overall in ("PASS",):
            overall = "FAIL"

    duration_ms = int((time.monotonic() - t_start) * 1000)
    if tier == "fast":
        notes.append(f"fast tier completed in {duration_ms / 1000:.1f}s "
                     "(budget < 30 s, advisory)")
    report = {
        "schema_version": "1.0",
        "run_id": run_id,
        "repo": REPO_NAME,
        "branch": gitutil.current_branch(repo_root),
        "commit_sha": scope.head,
        "change_class": change_class,
        "tier": tier,
        "started_at": rep.utc_now(),
        "duration_ms": duration_ms,
        "overall_status": overall,
        "guards": {
            "spec_present": spec_present,
            "path_guard_triggered": path_triggered,
            "secret_guard_triggered": secret_triggered,
            "assertions_weakened": weakened,
        },
        "steps": all_steps,
        "artifacts": {
            "diffstat": scope.diffstat,
            "report_path": f".factory/evidence/{run_id}/report.json",
            "steps_log_dir": f".factory/evidence/{run_id}/steps",
        },
        "notes": notes,
    }

    path = rep.write_report(evidence_dir, report)
    print(json.dumps(report, indent=2))
    note(f"report: {path}")
    return overall


def main() -> int:
    parser = argparse.ArgumentParser(prog="verify", add_help=True)
    parser.add_argument("tier", nargs="?", default="fast",
                        choices=["fast", "full"])
    parser.add_argument("--repo-root", type=Path,
                        default=Path(__file__).resolve().parents[2])
    args = parser.parse_args()
    overall = run(args.repo_root, args.tier)
    return 0 if overall == "PASS" else 1


if __name__ == "__main__":
    sys.exit(main())