# Vanden IT — Phase 4 Agent Brief

Date: 2026-08-26  
Target: https://vandenit.be/  
Phase: 4 — Case study and blog  
Live Phase 3 baseline: commit `3ecae9b` reported in the newest Drive `status.md`  
Newest status file at review time: Drive ID `1gCmT6PuxQqtLhbo4kjIsV2YdVJGPqvyI`

## Mission

Turn the existing blog and its single long-form article into credible editorial proof of how Filip works with AI.

The target experience is not a generic blog template or a collection of dossier panels. It should feel like one carefully documented engineering case file inside the existing Vanden IT system: restrained, readable, technically specific and visibly owned by a human.

The visitor should leave with this impression:

> This is a real workflow, with evidence, failure modes and human judgement—not an abstract AI claim.

Keep the established Foundation/Robots atmosphere implicit: systems, roles, sequence and judgement. Do not add literal science-fiction characters, quotes, lore, stock robots or cinematic decoration.

## Phase 3 gate review

### Verdict

**Approved for Phase 4. No blocking Phase 3 fix remains.**

The five agreed review fixes are reported in commit `3ecae9b` and the live desktop state matches the implementation record.

### Confirmed live on 2026-08-26

- `/how-i-work` has exactly one H1 and a logical H2/H3 hierarchy;
- the four engagement steps remain semantic ordered content and render as one connected desktop system;
- all four desktop process steps use the same `16px` left padding and equal width;
- the five-beat decision trace remains readable and connected;
- `Wrong conclusion` includes the textual `Invalid` state, so failure is not colour-only;
- `Human intervention` remains the single amber pivot inside the trace;
- the closing sentence remains prominent;
- the logo link and footer links resolve to at least `44px` high hit areas in the reviewed desktop viewport;
- no horizontal overflow was present at the reviewed desktop viewport;
- no Vanden IT application error appeared in the console; the only logged error came from the browser extension;
- amber in the primary CTA, active navigation and hero convergence cue remains an intentional site-wide design decision.

### Responsive evidence from the newest status

The latest status records the following post-fix results:

- 320px: eyebrow, spacing and touch targets fixed; score 8/10;
- 390px: spacing and touch targets fixed; score 8.5/10;
- 768px: engagement process changed from a disconnected 2×2 grid to the vertical stepper; score 8.5/10;
- 1280px: step 01 padding normalized; score 8.5/10;
- 1440px: score 8.5/10.

This review browser could not change its viewport, so those mobile/tablet claims are accepted as the project’s recorded screenshot QA and must be rechecked in the agent’s own responsive test pass. Do not reopen the 2×2 tablet design.

### Deferred but not forgotten

- Formal text/rail contrast verification belongs in the Phase 4 QA pass. Previous measured body and footer text passed WCAG AA; decorative rails still need a dim-display sanity check.
- Portfolio carousel dot keyboard access is pre-existing and outside this phase unless a shared change regresses it.
- Optional motion remains Phase 6. Phase 4 is static-first.

## Current Phase 4 baseline

### `/posts`

The page currently has one centered introduction and one large elevated feature card. It works, but the card floats in a large empty field and reads as a generic SaaS/blog component rather than a Vanden IT editorial entry.

Live findings:

- one H1;
- the feature entry heading is H3, which skips H2 in the page outline;
- one post only, so filters, archive navigation and category infrastructure would be premature;
- the shield icon does not carry article-specific evidence;
- the large filled panel and empty surrounding space weaken the strong ruled visual language established elsewhere.

### `/posts/blind-coder-sighted-reviewer`

The article copy is strong and candid. It already includes the important limitation that the workflow is not a claim that the same setup can be copied unchanged into every team. Preserve that honesty.

Live findings:

- exactly one H1 and ten H2 sections with stable IDs;
- no semantic `<article>` wrapper detected;
- no back-to-blog link, case-file kicker, author, reading time or semantic `<time>` element;
- no table of contents;
- tags precede the title and currently carry more visual weight than the editorial metadata;
- the workflow and score progression are ASCII diagrams inside `<pre>` blocks;
- no article image or semantic SVG is present;
- code samples should remain code samples; only the workflow and score-progression ASCII blocks need replacement;
- no `og:image` or `twitter:image` is currently resolved for the article;
- current desktop page length is approximately 8,237px, so navigation and section orientation will materially help.

## Scope boundaries

### In scope

- redesigning the `/posts` index for one strong editorial feature;
- creating a recognizable case-study shell for `/posts/blind-coder-sighted-reviewer`;
- adding semantic metadata and a compact H2 table of contents;
- replacing exactly the workflow and score-progression ASCII visuals;
- adding accurate, publication-safe process imagery only when available;
- creating homepage and article social-sharing images;
- setting and verifying Open Graph and Twitter image metadata;
- responsive, keyboard, contrast, build and regression QA.

### Out of scope

- redesigning Home, About, Contact or How I Work;
- rewriting the article into marketing copy;
- changing technical claims or scores without source evidence;
- inventing screenshots, metrics, client material or AI-session evidence;
- adding archives, search, filters or category navigation for one article;
- putting every paragraph inside a panel;
- adding animation, parallax, scroll choreography or a motion library;
- adding Tailwind, a chart library, canvas, WebGL or another component framework;
- literal robot/human character art;
- rasterizing article content or embedding essential text only in SVG;
- changing the existing primary amber/cobalt/red role definitions.

Keep Next.js and the current Radix usage. Style with the existing Vanden IT CSS custom properties and the project’s existing CSS architecture. Prefer semantic HTML, lightweight inline SVG where it genuinely clarifies a relationship, and CSS pseudo-elements for decorative rails. Do not introduce a new styling technology in this phase.

## Execution order

### 1. Preflight and evidence baseline

Before changing code:

1. Read repository instructions, the newest `status.md`, `03-implementation-plan.md` and this brief.
2. Confirm which branch/commit produced the live deployment. Start Phase 4 from the deployed Phase 3 baseline; do not assume branch names from old briefs are still current.
3. Confirm the worktree state and preserve unrelated user changes.
4. Run TypeScript and the current production build.
5. Capture actual before screenshots of `/posts` and the article at 320, 390, 768, 1280 and 1440px.
6. Record H1/H2 order, horizontal overflow, console output and current resolved metadata before implementation.
7. Locate the article source, post metadata source and existing metadata exports before deciding component structure.

Do not call HTML inspection “viewport QA.” Use rendered screenshots for visual acceptance.

### 2. Build the case-file header

Create a restrained editorial header above the article body. It must include:

- a mono case-file kicker, for example `CASE FILE / AI DELIVERY WORKFLOW`;
- the existing article title as the only H1;
- publication date using `<time datetime="...">`;
- author, using Filip’s real published name from the existing site/repository source;
- honest estimated reading time derived from the article word count, not an arbitrary number;
- a visible `Back to blog` link;
- the existing tags, visually subordinate to title and metadata.

Recommended tone:

- open editorial layout, not a filled hero card;
- one cobalt rule or case identifier;
- amber only for a meaningful human-owned cue or primary action;
- no oversized shield icon;
- no decorative badge pile.

Use a semantic `<article>` wrapper around the case study. Keep one H1 and preserve the existing H2 IDs unless a migration is necessary and redirects/anchors are handled.

### 3. Add compact article navigation

Generate the table of contents from the article’s H2 headings or from the same typed content source that renders them. Do not maintain a second manually drifting list.

Desktop direction:

- a compact side rail only where the layout has enough room;
- sticky positioning is acceptable below the site header;
- keep the article body at a comfortable editorial measure, approximately `68–74ch`;
- show current section only if it can be done without hiding content before JavaScript loads;
- avoid a tall boxed navigation panel.

Mobile/tablet direction:

- convert the navigation to horizontally scrollable anchor chips;
- make chips at least 44px high;
- show a visible overflow affordance, such as a trailing fade and partially visible next chip;
- keep native horizontal touch scrolling;
- do not hide the browser scrollbar if doing so removes the only affordance;
- do not create page-level horizontal overflow;
- use `scroll-margin-top` on headings so anchored sections are not hidden below the sticky header.

Accessibility:

- label the navigation, for example `aria-label="On this page"`;
- anchors must work with keyboard and without JavaScript;
- use `aria-current="location"` only when the active state is reliable;
- maintain strong `:focus-visible` styling;
- no hover-only labels or meaning.

### 4. Replace the two ASCII visuals

Replace only these two prose diagrams:

1. the Hermes/Claude workflow loop;
2. the desktop/content score progression.

Do not convert prompt snippets, JSX, configuration or CSS examples into diagrams. Those remain semantic code blocks with internal horizontal scrolling on narrow screens.

#### Workflow visual

Show the repeatable sequence rather than two decorative AI avatars:

1. Hermes implements;
2. screenshots/evidence are produced;
3. Claude reviews and scores;
4. feedback returns;
5. Hermes applies fixes;
6. Filip decides what ships.

The final human decision must be explicit. This is the article’s key idea.

Recommended implementation:

- semantic ordered HTML as the source of truth;
- an inline SVG or CSS rail may connect roles/steps;
- visible labels remain selectable HTML where practical;
- if SVG carries labels, provide an equivalent adjacent text list or accessible description;
- cobalt for system flow, amber for Filip’s decision, red only for rejected/invalid findings;
- no client-side animation in the initial implementation.

#### Score progression visual

Represent both series accurately:

- Desktop: 5.0 → 6.4 → 7.2 → 8.8;
- Content: 6.8 → 7.6 → 9.0.

Use either a small semantic inline chart or HTML bars/steps, plus an accessible data table/list. Requirements:

- exact numeric values visible as text;
- series distinguishable without colour alone;
- no third-party chart library;
- no exaggerated axis or misleading scale;
- meaningful reading order with CSS disabled;
- compact mobile layout without shrinking labels into illegibility.

### 5. Keep the article editorial

Preserve the current long-form voice and readable paragraph rhythm.

- Do not wrap every H2 section in a dossier card.
- Use a limited callout vocabulary only when the content warrants it: `Finding`, `Failure mode`, `Human decision`.
- Keep ordinary paragraphs on the base canvas.
- Use cobalt rules for system structure, red only for invalid/failure states and amber only for human judgement.
- Keep code samples readable, selectable and internally scrollable.
- Avoid full-width prose lines on desktop.
- Preserve all caveats about transferability and human ownership.

Real screenshots may be added only when the agent can verify that they depict the described project/session and contain no credentials, client data, private conversations or misleading later-state UI. If that evidence is unavailable, ship the semantic visuals without screenshots. Never fabricate a before image.

### 6. Redesign the one-post index

Keep `/posts` deliberately simple while there is one article.

Recommended composition:

- retain the existing title and short editorial introduction;
- replace the floating filled card with one strong ruled feature entry;
- use an H2 for the article title so the page outline is H1 → H2;
- show concise case metadata such as `Case file`, date and reading time;
- let the article title and one evidence cue carry the design;
- consider a small code-native crop/miniature of the workflow rail instead of the generic shield;
- make the entire entry easy to activate while avoiding nested interactive elements;
- keep the link purpose clear without relying on the arrow alone.

Do not add a fake archive, empty category sections, filters or pagination.

### 7. Create social preview assets and metadata

Create:

1. one 1200×630 homepage social image;
2. one 1200×630 article-specific social image.

Visual system:

- dark Vanden IT canvas;
- strong cream headline hierarchy;
- restrained cobalt system rail;
- one amber human-decision cue;
- Vanden IT identifier/mark and enough safe margin for platform crops;
- no stock imagery, fake UI screenshot or tiny paragraph text.

Prefer the simplest reliable implementation supported by the current Next.js version. Static optimized assets are acceptable and predictable. `ImageResponse` is acceptable only if it builds reliably with the project’s local fonts and deployment target. Do not add a dependency solely for social images.

Set and verify:

- homepage `og:image`;
- homepage `twitter:image`;
- article-specific `og:image`;
- article-specific `twitter:image`;
- absolute public URLs after deployment;
- correct 1200×630 dimensions and successful HTTP response;
- meaningful page titles and descriptions remain intact.

The article image should be article-specific, not the homepage image with only a filename change.

### 8. Responsive, accessibility and regression QA

Test `/posts` and the article at:

- 320px;
- 390px;
- 768px;
- 1280px;
- 1440px.

For both Phase 4 pages verify:

- exactly one H1;
- logical heading hierarchy;
- no page-level horizontal overflow;
- 44px minimum touch targets for interactive controls;
- visible keyboard focus;
- readable contrast on a dim display;
- link purpose understandable without colour alone;
- code blocks scroll internally when needed;
- no clipped title, metadata, chart labels or anchor chips;
- no essential information hidden behind hover or JavaScript;
- no Vanden IT console errors.

For the article additionally verify:

- `<article>` semantics;
- `<time datetime>` semantics;
- all ten H2 anchors work;
- desktop TOC does not overlap the article or sticky header;
- mobile chip strip has a visible overflow affordance and can be keyboard-scrolled;
- workflow remains understandable as text/ordered content;
- score data remains available as text or table;
- real screenshots, if any, have accurate alt text and explicit dimensions;
- code examples remain complete and selectable.

Regression-check the six standard routes:

- `/`;
- `/about`;
- `/how-i-work`;
- `/posts`;
- `/posts/blind-coder-sighted-reviewer`;
- `/contact`.

For the regression pass confirm HTTP success, one H1, no horizontal overflow, intact header/footer, functional `mailto:filip@vandenit.be`, and no application console errors. Reconfirm the Phase 3 vertical stepper at 768px; do not let shared article/navigation CSS change it.

Run at minimum:

- TypeScript with zero errors;
- the production build;
- keyboard-only navigation through header, TOC/chips, article links and footer;
- an automated Axe or equivalent pass followed by manual verification;
- metadata URL and image-dimension checks against the deployed public site.

## Definition of done

Phase 4 is complete when:

- `/posts` reads as one deliberate editorial feature rather than a generic orphan card;
- its outline is H1 → H2 and no premature archive/filter UI exists;
- the case study has a semantic article shell, case-file kicker, date, author, honest reading time and back link;
- a compact H2 table of contents works on desktop, keyboard and mobile;
- the article body remains open, readable and approximately `68–74ch`, without panel overuse;
- the workflow ASCII block is replaced by an accessible system/human flow;
- the score ASCII block is replaced by an accurate accessible chart plus textual data;
- code examples remain code examples;
- screenshots are either verified and safe or deliberately omitted;
- both 1200×630 social images exist and the four image metadata entries resolve publicly;
- required viewport screenshots exist;
- TypeScript, build, accessibility and six-route regression checks pass;
- the newest Drive `status.md` is updated with evidence, not a newly duplicated status file;
- the work stops for review before Phase 5.

## Agent hand-off format

Update the current status document—Drive ID `1gCmT6PuxQqtLhbo4kjIsV2YdVJGPqvyI` at the time of this brief—with:

1. branch and all Phase 4 commit hashes;
2. changed files and component responsibilities;
3. article metadata source and reading-time calculation;
4. semantic article/TOC structure;
5. desktop and mobile TOC behavior;
6. workflow visual structure and text alternative;
7. score chart structure and accessible data alternative;
8. any screenshots used, their provenance and privacy check;
9. blog index heading and feature-entry structure;
10. social image implementation and final absolute URLs;
11. screenshots at 320, 390, 768, 1280 and 1440px;
12. contrast, keyboard, touch-target and automated accessibility results;
13. TypeScript, production build and six-route regression results;
14. known limitations and deliberately deferred work;
15. final review-fix commit.

The Drive folder contains several historical files named `status.md`. Do not upload another duplicate. Update the newest current status file only, or explicitly document a new canonical ID if the project workflow replaces it.

Stop and document the constraint instead of widening scope if the long title, mobile anchor chips or charts cannot remain readable at 320px without reducing type below the current body-text standard.
