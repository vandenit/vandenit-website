"use client";
import { format } from "date-fns";
import Link from "next/link";
import Image from "next/image";
import React from "react";
import { Flex, Box, Heading, Text, Link as RadixLink, Avatar, Card } from '@radix-ui/themes';

import { useLayout } from "../../components/layout/layout-context";
import { BsArrowRight } from "react-icons/bs";
import { TinaMarkdown } from "tinacms/dist/rich-text";
import {
  PostConnectionQuery,
  PostConnectionQueryVariables,
} from "../../tina/__generated__/types";
import { useTina } from "tinacms/dist/react";
import { FaTag } from "react-icons/fa";
import { TagFilterPanel } from "./tag-filter-panel";


interface ClientPostProps {
  data: PostConnectionQuery;
  variables: PostConnectionQueryVariables;
  query: string;
  tags: string[];
}

export default function PostsClientPage(props: ClientPostProps) {
  const { data } = useTina({ ...props });
  const { tags } = props;
  const { theme } = useLayout();

  return (
    <>
      <TagFilterPanel tags={tags} />
      {data?.postConnection.edges.map((postData) => {
        const post = postData.node;
        const date = new Date(post.date);
        let formattedDate = "";
        if (!isNaN(date.getTime())) {
          formattedDate = format(date, "MMM dd, yyyy");
        }
        return (
          <RadixLink asChild key={post.id} >
            <Link
              key={post.id}
              href={`/posts/` + post._sys.breadcrumbs.join("/")}
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

                  <Text size="2" color="gray" mb="5">
                    <TinaMarkdown content={post.excerpt} />
                  </Text>

                  <Flex align="center">
                    <Box mr="2" flexShrink="0">
                      <Avatar
                        src={post?.author?.avatar}
                        alt={post?.author?.name}
                        fallback={post?.author?.name}
                        size="4"
                      />
                    </Box>
                    <Text size="2" color="gray">
                      {post?.author?.name}
                    </Text>
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
