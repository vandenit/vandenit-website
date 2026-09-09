import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Layout from "../../components/layout/layout";
import { Container, Section, Flex, Badge, Text, Box } from "@radix-ui/themes";
import { getSkillCollections, getSkillFiles, getSkillDoc } from "../../lib/skills";

/**
 * Skills index page: /skills
 *
 * Lists the documentation collections served from the skills/ directory.
 * Static — rendered at build time.
 */

const GITHUB_TREE_URL =
  "https://github.com/vandenit/vandenit-website/tree/main/skills";

export default function SkillsIndexPage() {
  const collections = getSkillCollections();
  if (collections.length === 0) notFound();

  return (
    <Layout>
    <Section size="3" pt={{ initial: "7", sm: "9" }} className="vdit-article-section">
      <Container size="3" px="6">
        <header className="vdit-article-header">
          <div className="vdit-article-kicker">
            <span className="vdit-kicker">Documentation</span>
          </div>

          <h1 id="skills-doc-title" className="vdit-article-title">
            Skills &amp; Playbooks
          </h1>

          <p
            className="vdit-article-excerpt"
            style={{ maxWidth: "48rem", marginBottom: "1rem" }}
          >
            Reproducible AI-workflow documentation, published from the same
            repository as this site. Each collection documents a working
            pipeline end to end — the protocol, the failure log, and the
            commands to rebuild it.
          </p>

          <div className="vdit-article-meta">
            <span className="vdit-article-meta-item">
              <span className="vdit-article-meta-label">Source</span>
              <a
                href={GITHUB_TREE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="vdit-article-back-link"
                style={{ display: "inline" }}
              >
                github.com/vandenit/vandenit-website/skills ↗
              </a>
            </span>
          </div>
        </header>
      </Container>

      <Container size="3" px="6" mt="6">
        {collections.map((collection) => {
          const files = getSkillFiles(collection);
          const isReadme = (f: string) => f.toLowerCase() === "readme.md";

          return (
            <Box key={collection} mb="6">
              <Flex align="baseline" gap="3" mb="2">
                <h2
                  style={{
                    fontFamily: "var(--vdit-font-display)",
                    color: "var(--vdit-color-text)",
                    fontSize: "1.5rem",
                    margin: 0,
                  }}
                >
                  {collection}
                </h2>
                <Badge size="1" variant="soft" color="gray">
                  {files.length} document{files.length === 1 ? "" : "s"}
                </Badge>
              </Flex>

              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {files.map((f) => {
                  const doc = getSkillDoc(collection, f);
                  const href = `/skills/${collection}/${f.replace(/\.md$/, "")}`;
                  return (
                    <li key={f} style={{ marginBottom: "0.75rem" }}>
                      <Link
                        href={href}
                        style={{
                          display: "block",
                          padding: "0.75rem 1rem",
                          border: "1px solid var(--gray-6)",
                          borderRadius: "8px",
                          textDecoration: "none",
                        }}
                      >
                        <Text
                          as="div"
                          size="3"
                          weight={isReadme(f) ? "bold" : "regular"}
                        >
                          {doc ? doc.title : f.replace(/\.md$/, "")}
                        </Text>
                        {doc && doc.description && (
                          <Text as="p" size="2" color="gray" mb="0">
                            {doc.description}
                          </Text>
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </Box>
          );
        })}
      </Container>
    </Section>
    </Layout>
  );
}

export function generateMetadata(): Metadata {
  return {
    title: "Skills & Playbooks",
    description:
      "Reproducible AI-workflow documentation published from the vandenit-website repository: the wiki-generator pipeline and its operating protocol.",
    alternates: { canonical: "/skills" },
    openGraph: {
      title: "Skills & Playbooks — Vanden IT",
      description:
        "Reproducible AI-workflow documentation published from the vandenit-website repository.",
      url: "/skills",
    },
  };
}