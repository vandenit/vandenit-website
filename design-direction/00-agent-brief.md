# Agent Brief — Vanden IT Visual Direction v1

## Mission

Evolve the existing Vanden IT website toward a distinctive but restrained visual system called **The Engineer & The System**. Preserve the current content positioning and information architecture unless a step below explicitly says otherwise.

The website must continue to position Filip as:

- a senior full-stack engineer;
- a fractional tech lead;
- someone who improves AI-assisted delivery while embedded in real engineering work;
- the person accountable for architecture, security, quality and release decisions.

Do not reposition Vanden IT as a generic AI consultancy, transformation agency or standalone AI workflow auditor.

## Visual narrative

- **Filip / human judgment:** amber, convergence, checkpoints, decisions, verification.
- **Daniël / system activity:** cobalt blue, parallel paths, analysis, repetition, research.
- **Production:** one stable line after human review.
- **Atmosphere:** mature European retro-futurism and engineering documentation.
- **Avoid:** robots, humanoid assistants, chat bubbles, glowing brains, purple AI gradients, planets, cyberpunk, classified-file cosplay and walls of identical SaaS cards.

## Technology decision

Keep the existing Next.js and Radix Themes foundation.

Use:

- global CSS custom properties for design tokens;
- CSS Modules or existing scoped CSS for page/component styling;
- Radix primitives for accessible behavior and layout where they already help;
- `next/font` for self-hosted font delivery;
- semantic HTML for all meaningful text and interaction;
- inline or referenced SVG for diagrams;
- CSS transitions and `IntersectionObserver` only when motion is added later.

Do not introduce Tailwind, styled-components, Framer Motion, GSAP, a canvas renderer or a second component library in v1.

## Non-negotiable content constraints

- Preserve the hero positioning around senior engineering, AI-powered workflows and production-grade results.
- Keep BNP/Centric precise: Filip was Technical Lead for the Enablement project within Centric, not Technical Lead of the entire Centric platform.
- AI workflow improvement stays part of developer or tech-lead engagements.
- Do not add unsupported audit, transformation or consulting claims.
- Do not invent client data, metrics, screenshots or testimonials.

## Working method

1. Read the repository instructions and existing architecture before editing.
2. Run the current build, lint and tests. Record failures before changing code.
3. Capture baseline screenshots at 390, 768, 1280 and 1440 CSS pixels for `/`, `/how-i-work`, `/about`, `/posts`, `/posts/blind-coder-sighted-reviewer` and `/contact`.
4. Implement only one phase from `03-implementation-plan.md` at a time.
5. After every phase, rerun build/lint/tests and recapture affected screenshots.
6. Compare screenshots against the references, but prioritize usability over pixel matching.
7. Stop after each phase and report changed files, screenshots, regressions and open questions.

## Phase-one stopping point

The first implementation should stop after:

- tokens and typography are installed;
- the shell/header/buttons have the new visual identity;
- the homepage hero is asymmetrical on desktop and linear on mobile;
- the proof strip is restyled;
- the homepage uses a static responsive system diagram;
- no new animation dependency has been added.

Do not redesign every page in the first pull request.

## Definition of done for every phase

- No horizontal scroll at 320px width.
- Keyboard focus is clearly visible.
- All controls have accessible names and at least 44px touch targets on mobile.
- Essential information never depends on color, hover or animation.
- `prefers-reduced-motion` is respected.
- Existing routes, metadata and content rendering keep working.
- No new client-side JavaScript is added for effects that CSS can handle.
- The visual result is recognizably Vanden IT, not a generic AI template.

