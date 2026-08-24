# Current Site Audit — 23 August 2026

Inspected live pages:

- `https://vandenit.be/`
- `/how-i-work`
- `/about`
- `/posts`
- `/posts/blind-coder-sighted-reviewer`
- `/contact`

## What already works

- The positioning is now credible and focused: senior full-stack delivery and fractional technical leadership, strengthened by a controlled AI workflow.
- The hero copy communicates accountability rather than autonomous AI.
- The site has a coherent dark theme, clear primary CTAs and readable desktop spacing.
- The navigation exposes `aria-current="page"` on the active link.
- The viewport meta tag is present.
- The homepage canonical URL is present.
- Contact correctly links to `mailto:filip@vandenit.be`.
- Carousel buttons inspected on the homepage have accessible names.
- “The Story So Far” is now an H2.
- The current homepage metadata matches the newer positioning much better than the older audit/security wording.

## Why the site still feels generic

### 1. One compositional rhythm

Most page openings use the same pattern: centered badge, centered large heading, centered paragraph and centered CTAs. It is clean, but repeated use makes every page feel like a variation of the same SaaS template.

### 2. Cards carry too much of the visual identity

The homepage contribution section, portfolio, blog and parts of About rely on dark rounded rectangles with a blue accent. The information is readable, but the page lacks a unique visual grammar.

### 3. The current blue has no semantic role

Blue currently means active navigation, primary action, icons, borders and decorative emphasis. In the new system, cobalt should specifically represent automated/system activity. Amber should represent human judgment and decisive actions.

### 4. How I Work reads like formatted Markdown

The copy is strong, especially the sequence “Join and understand → Contribute → Improve → Leave durable practices” and the production incident example. Visually, however, these are headings and paragraphs rather than a connected process.

### 5. About lacks a meaningful human visual

The introductory profile panel contains a large flat circular visual. If no real portrait is available, do not ship a placeholder portrait shape. Replace it with a deliberate monogram, experience mark or human-checkpoint motif until a real portrait is supplied.

### 6. The case study has evidence but little visual storytelling

The article is detailed and convincing, but long passages, code blocks and ASCII diagrams dominate. It needs a stronger case header, reading metadata, a compact table of contents, real screenshots/diagrams and a proper score progression visual.

### 7. Blog and Contact should not be overdesigned

The blog currently contains one featured article and a lot of empty space. Contact is already appropriately direct. These pages should inherit the design system without receiving large decorative workflow diagrams.

## Technical observations

- The site is a Next.js application.
- Radix Themes classes (`rt-*`) are used extensively for sections, grids, cards and buttons.
- Geist and Geist Mono are loaded, but inspected Radix headings and controls resolved to the Radix/system font stack rather than Geist. Unify the font variables at the theme root.
- The current primary button computed as bright blue (`rgb(0, 144, 255)`) with a small 4px radius.
- The homepage has a Twitter image but no inspected `og:image`. Add one consistent 1200×630 social image and verify both Open Graph and Twitter metadata.

## Preserve during redesign

- Current page content and wording unless separately approved.
- Existing semantic heading structure.
- Simple contact path.
- Strong contrast and uncluttered navigation.
- Evidence-first tone.

## Change first

1. Global color roles, typography and ruled-line texture.
2. Header and buttons.
3. Homepage hero composition plus static system diagram.
4. How I Work process visualization.
5. Case-study shell and evidence visuals.
6. Remaining pages through lighter system accents.

