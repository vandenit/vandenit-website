# Fix all vanden it website depandabot issues.  Merge them into main or apply same fixes en close dependabot mrs.

- **Trello-kaart:** https://trello.com/c/b0j3rmgX/43-fix-all-vanden-it-website-depandabot-issues-merge-them-into-main-or-apply-same-fixes-en-close-dependabot-mrs
- **Lijst:** To Refine
- **Labels:** vandenit-website
- **task_id:** VANDENIT-DEPENDABOT-CLEANUP
- **change_class:** deps

## Volledige analyse (origineel)

task_id: VANDENIT-DEPENDABOT-CLEANUP
change_class: deps
origin: Filip wil dat alle openstaande Dependabot-issues/alerts en Dependabot-MR's (PR's) in `vandenit/vandenit-website` worden opgelost. Ofwel worden de openstaande Dependabot-PR's gecontroleerd en naar `main` gemerged, ofwel worden dezelfde dependency-fixes geconsolideerd op `main` toegepast waarna de openstaande Dependabot-PR's worden gesloten.

Acceptatiecriteria:
AC-1: Alle openstaande Dependabot-PR's en Dependabot-security-alerts op `vandenit/vandenit-website` zijn geïnventariseerd en per item is gedocumenteerd welke actie is uitgevoerd (gemerged, overgenomen in de geconsolideerde fix-branch, of reeds obsoleet na de Next.js 16-upgrade). Bewijsmechanisme: overzichtstabel in het PR-bewijsrapport op basis van `gh pr list --repo vandenit/vandenit-website --author "app/dependabot" --state open` en `gh api repos/vandenit/vandenit-website/dependabot/alerts` (of package-manager audit).
AC-2: Alle toepasbare dependency-updates en security-patches uit de Dependabot-PR's en security-alerts zijn verwerkt in `package.json` en het lockfile van `/home/filip/projects/vandenit-website`, zonder verwijderde packages uit `NEXT16-CONTENT-PIPELINE` (zoals `contentlayer`) te herintroduceren. Bewijsmechanisme: schone `git diff` op manifest/lockfile en een dependency-audit (`npm audit` / `pnpm audit` / `yarn audit` conform de gebruikte package manager) zonder openstaande fixbare high/critical kwetsbaarheden.
AC-3: De applicatie bouwt en slaagt volledig op de bijgewerkte dependencies zonder regressies. Bewijsmechanisme: `./verify` in `/home/filip/projects/vandenit-website` eindigt met exit-code `0` (inclusief lint, typecheck, unit-/integratietests, production build en e2e-checks).
AC-4: Alle openstaande Dependabot-PR's op `vandenit/vandenit-website` zijn afgehandeld (gemerged of gesloten met een korte toelichting/verwijzing naar de consoliderende commit of PR). Bewijsmechanisme: `gh pr list --repo vandenit/vandenit-website --author "app/dependabot" --state open` retourneert `0` openstaande PR's.

WIREFRAMES:
geen UI-werk — N/A

Sensor-aanpassingen:
geen — ./verify blijft onveranderd

Constraints-blok:
- i18n-antipatronen verboden: geen hardcoded taal-literalen; alle zichtbare tekst via het i18n-systeem.
- e2e-tests selecteren via data-testid, nooit via gebruikerstaal.
- Factory-contract: spec → worktree → bevroren verify → blinde Argon → PR → Filip merged.
- `./verify` is bevroren en mag niet worden aangepast; als een major dependency-bump een sensor-aanpassing vereist, moet de taak escaleren als aparte META-MR.
- Behoud de Next.js 16-setup en de lichte content-pipeline uit `NEXT16-CONTENT-PIPELINE` (`6ae8b3fe95e828957335d9ac`) en de deploy-workflow uit `DEPLOY-PROD-ONLY-ON-MAIN` (`6ae8b01648890299d9982021`).
- Manifest en lockfile moeten strikt synchroon blijven via de standaard package manager van de repo.

CONTEXT VOOR PICKUP:
- `/home/filip/projects/vandenit-website/package.json` en het bijbehorende lockfile (`package-lock.json` / `pnpm-lock.yaml` / `yarn.lock`)
- `/home/filip/projects/vandenit-website/.github/dependabot.yml` en `/home/filip/projects/vandenit-website/.github/workflows/`
- `/home/filip/projects/vandenit-website/verify` (alleen-lezen: bevroren kwaliteitssensor)
- `/home/filip/projects/vandenit-website/REVIEWER-CONTRACT.md`, `/home/filip/projects/vandenit-website/DESIGN.md`, `/home/filip/projects/vandenit-website/README.md` en `/home/filip/projects/vandenit-website/docs/` (voor zover aanwezig in de repo)
- GitHub PR- en alert-status via `gh pr list --repo vandenit/vandenit-website --state open` en `gh api repos/vandenit/vandenit-website/dependabot/alerts`

blocked_by: []
