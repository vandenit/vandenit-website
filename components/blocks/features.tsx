"use client";
import { Icon } from "../icon";
import { Box, Card, Container, Flex, Grid, Heading, Link, Section, Text } from "@radix-ui/themes";
// import next link with different name since Link already exists
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
    <Card>
      <Flex gap="3" align="start" justify="start">
        <Icon
          data={{ size: 'large', ...data.icon }}
        />
        <Box>
          <Text as="div" size="2" weight="bold">
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
              <Text as="div" size="2" color="gray">
                {data.text}
              </Text>
            )}
          </Box>
          {data.richText && (
            <Container>
              <div dangerouslySetInnerHTML={{ __html: data.richText }} />
            </Container>
          )}
          {data.buttonLink && (
            <Box pt="3">
              <Link asChild>
                <NextLink href={data.buttonLink.link}>
                  {data.buttonLink.label}
                </NextLink>
              </Link>
            </Box>
          )}
        </Box>
      </Flex>
    </Card >
  );
};

export const Features = ({ data }: { data: FeaturesBlockData }) => {
  return (
    <Section mb="5" pb="10">
      {data.title && (
        <Heading as="h2" size="6" mb="4"
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


