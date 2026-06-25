"use client";
import { format } from "date-fns";
import Link from "next/link";
import React from "react";
import { Flex, Box, Heading, Text, Avatar, Card, Container, Section } from '@radix-ui/themes';
import { useLayout } from "../../components/layout/layout-context";
import { BsArrowRight } from "react-icons/bs";
import { FaTag, FaShieldAlt } from "react-icons/fa";
import { TagFilterPanel } from "./tag-filter-panel";
import type { Post, Author } from '.contentlayer/generated';

interface ClientPostProps {
  posts: (Post & { authorData?: Author })[];
  tags: string[];
}

export default function PostsClientPage({ posts, tags }: ClientPostProps) {
  const { theme } = useLayout();

  return (
    <>
      {/* Blog Header */}
      <Section mb="8">
        <Container>
          <Flex direction="column" align="center" mb="6">
            <Box mb="4">
              <FaShieldAlt size="3em" color="var(--accent-9)" />
            </Box>
            <Heading as="h1" size="8" mb="4" align="center">
              Security & Development Blog
            </Heading>
            <Text size="4" color="gray" align="center" style={{ maxWidth: '600px' }}>
              Stay updated with the latest in web security, development best practices,
              and insights from the field. Learn how to protect your applications and build secure software.
            </Text>
          </Flex>
        </Container>
      </Section>

      <TagFilterPanel tags={tags} />

      <Container>
        {posts.length === 0 ? (
          <Flex justify="center" p="8">
            <Text size="4" color="gray">No posts found.</Text>
          </Flex>
        ) : (
          <>
            {/* Featured Post (OWASP post if it exists) */}
            {posts.find(post => post.slug.includes('owasp')) && (
              <Section mb="8">
                <Heading as="h2" size="6" mb="4" color="red">
                  🔥 Featured Security Post
                </Heading>
                {(() => {
                  const featuredPost = posts.find(post => post.slug.includes('owasp'));
                  if (!featuredPost) return null;

                  const date = new Date(featuredPost.date);
                  const formattedDate = !isNaN(date.getTime()) ? format(date, "MMM dd, yyyy") : "";

                  return (
                    <Card size="3" style={{ background: 'var(--accent-2)', border: '2px solid var(--accent-6)' }}>
                      <Box p="6">
                        <Flex align="start" gap="4">
                          <Box flexShrink="0">
                            <FaShieldAlt size="2em" color="var(--accent-9)" />
                          </Box>
                          <Box flexGrow="1">
                            <Link href={featuredPost.url}>
                              <Heading size="5" weight="bold" mb="3" color="red">
                                {featuredPost.title}
                              </Heading>
                            </Link>
                            {featuredPost.excerpt && (
                              <Text size="3" color="gray" mb="4" style={{ lineHeight: '1.6' }}>
                                {featuredPost.excerpt}
                              </Text>
                            )}
                            <Flex align="center" gap="4">
                              {featuredPost.authorData && (
                                <Flex align="center" gap="2">
                                  <Avatar
                                    src={featuredPost.authorData.avatar}
                                    alt={featuredPost.authorData.name}
                                    fallback={featuredPost.authorData.name?.[0] || 'A'}
                                    size="3"
                                  />
                                  <Text size="2" color="gray">
                                    {featuredPost.authorData.name}
                                  </Text>
                                </Flex>
                              )}
                              {formattedDate && (
                                <Text size="2" color="gray">
                                  {formattedDate}
                                </Text>
                              )}
                              <Box ml="auto">
                                <Link href={featuredPost.url}>
                                  <BsArrowRight size="1.2em" />
                                </Link>
                              </Box>
                            </Flex>
                          </Box>
                        </Flex>
                      </Box>
                    </Card>
                  );
                })()}
              </Section>
            )}

            {/* All Posts */}
            <Section>
              <Heading as="h2" size="5" mb="6">
                All Posts
              </Heading>
              {posts.map((post) => {
                const date = new Date(post.date);
                let formattedDate = "";
                if (!isNaN(date.getTime())) {
                  formattedDate = format(date, "MMM dd, yyyy");
                }
                return (
                  <Box mb="4" key={post._id}>
                    <Card>
                      <Box p="5">
                        <Flex align="start" gap="3">
                          <Box flexGrow="1">
                            <Flex align="center" mb="2">
                              <Link href={post.url}>
                                <Heading size="4" weight="bold">
                                  {post.title}
                                </Heading>
                              </Link>
                              <Box ml="auto">
                                <Link href={post.url}>
                                  <BsArrowRight />
                                </Link>
                              </Box>
                            </Flex>

                            {post.excerpt && (
                              <Text size="2" color="gray" mb="4" style={{ lineHeight: '1.5' }}>
                                {post.excerpt}
                              </Text>
                            )}

                            <Flex align="center" justify="between">
                              <Flex align="center" gap="3">
                                {post.authorData && (
                                  <Flex align="center" gap="2">
                                    <Avatar
                                      src={post.authorData.avatar}
                                      alt={post.authorData.name}
                                      fallback={post.authorData.name?.[0] || 'A'}
                                      size="2"
                                    />
                                    <Text size="2" color="gray">
                                      {post.authorData.name}
                                    </Text>
                                  </Flex>
                                )}
                                {formattedDate && (
                                  <Text size="2" color="gray">
                                    {formattedDate}
                                  </Text>
                                )}
                              </Flex>

                              {post.tags && (
                                <Flex align="center" gap="2">
                                  <FaTag size="0.8em" />
                                  {post.tags.slice(0, 3).map((tag) => (
                                    <Text key={tag} size="1" weight="bold">
                                      <Link href={`/posts?tag=${tag}`}>{tag}</Link>
                                    </Text>
                                  ))}
                                </Flex>
                              )}
                            </Flex>
                          </Box>
                        </Flex>
                      </Box>
                    </Card>
                  </Box>
                );
              })}
            </Section>
          </>
        )}
      </Container>
    </>
  );
}