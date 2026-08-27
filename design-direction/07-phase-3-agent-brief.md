# Vanden IT — Phase 3 Agent Brief

Date: 2026-08-25  
Target: https://vandenit.be/  
Current implementation branch reported by Phase 2: `feature/visual-redesign`  
Phase 2 implementation commit: `e6268c6`  
Phase 2 review-fix commit: `33fad7d`

## Mission

Turn the existing `/how-i-work` content into the site's signature visual explanation of how Filip works inside a team: one connected engagement process followed by one concrete decision trace showing where AI volume ends and human judgement begins.

Phase 1 established the visual foundation. Phase 2 gave the homepage a distinct identity. Phase 3 must make the working method tangible.

The intended visitor takeaway is not merely:

> Filip uses AI.

It is:

> Filip uses AI to increase delivery capacity while keeping architecture, security, verification and the final decision under human ownership.

Preserve the restrained Foundation/Robots atmosphere. Express the Daneel/Bailey-like partnership through roles, sequence and judgement—not through literal characters, quotations, lore or decorative sci-fi spectacle.

## Phase 2 review verdict

Phase 2 is approved for progression to Phase 3.

### Live evidence confirmed on 2026-08-25

- desktop homepage hero uses equal `404px / 404px` columns in the reviewed 1363px viewport;
- H1 renders as three deliberate lines and no longer strands `Production-`;
- desktop diagram renders at approximately `404 × 141px` and remains visually secondary;
- no hero inline styles remain;
- no `.section-alt` consumers remain on the six reviewed routes;
- contribution cards use `01 / 02 / 03`, ruled cobalt tops and no generic shadow;
- all six reviewed routes have exactly one H1;
- no horizontal overflow was found at the reviewed desktop viewport;
- no Vanden IT React/Next.js console errors occurred across the six-route pass;
- a fresh direct load of `/posts` produced only an unrelated browser-extension metadata error;
- visible keyboard focus remains a 2px light-blue outline;
- Geist, Geist Mono and Barlow Condensed are served from same-origin Next static font files;
- `mailto:filip@vandenit.be` remains correct.

Reviewed routes:

- `/`;
- `/about`;
- `/how-i-work`;
- `/posts`;
- `/posts/blind-coder-sighted-reviewer`;
- `/contact`.

### Visual assessment

The hero and contribution section now feel intentional and specific to Vanden IT. The clearest remaining contrast is `/how-i-work`: its content is strong, but the four engagement steps and five incident beats still render as conventional vertical Markdown-like headings and paragraphs. Phase 3 should solve exactly that contrast.

## Important `status.md` triage

Do not execute every listed Phase 3 note without checking the live implementation.

### Already fixed or disproven live

1. **Experience Highlights missing chapter markers — no action.** Both `What I Bring to the Team` and `Experience Highlights` currently show `01 / 02 / 03` markers.
2. **Double H1 on the article — no action.** `/posts/blind-coder-sighted-reviewer` currently contains exactly one H1. The article's content headings begin at H2.
3. **Barlow Condensed CDN dependency — no action.** Live font preloads resolve to same-origin `/_next/static/media/*.woff2`. `next/font/google` downloads and self-hosts the font at build time; it is not a runtime Google Fonts CDN request.
4. **Hydration error — considered resolved unless it reappears.** Direct `/posts` loading and the six-route pass produced no site console errors.

### Confirmed or still requiring repository verification

1. **Portfolio accent token — confirmed visually/technically.** The portfolio section still resolves Radix accent values (`--accent-9: #0090ff`) while the Vanden IT system token is `--vdit-color-system: #2f9fff`. Replace local portfolio accent usage with the Vanden IT token where it does not alter Radix component accessibility states.
2. **Mobile proof-strip borders — verify with real screenshots.** This could not be independently rendered at a mobile viewport in the review browser. Because the same `vdit-proof-strip` component is reused, do not assume a Contact-only defect. Capture 360px and 390px screenshots before changing CSS; fix only if the stacked cells lack clear separators.
3. **`geist` package dependency — verify, do not assume downgrade.** Run `pnpm why next`, `pnpm why geist`, and inspect `package.json` plus the lockfile. If `geist` is only present as the one-time source of already committed WOFF2 files and has no runtime/build use, remove the dependency. Preserve font licensing information as required.
4. **Tracked `tsconfig.tsbuildinfo` — verify with `git ls-files tsconfig.tsbuildinfo`.** If tracked, remove it from the index while keeping the `.gitignore` entry. Do not delete unrelated build artifacts.

### Deferred maintenance, not Phase 3 scope

- ESLint 9 / `eslint-config-next@14.2.4` compatibility;
- browserslist database refresh;
- Next.js upgrade;
- case-study/blog redesign;
- full About timeline redesign;
- optional site-wide motion.

Do not mix dependency upgrades into the visual Phase 3 pull request.

## Drive status-file ambiguity

The Drive folder currently contains two files named `status.md`.

- Current Phase 2 status: Drive ID `1tFaws4Zt9sP6EqsUE1fc4DDcTh8YiIYG`
- Old Phase 1 status: Drive ID `1LW6WfA-ziiPV08NV1xVpIvknrF-mte3p`

Use the newer Phase 2 status as the source of truth. Do not overwrite or append Phase 3 results to the old file. At hand-off, clearly identify the exact status file ID or archive/rename the old status through the user's normal Drive workflow.

## Scope boundaries

### In scope

- small verified preflight cleanups listed above;
- redesigning `How an engagement develops` as one connected four-step process;
- redesigning `When Experience Makes the Judgment Calls` as a five-beat evidence trace;
- desktop and mobile variants of those two structures;
- accessibility, responsive and production-console verification;
- optional static design assets that remain code-native and lightweight.

### Out of scope

- rewriting the existing service or incident copy;
- changing the homepage hero, contribution cards or proof metrics again;
- redesigning all service sections on `/how-i-work`;
- literal robot/human illustrations;
- animation before static approval;
- Framer Motion, GSAP, canvas, WebGL or an additional component framework;
- rasterized text or text embedded only inside SVG;
- hover-only explanations;
- large screenshots or decorative raster assets.

Keep Next.js, Radix where it already helps, CSS custom properties and scoped/global CSS consistent with the existing architecture.

## Execution order

### 1. Preflight and baseline

Before visual implementation:

1. read repository instructions and the latest `status.md`;
2. confirm the active branch and clean/dirty worktree state;
3. run TypeScript and the current production build;
4. verify the dependency/tree items from the triage section;
5. capture **actual screenshots**, not only HTML inspection, at 360, 390, 768, 1280 and 1440px for `/how-i-work`;
6. capture the current four-step and five-beat sections as the before-state;
7. record any console error before modifying code.

Do not describe HTML structure inspection as viewport QA. Screenshot or rendered-browser evidence is required for visual acceptance.

### 2. Build the connected engagement process

Preserve the existing section title and the exact four steps:

1. Join and understand
2. Contribute to delivery
3. Improve the workflow
4. Leave durable practices

Render the process as semantic ordered content first, then enhance it visually.

Recommended structure:

```html
<section class="vdit-process" aria-labelledby="engagement-process-title">
  <h2 id="engagement-process-title">How an engagement develops</h2>
  <ol class="vdit-process-list">
    <li class="vdit-process-step">...</li>
    <li class="vdit-process-step">...</li>
    <li class="vdit-process-step">...</li>
    <li class="vdit-process-step">...</li>
  </ol>
</section>
```

The rendered design should feel like one system, not four cards.

#### Desktop direction

- use four connected columns at wide widths;
- run one restrained cobalt rail through or above the four step nodes;
- use `01 / 02 / 03 / 04` in Geist Mono;
- keep descriptive copy as normal HTML below each node;
- use open ruled cells or unboxed columns rather than elevated panels;
- allow amber only at a moment of explicit verification/judgement, not as decoration on every node;
- do not let the rail cross text.

#### Mobile direction

- switch to one vertical ordered stepper;
- place a cobalt rail to the left of the content;
- give each step enough left padding for node and number;
- ensure the line terminates cleanly at step 04;
- preserve normal document reading order;
- do not horizontally scroll the process.

#### Suggested implementation approach

- create a dedicated static component, for example `components/blocks/engagement-process.tsx`;
- keep the step data as a local typed array or plain semantic JSX;
- use CSS pseudo-elements for rails and nodes where possible;
- mark purely decorative rail elements `aria-hidden="true"` when real elements are used;
- avoid a client component unless a later, separately approved motion pass requires one.

#### Acceptance criteria

- the process remains understandable as an ordered list with CSS and JavaScript disabled;
- all four existing texts remain present and unchanged;
- desktop reads as one continuous journey;
- mobile reads as one vertical stepper without overlapping labels;
- no card-shadow or generic SaaS-panel treatment;
- no horizontal overflow at 320px;
- no new runtime dependency.

### 3. Build the five-beat decision trace

Preserve the existing section title and these beats:

1. Problem
2. First AI implementation
3. Wrong conclusion
4. Human intervention
5. Result

This is the narrative and visual centre of Phase 3.

#### Visual hierarchy

- beats 01–03: cobalt/neutral system exploration;
- beat 03: clearly show that the process has reached an invalid conclusion without relying on colour alone;
- beat 04: amber visual pivot labelled `Human intervention`;
- beat 05: terminal proof state, visually resolved and calm;
- retain the closing sentence: `AI handled the volume. Experience made the judgment call.`

Use labels, numbering, icons or line treatment so the sequence remains understandable in monochrome and to colour-blind users.

#### Layout

- wide desktop may use a five-node horizontal trace if text remains readable;
- do not force five cramped columns inside the normal editorial measure;
- a wider bounded container is acceptable for the trace only;
- tablet may use a two-row connected grid or a vertical trace;
- mobile must use a vertical trace with the same semantic order;
- result content must not look like another error state.

If the horizontal version becomes dense, prefer a strong vertical evidence rail over tiny type or embedded SVG text.

#### Suggested structure

```html
<section class="vdit-decision-trace" aria-labelledby="decision-trace-title">
  <h2 id="decision-trace-title">When Experience Makes the Judgment Calls</h2>
  <ol class="vdit-decision-list">
    <li>...</li>
    <li>...</li>
    <li data-state="warning">...</li>
    <li data-state="human">...</li>
    <li data-state="result">...</li>
  </ol>
  <p class="vdit-decision-summary">...</p>
</section>
```

Use data attributes only as styling hooks; ensure the visible headings carry the meaning.

#### Acceptance criteria

- the difference between AI execution and human judgement is immediately visible;
- the visitor can follow the five beats without hovering or clicking;
- all explanatory text remains selectable HTML;
- Human intervention is the single amber pivot;
- Result reads as terminal proof rather than a sixth generic card;
- structure remains logical with styles disabled;
- no essential meaning is contained only in linework or colour.

### 4. Preserve the page rhythm

Phase 3 is not permission to turn every `/how-i-work` section into a diagram.

Keep these sections editorial and calm unless a small token/class alignment is required:

- Senior Full-Stack Development
- Fractional Tech Lead
- AI Workflow Improvement
- See It In Practice

The page needs contrast between visual explanation and readable prose. The connected process should orient the visitor; the decision trace should provide evidence; the remaining sections should explain.

The current hero is approved. Do not replace or animate its diagram.

### 5. Static approval before motion

Deliver Phase 3 static first.

Do not add `IntersectionObserver` in the initial implementation commit. After screenshots are approved, an optional second commit may add a restrained reveal if it demonstrably improves comprehension.

If motion is approved later:

- animate only opacity, transform and a limited stroke/path reveal;
- never hide essential content while JavaScript loads;
- final state must be present under `prefers-reduced-motion: reduce`;
- no animation library;
- no layout-property animation;
- no repeated or looping decorative motion.

### 6. Regression and accessibility pass

Test at minimum:

- 320px overflow check;
- 360px mobile screenshot;
- 390px mobile screenshot;
- 768px tablet screenshot;
- 1280px desktop screenshot;
- 1440px wide-desktop screenshot.

For `/how-i-work`, verify:

- one H1;
- heading order remains logical;
- both ordered sequences are correct in DOM order;
- no rail overlaps headings or paragraphs;
- no clipped nodes or text;
- no hover-only information;
- keyboard focus on both CTAs remains visible;
- text contrast remains sufficient;
- page remains useful with JavaScript disabled;
- reduced-motion produces the final static state;
- no console errors.

Regression-check all six standard routes for:

- HTTP success;
- exactly one H1;
- no horizontal overflow;
- no Vanden IT console errors;
- header/footer integrity;
- unchanged hero and contribution cards;
- functional contact mail link;
- article readability.

Also capture Contact at 360 and 390px to settle the proof-strip border todo with visual evidence.

## Definition of done

Phase 3 is complete when:

- the four engagement steps render as one connected process on desktop and a vertical stepper on mobile;
- the incident renders as a five-beat decision trace with Human intervention as the amber pivot and Result as terminal proof;
- both sequences remain semantic, readable and complete without JavaScript;
- actual screenshots exist for all required widths;
- the Contact mobile proof-strip todo has been either fixed or closed with evidence;
- the confirmed portfolio token mismatch is corrected;
- dependency and tracked-build-info checks are documented with evidence;
- no already-resolved `status.md` todo has been reimplemented;
- the static design is reviewed before any motion work;
- build, TypeScript, route, keyboard and console checks pass;
- the current Drive `status.md` is updated with implementation details, screenshots, remaining issues, commit hashes and branch.

## Agent hand-off format

Update the current status file—Drive ID `1tFaws4Zt9sP6EqsUE1fc4DDcTh8YiIYG`—with:

1. changed files and component responsibilities;
2. semantic structure used for both ordered flows;
3. desktop/tablet/mobile layout behaviour;
4. before/after screenshots at all required widths;
5. Contact proof-strip mobile finding and evidence;
6. portfolio token change;
7. `pnpm why next` / `pnpm why geist` conclusion;
8. `tsconfig.tsbuildinfo` tracking conclusion and action;
9. TypeScript, production build and route results;
10. accessibility and reduced-motion checks;
11. items deliberately left editorial/static;
12. deferred optional-motion proposal, if any;
13. implementation, review-fix and final commit hashes.

Stop and document the constraint rather than widening scope if the connected layouts cannot remain readable at 360px without reducing text below the current readable body size.
