# Vanden IT — Phase 2 Agent Brief

Date: 2026-08-24  
Target: https://vandenit.be/  
Status source: `status.md` in this folder  
Starting branch reported by phase 1: `feature/visual-redesign`

## Mission

Refine the strong phase-1 foundation into a more distinctive, consistent Vanden IT design language without adding animation or unnecessary technical complexity.

Phase 2 is primarily about:

1. stabilising the implementation;
2. improving hero composition on desktop and mobile;
3. turning the homepage contribution section into a recognisable part of the new visual system;
4. removing styling shortcuts that would make later phases fragile;
5. verifying that the redesign remains accessible, responsive and performant.

The goal is **not** to redesign the site again. Preserve what already works.

## Phase-1 review verdict

Phase 1 is approved. The live site has a coherent identity and can move to phase 2 after the production hydration issue is investigated.

Strong elements that must be preserved:

- dark engineering-grid background;
- cream display typography;
- cobalt for system/AI signals;
- amber for human judgement and primary action;
- restrained Foundation/Robots atmosphere rather than literal sci-fi styling;
- compact header with ruled lower edge;
- static branch/converge diagram;
- ruled proof strip;
- clear keyboard focus treatment;
- readable long-form article layout;
- current content and information architecture.

## Scope boundaries

### In scope

- hydration/runtime investigation;
- font-loading cleanup;
- removal of hero/proof-strip inline styles;
- completion of the section-class migration;
- desktop hero balance;
- mobile diagram sizing;
- homepage contribution-card refinement;
- responsive, accessibility and regression QA.

### Out of scope

- animation or scroll choreography;
- Framer Motion, GSAP, canvas or WebGL;
- a Tailwind migration;
- replacing Radix UI;
- changing the content strategy or rewriting page copy;
- redesigning every secondary page;
- adding new large raster hero images;
- introducing a second component or styling framework.

Keep the diagram static in phase 2. Motion belongs to a later phase only if it adds meaning and survives reduced-motion and mobile constraints.

## Critical correction to `status.md`

Native semantic HTML is not a Radix pitfall. A native `<section>` containing ordinary `<div>` elements and CSS Grid is appropriate for the hero.

Do **not** replace semantic markup with Radix `Section`/`Flex` solely for visual consistency. Use Radix where it provides behaviour, accessibility or an existing useful primitive. The actual maintainability problem is the volume of inline styling, not the use of native elements.

## Execution order

Do the following in order. Keep each step reviewable and avoid mixing unrelated changes into one large commit.

### 1. Reproduce and resolve the React hydration issue

The previous agent reported an error on `/posts`. The live review also observed minified React errors from the site's own Next.js bundles, including hydration mismatch and recovery through client rendering.

Required investigation:

1. Run the application in development and inspect the full, non-minified error and component stack.
2. Reproduce with a clean browser profile or Playwright context without extensions.
3. Run a production build and test with `next build` plus the production server.
4. Check `/`, `/posts` and `/posts/blind-coder-sighted-reviewer` after direct navigation and after client-side navigation.
5. Inspect client components for server/client branches, dates, random values, locale-dependent formatting, browser-only storage and mutable data.
6. Start with `tag-filter-panel` if the component stack points there, but do not assume it is the cause without evidence.

Do not hide the problem with `suppressHydrationWarning` unless a deliberately variable leaf node is proven to require it. Do not disable SSR for a large page as a shortcut.

#### Acceptance criteria

- no React or Next.js errors in a clean production browser console;
- no hydration warning or error overlay on `/posts`;
- direct loads and client-side transitions both work;
- tag filtering, when present, remains functional;
- `next build` and TypeScript complete successfully.

### 2. Clean up the styling foundation

#### Fonts

Move Geist and Geist Mono to `next/font` and remove the Google Fonts CDN request and inline `<style>` variable bridge. Keep Barlow Condensed as the display face.

Target roles:

- Barlow Condensed: display headings and large proof values;
- Geist: body copy and UI text;
- Geist Mono: kickers, labels, metadata and compact system annotations.

#### Inline styles

Move the hero and proof-strip styling from JSX style attributes into scoped CSS or the existing stylesheet architecture. This includes:

- kicker spacing;
- H1 font, colour, line height, tracking and margins;
- lead text width, colour and spacing;
- desktop and mobile diagram sizing and opacity;
- proof-strip spacing, labels, values, units and descriptions.

Prefer meaningful classes such as:

```text
vdit-hero-copy
vdit-hero-title
vdit-hero-lead
vdit-hero-diagram
vdit-hero-diagram-mobile
vdit-proof-strip
vdit-proof-item
vdit-proof-value
vdit-proof-unit
```

Reuse existing design tokens. Do not introduce near-duplicate hard-coded colours or spacing values.

#### Section-class migration

The live homepage still contains two old `.section-alt` sections:

- Portfolio;
- Testimonials.

`How I Can Contribute` already uses `.vdit-section-alt`.

Complete the migration, then remove orphaned legacy CSS only after a repository-wide search confirms that it is unused.

#### Acceptance criteria

- all production fonts load through `next/font`;
- no Google Fonts stylesheet request remains;
- no font-variable `<style>` hack remains in the document head;
- hero and proof-strip presentation is controlled by classes, not repeated inline styles;
- `.section-alt` has no remaining consumers before its rule is removed;
- the visual appearance remains recognisably the same before composition changes begin.

### 3. Rebalance the desktop hero

The current desktop grid is `5fr 7fr`. In the reviewed viewport, the copy received approximately 337 px while the diagram received approximately 471 px. The visible problem is not an overpowering diagram; it is an unnecessarily narrow copy column and an overly tall headline.

Start by testing:

```css
.vdit-hero-inner {
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
}
```

Prefer 6/6 over immediately switching to 7/5. The diagram should remain restrained and secondary. Adjust the gap only if needed after testing the equal-column layout.

Do not solve wrapping by making the H1 substantially smaller. Preserve the display character. Small fluid-size tuning is acceptable only after the column width is corrected.

#### Acceptance criteria

- headline wraps deliberately without a stranded fragment such as `Production-`;
- primary value proposition is visible without excessive hero height;
- diagram remains fully visible and visually secondary;
- proof strip still reads as the bridge into the following section;
- no horizontal overflow from 320 px upward.

### 4. Correct the mobile diagram scale

The mobile asset is vertical (`75 × 150`) but is constrained by `max-height: 160px`, making it visually too small.

Control its width and let its intrinsic aspect ratio determine the height instead of using a very small height ceiling. Starting point:

```css
.vdit-hero-diagram-mobile {
  max-height: none;
}

.vdit-hero-diagram-mobile img {
  width: clamp(110px, 32vw, 140px);
  height: auto;
  max-width: none;
  margin-inline: auto;
}
```

Tune within an approximate rendered height of 220–280 px. Do not stretch or crop the SVG.

Required mobile content order:

1. kicker and title;
2. supporting copy;
3. CTA group;
4. diagram;
5. proof strip.

#### Acceptance criteria

- diagram is legible at 360 and 390 px;
- no cropping, distortion or horizontal scroll;
- CTA buttons remain easy to tap and at least 44 px high;
- the first proof-strip item is not pushed implausibly far below the hero;
- page still reads correctly with images disabled because the SVG is decorative.

### 5. Give the contribution section its own identity

The three contribution cards are coherent but still feel like generic, identical SaaS cards. Refine them into three engineering chapters while preserving quick scanning.

Recommended direction:

- add restrained chapter markers `01`, `02`, `03` in Geist Mono;
- use ruled top or side lines that connect visually to the proof strip and diagram language;
- reduce the floating-panel impression;
- keep cobalt as the system/accent colour;
- use amber only for deliberate human/action emphasis;
- keep borders relatively square with modest radius;
- reduce or remove generic shadows;
- preserve the existing headings, descriptions and destination links.

Avoid making every card radically different. They should form one system with subtle internal variation, not three separate posters.

#### Acceptance criteria

- the cards feel native to the Vanden IT system rather than a reusable SaaS template;
- headings and links remain quickly scannable;
- keyboard focus is clearly visible;
- cards stack cleanly on mobile;
- no essential distinction depends on colour alone;
- the section does not visually compete with the hero.

### 6. Regression and quality pass

Test at minimum:

- 320 px overflow check;
- 360 px mobile;
- 390 px mobile;
- 768 px tablet;
- a typical laptop width;
- a wide desktop width.

Pages:

- `/`;
- `/about`;
- `/how-i-work`;
- `/posts`;
- `/contact`;
- `/posts/blind-coder-sighted-reviewer`.

Verify:

- keyboard navigation and focus order;
- one clear H1 per page;
- visible focus states;
- mobile navigation open, close, Escape and focus behaviour;
- minimum practical touch targets;
- contrast of muted text and system labels;
- no horizontal overflow;
- code blocks scroll internally on narrow screens;
- article headings and section spacing remain readable;
- `mailto:filip@vandenit.be` still works;
- decorative diagrams keep empty alt text or equivalent decorative treatment;
- TypeScript and production build pass;
- no production console errors.

The `content.tsx` spacing change should not be blindly reverted. The reviewed long article currently reads well. Make a change only if a concrete page regression is demonstrated.

## Operational note

One transient Cloudflare 520 response occurred during the live review and succeeded immediately after reload. This is not yet a confirmed defect. Check deployment/origin logs once; only open a separate task if logs or monitoring show repetition.

## Definition of done

Phase 2 is complete when:

- hydration is clean in a production build;
- the font and hero styling foundation no longer relies on CDN or inline-style hacks;
- the hero has a deliberate desktop balance and a legible mobile diagram;
- the contribution section expresses the same engineering language as the hero and proof strip;
- no legacy `.section-alt` usage remains;
- all named pages pass responsive, keyboard and console checks;
- no animation framework or unnecessary dependency has been added;
- `status.md` is updated with completed items, remaining issues, verification results and the exact commit/branch state.

## Agent hand-off format

At completion, update `status.md` with:

1. summary of changed files;
2. before/after description of hero ratios and mobile diagram sizing;
3. hydration root cause and fix;
4. build, TypeScript and route-test results;
5. viewport QA results;
6. accessibility checks performed;
7. items intentionally deferred to later phases;
8. screenshots or visual evidence paths, if produced;
9. commit hash and branch.

Stop and document the blocker instead of broadening scope if the hydration problem cannot be reproduced or fixed with evidence.
