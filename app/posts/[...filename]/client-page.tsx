"use client";
import React from "react";
import { format } from "date-fns";
import Link from "next/link";
import { Container, Section, Flex, Heading, Text, Box, Avatar, Badge } from "@radix-ui/themes";
import { MarkdownRenderer } from "../../../components/markdown-renderer";
import type { Post, Author } from '.contentlayer/generated';

interface ClientPostProps {
  post: Post & { authorData?: Author };
}

export default function PostClientPage({ post }: ClientPostProps) {
  const date = new Date(post.date);
  let formattedDate = "";
  if (!isNaN(date.getTime())) {
    formattedDate = format(date, "MMM dd, yyyy");
  }

  return (
    <Section size="3" pt={{ initial: '7', sm: '9' }}>
      <Container size="3" px="6">
        <Flex direction="column" align="center" gap="4" mb="6">
          {/* Tags as badges at top */}
          {post.tags && post.tags.length > 0 && (
            <Flex gap="2" wrap="wrap" justify="center">
              {post.tags.map((tag) => (
                <Link key={tag} href={`/posts?tag=${tag}`} style={{ textDecoration: 'none' }}>
                  <Badge size="1" variant="soft" color="blue">
                    {tag}
                  </Badge>
                </Link>
              ))}
            </Flex>
          )}

          <Heading as="h1" size={{ initial: '6', sm: '9' }} weight="bold" align="center" style={{ maxWidth: '800px', hyphens: 'none', overflowWrap: 'break-word' }}>
            {post.title}
          </Heading>

          <Flex align="center" justify="center" gap="3">
            {post.authorData && (
              <Flex align="center" gap="2">
                <Avatar
                  src={post.authorData.avatar}
                  alt={post.authorData.name}
                  size="2"
                  radius="full"
                  fallback={post.authorData.name?.[0] || 'A'}
                />
                <Text size="2" color="gray">
                  {post.authorData.name}
                </Text>
              </Flex>
            )}
            {post.authorData && formattedDate && (
              <Text size="2" color="gray" style={{ opacity: 0.5 }}>·</Text>
            )}
            {formattedDate && (
              <Text size="2" color="gray">
                {formattedDate}
              </Text>
            )}
          </Flex>
        </Flex>
      </Container>

      {post.heroImg && (
        <Container size="3" px="6">
          <Box mb="5" mt="3" style={{ borderRadius: '12px', overflow: 'hidden' }}>
            <img
              src={post.heroImg}
              alt={post.title}
              style={{ width: '100%', height: 'auto', display: 'block' }}
            />
          </Box>
        </Container>
      )}

      <Container size="3" px="6">
        <Box mb="8" style={{ maxWidth: '720px', margin: '0 auto' }}>
          <MarkdownRenderer content={post.body.raw} />
        </Box>
      </Container>
    </Section>
  );
}