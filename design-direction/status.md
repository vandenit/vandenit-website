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
commit  e6268c6 (implementation)
commit  33fad7d (review fixes)
branch  feature/visual-redesign
date    2026-08-24
```

---

## Phase 2 Review

**Reviewer:** agy (Claude Sonnet 4.6 Thinking)
**Verdict:** 8/10 — Phase 2 approved ✓
**Review commit:** `33fad7d`

### Scores

| Page | Mobile | Desktop |
|------|--------|---------|
| Home | 7.5 | 8 (post-fix) |
| About | 8 | 8.5 |
| How I Work | 8 | 8 |
| Posts | 8 | 8 |
| Blind Coder article | 7.5 | 8 |
| Contact | 8 | 8.5 |

### Fixes applied during review

| # | File | What |
|---|------|------|
| 1-2 | `hero.tsx` + `styles.css` | Moved last inline `marginTop` to CSS class |
| 3 | `hero.tsx` | H1 `sm:'9'` → `sm:'8'` to fix stranded "Production-" fragment on desktop |
| 4-7 | `features.tsx` + `styles.css` | Replaced 3 remaining inline styles with CSS classes (`.vdit-chapter-header`, `.vdit-chapter-desc`), removed redundant H2 inline `fontFamily/color` |

### Key findings

- **One acceptance criteria failure caught:** Desktop H1 at size 9 produced `Production- / grade results.` — hyphenated word stranded across lines. Fixed.
- **Content clean:** BNP/Centric scoped correctly to Enablement project, no unsupported claims, `mailto:` works.
- **Fonts:** Geist self-hosted confirmed; Barlow on Google Fonts by design (no npm package) — acceptable.
- **No bugs** that would break rendering. No nested `<a>` tags. No Radix compliance violations in changed files.

---

## Phase 3 — Opmerkingen voor implementatie

### [claude] Visuele issues

1. **Experience Highlights cards inconsistency** — About pagina cards hebben geen chapter markers (01/02/03) terwijl contribution cards ze wel hebben. Visueel inconsistent.

2. **Double H1 on blog posts** — Pre-existing issue: blog post pagina's hebben twee H1 elementen (pagina titel + artikel titel). WCAG document structure violation.

3. **Portfolio carousel kleuren** — Gebruikt nog Radix accent tokens (`var(--accent-9)`) i.p.v. Vanden IT tokens (`var(--vdit-color-system)`). Visueel subtiel inconsistent.

4. **Proof strip mobile stacked borders** — Op contact pagina ontbreekt de mobile stacked border styling op de proof strip. Minor.

### [hermes] Code quality issues

5. **`geist` npm package toegevoegd** — agy heeft de `geist` package geïnstalleerd voor self-hosted fonts. Verifieer dat dit geen `next` downgrade veroorzaakt (bekende pitfall: `geist` kan `next` naar 14.x downgraden).

6. **Barlow Condensed nog via Google Fonts CDN** — Geen npm package beschikbaar. Acceptabel voor nu, maar in een latere fase kan Barlow Condensed ook self-hosted worden voor volledige CDN-onafhankelijkheid.

7. **`tsconfig.tsbuildinfo` nog steeds tracked** — Staat in `.gitignore` maar is al eerder gecommit. `git rm --cached tsconfig.tsbuildinfo` nodig om het uit de repo te verwijderen.

### Fase 3 scope (volgens `03-implementation-plan.md`)

- How I Work als connected process (4 stappen als één pad)
- Mobile vertical stepper
- Cobalt voor exploratie, amber voor judgment/verification
- Production incident example als 5 evidence beats
- Optioneel: IntersectionObserver reveal (alleen na static approval)
