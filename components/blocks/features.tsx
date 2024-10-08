"use client";
import {
  PageBlocksFeatures,
  PageBlocksFeaturesItems,
} from "../../tina/__generated__/types";
import { tinaField } from "tinacms/dist/react";
import { Icon } from "../icon";
import { iconSchema } from "../../tina/fields/icon";
import { Box, Card, Container, Flex, Grid, Heading, Link, Section, Text } from "@radix-ui/themes";
import { TinaMarkdown } from "tinacms/dist/rich-text";
// import next link with different name since Link already exists
import NextLink from "next/link";

export const Feature = ({
  data,
}: {
  data: PageBlocksFeaturesItems;
}) => {
  return (
    <Card>
      <Flex gap="3" align="start" justify="start">
        <Icon
          tinaField={tinaField(data, 'icon')}
          data={{ size: 'large', ...data.icon }}
        />
        <Box>
          <Text as="div" size="2" weight="bold" data-tina-field={tinaField(data, 'title')}>
            {data.title}
          </Text>
          <Box pt="2">
            {data.link && (
              <Link href={data.link} asChild>
                <NextLink href={data.link}>
                  {data.text}
                </NextLink>
              </Link>
            )}
            {!data.link && (
              <Text as="div" size="2" color="gray" data-tina-field={tinaField(data, 'text')}>
                {data.text}
              </Text>
            )}
          </Box>
          {data.richText && (
            <Container data-tina-field={tinaField(data, 'richText')}>
              <TinaMarkdown content={data.richText} />

            </Container>
          )}
        </Box>
      </Flex>
    </Card >
  );
};

export const Features = ({ data }: { data: PageBlocksFeatures }) => {
  return (
    <Section mb="5" pb="10">
      {data.title && (
        <Heading as="h2" size="6" mb="4" data-tina-field={tinaField(data, 'title')}
          id={data.featuresId}>
          {data.title}
        </Heading>
      )}
      <Grid columns={{ initial: '1', sm: '3' }} gap="3">
        {data.items &&
          data.items.map((block, i) => (
            <Feature key={i} data={block} />
          ))}
      </Grid>
    </Section>
  );
};

const defaultFeature = {
  title: "Here's Another Feature",
  text: "This is where you might talk about the feature, if this wasn't just filler text.",
  icon: {
    color: "",
    name: "",
  },
};

export const featureBlockSchema = {
  name: "features",
  label: "Features",
  ui: {
    previewSrc: "/blocks/features.png",
    defaultItem: {
      title: "Our Features",
      items: [defaultFeature, defaultFeature, defaultFeature],
    },
  },
  fields: [
    {
      type: "string",
      label: "Title",
      name: "title"
    },
    {
      type: "string",
      label: "Features ID",
      name: "featuresId"
    },
    {
      type: "object",
      label: "Feature Items",
      name: "items",
      list: true,
      ui: {
        itemProps: (item) => {
          return {
            label: item?.title,
          };
        },
        defaultItem: {
          ...defaultFeature,
        },
      },
      fields: [
        iconSchema,
        {
          type: "string",
          label: "Title",
          name: "title",
        },
        {
          type: "string",
          label: "Text",
          name: "text",
          ui: {
            component: "textarea",
          },
        },
        {
          type: "rich-text",
          label: "Richt Text",
          name: "richText",
        },
        {
          type: "string",
          label: "link",
          name: "link",
        }
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
