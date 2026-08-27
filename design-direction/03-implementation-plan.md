# Step-by-Step Implementation Plan

Each phase should be a separate pull request or a separately reviewable commit series. Do not begin the next phase until screenshots and acceptance criteria for the current phase are approved.

## Phase 0 — Baseline and safety

1. Read repository instructions, package scripts and existing styling entry points.
2. Identify where the Radix `<Theme>` is configured.
3. Identify global CSS, page-level CSS and reusable card/button classes.
4. Run the existing build, lint and test commands.
5. Capture screenshots at 390, 768, 1280 and 1440 widths.
6. Record the existing bundle baseline and Lighthouse/Core Web Vitals if the repo already has tooling for them.
7. Do not change content in this phase.

Deliverable: baseline notes and screenshots only.

## Phase 1 — Foundation: tokens, fonts and shell

### 1. Install the token layer

- Add `styles/vandenit-theme.css` or merge its tokens into the existing global stylesheet.
- Keep variable names intact unless the project has an established naming convention.
- Map Radix font variables to the Vanden IT font variables at the theme root.

### 2. Configure fonts

- Keep Geist and Geist Mono.
- Add Barlow Condensed only for display headings.
- Prefer `next/font` so fonts are self-hosted and do not require a render-blocking Google Fonts stylesheet.
- Verify that Radix headings, buttons and body components actually inherit the intended family.

### 3. Update the page shell

- Change the pure black feeling into layered midnight surfaces.
- Add the engineering grid only in selected hero/evidence areas.
- Restyle the header with a thin lower rule, less pill-like active navigation and strong keyboard focus.
- Keep the current navigation labels and CTA.

### 4. Update buttons

- Make `Discuss a project` the amber human-action button.
- Keep workflow/article links cobalt or outlined.
- Preserve 44px minimum touch height.

### Acceptance criteria

- Every page inherits the new palette and fonts without layout regressions.
- Radix components no longer fall back to an inconsistent system font.
- No new runtime dependency.
- Header remains usable at 320px.
- All routes pass build/lint/tests.

Stop and review.

## Phase 2 — Homepage identity

### 1. Hero composition

Desktop:

- Move from fully centered to an asymmetrical two-column hero.
- Keep the current H1 and supporting paragraph as semantic HTML.
- Place copy and CTAs in the first 5 columns; diagram in the remaining columns.
- Keep the proof strip immediately below the hero.

Mobile:

- Order: header → H1 → copy → CTAs → diagram → proof metrics.
- Do not place the diagram beside the text.
- Use the dedicated mobile SVG geometry rather than scaling the desktop composition.

### 2. System diagram

- Begin with a static SVG based on `assets/daniel-flow-desktop.svg` and `assets/daniel-flow-mobile.svg`.
- Treat it as decorative with `aria-hidden="true"` if all meaning is already present in HTML.
- If labels are meaningful, reproduce them as nearby HTML rather than tiny SVG text.
- Do not animate in this phase.

### 3. Proof strip

- Preserve `15 years experience`, `100,000+ users`, and `Backend, frontend & technical leadership`.
- Use ruled cells and restrained icons rather than three rounded cards.

### 4. Contribution section

- Do not redesign all three cards yet.
- First reduce their radius/shadow and add chapter numbers or ruled connectors.
- Preserve all service wording and anchors.

### Acceptance criteria

- H1 and main CTA are visible before the diagram dominates.
- No rasterized text.
- Hero works at 320, 390, 768, 1280 and 1440 widths.
- Static SVG remains sharp and small.
- The page is recognizably different without requiring animation.

Stop and review.

## Phase 3 — How I Work as a connected process

1. Preserve the current four engagement steps and their wording.
2. Render them as one connected process rather than independent Markdown sections.
3. Desktop may use four columns with one continuous path.
4. Mobile must use a vertical stepper.
5. Use cobalt for exploration and amber only when judgment or verification occurs.
6. Convert the production incident example into five evidence beats:
   - Problem
   - First AI implementation
   - Wrong conclusion
   - Human intervention
   - Result
7. Make `Human intervention` the visual pivot and `Result` the terminal proof block.
8. Keep all explanatory text in HTML.

Optional only after static approval: reveal the path with CSS classes activated by `IntersectionObserver`.

### Acceptance criteria

- The process remains fully understandable with JavaScript disabled.
- Mobile labels never overlap the linework.
- Reduced-motion users receive the final static state.
- No hover-only information.

Stop and review.

## Phase 4 — Case study and blog

### Case-study shell

- Add a case-file kicker, date, author, estimated reading time and back-to-blog link.
- Add a compact table of contents from H2 headings.
- Keep the article body editorial and readable; do not place every paragraph in a dossier panel.
- Replace ASCII workflow and score progression with semantic SVG/chart visuals plus textual alternatives.
- Add real project/process screenshots only when they are accurate and safe to publish.
- On mobile, convert side navigation into horizontally scrollable anchor chips with visible overflow affordance.

### Blog index

- Keep it simple while there is only one article.
- Use one strong editorial featured entry rather than a large generic card floating in empty space.
- Add archive structure only when more posts exist.

### Social metadata

- Create one 1200×630 homepage social image and one article-specific image.
- Set both `og:image` and `twitter:image`.
- Verify the resolved public URLs after deployment.

Stop and review.

## Phase 5 — About and Contact

### About

- Replace the flat circular placeholder with a real portrait when supplied.
- If no portrait is supplied, use a deliberate typographic/monogram checkpoint rather than inventing one.
- Turn career highlights into a restrained timeline/evidence rail.
- Keep long-form story paragraphs on a comfortable editorial measure.

### Contact

- Keep the page quiet and direct.
- Use one amber contact action and a subtle system rule; no large workflow diagram.
- Preserve the current `mailto:filip@vandenit.be` link and LinkedIn option.

## Phase 6 — Optional motion

Only begin after all static layouts are approved.

1. Add a `.is-visible` state through `IntersectionObserver`.
2. Animate only opacity, transform and a small number of SVG stroke offsets.
3. Pause or avoid work offscreen.
4. Do not animate layout properties.
5. Do not add an animation library unless a demonstrated requirement cannot be met with CSS.
6. Respect `prefers-reduced-motion` and keep the final state visible.

