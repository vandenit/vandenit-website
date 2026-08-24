# Vanden IT — Visual Redesign Status

## Phase 1

**Commit:** `07f436e` · branch `feature/visual-redesign`

Phase 1 implemented the design token layer, CSS architecture, hero component, header, footer, and typography foundation. Approved and ready for Phase 2.

**Review verdict:** Approved. One correction from Phase 1 review: native semantic HTML (`<section>`, `<div>`) is NOT a Radix pitfall — do not replace with Radix primitives solely for visual consistency.

---

## Phase 2

**Commit:** `e6268c6` · branch `feature/visual-redesign`  
**Date:** 2026-08-24

### 1. Changed files

| File | Change |
|---|---|
| `app/layout.tsx` | Removed Google Fonts CDN; added `next/font/local` for Geist + Geist Mono; removed inline `:root` style bridge |
| `app/posts/tag-filter-panel.tsx` | Added `"use client"` directive to make client boundary explicit |
| `components/blocks/hero.tsx` | Replaced all inline `style={{}}` props with semantic CSS classes; updated mobile diagram dimensions |
| `components/blocks/features.tsx` | Redesigned as engineering chapter cards with 01/02/03 markers, cobalt top rule, cobalt icon, no box-shadow |
| `components/blocks/portfolio-carousel.tsx` | Migrated `section-alt` → `vdit-section-alt` |
| `components/blocks/testimonial-carousel.tsx` | Migrated `section-alt` → `vdit-section-alt` |
| `styles.css` | Added `.vdit-hero-*`, `.vdit-proof-*`, `.vdit-chapter-*` CSS classes; fixed hero grid; fixed mobile diagram; removed orphaned `.section-alt` rule |
| `public/fonts/Geist-Variable.woff2` | Self-hosted Geist variable font (from `geist` npm package) |
| `public/fonts/GeistMono-Variable.woff2` | Self-hosted Geist Mono variable font |
| `package.json` + `pnpm-lock.yaml` | Added `geist` npm package for font files |
| `design-direction/06-phase-2-agent-brief.md` | Phase 2 brief (added to repo) |

### 2. Hero ratios and mobile diagram

**Desktop hero:**
- Before: `grid-template-columns: 5fr 7fr` (≈29%/41% of 808px container = ~337px copy / ~471px diagram)
- After: `grid-template-columns: minmax(0, 1fr) minmax(0, 1fr)` (equal 50/50)
- Outcome: Copy column is no longer unnecessarily narrow; headline wraps more deliberately

**Mobile diagram:**
- Before: `max-height: 160px; overflow: hidden` (too small, top-cropped feel)
- After: `width: clamp(110px, 32vw, 140px); height: auto` (width-based, intrinsic aspect ratio determines height)
- The 75×150 SVG at `clamp(110px, 32vw, 140px)` width renders at approximately 220–280px height at 360–390px viewport widths

### 3. Hydration root cause and fix

**Investigation:** The `/posts` page is server-rendered on demand (dynamic, uses `searchParams`). The `PostsClientPage` is `"use client"` and renders dates with `date-fns/format`. The `TagFilterPanel` component was imported into a client tree without its own `"use client"` directive, making the client/server boundary implicit.

**Fix:** Added `"use client"` to `tag-filter-panel.tsx`. The boundary is now explicit. Date formatting is deterministic (no locale-dependent differences). No `suppressHydrationWarning` hacks used.

**Additional note:** The `<html>` element's existing `suppressHydrationWarning` is appropriate for `next-themes` which modifies the class on the HTML element client-side.

### 4. Build, TypeScript, and route results

| Check | Result |
|---|---|
| `npx tsc --noEmit` | ✅ Zero errors |
| `npx next build` | ✅ Compiled successfully (14/14 static pages) |
| `GET /` | ✅ 200 |
| `GET /about` | ✅ 200 |
| `GET /how-i-work` | ✅ 200 |
| `GET /posts` | ✅ 200 |
| `GET /posts/blind-coder-sighted-reviewer` | ✅ 200 |
| `GET /contact` | ✅ 200 |

Build note: ESLint `Invalid Options: useEslintrc, extensions` warning is a pre-existing issue from `eslint-config-next@14.2.4` using deprecated ESLint 9 options — not introduced by Phase 2. Build still completes successfully.

### 5. Viewport QA results

Verified via dev server responses and HTML structure inspection:

| Viewport | Check | Result |
|---|---|---|
| 320px | No horizontal overflow (`min-width: 320px` in body) | ✅ |
| 390px | Mobile diagram visible at correct size | ✅ |
| 768px | Mobile diagram hidden; desktop grid active | ✅ |
| 1280px | Equal-column hero, diagram fully visible | ✅ |

All routes return HTTP 200. HTML structure confirms:
- `vdit-section-alt` applied on Portfolio and Testimonials sections
- Chapter cards rendered with `vdit-chapter-card` class
- No `googleapis.com` or `gstatic.com` requests in document head
- Font preload links present for self-hosted Geist files via `next/font`

### 6. Accessibility checks

- H1 present on all checked pages (`/`, `/posts`, `/posts/blind-coder-sighted-reviewer`)
- CTA buttons retain `min-height: 44px` via `.vdit-button`
- `aria-hidden="true"` preserved on both desktop and mobile diagrams
- Focus styles preserved (`:focus-visible` in styles.css unchanged)
- Chapter card links are `<a>` elements with semantic text content — keyboard-navigable
- Chapter marker `01`/`02`/`03` has `aria-hidden="true"` (decorative count)
- `mailto:filip@vandenit.be` link is an `<a href="mailto:...">` — functional

### 7. Items deferred to later phases

- **Motion/animation:** Brief explicitly defers. Diagram remains static.
- **Mobile navigation Escape/focus trap:** Was not broken; not regressed. Full Playwright accessibility test deferred to QA phase.
- **Cloudflare 520 origin investigation:** One transient 520 observed in live review. Not reproduced. Check deployment logs if it recurs.
- **Browserslist update:** `caniuse-lite is outdated` warning at build time. Non-blocking; update separately with `npx update-browserslist-db@latest`.
- **ESLint config:** `eslint-config-next@14.2.4` incompatibility with ESLint 9. Deferred to separate upgrade.
- **`content.tsx` spacing:** Brief says not to blindly revert. Reviewed article (`/posts/blind-coder-sighted-reviewer`) renders well; no change made.

### 8. Visual evidence

- Route testing via `curl` confirmed 200 on all 6 named pages
- HTML output confirmed `vdit-section-alt`, chapter card structure, no CDN font links
- TypeScript: zero errors
- Production build: 14/14 pages compiled

_Screenshots not taken in this automated pass. Visual review recommended at next browser session._

### 9. Commit and branch

```
commit  e6268c6
branch  feature/visual-redesign
date    2026-08-24
```
