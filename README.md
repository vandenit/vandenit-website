# Vanden IT Website

The website for [Vanden IT](https://vandenit.be) — the personal site and blog of Filip Van den Broeck, senior full-stack developer and fractional tech lead. It doubles as a working example of AI-assisted development: designed and built in iterative loops where an AI agent implements, and independent AI reviewers (Claude via the Antigravity CLI) check the visual result and the code.

## What's on the site

- **[Blog](https://vandenit.be/posts)** — practical write-ups on AI-powered development workflows. Start with [The Blind Coder and the Sighted Reviewer](https://vandenit.be/posts/blind-coder-sighted-reviewer) and [Five Book Wikis in 48 Hours](https://vandenit.be/posts/automated-wiki-generation-hermes-chatgpt).
- **[Skills & Playbooks](https://vandenit.be/skills)** — reproducible AI-workflow documentation, served from the [`skills/`](./skills) directory in this repository. The [wiki-generator collection](./skills/wiki-generator/README.md) documents the Hermes + ChatGPT audiobook-wiki pipeline end to end: source prep (EPUB or Whisper transcript), Drive bridge protocol, queue pattern, review loop, systemd + Tailscale serving.
- **[About](https://vandenit.be/about) / [How I Work](https://vandenit.be/how-i-work) / [Contact](https://vandenit.be/contact)** — positioning and engagement model.

## Tech stack

- **Next.js 14** (App Router) + **Contentlayer** for content (`content/posts/*.mdx`, `content/pages/*.md`, `content/authors/*.md`)
- **Radix UI Themes** for the design system
- Deployed via **GitHub Actions → Docker → DigitalOcean Kubernetes**, behind Cloudflare

## Development

```bash
npm install
npx contentlayer build
npx next dev -p 3000
```

Notes:

- Use `npx contentlayer build && npx next dev` — `npm run dev` is wired to `contentlayer dev`, which crashes on a clipanion TypeError (known upstream incompatibility between contentlayer 0.3.x and newer clipanion versions; the explicit command is the workaround).
- After changing `contentlayer.config.ts`, clear the cache first: `rm -rf .contentlayer && npx contentlayer build`.
- The `/skills` pages are generated from `skills/**/*.md` at build time — no runtime filesystem access. Add a `.md` file under a subdirectory of `skills/` and it appears in the index.

## Adding content

- **Blog post**: add `content/posts/<slug>.mdx` with Contentlayer frontmatter (`title`, `date`, `excerpt`, `author: content/authors/filip.md`, `tags`). The only author is `filip`.
- **Skills documentation**: add or edit markdown files under `skills/<collection>/`. The site picks them up automatically, and each page links back to its source file on GitHub.

## Contact

- Website: [vandenit.be](https://vandenit.be)
- Email: [filip@vandenit.be](mailto:filip@vandenit.be)
- GitHub: [github.com/vandenit](https://github.com/vandenit)

## License

This project is licensed under the [Apache 2.0 license](./LICENSE).