"use client";
import React from "react";
import Image from "next/image";
import { useLayout } from "../../../components/layout/layout-context";
import { tinaField, useTina } from "tinacms/dist/react";
import { format } from "date-fns";
import { PostQuery } from "../../../tina/__generated__/types";
import { TinaMarkdown } from "tinacms/dist/rich-text";
import { components } from "../../../components/mdx-components";
import { FaTag } from "react-icons/fa";
import Link from "next/link";
import { Container, Section, Flex, Heading, Text, Box, Avatar, Link as RadixLink } from "@radix-ui/themes";

interface ClientPostProps {
  data: PostQuery;
  variables: {
    relativePath: string;
  };
  query: string;
}

export default function PostClientPage(props: ClientPostProps) {
  const { theme } = useLayout();
  const { data } = useTina({ ...props });
  const post = data.post;

  const date = new Date(post.date);
  let formattedDate = "";
  if (!isNaN(date.getTime())) {
    formattedDate = format(date, "MMM dd, yyyy");
  }

  return (
    <Section>
      <Container>
        <Heading
          data-tina-field={tinaField(post, "title")}
          as="h1" size={{ initial: '6', sm: '9' }} mb="4"
          align="center"
        >
          {post.title}
        </Heading>

        <Flex
          data-tina-field={tinaField(post, "author")}
          align="center"
          justify="center"
          mb="16"
        >
          {post.author && (
            <>
              <Box mr="4" flexShrink="0">
                <Avatar
                  data-tina-field={tinaField(post.author, "avatar")}
                  src={post.author.avatar}
                  alt={post.author.name}
                  size="4"
                  radius="full"
                  fallback={post.author.name[0]}
                />
              </Box>
              <Text
                data-tina-field={tinaField(post.author, "name")}
                size="2"
                color="gray"
              >
                {post.author.name}
              </Text>
              <Text size="2" mx="2" weight="bold" color="gray">
                —
              </Text>
            </>
          )}
          <Text
            data-tina-field={tinaField(post, "date")}
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
          <Box data-tina-field={tinaField(post, "heroImg")} mb="5" mt="5" >
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
        <Box data-tina-field={tinaField(post, "_body")} mb="8">
          <TinaMarkdown components={components} content={post._body} />
        </Box>
      </Container>
    </Section>
  );
}
