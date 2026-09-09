# Safety — wiki-generator

Read this before running the pipeline unattended or adapting it to your own material.

## Data handling

- The workflow sends **source-derived text and generated images through external products**: ChatGPT (summaries, images), Google Drive (all shared state), and your agent's model provider (integration and review). Anything you feed into the pipeline is visible to those providers.
- The generated wikis are **private**. This pipeline is a personal reading companion, not a publishing pipeline. If you publish output, you own checking the rights to the source material first.
- **Source books must be legally obtained** (purchased EPUBs, your own audiobooks). Do not feed pirated or leaked material into it.
- Do not reuse this exact pattern for confidential client material without reviewing provider retention, permissions and access controls first. The failure knowledge in these files comes from recreational content; the same transparency does not exist for regulated data.

## Unattended operation

- The integration cron runs hourly with filesystem access, git push rights, and Drive write access. Scope its credentials to what it needs: a Drive account that can only see the bridge folders, git remotes that only hold the wikis.
- The review command in `wiki-builder.md` uses `--dangerously-skip-permissions` (with `script -qc` for PTY allocation). That flag is an **operator choice with consequences**, not a default recommendation: it disables the CLI's permission prompts for that call. Here it is accepted for a short, read-only review call on the operator's own machine, in a workflow where the prompt is fixed and the inputs are only local image files. If you copy this pattern, first try running without the flag and only add it if a permission rule genuinely cannot be made to work.
- `prompts.md` is volatile by design; never treat it as the only copy of anything. The queue files hold the durable work state.

## Source material

- Transcripts are kept uncorrected as a faithful record of what the audio contained; corrections happen downstream in the wiki pages. Do not "fix" a transcript in place.
- Progressive building is a spoiler-safety property, not just an aesthetic one: chapter pages are generated with only the knowledge of chapters processed so far. Breaking it (e.g. by letting the model use external knowledge of the book) leaks later-chapter information into early pages.