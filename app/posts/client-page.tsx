"use client";
import { format } from "date-fns";
import Link from "next/link";
import React from "react";
import { Flex, Box, Heading, Text, Avatar, Card, Container, Section, Badge } from '@radix-ui/themes';
import { BsArrowRight } from "react-icons/bs";
import { FaShieldAlt } from "react-icons/fa";
import { TagFilterPanel } from "./tag-filter-panel";
import type { Post, Author } from '.contentlayer/generated';

interface ClientPostProps {
  posts: (Post & { authorData?: Author })[];
  tags: string[];
}

export default function PostsClientPage({ posts, tags }: ClientPostProps) {
  return (
    <>
      {/* Blog Header */}
      <Section size="3" mb="4" pt={{ initial: '7', sm: '9' }}>
        <Container size="3" px="6">
          <Flex direction="column" align="center" gap="4">
            <Badge size="2" variant="soft" color="blue" radius="full">
              Blog
            </Badge>
            <Heading as="h1" size={{ initial: '7', sm: '8' }} weight="bold" align="center">
              Security & Development
            </Heading>
            <Text size={{ initial: '4', sm: '5' }} color="gray" align="center" style={{ maxWidth: '600px', lineHeight: '1.6' }}>
              Stay updated with the latest in web security, development best practices,
              and insights from the field.
            </Text>
          </Flex>
        </Container>
      </Section>

      <TagFilterPanel tags={tags} />

      <Container size="3" px="6">
        {posts.length === 0 ? (
          <Flex justify="center" p="8">
            <Text size="4" color="gray">No posts found.</Text>
          </Flex>
        ) : (
          <>
            {/* Featured Post (OWASP post if it exists) */}
            {posts.find(post => post.slug.includes('owasp')) && (
              <Box mb="6">
                <Box mb="3">
                  <Badge size="2" variant="soft" color="amber" radius="full">
                    Featured
                  </Badge>
                </Box>
                {(() => {
                  const featuredPost = posts.find(post => post.slug.includes('owasp'));
                  if (!featuredPost) return null;

                  const date = new Date(featuredPost.date);
                  const formattedDate = !isNaN(date.getTime()) ? format(date, "MMM dd, yyyy") : "";

                  return (
                    <Card className="card-elevated card-featured" size="4" style={{ overflow: 'hidden' }}>
                      <Link href={featuredPost.url} style={{ textDecoration: 'none', color: 'inherit' }}>
                        <Box p="6" className="card-content-wrap">
                          <Flex align="start" gap="4">
                            {/* Icon — hidden on mobile to give heading more room */}
                            <Box flexShrink="0" display={{ initial: 'none', sm: 'flex' }} style={{ alignItems: 'center', justifyContent: 'center', width: '56px', height: '56px', borderRadius: '12px', background: 'var(--accent-3)' }}>
                              <FaShieldAlt size="1.8em" color="var(--accent-9)" />
                            </Box>
                            <Box flexGrow="1" className="card-content-wrap" style={{ minWidth: 0 }}>
                              <Heading as="h3" size={{ initial: '5', sm: '6' }} weight="bold" mb="3" style={{ overflowWrap: 'normal', wordBreak: 'normal', hyphens: 'none' }}>
                                {featuredPost.title}
                              </Heading>
                              {featuredPost.excerpt && (
                                <Text as="p" size="3" color="gray" mb="4" style={{ lineHeight: '1.6' }}>
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
                                      size="2"
                                      radius="full"
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
                                  <BsArrowRight size="1.2em" color="var(--accent-9)" />
                                </Box>
                              </Flex>
                            </Box>
                          </Flex>
                        </Box>
                      </Link>
                    </Card>
                  );
                })()}
              </Box>
            )}

            {/* All Posts */}
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
                    <Card key={post._id} className="card-elevated" size="3">
                      <Link href={post.url} style={{ textDecoration: 'none', color: 'inherit' }}>
                        <Box p="5">
                          <Flex align="start" gap="3">
                            <Box flexGrow="1">
                              <Flex align="center" mb="2" justify="between">
                                <Heading as="h3" size="4" weight="bold">
                                  {post.title}
                                </Heading>
                                <BsArrowRight color="var(--accent-9)" />
                              </Flex>

                              {post.excerpt && (
                                <Text as="p" size="2" color="gray" mb="4" style={{ lineHeight: '1.5' }}>
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
                                        size="1"
                                        radius="full"
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
                                    {post.tags.slice(0, 3).map((tag) => (
                                      <Badge key={tag} size="1" variant="soft" color="gray">
                                        {tag}
                                      </Badge>
                                    ))}
                                  </Flex>
                                )}
                              </Flex>
                            </Box>
                          </Flex>
                        </Box>
                      </Link>
                    </Card>
                  );
                })}
              </Flex>
            </Section>
          </>
        )}
      </Container>
    </>
  );
}