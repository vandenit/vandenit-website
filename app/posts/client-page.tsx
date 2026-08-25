"use client";
import { format } from "date-fns";
import Link from "next/link";
import React from "react";
import { Flex, Box, Heading, Text, Container, Section } from '@radix-ui/themes';
import { TagFilterPanel } from "./tag-filter-panel";
import type { Post, Author } from '.contentlayer/generated';

interface ClientPostProps {
  posts: (Post & { authorData?: Author })[];
  tags: string[];
  currentTag?: string;
  totalPostsCount: number;
}

export default function PostsClientPage({ posts, tags, currentTag, totalPostsCount }: ClientPostProps) {
  return (
    <>
      {/* Blog Header */}
      <Section size="3" mb="4" pt={{ initial: '7', sm: '9' }}>
        <Container size="3" px="6">
          <Flex direction="column" align="center" gap="4">
            <Heading as="h1" size={{ initial: '7', sm: '8' }} weight="bold" align="center">
              Building &amp; Shipping with AI
            </Heading>
            <Text size={{ initial: '4', sm: '5' }} color="gray" align="center" style={{ maxWidth: '600px', lineHeight: '1.6' }}>
              Notes from real development work: the workflows, failures, and judgment calls involved in building software with AI.
            </Text>
          </Flex>
        </Container>
      </Section>

      <TagFilterPanel tags={tags} postsCount={totalPostsCount} currentTag={currentTag} />

      <Container size="3" px="6">
        {posts.length === 0 ? (
          <Flex justify="center" p="8">
            <Text size="4" color="gray">No posts found.</Text>
          </Flex>
        ) : (
          <>
            {/* Strong ruled feature entry */}
            {(() => {
              const featuredPost = posts.length === 1 ? posts[0] : posts.find(p => p.slug.includes('owasp'));
              if (!featuredPost) return null;

              const date = new Date(featuredPost.date);
              const isoDate = !isNaN(date.getTime()) ? date.toISOString().split("T")[0] : "";
              const formattedDate = !isNaN(date.getTime()) ? format(date, "MMM d, yyyy") : "";

              // Calculate reading time (same logic as article page)
              const rawBody = featuredPost.body.raw || '';
              const wordCount = rawBody
                .replace(/```[\s\S]*?```/g, ' ')
                .replace(/`[^`]+`/g, ' ')
                .replace(/[#*>\-_~|]/g, ' ')
                .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
                .replace(/\s+/g, ' ')
                .trim()
                .split(' ')
                .filter((w) => w.length > 0).length;
              const readingTime = Math.max(1, Math.round(wordCount / 200));

              return (
                <Box mb="6">
                  <article className="vdit-feature-entry">
                    <Link href={featuredPost.url} className="vdit-feature-entry-link">
                      {/* Case metadata row */}
                      <div className="vdit-feature-entry-meta">
                        <span className="vdit-kicker">Case File</span>
                        {isoDate && (
                          <time dateTime={isoDate} className="vdit-feature-entry-date">
                            {formattedDate}
                          </time>
                        )}
                        <span className="vdit-feature-entry-reading">{readingTime} min read</span>
                      </div>

                      {/* Article title as H2 — page outline is H1 → H2 */}
                      <Heading as="h2" className="vdit-feature-entry-title">
                        {featuredPost.title}
                      </Heading>

                      {/* Excerpt */}
                      {featuredPost.excerpt && (
                        <p className="vdit-feature-entry-excerpt">
                          {featuredPost.excerpt}
                        </p>
                      )}

                      {/* Mini workflow rail crop as evidence cue */}
                      <div className="vdit-feature-entry-cue" aria-hidden="true">
                        <span className="vdit-system-label">Hermes → Claude → Feedback → Fix</span>
                        <span className="vdit-human-label">→ Filip decides what ships</span>
                      </div>

                      {/* Author */}
                      {featuredPost.authorData && (
                        <div className="vdit-feature-entry-author">
                          {featuredPost.authorData.name}
                        </div>
                      )}

                      {/* Read the case study */}
                      <span className="vdit-feature-entry-cta">
                        Read the case study →
                      </span>
                    </Link>
                  </article>
                </Box>
              );
            })()}

            {/* All Posts — hidden when there's only one post (already shown as featured) */}
            {posts.length > 1 && (
            <Section>
              <Heading as="h2" size="5" mb="6">
                All Posts
              </Heading>
              <Flex direction="column" gap="4">
                {posts.map((post) => {
                  const date = new Date(post.date);
                  let formattedDate = "";
                  if (!isNaN(date.getTime())) {
                    formattedDate = format(date, "MMM dd, yyyy");
                  }
                  return (
                    <Box key={post._id} className="vdit-card" p="5">
                      <Link href={post.url} style={{ textDecoration: 'none', color: 'inherit' }}>
                        <Heading as="h3" size="4" weight="bold" mb="2">
                          {post.title}
                        </Heading>
                        {post.excerpt && (
                          <Text as="p" size="2" color="gray" mb="3" style={{ lineHeight: '1.5' }}>
                            {post.excerpt}
                          </Text>
                        )}
                        <Flex align="center" gap="3">
                          {post.authorData && (
                            <Text size="2" color="gray">
                              {post.authorData.name}
                            </Text>
                          )}
                          {formattedDate && (
                            <Text size="2" color="gray">
                              {formattedDate}
                            </Text>
                          )}
                        </Flex>
                      </Link>
                    </Box>
                  );
                })}
              </Flex>
            </Section>
            )}
          </>
        )}
      </Container>
    </>
  );
}