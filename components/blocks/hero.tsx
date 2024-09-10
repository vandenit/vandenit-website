"use client";
import * as React from "react";
import { TinaMarkdown } from "tinacms/dist/rich-text";
import type { Template } from "tinacms";
import { PageBlocksHero } from "../../tina/__generated__/types";
import { tinaField } from "tinacms/dist/react";
import Image from "next/image";
import { Actions } from "./actions";
import { Box, Container, Grid, Section, Text } from "@radix-ui/themes";

export const Hero = ({ data }: { data: PageBlocksHero }) => {


  return (
    <Section>
      <Grid
        columns={{ initial: '1', md: '5' }}  // Grid with 1 column on mobile, 5 on md+
        gap="6"  // Adjust the gap as needed
        style={{
          gridTemplateRows: 'repeat(2, auto)',  // Mimicking the Tailwind `row-start` behavior
        }}
      >
        {/* Content Box */}
        <Box
          gridRow={{ initial: '2', md: '1' }}  // Row start logic for responsive design
          gridColumn={{ initial: '1', md: 'span 5' }}  // Column span logic
        >
          {/* Tagline */}
          {data.tagline && (
            <h2 data-tina-field={tinaField(data, 'tagline')}>
              {data.tagline}
            </h2>
          )}

          {/* Headline */}
          {data.headline && (
            <h3 data-tina-field={tinaField(data, 'headline')}>
              {data.headline}
            </h3>
          )}

          {/* Flex Container for Text and Image */}
          <Grid columns={{ initial: '1', md: '2' }} gap="6">
            {/* Text Column */}
            <Box>
              {data.text && (
                <Box
                  data-tina-field={tinaField(data, 'text')}
                >
                  <TinaMarkdown content={data.text} />
                </Box>
              )}
            </Box>

            {/* Image Column */}
            {data.image && (
              <Box
                data-tina-field={tinaField(data.image, 'src')}
                className="relative flex-shrink-0"
              >
                <Image
                  className="w-full h-auto max-w-full rounded-lg"
                  style={{ objectFit: 'cover' }}
                  alt={data.image.alt}
                  src={data.image.src}
                  width={500}
                  height={500}
                />
              </Box>
            )}
          </Grid>

          {/* Additional Text */}
          {data.text2 && (
            <Box
              data-tina-field={tinaField(data, 'text2')}
            >
              <TinaMarkdown content={data.text2} />
            </Box>
          )}

          {/* Actions */}
          {data.actions && (
            <Box mt="10">
              <Actions
                className="justify-center md:justify-start py-2"
                parentColor={data.color}
                actions={data.actions}
              />
            </Box>
          )}
        </Box>
      </Grid>

    </Section>
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
