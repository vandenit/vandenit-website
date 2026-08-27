"use client";
import React from "react";
import { format } from "date-fns";
import Link from "next/link";
import { Container, Section, Flex, Badge } from "@radix-ui/themes";
import { MarkdownRenderer } from "../../../components/markdown-renderer";
import { ArticleToc } from "../../../components/article/article-toc";
import type { Post, Author } from '.contentlayer/generated';

interface ClientPostProps {
  post: Post & { authorData?: Author };
  readingTime: number;
  tocItems: { id: string; label: string }[];
}

export default function PostClientPage({ post, readingTime, tocItems }: ClientPostProps) {
  const date = new Date(post.date);
  const formattedDate = !isNaN(date.getTime()) ? format(date, "MMM d, yyyy") : "";
  const isoDate = !isNaN(date.getTime()) ? date.toISOString().split("T")[0] : "";

  return (
    <Section size="3" pt={{ initial: '7', sm: '9' }} className="vdit-article-section">
      <article aria-labelledby="case-study-title">
        {/* Case-file header */}
        <Container size="3" px="6">
          <header className="vdit-article-header">
            <div className="vdit-article-kicker">
              <span className="vdit-kicker">Case File / AI Delivery Workflow</span>
            </div>

            <h1 id="case-study-title" className="vdit-article-title">
              {post.title}
            </h1>

            <div className="vdit-article-meta">
              <span className="vdit-article-meta-item">
                <span className="vdit-article-meta-label">Author</span>
                <span itemProp="author">
                  {post.authorData ? post.authorData.name : 'Filip Van den Broeck'}
                </span>
              </span>
              {isoDate && (
                <span className="vdit-article-meta-item">
                  <span className="vdit-article-meta-label">Published</span>
                  <time dateTime={isoDate}>{formattedDate}</time>
                </span>
              )}
              <span className="vdit-article-meta-item">
                <span className="vdit-article-meta-label">Reading time</span>
                <span>{readingTime} min</span>
              </span>
            </div>

            <Link href="/posts" className="vdit-article-back-link">
              ← Back to blog
            </Link>

            {post.tags && post.tags.length > 0 && (
              <Flex gap="2" wrap="wrap" mt="3">
                {post.tags.map((tag) => (
                  <Link key={tag} href={`/posts?tag=${tag}`} style={{ textDecoration: 'none' }}>
                    <Badge size="1" variant="soft" color="gray">
                      {tag}
                    </Badge>
                  </Link>
                ))}
              </Flex>
            )}
          </header>
        </Container>

        {/* Article body with TOC sidebar */}
        <Container size="3" px="6" mt="6">
          <div className="vdit-article-layout">
            {/* Desktop TOC side rail */}
            <aside className="vdit-article-sidebar">
              <ArticleToc items={tocItems} />
            </aside>

            {/* Mobile TOC chips */}
            <div className="vdit-article-toc-mobile">
              <ArticleToc items={tocItems} />
            </div>

            {/* Article content */}
            <div className="vdit-article-body">
              <div className="vdit-article-content">
                <MarkdownRenderer content={post.body.raw} />
              </div>
            </div>
          </div>
        </Container>
      </article>
    </Section>
  );
}