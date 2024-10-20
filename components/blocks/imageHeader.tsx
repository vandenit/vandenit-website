"use client";
import * as React from "react";
import type { Template } from "tinacms";
import { tinaField } from "tinacms/dist/react";
import { Actions } from "./actions";
import { Box, Flex, Heading, Text } from "@radix-ui/themes";
import styles from './image-header.module.css';
import { PageBlocksImageHeader } from "../../tina/__generated__/types";

export const ImageHeader = ({ data }: { data: PageBlocksImageHeader }) => (
  <Box className={styles.imageHeader} style={{ backgroundImage: `url(${data.image?.src})` }}>
    <Flex position="relative" className={styles.imageBox} minHeight="400px" align="center" justify="center" direction="column"
    >
      {/* Hero Heading */}
      <Heading as="h1" size={{ initial: '6', sm: '9' }} mb="4" data-tina-field={tinaField(data, 'tagline')} 
      className={styles.textShadow}>
        {data.tagline}
      </Heading>
      <Box>
        <Text as="p" size={{ sm: '4', md: '5' }} mb="6" data-tina-field={tinaField(data, 'headline')} className={styles.textShadow}>
          {data.headline}
        </Text>
      </Box>
    </Flex>

    {/* Call to Action Button */}
    {data.actions && (
      <Flex mt="6" align="center" justify="center" >
        <Box className={styles.imageBox}>
          <Actions actions={data.actions} />
        </Box>
      </Flex>
    )}
    <Box
      position="absolute"
      top="0"
      left="0"
      width="100%"
      height="100%"
      className={styles.overlay}
    />
  </Box>
);


export const imageHeaderBlockSchema: Template = {
  name: "imageHeader",
  label: "Image Header",
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
        }
      ],
    }
  ],
};
