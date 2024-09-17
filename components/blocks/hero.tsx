"use client";
import * as React from "react";
import { TinaMarkdown } from "tinacms/dist/rich-text";
import type { Template } from "tinacms";
import { PageBlocksHero } from "../../tina/__generated__/types";
import { tinaField } from "tinacms/dist/react";
import Image from "next/image";
import { Actions } from "./actions";
import { Avatar, Box, Button, Container, Flex, Grid, Heading, Section, Text } from "@radix-ui/themes";

export const Hero = ({ data }: { data: PageBlocksHero }) => {

  return (
    <Box p="8">
      <Flex>
        {data.image && data.image.isAvatar && (
          <Box>
            <Avatar
              src={data.image.src}
              fallback="A"
              size="6"
              mr="5"
            />
          </Box>
        )}
        <Box>
          {/* Hero Heading */}
          <Heading as="h1" size={{ initial: '6', sm: '9' }} mb="4" data-tina-field={tinaField(data, 'tagline')}>
            {data.tagline}
          </Heading>

          {/* Hero Subheading */}
          <Text as="p" size={{ initial: '3', sm: '4', md: '5' }} mb="6" data-tina-field={tinaField(data, 'headline')}  >
            {data.headline}
          </Text>

        </Box>
      </Flex>


      {/* Call to Action Button */}
      {data.actions && (
        <Box mt="10">
          <Actions
            actions={data.actions}
          />
        </Box>
      )}
    </Box>
  );
};

export const heroBlockSchema: Template = {
  name: "hero",
  label: "Hero",
  ui: {
    previewSrc: "/blocks/hero.png",
    defaultItem: {
      tagline: "Here's some text above the other text",
      headline: "This Big Text is Totally Awesome",
      text: "Phasellus scelerisque, libero eu finibus rutrum, risus risus accumsan libero, nec molestie urna dui a leo.",
    },
  },
  fields: [
    {
      type: "string",
      label: "Tagline",
      name: "tagline",
    },
    {
      type: "string",
      label: "Headline",
      name: "headline",
    },
    {
      label: "Text-1",
      name: "text",
      type: "rich-text",
    },
    {
      type: "rich-text",
      label: "Text-2",
      name: "text2",
    },
    {
      label: "Actions",
      name: "actions",
      type: "object",
      list: true,
      ui: {
        defaultItem: {
          label: "Action Label",
          type: "button",
          icon: true,
          link: "/",
        },
        itemProps: (item) => ({ label: item.label }),
      },
      fields: [
        {
          label: "Label",
          name: "label",
          type: "string",
        },
        {
          label: "Type",
          name: "type",
          type: "string",
          options: [
            { label: "Button", value: "button" },
            { label: "Link", value: "link" },
          ],
        },
        {
          label: "Icon",
          name: "icon",
          type: "boolean",
        },
        {
          label: "Link",
          name: "link",
          type: "string",
        },
      ],
    },
    {
      type: "object",
      label: "Image",
      name: "image",
      fields: [
        {
          name: "src",
          label: "Image Source",
          type: "image",
        },
        {
          name: "alt",
          label: "Alt Text",
          type: "string",
        },
        {
          name: "isAvatar",
          label: "Is Avatar",
          type: "boolean",
        },
      ],
    },
    {
      type: "string",
      label: "Color",
      name: "color",
      options: [
        { label: "Default", value: "default" },
        { label: "Tint", value: "tint" },
        { label: "Primary", value: "primary" },
      ],
    },
  ],
};
