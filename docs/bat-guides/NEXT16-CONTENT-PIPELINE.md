# BAT test guide — NEXT16-CONTENT-PIPELINE

- **Card:** https://trello.com/c/UtxSNLoP/41-vandenit-website-nextjs-16-upgrade-contentlayer-vervangen-door-lichte-betrouwbare-content-pipeline
- **PR:** follows
- **Change class:** deps (Next.js 14 → 16 + React 19, contentlayer replaced by a build-time `fs` + `gray-matter` pipeline)
- **What this change delivers:** the same visual site served by Next.js 16 with the unmaintained contentlayer stack removed. No UI change — only non-visual `data-testid` anchors were added, plus one hydration bug fix (post images) that changes nothing visually. The upgrade is proven by the frozen `./verify` sensor: identical e2e suite green on Next 14 (baseline, `.factory/baseline-next14.json`) and green again on Next 16 at HEAD.

## Live test steps (BAT deploy)

Run these on the deployed build after merge (or against a local production build served via `PORT=<port> node .next/standalone/server.js` after copying `public/` and `.next/static` into the standalone dir).

1. **Homepage `/`** — expect: hero section with the "Senior Engineering · AI-Augmented Delivery" kicker and tagline headline, CTAs, header nav, footer. Anchor checks: `data-testid="hero-section"`, `data-testid="hero-title"`, `data-testid="site-header"`, `data-testid="site-footer"` all visible; **0 console errors**.
2. **`/about`** — expect: about header block with kicker and copy. Anchor: `data-testid="about-header"` visible; 0 console errors.
3. **`/how-i-work`** — expect: engagement process section with numbered steps. Anchor: `data-testid="engagement-process"` visible; 0 console errors.
4. **`/contact`** — expect: contact hero block with CTA buttons. Anchor: `data-testid="contact-hero"` visible; 0 console errors.
5. **`/posts`** — expect: blog heading "Building & Shipping with AI", the featured card (latest post: "How I Set Up a Dark Factory…"), a filter bar with `All Posts` + tag chips (ai, development, hermes, workflows), and the post list (3 entries). Anchors: `posts-heading`, `featured-post-card`, `tag-filter-panel`, `tag-filter-all`, `tag-filter-ai`, and 3 × `post-list-card`; 0 console errors.
6. **`/posts?tag=ai`** — expect: same heading, featured card still rendered, filter chips with `ai` highlighted. 0 console errors.
7. **`/posts/openlingo-dark-factory`** — expect: article with title "How I Set Up a Dark Factory to Produce a First MVP of OpenLingo", author "Filip Van den Broeck", a reading-time meta, tags, the inline screenshot (`software-factory-board.png`) rendered centered inside the article, and the ASCII-workflow visual. Anchors: `post-article`, `post-title`, `post-author` with exactly "Filip Van den Broeck", `post-content`; **the image must render — this page previously carried a hydration bug (React #418) fixed by this task; the check is 0 console/page errors, not just presence.**
8. **`/posts/blind-coder-sighted-reviewer`** — expect: title "The Blind Coder and the Sighted Reviewer…", author "Filip Van den Broeck", content renders. Same anchors; 0 console errors.
9. **`/posts/automated-wiki-generation-hermes-chatgpt`** — expect: title "Five Book Wikis in 48 Hours…", author, multiple inline screenshots rendered centered. Same anchors; 0 console errors.
10. **`/skills`** — expect: "Skills & Playbooks" heading and the `wiki-generator` collection listing. Anchors: `skills-heading`, `skill-collection-wiki-generator`; 0 console errors.
11. **`/skills/wiki-generator/README`** — expect: skill doc article with title and rendered markdown content. Anchors: `skill-doc-article`, `skill-doc-title`, `skill-doc-content`; 0 console errors.
12. **Navigation sweep** — header nav links (Home, About, How I Work, Blog, Contact) route correctly; `/skills/wiki-generator` redirects to `/skills/wiki-generator/README` (HTTP 307/308 then 200).

## What to watch as regression risks of THIS change

- Any page console error / hydration warning (the old stack threw React #418 on image-bearing posts).
- Blog post dates formatted "Nov 2, 2026" style and meta rows unchanged.
- Tag filtering still returns the right subset (all tags on each post: ai, hermes, workflows, development).
- The standalone server response of every route above is 200 (verified in the PR evidence as AC-5).

## BAT verdict

After the manual run, reply on the card with either:

- `BAT OK` — everything above matched the expectations, or
- `BAT: <findings>` — describe each mismatch (route, anchor, what you saw vs expected). A BAT kickback returns the card to Implementation with the worker's work intact.