---
name: gpt-assistant-bridge
description: Bridge for communicating with ChatGPT via Google Drive shared folders. One queue-based protocol (v2): driver prompts, in-place file updates, canonical IDs, finite status vocabulary.
version: 2.0.0
---

# GPT Assistant Bridge — protocol v2

Communicate with ChatGPT through a shared Google Drive folder structure. ChatGPT runs as a scheduled task that polls the shared folder hourly and processes work items from per-project queues. Hermes writes thin *driver* prompts, downloads outputs, reviews them, and integrates them locally.

This file documents **protocol v2 only** (queue-based, September 2026). v1 (raw prompts appended to `prompts.md`) is retired; see [Legacy](#legacy) for what replaced it and why.

## Folder Structure on Drive

```
gptprompts/                          (the shared root folder)
├── prompts.md                       # driver prompts only (volatile)
├── outputs.md                       # ChatGPT writes output summaries
├── conflicts.md                     # ChatGPT writes what it cannot process
├── manifest.md                      # ChatGPT maintains canonical file/folder IDs
├── skills/                          # context files
│   ├── collaborate-skill.md         # the general protocol (ChatGPT side)
│   └── <project>-skill.md           # per-project context
├── projects.json                    # project index
└── <project>/                       # one folder per project
    ├── queue.md                     # ALL work items for this project
    ├── transcript                   # chapterized source text
    └── outputs/                     # chapter_NN.md, char_<name>.png, scene_chNN_a.png
```

Older projects (pre-v2) wrote outputs into a shared `gptprompts/outputs/` folder. That is legacy: every new project uses its own `<project>/outputs/` subfolder. Do not create new projects against the shared outputs folder.

**Google API script (Hermes installs):** `python3 ~/.hermes/skills/productivity/google-workspace/scripts/google_api.py`

## Authority Model

Each state domain has exactly one owner. When these disagree, the owner wins; anything else is a bug to fix, not a truth to consult.

| Domain | Owner | What lives there |
|---|---|---|
| Remote file/folder identities | `manifest.md` | Canonical Drive IDs for every shared file and folder |
| Work-item lifecycle | `<project>/queue.md` | All batches and repairs, their statuses, timestamps, attempts |
| Local integration/deployment state | local registry (e.g. `~/projects/wiki-scheduler/registry.json`) | Local paths, ports, systemd units, git remotes, integration progress, driver prompt IDs |

`projects.json` is the project index (which projects exist, their slugs and pointers); `last_chapter` and similar progress fields inside it are summaries, not truth — the queue is the truth for what has been processed.

## Golden Rules

1. **Always use Drive File IDs, never file names.** Google Drive allows unlimited duplicates with the same name. Only the ID is unique. Read `manifest.md` first when you need an ID.
2. **One canonical copy per file.** The IDs in `manifest.md` are the only correct ones. Anything else with the same name is archive or waste.
3. **Upload only to create genuinely new files.** `drive upload` always creates a new Drive file — it never overwrites. To modify an existing file: download it by canonical ID, edit locally, then update it in place with `files().update()` on that same ID (see below). Re-uploading an existing file is the single biggest source of duplicates this protocol has had (three duplicate `prompts.md` files accumulated before the rule existed).
4. **Everything is `text/markdown`, never Google Docs.** ChatGPT defaults to Docs for `.md` files, which breaks text extraction. State this explicitly in your project skill files.
5. **Never put the batch list in `prompts.md`.** `prompts.md` is a volatile mailbox (ChatGPT periodically wipes it — observed: canonical file reduced to 1 byte). Queues are the durable work state; drivers are recoverable.

## Reading and Writing Files

Download by canonical ID:

```bash
GAPI="python3 ~/.hermes/skills/productivity/google-workspace/scripts/google_api.py"
$GAPI drive download <FILE_ID> --output /tmp/prompts.md 2>&1 | tail -3
```

To update an existing file in place (the only correct way — `drive upload` would create a duplicate):

```python
import sys
sys.path.insert(0, '~/.hermes/skills/productivity/google-workspace/scripts')
from google_api import build_service
from googleapiclient.http import MediaFileUpload

service = build_service("drive", "v3")
media = MediaFileUpload('/tmp/prompts.md', mimetype='text/markdown')
service.files().update(fileId="<CANONICAL_ID>", media_body=media).execute()
```

`drive upload` is only for creating files that do not exist yet (a new project's transcript, a new skill file, a new output file in `outputs/`).

## The Queue Pattern (protocol v2)

Work items live in each project's `queue.md`, written **up front** (all batches for a project are defined before the first one runs). `prompts.md` holds only thin, declarative *driver* prompts — one per active project:

```markdown
---
## PROMPT-YYYYMMDD-NNN
**Status:** pending
**Date:** <ISO date>
**Skills:** skills/collaborate-skill.md, skills/<slug>-skill.md
**Project:** <slug>
**Subproject:** <subproject-slug>        # optional, e.g. one book in a series
**Command:** PROCESS_NEXT_WORK_ITEM
```

`PROCESS_NEXT_WORK_ITEM` is **the single canonical driver command** (defined in the collaborate-skill file ChatGPT reads). Per driver run, ChatGPT:

1. Resolves the project (and subproject) via `projects.json` → folder, outputs folder, queue file, transcript.
2. Selects the first queue item with `**Status:** pending`, regardless of type — selection is on status, not type. (BATCH and REPAIR are both executable work.)
3. Sets the item `processing` with a `**Started:**` timestamp, processes it according to the project skill file, then sets `answered` with `**Finished:**`.
4. Repeats within its per-run budget (typically 3 work units) until the queue has no pending items.
5. Marks the driver `answered` only when **every** queue item is terminal.

Work item format in `queue.md`:

```markdown
## BATCH-001 — chapters 1-5
**Status:** pending
**Request:** Process transcript chapters 1 through 5 according to the protocol.
```

REPAIR items (filed by the review loop) carry a mandatory type and targets:

```markdown
## REPAIR-004 — scene image ch 21: wrong number of heads
**Status:** pending
**Type:** REPAIR
**Targets:** book1/scene_ch21
**Request:** Replace in place with the canonical portrait as identity reference.
```

REPAIR items follow the same lifecycle as batches. They replace the target file **in place** — same file name, same Drive ID, same style and pose as the reference, changing only what the repair describes. Never rename REPAIR items to BATCH-NNN: the repair semantics are valuable when debugging.

### Status vocabulary

Finite and closed. New values are protocol changes, not per-project inventions.

| Value | Where | Meaning | Terminal? |
|---|---|---|---|
| `pending` | queue item, driver | queued, selectable | no |
| `processing` | queue item | currently being worked; carries `**Started:**` | no |
| `answered` | queue item, driver | done, output written | yes |
| `completed` | queue item | done (synonym used by some older queues) | yes |
| `conflict` | queue item, driver | cannot process; explanation written to `conflicts.md` | yes |

Rules around statuses:

- A `processing` item whose `**Started:**` is older than 3 hours is treated as failed: reset to `pending` with `**Attempt:**` +1 and process that.
- A failed item returns to `pending` with a short note of what went wrong (and a `conflicts.md` entry if applicable).
- An empty queue means "do nothing this poll" — **never shut down the poller or the drivers.** (ChatGPT once disabled its own hourly scheduled task when a queue emptied; this rule is the direct response.)
- The driver is only `answered` when every item in its queue is terminal (`answered`/`completed`/`conflict`).

## Self-Heal Drivers

Because `prompts.md` is volatile, an hourly maintenance step (the integration cron) checks each project: if its `queue.md` has pending items but `prompts.md` has no pending driver for that project — or `prompts.md` was wiped entirely — the driver is restored **in place** (`files().update()` on the canonical driver ID, recorded in the local registry). Never create a second driver for the same project/subproject; there is exactly one canonical driver each.

## Skills System

Each project has a skill file in `gptprompts/skills/<slug>-skill.md` containing: project context (locations, structure, rules), what already exists, output format and agreements, and the character-name correction table (transcription mangles fictional names — e.g. "Narrow" → "Narro"). Every prompt references BOTH the collaborate-skill (general protocol) and the project skill:

```markdown
**Skills:** skills/collaborate-skill.md, skills/<slug>-skill.md
```

For creative projects, skill files stay **neutral**: no pre-filled scene ideas. Suggested lists bias generation; if the operator wants a specific scene, it goes in an individual prompt or queue item, not in the skill file.

## PROJECTS.JSON — Project Index

```json
{
  "projects": {
    "<slug>": {
      "slug": "<slug>",
      "drive_folder": "<FILE_ID>",
      "skill_file": "skills/<slug>-skill.md",
      "transcript": "<transcript-file-name>",
      "description": "<what this project is>",
      "status": "in_progress",
      "last_chapter": 0,
      "local_wiki": "~/projects/<slug>-wiki/",
      "books": {
        "<subproject-slug>": {
          "status": "in_progress",
          "folder": "<FILE_ID>",
          "outputs": "<FILE_ID>",
          "queue": "<FILE_ID>"
        }
      }
    }
  }
}
```

Projects have types (`audiobook-wiki`, `book-analysis`, `document-processing`, `image-generation`); image-generation projects have an empty `transcript`. Prompts address projects via `**Project:** <slug>` and, when a project has subprojects (a book series), `**Subproject:** <slug>`. `last_chapter` and `status` are progress summaries for humans — the queue remains the source of truth for what is actually processed.

## Reviewing Output

Never integrate ChatGPT output blindly. For each produced file:

1. **Names**: check against the project's correction table (transcription errors propagate into every page that links them).
2. **Spoilers**: the wiki builds progressively; a chapter page must not contain information from later chapters or external knowledge.
3. **Quotes**: verify accuracy against the source text.
4. **Images**: verify identity consistency against the canonical portraits (see the collection README's review-loop section).
5. **Format**: consistent with the existing pages.

Clear mismatches become REPAIR queue items — after measuring twice: describe first, judge second, with two independent looks. The first "wrong number of heads" claim turned out to be a false alarm on re-inspection; the second found five real ones.

## Failure Modes Worth Knowing

These all happened; each shaped a rule above.

- **Duplicate canonical files.** `drive upload` on an existing name created 3× `prompts.md` and 2× `outputs.md` before ID-based addressing + in-place updates became the rule. Symptom: agents silently reading stale copies.
- **Wiped mailbox.** `prompts.md` reduced to 1 byte by the very agent reading it, more than once. Consequence: queues are durable, drivers are recoverable, self-heal exists.
- **Self-disabled poller.** ChatGPT interpreted "all work complete" as "scheduled task no longer needed" and turned off its hourly job, silencing every project behind it. Consequence: "empty queue = do nothing this poll", never shut down.
- **Google Docs instead of markdown.** ChatGPT created Google Docs for `.md` files, breaking text extraction (downloads return PDFs). Consequence: `text/markdown` is an explicit protocol rule.
- **Token expiry mid-run.** Drive OAuth tokens expire; a 403 `invalid_grant` mid-cron means re-authenticate (`setup.py --auth-url` → `--auth-code`), then resume from the registry state — the queue makes this safe.
- **Stale progress fields.** `projects.json` progress fields drifted from reality after repairs. Consequence: the queue owns work-item truth; progress fields are summaries.

## Legacy

Kept for recognizing old state, not for running. Do not use any of this for new work.

- **v1 prompt workflow (pre-September 2026):** work items appended directly to `prompts.md` with per-prompt `**Request:**` bodies, addressed by a single `**Skill:**` field. Replaced by the queue pattern after the capacity and wipe failures.
- **`PROCESS_NEXT_CHAPTERS(N)` command:** v1 driver shorthand ("process the next N chapters from `last_chapter + 1`"). Superseded by `PROCESS_NEXT_WORK_ITEM`. May still appear in old queue files; treat as a signal the project predates v2.
- **Shared `gptprompts/outputs/` folder:** used by the first projects; new projects write to `<project>/outputs/`.
- **`**Status:** on hold`:** v1 way to pause a long-running prompt. In v2, pausing means not having a pending driver for that project.
- **`completed` status:** still accepted as terminal (see vocabulary) but new items use `answered`.

## Safety

See the collection's [`SAFETY.md`](./SAFETY.md) before running this bridge unattended: data-handling boundaries, source-material legality, and the operator-choice status of the review command's `--dangerously-skip-permissions` flag.