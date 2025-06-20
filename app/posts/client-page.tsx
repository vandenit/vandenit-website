"use client";
import { format } from "date-fns";
import Link from "next/link";
import React from "react";
import { Flex, Box, Heading, Text, Link as RadixLink, Avatar, Card } from '@radix-ui/themes';
import { useLayout } from "../../components/layout/layout-context";
import { BsArrowRight } from "react-icons/bs";
import { FaTag } from "react-icons/fa";
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
      <TagFilterPanel tags={tags} />
      {posts.map((post) => {
        const date = new Date(post.date);
        let formattedDate = "";
        if (!isNaN(date.getTime())) {
          formattedDate = format(date, "MMM dd, yyyy");
        }
        return (
          <RadixLink asChild key={post._id} >
            <Link
              key={post._id}
              href={post.url}
            >
              <Box
                p="6"
                mb="4"
              >
                <Card>
                  <Flex>
                    <Heading size="3" weight="bold">
                      {post.title}{" "}
                    </Heading>
                    <Box
                      as="span"
                      pl="2"
                    >
                      <BsArrowRight />
                    </Box>
                  </Flex>

                  {post.excerpt && (
                    <Text size="2" color="gray" mb="5">
                      {post.excerpt}
                    </Text>
                  )}

                  <Flex align="center">
                    {post.authorData && (
                      <>
                        <Box mr="2" flexShrink="0">
                          <Avatar
                            src={post.authorData.avatar}
                            alt={post.authorData.name}
                            fallback={post.authorData.name?.[0] || 'A'}
                            size="4"
                          />
                        </Box>
                        <Text size="2" color="gray">
                          {post.authorData.name}
                        </Text>
                      </>
                    )}
                    {formattedDate && (
                      <>
                        <Text size="2" color="gray" mx="2">
                          —
                        </Text>
                        <Text size="2" color="gray">
                          {formattedDate}
                        </Text>
                      </>
                    )}
                    {post.tags && (
                      <Flex align="center" ml="auto">
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
                  </Flex>
                </Card>
              </Box>
            </Link>
          </RadixLink>
        );
      })}
    </>
  );
}
