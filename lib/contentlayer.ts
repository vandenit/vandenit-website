import fs from "fs";
import path from "path";
import matter from "gray-matter";

/**
 * Minimal build-time content pipeline (replaces the unmaintained legacy
 * generated-content stack, task NEXT16-CONTENT-PIPELINE).
 *
 * Same reader surface as that stack produced — the 5 document types and all
 * 12 public helper functions keep their exact names and return shapes, so no
 * consumer changes behavior. All filesystem reads happen at BUILD time
 * (module scope, generateStaticParams + static rendering), matching the
 * lib/skills.ts pattern: the standalone output carries content/ via
 * outputFileTracingIncludes but never reads it at request time.
 *
 * Frontmatter dates arrive as js-yaml Date objects and are normalized to ISO
 * strings, exactly like the previous generated `date` field
 * ("2026-11-02T00:00:00.000Z").
 */

export interface RawDocumentData {
  /** File path relative to the content dir, e.g. "posts/foo.mdx" */
  sourceFilePath: string;
  /** File name with extension, e.g. "foo.mdx" */
  sourceFileName: string;
  /** File directory relative to the content dir, e.g. "posts" */
  sourceFileDir: string;
  /** Content kind: "markdown" | "mdx" | "data" */
  contentType: string;
  /** Path without extension, e.g. "posts/foo" */
  flattenedPath: string;
}

export interface MarkdownBody {
  /** Raw markdown with the frontmatter stripped */
  raw: string;
  /** Compiled markdown (unused legacy field, kept for shape parity) */
  html: string;
}

export interface MdxBody {
  /** Raw markdown with the frontmatter stripped */
  raw: string;
  /** Compiled MDX (unused legacy field — the app renders `raw` through
   * MarkdownRenderer — kept for shape parity) */
  code: string;
}

export interface Author {
  _id: string;
  _raw: RawDocumentData;
  type: "Author";
  name: string;
  avatar?: string | undefined;
  body: MarkdownBody;
  url: string;
}

export interface Post {
  _id: string;
  _raw: RawDocumentData;
  type: "Post";
  title: string;
  heroImg?: string | undefined;
  excerpt?: string | undefined;
  /** Reference to an author file, e.g. "content/authors/filip.md" */
  author?: string | undefined;
  /** ISO date string, e.g. "2026-11-02T00:00:00.000Z" */
  date: string;
  tags?: string[] | undefined;
  body: MdxBody;
  url: string;
  slug: string;
}

export interface Page {
  _id: string;
  _raw: RawDocumentData;
  type: "Page";
  title: string;
  /** Page blocks/sections (JSON frontmatter) */
  blocks?: any | undefined;
  body: MarkdownBody;
  url: string;
  slug: string;
}

export interface Global {
  _id: string;
  _raw: RawDocumentData;
  type: "Global";
  header?: any | undefined;
  footer?: any | undefined;
  theme?: any | undefined;
}

export interface Theme {
  _id: string;
  _raw: RawDocumentData;
  type: "Theme";
  /** Theme data (tags, etc.) */
  data?: string[] | undefined;
  _template?: string | undefined;
}

const CONTENT_DIR = path.join(process.cwd(), "content");

/** Normalize a frontmatter date (js-yaml Date or string) to an ISO string. */
function isoDate(value: unknown): string {
  if (value instanceof Date) return value.toISOString();
  return String(value ?? "");
}

function readFileBody(
  sourceFilePath: string,
  contentType: string
): { data: Record<string, unknown>; body: string } {
  const fullPath = path.join(CONTENT_DIR, sourceFilePath);
  const { data, content } = matter(fs.readFileSync(fullPath, "utf8"));
  return { data: data as Record<string, unknown>, body: content };
}

function rawDoc(
  sourceFilePath: string,
  contentType: string
): RawDocumentData {
  const sourceFileDir = path.dirname(sourceFilePath) === "." ? "" : path.dirname(sourceFilePath);
  return {
    sourceFilePath,
    sourceFileName: path.basename(sourceFilePath),
    sourceFileDir,
    contentType,
    flattenedPath: sourceFilePath.replace(/\.(md|mdx|json)$/, ""),
  };
}

function readAuthor(sourceFilePath: string): Author {
  const { data, body } = readFileBody(sourceFilePath, "markdown");
  const raw = rawDoc(sourceFilePath, "markdown");
  return {
    _id: sourceFilePath,
    _raw: raw,
    type: "Author",
    name: String(data.name ?? ""),
    avatar: data.avatar ? String(data.avatar) : undefined,
    body: { raw: body, html: "" },
    url: `/authors/${raw.flattenedPath}`,
  };
}

function readPost(sourceFilePath: string): Post {
  const { data, body } = readFileBody(sourceFilePath, "mdx");
  const raw = rawDoc(sourceFilePath, "mdx");
  const slug = raw.flattenedPath.replace(/^posts\//, "");
  return {
    _id: sourceFilePath,
    _raw: raw,
    type: "Post",
    title: String(data.title ?? ""),
    heroImg: data.heroImg ? String(data.heroImg) : undefined,
    excerpt: data.excerpt ? String(data.excerpt) : undefined,
    author: data.author ? String(data.author) : undefined,
    date: isoDate(data.date),
    tags: Array.isArray(data.tags) ? data.tags.map(String) : undefined,
    body: { raw: body, code: "" },
    url: `/posts/${slug}`,
    slug,
  };
}

function readPage(sourceFilePath: string): Page {
  const { data, body } = readFileBody(sourceFilePath, "markdown");
  const raw = rawDoc(sourceFilePath, "markdown");
  const slug = raw.sourceFileName.replace(/\.md$/, "");
  return {
    _id: sourceFilePath,
    _raw: raw,
    type: "Page",
    title: String(data.title ?? ""),
    blocks: (data.blocks ?? undefined) as any,
    body: { raw: body, html: "" },
    url: `/${slug}`,
    slug,
  };
}

function readTheme(sourceFilePath: string): Theme {
  const raw = rawDoc(sourceFilePath, "data");
  const parsed = JSON.parse(fs.readFileSync(path.join(CONTENT_DIR, sourceFilePath), "utf8"));
  return {
    _id: sourceFilePath,
    _raw: raw,
    type: "Theme",
    data: Array.isArray(parsed.data) ? parsed.data.map(String) : undefined,
    _template: parsed._template ? String(parsed._template) : undefined,
  };
}

function readGlobal(): Global {
  const sourceFilePath = "global/index.json";
  const raw = rawDoc(sourceFilePath, "data");
  const parsed = JSON.parse(fs.readFileSync(path.join(CONTENT_DIR, sourceFilePath), "utf8"));
  return {
    _id: sourceFilePath,
    _raw: raw,
    type: "Global",
    header: parsed.header,
    footer: parsed.footer,
    theme: parsed.theme,
  };
}

function listDir(dirName: string, extension: RegExp): string[] {
  const dir = path.join(CONTENT_DIR, dirName);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => extension.test(f))
    .sort()
    .map((f) => path.join(dirName, f).split(path.sep).join("/"));
}

const allAuthors: Author[] = listDir("authors", /\.md$/).map(readAuthor);
const allPages: Page[] = listDir("pages", /\.md$/).map(readPage);
const allPosts: Post[] = listDir("posts", /\.mdx$/).map(readPost);
const allThemes: Theme[] = listDir("theme", /\.json$/).map(readTheme);
const global: Global = readGlobal();

// Get all posts (sorted newest first, like the previous getAllPosts)
export function getAllPosts(): Post[] {
  return allPosts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

// Get post by slug
export function getPostBySlug(slug: string): Post | undefined {
  return allPosts.find((post) => post.slug === slug)
}

// Get posts by tag (with author resolution and sorting)
export function getPostsByTag(tag: string): (Post & { authorData?: Author })[] {
  return getAllPostsWithAuthors().filter((post) => post.tags?.includes(tag));
}

// Get all pages
export function getAllPages(): Page[] {
  return allPages
}

// Get page by slug
export function getPageBySlug(slug: string): Page | undefined {
  return allPages.find((page) => page.slug === slug)
}

// Get all authors
export function getAllAuthors(): Author[] {
  return allAuthors
}

// Get author by reference path
export function getAuthorByPath(path: string): Author | undefined {
  // Convert path like "content/authors/pedro.md" to slug "pedro"
  const slug = path.replace('content/authors/', '').replace('.md', '')
  return allAuthors.find((author) => author._raw.flattenedPath === slug)
}

// Get global configuration
export function getGlobalConfig(): Global | undefined {
  return global // Should be singleton
}

// Get all themes/tags
export function getAllThemes(): Theme[] {
  return allThemes
}

// Get all tags from published posts (not from static tags.json)
export function getAllTags(): string[] {
  const posts = getAllPosts()
  const tagSet = new Set<string>()
  posts.forEach((post) => {
    post.tags?.forEach((tag: string) => tagSet.add(tag))
  })
  return Array.from(tagSet).sort((a, b) => a.localeCompare(b));
}

// Helper function to resolve author for posts
export function getPostWithAuthor(post: Post): Post & { authorData?: Author } {
  if (!post.author) return post

  const authorData = getAuthorByPath(post.author)
  return {
    ...post,
    authorData
  }
}

// Get all posts with resolved authors
export function getAllPostsWithAuthors(): (Post & { authorData?: Author })[] {
  return getAllPosts().map(getPostWithAuthor)
}