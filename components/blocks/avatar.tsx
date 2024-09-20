"use client";
import * as React from "react";
import { TinaMarkdown } from "tinacms/dist/rich-text";
import type { Template } from "tinacms";
import { PageBlocksAvatar } from "../../tina/__generated__/types";
import { tinaField } from "tinacms/dist/react";
import Image from "next/image";
import { Actions } from "./actions";
import { Avatar, Box, Button, Card, Container, Flex, Grid, Heading, Section, Text } from "@radix-ui/themes";

export const AvatarBlock = ({ data }: { data: PageBlocksAvatar }) => (
  <Box p={{ initial: '0', sm: '4' }} pb="5" pt="5">
    <Card>
      <Flex gap="3" align="center">
        <Avatar
          src={data.avatarImage.src}
          fallback="A"
          size={{ initial: '6', sm: '8' }}
          mr="5"
        />
        <Box>
          <Text as="div" size="2" weight="bold">
            {data.avatarsName}
          </Text>
          <Text as="div" size="2" color="gray">
            {data.description}
          </Text>
        </Box>
      </Flex>
    </Card>
  </Box>
);

export const avatarBlockSchema: Template = {
  name: "avatar",
  label: "Avatar",
  ui: {
    previewSrc: "/blocks/hero.png",
    defaultItem: {
      tagline: "John Doe",
      headline: "The Best Developer"
    },
  },
  fields: [
    {
      type: "string",
      label: "Name of Person",
      name: "avatarsName",
      required: true,
    },
    {
      type: "string",
      label: "Description",
      name: "description",
      required: true,
    },
    {
      type: "object",
      label: "Avatar image",
      name: "avatarImage",
      required: true,
      fields: [
        {
          name: "src",
          label: "Image Source",
          type: "image",
          required: true,
        },
        {
          name: "alt",
          label: "Alt Text",
          type: "string",
          required: true,
        }
      ],
    }
  ],
};
