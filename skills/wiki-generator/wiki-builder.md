---
description: 'Use when building audiobook wikis via the ChatGPT pipeline.'
name: wiki-builder
tags: [wiki, chatgpt, drive, vitepress, audiobooks, pipeline]
version: 2.0.0
---

# Wiki Builder — Audiobook-wiki pipeline (Hermes ↔ ChatGPT via Drive)

Use when: adding a new audiobook-wiki project, checking pipeline progress, integrating ChatGPT chapter output, troubleshooting the sync cron, or preparing new book sources.

The bridge protocol itself (queues, drivers, statuses, file rules) lives in [`gpt-assistant-bridge.md`](./gpt-assistant-bridge.md). This skill covers the Hermes side: the local registry, the integration cron, and adding new books.

## Components

1. **Local registry (source of truth for local state):** `~/projects/wiki-scheduler/registry.json` — Drive IDs, local paths, ports, systemd units, git remotes, integrated chapters per book, driver prompt ID per book.
2. **Drive (per project):** `<project>/queue.md` with all remaining work items, transcript in the project folder, output in `<project>/outputs/` (see the bridge skill for the protocol).
3. **`prompts.md`:** driver prompts only, one per active project. Volatile by design; queues are the durable state.
4. **Integration cron (`wiki-builder-sync`, hourly):** diff → integrate critically → rebuild → verify → self-heal drivers → commit/push → report ([SILENT] if nothing new).

## Why the queue pattern (design decision, 2026-09)

All batch work items are written to the project queue up front; the driver prompt only says "process the next pending item until done". ChatGPT processes a bounded number of work units per scheduled run (3/hour observed), so several projects advance in parallel. No manual prompt handling; maximum throughput without losing the quality gate — critical review stays in the integration step.

## Adding a new project/book

1. **Source**: check for existing DRM-free EPUB conversions before transcribing. EPUB text is the better source (no mangled names). Only transcribe the audiobook when no EPUB exists (faster-whisper; background daemon + monitor cron).
2. **Chapterize**: split into chapter files with `## Chapter N: Title` headers. EPUB: use `contents.xhtml#c_chN` / `[]{#chapterN.xhtml}` anchors where available. Books without chapter anchors: split on scene boundaries into segments of at most ~150K characters; quarter large segments on paragraph boundaries.
3. **Drive**: create a subfolder + outputs folder inside the project folder, upload the transcript, write `queue.md` with batches of ~5 chapters, add the book section to the project skill file (file naming conventions: `chapter_<prefix>NN.md`, `scene_<prefix>chNN_a.png`), update `projects.json`, put a driver prompt in `prompts.md`.
4. **Registry**: entry in `registry.json` (book section with Drive IDs, naming patterns, driver ID).
5. **Local wiki**: index page placeholder (if new), sidebar section in `.vitepress/config.mts`.
6. **Git**: each new wiki is its own private git repo — `git init` + `.gitignore` (`node_modules`, `.vitepress/dist`, cache) + `gh repo create <name> --private --source . --push`.
7. **Server**: systemd user unit (port, `Restart=always`, see [`vitepress-wiki.md`](./vitepress-wiki.md)) + Tailscale `--set-path` + extend the cron prompt with the book (pattern + outputs folder + driver ID).

## Integration pattern per chapter (cron)

Download `chapter_<prefix>NN.md` → critical review (name corrections from the skill table; no spoilers; quote accuracy) → local page (name from the registry's chapter pattern): title, scene image at top, sections for summary / new characters (portrait embedded) / new concepts / key quotes; do not carry over Drive links from the output's image section → images into `images/characters|scenes/` → update index, characters, concepts/world pages and sidebar → `npx vitepress build && cd .vitepress/dist && ln -s . <base-name>` → curl 200 check → registry update → git commit + push.

## Self-heal drivers

If a project's `queue.md` has pending items but the driver (ID in the registry) is not pending in `prompts.md` (or `prompts.md` was wiped): restore the driver in place (`files().update()` with the canonical ID). Driver format: skills = collaborate-skill + project skill; project (and subproject); command `PROCESS_NEXT_WORK_ITEM`; request pointing at the queue file and outputs folder, repeat within the prompt budget until empty.

## Protocol v2 — PROCESS_NEXT_WORK_ITEM

The bridge skill documents the full semantics. The properties that matter for this side:

- **Selection on status, not type**: BATCH and REPAIR items are both executable work. The queue is only done when no item is pending; the driver only answers when everything is terminal.
- **Empty queue = do nothing this poll** — never shut down the poller or drivers (ChatGPT once turned its own hourly job off; this rule is the response).
- **REPAIR items**: mandatory `**Type:** REPAIR` + `**Targets:**` (explicit target objects, e.g. `book1/scene_ch19`) — resolves subproject ambiguity. Keep the REPAIR-NNN naming; the semantics are useful when debugging.
- **Self-heal restores in place**: never create a second driver for the same project/subproject.
- **Progress fields are summaries, not truth**: the queue itself owns work-item state.
- **The cron diff must see in-place replacements**: compare Drive `modifiedTime` against local mtime — otherwise REPAIR replacements are never picked up.
- **Review lesson (the false alarm)**: measure an alleged defect twice independently (describe first, judge second) before filing a repair. The first "Zaphod has one head" claim was a false alarm; the re-measure found five real ones elsewhere.

## Visual/content review loop (optional, recommended)

After integration, the cron can review new images with any vision-capable CLI model (tested with Claude via the Antigravity CLI):

```bash
timeout 280 script -qc "agy --model '<vision model>' --dangerously-skip-permissions --print '<review prompt>'" /dev/null
```

- `script -qc` allocates a PTY — some CLI tools fail without one (see the Safety notes on the skip-permissions flag: it is an operator choice, not a default).
- Review state: `review-state.json` (last reviewed chapter + reviewed images per project), log: `review-log.md`.
- One project per cron run, at most ~8 images per call (larger batches time out).
- Leniency rule: only CLEAR mismatches are repaired — wrong gender or hair color, missing iconic features (two heads, three arms), a different face than the canonical portrait. Style variation is fine; this is recreational content. Low-severity notes are logged, not acted on.
- CLEAR mismatches → REPAIR item in the queue (in-place replacement, same filename/Drive ID, same style and pose as the reference; no new chapters generated). Text errors from review also become REPAIR items.
- Observed catches: a portrait missing an arm; five scenes with a wrong head count; one false alarm caught by the double-measure rule.

## Golden rules

- File IDs, never names; in-place updates via `files().update()` (never `drive upload` on an existing file).
- Reading ChatGPT output critically is mandatory (name corrections, spoilers, quotes).
- Per-chapter pages, never one combined summary file.
- Images are required: one scene image per chapter + one portrait per new character; portraits are ALWAYS identity references for scene images (check existing canon first).
- Progressive building per book: no spoilers from later chapters or external knowledge.
- The wiki content language is a config value (Dutch for these wikis, quotes in English) — the pipeline does not care.

## Operator notes (do not copy)

Machine-specific state for a live deployment — replace everything in this section for your own setup: current book progress and hold flags, live Drive IDs, cron job IDs and delivery channels, local paths. This is institutional memory, not protocol. See the top-level [skills README](../README.md) for the publication policy.