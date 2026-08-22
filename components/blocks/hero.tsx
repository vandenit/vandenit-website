"use client";
import * as React from "react";
import { Actions } from "./actions";
import { Badge, Container, Flex, Heading, Section, Text } from "@radix-ui/themes";

interface HeroBlockData {
  tagline?: string;
  headline?: string;
  text?: string;
  text2?: string;
  actions?: Array<{
    label: string;
    type: string;
    icon: boolean;
    link: string;
  }>;
  image?: {
    src: string;
    alt: string;
  };
  color?: string;
  _template: string;
}

export const Hero = ({ data }: { data: HeroBlockData }) => {
  return (
    <Section size="3" className="hero-section" pt={{ initial: '7', sm: '9' }} pb={{ initial: '6', sm: '8' }}>
      <Container size="3" px="6">
        <Flex direction="column" align="center" gap="5" style={{ textAlign: 'center' }}>
          {/* Badge — short label, NOT duplicating H1 */}
          <Badge size="2" variant="soft" color="blue" radius="full">
            AI-Powered Development
          </Badge>

          {/* H1 = short tagline */}
          <Heading as="h1" size={{ initial: '7', sm: '9' }} weight="bold" align="center" style={{ maxWidth: '800px', hyphens: 'none' }}>
            {data.tagline}
          </Heading>

          {/* Subtext = longer headline/description */}
          <Text as="p" size={{ initial: '4', sm: '5' }} color="gray" align="center" style={{ maxWidth: '600px', lineHeight: '1.6' }}>
            {data.headline}
          </Text>

          {/* CTA buttons */}
          {data.actions && (
            <Flex mt="3" align="center" justify="center" gap="3" direction={{ initial: 'column', sm: 'row' }} wrap="wrap">
              <Actions actions={data.actions} />
            </Flex>
          )}
        </Flex>
      </Container>
    </Section>
  );
};