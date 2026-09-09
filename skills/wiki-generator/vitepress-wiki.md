# VitePress Wiki Serving — Standalone Sites, Wiki Pattern, and systemd

Curated extract from the Hermes skill `vitepress-tailscale-serve`. Only the parts relevant to the wiki-generator pipeline are included: the standalone VitePress site pattern, the wiki content pattern, and serving via systemd + Tailscale. See the full skill in the Hermes installation for the complete debugging guide.

## Standalone VitePress Site Pattern (No Subpath, No Tailscale)

When you want a **dedicated standalone VitePress site** (not part of a documentation hub, not behind Tailscale, no `/docs/` prefix), use `base: '/'` in a separate project directory.

### When to use this pattern

- User asks for a standalone site with `base: '/'`
- Content lives outside the main documentation hub (e.g. `~/projects/<name>-wiki/`)
- No Tailscale serve, no path prefix, no `docs` symlink needed
- Site is served directly via `python3 -m http.server` or deployed to a root domain

### Directory structure

```
~/projects/<name>-wiki/
├── package.json              # VitePress as devDependency
├── .vitepress/config.mts     # base: '/', cleanUrls: false
├── index.md                  # Homepage
├── page1.md                  # Content pages
├── page2.md
└── images/                   # Image directory (referenced from MD)
    ├── scene_01.png
    └── characters/
        └── char_01.png
```

### Steps

1. **Create project dir and copy content:**
   ```bash
   mkdir -p ~/projects/<name>-wiki
   cp ~/documentation/<source>/*.md ~/projects/<name>-wiki/
   cp -r ~/documentation/<source>/images ~/projects/<name>-wiki/images
   ```

2. **Create `package.json`:**
   ```json
   {
     "name": "<name>-wiki",
     "version": "1.0.0",
     "private": true,
     "scripts": {
       "dev": "vitepress dev",
       "build": "vitepress build",
       "preview": "vitepress preview"
     },
     "devDependencies": {
       "vitepress": "^1.6.3"
     }
   }
   ```

3. **Create `.vitepress/config.mts` with `base: '/'`:**
   ```typescript
   import { defineConfig } from 'vitepress'

   export default defineConfig({
     title: 'Site Title',
     description: 'Site description',
     base: '/',               // No subpath prefix
     cleanUrls: false,        // REQUIRED with python3 http.server
     themeConfig: {
       nav: [
         { text: 'Home', link: '/' },
         { text: 'Page', link: '/page.html' },
       ],
       sidebar: [
         {
           text: 'Navigatie',
           items: [
             { text: 'Overzicht', link: '/' },
             { text: 'Page', link: '/page.html' },
           ]
         }
       ],
       search: { provider: 'local' },
     }
   })
   ```

4. **Fix broken links:** Source content may have links pointing outside the wiki (e.g. `../books/...` → fix to `./` or remove). Search for `](\.\./` patterns.

5. **Install, build, and serve:**
   ```bash
   export PATH="/home/filip/.nvm/versions/node/v24.12.0/bin:$PATH"
   cd ~/projects/<name>-wiki
   npm install
   npx vitepress build
   # Serve:
   cd .vitepress/dist && python3 -m http.server <port>
   ```

6. **No `docs` symlink needed.** With `base: '/'`, all internal links are root-relative (`/page.html`, `/assets/...`) and `python3 -m http.server` serves them directly from `dist/`.

7. **No manual image copy needed (usually).** VitePress auto-bundles images referenced via `![alt](./images/...)` into `/assets/` with hashed names. Only copy `images/` to `dist/` if there are unreferenced images that need to be accessible.

8. **`./` relative links work correctly.** Markdown links like `[Page](./page)` or `[Section](./page#anchor)` are rewritten by VitePress to `/page.html` in the built HTML when using `base: '/'` + `cleanUrls: false`. Cross-page anchor links (`./page#section-id`) also resolve correctly.

### Standalone site behind Tailscale subpath — CRITICAL

When a standalone VitePress site (e.g. `~/projects/remembrance-wiki/`) is served behind a **Tailscale path prefix** (e.g. `https://host/remembrance/`), the `base` config MUST match the Tailscale path:

```typescript
base: '/remembrance/',  // MUST match the Tailscale --set-path prefix
```

**Common pitfall — double prefix in nav links:** If you set nav links to `/remembrance/characters.html` AND `base: '/remembrance/'`, VitePress generates `/remembrance/remembrance/characters.html` — a double prefix that 404s.

**Fix:** Nav and sidebar links should use the **bare path** (as if base were `/`). VitePress prepends the base automatically:

```typescript
// CORRECT — VitePress adds /remembrance/ prefix automatically
nav: [
  { text: 'Home', link: '/' },                        // → /remembrance/
  { text: 'Personages', link: '/characters.html' },   // → /remembrance/characters.html
]

// WRONG — double prefix
nav: [
  { text: 'Personages', link: '/remembrance/characters.html' },  // → /remembrance/remembrance/characters.html ❌
]
```

**Relative `./` links in content work correctly** regardless of base. `[Darrow](./characters#darrow)` in `summary.md` resolves to `./characters.html#darrow` in the built HTML, which the browser resolves relative to the current page URL.

**Setup steps for standalone site + Tailscale subpath:**

1. Create standalone project at `~/projects/<name>-wiki/`
2. Set `base: '/<name>/'` in config (matches Tailscale path)
3. Set nav/sidebar links with bare paths (no prefix — VitePress adds base)
4. Build: `npx vitepress build`
5. Create self-referencing symlink: `cd .vitepress/dist && ln -s . <name>` (same pattern as `docs` symlink)
6. Serve: `python3 -m http.server <port> --bind 127.0.0.1`
7. Tailscale: `tailscale serve --bg --set-path /<name>/ http://127.0.0.1:<port>`
8. Test: verify no double `<name>/<name>/` in built HTML: `curl -s http://127.0.0.1:<port>/<name>/page.html | grep -c '<name>/<name>'` should be 0

### Key differences between the serving patterns

| Aspect | Tailscale hub (`/docs/`) | Standalone (`/`) | Standalone + Tailscale subpath (`/remembrance/`) |
|--------|--------------------------|-------------------|--------------------------------------------------|
| `base` | `'/docs/'` | `'/'` | `'/remembrance/'` (matches Tailscale path) |
| self-symlink in dist | Required (wiped each build) | Not needed | Required — `ln -s . remembrance` (wiped each build) |
| `srcDir` + symlinks | Required (multi-content hub) | Not needed (flat dir) | Not needed (flat dir) |
| Tailscale serve | Required | Not needed | Required — `--set-path /remembrance/` |
| Nav link format | Bare (`/page.html`) | Bare (`/page.html`) | Bare (`/page.html`) — VitePress adds base |
| `cleanUrls` | `false` | `false` | `false` |

**`cleanUrls: true` does NOT work with `python3 -m http.server`.** The built HTML contains clean links (e.g. `/books/red_rising` without `.html`), and `python3 -m http.server` has no URL rewriting — it looks for a literal file at that path and returns 404. Always set `cleanUrls: false` when serving with `python3 -m http.server`.

## Static Server via systemd (recommended for standalone wikis)

Background `python3 -m http.server` processes die silently (hung or killed) — on 2026-09-06 all three wiki servers (ports 5180/5181/5182) were found dead while Tailscale routes still existed, making the sites 502/unreachable. Use systemd **user units** instead: `Restart=always`, auto-starts on boot (linger enabled), no manual fuser/port-fiddling.

Unit template (`~/.config/systemd/user/wiki-<name>.service`):

```ini
[Unit]
Description=<Name> wiki static server (port <PORT>)
After=network.target

[Service]
WorkingDirectory=%h/projects/<name>-wiki/.vitepress/dist
ExecStart=/usr/bin/python3 -m http.server <PORT> --bind 127.0.0.1
Restart=always
RestartSec=5

[Install]
WantedBy=default.target
```

```bash
systemctl --user daemon-reload
systemctl --user enable --now wiki-<name>.service
# verify — should be 200 (self-symlink in dist makes the base path work):
curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:<PORT>/<base>/
```

No restart needed after `vitepress build` — the server reads `dist/` from disk per request; only the self-symlink in `dist/` must be re-created after each build (`ln -s . <base-name>`).

## Wiki Pattern (Cross-Linked Progressive Pages)

When building a **wiki** from source material (e.g. audiobook transcripts), create a dedicated subpath (e.g. `/remembrance/`) with multiple interlinked pages. Key principles:

1. **Progressive building — no spoilers, no external knowledge.** Only include information from chapters processed so far. As more chapters are processed, expand existing pages and add new ones. Each wiki page should state what chapter range it covers.

2. **Page structure:** Separate pages per domain concept:
   - `world.md` — locations, institutions, key concepts
   - `characters.md` / `personages.md` — all characters with roles, attributes, descriptions
   - `concepts.md` — classification systems from the book
   - `summary.md` — chapter-by-chapter summary
   - `index.md` — wiki overview with links to all pages

3. **Cross-linking with anchors.** VitePress auto-generates anchor IDs from headings. Link to a character from the summary using `[Ye Wenjie](./characters#ye-wenjie)`. Link to a world concept from the characters page. Link back to the wiki index with `[Back to the wiki](./)`. This creates a dense web of clickable references.

4. **TOC with anchor links.** Each page should start with a numbered TOC section listing all subsections as `#anchor` links. VitePress renders the right-side outline automatically, but an explicit TOC at the top improves mobile navigation.

5. **Character page template.** Each character gets a `### Name` heading (so the anchor is `#name`) followed by a table of attributes (role, affiliation, age) and a description. Link to other characters and world concepts inline.

6. **Config.** Add a path-keyed sidebar entry for the wiki section and a nav link. Example:
   ```typescript
   sidebar: {
     '/remembrance/': [
       {
         text: 'Remembrance Wiki',
         items: [
           { text: 'Overzicht', link: '/remembrance/' },
           { text: 'De Wereld', link: '/remembrance/world' },
           { text: 'Personages', link: '/remembrance/characters' },
           { text: 'Samenvatting', link: '/remembrance/summary' }
         ]
       }
     ],
   }
   ```

7. **Rebuild required.** After adding wiki pages, rebuild and re-create the self-symlink in `dist/`.

8. **Audiobook-to-wiki pipeline.** When transcribing an audiobook and building a wiki from it, the flow is: (a) check for existing EPUB/EPUB-MD conversions before re-transcribing, (b) transcribe with faster-whisper only if no EPUB exists → raw MD transcript, (c) chapterize, (d) create standalone wiki project at `~/projects/<book-series>-wiki/` with cross-linked pages, (e) add per-chapter pages, (f) add sidebar + nav entries, (g) build + serve. The wiki pages are written from the transcript but with corrected names (whisper mangles fictional names — e.g. "Narrow" → "Narro", "Lauren" → "Loran"). The transcript itself stays uncorrected as a faithful record.

9. **Per-chapter pages, NOT one combined file.** Each chapter gets its own dedicated page (`chapter-01.md`, `chapter-02.md`, etc.) with the chapter scene image at the top, new character portraits embedded inline, and its own sidebar entry. Do NOT combine all chapters into a single `three-body-chapters.md` file. The sidebar should have a collapsible "Hoofdstukken" section listing each chapter by number and short title.

10. **Image integration after ChatGPT generates content.** When ChatGPT produces chapter summaries via the Drive bridge, it also generates scene images and character portraits. These must be downloaded from Drive and integrated into the wiki — do NOT skip this step and present text-only pages:
    - Download all images from the project's `outputs/` Drive subfolder to local `images/scenes/` and `images/characters/` directories
    - Embed scene images at the top of each chapter page: `![Sfeerbeeld](./images/scenes/scene_chNN_a.png)`
    - Embed character portraits inline in the chapter page under the character's `### Name` heading
    - Also add portraits to the main `personages.md` page under each character entry
    - Referenced images (`![](./images/...)`) are auto-bundled into `/assets/` with content hashes; unreferenced loose images need `cp -r images .vitepress/dist/` after build

11. **Verification after wiki refactoring:**
    1. Search for `](#` — should only show same-page chapter anchors, not character/concept anchors
    2. Count `](./characters#` links — should match the number of character references in the text
    3. Build: `npx vitepress build`
    4. `curl` the built HTML and grep for `characters.html#` to confirm VitePress rewrote the relative links correctly
    5. `curl` the target page and grep for `id="anchor-name"` to confirm the anchors exist