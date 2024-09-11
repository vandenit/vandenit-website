"use client";
import {
  PageBlocksFeatures,
  PageBlocksFeaturesItems,
} from "../../tina/__generated__/types";
import { tinaField } from "tinacms/dist/react";
import { Icon } from "../icon";
import { iconSchema } from "../../tina/fields/icon";
import { Box, Container, Grid, Section } from "@radix-ui/themes";

export const Feature = ({
  featuresColor,
  data,
}: {
  featuresColor: string;
  data: PageBlocksFeaturesItems;
}) => {
  return (
    <Box style={{ textAlign: 'center' }}>
      {data.icon && (
        <Icon
          tinaField={tinaField(data, 'icon')}
          data={{ size: 'large', ...data.icon }}
        />
      )}

      {data.title && (
        <h3
          data-tina-field={tinaField(data, 'title')}
        >
          {data.title}
        </h3>
      )}

      {data.text && (
        <p
          data-tina-field={tinaField(data, 'text')}
          style={{ opacity: 0.8, lineHeight: '1.6' }}
        >
          {data.text}
        </p>
      )}
    </Box>
  );
};

export const Features = ({ data }: { data: PageBlocksFeatures }) => {
  return (
    <Section>
      <Container
      >
        <Grid columns="3" gap="3" rows="repeat(2, 64px)" width="auto">
          {data.items &&
            data.items.map(function (block, i) {
              return <Feature featuresColor={data.color} key={i} data={block} />;
            })}
        </Grid>
      </Container>
    </Section>
  );
};

const defaultFeature = {
  title: "Here's Another Feature",
  text: "This is where you might talk about the feature, if this wasn't just filler text.",
  icon: {
    color: "",
    style: "float",
    name: "",
  },
};

export const featureBlockSchema = {
  name: "features",
  label: "Features",
  ui: {
    previewSrc: "/blocks/features.png",
    defaultItem: {
      items: [defaultFeature, defaultFeature, defaultFeature],
    },
  },
  fields: [
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
