# Vanden IT — Phase 5 Acceptance Review & TODO

**Review date:** 2026-08-27  
**Live target:** https://vandenit.be/  
**Primary implementation source:** `03-implementation-plan.md`, Phase 5 — About and Contact  
**Supporting sources:** `00-agent-brief.md`, `02-design-system.md`, `04-performance-accessibility.md`, `08-phase-4-agent-brief.md`, newest current `status.md` (Drive ID `1MPA8yCQo-OeQWFQm_k_IsWfoTpNdB91t`)

## Verdict

**REQUEST CHANGES — small, bounded acceptance pass.**

The visible Phase 5 implementation follows the original Phase 5 scope well. Do **not** redesign About or Contact again. The remaining work is a short regression/semantics pass plus the missing Phase 5 hand-off and responsive evidence.

The source-of-truth ambiguity is real:

- Phase 4 has a detailed standalone agent brief.
- Phase 5 has no standalone brief in Drive.
- Phase 5 is defined only by the short section in `03-implementation-plan.md`, with project-wide rules in the agent brief, design system, and accessibility guardrails.
- The newest `status.md` documents Phase 4 through commit `f67f5a7`, but contains no Phase 5 branch, commits, changed files, screenshots, tests, or review results.

This TODO is the acceptance brief for the current Phase 5 implementation. Keep the scope below; do not infer a new visual direction.

## What is already correct — preserve it

### About

- The old flat portrait placeholder has been replaced by a deliberate `FV` monogram. This satisfies the fallback requirement when no publishable portrait is supplied.
- The career highlights render as semantic ordered content and as a restrained cobalt evidence rail on desktop.
- The rail becomes a vertical timeline below the desktop breakpoint in the deployed CSS.
- Long story paragraphs remain on a comfortable editorial measure.
- The page has one H1 and a logical H1 → H2/H3 hierarchy.
- The existing embedded positioning is preserved: senior engineer and fractional tech lead first; AI workflow improvement as part of real delivery work.

### Contact

- The page remains quiet and direct.
- There is one amber primary action: `filip@vandenit.be`.
- The subtle cobalt system rule is present.
- No unnecessary workflow diagram or form was added.
- `mailto:filip@vandenit.be` and the LinkedIn option are preserved.
- The page has one H1 and a logical heading hierarchy.

### Phase 4 regressions already confirmed fixed

- The article desktop TOC remains sticky at `top: 80px` after scrolling to 3500px.
- The sidebar now stretches to the full article height (`align-self: stretch`).
- No page-level horizontal overflow was present at the reviewed 1353px desktop viewport.
- The two social PNG assets resolve and are exactly 1200×630.
- Code blocks and tables remain internally scrollable.
- All six standard routes render one H1, intact header/footer, and no broken images at the reviewed desktop viewport.
- No Vanden IT application errors appeared in the console; logged errors came from the browser extension only.

## Required fixes

### P1 — Restore the article author in the case-file header

The Phase 4 brief requires date, author, reading time, and back-to-blog link. The live header currently contains:

- `Published` + date;
- `Reading time` + `9 min`;
- `Back to blog`;
- tags.

It contains **no visible author**, no `rel="author"`, no `itemprop="author"`, and no `meta[name="author"]`.

Add a visible author item using the real published name already used on the site:

```text
AUTHOR
Filip Van den Broeck
```

Recommended semantics:

```html
<span class="vdit-article-meta-item">
  <span class="vdit-article-meta-label">Author</span>
  <span itemprop="author">Filip Van den Broeck</span>
</span>
```

Using a link to `/about` is acceptable if it fits the existing header, but do not force a new interaction solely for semantics.

### P1 — Make the semantic `<article>` represent the whole case study

The live H1 and case-file metadata are outside the `<article>`. The `<article class="vdit-article-body">` begins at the first body paragraph, has no heading of its own, and has no `aria-labelledby`.

The semantic article should include its title/header and body. Preferred structure:

```html
<article aria-labelledby="case-study-title">
  <header class="vdit-article-header">
    <h1 id="case-study-title">...</h1>
    ...metadata...
  </header>

  <div class="vdit-article-layout">
    ...TOC...
    <div class="vdit-article-body">...</div>
  </div>
</article>
```

Do not nest a second `<article>`. Preserve the current layout and exactly one H1.

### P1 — Add the missing homepage `og:image`

The deployed homepage exposes:

```html
<meta name="twitter:image" content="https://vandenit.be/social/vandenit-home-social.png">
```

but no Open Graph image meta element is present. This contradicts the Phase 4 definition of done and the newest `status.md` claim.

Add and verify:

```html
<meta property="og:image" content="https://vandenit.be/social/vandenit-home-social.png">
```

Keep the existing article-specific `og:image` and `twitter:image` unchanged. Verify the final rendered HTML, not only the Next.js metadata object.

### P1 — Produce the missing Phase 5 responsive acceptance evidence

The project-wide guardrails require testing at:

- 320px;
- 390px;
- 768px;
- 1024px;
- 1280px;
- 1440px;
- at least one real mobile browser smoke test.

For `/about` and `/contact`, record screenshots and measured results for:

- no page-level horizontal overflow;
- one H1 and logical heading hierarchy;
- readable text with no clipped headings or timeline content;
- About timeline switching to a vertical path on mobile/tablet;
- 44×44px mobile targets for actionable controls;
- visible keyboard focus;
- reduced-motion final/static state;
- no application console errors.

Also regression-check `/posts/blind-coder-sighted-reviewer` at 320, 390, 768, 1280, and 1440px for TOC/chip overflow and sticky desktop behavior.

HTML/CSS inspection alone is not viewport QA. Attach rendered screenshots and the measured `scrollWidth === clientWidth` result for each target viewport.

### P1 — Update the current status file; do not create another duplicate

Update the newest current `status.md` — Drive ID `1MPA8yCQo-OeQWFQm_k_IsWfoTpNdB91t` at review time — with a Phase 5 section containing:

1. branch and all Phase 5 commit hashes;
2. exact Phase 5 source used (`03-implementation-plan.md` plus the project-wide briefs);
3. changed files and component responsibilities;
4. portrait/monogram decision and whether a publishable portrait was supplied;
5. About timeline semantic structure and responsive behavior;
6. Contact visual/action structure;
7. screenshots at every required viewport;
8. real-mobile smoke-test device/browser result;
9. keyboard, focus, touch-target, heading, overflow, reduced-motion, and console results;
10. TypeScript, lint/test, and production-build results;
11. six-route regression results;
12. the three Phase 4 corrections above and their final commit;
13. remaining limitations or deliberate deferrals.

Do not upload another `status.md` duplicate.

## Small accessibility polish

### P2 — Hide the decorative `FV` monogram text from assistive technology

The visible monogram is useful visually, but its `FV` span currently has no `aria-hidden`. Because the full name and role immediately follow, announcing the initials adds little value.

Prefer:

```html
<div class="..." aria-hidden="true">
  <span class="vdit-monogram-text">FV</span>
</div>
```

If the monogram is intentionally informative instead, give its container the accessible label `Filip Van den Broeck` and avoid duplicating that announcement beside the visible name.

### P2 — Verify the LinkedIn inline link's mobile touch area

At the reviewed desktop viewport, `Connect with me here` resolves to approximately 165×22px. Inline links may receive standards exceptions, but this project explicitly requires 44px mobile targets for actionable controls.

Measure it at 320px and 390px. If the touch box remains below 44px high, enlarge the interactive area with a scoped mobile style while preserving the quiet inline presentation. Do not turn it into a second amber button.

## Required verification after fixes

Run and record:

- TypeScript with zero errors;
- the production build;
- existing lint/tests, with pre-existing failures clearly separated;
- keyboard-only navigation through header, About CTA, Contact e-mail, LinkedIn, article TOC, article links, and footer;
- automated Axe or equivalent followed by manual verification;
- social metadata read from the deployed rendered HTML;
- 1200×630 dimensions and successful public response for both social images;
- the six standard routes returning successfully with one H1 and no page-level horizontal overflow;
- no Vanden IT console errors.

## Definition of done

Phase 5 can be marked complete when:

- the current About and Contact designs remain intact;
- the article visibly exposes Filip as author;
- the semantic article contains or is explicitly labelled by its H1;
- homepage `og:image` resolves in rendered HTML;
- required responsive screenshots and a real-mobile smoke test exist;
- About and Contact pass the project-wide accessibility and overflow guardrails;
- the newest current `status.md` contains a complete Phase 5 hand-off and corrected Phase 4 evidence;
- the work stops for review before optional Phase 6 motion.
