"use client";
import React from "react";
import { useLayout } from "../../../components/layout/layout-context";
import { format } from "date-fns";
import { FaTag } from "react-icons/fa";
import Link from "next/link";
import { Container, Section, Flex, Heading, Text, Box, Avatar, Link as RadixLink } from "@radix-ui/themes";
import { MDXRenderer } from "../../../components/mdx-renderer";
import type { Post, Author } from '.contentlayer/generated';

interface ClientPostProps {
  post: Post & { authorData?: Author };
}

export default function PostClientPage({ post }: ClientPostProps) {
  const { theme } = useLayout();

  const date = new Date(post.date);
  let formattedDate = "";
  if (!isNaN(date.getTime())) {
    formattedDate = format(date, "MMM dd, yyyy");
  }

  // For now, we'll render the raw content since MDX processing needs to be set up differently

  return (
    <Section>
      <Container>
        <Heading
          as="h1" size={{ initial: '6', sm: '9' }} mb="4"
          align="center"
        >
          {post.title}
        </Heading>

        <Flex
          align="center"
          justify="center"
          mb="16"
        >
          {post.authorData && (
            <>
              <Box mr="4" flexShrink="0">
                <Avatar
                  src={post.authorData.avatar}
                  alt={post.authorData.name}
                  size="4"
                  radius="full"
                  fallback={post.authorData.name?.[0] || 'A'}
                />
              </Box>
              <Text
                size="2"
                color="gray"
              >
                {post.authorData.name}
              </Text>
              <Text size="2" mx="2" weight="bold" color="gray">
                —
              </Text>
            </>
          )}
          <Text
            size="2"
            color="gray"
          >
            {formattedDate}
          </Text>
        </Flex>

        {post.tags && (
          <Flex align="center" justify="center" mb="5" mt="5">
            <FaTag />
            {post.tags.map((tag) => (
              <Text key={tag} size="1" weight="bold" ml="2">
                <RadixLink asChild>
                  <Link href={`/posts?tag=${tag}`}>{tag}</Link>
                </RadixLink>
              </Text>
            ))}
          </Flex>
        )}

      </Container>
      <Container>
        {post.heroImg && (
          <Box mb="5" mt="5" >
            <img
              src={post.heroImg}
              alt={post.title}
              aria-hidden="true"
              width="100%"
            />
          </Box>
        )}
      </Container>

      <Container>
        <Box mb="8">
          <MDXRenderer mdxSource={post.body} />
        </Box>
      </Container>
    </Section>
  );
}
