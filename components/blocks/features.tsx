"use client";
import { Icon } from "../icon";
import { Container, Grid, Heading, Section } from "@radix-ui/themes";
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

/** Zero-padded chapter number, e.g. 1 → "01" */
function chapterNumber(index: number): string {
  return String(index + 1).padStart(2, '0');
}

export const Feature = ({
  data,
  index,
}: {
  data: FeatureItem;
  index: number;
}) => {
  return (
    <div className="vdit-chapter-card">
      {/* Chapter marker + icon row */}
      <div className="vdit-chapter-header">
        <span className="vdit-chapter-marker" aria-hidden="true">
          {chapterNumber(index)}
        </span>
        <div className="vdit-chapter-icon" aria-hidden="true">
          <Icon data={{ size: '3', ...data.icon }} />
        </div>
      </div>

      <Heading
        as="h3"
        size="4"
        weight="bold"
        className="vdit-chapter-title"
      >
        {data.title}
      </Heading>

      <p className="vdit-proof-desc card-content-wrap vdit-chapter-desc">
        {data.text}
      </p>

      {data.richText && (
        <Container>
          <MarkdownRenderer content={data.richText} />
        </Container>
      )}

      {data.buttonLink && (
        <NextLink
          href={data.buttonLink.link}
          className="vdit-chapter-link"
        >
          {data.buttonLink.label}
          <BsArrowRight aria-hidden="true" />
        </NextLink>
      )}
    </div>
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
          >
            {data.title}
          </Heading>
        )}
        <Grid columns={{ initial: '1', sm: '3' }} gap="4">
          {data.items &&
            data.items.map((block, i) => (
              <Feature key={i} data={block} index={i} />
            ))}
        </Grid>
      </Container>
    </Section>
  );
};
