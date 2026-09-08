# Automatic Audiobook Wiki Generator — Hermes + ChatGPT, No Extra API Keys

This directory contains copies of the three Hermes skills that implement the wiki-generator pipeline:

| File | Role |
|------|------|
| [`wiki-builder.md`](./wiki-builder.md) | The full pipeline: local registry, Drive queues, hourly Hermes cron, integration rules, review loop, protocol v2 |
| [`gpt-assistant-bridge.md`](./gpt-assistant-bridge.md) | The Google Drive bridge protocol: prompts.md / outputs / conflicts, file-ID golden rules, queue pattern |
| [`vitepress-wiki.md`](./vitepress-wiki.md) | VitePress wiki serving: standalone site pattern, wiki page structure, systemd units, Tailscale subpaths |

This README explains how to set the whole thing up from scratch. The short version:

```
 audiobook / EPUB ──► ChatGPT (Plus) ──► Google Drive ──► Hermes (GLM, hourly cron) ──► VitePress wiki ──► Tailscale
                     summaries + images     queue.md       critical integration             systemd         HTTPS
```

**Why this exists:** in 48 hours this pipeline produced five complete book wikis — The Three-Body Problem (48 chapters), The Dark Forest (15), Death's End (74), Hitchhiker's Guide part 1 (35) and part 2 (34): 206 chapter pages, 100+ scene images, 100+ character portraits, all integrated, verified and pushed to git automatically. No image API key was ever created.

## Why no API keys

The obvious way to generate wiki images from a script is to call an image-generation API directly (OpenAI images, FAL.ai, etc.). That works, but it costs money per call and — more importantly — it produces *less consistent* images than the setup below. Here is the reasoning:

1. **ChatGPT runs on an existing Plus subscription.** ChatGPT Plus includes scheduled tasks (the hourly poller), vision on inputs, and image generation through its own tooling. If you already pay for Plus, the marginal cost of this pipeline is zero: no OpenAI API key, no FAL key, no per-image billing.
2. **Hermes runs on GLM via Ollama Cloud.** GLM is cheap enough to run an hourly cron that does diffing, critical review, wiki integration, rebuilds, verification and git pushes without hitting usage limits. Hermes brings persistent memory and reusable skills, so the cron knows the project rules without being re-taught.
3. **Context-driven scheduling beats direct API calls for consistency.** A direct image API call gets exactly one thing: your prompt. The scheduler-driven approach feeds ChatGPT *everything* before it generates: `projects.json` (project state), the project skill file (naming rules, style, what exists already), `queue.md` with exact per-batch instructions, and — critically — the canonical character portraits as identity references. The result is that Arthur Dent has the same face in a scene image as in his canonical portrait, across dozens of images. A stateless API call has no way to hold that consistency across hundreds of generations. Character consistency comes from context, not from the model.

That third point is the real argument. Cost is nice; consistency is structural.

## Components

```
┌───────────────────────────── your machine (Hermes side) ─────────────────────────────┐
│                                                                                       │
│  ~/projects/<book>-wiki/          local VitePress wiki, git repo                       │
│  ~/projects/wiki-scheduler/      registry.json (state of truth) + review-state.json   │
│  Hermes cron (hourly)            diff → integrate → rebuild → verify → self-heal → push│
│  agy (Claude, optional)          visual review of new images                           │
│  systemd user units              wiki-<name>.service, one per wiki                     │
│  Tailscale serve                 HTTPS subpaths for each wiki                          │
│                                                                                       │
└──────────────────────────▲──────────────────────────────┬─────────────────────────────┘
                           │ download outputs             │ write prompts/queue
┌──────────────────────────┴──────────────────────────────▼─────────────────────────────┐
│                              Google Drive (the bridge)                                │
│                                                                                       │
│  gptprompts/                  shared root folder                                      │
│  ├── prompts.md                driver prompts (volatile — do not rely on it)          │
│  ├── outputs.md                output summaries                                      │
│  ├── conflicts.md              ChatGPT writes conflicts here                          │
│  ├── skills/                   per-project skill files + collaborate-skill.md         │
│  ├── projects.json             project index                                         │
│  └── <project>/               one folder per project                                 │
│      ├── queue.md              ALL remaining batches (source of truth)                │
│      ├── transcript            chapterized source text                               │
│      └── outputs/              chapter_NN.md, char_<name>.png, scene_chNN_a.png        │
│                                                                                       │
└──────────────────────────▲──────────────────────────────┬─────────────────────────────┘
                           │ reads prompts.md hourly       │ writes outputs, marks status
┌──────────────────────────┴──────────────────────────────▼─────────────────────────────┐
│                        ChatGPT Plus (scheduled tasks)                                 │
│      polls gptprompts/ every hour, processes up to 3 work items per run,              │
│      generates summaries + portraits + scene images with its own tools                │
└───────────────────────────────────────────────────────────────────────────────────────┘
```

## Setup

### 1. The Drive bridge

Create a shared folder structure on Google Drive:

```
gptprompts/
├── prompts.md        # Hermes writes driver prompts here, ChatGPT marks Status
├── outputs.md        # ChatGPT writes output summaries
├── conflicts.md      # ChatGPT writes anything it can't process
├── outputs/          # legacy shared output folder
├── skills/           # context files (see step 3)
└── projects.json     # project index
```

In ChatGPT (Plus), create a scheduled task: *every hour, read `gptprompts/prompts.md`, process pending prompts, write outputs, mark prompts answered.* Give the task access to the shared folder. This is the whole "API" — a folder and an hourly poll.

**Golden rules for the bridge** (these exist because each one was violated at least once):

- **Always use Drive File IDs, never names.** Drive allows unlimited duplicates with the same name; only the ID is unique. Keep a `manifest.md` with canonical IDs.
- **Never upload a new file when one exists.** `drive upload` always creates a new file. To update in place, download by ID, edit locally, then use the Drive API `files().update()` on the canonical ID.
- **Everything is `text/markdown`.** Not Google Docs. State this in the protocol; ChatGPT defaults to Docs otherwise and text extraction breaks.

### 2. The queue pattern (protocol v2)

Do not put your work items in `prompts.md`. ChatGPT periodically wipes it (observed: canonical file reduced to 1 byte). The queue lives per project, and `prompts.md` only holds thin, recoverable *driver* prompts.

**Per project, write `queue.md` with ALL batches up front:**

```markdown
## BATCH-001 — chapters 1-5
**Status:** pending
**Request:** Process transcript chapters 1 through 5 according to the protocol.

## BATCH-002 — chapters 6-10
**Status:** pending
**Request:** Process transcript chapters 6 through 10 according to the protocol.
```

**One driver prompt per active project in `prompts.md`:**

```markdown
---
## PROMPT-20260908-010
**Status:** pending
**Project:** three-body-problem
**Skills:** skills/collaborate-skill.md, skills/three-body-problem-skill.md
**Command:** PROCESS_NEXT_WORK_ITEM
```

`PROCESS_NEXT_WORK_ITEM` is defined in the collaborate-skill file. Its semantics (fixed after ChatGPT reviewed its own protocol — protocol v2):

- **Selection on Status, not Type.** BATCH and REPAIR items are both executable work. The queue is only done when no item is pending/open.
- **The driver is only answered when all items are terminal** (answered/completed/conflict).
- **REPAIR items carry `**Type:** REPAIR` + `**Targets:**`** with explicit target objects (e.g. `book1/scene_ch19`) — this resolves subproject ambiguity.
- **An empty queue means "do nothing this poll."** Never shut down the poller. (ChatGPT once turned its own hourly job off when `prompts.md` was empty — this rule is the direct response.)
- **Self-heal restores drivers in place.** Never create a second driver with the same project; update the canonical one via `files().update()`.

ChatGPT processes up to 3 work items per hourly run, so multiple projects advance in parallel.

### 3. The skill files

Each project gets a skill file in `gptprompts/skills/<slug>-skill.md`. This is the context ChatGPT reads before doing anything. It contains:

- Project locations and structure (project folder ID, transcript name, outputs folder)
- The protocol: what one work item does (chapter summaries as `chapter_NN.md`, new character portraits as `char_<name>.png`, scene images as `scene_chNN_a.png`)
- Naming rules and file conventions
- A character name correction table (whisper mangles fictional names — "Narrow" → "Narro")
- What already exists (which chapters/characters are done)
- **No scene ideas.** Pre-filled creative lists bias ChatGPT's choices. Keep the skill file neutral.

Also maintain `collaborate-skill.md` (the general protocol) and `projects.json` (the project index). Every prompt references BOTH the collaborate-skill and the project skill.

### 4. The source: transcript or EPUB

- Check for an existing DRM-free EPUB conversion first. EPUB text is the better source — no transcription errors, real chapter anchors. Use `contents.xhtml#c_chN` anchors where available.
- If no EPUB exists, transcribe the audiobook with faster-whisper and keep the raw transcript as-is; corrections happen downstream in the wiki pages, never in the transcript.
- Chapterize into per-chapter files (`## Chapter N: Title`). Books without chapter anchors (The Dark Forest has 7 mega-chapters) get split on scene boundaries into ≤150K-char segments, quartered on paragraph boundaries if still too large.

### 5. The image workflow

This is where the pipeline earns its keep. Two image types:

1. **Canonical portraits** (`char_<name>.png`) — generated once per character, the first time the character appears. These become the identity reference for everything else.
2. **Scene images** (`scene_chNN_a.png`, 16:9) — one per chapter, generated *with the canonical portraits of the characters in that scene as identity references*.

The rule that makes hundreds of images consistent: **portraits first as canon, scenes always reference portraits.** ChatGPT downloads the existing portraits from Drive before generating a scene, so the same face shows up across the whole book. Zaphod keeps two heads and three arms; Arthur Dent keeps Arthur Dent's face.

### 6. Hermes: the hourly integration cron

Hermes runs the `wiki-builder-sync` cron every hour. Per run:

1. **Diff** each project's outputs folder (compare Drive `modifiedTime` against local mtime — required so in-place REPAIR replacements get picked up).
2. **Integrate critically.** Download new `chapter_NN.md` files, read them with a critical eye — name corrections from the skill table, no spoilers from later chapters, accurate quotes — then build the local page: scene image at top, sections for summary / new characters (portraits inline) / new concepts / key quotes. Update index, character and world pages, sidebar.
3. **Rebuild** VitePress, re-create the self-symlink in `dist/`, curl-verify pages return 200.
4. **Self-heal drivers.** If a queue has pending items but no pending driver in `prompts.md` (or `prompts.md` was wiped), restore the driver in place.
5. **Commit and push** — every wiki is its own private git repo.
6. Report (silently if there is nothing new).

The critical review step is not optional. Whisper transcripts mangle fictional names; ChatGPT occasionally drifts. The cron is the quality gate, and it's the reason the queue pattern is safe: ChatGPT can produce at full speed because the review happens in the integration step, not the generation step.

### 7. The visual review loop (optional, recommended)

After integration, the cron can also review new images with Claude via the Antigravity CLI:

```bash
timeout 280 script -qc "agy --model 'Claude Sonnet 4.6 (Thinking)' --dangerously-skip-permissions --print '<review prompt>'" /dev/null
```

- Review state is tracked in `review-state.json` (last reviewed chapter + reviewed images per project) so each run only sees what's new. One project per run, max ~8 images per call.
- Claude checks character consistency: same face as the canonical portrait, iconic features present (Zaphod: two heads, three arms).
- **File a REPAIR item only for CLEAR mismatches** — wrong gender/hair color, missing iconic features, a different face than the canonical portrait. Style variation is fine; this is recreational content. Log low-severity notes without acting.
- **Measure twice before filing.** Describe first, judge second, with two independent looks — the first "Zaphod has one head" claim turned out to be a false alarm on review.
- CLEAR mismatches → a REPAIR item in `queue.md` with `**Type:** REPAIR` + `**Targets:**`. ChatGPT replaces the image in place (same filename, same Drive ID, same style/pose as the reference). No new chapters are generated.

Real catches from this loop: Zaphod portrait missing an arm (two heads correct), five Hitchhiker's scenes where Zaphod had only one head. One false alarm (a scene that on re-measure was correct).

### 8. Serving: systemd + Tailscale

Each wiki is a standalone VitePress site (`base: '/<name>/'` matching its Tailscale path). Serve with systemd **user units** — background `python3 -m http.server` processes die silently (found all three dead on 2026-09-06 with Tailscale routes still pointing at them):

```ini
# ~/.config/systemd/user/wiki-remembrance.service
[Unit]
Description=Remembrance wiki static server (port 5181)
After=network.target

[Service]
WorkingDirectory=%h/projects/remembrance-wiki/.vitepress/dist
ExecStart=/usr/bin/python3 -m http.server 5181 --bind 127.0.0.1
Restart=always
RestartSec=5

[Install]
WantedBy=default.target
```

```bash
systemctl --user daemon-reload && systemctl --user enable --now wiki-remembrance.service
tailscale serve --bg --set-path /remembrance/ http://127.0.0.1:5181
```

Gotchas that matter: `cleanUrls: false` is required with `http.server`; nav/sidebar links use bare paths (VitePress prepends the base — prefixed links double up and 404); re-create the self-symlink in `dist/` after every build (`cd .vitepress/dist && ln -s . <name>`). Full details in [`vitepress-wiki.md`](./vitepress-wiki.md).

## What it produced

Between September 6 and September 8, 2026, starting from two transcripts and three EPUBs:

| Book | Chapters | Status |
|------|----------|--------|
| The Three-Body Problem | 48/48 | complete |
| The Dark Forest | 15/15 | complete |
| Death's End | 74 | near complete |
| Hitchhiker's Guide part 1 | 35/35 | complete |
| Hitchhiker's Guide part 2 | 34 | near complete |

206 chapter pages, 100+ scene images, 100+ character portraits, integrated, verified (curl 200) and pushed to git — without a human touching a chapter page and without a single image API key.

## Constraints and honest notes

- **This is not fully autonomous.** ChatGPT turned its own hourly poller off once (fixed structurally by protocol v2's "empty queue = do nothing" rule). `prompts.md` gets wiped periodically (fixed by the queue pattern). The system needs its supervision encoded as protocol, not as attention.
- **ChatGPT's image quota is subscription-bound.** Throughput is capped by the Plus plan, not by money. That's the trade: predictable zero marginal cost, bounded speed.
- **The wiki content is in Dutch** (Filip reads the books in translation); quotes stay in English. Adjust to taste.
- **The review loop is deliberately lenient.** Only clear mismatches get repaired. Recreational content does not need forensic consistency, and an overly strict reviewer mostly files false alarms.