import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Layout from "../../../components/layout/layout";
import { MarkdownRenderer } from "../../../components/markdown-renderer";
import { ArticleToc } from "../../../components/article/article-toc";
import { Container, Section } from "@radix-ui/themes";
import {
  getSkillDocBySlug,
  getSkillCollections,
  getSkillFiles,
} from "../../../lib/skills";

/**
 * Skill documentation pages: /skills/<collection>/<file>
 *
 * Static — generateStaticParams enumerates skills/ at build time, so the
 * standalone output needs no runtime filesystem access. Unknown paths
 * resolve to 404 (the skills/ directory is not shipped in the runtime
 * image, and existsSync returns false for them).
 */

const GITHUB_BLOB_BASE =
  "https://github.com/vandenit/vandenit-website/blob/main/skills";

interface PageProps {
  params: Promise<{ slug: string[] }>;
}

function extractTocItems(rawBody: string): { id: string; label: string }[] {
  const h2Regex = /^## (.+)$/gm;
  const items: { id: string; label: string }[] = [];
  let match;
  while ((match = h2Regex.exec(rawBody)) !== null) {
    const label = match[1].trim();
    const slug = label
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-");
    items.push({ id: slug, label });
  }
  return items;
}

export default async function SkillDocPage({ params }: PageProps) {
  const { slug } = await params;
  if (slug.length !== 2) notFound();

  const [collection, fileSlug] = slug;
  const doc = getSkillDocBySlug(collection, fileSlug);
  if (!doc) notFound();

  const siblings = getSkillFiles(collection)
    .filter((f) => f !== doc.fileName)
    .map((f) => ({
      slug: f.replace(/\.md$/, ""),
      label: prettify(f.replace(/\.md$/, "")),
      href: `/skills/${collection}/${f.replace(/\.md$/, "")}`,
    }));

  const tocItems = extractTocItems(doc.content);
  const githubUrl = `${GITHUB_BLOB_BASE}/${doc.collection}/${doc.fileName}`;

  return (
    <Layout>
    <Section size="3" pt={{ initial: "7", sm: "9" }} className="vdit-article-section">
      <article aria-labelledby="skills-doc-title">
        <Container size="3" px="6">
          <header className="vdit-article-header">
            <div className="vdit-article-kicker">
              <span className="vdit-kicker">
                <Link href="/skills">Skills</Link> / {doc.collection}
              </span>
            </div>

            <h1 id="skills-doc-title" className="vdit-article-title">
              {doc.title}
            </h1>

            <div className="vdit-article-meta">
              <span className="vdit-article-meta-item">
                <span className="vdit-article-meta-label">Collection</span>
                {doc.collection}
              </span>
              {doc.updated && (
                <span className="vdit-article-meta-item">
                  <span className="vdit-article-meta-label">Updated</span>
                  <time dateTime={doc.updated.toISOString().split("T")[0]}>
                    {doc.updated.toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </time>
                </span>
              )}
              <span className="vdit-article-meta-item">
                <span className="vdit-article-meta-label">Source</span>
                <a
                  href={githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="vdit-article-back-link"
                  style={{ display: "inline" }}
                >
                  View on GitHub ↗
                </a>
              </span>
            </div>

            <Link href="/skills" className="vdit-article-back-link">
              ← All skills
            </Link>
          </header>
        </Container>

        <Container size="3" px="6" mt="6">
          <div className="vdit-article-layout">
            <aside className="vdit-article-sidebar">
              {siblings.length > 0 && (
                <nav className="vdit-article-toc" aria-label="In this collection">
                  <p className="vdit-toc-title">In this collection</p>
                  <ul className="vdit-toc-list">
                    {siblings.map((s) => (
                      <li key={s.slug} className="vdit-toc-item">
                        <Link href={s.href} className="vdit-toc-link">
                          {s.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </nav>
              )}
              <ArticleToc items={tocItems} />
            </aside>

            <div className="vdit-article-body">
              <div className="vdit-article-content">
                <MarkdownRenderer content={doc.content} />
              </div>
            </div>
            <div className="vdit-article-toc-mobile">
              <ArticleToc items={tocItems} />
            </div>
          </div>
        </Container>
      </article>
    </Section>
    </Layout>
  );
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  if (slug.length !== 2) return {};
  const [collection, fileSlug] = slug;
  const doc = getSkillDocBySlug(collection, fileSlug);
  if (!doc) return {};

  const canonical = `/skills/${doc.collection}/${doc.slug}`;
  const description =
    doc.description ||
    `Documentation from the ${doc.collection} collection.`;

  return {
    title: `${doc.title} — Skills`,
    description,
    alternates: { canonical },
    openGraph: {
      title: `${doc.title} — Vanden IT`,
      description,
      url: canonical,
    },
  };
}

export function generateStaticParams() {
  const params: { slug: string[] }[] = [];
  for (const collection of getSkillCollections()) {
    for (const file of getSkillFiles(collection)) {
      params.push({ slug: [collection, file.replace(/\.md$/, "")] });
    }
  }
  return params;
}

function prettify(slug: string): string {
  return slug
    .split(/[-_]/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}