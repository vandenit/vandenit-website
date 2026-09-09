import fs from "fs";
import path from "path";

/**
 * Skills directory reader.
 *
 * Serves the markdown files in skills/<collection>/ as documentation pages.
 * All filesystem reads happen at BUILD time (generateStaticParams + static
 * rendering), so the standalone Docker output needs no runtime access to
 * the skills/ directory. At runtime, unknown paths simply resolve to 404
 * because the directory is absent.
 *
 * A collection is any first-level directory under skills/ containing at
 * least one .md file.
 */

export interface SkillDoc {
  /** Collection slug, e.g. "wiki-generator" */
  collection: string;
  /** Actual file name on disk, e.g. "README.md" */
  fileName: string;
  /** URL slug derived from the file name, e.g. "README" */
  slug: string;
  /** H1 title extracted from the markdown */
  title: string;
  /** Short description from the first paragraph */
  description: string;
  /** Last git commit date touching the file, if git is available */
  updated: Date | null;
  /** Markdown body with frontmatter stripped, H1 removed and relative links rewritten */
  content: string;
}

const SKILLS_DIR = path.join(process.cwd(), "skills");

export function getSkillCollections(): string[] {
  if (!fs.existsSync(SKILLS_DIR)) return [];
  return fs
    .readdirSync(SKILLS_DIR, { withFileTypes: true })
    .filter((e) => e.isDirectory())
    .map((e) => e.name)
    .filter((name) => getSkillFiles(name).length > 0)
    .sort();
}

/** .md files in a collection, README first, rest alphabetical. */
export function getSkillFiles(collection: string): string[] {
  const dir = path.join(SKILLS_DIR, collection);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".md"))
    .sort((a, b) => {
      const aReadme = a.toLowerCase() === "readme.md" ? 0 : 1;
      const bReadme = b.toLowerCase() === "readme.md" ? 0 : 1;
      return aReadme - bReadme || a.localeCompare(b);
    });
}

export function getSkillDoc(collection: string, file: string): SkillDoc | null {
  if (!file.endsWith(".md")) return null;
  const fullPath = path.join(SKILLS_DIR, collection, file);
  if (!fs.existsSync(fullPath)) return null;

  const raw = fs.readFileSync(fullPath, "utf8");
  const { body, title } = parseMarkdown(raw, file);

  return {
    collection,
    fileName: file,
    slug: file.replace(/\.md$/, ""),
    title,
    description: extractDescription(body),
    updated: getGitLastModified(fullPath),
    content: rewriteRelativeLinks(body, collection),
  };
}

/** Last commit date touching a file, via git. Null when git is unavailable. */
function getGitLastModified(fullPath: string): Date | null {
  try {
    const { execSync } = require("child_process") as typeof import("child_process");
    const out = execSync(
      `git log -1 --format=%cI -- ${JSON.stringify(fullPath)}`,
      { cwd: path.dirname(fullPath), encoding: "utf8", stdio: ["pipe", "pipe", "ignore"] }
    ).toString().trim();
    return out ? new Date(out) : null;
  } catch {
    return null;
  }
}

/**
 * Look up a doc by URL slug. Case-insensitive fallback so
 * /readme and /README both resolve to README.md (canonical stays the
 * real file name).
 */
export function getSkillDocBySlug(
  collection: string,
  slug: string
): SkillDoc | null {
  const direct = getSkillDoc(collection, `${slug}.md`);
  if (direct) return direct;

  const target = slug.toLowerCase();
  const match = getSkillFiles(collection).find(
    (f) => f.replace(/\.md$/, "").toLowerCase() === target
  );
  return match ? getSkillDoc(collection, match) : null;
}

/**
 * Strip YAML frontmatter if present, extract the first H1 as title and
 * remove it from the body (the page renders its own header).
 */
function parseMarkdown(raw: string, file: string): { body: string; title: string } {
  let text = raw;

  if (text.startsWith("---")) {
    const end = text.indexOf("\n---", 3);
    if (end !== -1) {
      text = text.slice(end + 4).replace(/^\s*\n/, "");
    }
  }

  const h1Match = text.match(/^#\s+(.+)$/m);
  const title = h1Match
    ? h1Match[1].trim()
    : file.replace(/\.md$/, "").replace(/[-_]/g, " ");

  const body = h1Match
    ? text.replace(h1Match[0], "").replace(/^\s*\n/, "")
    : text;

  return { body, title };
}

function extractDescription(body: string): string {
  const firstPara =
    body
      .split(/\n\s*\n/)
      .map((p) => p.trim())
      .find(
        (p) =>
          p &&
          !p.startsWith("#") &&
          !p.startsWith("```") &&
          !p.startsWith("|") &&
          !p.startsWith("-") &&
          !p.startsWith("[!")
      ) || "";
  // Strip markdown link syntax, then cut at a word boundary with an ellipsis
  const clean = firstPara.replace(/\[(.+?)\]\((.+?)\)/g, "$1");
  if (clean.length <= 180) return clean.trim();
  const cut = clean.slice(0, 180);
  const lastSpace = cut.lastIndexOf(" ");
  return (lastSpace > 100 ? cut.slice(0, lastSpace) : cut).trim() + "…";
}

/**
 * Rewrite relative .md links (./file.md or file.md) to site pages
 * (/skills/<collection>/<file>) so they work when rendered on the site.
 * Fence-aware: code blocks are left untouched.
 */
function rewriteRelativeLinks(body: string, collection: string): string {
  const segments = body.split(/(```[\s\S]*?```)/g);
  return segments
    .map((segment, i) => {
      if (i % 2 === 1) return segment; // inside a code fence
      return segment.replace(
        /\]\((\.\/)?([A-Za-z0-9._-]+)\.md(#[^)]*)?\)/g,
        (_m, _dot, file, anchor) =>
          `](/skills/${collection}/${file}${anchor || ""})`
      );
    })
    .join("");
}