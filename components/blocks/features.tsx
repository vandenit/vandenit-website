"use client";
import { Icon } from "../icon";
import { Box, Card, Container, Flex, Grid, Heading, Section, Text } from "@radix-ui/themes";
import { MarkdownRenderer } from "../markdown-renderer";
import { BsArrowRight } from "react-icons/bs";
import NextLink from "next/link";

interface FeatureItem {
  title: string;
  text: string;
  richText?: string;
  link?: string;
  icon: {
    name: string;
    color: string;
  };
  buttonLink?: {
    label: string;
    link: string;
  };
}

interface FeaturesBlockData {
  title?: string;
  featuresId?: string;
  items?: FeatureItem[];
  color?: string;
  _template: string;
}

export const Feature = ({
  data,
}: {
  data: FeatureItem;
}) => {
  return (
    <Card className="card-elevated" size="3" style={{ height: '100%' }}>
      <Flex direction="column" gap="3" style={{ height: '100%' }}>
        {/* Icon in a rounded background */}
        <Box
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '8px',
            background: 'var(--gray-3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <Icon data={{ size: '3', ...data.icon }} />
        </Box>

        <Heading as="h3" size="4" weight="bold">
          {data.title}
        </Heading>

        <Text as="p" size="3" color="gray" className="card-content-wrap" style={{ lineHeight: '1.6' }}>
          {data.text}
        </Text>

        {data.richText && (
          <Container>
            <MarkdownRenderer content={data.richText} />
          </Container>
        )}

        {data.buttonLink && (
          <Box mt="auto" pt="2">
            <NextLink
              href={data.buttonLink.link}
              style={{
                color: 'var(--accent-11)',
                textDecoration: 'none',
                fontSize: '14px',
                fontWeight: 500,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'gap 0.15s ease',
              }}
            >
              {data.buttonLink.label}
              <BsArrowRight />
            </NextLink>
          </Box>
        )}
      </Flex>
    </Card>
  );
};

export const Features = ({ data }: { data: FeaturesBlockData }) => {
  return (
    <Section mb="5" pb="10" size="3" className="section-alt">
      <Container size="3" px="6">
        {data.title && (
          <Heading as="h2" size={{ initial: '6', sm: '7' }} mb="6" align="center" id={data.featuresId}>
            {data.title}
          </Heading>
        )}
        <Grid columns={{ initial: '1', sm: '3' }} gap="4">
          {data.items &&
            data.items.map((block, i) => (
              <Feature key={i} data={block} />
            ))}
        </Grid>
      </Container>
    </Section>
  );
};