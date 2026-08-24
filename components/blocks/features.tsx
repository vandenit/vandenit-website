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
        {/* Icon */}
        <Flex
          align="center"
          justify="center"
          style={{
            width: '36px',
            height: '36px',
            borderRadius: 'var(--vdit-radius-xs)',
            background: 'var(--vdit-color-surface-raised)',
            border: 'var(--vdit-border)',
            flexShrink: 0,
          }}
        >
          <Icon data={{ size: '3', ...data.icon }} />
        </Flex>

        <Heading
          as="h3"
          size="4"
          weight="bold"
          style={{ fontFamily: 'var(--vdit-font-display)', color: 'var(--vdit-color-text)' }}
        >
          {data.title}
        </Heading>

        <Text as="p" size="3" className="card-content-wrap" style={{ lineHeight: '1.6', color: 'var(--vdit-color-text-muted)' }}>
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
                color: 'var(--vdit-color-system-strong)',
                textDecoration: 'none',
                fontSize: '13px',
                fontWeight: 500,
                fontFamily: 'var(--vdit-font-mono)',
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              {data.buttonLink.label}
              <BsArrowRight aria-hidden="true" />
            </NextLink>
          </Box>
        )}
      </Flex>
    </Card>
  );
};

export const Features = ({ data }: { data: FeaturesBlockData }) => {
  return (
    <Section mb="5" pb="10" size="3" className="vdit-section-alt">
      <Container size="3" px="6">
        {data.title && (
          <Heading
            as="h2"
            size={{ initial: '6', sm: '7' }}
            mb="6"
            align="center"
            id={data.featuresId}
            style={{ fontFamily: 'var(--vdit-font-display)', color: 'var(--vdit-color-text)' }}
          >
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
