# BAT-testguide — VANDENIT-REMOVE-ROOT-NL-REVIEWS

- Kaart: https://trello.com/c/8RuHyf2C/48-verwijder-de-nederlandse-md-reviews-in-project-root-of-vandenit-website-het-project-is-publiek-en-deze-horen-daar-niet
- PR: volgt
- Change class: content
- Wat deze kaart levert: de drie interne Nederlandse review/positioning-.md's zijn weg uit de project root van de publieke repo (`review-2026-08-22.md`, `review-embedded-positioning-v2.md`, `embedded-ai-positioning-plan.md`); `README.md` blijft het enige .md in de root. Er is géén UI-wijziging: geen pagina, route of component verandert.

## Browser-zichtbaarheid (eerlijk)

Deze taak raakt geen app-code, content of assets. In de browser is dus niets NIEUW zichtbaar — de test is een regressie-sanity-check: de site draait in de productie-build exact als voorheen en de console is netjes. Repo-hygiëne (root-.md's) is een git-verificatie, geen browser-verificatie.

## Live teststappen (BAT-deploy / productie-build)

1. Open `/` — verwachting: HTTP 200, homepage rendert als voorheen (titel/branding incl. `Filip Van den Broeck`), geen 404, geen lege secties.
2. Open `/posts` — verwachting: HTTP 200; de bloglijst toont de 3 bekende posts met auteur Filip Van den Broeck, ongewijzigd.
3. Open `/about` en `/how-i-work` — verwachting: HTTP 200 met de bekende inhoud.
4. Open `/skills/wiki-generator/README` — verwachting: HTTP 200 (de README-render route blijft werken; `README.md` in de root is onaangetast).
5. Console-check op stap 1-4 — verwachting: 0 console-errors.
6. data-testid sanity — verwachting: de smoke-anchors zijn intact; `tests/e2e/` en `playwright.config.ts` zijn in de PR-diff 0-regel-gewijzigd (frozen), de playwright-smoke-step van `./verify full` dekt dit geautomatiseerd.

Repo-zichtbare verificatie (niet-browser, verifieerbaar via de PR): `ls -1 *.md` in de repo-root geeft uitsluitend `README.md`; de PR bevat exact 3 deletions (de drie root-.md's) plus de nieuwe spec en deze guide, zonder referenties naar de verwijderde bestanden (grep = 0 treffers in app/components/content/lib/public/scripts/tests/package.json/README.md).

## Fixture-scenario

N.v.t. — er is geen content- of UI-feature die pas later op de live pack zichtbaar wordt; de productie-build toont direct alles wat er te zien is.

## BAT-verdict

- Alle stappen groen → antwoord met `BAT OK`.
- Bevindingen → antwoord met `BAT: <bevindingen>` (kaart gaat dan automatisch terug naar Implementation met het werk intact).
