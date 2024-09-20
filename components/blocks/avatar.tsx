"use client";
import * as React from "react";
import type { Template } from "tinacms";
import { PageBlocksAvatar } from "../../tina/__generated__/types";
import { tinaField } from "tinacms/dist/react";
import { Avatar, Box, Card, Flex, Heading, Text } from "@radix-ui/themes";

export const AvatarBlock = ({ data }: { data: PageBlocksAvatar }) => (
  <Box p={{ initial: '0', sm: '4' }} pb="5" pt="5">
    {data.avatarHeader && (
      <Heading as="h1" size={{ initial: '6', sm: '9' }} mb="4" data-tina-field={tinaField(data, 'avatarHeader')}>
        {data.avatarHeader}
      </Heading>
    )}
    <Card>
      <Flex gap="3" align="center">
        <Avatar
          data-tina-field={tinaField(data.avatarImage, "src")}
          src={data.avatarImage.src}
          fallback="A"
          size={{ initial: '6', sm: '8' }}
          mr="5"
        />
        <Box>
          <Heading size="4" weight="bold" data-tina-field={tinaField(data, 'avatarsName')}>
            {data.avatarsName}
          </Heading>
          <Text as="div" size="2" color="gray" data-tina-field={tinaField(data, 'description')}>
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
      label: "Header for above Avatar",
      name: "avatarHeader",
    },
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
