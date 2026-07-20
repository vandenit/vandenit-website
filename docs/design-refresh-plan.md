# Design Refresh Plan — Vanden IT Website

> Branch: `feature/design-refresh-v2` (from clean `main`)  
> Date: 2026-07-19  
> Status: **Ready for implementation**  
> Previous attempt: `feature/design-refresh` — abandoned due to hacks and broken standalone build

---

## Context

The Vanden IT website (`vandenit.be`) is a Next.js 15 + Radix UI Themes + Contentlayer site.  
It currently works but looks generic — standard Radix dark theme, no visual identity, basic layout.  
The goal is to make it look professional, modern, and original while staying 100% within Radix UI best practices.

---

## ⚠️ Lessons Learned (from previous attempt)

### 1. NEVER bypass Radix UI with custom HTML/CSS
The previous attempt replaced Radix `Flex`/`Box` components with plain `<div>` elements and inline styles. This broke the standalone build because:
- Radix UI's responsive CSS classes (`rt-r-display-none`, `sm:rt-r-display-flex`) were not generated
- Custom CSS in `styles.css` was tree-shaken away in `output: 'standalone'` mode
- Inline styles couldn't be overridden by media queries

**Rule: Always use Radix UI components (`Box`, `Flex`, `Container`, `Section`, `Text`, `Heading`, `Link`, `Button`, `Card`) with their built-in responsive props.**

### 2. NEVER use `<style dangerouslySetInnerHTML>` hacks
A `<style>` tag was injected into `app/layout.tsx` `<head>` to force CSS media queries. This is a hack that:
- Pollutes the HTML with inline CSS
- Duplicates what Radix UI already handles via responsive props
- Is fragile and unmaintainable

**Rule: If Radix UI's responsive props don't work in standalone builds, the problem is the build config, not the CSS. Fix the root cause.**

### 3. NEVER create extra CSS files as workarounds
`styles-nav.css` was created as a separate import to survive CSS optimization. This is unnecessary if Radix UI components are used correctly.

**Rule: All styling should go through Radix UI's component props or the single `styles.css` file. No extra CSS files.**

### 4. The standalone build (`output: 'standalone'`) strips unused CSS
Next.js 15's standalone build optimizes CSS aggressively. Classes that appear only in CSS but not in the server-rendered HTML get removed. This means:
- Custom CSS classes (like `.nav-desktop`, `.nav-mobile`) may get stripped
- Radix UI's responsive utility classes ARE preserved (they're part of `@radix-ui/themes/styles.css`)

**Rule: Use Radix UI components so their CSS is always included. Don't add custom classes that duplicate Radix functionality.**

### 5. The dev server works — use it for testing
The dev server (`npx next dev` after `npx contentlayer build`) works correctly. It loads all CSS, fonts, and Radix styles. The standalone build is only needed for Docker production deployment.

**Rule: Always test in the dev server first. Only test the standalone build before merging.**

### 6. Contentlayer + Next.js 15 compatibility
`contentlayer@0.3.4` + `next-contentlayer@0.3.4` have a known `TypeError` in the CLI exit code. This is **non-fatal** — content is generated correctly, the error is only in the exit code handler (`clipanion`).

To run the dev server:
```bash
npx contentlayer build    # generates .contentlayer/ (ignores TypeError)
npx next dev              # starts dev server on port 3000
```

Do NOT use `pnpm dev` directly — the `contentlayer dev & next dev` script fails because `contentlayer dev` crashes.

**Rule: Always run `npx contentlayer build` first, then `npx next dev` separately.**

---

## Radix UI Best Practices

### Components to use (from the docs)

| Need | Component | Key props |
|------|-----------|-----------|
| Layout container | `Container` | `size="3"`, `px="6"` |
| Flex layout | `Flex` | `direction`, `align`, `justify`, `gap`, `display`, `width` |
| Box (div) | `Box` | `p`, `py`, `pt`, `width`, `height`, `position` |
| Section spacing | `Section` | `mb`, `pb`, `pt` |
| Grid layout | `Grid` | `columns`, `gap` |
| Heading | `Heading` | `as="h1"`, `size`, `align`, `mb`, `weight` |
| Body text | `Text` | `as="p"`, `size`, `color="gray"`, `mb` |
| Links | `Link` (from Radix) | `href`, `color`, `weight` — OR use `next/link` with Radix `Link asChild` |
| Buttons | `Button` | `variant="solid"|"soft"|"outline"|"ghost"`, `size`, `color` |
| Cards | `Card` | `size`, `variant` |
| Avatars | `Avatar` | `src`, `alt`, `size`, `radius="full"`, `fallback` |
| Badges/pills | `Badge` | `size`, `variant="soft"`, `color` |
| Dropdown menu | `DropdownMenu` | `.Root`, `.Trigger`, `.Content`, `.Item` |
| Icon buttons | `IconButton` | `size`, `variant`, `color` |

### Breakpoints (from Radix docs)

| Key | Width | Description |
|-----|-------|-------------|
| `initial` | 0px | Phones (portrait) |
| `xs` | 520px | Phones (landscape) |
| `sm` | 768px | Tablets (portrait) |
| `md` | 1024px | Tablets (landscape) |
| `lg` | 1280px | Desktops |
| `xl` | 1640px | Large desktops |

**Use `sm` (768px) as the mobile/desktop breakpoint.**

### Responsive props (from Radix docs)

All layout props accept a responsive object:
```tsx
<Flex display={{ initial: 'none', sm: 'flex' }}>  // hidden on mobile, visible from 768px
<Flex display={{ initial: 'flex', sm: 'none' }}>  // visible on mobile, hidden from 768px
<Heading size={{ initial: '6', sm: '9' }}>         // smaller on mobile, larger on desktop
```

### Link pattern (Radix + Next.js)

```tsx
import { Link as RadixLink } from "@radix-ui/themes";
import Link from "next/link";

// Option 1: Radix Link with asChild (NO nested <a> — see hydration fix below)
<RadixLink asChild>
  <Link href="/about">About</Link>
</RadixLink>

// Option 2: Just next/link (simpler, no Radix styling)
<Link href="/about" style={{ color: 'var(--gray-11)', textDecoration: 'none' }}>
  About
</Link>
```

**⚠️ IMPORTANT: The `RadixLink asChild + Link` pattern creates nested `<a>` tags which causes hydration errors. This was fixed in `feature/hermes-podcast-blog` by removing all `RadixLink asChild` wrappers. The fix uses plain `next/link` with inline styles for nav links, and Radix `Link` (without `asChild`) only where the Radix Link styling is needed and no Next.js routing is required.**

For the design refresh: use plain `next/link` with Radix `Text`/`Heading` for styled content, OR use Radix `Link` directly (not `asChild`) for simple links that don't need Next.js routing.

### Theme configuration

In `app/layout.tsx`, the `Theme` component controls global appearance:
```tsx
<Theme
  accentColor="blue"      // brand accent
  grayColor="gray"         // gray scale
  panelBackground="translucent"
  radius="medium"          // was "full" — too rounded, change to "medium"
  scaling="100%"
>
```

---

## Design Goals

### 1. Typography: Geist font
- Load via Google Fonts CDN `<link>` in `app/layout.tsx` `<head>`
- Apply in `styles.css`: `body { font-family: 'Geist', system-ui, sans-serif; }`
- Add negative letter-spacing on headings: `h1 { letter-spacing: -0.03em; }`
- Code: `'Geist Mono'` for `code, pre, kbd`

### 2. Sticky header with blur
- Use Radix `Box` with `position="sticky"` `top="0"` and `className="header-blur"`
- `.header-blur` in `styles.css`: `backdrop-filter: blur(12px) saturate(180%); background: rgba(8,8,10,0.7); border-bottom: 1px solid rgba(255,255,255,0.06);`
- Inside: `Container` > `Flex align="center" justify="between"` > `NavItems`

### 3. Navigation (Radix responsive props)
- Desktop nav: `Flex display={{ initial: 'none', sm: 'flex' }}` with logo + links + CTA
- Mobile nav: `Flex display={{ initial: 'flex', sm: 'none' }}` with logo + hamburger dropdown
- Nav links: plain `next/link` with inline styles (hover, active states)
- CTA button: `next/link` styled as button with accent color
- Nav items from `globalSettings.header.nav` (CMS-driven, with fallback defaults)

### 4. Hero section
- `Section` with `pt="9"` (reduce from 6rem — the review said too much space)
- Badge: `Badge` component with short label ("Software Consultancy" — NOT the tagline)
- H1: `Heading as="h1" size={{ initial: '8', sm: '9' }}` with tagline (short text as H1)
- Subtext: `Text as="p" size="5" color="gray"` with headline (longer description)
- CTA buttons: primary with accent color (`var(--accent-9)` background), secondary outline
- Background: subtle radial gradient via CSS class `.hero-section`

### 5. Feature cards
- `Grid columns={{ initial: '1', sm: '3' }} gap="4"`
- `Card` with `className="card-elevated"` for hover shadow
- Icon in `Box` with rounded background
- Title: `Heading size="4" weight="bold"`
- Arrow link: `Link` with `BsArrowRight` and gap animation

### 6. Blog overview
- `Badge` for "Blog" header
- `Heading` for "Security & Development"
- Featured post: `Card` with `card-elevated` class, "Featured" badge
- Post cards: `Card` with `card-elevated`, title as `Link`, tags as `Badge` pills

### 7. Testimonials
- `Grid columns={{ initial: '1', sm: '3' }} gap="4"`
- `Card` with large quote mark, testimonial text, divider, author info

### 8. Footer
- Top border, logo + social icons, copyright
- Clean, minimal — `Container` > `Flex justify="between"`

---

## Design Review Points (from Claude review)

These were identified in the previous attempt and must be respected:

1. ✅ H1 = short tagline ("Building Scalable Solutions..."), subtext = long description
2. ✅ Hero badge = "Software Consultancy" (not duplicating H1)
3. ✅ Hero paddingTop = `4rem` (not 6rem)
4. ✅ Primary CTA = accent color (`var(--accent-9)`), not gray
5. ✅ Nav items = CMS-driven from `globalSettings.header.nav`
6. ✅ Subtle background gradient in hero section
7. ✅ No CSS bugs — all `styles.css` rules must be complete and valid
8. ✅ Mobile nav must work — use Radix `display={{ initial: 'flex', sm: 'none' }}`

---

## CSS Changes (styles.css only)

Add these utility classes to the existing `styles.css` (do NOT create extra CSS files):

```css
/* Geist font */
body {
  font-family: 'Geist', system-ui, -apple-system, sans-serif;
  font-feature-settings: "liga" 1;
}
code, pre, kbd, samp {
  font-family: 'Geist Mono', ui-monospace, SFMono-Regular, Menlo, monospace;
}

/* Heading letter-spacing */
h1 { letter-spacing: -0.03em; }
h2 { letter-spacing: -0.025em; }
h3, h4, h5, h6 { letter-spacing: -0.02em; }

/* Header blur */
.header-blur {
  backdrop-filter: blur(12px) saturate(180%);
  background: rgba(8, 8, 10, 0.7);
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

/* Hero section gradient */
.hero-section {
  position: relative;
}
.hero-section::before {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse 80% 50% at 50% -10%, rgba(59, 130, 246, 0.08), transparent);
  pointer-events: none;
  z-index: 0;
}

/* Card elevation */
.card-elevated {
  box-shadow:
    0 0 0 1px rgba(255, 255, 255, 0.06),
    0 2px 4px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.2s ease, transform 0.2s ease;
}
.card-elevated:hover {
  box-shadow:
    0 0 0 1px rgba(255, 255, 255, 0.1),
    0 8px 24px rgba(0, 0, 0, 0.2);
  transform: translateY(-2px);
}

/* Tag pill */
.tag-pill {
  display: inline-flex;
  align-items: center;
  padding: 2px 10px;
  border-radius: 9999px;
  font-size: 12px;
  font-weight: 500;
  background: var(--gray-5);
  color: var(--gray-11);
  border: 1px solid var(--gray-6);
  transition: all 0.15s ease;
}
.tag-pill:hover {
  background: var(--accent-5);
  color: var(--accent-11);
  border-color: var(--accent-6);
}

/* Custom scrollbar */
::-webkit-scrollbar { width: 10px; height: 10px; }
::-webkit-scrollbar-track { background: var(--gray-2); }
::-webkit-scrollbar-thumb { background: var(--gray-6); border-radius: 5px; border: 2px solid var(--gray-2); }
::-webkit-scrollbar-thumb:hover { background: var(--gray-7); }

/* Selection */
::selection { background: var(--accent-5); color: var(--accent-12); }
```

---

## Files to Change

| File | Change | Priority |
|------|--------|----------|
| `app/layout.tsx` | Add Geist font `<link>`, change `radius="full"` to `radius="medium"` | 1 |
| `styles.css` | Add Geist font, header-blur, hero-section, card-elevated, tag-pill, scrollbar, selection | 1 |
| `components/nav/header.tsx` | Sticky `Box` with `header-blur` class, `Container` > `Flex` > `NavItems` with `navs` prop | 2 |
| `components/nav/nav-items.tsx` | Radix `Flex` with `display={{ initial: 'none', sm: 'flex' }}` (desktop) and `display={{ initial: 'flex', sm: 'none' }}` (mobile). Nav items from `globalSettings.header.nav`. Plain `next/link` for links (no `RadixLink asChild`). | 2 |
| `components/nav/footer.tsx` | Clean footer with social icons, top border | 3 |
| `components/blocks/hero.tsx` | `Badge` for label, `Heading` for H1 (tagline), `Text` for subtext (headline), CTA buttons with accent | 3 |
| `components/blocks/features.tsx` | `Card` with `card-elevated` class, icon box, arrow links | 4 |
| `components/blocks/testimonial-carousel.tsx` | `Card` with quote marks, author divider | 4 |
| `app/posts/client-page.tsx` | `Badge` for "Blog" header, `Card` for posts with `card-elevated` | 5 |
| `app/posts/[...filename]/client-page.tsx` | Centered header, `Badge` for tags, rounded hero image | 5 |
| `app/posts/tag-filter-panel.tsx` | `Badge` pills for tags, `Link` (plain) for filter | 5 |

---

## Prerequisites (from feature/hermes-podcast-blog)

These fixes are needed before the design refresh (they're on `main` already if PR #29 is merged):
- Next.js 15 async `params`/`searchParams` in dynamic routes
- ESLint `no-unused-vars` cleanup
- Hydration error fixes (remove `RadixLink asChild` + `Link` nested anchors)
- Node 22 in Dockerfile
- GitHub Actions updated to v4/v6

**Check: is PR #29 merged? If not, these fixes need to be applied first.**

---

## Testing Protocol

1. Run `npx contentlayer build` (ignore TypeError)
2. Run `npx next dev -p 3002`
3. Verify all pages return 200: `/`, `/about`, `/posts`, `/contact`, `/posts/posts/owasp-top-3-vulnerabilities-2024`
4. Test mobile (390px viewport) — only mobile nav visible, no duplicate nav
5. Test desktop (1280px) — only desktop nav visible
6. Check 0 hydration errors in console
7. Take screenshots for visual review
8. Expose via `tailscale serve --bg --https 3002 http://localhost:3002`
9. Get user approval before committing

---

## Vision Sub-Agent for UI Validation

### Antigravity (agy) + Claude Sonnet 4.6 — WORKING

The main model (`glm-5.2` via Ollama Cloud) does not support image input. However, Antigravity CLI (`agy` v1.0.12) is installed and provides access to Claude Sonnet 4.6 with vision capability.

**Available agy models with vision:**
```
Claude Sonnet 4.6 (Thinking)    ← best for design review
Claude Opus 4.6 (Thinking)      ← even better, more expensive
Gemini 3.5 Flash (Medium)       ← fast, free
Gemini 3.1 Pro (High)           ← good alternative
```

### How to use for UI validation

**One-shot analysis (preferred):**
```bash
agy -p "You are a senior UI/UX designer. Analyze the screenshot at /path/to/screenshot.png. 
Assess: header, hero, typography, colors, layout, cards, footer, broken elements.
Give top 5 improvements." \
  --model "Claude Sonnet 4.6 (Thinking)" \
  --dangerously-skip-permissions \
  --print-timeout 10m
```

**Full report saved to agy brain:**
The first assessment is saved at `docs/vandenit-design-assessment-claude.md` and covers 9 areas with a 5/10 verdict.

### Why this works
- `agy` uses Google Antigravity's auth (separate from Hermes providers)
- Claude Sonnet 4.6 has native vision + excellent design reasoning
- `--dangerously-skip-permissions` needed because headless mode can't prompt for tool approvals
- `--print-timeout 10m` gives Claude time to think and write

### Hermes auxiliary.vision — NOT WORKING
`auxiliary.vision` was configured with `qwen2.5-vl:7b` on Ollama Cloud, but Ollama Cloud has **no vision models** available. The config can be removed. Use `agy` instead for all vision tasks.

### Existing assessment
See `docs/vandenit-design-assessment-claude.md` for the full Claude Sonnet design review of the current live site (vandenit.be). Key findings:
- **5/10** — structurally fine, visually forgettable
- Dark navbar on white page = jarring split
- No visual in hero (white void)
- Inconsistent icon accent colors (blue, yellow, red)
- CTA hierarchy inverted
- Generic hero copy ("cutting-edge technologies")
- Top 5 fixes documented in the assessment

---

## Library Status

| Package | Current | Latest compatible | Notes |
|---------|---------|-------------------|-------|
| `next` | 14.2.21 | 15.5.19 | Must upgrade for security + Next 15 features |
| `eslint-config-next` | 14.2.4 | 15.5.19 | Must match next version |
| `contentlayer` | 0.3.4 | 0.3.4 (EOL) | No newer version — TypeError is permanent, non-fatal |
| `next-contentlayer` | 0.3.4 | 0.3.4 | Peer dep says `next ^12||^13` but works with 15 |
| `@radix-ui/themes` | 3.1.6 | 3.1.6 | Current — no upgrade needed |
| `react` | 18.3.1 | 18.3.1 | Stay on 18 (Radix not yet React 19 compatible) |
| `geist` (npm) | — | DO NOT USE | Breaks with `next/font` in standalone. Use Google Fonts CDN instead. |
| Node (Dockerfile) | 20 | 22 LTS | Update to `node:22-alpine` |

---

## Summary

- Start from clean `main`
- Use ONLY Radix UI components with responsive props
- All custom CSS goes in the single `styles.css` file
- No `<style>` tags in JSX, no extra CSS files, no `dangerouslySetInnerHTML`
- Test in dev server (`npx next dev`) before standalone build
- Geist font via Google Fonts CDN, not npm package
- Respect all 8 design review points