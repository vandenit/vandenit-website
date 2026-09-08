---
description: 'Use when building audiobook wikis via the ChatGPT pipeline.'
name: wiki-builder
tags: [wiki, chatgpt, drive, vitepress, audiobooks, pipeline]
---

# Wiki Builder — Audiobook-wiki pipeline (Hermes ↔ ChatGPT via Drive)

Use when: adding a new audiobook-wiki project, checking pipeline progress, integrating ChatGPT chapter output, troubleshooting the sync cron, or preparing new book sources. Also use when the user asks about the state of any wiki (remembrance, hitchhikers, red-rising).

## Componenten

1. **Lokale registry (source of truth voor state):** `~/projects/wiki-scheduler/registry.json` — Drive-ID's, paden, poorten, systemd units, git remotes, integrated_chapters per boek, driver-prompt-ID per boek.
2. **Drive (per project):** `<project>/queue.md` met ALLE resterende batches (`**Status:** pending` → ChatGPT markeert `answered`), transcriptie in de projectfolder, output in `<project>/outputs/`.
3. **prompts.md (canoniek ID 1RVrCIrJLQSByBeiv4-kQW-UPw1S285YW):** alleen driver-prompts (één per boek): "verwerk eerste pending batch uit queue.md, markeer answered, herhaal binnen promptbudget (3/uur) tot leeg". prompts.md is vluchtig — ChatGPT veegt het periodiek leeg; de queues zijn de source of truth.
4. **Cron `wiki-builder-sync` (7203ff68d242, elk uur, Telegram 8884689161):** diff → integratie → rebuild → verify → self-heal drivers → commit/push → rapport ([SILENT] zonder nieuws).

## Waarom queue-patroon (beslissing Filip 2026-09-06)

Alle batch-prompts staan vooraf in de project-queue; de hoofdprompt zegt alleen "verwerk volgende pending batch tot klaar". ChatGPT werkt 3 prompts/uur af → meerdere boeken parallel. Geen handmatige prompt-acties meer; maximale throughput zonder kwaliteitsverlies (kritische review blijft in de cron-integratiestap).

## Nieuw project/boek toevoegen

1. **Bron**: check eerst bestaande EPUB-MD's (`~/documentation/books/`, `~/documentation/books/drm-free-conversions/`) vóór whisper-transcriptie. EPUB-tekst = betere bron (geen verhaspelde namen). Whisper alleen als geen EPUB bestaat (skill: audio-transcription; achtergrond-daemon + monitor-cron).
2. **Chapterizeer**: splits in hoofdstukbestanden met `## Chapter N: Titel`-koppen. EPUB: gebruik `contents.xhtml#c_chN` / `[]{#chapterN.xhtml}` anchors (DE: 74 hoofdstukken). Boeken zonder hoofdstukankers: splits op scènegrenzen (DF: 7 mega-hoofdstukken → 15 segmenten, max ~150K chars/segment; grote segmenten kwarten op paragraafgrenzen).
3. **Drive**: maak subfolder + outputs-folder in de projectfolder, upload transcriptie, schrijf queue.md met batches van 5 hoofdstukken, voeg boek-sectie toe aan de projectspecifieke skill file (file-naamconventies: `chapter_<prefix>NN.md`, `scene_<prefix>chNN_a.png`), update projects.json (ID 1oKve_iHqNwew4YYMxSfs_JOXN1b6D2ff), zet driver-prompt in prompts.md.
4. **Registry**: entry in `~/projects/wiki-scheduler/registry.json` (books-sectie met drive-ID's, patterns, driver-ID).
5. **Lokale wiki**: index-pagina placeholder (indien nieuw), sidebar-sectie in `.vitepress/config.mts`.
6. **Git**: elk nieuw project = git init + `.gitignore` (node_modules, .vitepress/dist, cache) + `gh repo create <naam> --private --source . --push` (standaard sinds 2026-09-06, alle wiki-repo's: github.com/Filipvdb321/*).
7. **Server**: systemd user unit (poort, `Restart=always`, zie vitepress-tailscale-serve skill) + Tailscale `--set-path` + cron-prompt uitbreiden met het boek (pattern + output-folder + driver-ID).

## Integratiepatroon per hoofdstuk (cron)

Download `chapter_<prefix>NN.md` → kritische review (naamcorrecties uit skill-tabel; geen spoilers; citaten) → lokale pagina (naam via chapter_pattern uit registry, b.v. `chapter-df-NN.md`): titel, `![Sfeerbeeld](./images/scenes/<scene_prefix>NN_a.png)` bovenaan, secties Samenvatting / Nieuwe Personages (portret embedded) / Nieuwe Concepten / Belangrijke Citaten; Drive-links uit `## Beeldmateriaal` NIET overnemen → beelden naar `images/characters|scenes/` → index-pagina + personages + concepten/wereld + sidebar bijwerken → `npx vitepress build && cd .vitepress/dist && ln -s . <base-naam>` → curl 200-check → registry update → git commit+push.

## Self-heal drivers

Als queue.md pending batches heeft maar de driver (ID in registry) niet pending in prompts.md staat (of prompts.md is leeggeveegd): herstel de driver in-place (files().update met canonical ID). Format: zie PROMPT-20260906-010 t/m 013 in prompts.md (Skills: collaborate-skill + projectspecifieke skill; Project: <slug>; Request: verwerk eerste pending batch uit queue.md van <folder-ID>, outputfolder <ID>, herhaal binnen promptbudget tot leeg).

## Protocol v2 (8 sep, na review ChatGPT) — PROCESS_NEXT_WORK_ITEM

- **Selectie op status, niet op type**: BATCH- en REPAIR-items zijn beide uitvoerbaar werk. Queue is pas klaar als geen enkel item pending/open is; driver pas answered als alles terminaal is (answered/completed/conflict).
- **Lege queue = deze poll doet niets** — nooit de poller/drivers zelf afsluiten (ChatGPT had dat fout gedaan en zijn hourly job uitgezet).
- **REPAIR-items**: verplicht `**Type:** REPAIR` + `**Targets:**` (expliciete doelobjecten, b.v. `book1/scene_ch19`) — lost subproject-ambiguïteit op. Namen NIET hernoemen naar BATCH-NNN: de semantiek (herstel van eerder werk) is waardevol voor debugging.
- **Self-heal herstelt IN-PLACE**: nooit een tweede driver met zelfde ID/project-subproject creëren; de canonieke driver bestaat en wordt via files().update bijgewerkt.
- **Progress-velden zijn samenvatting, niet waarheid**: de queue zelf is source of truth.
- **Cron-diff moet in-place vervangingen zien**: vergelijk Drive modifiedTime met lokale mtime — anders worden REPAIR-vervangingen nooit opgepikt.
- **Review-les (Zaphod)**: vermeende fout altijd 2x onafhankelijk meten (eerst beschrijven, dan oordelen) vóór filen; eerste Zaphod-claim was vals alarm.

## Visuele/content-review-loop (agy/Claude, sinds 2026-09-08)

De hourly cron reviewt ná integratie ook de beelden met agy vision: `timeout 280 script -qc "agy --model 'Claude Sonnet 4.6 (Thinking)' --dangerously-skip-permissions --print '<prompt>'" /dev/null`. Werkt betrouwbaar (getest: Marvin correct als robot, Arthur consistent over portret+scène, Zaphod derde-arm gevonden). Zonder skip-permissions faalt read_file op images — allow-rule in settings.json werd niet gevonden; skip is de workaround.

- Review-state: `~/projects/wiki-scheduler/review-state.json` (last_reviewed_chapter + reviewed_images per project), log: `review-log.md`.
- Eén project per cron-run, max ~8 beelden per agy-call (anders timeout).
- Milderingsregel (Filip): NIET streng zijn — alleen DUIDELIJKE mismatches (verkeerd geslacht/haarkleur, ontbrekende iconische kenmerken zoals 2 hoofden/3 armen, ander gezicht dan canoniek portret). Stijlvariaties zijn oké; content is recreatief. LAGE-ernst alleen loggen.
- DUIDELIJKE mismatches → REPAIR-batch in de queue (protocol in collaborate-skill: in-place vervanging, zelfde bestandsnaam/Drive-ID, zelfde stijl/pose als referentie; geen nieuwe hoofdstukken genereren). Tekstfouten uit review → ook REPAIR-batch.
- REPAIR-batches doorlopen dezelfde cyclus (pending → processing → answered met Started/Finished/Attempt) en dezelfde driver haalt ze op; driver wordt pas answered als queue volledig leeg is.
- Eerste catch: REPAIR-001 Zaphod Beeblebrox miste derde arm (2 hoofden wél correct).

## Status september 2026

- three-body-problem: COMPLEET — 48/48 (6 sep). dark-forest: 15/15 COMPLEET (8 sep). deaths-end: batches 13/15 verwerkt, einde in zicht. hitchhikers book1: 35/35 COMPLEET; book2: ~30/34. Red Rising: hold.
- Remembrance-boeken 1→2→3: pipeline mag parallel produceren — wiki-pagina's zijn per boek geïsoleerd; progressiviteit geldt per boek.

## Golden rules

- File-ID's, nooit namen; in-place updates via files().update (nooit drive upload op bestaand bestand).
- Kritisch lezen van ChatGPT-output blijft verplicht (naamcorrecties, spoilers, citaten).
- Per-hoofdstukpagina's, nooit één groot samenvattingsbestand (correctie Filip).
- Beelden verplicht: sfeerbeeld per hoofdstuk + portret per nieuw personage; portretten ALTIJD als identity-references voor sfeerbeelden (bestaande canon eerst checken).
- Progressief bouwen per boek: geen spoilers uit later hoofdstuk/externe kennis.
- Nederlands voor wiki-content, Engels voor citaten.
