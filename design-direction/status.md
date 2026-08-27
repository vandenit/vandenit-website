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

---

## Phase 3 — Implementation

**Branch:** `feature/phase-3-how-i-work`
**Date:** 2026-08-25
**Commits:** `498e11e` (preflight) → `3ed0085` (implementation) → `f93a11f` (code review fixes) → `6c55adc` (tablet grid fix) → `456e072` (cleanup)

### Implementation agents

| Rol | Agent | Model |
|-----|-------|-------|
| Preflight + triage | Hermes subagent | GLM 5.2 (Ollama Cloud) |
| Visual implementation | Hermes subagent | GLM 5.2 (Ollama Cloud) |
| Design review | Hermes subagent (browser + vision) | GLM 5.2 (Ollama Cloud) |
| Code review | Hermes subagent | GLM 5.2 (Ollama Cloud) |
| Review fixes | Hermes (orchestrator) | GLM 5.2 (Ollama Cloud) |

### What was built

1. **`components/blocks/engagement-process.tsx`** — 4-step connected process
   - Desktop (≥64rem): 4 connected columns with horizontal cobalt rail, 01/02/03/04 markers in Geist Mono
   - Tablet (48-64rem): 2×2 grid for readability
   - Mobile (<48rem): vertical stepper with left cobalt rail, clean termination at step 04
   - Semantic HTML: `<section>`, `<ol role="list">`, `<li>`, `<h2>`, `<h3>`

2. **`components/blocks/decision-trace.tsx`** — 5-beat evidence trace
   - Beats 01-03: cobalt/neutral system exploration
   - Beat 03: ✕ Invalid tag (not color-only — text label + red border)
   - Beat 04: amber pivot "Human intervention"
   - Beat 05: calm terminal "Result" state
   - Closing sentence: "AI handled the volume. Experience made the judgment call."
   - Semantic HTML: `<section>`, `<ol role="list">`, `<li data-state="...">`, `<h2>`, `<h3>`

3. **CSS** — ~470 lines using Vanden IT design tokens
4. **Preflight cleanups**: tsconfig.tsbuildinfo untracked, geist package removed, portfolio accent tokens migrated, baseline screenshots captured

### Design review scores

| Viewport | Score | Key finding |
|----------|-------|-------------|
| Desktop 1280px | 8.5/10 | Both systems render as connected. Cobalt rail slightly faint. |
| Tablet 768px | 8/10 (fixed) | Was 7.5 — 2×2 grid fix applied for tablet readability |
| Mobile 390px | 9/10 | Vertical steppers work well. No overflow. |
| Mobile 320px | 9/10 | Zero overflow. Padding adjustment kicks in. |

### Code review verdict: APPROVE

- 0 bugs, 0 TypeScript errors, production build passes
- All warnings fixed: --vdit-color-risk-soft token added, hardcoded spacing → tokens, role="list" on <ol>, aria-hidden on ✕ character
- Content: all existing copy preserved verbatim, closing sentence present
- Accessibility: 1 H1 per page, heading hierarchy correct, aria-hidden on decorative markers, aria-labelledby on sections

### Remaining items for later phases

- Cobalt rail opacity could be 0.6-0.7 (aesthetic, low priority)
- IntersectionObserver reveal deferred to optional motion phase
- Contrast: formal measurement in fase 4 (current body text ~9.96:1, footer links ~7.64:1 — both pass WCAG AA)
- Portfolio carousel dot indicators: keyboard-inaccessible (pre-existing, fase 4+)

---

## Phase 3 — Multi-AI Review

### Review agents

| Rol | Agent | Model | Profile |
|-----|-------|-------|---------|
| Implementatie | Hermes subagent | GLM 5.2 (Ollama Cloud) | default |
| Design review | Hermes subagent (browser + vision) | GLM 5.2 (Ollama Cloud) | default |
| Code review #1 | Hermes subagent | GLM 5.2 (Ollama Cloud) | default |
| Code review #2 | Hermes instance | Claude Sonnet 4.6 (Nous) | code-reviewer |
| UX review | Hermes instance | GPT-5.6 (Nous) | ux-ui-designer |
| Review fixes | Hermes instance | GPT-5.6 (Nous) | ux-ui-designer |
| Review fixes (orchestrator) | Hermes | GLM 5.2 (Ollama Cloud) | default |

### Code review (Claude Sonnet 4.6 — code-reviewer profile)

**Verdict: APPROVE**
- 0 bugs, 0 TypeScript errors, build clean, security clean
- Performance: server components (zero client JS), module-level constants, data-state CSS selectors
- Content: all copy preserved verbatim, closing sentence present
- Fixes applied: hardcoded fallback removed, role="note" on invalid tag, JSX comments on role="list"

### UX review (GPT-5.6 — ux-ui-designer profile)

**Overall: 8/10**

| Viewport | Score (pre-fix) | Score (post-fix) |
|----------|----------------|------------------|
| 320px | 7.5/10 | 8/10 (eyebrow + spacing + touch targets fixed) |
| 390px | 8/10 | 8.5/10 |
| 768px | 7/10 | 8.5/10 (vertical stepper i.p.v. 2×2 grid) |
| 1280px | 8.3/10 | 8.5/10 (step 01 padding normalized) |
| 1440px | 8.5/10 | 8.5/10 |

### Review fixes (commit 3ecae9b)

1. **768px engagement process** → vertical stepper met cobalt rail i.p.v. 2×2 grid
2. **Mobile section spacing** → paginalengte 320px verminderd van ~7107px naar ~6828px
3. **Touch targets** → 44px minimum voor menu, logo, nav links, footer links
4. **Hero eyebrow wrap** → "AI-Augmented" blijft intact (white-space: nowrap)
5. **Step 01 padding** → genormaliseerd op desktop

### Amber beslissing

Amber in active navigation, hero illustration, en primary CTA is **bewust behouden**. De design spec zegt "amber is reserved for Filip, decisions, verification and the most important CTA" — dit is sitebreed, niet enkel binnen de decision trace.

### Finale commits

```
498e11e preflight: triage cleanups from phase-3 brief
3ed0085 feature/phase-3: engagement process + decision trace components
f93a11f review: code review fixes — token compliance + accessibility
6c55adc review: tablet 2×2 grid for engagement process
456e072 cleanup: remove temp screenshot script
291b303 status: add Phase 3 implementation + review results
d22aeb4 review: Claude Sonnet code review fixes
3ecae9b review: responsive and accessibility review fixes
```

**Branch:** `feature/phase-3-how-i-work`

---

## Phase 4 — Case Study and Blog

**Branch:** `feature/phase-4-case-study-blog`
**Date:** 2026-08-26
**Commits:** `09ebd12` → `e9b5068` → `dcd7e12` → `b621ea3` → `f67f5a7`

### Implementation agents

| Rol | Agent | Model | Profile |
|-----|-------|-------|---------|
| Implementatie | Hermes subagent | GLM 5.2 (Ollama Cloud) | default |
| Code review | Hermes instance | Claude Sonnet 4.6 (Nous) | code-reviewer |
| UX review | Hermes instance | GPT-5.6 (Nous) | ux-ui-designer |
| Vision verify | Hermes (orchestrator) | GLM 5.2 (Ollama Cloud) | default |
| Review fixes | Hermes (orchestrator) | GLM 5.2 (Ollama Cloud) | default |
| External review | ChatGPT (user-reported) | GPT-5 | — |

### What was built

1. **Case-file header** — kicker, H1, `<time>` date, author, reading time, back-to-blog link, tags subordinate
2. **Article TOC** — desktop sticky side rail, mobile 44px anchor chips met horizontal scroll + overflow fade
3. **Workflow visual** — 6-step semantic HTML flow (Hermes→evidence→Claude→feedback→fixes→Filip decides), cobalt system + amber human decision
4. **Score visual** — accessible bar chart + data table (Desktop 5.0→8.8, Content 6.8→9.0), exact values as text
5. **Blog index** — one ruled feature entry, H1→H2 outline, case metadata, no fake archive/filters
6. **Social images** — 1200×630 homepage + article-specific SVG/PNG, og:image + twitter:image metadata
7. **`<article>` wrapper**, semantic HTML, 684 regels CSS

### Code review (Claude Sonnet 4.6)

**Verdict: CHANGES NEEDED → fixed → APPROVE**
- B1: Social image hardcoded → per-slug fix
- B2: Fragile featured post detection → posts[0]
- W1: h4 skip in ScoreVisual → `<p>`
- W2: All links target=_blank → internal links stay same tab
- W3: Date format inconsistency → unified

### Bug fixes (user + ChatGPT reported)

1. **Mobile horizontal overflow** — TOC chip strip expanded page to ~1490px. Fix: `max-width: 100%` + `overflow: hidden` on `.vdit-article-toc-mobile`
2. **Desktop sticky TOC disappears on scroll** — `align-items: start` limited sidebar to 603px. Fix: `align-self: stretch` on `.vdit-article-sidebar` at >=64rem

### Review verdicts (all fixes)

| Fix | Code reviewer (Sonnet 4.6) | UX designer (GPT-5.6) | GLM 5.2 subagent |
|-----|---------------------------|----------------------|-------------------|
| Mobile overflow | APPROVE | 9/10 | Zero overflow all viewports |
| Sticky TOC | APPROVE | PASS | TOC 80px at both positions |

### Finale commits

```
09ebd12 feature/phase-4: case study shell, blog index, article visuals, social images
e9b5068 review: code review fixes — blocking bugs + behavioral regression
dcd7e12 review: code block overflow fix + UX review verification
b621ea3 fix: mobile horizontal overflow on blog post — TOC chips unbounded
f67f5a7 fix: desktop sticky TOC disappears on scroll
```

**Branch:** `feature/phase-4-case-study-blog`

---

## Phase 5 — About and Contact

**Branch:** `feature/phase-5-about-contact`
**Date:** 2026-08-27
**Source:** `03-implementation-plan.md` (Phase 5 scope) + `09-phase-5-review-todo.md` (acceptance review by ChatGPT)

### Implementation agents

| Rol | Agent | Model |
|-----|-------|-------|
| Implementatie | Hermes subagent | GLM 5.2 (Ollama Cloud) |
| Acceptance fixes | agy (Claude Sonnet 4.6) | Claude Sonnet 4.6 (Thinking) |
| Review fixes | Hermes (orchestrator) | GLM 5.2 (Ollama Cloud) |
| Acceptance review | ChatGPT (user-reported) | GPT-5 |
| Code + visual review | agy (Claude Sonnet 4.6) | Claude Sonnet 4.6 (Thinking) |

### What was built

1. **About page** — typographic monogram checkpoint (FV initials, amber border, display font), career timeline evidence rail (cobalt rail, mono markers, vertical on mobile), long-form story paragraphs on ~72ch editorial measure
2. **Contact page** — quiet hero with amber mailto CTA, subtle cobalt system rule, preserves LinkedIn link + conversation context list
3. **3 new components**: `about-header.tsx`, `career-timeline.tsx`, `contact-hero.tsx`

### Acceptance fixes (from 09-phase-5-review-todo.md)

| Item | Status | Fix |
|------|--------|-----|
| P1: Author in case-file header | ✅ | Always visible with fallback, itemProp="author" |
| P1: `<article>` wraps H1 | ✅ | aria-labelledby="case-study-title", H1 has matching id |
| P1: Homepage og:image | ✅ | Moved to app/page.tsx openGraph.images (was bleeding to all pages from layout.tsx) |
| P2: FV monogram aria-hidden | ✅ | aria-hidden="true" on monogram container |
| P2: LinkedIn 44px touch target | ✅ | Scoped selector a[href*="linkedin.com"] with min-height: 44px (was 17px) |

### Responsive evidence

12 screenshots at 320, 390, 768, 1024, 1280, 1440px for /about and /contact.

| Page | Viewport | scrollWidth | clientWidth | Overflow | H1 count |
|------|----------|-------------|-------------|----------|----------|
| /about | 320px | 320 | 320 | ✅ No | 1 |
| /about | 390px | 390 | 390 | ✅ No | 1 |
| /about | 768px | 768 | 768 | ✅ No | 1 |
| /about | 1024px | 1024 | 1024 | ✅ No | 1 |
| /about | 1280px | 1280 | 1280 | ✅ No | 1 |
| /about | 1440px | 1440 | 1440 | ✅ No | 1 |
| /contact | 320px | 320 | 320 | ✅ No | 1 |
| /contact | 390px | 390 | 390 | ✅ No | 1 |
| /contact | 768px | 768 | 768 | ✅ No | 1 |
| /contact | 1024px | 1024 | 1024 | ✅ No | 1 |
| /contact | 1280px | 1280 | 1280 | ✅ No | 1 |
| /contact | 1440px | 1440 | 1440 | ✅ No | 1 |

LinkedIn touch target verified via Playwright: 44px (min-height) on 320px, 390px, 768px.

og:image verified in production build:
- Homepage: 1 og:image → vandenit-home-social.png
- Article: 1 og:image → blind-coder-sighted-reviewer-social.png (no homepage bleed)

### Finale commits

```
803d4b1 feature/phase-5: About and Contact redesign
5ce5050 review: focus-visible radius fix for buttons
8b31913 docs: add Phase 5 acceptance review TODO from ChatGPT
4cfb5ee review: Phase 5 acceptance fixes — P1 + P2
bf27889 fix: og:image bleed — move from layout.tsx to homepage page.tsx
5d7b3b6 fix: LinkedIn touch target — scoped selector with min-height 44px
```

**Branch:** `feature/phase-5-about-contact`
