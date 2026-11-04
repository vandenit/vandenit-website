"""Report assembly and evidence writing for the vandenit-website sensor.

The JSON report schema (minimal fields per the T0 foundation contract):
    schema_version, run_id, repo, branch, commit_sha, change_class, tier,
    started_at, duration_ms, overall_status,
    guards {spec_present, path_guard_triggered, secret_guard_triggered,
            assertions_weakened},
    steps[] {name, status, duration_ms, skip_reason?, actionable_failures[]},
    artifacts {diffstat, report_path, steps_log_dir},
    notes[]
"""
from __future__ import annotations

import json
import re
from datetime import datetime, timezone
from pathlib import Path

RUN_ID_SAFE = re.compile(r"[^A-Za-z0-9._-]")


def utc_now() -> str:
    return datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")


def make_run_id(tier: str, evidence_root: Path) -> str:
    stamp = datetime.now(timezone.utc).strftime("%Y%m%d-%H%M%S")
    run_id = f"{tier}-{stamp}"
    n = 1
    while (evidence_root / run_id).exists():
        n += 1
        run_id = f"{tier}-{stamp}-{n}"
    return run_id


def write_report(evidence_dir: Path, report: dict) -> Path:
    evidence_dir.mkdir(parents=True, exist_ok=True)
    path = evidence_dir / "report.json"
    path.write_text(json.dumps(report, indent=2) + "\n")
    return path


def write_step_log(evidence_dir: Path, step_name: str, output: str) -> None:
    steps_dir = evidence_dir / "steps"
    steps_dir.mkdir(parents=True, exist_ok=True)
    safe = RUN_ID_SAFE.sub("_", step_name)
    (steps_dir / f"{safe}.log").write_text(output[-20000:])