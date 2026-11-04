# vandenit-website: Next.js 16-upgrade + contentlayer vervangen door lichte betrouwbare content pipeline

- **Trello-kaart:** https://trello.com/c/UtxSNLoP/41-vandenit-website-nextjs-16-upgrade-contentlayer-vervangen-door-lichte-betrouwbare-content-pipeline
- **Lijst:** To Refine
- **Labels:** vandenit-website, deps
- **task_id:** NEXT16-CONTENT-PIPELINE
- **change_class:** deps

## Volledige analyse (origineel)

task_id: NEXT16-CONTENT-PIPELINE
change_class: deps
origin: Naar aanleiding van GitHub-issue vandenit/vandenit-website#36 (Next.js 14 bereikte EOL op 26-10-2025 en contentlayer/next-contentlayer 0.3.4 is ononderhouden sinds juni 2023 met enkel gedeclareerde Next 12/13-support) wil Filip vandenit-website upgraden naar Next.js 16 LTS + React 19 met behoud van `output: 'standalone'`, contentlayer vervangen door een lichte, voorspelbare build-time content-pipeline zonder CMS-ballast (alle content management is agent-driven via git), en de verouderde vermelding van "TinaCMS" uit de GitHub-repobeschrijving verwijderen. Conform Filip's SPEC-GATE (comment 6ae8b50ff5d7982d1c925f91) heeft de doelrepo nog géén `./verify` of `tests/e2e`: deze taak moet daarom in Fase A eerst een T0 verify-fondatie (`./verify` + Playwright `tests/e2e/smoke.spec.ts` op basis van `data-testid`) en een groene as-is baseline op Next 14 neerzetten, waarna in Fase B de upgrade naar Next.js 16 + de nieuwe content-pipeline plaatsvindt tegen exact diezelfde bevroren sensor.

## Architectuurbeslissingen (definitief)

### 0. Tweefasen-aanpak conform SPEC-GATE: T0 verify-fondatie op Next 14 (Fase A) → Upgrade op bevroren sensor (Fase B)
Omdat `vandenit-website` nog geen `./verify` en `tests/e2e` bezit en auto-merge steunt op twee gates — (1) Filip's voorafgaande spec-review vóór verplaatsing naar `Spec Approved` en (2) een as-is sensor-garantie — is de uitvoering verplicht gesplitst in twee opeenvolgende commits op de taakbranch:
- **Fase A (Commit 1 — T0 verify-fondatie + groene Next 14 baseline)**:
  - Terwijl `package.json` nog ongewijzigd op Next 14 (`"next": "^14.2.21"`) en Contentlayer (`"contentlayer": "^0.3.4"`, `"next-contentlayer": "^0.3.4"`) staat, voegt de worker enkel `@playwright/test@^1.64.1` toe aan `devDependencies` (gebruikt de reeds in `~/.cache/ms-playwright` aanwezige `chromium-1248`), voegt niet-visuele `data-testid`-ankers toe aan de bestaande componenten, en bouwt `./verify`, `playwright.config.ts` en `tests/e2e/smoke.spec.ts`.
  - Op deze eerste commit (`BASELINE_SHA`) draait de worker `./verify fast` en `./verify full` tegen de bestaande Next 14 + Contentlayer build en slaat het groene rapport (`overall_status: "PASS"`, alle stappen `PASS`) op als `.factory/baseline-next14.json` (met `commit_sha == BASELINE_SHA`).
- **Fase B (Commit 2 — Next.js 16 + React 19 + `fs`/`gray-matter` content-pipeline)**:
  - Vanaf `BASELINE_SHA` zijn `./verify`, `playwright.config.ts` en `tests/e2e/smoke.spec.ts` **bevroren** (`git diff $BASELINE_SHA..HEAD -- verify playwright.config.ts tests/e2e/` MOET leeg zijn).
  - De worker voert de upgrade uit en bewijst dat exact dezelfde ongewijzigde `./verify fast` en `./verify full` (inclusief dezelfde Playwright e2e-suite op `data-testid`) opnieuw 100% `PASS` geven op Next.js 16.

### 1. Keuze content-pipeline: eigen dunne build-time laag in `lib/contentlayer.ts` (`node:fs` + `gray-matter`) + bestaande `MarkdownRenderer`
- **Bestaand gebruik in de repo**:
  - De repo gebruikt Contentlayer's gecompileerde MDX-code (`post.body.code`) **nergens**. Alle drie blogposts (`content/posts/*.mdx`) zijn zuivere GFM-Markdown met YAML-frontmatter zonder JSX-imports.
  - `app/posts/[...filename]/page.tsx`, `app/posts/[...filename]/client-page.tsx` en `app/posts/client-page.tsx` lezen uitsluitend `post.body.raw` en geven die door aan `<MarkdownRenderer content={post.body.raw} />` (`react-markdown` + `remark-gfm` + `rehype-raw`), `extractTocItems(post.body.raw)` en `calculateReadingTime(post.body.raw)`.
  - Voor `/skills` gebruikt `lib/skills.ts` nu al exact dit patroon (`fs` + `MarkdownRenderer`).
- **Evaluatie kandidaten**:
  1. **Gekozen — Minimale eigen build-time pipeline in `lib/contentlayer.ts` (`node:fs` + `node:path` + `gray-matter@^4.0.3`) + bestaande `MarkdownRenderer`**: Slechts één kleine, stabiele parser-dependency (`gray-matter@^4.0.3`) nodig voor YAML-frontmatter van `content/posts/*.mdx`, `content/pages/*.md` en `content/authors/*.md`; `content/global/index.json` en `content/theme/tags.json` worden direct met `JSON.parse` gelezen. Alle 12 bestaande functiesignaturen en types (`Post`, `Page`, `Author`, `Global`, `Theme`) blijven 1-op-1 behouden. Geen codegen (`.contentlayer/generated`), geen Webpack-plugin (`withContentlayer`), geen Clipanion-crash bij `next dev`.
  2. **Afgevallen — Native `@next/mdx` + eigen lib-laag**: `@next/mdx` compileert `.mdx` naar React-componenten maar levert geen YAML-frontmatter of ruwe markdown-string (`post.body.raw`) die `extractTocItems`, `calculateReadingTime` en de ASCII-diagram-interceptors in `MarkdownRenderer` vereisen. De ongebruikte packages `@next/mdx`, `@mdx-js/loader` en `@mdx-js/react` worden daarom uit `package.json` verwijderd.
  3. **Afgevallen — `contentlayer2` + `next-contentlayer2`**: Laatste npm-release `0.5.8` dateert van 3 mei 2025 (18 maanden stilstand) en behoudt de zware Effect-TS/Clipanion/esbuild-codegen-koppeling.
  4. **Afgevallen — `qino` (`@qino/cms`)**: Pre-1.0 (`0.17.0`), single-maintainer product van de indiener van issue #36 (lead-generation). Onnodige externe lock-in voor 3 posts en 7 pagina's.

### 2. Vervanging van het bestaande Contentlayer-oppervlak (Fase B)
- `lib/contentlayer.ts` exporteert zelf de TypeScript-interfaces `Author`, `Post`, `Page`, `Global`, `Theme` én behoudt exact alle 12 bestaande publieke functies (`getAllPosts`, `getPostBySlug`, `getPostsByTag`, `getAllPages`, `getPageBySlug`, `getAllAuthors`, `getAuthorByPath`, `getGlobalConfig`, `getAllThemes`, `getAllTags`, `getPostWithAuthor`, `getAllPostsWithAuthors`).
- Normaliseer in `lib/contentlayer.ts` YAML-datums uit `gray-matter` (`js-yaml` parset `date: 2026-07-21` als `Date`) naar een ISO-string (`data.date instanceof Date ? data.date.toISOString() : String(data.date ?? '')`), zodat `post.date` een `string` blijft voor `Metadata` en RSC-serialisatie.
- Wijzig in de 4 bestanden die types rechtstreeks uit `.contentlayer/generated` importeerden het type-importpad naar `lib/contentlayer`:
  - `app/posts/[...filename]/client-page.tsx`: `import type { Post, Author } from '../../../lib/contentlayer';`
  - `app/posts/client-page.tsx`: `import type { Post, Author } from '../../lib/contentlayer';`
  - `components/blocks/index.tsx`: `import type { Page } from '../../lib/contentlayer';`
  - `components/layout/layout-context.tsx`: `import type { Global } from '../../lib/contentlayer';`
- Verwijder `contentlayer.config.ts`, verwijder `.contentlayer/generated` uit `tsconfig.json`, en verwijder `.contentlayer` uit `.gitignore`.

### 3. Next.js 14 → 16 & React 18.3.1 → 19 upgrade (Fase B)
1. **Packages & versies**:
   - Verwijder uit `package.json`: `contentlayer`, `next-contentlayer`, `@next/mdx`, `@mdx-js/loader`, `@mdx-js/react`.
   - Zet in `dependencies`: `"next": "^16.4.4"`, `"react": "^19.3.1"`, `"react-dom": "^19.3.1"`, `"next-themes": "^0.4.6"`, `"gray-matter": "^4.0.3"`.
   - Zet in `devDependencies`: `"eslint-config-next": "^16.4.4"`, `"@types/react": "^19.3.0"`, `"@types/react-dom": "^19.3.0"`, `"@playwright/test": "^1.64.1"`.
2. **Async `params`/`searchParams`**: Zijn in `app/[...filename]/page.tsx`, `app/posts/[...filename]/page.tsx`, `app/posts/page.tsx` en `app/skills/[...slug]/page.tsx` reeds `Promise<...>` met `await`.
3. **`output: 'standalone'` + file-tracing + Turbopack**: Behoud `output: 'standalone'` in `next.config.js`, verwijder `withContentlayer`, voeg `turbopack: {}` en `outputFileTracingIncludes: { '/*': ['./content/**/*'] }` toe, en voeg in `Dockerfile` (stage `runner`) `COPY --from=builder /app/content ./content` toe.
4. **ESLint 9 flat config & scripts**: Vervang in `package.json` `"lint": "next lint"` door `"lint": "eslint ."`, zet `"dev": "next dev"` en `"build": "next build"`, verwijder het obsolete `"export"`-script, verwijder `.eslintrc.json` en maak `eslint.config.mjs` aan met de flat config van `eslint-config-next` (`"react/no-unescaped-entities": "off"`, ignores voor `.next/**`, `.worktrees/**`, `node_modules/**`, `.factory/**`).
5. **`next-themes` & `tsconfig.json`**: Wijzig in `components/theme-provider.tsx` de import naar `import { ThemeProvider as NextThemesProvider, type ThemeProviderProps } from "next-themes";`. Zet in `tsconfig.json` `"moduleResolution": "bundler"`, `"jsx": "react-jsx"`, voeg `".next/dev/types/**/*.ts"` toe aan `include`, voeg `".worktrees"` toe aan `exclude`, en verwijder `".contentlayer/generated"`.
6. **Lockfile & Dependabot**: Verwijder de verouderde `package-lock.json` (project gebruikt `pnpm@9.15.0`). Vervang in `.github/dependabot.yml` onder `allow` beide entries (`contentlayer` en `next-contentlayer`) door `dependency-name: "next"` en `dependency-name: "gray-matter"`.

### 4. Herbeoordeling `blocked_by` tegen het actuele bord (`6ae8b01648890299d9982021` in BAT)
- **Beslissing**: `blocked_by: [6ae8b01648890299d9982021]` blijft **VERPLICHT**.
- **Motivatie tegen het actuele bord**: Kaart `6ae8b01648890299d9982021` (`DEPLOY-PROD-ONLY-ON-MAIN`) staat op het actuele bord in de lijst **BAT** (`rol: bat`), nog níet in **Merged** (`rol: merged`). Conform het factory-contract (Filip's v14-regel: *"Afhankelijke kaarten blijven geblokkeerd tot zijn BAT OK. `blocked_by` vraagt Merged en een auto-merge is géén shortcut"*) en om te voorkomen dat een eventuele BAT-kickback op `DEPLOY-PROD-ONLY-ON-MAIN` conflicteert met `README.md` of het deploy-workflowgedrag tijdens deze upgrade, wacht deze kaart tot Filip `6ae8b01648890299d9982021` met `BAT OK` naar `Merged` promoveert.

## Acceptatiecriteria

- **AC-1 — Next.js 16 + React 19 + `gray-matter` + `@playwright/test` geïnstalleerd; Contentlayer en ongebruikte MDX-packages verwijderd**:
  - In `package.json` zijn `contentlayer`, `next-contentlayer`, `@next/mdx`, `@mdx-js/loader` en `@mdx-js/react` volledig verwijderd.
  - De gedeclareerde semver-ranges in `package.json` zijn exact `"next": "^16.4.4"`, `"eslint-config-next": "^16.4.4"`, `"react": "^19.3.1"`, `"react-dom": "^19.3.1"`, `"@types/react": "^19.3.0"`, `"@types/react-dom": "^19.3.0"`, `"next-themes": "^0.4.6"`, `"gray-matter": "^4.0.3"` en `"@playwright/test": "^1.64.1"`.
  - De daadwerkelijk geïnstalleerde pakketversies in `node_modules/<pkg>/package.json` matchen hun gedeclareerde major en minimumversie (`next` 16.x `>=16.4.4`, `eslint-config-next` 16.x `>=16.4.4`, `react`/`react-dom` 19.x `>=19.3.1`, `@types/react`/`@types/react-dom` 19.x `>=19.3.0`, `next-themes` `>=0.4.6`, `gray-matter` 4.x `>=4.0.3`, `@playwright/test` 1.x `>=1.64.1`).
  - Scripts in `package.json` zijn `"dev": "next dev"`, `"build": "next build"`, `"start": "next start"`, `"lint": "eslint ."`, `"dev:build": "next build"` (zonder `"export"`). `contentlayer.config.ts` en `package-lock.json` zijn verwijderd; `pnpm-lock.yaml` is synchroon met `package.json`.
  - **Bewijsmechanisme**:
    ```bash
    /usr/bin/python3 -c '
    import json, pathlib
    pkg = json.loads(pathlib.Path("package.json").read_text())
    all_deps = {**pkg.get("dependencies", {}), **pkg.get("devDependencies", {})}
    for removed in ("contentlayer", "next-contentlayer", "@next/mdx", "@mdx-js/loader", "@mdx-js/react"):
        assert removed not in all_deps, f"{removed} still in package.json"
    expected = {
        "next": ("^16.4.4", (16, 4, 4), 16),
        "eslint-config-next": ("^16.4.4", (16, 4, 4), 16),
        "react": ("^19.3.1", (19, 3, 1), 19),
        "react-dom": ("^19.3.1", (19, 3, 1), 19),
        "@types/react": ("^19.3.0", (19, 3, 0), 19),
        "@types/react-dom": ("^19.3.0", (19, 3, 0), 19),
        "next-themes": ("^0.4.6", (0, 4, 6), 0),
        "gray-matter": ("^4.0.3", (4, 0, 3), 4),
        "@playwright/test": ("^1.64.1", (1, 64, 1), 1),
    }
    for name, (rng, min_v, maj) in expected.items():
        assert all_deps.get(name) == rng, f"{name}: expected {rng}, got {all_deps.get(name)}"
        inst = json.loads((pathlib.Path("node_modules") / name / "package.json").read_text())["version"]
        ver = tuple(int(x) for x in inst.split("-")[0].split(".")[:3])
        assert ver[0] == maj and ver >= min_v, f"{name}: installed {inst} does not satisfy >={min_v} (major {maj})"
    assert pkg["scripts"]["dev"] == "next dev"
    assert pkg["scripts"]["build"] == "next build"
    assert pkg["scripts"]["start"] == "next start"
    assert pkg["scripts"]["lint"] == "eslint ."
    assert "export" not in pkg["scripts"]
    assert not pathlib.Path("contentlayer.config.ts").exists()
    assert not pathlib.Path("package-lock.json").exists()
    print("AC-1 PASS")
    ' && pnpm install --frozen-lockfile
    ```

- **AC-2 — `lib/contentlayer.ts` verwerkt alle content build-time zonder `.contentlayer/generated` en `.github/dependabot.yml` volgt `next` + `gray-matter`**:
  - `lib/contentlayer.ts` leest `content/posts/*.mdx`, `content/pages/*.md`, `content/authors/*.md`, `content/global/index.json` en `content/theme/*.json` via `node:fs` + `gray-matter` + `JSON.parse` en exporteert zowel de types (`Post`, `Page`, `Author`, `Global`, `Theme`) als alle 12 bestaande functies (`getAllPosts`, `getPostBySlug`, `getPostsByTag`, `getAllPages`, `getPageBySlug`, `getAllAuthors`, `getAuthorByPath`, `getGlobalConfig`, `getAllThemes`, `getAllTags`, `getPostWithAuthor`, `getAllPostsWithAuthors`).
  - Nergens in `app/`, `components/`, `lib/`, `next.config.js`, `tsconfig.json`, `.gitignore` of `.github/dependabot.yml` komt nog een import of referentie naar `.contentlayer/generated`, `contentlayer` of `next-contentlayer` voor.
  - In `.github/dependabot.yml` zijn `contentlayer` en `next-contentlayer` onder `updates[0].allow` volledig vervangen door `dependency-name: "next"` en `dependency-name: "gray-matter"`.
  - **Bewijsmechanisme**:
    ```bash
    ! grep -rn "contentlayer/generated\|next-contentlayer\|contentlayer/source-files" app/ components/ lib/ next.config.js tsconfig.json &&
    ! grep -ri "contentlayer" next.config.js tsconfig.json .github/dependabot.yml .gitignore &&
    /usr/bin/python3 -c '
    import yaml, pathlib
    dep = yaml.safe_load(pathlib.Path(".github/dependabot.yml").read_text())
    allowed = [item.get("dependency-name") for item in dep["updates"][0].get("allow", [])]
    assert set(allowed) == {"next", "gray-matter"} and len(allowed) == 2, f"Unexpected dependabot allow list: {allowed}"
    src = pathlib.Path("lib/contentlayer.ts").read_text()
    for fn in ("getAllPosts", "getPostBySlug", "getPostsByTag", "getAllPages", "getPageBySlug", "getAllAuthors", "getAuthorByPath", "getGlobalConfig", "getAllThemes", "getAllTags", "getPostWithAuthor", "getAllPostsWithAuthors"):
        assert f"export function {fn}" in src, f"Missing {fn} in lib/contentlayer.ts"
    print("AC-2 PASS")
    '
    ```

- **AC-3 — TypeScript (`tsc --noEmit`) en ESLint 9 (`pnpm run lint`) slagen zonder fouten**:
  - `.eslintrc.json` is vervangen door `eslint.config.mjs` (flat config op basis van `eslint-config-next`).
  - `tsconfig.json` gebruikt `"moduleResolution": "bundler"` en `"jsx": "react-jsx"`, heeft `.worktrees` in `exclude`, en bevat geen referentie naar `.contentlayer/generated`.
  - Zowel `pnpm run lint` als `pnpm exec tsc --noEmit` eindigen met exit-code `0`.
  - **Bewijsmechanisme**:
    ```bash
    test ! -f .eslintrc.json && test -f eslint.config.mjs && pnpm run lint && pnpm exec tsc --noEmit
    ```

- **AC-4 — Productiebuild (`pnpm run build`) met `output: 'standalone'` slaagt en bundelt `content/`**:
  - `next.config.js` behoudt `output: 'standalone'`, bevat `outputFileTracingIncludes: { '/*': ['./content/**/*'] }` en `turbopack: {}`, en gebruikt geen `withContentlayer`.
  - `Dockerfile` kopieert in de `runner`-stage `/app/content` naar `./content` (`COPY --from=builder /app/content ./content`).
  - `pnpm run build` slaagt met exit-code `0` en produceert `.next/standalone/server.js` én `.next/standalone/content/posts/openlingo-dark-factory.mdx`.
  - **Bewijsmechanisme**:
    ```bash
    pnpm run build &&
    test -f .next/standalone/server.js &&
    test -f .next/standalone/content/posts/openlingo-dark-factory.mdx &&
    grep -q "COPY --from=builder /app/content ./content" Dockerfile
    ```

- **AC-5 — Runtime rooktest op de standalone server bewijst dat alle pagina-, blog-, tag- en skills-routes HTTP 200 en verwachte inhoud teruggeven**:
  - Wanneer `.next/standalone/server.js` gestart wordt (met `.next/static` en `public` gekopieerd naar `.next/standalone/`), retourneren `/`, `/about`, `/how-i-work`, `/contact`, `/posts`, `/posts?tag=ai`, alle 3 blogposts (`/posts/openlingo-dark-factory`, `/posts/blind-coder-sighted-reviewer`, `/posts/automated-wiki-generation-hermes-chatgpt`), `/skills` en `/skills/wiki-generator/README` elk HTTP `200` met hun verwachte titel en opgeloste auteur (`Filip Van den Broeck`).
  - **Bewijsmechanisme**:
    ```bash
    cp -r public .next/standalone/public &&
    cp -r .next/static .next/standalone/.next/static &&
    PORT=3456 HOSTNAME=127.0.0.1 node .next/standalone/server.js &
    SRV_PID=$!
    trap "kill $SRV_PID 2>/dev/null || true" EXIT
    for i in $(seq 1 20); do curl -sf http://127.0.0.1:3456/ >/dev/null && break; sleep 0.5; done
    for route in / /about /how-i-work /contact /posts "/posts?tag=ai" /posts/openlingo-dark-factory /posts/blind-coder-sighted-reviewer /posts/automated-wiki-generation-hermes-chatgpt /skills /skills/wiki-generator/README; do
      status=$(curl -s -o /dev/null -w "%{http_code}" "http://127.0.0.1:3456${route}")
      test "$status" = "200" || { echo "FAIL $route: $status"; exit 1; }
    done
    curl -sf http://127.0.0.1:3456/posts/openlingo-dark-factory | grep -q "How I Set Up a Dark Factory" &&
    curl -sf http://127.0.0.1:3456/posts/openlingo-dark-factory | grep -q "Filip Van den Broeck" &&
    kill $SRV_PID
    trap - EXIT
    echo "AC-5 PASS"
    ```

- **AC-6 — Documentatie (`README.md`) en GitHub-repobeschrijving bijgewerkt zonder "TinaCMS" of "Contentlayer"**:
  - In `README.md` noemt `## Tech stack` **Next.js 16**, noemt `## Development` geen `contentlayer build` of `contentlayer dev` meer (maar `pnpm install` en `pnpm dev`), en blijft de sectie `## Deployment` behouden.
  - De GitHub-repobeschrijving van `vandenit/vandenit-website` is via `gh repo edit` bijgewerkt naar `"Official website of Vanden IT, showcasing modern full-stack development with Next.js and Radix UI"` (zonder verwijzing naar TinaCMS of Contentlayer).
  - **Bewijsmechanisme**:
    ```bash
    ! grep -i "contentlayer" README.md &&
    grep -q "Next.js 16" README.md &&
    grep -q "## Deployment" README.md &&
    DESC="$(gh repo view vandenit/vandenit-website --json description --jq '.description')" &&
    test "$DESC" = "Official website of Vanden IT, showcasing modern full-stack development with Next.js and Radix UI"
    ```

- **AC-7 — T0 verify-fondatie (`./verify` + `playwright.config.ts` + `tests/e2e/smoke.spec.ts` op basis van `data-testid`) levert groene as-is baseline op Next 14 én draait ongewijzigd groen op Next 16**:
  - In Fase A (eerste commit op de taakbranch: `BASELINE_SHA="$(git log --reverse --format=%H origin/main..HEAD | head -n 1)"`, waarop `package.json` nog `"next": "^14.2.21"` en `"contentlayer": "^0.3.4"` heeft) zijn `./verify` (modi `fast` en `full`), `playwright.config.ts`, `tests/e2e/smoke.spec.ts` en de `data-testid`-attributen uit de sectie WIREFRAMES gecommit.
  - Het Next 14 baseline-rapport `.factory/baseline-next14.json` (gegenereerd door `./verify full` op `BASELINE_SHA`) heeft `"commit_sha": "<BASELINE_SHA>"`, `"tier": "full"`, `"overall_status": "PASS"` en voor elke stap (`spec-guard`, `path-assertion-guard`, `secret-guard`, `typecheck`, `lint`, `production-build`, `playwright-smoke`) `"status": "PASS"`.
  - `tests/e2e/smoke.spec.ts` selecteert DOM-elementen **uitsluitend via `getByTestId`** (geen `getByText` of tekst-gebaseerde rol-selectors) en verifieert `/`, `/about`, `/how-i-work`, `/contact`, `/posts`, `/posts?tag=ai`, alle 3 blogposts, `/skills` en `/skills/wiki-generator/README` met 0 console-errors en 0 pageerrors.
  - Tussen `BASELINE_SHA` en `HEAD` zijn `./verify`, `playwright.config.ts` en `tests/e2e/smoke.spec.ts` voor **0 regels gewijzigd** (`git diff "$BASELINE_SHA"..HEAD -- verify playwright.config.ts tests/e2e/` is leeg).
  - Op `HEAD` (na de Next.js 16 + content-pipeline upgrade) slagen zowel `./verify fast` als `./verify full` met exit-code `0`, `"overall_status": "PASS"`, `"path_guard_triggered": false`, `"assertions_weakened": 0`, en voor elke stap `"status": "PASS"`.
  - **Bewijsmechanisme**:
    ```bash
    ./verify fast > /tmp/verify-fast-head.json &&
    ./verify full > /tmp/verify-full-head.json &&
    /usr/bin/python3 -c '
    import json, pathlib, subprocess
    base_sha = subprocess.check_output(["git", "log", "--reverse", "--format=%H", "origin/main..HEAD"], text=True).splitlines()[0].strip()
    base_pkg = json.loads(subprocess.check_output(["git", "show", f"{base_sha}:package.json"], text=True))
    assert base_pkg["dependencies"].get("next") == "^14.2.21", "Baseline commit is not on Next 14"
    assert base_pkg["dependencies"].get("contentlayer") == "^0.3.4", "Baseline commit is not on Contentlayer"
    diff_sensor = subprocess.check_output(["git", "diff", f"{base_sha}..HEAD", "--", "verify", "playwright.config.ts", "tests/e2e/"], text=True)
    assert diff_sensor == "", f"Sensor or e2e files modified after T0 baseline:\n{diff_sensor}"
    e2e_src = pathlib.Path("tests/e2e/smoke.spec.ts").read_text()
    assert "getByTestId(" in e2e_src and "getByText(" not in e2e_src, "e2e must select via data-testid only"
    base_rep = json.loads(pathlib.Path(".factory/baseline-next14.json").read_text())
    assert base_rep["commit_sha"] == base_sha and base_rep["overall_status"] == "PASS"
    assert all(s["status"] == "PASS" for s in base_rep["steps"]), f"Baseline steps not all PASS: {base_rep[\"steps\"]}"
    for p in ("/tmp/verify-fast-head.json", "/tmp/verify-full-head.json"):
        rep = json.loads(pathlib.Path(p).read_text())
        assert rep["overall_status"] == "PASS", f"{p} overall_status={rep[\"overall_status\"]}"
        assert not rep["guards"]["path_guard_triggered"] and rep["guards"]["assertions_weakened"] == 0
        assert all(s["status"] == "PASS" for s in rep["steps"]), f"{p} steps failed: {rep[\"steps\"]}"
    print("AC-7 PASS")
    '
    ```

## WIREFRAMES

Er is **geen visuele UI-wijziging** in deze taak: alle pagina's, componenten, stijlen en URL-routes behouden exact hun bestaande lay-out en zichtbare inhoud. Voor de T0 e2e-baseline (`tests/e2e/smoke.spec.ts`) worden in Fase A uitsluitend de volgende niet-visuele `data-testid`-attributen op bestaande DOM-containers geplaatst:
- Globale shell: `components/nav/header.tsx` → `<header data-testid="site-header">`; `components/nav/footer.tsx` → `<footer className="site-footer" data-testid="site-footer">`.
- Blokcomponenten (`/` en `/[...filename]`):
  - `components/blocks/hero.tsx` → `<section className="vdit-hero" data-testid="hero-section">` en `<Heading as="h1" ... data-testid="hero-title">`.
  - `components/blocks/about-header.tsx` → `<header className="vdit-about-header" data-testid="about-header">`.
  - `components/blocks/engagement-process.tsx` → `<section className="vdit-process" ... data-testid="engagement-process">`.
  - `components/blocks/contact-hero.tsx` → `<div className="vdit-contact-hero" data-testid="contact-hero">`.
- Blog (`/posts` en `/posts/[...filename]`):
  - `app/posts/client-page.tsx` → `<Heading as="h1" ... data-testid="posts-heading">`, `<article className="vdit-feature-entry" data-testid="featured-post-card">`, en `<Box key={post._id} className="vdit-card" ... data-testid="post-list-card">`.
  - `app/posts/tag-filter-panel.tsx` → `<Container ... data-testid="tag-filter-panel">`, op de `/posts`-link `data-testid="tag-filter-all"`, en op elke tag-link `data-testid={`tag-filter-${tag}`}`.
  - `app/posts/[...filename]/client-page.tsx` → `<article ... data-testid="post-article">`, `<h1 id="case-study-title" ... data-testid="post-title">`, `<span itemProp="author" data-testid="post-author">`, en `<div className="vdit-article-content" data-testid="post-content">`.
- Skills (`/skills` en `/skills/[...slug]`):
  - `app/skills/page.tsx` → `<h1 id="skills-doc-title" ... data-testid="skills-heading">` en `<Box key={collection} ... data-testid={`skill-collection-${collection}`}>`.
  - `app/skills/[...slug]/page.tsx` → `<article ... data-testid="skill-doc-article">`, `<h1 id="skills-doc-title" ... data-testid="skill-doc-title">`, en `<div className="vdit-article-content" data-testid="skill-doc-content">`.

## Sensor-aanpassingen

Deze taak **introduceert de T0 verify-fondatie** (`./verify`, `playwright.config.ts` en `tests/e2e/smoke.spec.ts`) in `/home/filip/projects/vandenit-website`, omdat de doelrepo nog geen `./verify` bezat:
1. **Verhouding tot het factory-contract**:
   - In het standaard factory-contract is `./verify` na de T0-introductie-PR bevroren en vormt elke wijziging aan `./verify`, `playwright.config.ts`, `.factory/` (buiten `.factory/spec.json`) of bestaande testbestanden een META-MR dat **BY DESIGN escaleert** (`ESCALATE_PATH_GUARD`) naar Filip.
   - Conform Filip's kaart-specifieke **SPEC-GATE** (comment `6ae8b50ff5d7982d1c925f91`) wordt de T0 verify-fondatie voor `vandenit-website` in Fase A van déze kaart gebouwd en is auto-merge van de resulterende PR toegestaan omdat **beide gates** afgedwongen zijn:
     - **Gate 1 (Spec-gate door Filip vóór pickup)**: na een `APPROVED`-verdict van de refiner-reviewer verplaatst de refiner deze kaart **NIET** naar `Spec Approved` (`todo`), maar parkeert haar in `To Refine` (`[ACTIE — REVIEW]`-mail + marker-comment + `REFINER DONE APPROVED_PARKED_FOR_FVD`). Pas na Filip's expliciete `GO` gaat de kaart naar `Spec Approved`. Daarmee keurt Filip het T0-sensorontwerp vooraf goed.
     - **Gate 2 (As-is sensor-garantie op Next 14 vóór de upgrade)**: de worker commit in Fase A (`BASELINE_SHA`) eerst `./verify`, `playwright.config.ts`, `tests/e2e/smoke.spec.ts` en de `data-testid`-attributen op de ongewijzigde Next 14 + Contentlayer stack en bewijst een 100% groene `./verify full`-run (`.factory/baseline-next14.json`). Vanaf `BASELINE_SHA` zijn `./verify`, `playwright.config.ts` en `tests/e2e/**` bevroren.
2. **Werking van `path-assertion-guard` in `./verify`**:
   - Wanneer `./verify` nog niet op `origin/main` bestaat (deze initiële PR), vergelijkt `path-assertion-guard` de bestanden `verify`, `playwright.config.ts` en `tests/e2e/**` tegen de eerste commit op de branch waarin `verify` is geïntroduceerd (`BASELINE_SHA`). Wijzigt Fase B ook maar één regel aan die bestanden t.o.v. `BASELINE_SHA`, dan rapporteert `./verify` `path_guard_triggered: true` en `overall_status: "ESCALATE_PATH_GUARD"` (exit-code `1`, auto-merge geblokkeerd).
   - Zodra deze PR naar `main` is gemerged, bestaat `verify` op `origin/main` en vergelijkt `path-assertion-guard` bij alle toekomstige kaarten automatisch tegen `origin/main`, zodat elke latere sensor- of testwijziging BY DESIGN escaleert als META-MR.

## Constraints-blok

- **i18n & e2e-selectie**: i18n-antipatronen zijn verboden (geen hardcoded taal-literalen in nieuw toegevoegde UI-code; alle zichtbare tekst via het i18n-/content-systeem) en e2e-tests in `tests/e2e/` selecteren uitsluitend via `data-testid` (`getByTestId`), nooit via gebruikerstaal of zichtbare tekst.
- **SPEC-GATE voor de refiner**: Bij `APPROVED` in de refiner-review verplaatst de refiner deze kaart NIET naar `todo` (`Spec Approved`), maar stuurt de `[ACTIE — REVIEW]`-mail naar Filip, plaatst de marker-comment en eindigt met `REFINER DONE APPROVED_PARKED_FOR_FVD`.
- **Geen CMS-features**: Alle content management is agent-driven via git. Voeg géén CMS-admin, visual editor of externe CMS-SDK (`@qino/cms`, `tinacms`, `contentlayer2`) toe.
- **Behoud publieke lib-API**: De 12 helperfuncties en 5 interfaces in `lib/contentlayer.ts` behouden hun exacte naam en return-vorm.
- **Factory-contract**: `spec → worktree → bevroren verify (Fase A baseline op Next 14 → Fase B upgrade op Next 16) → blinde Argon → PR → auto-merge (mits ./verify fast + full elke stap PASS zonder ESCALATE_PATH_GUARD) / anders Filip merged` (met `Closes #36` in de PR-beschrijving).

## CONTEXT VOOR PICKUP

De implementerende agent werkt in een schone git-worktree van `/home/filip/projects/vandenit-website` (GitHub: `vandenit/vandenit-website`, branch vanaf `origin/main` nadat `6ae8b01648890299d9982021` in `Merged` staat) en moet vóór aanpassing de volgende bestanden lezen:

1. `/home/filip/projects/vandenit-website/package.json`, `/home/filip/projects/vandenit-website/next.config.js` en `/home/filip/projects/vandenit-website/contentlayer.config.ts` — huidige Next 14 + Contentlayer configuratie en document-schema's.
2. `/home/filip/projects/vandenit-website/lib/contentlayer.ts` en `/home/filip/projects/vandenit-website/lib/skills.ts` — huidige Contentlayer-helpers en het reeds bestaande `fs`-patroon in `lib/skills.ts`.
3. `/home/filip/projects/vandenit-website/app/page.tsx`, `/home/filip/projects/vandenit-website/app/[...filename]/page.tsx`, `/home/filip/projects/vandenit-website/app/posts/page.tsx`, `/home/filip/projects/vandenit-website/app/posts/client-page.tsx`, `/home/filip/projects/vandenit-website/app/posts/tag-filter-panel.tsx`, `/home/filip/projects/vandenit-website/app/posts/[...filename]/page.tsx`, `/home/filip/projects/vandenit-website/app/posts/[...filename]/client-page.tsx`, `/home/filip/projects/vandenit-website/app/skills/page.tsx` en `/home/filip/projects/vandenit-website/app/skills/[...slug]/page.tsx`.
4. `/home/filip/projects/vandenit-website/components/nav/header.tsx`, `/home/filip/projects/vandenit-website/components/nav/footer.tsx`, `/home/filip/projects/vandenit-website/components/blocks/index.tsx`, `/home/filip/projects/vandenit-website/components/blocks/hero.tsx`, `/home/filip/projects/vandenit-website/components/blocks/about-header.tsx`, `/home/filip/projects/vandenit-website/components/blocks/engagement-process.tsx`, `/home/filip/projects/vandenit-website/components/blocks/contact-hero.tsx`, `/home/filip/projects/vandenit-website/components/layout/layout-context.tsx` en `/home/filip/projects/vandenit-website/components/theme-provider.tsx`.
5. `/home/filip/projects/vandenit-website/content/posts/`, `/home/filip/projects/vandenit-website/content/pages/`, `/home/filip/projects/vandenit-website/content/authors/filip.md`, `/home/filip/projects/vandenit-website/content/global/index.json` en `/home/filip/projects/vandenit-website/content/theme/tags.json`.
6. `/home/filip/projects/vandenit-website/Dockerfile`, `/home/filip/projects/vandenit-website/tsconfig.json`, `/home/filip/projects/vandenit-website/.eslintrc.json`, `/home/filip/projects/vandenit-website/.gitignore`, `/home/filip/projects/vandenit-website/.github/dependabot.yml` en `/home/filip/projects/vandenit-website/README.md`.

blocked_by: [6ae8b01648890299d9982021]
