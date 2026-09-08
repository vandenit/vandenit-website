---
name: gpt-assistant-bridge
description: Bridge for communicating with ChatGPT via Google Drive shared folders. Write prompts, read outputs, and manage conflicts.
version: 1.1.0
---

# GPT Assistant Bridge

Communicate with ChatGPT through a shared Google Drive folder structure. ChatGPT polls `gptprompts/prompts.md` hourly and writes results to `outputs/` and `outputs.md`, conflicts to `conflicts.md`.

## Folder Structure on Drive

```
gptprompts/                          (1LrQDBCEaL8_sizc_-37Q_HBPOg_7XTy1)
├── prompts.md                       # Hermes writes prompts, ChatGPT marks status
├── outputs.md                       # ChatGPT writes output summaries
├── conflicts.md                     # ChatGPT writes conflicts
├── outputs/                         # ChatGPT writes output files (images, text, etc.)
└── skills/                          # Skill files with context for ChatGPT
    └── red-rising-skill.md          # Red Rising wiki context
```

**Google API script:** `python3 ~/.hermes/skills/productivity/google-workspace/scripts/google_api.py`

**Reference:** `references/drive-duplicates-and-cron-sync.md` — Drive duplicate problem root cause and fix, cron-based wiki sync pattern.
**Reference:** `references/wiki-processing-pipeline.md` — How to process ChatGPT chapter summaries into the local wiki, quality assessment criteria, and cron job configuration.
**Reference:** `references/agy-tty-investigation.md` — agy TTY failure root cause (v1.1.11), tested workarounds, and recommendation matrix.
**Reference:** `references/wiki-review-and-image-management.md` — Claude wiki review pattern, portrait swap technique, Drive skill update pattern, scene image embedding, and quality assessment of ChatGPT output.
**Reference:** `references/wiki-review-findings.md` — Actual review results from session 2026-08-10: errors found, corrections applied, portrait review verdicts, and lessons for future reviews.
**Reference:** `references/wiki-review-h25-34-findings.md` — Review of H25-H34, Darrow's post-Carving appearance (gold hair confirmed), new character verifications, missing world.md entries.
**Reference:** `references/vitepress-wiki-build-pattern.md` — VitePress build script, cleanUrls/symlink configuration, image copying, batch embedding pattern, and common pitfalls.
**Reference:** `references/audiobook-wiki-project-setup.md` — Full recipe for setting up a new audiobook-wiki project: create Drive folder, upload transcript, write skill file with Whisper name correction table, update projects.json, and write first prompt for chapter summaries.
**Reference:** `references/agy-wiki-review-pattern.md` — agy (Claude) factual verification pattern for reviewing wiki content against source transcripts, including command template, key parameters, and typical findings taxonomy.

## Golden Rules

1. **Gebruik altijd File IDs, nooit bestandsnamen.** Google Drive staat duplicaten met dezelfde naam toe. Alleen de ID is uniek.
2. **Upload nooit een nieuw bestand als het al bestaat.** `drive upload` maakt altijd een nieuw bestand aan. Om een bestaand bestand te wijzigen: download het via ID, pas de inhoud lokaal aan, en upload de nieuwe versie. ChatGPT zal de oude markeren als vervangen.
3. **Eén canoniek exemplaar per bestand/map.** De IDs in `manifest.md` (in de gptprompts folder) zijn de enige juiste. Alle andere duplicaten zijn archief of afval.
4. **Lees `manifest.md` eerst** als je de IDs nodig hebt. ChatGPT onderhoudt dit bestand.

## Manifest

ChatGPT maintains `manifest.md` in the gptprompts folder with the canonical IDs. Download it first if you need the latest IDs:

```bash
$GAPI drive download 1hu5w-VwMV-mnvaJ-4cV0b9NYDS8URerp --output /tmp/manifest.md 2>&1 | tail -3
cat /tmp/manifest.md
```

## Canonical File IDs (from manifest.md)

| File | ID |
|---|---|
| `gptprompts/` folder | `1LrQDBCEaL8_sizc_-37Q_HBPOg_7XTy1` |
| `manifest.md` | `1hu5w-VwMV-mnvaJ-4cV0b9NYDS8URerp` |
| `prompts.md` | `1RVrCIrJLQSByBeiv4-kQW-UPw1S285YW` |
| `outputs.md` | `1kiKAgD5w6XtbzLndTCX-N1iw8ucRleye` |
| `conflicts.md` | `1yB9NHB1KWLbafe38ZQ0M5wDvmJa-NhTl` |
| `outputs/` folder | `1pF1c8Yfas4NkevugjN3BqDpszR2HLLgU` |
| `skills/` folder | `1y06AcZA-g2o4Gujg2oq7dRiIbGh8z5Hz` |
| `skills/red-rising-skill.md` | `1EHO4aJB5BWf7FQfCKm2hkrWRsRtKXp0Y` |
| `skills/family-drawings-skill.md` | `17g_0X5cjm48ldPAl7xrxKN-Z0vG42p7T` |
| `family-drawings/` folder | `1AtHJXCFkATBiH8TmBWmrtva_oaG1ZW4T` |
| `projects.json` | `1oKve_iHqNwew4YYMxSfs_JOXN1b6D2ff` |
| `collaborate-skill.md` | `1qeouROAi7d2DQR_UpAwpHSAuqfEKpa7F` |

## Skills System

Each project has a skill file in `gptprompts/skills/`. A skill file contains:
- Project context (locaties, structuur, regels)
- Wat we al hebben (welke hoofdstukken, personages, etc.)
- Output formaat en afspraken
- Karakternamen en correcties

**Elke prompt MOET verwijzen naar de relevante skill file** zodat ChatGPT de context kan lezen.

## Workflow

### 1. Write a prompt to ChatGPT

```bash
GAPI="python3 ~/.hermes/skills/productivity/google-workspace/scripts/google_api.py"
PROMPTS_ID="1RVrCIrJLQSByBeiv4-kQW-UPw1S285YW"  # from manifest.md
FOLDER_ID="1LrQDBCEaL8_sizc_-37Q_HBPOg_7XTy1"

# Download current prompts via ID
$GAPI drive download $PROMPTS_ID --output /tmp/prompts.md 2>&1 | tail -3

# Append new prompt — ALWAYS include skill reference
cat >> /tmp/prompts.md << 'PROMPT'

---
## PROMPT-<timestamp>
**Status:** pending
**Date:** <ISO date>
**Skill:** skills/<skill-name>.md
**Request:** <your request here>
PROMPT

# Re-upload (creates new version; ChatGPT picks up the latest by modification time)
$GAPI drive upload /tmp/prompts.md --parent $FOLDER_ID 2>&1 | tail -3
```

**IMPORTANT:** The `PROMPTS_ID` above may be stale after ChatGPT cleanup. Always read `manifest.md` first to get the current canonical ID. The manifest ID itself (`1hu5w-VwMV-mnvaJ-4cV0b9NYDS8URerp`) is stable.

### 2. Check outputs

```bash
OUTPUTS_ID="1kiKAgD5w6XtbzLndTCX-N1iw8ucRleye"
$GAPI drive download $OUTPUTS_ID --output /tmp/outputs.md 2>&1 | tail -3
cat /tmp/outputs.md
```

### 3. Check conflicts

```bash
CONFLICTS_ID="1yB9NHB1KWLbafe38ZQ0M5wDvmJa-NhTl"
$GAPI drive download $CONFLICTS_ID --output /tmp/conflicts.md 2>&1 | tail -3
cat /tmp/conflicts.md
```

### 4. Download output files from outputs/

```bash
OUTPUTS_FOLDER_ID="1pF1c8Yfas4NkevugjN3BqDpszR2HLLgU"

# Search for files in outputs folder
$GAPI drive search "chapter" 2>&1 | grep -E '"name"|"id"'

# Download a specific file
$GAPI drive download <file_id> --output /tmp/<filename> 2>&1 | tail -3
```

### 5. Process outputs and update local wiki

After downloading output files from ChatGPT:

1. **Read each file critically.** Check for:
   - Correct character names (whisper transcripts mangle fictional names — e.g. "Narrow" should be "Narro", "Lauren" should be "Loran")
   - No spoilers from later chapters (progressive building rule)
   - Accurate quotes from the source text
   - Consistent format matching existing wiki pages
2. **Create per-chapter VitePress pages** (`chapter-01.md`, `chapter-02.md`, etc.) — NOT one combined summary file. Each page includes the sfeerbeeld at the top, personageportretten inline under character headings, and the full chapter summary. The book overview page serves as an INDEX with links to per-chapter pages. **Filip explicitly corrected this**: "Er is 1 grote samenvatting klopt dat? Ipv hoofdstuk per hoofdstuk?"
3. **Download and integrate images** — ChatGPT generates sfeerbeelden (scene_chNN_a.png) and personageportretten (char_name.png) alongside chapter summaries. Download all assets from the project's Drive outputs subfolder and embed in the wiki. Do NOT skip this step and present text-only pages. **Filip explicitly corrected this**: "Geen sfeerbeelden ook en geen images? Chatgpt hafe die normaal klaar"
4. **Update personages.md** — add new characters with embedded portraits
5. **Update wereld.md / concepten.md** — add new world concepts
6. **Update sidebar config** with per-chapter links in a collapsible "Hoofdstukken" section
7. **Rebuild VitePress:** `export PATH="/home/filip/.nvm/versions/node/v24.12.0/bin:$PATH" && cd ~/projects/<wiki>/ && npx vitepress build && cd .vitepress/dist && ln -s . <base-name>`
8. **Verify** with curl that pages return 200
9. **Git commit and push AUTOMATICALLY** — Filip said "mag je vanaf nu trouwens automatisch doen". After wiki updates, always: `cd ~/projects/<wiki> && git add -A && git commit -m "..." && git push` (if it has a git remote). Also push `~/documentation/` if that was updated: `cd ~/documentation && git add -A && git commit -m "..." && git push origin master`.

**Kritische houding:** Lees ChatGPT's output niet blind over. Controleer namen, citaten en of er geen spoilers zitten. Filip verwacht dat je kritisch bent, niet dat je gewoon doorgeeft wat ChatGPT schrijft.

## Prompt Format

**Elke prompt moet bevatten:**
- `**Skill:**` — pad naar de relevante skill file in `gptprompts/skills/`
- `**Request:**` — duidelijke, self-contained opdracht
- `**Status:**` — `pending` bij aanmaken

```markdown
---
## PROMPT-20260808-001
**Status:** pending
**Date:** 2026-08-08T20:00:00Z
**Skill:** skills/red-rising-skill.md
**Request:** Lees de transcriptie red_rising.md in books/red_rising en vat elk hoofdstuk één voor één samen. Begin bij Hoofdstuk 4. Sla elke samenvatting op als chapter_NN.md in outputs/. Lees eerst de skill file voor context, regels en output formaat.
```

ChatGPT will:
1. Read the skill file referenced in `**Skill:**`
2. Pick up the prompt within 1 hour
3. Execute the request if possible
4. Write output to `outputs/` and summary to `outputs.md`
5. Mark the prompt as `**Status:** answered` in `prompts.md`
6. If suspicious or unanswerable, mark as `**Status:** conflict` and write to `conflicts.md`

## Reading and Writing Files

All `.md` files are regular markdown (text/markdown), NOT Google Docs. Use the standard download/upload workflow:

```bash
GAPI="python3 ~/.hermes/skills/productivity/google-workspace/scripts/google_api.py"

# Download a markdown file
$GAPI drive download <file_id> --output /tmp/<filename>.md 2>&1 | tail -3

# Read it
cat /tmp/<filename>.md

# Append content, then re-upload
cat >> /tmp/prompts.md << 'PROMPT'
[new content here]
PROMPT
$GAPI drive upload /tmp/prompts.md --parent <FOLDER_ID> 2>&1 | tail -3
```

Note: `drive upload` creates a new file each time. To update an existing file IN-PLACE (avoiding duplicates), use the Drive API directly:

```python
import sys
sys.path.insert(0, '~/.hermes/skills/productivity/google-workspace/scripts')
from google_api import build_service, get_credentials
from googleapiclient.http import MediaFileUpload

service = build_service("drive", "v3")
media = MediaFileUpload('/tmp/prompts.md', mimetype='text/markdown')
result = service.files().update(
    fileId="<CANONICAL_ID>",
    media_body=media
).execute()
```

NEVER use `drive upload` to update an existing canonical file. Always use `files().update()` with the canonical ID from manifest.md.

## Pitfalls

- **`google_api.py` CLI has no `drive list` command.** To enumerate files in a specific Drive folder, use the Python API directly: `service.files().list(q="'<FOLDER_ID>' in parents and trashed=false", fields="files(id, name, mimeType, size)")`. `drive search` searches all of Drive, not a single folder, so it returns irrelevant results when you need folder-scoped listings. See `init-drive-project/references/image-generation-project-setup.md` for a copy-paste script.
- **`execute_code` kan geblokkeerd zijn in sommige sessies.** Schrijf Python scripts naar `/tmp/` met `write_file` en voer ze uit via `terminal` (`python3 /tmp/script.py`) in plaats van `execute_code` voor Drive API operaties (projects.json update, prompts.md update in-place).
- **`drive upload` creates a NEW file every time.** It does NOT overwrite by name. Google Drive allows unlimited duplicates with the same name. ALWAYS use the canonical file ID from `manifest.md` to download. To UPDATE an existing file in-place, use the `files().update()` Python API (see Reading and Writing Files section above), NOT `drive upload`. This was the single biggest source of bugs in this workflow — 3x `prompts.md` duplicates were created before the pattern was established.
- **Google Drive tokens expire.** Re-auth with `setup.py --auth-url` then `--auth-code <code>`. Token at `~/.hermes/google_token.json`. The token can expire mid-session; if `drive download` returns a 403 "invalid_grant" error, re-auth immediately.
- **ChatGPT may create Google Docs instead of markdown.** If `drive download` returns a PDF, the file is a Google Doc. Use PyMuPDF to extract text. Always prefer regular `.md` files (text/markdown). Filip explicitly said "ik wil wel degelijk met markdown en niet google docs werken" — communicate this requirement to ChatGPT if it defaults to Google Docs.
- **ChatGPT needs explicit skill references.** Every prompt MUST include `**Skill:** skills/<name>.md`. Without this, ChatGPT has no context about the project rules, character names, or output format.
- **Geen scène-ideeën in skill files voor creatieve projecten.** Filip corrigeerde dit: "Je mag de ideeën verwijderen want ik wil liefst niet dat hij al beïnvloed is." Pre-filled lijsten van scène-ideeën beïnvloeden ChatGPT's creatieve keuzes. Hermes kan specifieke ideeën in individuele prompts geven als de gebruiker er om vraagt, maar de skill file zelf moet neutraal blijven en ChatGPT vrij laten.
- **Review ChatGPT output critically.** Check whisper transcription errors (Narrow→Narro, Lauren→Loran, Paginas→Pegasus), spoilers, and quote accuracy before integrating. The user expects critical review, not blind acceptance. Filip said "je mag trouwens kritisch zijn" — this is a standing instruction.
- **Vision review via agy:** `agy --print` is unreliable — it ignores prompts and returns generic model info (confirmed this session). Use `script -qc "agy --model 'Claude Sonnet 4.6 (Thinking)' ..." /dev/null` to allocate a PTY, or use `delegate_task` to spawn a Claude subagent with vision. For large image review batches (20+ images), `delegate_task` may time out at 10min — split into smaller batches or use the GDrive→ChatGPT review pattern instead.
- **Cron job delivery to WebUI.** Cron jobs with `deliver: "origin"` to a WebUI session may show `last_delivery_error: "unknown platform 'webui'"`. The job still runs and processes files correctly. Use `deliver: "local"` if you only need processing without notification delivery.

## Wiki Review Pattern (delegate_task with Claude)

For quality review of wiki content against source transcripts, use `delegate_task` to spawn a Claude subagent. This is the reliable alternative to agy (which fails on TTY and --print):

1. **Text-only review** (comparing summaries to transcript): Works reliably. Claude reads both files and produces a structured report in ~3-5 minutes.
2. **Image review** (checking portraits against descriptions): Works but 23 images caused a 10-minute timeout. Split into batches of ~8 images, or route through ChatGPT vision via the Drive bridge.
3. **Report format**: Ask Claude for verdicts (CORRECT/INCORRECT/UNSURE) per item with reasons. Do NOT ask Claude to make changes — only produce a report. Hermes applies corrections locally.
4. **After review**: Apply corrections (e.g., swap mixed-up images locally, fix name errors in wiki pages, update metadata headers), rebuild the VitePress site.

Key corrections found via review in this session:
- "Oikos" → "Tiros" (Dancer's colony name from transcript — "Oikos" was a wrong assumption, transcriptie says "Tiros" at regel 2170)
- Mother/Barlow portraits were swapped (man shown for mother, woman for barlow — swapped locally)
- "Pints" typo → "Pinks" in colors.md
- Missing colors: White, Blue, Brown, Bronze (all mentioned in H10 transcriptie)
- Julian and Cassius are twins, not just brothers (transcriptie: "brothers, twins, not identical")
- Metadata headers not updated after adding new chapters (summary/characters/world all said H1-19 when content was H1-24)
- **Darrow's hair after Carving is GOLD, not red.** Transcriptie is ondubbelzinnig: "the golden hair" (r.3204), "my golden hair wild" (r.7249). The portrait showed roest-rood haar which is wrong for post-Carving Darrow. Always verify appearance details from the transcript, not from assumptions or pre-Carving descriptions.

## COLLABORATE-SKILL.MD — General Protocol

A `collaborate-skill.md` exists in `gptprompts/skills/` defining the general Hermes↔ChatGPT collaboration protocol. Every prompt should reference BOTH the collaborate-skill and the project-specific skill:

```markdown
**Skills:** skills/collaborate-skill.md, skills/<slug>-skill.md
```

The collaborate-skill defines: workflow steps, file rules (use IDs, update in-place), command formats, image rules, and how to add new projects. Project-specific skills define: project context, what we already have, character names, output format.

## PROJECTS.JSON — Project Index

`projects.json` in the gptprompts folder tracks all projects. No `current` property — the project is specified in each prompt via `**Project:** <slug>`:

```json
{
  "projects": {
    "red-rising": {
      "slug": "red-rising",
      "drive_folder": "1BkS6rql7fRtbHOMnkou1A5hi0qBd6AFT",
      "skill_file": "skills/red-rising-skill.md",
      "transcript": "red_rising.md",
      "description": "Red Rising wiki",
      "status": "in_progress",
      "last_chapter": 24,
      "local_wiki": "~/projects/red-rising-wiki/"
    },
    "family-drawings": {
      "slug": "family-drawings",
      "drive_folder": "1AtHJXCFkATBiH8TmBWmrtva_oaG1ZW4T",
      "skill_file": "skills/family-drawings-skill.md",
      "transcript": "",
      "description": "Familie-tekeningen op basis van basis-karaktertekeningen",
      "status": "in_progress",
      "last_chapter": 0,
      "local_wiki": "~/projects/stephen-fry-audio/family-drawings/"
    }
  }
}
```

Projects kunnen verschillende types zijn: `audiobook-wiki` (transcriptie → samenvattingen + personages + wereld + beelden), `book-analysis`, `document-processing`, of `image-generation` (referentie-afbeeldingen → gegenereerde scènes). Image-generation projects hebben lege `transcript` en `last_chapter` blijft 0. Gebruik de `init-drive-project` skill om nieuwe projects aan te maken.

When sending a prompt: include `**Project:** <slug>` so ChatGPT knows which project to work on. ChatGPT reads projects.json, finds the project, reads the skill_file for full context. `last_chapter` tracks progress. Update it after processing.

To start a new project: add a new entry to projects.json, create a skill file in `skills/`, upload the transcript to a Drive folder, and write a prompt with `**Project:** <new-slug>`.

## PROJECT QUEUE PATTERN (protocol v2, 2026-09-08)

Verbeterd na review door ChatGPT zelf: drivers gebruiken `**Command:** PROCESS_NEXT_WORK_ITEM`; selectie gebeurt op **Status**, niet op type (BATCH én REPAIR zijn beide werk); queue pas klaar als geen enkel item pending/open is; REPAIR-items hebben verplicht `**Type:** REPAIR` + `**Targets:** <doelobjecten>`; self-heal herstelt drivers IN-PLACE (nooit duplicaat-ID's); lege queue = niets doen deze poll, NOOIT de poller afsluiten (ChatGPT schakelde zijn hourly job ten onrechte uit bij een lege prompts.md). Driver wordt pas answered als alle queue-items terminaal zijn.

Filip: "niet beter om alle prompts los van scheduler in 1 keer op te laden naar project. Misschien moet in hoofdprompt enkel staan: verwerk volgende prompt in project x tot klaar. Chatgpt heeft nu opdracht om elk uur 3 prompts af te werken. Dus potentieel projecten tegelijk."

**Architectuur:**
- Per project een `queue.md` in de projectfolder op Drive met ALLE resterende batches (elk `## BATCH-NNN` met `**Status:** pending` → ChatGPT markeert `answered`).
- Eén driver-prompt per actief project in canonieke prompts.md: "Lees queue.md in de projectfolder, verwerk de eerste pending batch volgens de skill, markeer answered, herhaal binnen je promptbudget (3/uur) tot de queue leeg is."
- Meerdere projecten parallel: ChatGPT werkt 3 prompts/uur af, dus meerdere drivers = meerdere projecten tegelijk.
- **prompts.md is vluchtig**: ChatGPT veegt het periodiek leeg (geconstateerd 2026-09-06: canoniek bestand = 1 byte). Daarom is de queue per project de source of truth, en de driver-prompt slechts een herstelbaar postvak. Nooit de volledige batch-lijst in prompts.md zetten.
- **Self-heal** (door de wiki-builder-sync cron): als queue.md pending batches bevat maar geen pending driver in prompts.md → driver opnieuw toevoegen (in-place files().update). Herstel ook na leegvegen.
- Lokale registry met alle Drive-ID's, paden, poorten en voortgang: `~/projects/wiki-scheduler/registry.json`. Cron job `wiki-builder-sync` (elk uur, Telegram) integreert nieuwe chapter files + beelden kritisch in de lokale wiki, rebuild, verify 200, rapport; [SILENT] als niets nieuws.
- Red Rising staat op hold (sep 2026) — niet verwerken; oude red-rising-wiki-sync cron is gepauzeerd.

**Batch-prompt formaat in queue.md:**
```markdown
## BATCH-001 — transcriptiehoofdstukken 16-20
**Status:** pending
**Request:** Verwerk transcriptiehoofdstukken 16 t/m 20 volgens het protocol.
```

## PROCESS_NEXT_CHAPTERS(N) Command

Hermes can write `PROCESS_NEXT_CHAPTERS(N) #SEE Skills` as a prompt. ChatGPT reads the skill file for the full protocol. N = number of chapters to process. For each chapter:
1. Summary (chapter_NN.md)
2. New character portraits (char_<name>.png)
3. Scene images (scene_chNN_a.png)
4. Update outputs.md and scene_index.md

This is a shorthand command — the skill file on Drive contains the full instructions.

- Google Drive tokens expire; re-auth with `setup.py --auth-url` then `--auth-code <code>` if needed.
- Always check `conflicts.md` after sending prompts.
- Keep prompts clear and self-contained — ChatGPT has no context from our session.
- Always reference the skill file in every prompt so ChatGPT knows where to find context.
- When ChatGPT outputs files, download them, update the local wiki, and rebuild the site.
- **Filip prefers real markdown files, NOT Google Docs.** Early in the workflow, ChatGPT created Google Docs for `.md` files which broke text extraction. All files should be `text/markdown` MIME type. If ChatGPT creates Google Docs, ask it to recreate them as regular markdown uploads.
- **Drive creates duplicates on upload.** `drive upload` always creates a new file — it does not overwrite by name. This caused 3x `prompts.md` and 2x `outputs.md` duplicates. Always use File IDs from `manifest.md` and never upload a new file when one already exists. ChatGPT maintains `manifest.md` with canonical IDs.
- **Automated wiki sync via cron.** A cron job can poll the outputs/ folder every 10 minutes (during active work) or hourly (for steady-state), download new chapter files, append them to the local wiki `summary.md`, update `world.md` / `characters.md`, and rebuild the VitePress site. Use `enabled_toolsets: ["file", "terminal"]` and set `workdir` to the docs directory.
- **Cron delivery pitfall.** Cron jobs with deliver "origin" to a WebUI session may show last_delivery_error "unknown platform webui". The job still runs and processes files, but the delivery notification fails. Use deliver "local" if you only need processing without notification.
- **ChatGPT organizes outputs into project-specific subfolders.** When ChatGPT processes a prompt for a project, it may create a subfolder inside the project's Drive folder (e.g. `three-body-problem/outputs/`) and place chapter files, character portraits, scene images, and index files there — NOT in the shared `gptprompts/outputs/` folder. To list and download these files, use the Drive API to query children of the project folder ID, then recursively list the `outputs/` subfolder. The shared `outputs/` folder ID from manifest.md (`1pF1c8Yfas4NkevugjN3BqDpszR2HLLgU`) is for older projects (red-rising, family-drawings); newer projects may use their own subfolder.
- **Image download workflow for wiki integration.** After ChatGPT generates chapter summaries with images, download all assets and integrate into the local wiki — do NOT skip this step and present text-only pages. The user explicitly corrected this: "Geen sfeerbeelden ook en geen images? Chatgpt hafe die normaal klaar". Steps:
  1. List files in the project's `outputs/` Drive subfolder using `service.files().list(q="'<folder_id>' in parents and trashed=false")`
  2. Download each PNG/MD file via `service.files().get_media(fileId=...)`
  3. Save scene images to `images/scenes/` and character portraits to `images/characters/` in the local wiki project
  4. Embed in chapter pages: scene at top (`![Sfeerbeeld](./images/scenes/scene_chNN_a.png)`), portraits under character headings
  5. Add portraits to the main `personages.md` page
  6. Rebuild VitePress and copy loose images to dist (`cp -r images .vitepress/dist/`)
- **Character portrait generation pattern.** When asking ChatGPT to generate character images: (a) group characters logically (by faction/location), (b) specify exact filenames like `char_<name>.png`, (c) include visual details from the transcript (hair, eyes, scars, clothing), (d) ask ChatGPT to search the transcript for descriptions, (e) reference existing wiki images as style guide. After download, embed in `characters.md` using a Python script to insert `![Name](./images/characters/char_name.png)` after each `### Name` header.
- **Scene image prompt pattern.** When asking for a scene image: (a) quote the exact passage from the transcript, (b) ask ChatGPT to download existing character portraits from Drive as face references, (c) specify 16:9 landscape, (d) describe the emotional beat and visual contrast.
- **Per-chapter scene image pattern.** For bulk scene generation (1-2 images per chapter): (a) provide a suggested key moment per chapter, (b) use filenames like `scene_chNN_a.png`, (c) ask for a `scene_index.md` with a table linking each image to its chapter and description, (d) skip chapters that already have images.
- **Portrait review via ChatGPT.** When local model lacks vision: (a) write a review prompt with a table of expected appearance per character, (b) ChatGPT reviews each portrait and writes verdicts to `outputs/portrait_review.md`, (c) fix incorrect images locally (swap if mixed up) or request replacements via a new prompt.
- **Holding and resuming prompts.** To pause a long-running prompt (e.g. chapter summaries), change its `**Status:**` to `on hold` in prompts.md. To resume, change back to `pending`. ChatGPT respects the status field.
- **Duplicate Personages section in summary.md.** Older versions of summary.md had a full `## Personages` section at the end with text-only character descriptions — duplicating characters.md (which has portraits). This was removed and all 97 inline `[#Darrow](#darrow)` links were rewritten to `[**Darrow**](./characters#darrow)` using a Python regex script. When adding chapters, do NOT recreate a Personages section in summary.md — link to characters.md instead.
- **Standalone VitePress site.** The Red Rising wiki lives at `~/projects/red-rising-wiki/` with `base: '/red-rising/'` and is served on port 5180 via Tailscale `--set-path /red-rising/`. The documentation hub at `~/documentation/` (port 5173, `/docs/`) is a separate site. When updating wiki content, update the standalone site and rebuild it separately. See the `vitepress-tailscale-serve` skill for the standalone site pattern.
- **Auto-push is standard.** Filip explicitly said "mag je vanaf nu trouwens automatisch doen" — git commit and push after wiki updates without asking permission.