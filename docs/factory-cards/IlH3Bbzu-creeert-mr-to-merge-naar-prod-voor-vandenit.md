# Creëert mr to merge naar prod voor vandenit

- **Trello-kaart:** https://trello.com/c/IlH3Bbzu/49-cre%C3%ABert-mr-to-merge-naar-prod-voor-vandenit
- **Lijst:** To Refine
- **Labels:** vandenit-website
- **task_id:** VANDENIT-PROD-RELEASE-MR
- **change_class:** deploy

## Volledige analyse (origineel)

task_id: VANDENIT-PROD-RELEASE-MR
change_class: deploy
origin: Filip wil voor vandenit-website een Pull Request (MR/PR) op GitHub (`vandenit/vandenit-website`) die de gevalideerde `main`-branch samenvoegt naar de beschermde `production`-releasebranch (waarop de live productie-deploy van https://vandenit.be triggert), zodra de lopende vandenit-website-taken voor Dependabot-opschoning (`b0j3rmgX`) en het verwijderen van de interne Nederlandse `.md`-reviews uit de project-root (`8RuHyf2C`) volledig zijn afgerond en BAT-geaccepteerd.

## Acceptatiecriteria
AC-1: Pre-release verificatie van `origin/main` t.o.v. `origin/production` slaagt: na `git fetch origin main production` geldt dat `origin/main` commits vóór ligt op `origin/production` (`git rev-list --count origin/production..origin/main > 0`), een merge van `origin/main` in `origin/production` conflictvrij is, er géén interne Nederlandse review-`.md`-bestanden meer in de project-root van `origin/main` staan, en de productie-build (`pnpm run build`) plus de bevroren sensors slagen. — Bewijs: `./verify fast` PASS, `./verify full` PASS (elke step PASS incl. productie-build) en pre-release rapportage in `.factory/evidence/prod-release-pr.json` (`commits_ahead > 0`, `conflict_free: true`, `stray_root_review_mds: []`).
AC-2: Op `vandenit/vandenit-website` staat een `OPEN` GitHub Pull Request met `baseRefName: "production"` en `headRefName: "main"` (idempotent aangemaakt via `gh pr create --repo vandenit/vandenit-website --base production --head main` vóór de blinde Argon-review, of bijgewerkt via `gh pr edit` als er al een open PR voor `main → production` bestaat — nooit een duplicaat). De PR heeft een Engelstalige titel (`Release: merge main into production`) en een Engelstalige beschrijving met: (a) het commit- en wijzigingsoverzicht van `origin/production..origin/main`, (b) de verificatiestatus (`./verify fast`, `./verify full`, `pnpm run build`, L3-M browsertest), en (c) de toelichting dat mergen naar `production` de live productie-deploy naar https://vandenit.be uitrolt. — Bewijs: `gh pr view <prod-pr-nummer> --repo vandenit/vandenit-website --json number,url,state,baseRefName,headRefName,title,body` vastgelegd in `.factory/evidence/prod-release-pr.json` met `state == "OPEN"`, `baseRefName == "production"` en `headRefName == "main"`.
AC-3: De productie-release-PR (`main → production`) wordt NIET door de worker gemerged (`state` blijft `"OPEN"`, `mergedAt` blijft `null`), zodat Filip zelf de uiteindelijke productie-release naar https://vandenit.be vrijgeeft; alléén de eigen taak-PR (`VANDENIT-PROD-RELEASE-MR → main`) wordt bij groene sensors volgens het v14 auto-merge-beleid naar `main` gemerged (waardoor `main` als head-branch van de open productie-release-PR automatisch ook de gecommitte BAT-testguide en het md-archief meeneemt). — Bewijs: `.factory/evidence/prod-release-pr.json` én `gh pr view <prod-pr-nummer> --repo vandenit/vandenit-website --json state,mergedAt` tonen `state: "OPEN"` en `mergedAt: null`.
AC-4: In de worktree is `docs/bat-guides/VANDENIT-PROD-RELEASE-MR.md` gecommit met het exacte PR-nummer en de volledige GitHub-URL van de open `main → production` release-PR, een samenvatting van de meegeleverde `origin/production..origin/main`-wijzigingen, genummerde manuele teststappen op de BAT-deploy (`https://ubuntu-2204-jammy-amd64-base.tail6a7a90.ts.net:3011`) en op de GitHub-PR diff, plus de BAT-verdict-instructies (`BAT OK` / `BAT: <bevindingen>`). De guide is uitgevoerd met een aparte agy L3-M browsertest zonder blokkerende bevindingen. — Bewijs: `docs/bat-guides/VANDENIT-PROD-RELEASE-MR.md` in de git-diff, L3-M findings-JSON (`passed: true`) in `.factory/evidence/`, en de comment `📄 BAT-testguide: https://github.com/vandenit/vandenit-website/blob/main/docs/bat-guides/VANDENIT-PROD-RELEASE-MR.md` op de Trello-kaart.
AC-5: Op de Trello-kaart zijn zowel de open productie-release-PR (`main → production`) als de taak-PR (`VANDENIT-PROD-RELEASE-MR → main`) gedocumenteerd, waarbij de gemergde taak-PR URL (`https://github.com/vandenit/vandenit-website/pull/<taak-pr-nummer>`) de **laatste** `https://github.com/vandenit/vandenit-website/pull/<n>`-URL in de Trello-kaartcomments is, zodat `find_last_pr_url` van `factory_trello.py sync-merged` de gemergde taak-PR leest en de kaart direct naar `BAT` verplaatst zonder op de nog open `main → production` PR te blijven steken. — Bewijs: inspectie van de kaartcomments via `factory_trello.py context IlH3Bbzu --json` bevestigt dat zowel de open `main → production` PR als de gemergde taak-PR vermeld staan en dat de allerlaatste `/pull/<n>`-URL in de comments de taak-PR (`VANDENIT-PROD-RELEASE-MR → main`) is.

## WIREFRAMES
geen UI-werk — n.v.t.

## Sensor-aanpassingen
geen

## Constraints
- i18n-antipatronen verboden: geen hardcoded taal-literalen, alle zichtbare tekst via het i18n-systeem
- e2e-tests selecteren via data-testid, nooit via gebruikerstaal
- factory-contract: spec → worktree → bevroren verify → blinde Argon → PR → Filip merged
- Raak `./verify` en `.factory/` (buiten `.factory/spec.json` en het gitignored `.factory/evidence/`) nooit aan.
- Merge of push NOOIT naar `production` (`origin/production`): deze taak creëert (of werkt idempotent bij) uitsluitend de Pull Request `base: production` ← `head: main` en laat die `OPEN` voor Filip.
- Maak (of update) de `main → production` PR al vóór stap 5 (de blinde Argon-review) en leg de output van `gh pr view` vast in `.factory/evidence/prod-release-pr.json` én in `docs/bat-guides/VANDENIT-PROD-RELEASE-MR.md`, zodat de blinde Argon-reviewer het bestaan en de metadata van de open productie-release-PR direct kan verifiëren.
- Gebruik Engels voor de titel en beschrijving van de GitHub PR's (`vandenit/vandenit-website` is een publieke repository).
- Zorg bij de v14 auto-merge van de taak-PR (`VANDENIT-PROD-RELEASE-MR → main`) dat in de Trello-comments de URL van de gemergde taak-PR als **laatste** `https://github.com/vandenit/vandenit-website/pull/<n>`-link voorkomt (noem in de `🤖 AUTO-MERGED`-comment eerst de open productie-release-PR `main → production` en sluit de URL-vermeldingen af met de gemergde taak-PR URL), zodat `sync-merged` de kaart naar `BAT` verplaatst en geen orphan-redispatch veroorzaakt.

## CONTEXT VOOR PICKUP
- `/home/filip/projects/vandenit-website/.github/workflows/dev-workflow.yml` — de productie-deploy-workflow: triggert uitsluitend op pushes/merged PRs naar de protected `production`-branch.
- `/home/filip/projects/vandenit-website/package.json` — build- en verificatiescripts (`pnpm run build`).
- `/home/filip/projects/vandenit-website/docs/bat-guides/NEXT16-CONTENT-PIPELINE.md` — bestaande BAT-gids als structuur-conventie voor `docs/bat-guides/<TASK-ID>.md`. (Deze repo heeft géén `docs/REVIEWER-CONTRACT.md`; de blinde-review-eisen volgen uit de factory-contracten.)
- `/home/filip/projects/vandenit-website/docs/bat-guides/` — locatie en conventies voor de manuele BAT-testguide (`docs/bat-guides/VANDENIT-PROD-RELEASE-MR.md`).
- `/home/filip/projects/vandenit-website/docs/factory-cards/` — md-archiefmap waarin de geëxporteerde kaartspec (`IlH3Bbzu-*.md`) woont en mee-gecommit wordt.
- `/home/filip/projects/factory-trello/scripts/deploy_vandenit.sh` — documenteert het release-line contract (`main` draait op BAT-poort 3511/3011; live productie https://vandenit.be deployt uitsluitend via merges van `main` naar `production`).
- `/home/filip/projects/factory-trello/WORKER_INSTRUCTION.md` — het volledige worker-protocol inclusief stap 4b (BAT-testguide + L3-M) en stap 6 (v14 auto-merge van de taak-PR + `find_last_pr_url`-gedrag van `sync-merged`).

blocked_by: [6aebc6718ae3aa1e6d2ca228, 6aec2b568d9226a47555ba08]
