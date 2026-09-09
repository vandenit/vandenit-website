# Vanden IT Agent Skills & Playbooks

Reusable AI workflow patterns extracted from systems I actually run.

The website at [vandenit.be/skills](https://vandenit.be/skills) is the readable catalogue. This directory is the canonical source for copyable skill files and playbooks.

## What a "skill" is here

A skill in this directory is a sanitized, reusable instruction set for an AI agent: stable behavior, schemas, commands, invariants, failure handling, and required inputs/outputs. A playbook (collection README) wraps one or more skills into an end-to-end workflow that produced real output.

These are not prompts to paste into a chat. They are operating documents, written for an agent that can read files, run commands, and be scheduled.

## Collections

| Collection | What it does | Status |
|---|---|---|
| [`wiki-generator/`](./wiki-generator/) | ChatGPT + Hermes pipeline for private book wikis: spoiler-aware chapter summaries, canonical character portraits, scene images, critical review, VitePress serving | Working / evolving |

Status labels used in this directory:

- **Experimental** — ran once or twice; expect sharp edges.
- **Working** — runs unattended on a real workload; failure modes documented.
- **Stable** — protocol frozen; changes are additive only.

## How to use these files

1. Read the collection README first; it explains the architecture and the setup steps.
2. Copy or adapt only the skills relevant to your agent environment. The files reference Hermes Agent concepts (cron, skills, terminal tooling) but the protocols are agent-agnostic where possible.
3. Replace placeholders (`<FILE_ID>`, `<slug>`, `~/projects/...`) with your own values.
4. Review permissions, storage and data handling before running anything unattended. Each collection carries a `SAFETY.md` with the specific boundaries.

## Source-of-truth policy

GitHub is canonical. vandenit.be renders these files at build time from this same repository; the website never carries a separately maintained copy. If the site and this directory disagree, this directory wins and the site build is the bug.

## Publication policy

Public skills are sanitized. Live Drive file IDs, credentials, private project state, current book progress, machine-specific paths and operator memory do not belong in a reusable skill definition. Sanitization happens before every publish; failure knowledge is kept (it is the useful part) but legacy superseded instructions are removed rather than left in place.

## Disclaimer

These are working engineering playbooks, not a supported product. They encode failure modes observed in real use (self-disabled schedulers, wiped instruction files, duplicate-file drift) and will evolve with the systems they describe. See each collection's `SAFETY.md` before running anything.