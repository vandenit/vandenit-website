# Vanden IT Website

The website for [Vanden IT](https://vandenit.be) — the personal site and blog of Filip Van den Broeck, senior full-stack developer and fractional tech lead. It doubles as a working example of AI-assisted development: designed and built in iterative loops where an AI agent implements, and independent AI reviewers (Claude via the Antigravity CLI) check the visual result and the code.

## What's on the site

- **[Blog](https://vandenit.be/posts)** — practical write-ups on AI-powered development workflows. Start with [The Blind Coder and the Sighted Reviewer](https://vandenit.be/posts/blind-coder-sighted-reviewer) and [Five Book Wikis in 48 Hours](https://vandenit.be/posts/automated-wiki-generation-hermes-chatgpt).
- **[Skills & Playbooks](https://vandenit.be/skills)** — reproducible AI-workflow documentation, served from the [`skills/`](./skills) directory in this repository. The [wiki-generator collection](./skills/wiki-generator/README.md) documents the Hermes + ChatGPT audiobook-wiki pipeline end to end: source prep (EPUB or Whisper transcript), Drive bridge protocol, queue pattern, review loop, systemd + Tailscale serving.
- **[About](https://vandenit.be/about) / [How I Work](https://vandenit.be/how-i-work) / [Contact](https://vandenit.be/contact)** — positioning and engagement model.

## Tech stack

- **Next.js 16** (App Router, Turbopack) + **React 19** on a light build-time content pipeline (`node:fs` + `gray-matter` reading `content/posts/*.mdx`, `content/pages/*.md`, `content/authors/*.md` — content management is agent-driven via git)
- **Radix UI Themes** for the design system
- Deployed via **GitHub Actions → Docker → DigitalOcean Kubernetes**, behind Cloudflare

## Deployment

- `main` is the **development** branch: pushes and merged PRs to `main` trigger **no** deploy.
- The `production` branch is the **release line**: a PR from `main` into `production`, once merged, deploys live via [`.github/workflows/dev-workflow.yml`](./.github/workflows/dev-workflow.yml) (GitHub Actions → Docker → DigitalOcean Kubernetes, behind Cloudflare). Feature-branch pushes trigger **no** deploy; preview deployments do not exist.
- The `production` branch is protected (PR required, no force pushes or deletions), so every release is an explicit merge.
- A manual re-deploy of the current release is possible via the workflow's `workflow_dispatch` trigger: `gh workflow run dev-workflow.yml --ref production` (or the "Run workflow" button in the GitHub Actions UI).
- Content can intentionally lag: `main` may be ahead of `production` between releases; pages that link to source files on GitHub keep pointing at `main`.
- Naming note (intentionally unchanged): the `kube/dev/` manifests and the Kubernetes namespace `dev` on the DOKS cluster `k8s-1-vandenit-ams3-dev` carry a legacy "dev" name but serve the **live production** environment (https://vandenit.be).

## Development

```bash
pnpm install
pnpm dev
```

Notes:

- The content pages are generated from `content/` and `skills/` at build time — no runtime filesystem access. Add a `.md` file under a subdirectory of `skills/` and it appears in the index.
- `pnpm build` produces the standalone bundle; `content/` is traced into it (`outputFileTracingIncludes`) and copied again in the Docker runner stage.

## Adding content

- **Blog post**: add `content/posts/<slug>.mdx` with frontmatter (`title`, `date`, `excerpt`, `author: content/authors/filip.md`, `tags`). The only author is `filip`.
- **Skills documentation**: add or edit markdown files under `skills/<collection>/`. The site picks them up automatically, and each page links back to its source file on GitHub.

## Contact

- Website: [vandenit.be](https://vandenit.be)
- Email: [filip@vandenit.be](mailto:filip@vandenit.be)
- GitHub: [github.com/vandenit](https://github.com/vandenit)

## License

This project is licensed under the [Apache 2.0 license](./LICENSE).