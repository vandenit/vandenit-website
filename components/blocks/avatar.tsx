"use client";
import * as React from "react";
import { Avatar, Box, Card, Container, Flex, Heading, Section, Text } from "@radix-ui/themes";

interface AvatarBlockData {
  avatarHeader?: string;
  avatarsName: string;
  description: string;
  avatarImage: {
    src: string;
    alt: string;
  };
  _template: string;
}

export const AvatarBlock = ({ data }: { data: AvatarBlockData }) => (
  <Section size="2" pt={{ initial: '6', sm: '9' }} pb="4" className="vdit-content-section">
    <Container size="3" px="6">
      {data.avatarHeader && (
        <Heading as="h1" size={{ initial: '6', sm: '9' }} weight="bold" mb="5" align="center" style={{ fontFamily: 'var(--vdit-font-display)', color: 'var(--vdit-color-text)' }}>
          {data.avatarHeader}
        </Heading>
      )}
      <Card className="card-elevated" size="3">
        <Flex gap="4" align="center" direction={{ initial: 'column', sm: 'row' }}>
          <Avatar
            src={data.avatarImage.src}
            alt={data.avatarImage.alt || data.avatarsName}
            fallback={data.avatarsName?.[0] || 'A'}
            size={{ initial: '5', sm: '8' }}
            radius="full"
          />
          <Box>
            <Heading as="h2" size="5" weight="bold" mb="2" style={{ fontFamily: 'var(--vdit-font-display)', color: 'var(--vdit-color-text)' }}>
              {data.avatarsName}
            </Heading>
            <Text as="p" size="3" style={{ lineHeight: '1.6', color: 'var(--vdit-color-text-muted)' }}>
              {data.description}
            </Text>
          </Box>
        </Flex>
      </Card>
    </Container>
  </Section>
);