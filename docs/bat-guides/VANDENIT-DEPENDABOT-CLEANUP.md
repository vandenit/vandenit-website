# BAT test guide — VANDENIT-DEPENDABOT-CLEANUP

- **Card:** https://trello.com/c/b0j3rmgX/43-fix-all-vanden-it-website-depandabot-issues-merge-them-into-main-or-apply-same-fixes-en-close-dependabot-mrs
- **PR:** follows
- **Change class:** deps (security-only dependency consolidation: 24 `pnpm.overrides` pins + one direct dev-dep bump `postcss ^8.5.23`; zero UI/content code changes)
- **What this change delivers:** the same site on a dependency tree in which every fixable Dependabot security alert and every fixable live `pnpm audit` advisory is resolved. At pickup there were 73 open Dependabot alerts plus 8 live-audit advisories; after this change the only remaining audit finding is `deepmerge@4.3.1` (low severity, no patch published — documented as not-fixable). Dependabot PRs #23/#24 (TinaCMS bumps) are closed as obsolete: TinaCMS was removed from the repo in the Contentlayer migration and does not exist in `package.json`. No visible UI change is expected — the deliverable is risk reduction in the build/runtime tree, proven by the frozen `./verify` sensor and the manual browser pass below.

## Live test steps (BAT deploy)

The site should behave exactly as the current main. Walk the core pages and watch for **0 console errors** on every page. The two production consumers touched by this change are `styled-components` (its exact `postcss@8.4.38` pin is globally overridden to `8.5.23` — CSS parsing at runtime) and `gray-matter`/`react-markdown` (frontmatter + markdown render chain — `js-yaml@3` and `mdast-util-to-hast` bumps):

1. **Homepage `/`** — hero, header nav and footer render with correct styling (colors, spacing, fonts). Anchors: `data-testid="site-header"`, `data-testid="site-footer"` visible; 0 console errors.
2. **`/posts`** — blog heading "Building & Shipping with AI", featured card, tag filter chips and the post list render with the usual styled-components styling intact (cards, chips, hover states). Anchors: `posts-heading`, `featured-post-card`, `tag-filter-all`, and 3 × `post-list-card`; 0 console errors.
3. **`/posts/openlingo-dark-factory`** — article renders with title "How I Set Up a Dark Factory to Produce a First MVP of OpenLingo", author "Filip Van den Broeck" and the inline screenshot rendered centered inside the article (frontmatter + markdown pipeline intact — this is the `gray-matter` + `mdast-util-to-hast` + `svgo` regression check in one page). Anchors: `post-article`, `post-title`, `post-author` with exactly "Filip Van den Broeck", `post-content`; **0 console errors and no hydration mismatch**.
4. **`/skills/wiki-generator/README`** — skill doc renders with title, headings, lists, links and code blocks (react-markdown chain). Anchors: `skill-doc-article`, `skill-doc-title`, `skill-doc-content`; 0 console errors.
5. **`/how-i-work` and `/about`** — static pages render, engagement process section with numbered steps on `/how-i-work`, about header block on `/about`; anchors `engagement-process`, `about-header`; 0 console errors.
6. **Header nav sweep** — header nav links (Home, About, How I Work, Blog, Contact) route correctly; `/skills/wiki-generator` redirects to `/skills/wiki-generator/README` and lands 200.

## Fixture scenario

Not applicable — all content is in-repo (markdown files + skill docs); no fixture server is needed. The L3-M run executes steps 1–6 against a local production build (`next build` + `PORT=<port> node .next/standalone/server.js` with `public/` + `.next/static` copied into the standalone dir).

## What to watch as regression risks of THIS change

- **styled-components styling** (`postcss` override `8.4.38 → 8.5.23` on an exact pin): broken CSS parsing would visibly break ALL styling. Compare against the current BAT build (PR #39 / NEXT16-CONTENT-PIPELINE): layout, colors and spacing must be pixel-identical.
- **Markdown rendering** (`mdast-util-to-hast 13.2.0 → 13.2.1` inside the react-markdown chain): headings, lists, links, images and code blocks render as before (step 3 and 4).
- **Frontmatter parsing** (`js-yaml 3.14.1 → 3.15.2` under gray-matter): post titles, authors, dates and tags read correctly on the post pages (step 3).
- **SVG build pipeline** (`svgo 3.3.2 → 3.3.5` under @svgr/webpack): icons and inline SVGs render at build time; no missing graphics on any page.
- Everything else (eslint chain, @babel/*, axos, minimatch, browserslist, …) is build/dev-time only — invisible in the browser; their proof lives in `./verify full` (typecheck + lint + production build + e2e smoke).

## BAT verdict instructions

- All 6 steps pass with 0 console errors and styling identical to the previous BAT build → reply **`BAT OK`** on the Trello card.
- Any deviation → reply **`BAT: <bevindingen>`** on the card; the factory loop re-opens the work in Implementation.
