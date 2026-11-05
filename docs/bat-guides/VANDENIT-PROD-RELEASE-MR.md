# BAT-testguide — VANDENIT-PROD-RELEASE-MR

- Kaart: https://trello.com/c/IlH3Bbzu/49-cre%C3%ABert-mr-to-merge-naar-prod-voor-vandenit
- Taak-PR: volgt
- Release-PR (main → production): **PR #43** — https://github.com/vandenit/vandenit-website/pull/43 (state OPEN — deze PR merget Filip zelf; één klik = live release van https://vandenit.be)
- Change class: deploy
- Wat deze kaart levert: de idempotent aangemaakte **release-PR #43** van gevalideerde `main` (546f2b7) naar de beschermde `production`-branch (a7284cc; strikte ancestor → conflictvrije fast-forward), ENGELS getiteld en bebody'd, met verificatiestatus; daarnaast de eigen docs-only taak-PR (deze guide + de kaart-md en `docs/factory-cards/`). De release-PR blijft bewust OPEN voor Filip (AC-3): de worker merge/pusht nooit naar `production`.

## Change-overzicht `origin/production..origin/main` (in PR #43)

11 commits, 50 bestanden, +4.658 / −24.035: T0 verify-fundament (`./verify fast|full`), Next.js 16 + React 19 + fs/gray-matter build-time content pipeline (Contentlayer weg, #39), release-line-migratie (deploy-trigger verhuist van `main` naar `production`, #40), Dependabot/audit-consolidatie 24 pnpm.overrides + postcss 8.5.23 (#41), verwijdering van de drie interne Nederlandse review-.md's uit de root (#42; root = alleen `README.md`).

## Browser-zichtbaarheid (eerlijk)

Deze taak raakt geen app-code, content of assets. Op de BAT-deploy is dus niets NIEUW zichtbaar — de BAT-test is een regressie-sanity-check van de draaiende productie-build plus een GitHub-verificatie van PR #43. De echte UI-verificatie volgt ná Filip's merge van #43 op de live site (appendix hieronder). Repo/PR-hygiëne (PR-metadata, diff) is een git/GitHub-verificatie, geen browser-verificatie.

## Live teststappen (BAT-deploy: productie-build op main)

1. Open `https://ubuntu-2204-jammy-amd64-base.tail6a7a90.ts.net:3011/` — verwachting: HTTP 200; homepage rendert met `Filip Van den Broeck`-branding, geen 404, geen lege secties.
2. Open `/posts` — verwachting: HTTP 200; de bloglijst toont de bekende posts (o.a. de dark-factory draft, OpenLingo-referenties), ongewijzigd.
3. Open `/about` en `/how-i-work` — verwachting: HTTP 200 met de bekende inhoud.
4. Open `/skills/wiki-generator/README` — verwachting: HTTP 200; de README-render-route werkt nog.
5. Console-check op stap 1-4 — verwachting: 0 console-errors.

## Release-PR-verificatie (GitHub, in PR #43)

6. Open https://github.com/vandenit/vandenit-website/pull/43 — verwachting: state **Open**, tabblad met 11+ commits (11 vóór de taak-PR; de taak-PR voegt daarna nog docs-commits op main toe die automatisch meeliften); base `production` ← head `main`.
7. PR-body — verwachting: Engelse titel `Release: merge main into production`; Engelse body met het change-overzicht (`origin/production..origin/main`), de verificatiestatus (`./verify fast` PASS fast-20261105-093150, `./verify full` PASS alle stappen PASS full-20261105-093215 incl. `pnpm run build`, L3-M browsertest) en de vermelding dat mergen de live deploy van https://vandenit.be triggert.
8. Diff-tabblad in combinatie met `git log --oneline origin/production..origin/main` — verwachting: overeenkomstige commits; diffs raken géén app-runtime-code buiten de documenteerd geleverde pipeline/release-line/verify-gecommits (die staan al BAT-geaccepteerd op main).

Git-verifieerbaar (niet-browser): `git merge-base origin/production origin/main` == `origin/production` head (a7284cc) — strikte ancestor, dus merge = conflictvrije fast-forward; `git ls-tree --name-only origin/main` toont in de root uitsluitend `README.md` (geen interne NL-review-.md's); `gh pr view 43 --json state,baseRefName,headRefName,mergedAt` → `OPEN` / `production` / `main` / `null`.

## Na de release (pas ná Filip's merge van PR #43 — live https://vandenit.be)

A1. Open https://vandenit.be/ — verwachting: HTTP 200, branding correct; de live deploy draait de nieuwe main (Next 16 pipeline, security-geconsolideerde deps, schone root).
A2. Open https://vandenit.be/posts — verwachting: HTTP 200, de bekende posts.
A3. Console-check op A1-A2 — verwachting: 0 console-errors.

## Fixture-scenario

N.v.t. — er is geen content- of UI-feature die pas later op de live pack zichtbaar wordt; de productie-build toont direct alles wat er te zien is.

## BAT-verdict

- Alle stappen groen (1-8; stappen A1-A3 zijn voor na de release-merge) → antwoord met `BAT OK`.
- Bevindingen → antwoord met `BAT: <bevindingen>` (kaart gaat dan automatisch terug naar Implementation met het werk intact).
