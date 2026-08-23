# VandenIT Website Review — Embedded Positioning V2

**Website:** <https://vandenit.be/>  
**Datum:** 22 augustus 2026  
**Scope:** volledige publieke website, desktop-UX, positionering, content, layout, toegankelijkheid, interacties, SEO en social sharing  
**Vergelijkingsbasis:** eerdere website-review en het document `vandenit-embedded-ai-positioning-content-plan.md`

## 1. Eindbeoordeling

De nieuwe versie is inhoudelijk en strategisch duidelijk sterker. De website presenteert Filip nu in de eerste plaats als **senior full-stack developer** en **fractional tech lead**. AI-workflowverbetering wordt correct voorgesteld als een onderscheidende meerwaarde binnen het engagement, niet langer als een afzonderlijke auditdienst die al bij meerdere teams bewezen zou zijn.

De nieuwe positionering is geloofwaardig:

> Filip joins the team as an experienced developer or technical lead, contributes to real delivery, and helps improve the way AI is used from inside the work.

De grootste resterende kloof ligt niet meer in de strategie of inhoud, maar in de visuele uitvoering. De content van How I Work is geschreven als een proces en case timeline, maar wordt nog als gewone doorlopende tekst weergegeven. Ook de case study blijft visueel onderontwikkeld.

### Nieuwe score

| Onderdeel | Score | Beoordeling |
|---|---:|---|
| Positionering en geloofwaardigheid | **9,1/10** | Duidelijk, eerlijk en onderscheidend |
| Visuele stijl | **8,3/10** | Professioneel en consistent, maar visueel nog weinig eigen |
| Desktop-UX | **7,8/10** | Goede flow, met een concrete fout in de ankerlinks |
| Content en scanbaarheid | **7,8/10** | Sterke inhoud, enkele lange en tekstzware pagina’s |
| Toegankelijkheid | **8,8/10** | Semantiek sterk verbeterd |
| SEO en social sharing | **7,1/10** | Metadata grotendeels goed, afbeeldingen ontbreken of zijn ongeschikt |
| **Totaal** | **8,4/10** | Sterke professionele basis met duidelijke resterende polish |

## 2. Wat aantoonbaar verbeterd is

### Positionering

- `AI Development Workflow Audit` is verwijderd als gevestigde standalone dienst;
- Senior full-stack development staat nu expliciet op de homepage;
- Fractional tech leadership blijft een primaire bewezen rol;
- AI-workflowverbetering wordt beschreven als onderdeel van het engagement;
- De homepage zegt onmiddellijk dat Filip binnen het productteam aansluit;
- De boodschap draait nu rond bijdragen aan echte delivery;
- De grens tussen eigen ervaring en teamtransformatie wordt expliciet benoemd.

### Homepage

- De ondersteunende hero-copy is afgestemd op de embedded positionering;
- `See how I work` vervangt de case study als primaire CTA;
- De header gebruikt het concretere `Discuss a project`;
- `What I Do` is gewijzigd in `How I Can Contribute`;
- De drie diensten hebben specifieke titels en beschrijvingen;
- Iedere dienst heeft een eigen CTA en doelanker;
- De bewijsstrook blijft behouden;
- De portfolio-carousel wisselt tekst en afbeelding correct samen.

### About

- De carrière- en ervaringstekst is compacter en geloofwaardiger;
- De rol bij BNP/Centric is correct afgebakend;
- De AI-transitie wordt vanuit professioneel leren beschreven;
- De Ollama-privacyclaim is genuanceerd als leveranciersclaim;
- `What I Bring to the Team` sluit beter aan bij een embedded rol;
- De primaire competenties zijn Production Engineering, Technical Leadership en AI-Augmented Delivery.

### How I Work

- De pagina is volledig herschreven rond een embedded engagement;
- De nieuwe hero maakt duidelijk dat Filip aansluit, levert en vervolgens verbetert;
- De samenwerking is opgedeeld in vier logische stappen;
- Development, fractional leadership en AI-workflowverbetering hebben eigen secties;
- De RabbitMQ-case is ingekort tot probleem, verkeerde conclusie, interventie en resultaat;
- AI-workflowverbetering wordt niet langer als brede audit verkocht.

### Contact

- De intro richt zich nu op senior development en fractional tech leadership;
- De e-maillink werkt correct met `mailto:`;
- AI-workflowverbetering wordt als optioneel onderdeel van het engagement benoemd;
- De gesprekstarters vragen naar team, deliveryproblemen en gewenste rol;
- De redundante header-CTA wordt op Contact niet getoond.

### Technische en semantische verbeteringen

- Iedere gecontroleerde pagina bevat precies één H1;
- De actieve navigatielink gebruikt nu `aria-current="page"`;
- Er zijn geen naamloze buttons meer aangetroffen;
- Canonical URL’s zijn aanwezig;
- Meta-descriptions zijn paginaspecifiek en actueel;
- De service-CTA’s verwijzen naar bestaande sectie-ID’s;
- Op desktop werd geen horizontale pagina-overflow aangetroffen.

## 3. Prioriteiten

## P0 — functioneel probleem

### Ankertitels verdwijnen achter de vaste header

De nieuwe specifieke CTA’s verwijzen correct naar:

```text
/how-i-work#senior-full-stack-development
/how-i-work#fractional-tech-lead
/how-i-work#ai-workflow-improvement
```

De bestemmingen bestaan, maar de browser plaatst het doel op `top: 0`. De vaste header bedekt daardoor de titel van de sectie. Bij `How I contribute` was `Senior Full-Stack Development` niet zichtbaar na het landen; de bezoeker zag onmiddellijk de bodytekst en daarna de volgende sectie.

Aanbevolen oplossing:

```css
#senior-full-stack-development,
#fractional-tech-lead,
#ai-workflow-improvement {
  scroll-margin-top: 96px;
}
```

Of generiek:

```css
[id] {
  scroll-margin-top: 96px;
}
```

Gebruik de generieke oplossing alleen wanneer ze geen ongewenst effect heeft op technische of automatisch gegenereerde ID’s.

## P1 — grootste UX- en conversiekansen

### 1. How I Work visueel ontwerpen

De content is opgebouwd als een visueel proces, maar wordt nog als gewone tekst weergegeven.

`How an engagement develops` moet een echte procescomponent worden:

```text
Join and understand
        ↓
Contribute to delivery
        ↓
Improve the workflow
        ↓
Leave durable practices
```

Aanbevolen desktopweergave:

- Vier verbonden stappen;
- Een duidelijk nummer of icoon per stap;
- Een korte titel en maximaal twee regels toelichting;
- Een subtiele lijn of progressie tussen de stappen.

Aanbevolen mobiele weergave:

- Verticale timeline;
- Nummer links, content rechts;
- Voldoende ruimte tussen de stappen;
- Geen horizontaal scrollende component.

### 2. RabbitMQ-case als timeline tonen

De huidige sectie bevat de juiste informatie, maar visueel zijn het vijf normale subkoppen.

Aanbevolen structuur:

```text
Problem
  ↓
First AI implementation
  ↓
Wrong conclusion
  ↓
Human intervention
  ↓
Result
```

Visuele nadruk:

- Neutrale kleur voor probleem en eerste implementatie;
- Waarschuwingskleur bij `Wrong conclusion`;
- Blauwe highlight bij `Human intervention`;
- Groene of positieve callout bij `Result`;
- Afsluitende quote: `AI handled the volume. Experience made the judgment call.`

### 3. Case study visueel en structureel afwerken

Het artikel is nog altijd het sterkste inhoudelijke bewijsstuk, maar de presentatie benut dat onvoldoende.

Ontbreekt nog:

- Auteur;
- Geschatte leestijd;
- `Back to blog`;
- Inhoudstafel;
- Heroafbeelding;
- Vóór/na-screenshots;
- Workflowdiagram;
- Echte scoregrafiek;
- Screenshot van de mobiele viewportbug;
- Eigen Open Graph-afbeelding.

De ASCII-workflow en scorebalken werken technisch, maar ogen minder professioneel dan de rest van de website.

## 4. Contentfeedback

## Homepage

### Sterk

De kernboodschap is onmiddellijk duidelijk:

> I join product teams as a senior full-stack developer or fractional tech lead.

Dit positioneert Filip correct en voorkomt dat bezoekers hem primair als AI-consultant interpreteren.

De drie bijdragekaarten zijn logisch:

1. Senior Full-Stack Development;
2. Fractional Tech Lead;
3. AI Tooling & Workflow Improvement.

De CTA’s `How I contribute`, `Explore the role` en `See how AI fits` zijn duidelijker dan driemaal `Learn more`.

### Te defensieve formulering

Huidig:

> without handing architecture, security, or quality decisions over to the tools.

Aanbevolen:

> **while I remain accountable for architecture, security, and quality.**

Volledige vervangtekst:

> **I join product teams as a senior full-stack developer or fractional tech lead. Alongside shipping real software, I help improve how AI is used in development — while I remain accountable for architecture, security, and quality.**

Dit behoudt dezelfde inhoud, maar klinkt positiever en zelfverzekerder.

### Testimonials

De drie testimonials blijven lange tekstblokken. Ze leveren veel geloofwaardigheid, maar de kernzinnen verdwijnen in de lengte.

Aanbevolen:

- Toon één kernquote per persoon;
- Behoud naam, functie en organisatie;
- Plaats de volledige tekst achter `Read full testimonial`;
- Of toon één grote hoofdtestimonial en twee compactere quotes.

Sterkste kandidaat als hoofdquote:

> **“Filip naturally feels responsible for his work and does whatever is required to deliver on time and with high quality.”**

## About

### Sterk

- De correctie rond de rol binnen Enablement/Centric is duidelijk;
- De productie-ervaring krijgt meer gewicht dan de tools;
- De AI-evolutie klinkt als een professioneel leerproces;
- De privacyclaim is voldoende genuanceerd;
- De zin `The goal is not to maximize AI usage` maakt de engineeringfocus duidelijk.

### Nog te lang

De pagina bevat:

- The Story So Far;
- The Shift;
- De volledige toolingsectie;
- What This Means for You;
- Drie competentiekaarten;
- Drie experience highlights.

De toolingsectie kan visueel secundair worden gemaakt met een accordion:

> **The tools behind my workflow**

Zo blijft de technische geloofwaardigheid beschikbaar zonder de professionele verhaallijn te onderbreken.

### Negatieve opening

Huidig:

> I do not arrive with a generic AI transformation playbook.

Aanbevolen:

> **I begin with the actual work: understanding the codebase, delivery pressure, technical constraints, and the way the team collaborates.**

De positieve zin maakt het contrast vanzelf duidelijk.

## How I Work

### Sterk

De hero is helder:

> I join the team. Ship real work. Improve how the work gets done.

De pagina beschrijft nu correct dat workflowverbetering uit context en samenwerking ontstaat.

### `Proven` is te sterk

Huidig:

> My AI workflow is proven in my own production work.

`Proven` suggereert een gevalideerde methode met externe of meetbare bewijsvoering. Dat gaat verder dan wat momenteel aantoonbaar is.

Aanbevolen:

> **I developed and use this workflow in my own production work.**

Of:

> **My AI workflow is grounded in my own production work.**

### De disclaimer klinkt te juridisch

Huidig:

> Applying and refining it inside other engineering teams is part of my embedded developer or tech lead engagement, not currently sold as a standalone transformation audit.

De eerlijkheid is goed, maar dit klinkt als interne positioneringsdocumentatie in plaats van websitecopy.

Aanbevolen geheel:

> **I developed and use this workflow in my own production work. Within developer or tech lead engagements, I adapt the useful parts to the team's actual environment and delivery needs.**

### Dubbele negatieve positionering

Huidig:

> This is not a generic rollout and it is not about maximizing AI usage.

Aanbevolen:

> **We start from real delivery friction and introduce only the practices that make the work better.**

## Blogindex

### Sterk

- De nieuwe subtitle maakt duidelijk dat het praktijknotities zijn;
- Eén featured case study werkt beter dan lege filters;
- De pagina heeft voldoende ruimte en een duidelijke focus;
- De case study past inhoudelijk bij de nieuwe positionering.

### Verbeteringen

- Voeg leestijd toe;
- Voeg `By Filip Van den Broeck` toe;
- Gebruik `Featured case study` in plaats van alleen `Featured`;
- Voeg een zichtbare `Read the case study`-CTA toe;
- Gebruik een echte thumbnail in plaats van een generiek schildicoon.

## Case study

### Sterk

- Concrete aantallen en iteraties;
- Transparantie over fouten;
- Duidelijke menselijke beslismomenten;
- Goede nuance rond Claude-scores;
- Sterke uitleg van complementaire modellen;
- Een eerlijke sectie `What This Actually Is`.

### Scopezin ontbreekt nog

Voeg na de introductie toe:

> **This is a case study of the workflow I use in my own development environment. It is not a claim that the same setup can be copied unchanged into every engineering team. The useful part is the structure: complementary tools, explicit review, captured feedback, and human ownership of the final decision.**

Deze zin verbindt het artikel expliciet met de nieuwe websitepositionering.

### Afsluitende CTA

De huidige `discuss a project`-CTA is goed. Nog specifieker:

> **I bring this approach into projects as a senior developer or fractional tech lead, adapting it to the team's actual codebase and constraints. If that combination would be useful for your team, let's talk.**

## Contact

### Sterk

- De bezoeker weet onmiddellijk welke rollen beschikbaar zijn;
- De e-mailknop is prominent en functioneel;
- De vijf gesprekstarters verbeteren de kwaliteit van aanvragen;
- AI wordt niet als verplicht onderdeel gepresenteerd;
- `Currently available for new projects` is conversiegericht.

### Aandachtspunt

Zorg dat de beschikbaarheidsclaim eenvoudig configureerbaar is en verwijderd of aangepast wordt zodra ze niet meer klopt.

## 5. Oude AI-labels lopen achter op de nieuwe positionering

Bovenaan de pagina’s staat nog:

> AI-Powered Development

De footer gebruikt eveneens:

> Vanden IT — AI-Powered Development

De rest van de website maakt senior engineering terecht de primaire identiteit. Het oude label legt AI opnieuw op de voorgrond.

Aanbevolen vervanging:

> **Senior Engineering · AI-Augmented Delivery**

Mogelijke varianten:

- `Senior Engineering & Technical Leadership`;
- `Embedded Engineering · AI-Augmented Delivery`;
- Op Contact en About geen eyebrow tonen;
- Footer beperken tot `© Vanden IT`.

`AI-Augmented` past beter dan `AI-Powered`: de engineer blijft de drijvende kracht, AI versterkt de delivery.

## 6. SEO en social sharing

## Wat goed is

- Canonical URL’s zijn aanwezig;
- Meta-descriptions zijn uniek en actueel;
- Open Graph-titels en descriptions zijn aanwezig;
- De paginatitels sluiten grotendeels aan bij de nieuwe positionering;
- De homepage-title is correct: `Vanden IT — Senior Developer & Fractional Tech Lead`.

## Wat ontbreekt

### Geen `og:image`

Op geen van de gecontroleerde pagina’s werd een `og:image` gevonden.

### Ongeschikte algemene Twitter-afbeelding

De algemene pagina’s verwijzen als `twitter:image` naar:

```text
https://vandenit.be/uploads/main/unnamed.jpg
```

Dit is een vierkante persoonlijke profielfoto. Tegelijk gebruikt de website `summary_large_image`, waarvoor een brede branded afbeelding van ongeveer 1200 × 630 logischer is.

### Artikel zonder social image

De case study heeft geen `twitter:image` en geen `og:image`.

## Aanbeveling

Maak twee afbeeldingen:

### Algemene VandenIT-card

- Formaat 1200 × 630;
- VandenIT-logo;
- `Senior Developer & Fractional Tech Lead`;
- Subtiele profielfoto;
- Donkere huisstijl en blauw accent;
- Bestandsnaam zoals `vandenit-social-card.jpg`.

### Case-study-card

- Formaat 1200 × 630;
- Titel of verkorte titel;
- Visueel onderscheid tussen implementerende en reviewende AI;
- VandenIT-branding;
- Bestandsnaam zoals `blind-coder-sighted-reviewer-social.jpg`.

Gebruik beide als `og:image` en `twitter:image`.

## Kleine metadata-inconsistentie

De blogindex gebruikt:

- Document title: `Blog — Vanden IT`;
- Open Graph-title: `Building & Shipping with AI — Vanden IT`.

Maak deze consistent, bij voorkeur:

> **Building & Shipping with AI — Vanden IT**

## 7. Toegankelijkheid en semantiek

### Opgelost

- Eén H1 per pagina;
- Actieve navigatie met `aria-current="page"`;
- Geen naamloze buttons;
- Carouselcontrols hebben toegankelijke labels;
- Profielfoto en portfolioafbeeldingen hebben alternatieve tekst;
- Contactlink gebruikt correcte e-mailsemantiek;
- Sectieankers bestaan daadwerkelijk.

### Resterend

- Herstel de ankeroffset voor de sticky header;
- Test zichtbare focusringen op alle CTA’s;
- Controleer de timelinecomponent later met keyboard en screenreader;
- Zorg dat social en decoratieve afbeeldingen passende alt- of lege alt-attributen krijgen;
- Test de mobiele navigatie en touch targets op een echt toestel.

## 8. Mobiele controle

De viewportmeta-instelling is aanwezig en de pagina’s bevatten responsive structuren. Deze review heeft de desktopversie visueel grondig gecontroleerd. Een afzonderlijke real-device-review blijft aanbevolen.

Controleer minimaal op 360 en 390 px:

- Hero-titels;
- Mobiele navigatie;
- Stapeling van de twee hero-CTA’s;
- Bewijsstrook;
- Servicekaarten;
- Nieuwe proces- en timelinecomponenten;
- Tabellen en codeblokken in de case study;
- Ankerlinks met sticky mobiele header;
- E-mailknop en gesprekstarters.

## 9. Aanbevolen implementatievolgorde

### Fase 1 — directe functionele correctie

1. `scroll-margin-top` toevoegen aan ankerdoelen;
2. Alle drie homepage-CTA’s opnieuw aanklikken en visueel verifiëren;
3. Mobiele ankerpositie controleren.

### Fase 2 — How I Work visualiseren

1. Vierstappenproces bouwen;
2. RabbitMQ-timeline bouwen;
3. Menselijke interventie visueel benadrukken;
4. Grote lege ruimtes verminderen;
5. `proven` en defensieve formuleringen vervangen.

### Fase 3 — case study verbeteren

1. Auteur en leestijd;
2. Back-to-blog-link;
3. Inhoudstafel;
4. Voor/na-screenshots;
5. Workflowdiagram;
6. Scoregrafiek;
7. Scopezin;
8. Specifieke CTA.

### Fase 4 — merk en social sharing

1. `AI-Powered Development` vervangen;
2. Algemene social card ontwerpen;
3. Artikel-card ontwerpen;
4. `og:image` en `twitter:image` toevoegen;
5. Blogtitel consistent maken.

### Fase 5 — verdere scanbaarheid

1. Testimonials inkorten;
2. Toolingsectie op About inklapbaar maken;
3. Leestijd en auteur op blogindex tonen;
4. Volledige mobiele en toegankelijkheids-QA.

## 10. Eindconclusie

De nieuwe positionering is geslaagd. De website laat nu geloofwaardig zien dat Filip eerst en vooral een ervaren engineer en technical lead is. AI vervangt die identiteit niet, maar versterkt zijn manier van werken.

De website wordt nu vooral tegengehouden door drie uitvoeringspunten:

1. De verborgen ankertitels;
2. De nog volledig tekstuele How I Work-pagina;
3. De visueel onafgewerkte case study en social previews.

Na het oplossen van die punten kan de website realistisch evolueren van **8,4/10 naar ongeveer 8,9/10**, zonder opnieuw de kernpositionering of algemene visuele stijl te moeten herdenken.
