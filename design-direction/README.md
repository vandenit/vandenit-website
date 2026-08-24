# Vanden IT — Visual Design Direction v1

Dit pakket vertaalt de huidige `vandenit.be` stap voor stap naar een herkenbaardere visuele identiteit: **The Engineer & The System**.

De kern is eenvoudig:

- Filip staat voor context, verantwoordelijkheid, architectuur en het finale oordeel.
- Daniël staat voor parallel onderzoek, automatisering en snelheid.
- Blauw toont systeemactiviteit; amber toont menselijke beslissingen.
- De sciencefictioninvloed zit in ritme, typografie en systeemdiagrammen — niet in robots, planeten of gimmicks.

## Start hier

1. Lees `00-agent-brief.md`. Dit is de autoritatieve opdracht voor de uitvoerende agent.
2. Lees `01-current-site-audit.md` voor het vertrekpunt van 23 augustus 2026.
3. Gebruik `02-design-system.md` samen met `styles/vandenit-theme.css`.
4. Voer `03-implementation-plan.md` fase per fase uit en stop na iedere fase voor review.
5. Controleer iedere fase met `04-performance-accessibility.md`.
6. Gebruik `05-visual-reference-map.md` om de conceptbeelden juist te interpreteren.

## Aanbevolen eerste scope

Begin alleen met:

- globale tokens en lettertypes;
- header, focus states en knoppen;
- homepage hero en proof strip;
- één statische responsive workflowillustratie.

Voeg nog geen animatiebibliotheek, canvasrendering, page transitions of ingewikkelde scrollinteracties toe.

## Bestanden

- `00-agent-brief.md` — copy-paste-opdracht voor de coding agent.
- `01-current-site-audit.md` — sterke punten, hiaten en technische observaties.
- `02-design-system.md` — visuele grammatica en componentregels.
- `03-implementation-plan.md` — gefaseerd stappenplan met acceptatiecriteria.
- `04-performance-accessibility.md` — responsive, motion, performance en QA.
- `05-visual-reference-map.md` — uitleg bij de zes conceptbeelden.
- `styles/vandenit-theme.css` — bruikbare CSS custom properties en basisclasses.
- `assets/daniel-flow-desktop.svg` — lichte statische desktopillustratie.
- `assets/daniel-flow-mobile.svg` — vereenvoudigde verticale mobiele illustratie.
- `assets/engineering-grid.svg` — subtiele herhaalbare achtergrondtextuur.
- `visuals/` — drie desktop- en drie mobiele conceptbeelden.

## Belangrijke grens

De concept-PNG's zijn **geen productie-assets**. Bouw tekst, knoppen, navigatie en layout als HTML/CSS. Gebruik SVG alleen als ondersteunende of decoratieve systeemlaag.

