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
  <Section size="3" pt={{ initial: '7', sm: '9' }} pb="5">
    <Container size="3" px="6">
      {data.avatarHeader && (
        <Heading as="h1" size={{ initial: '7', sm: '9' }} weight="bold" mb="6" align="center">
          {data.avatarHeader}
        </Heading>
      )}
      <Card className="card-elevated" size="4">
        <Flex gap="5" align="center" direction={{ initial: 'column', sm: 'row' }}>
          <Avatar
            src={data.avatarImage.src}
            alt={data.avatarImage.alt || data.avatarsName}
            fallback={data.avatarsName?.[0] || 'A'}
            size={{ initial: '6', sm: '8' }}
            radius="full"
          />
          <Box>
            <Heading as="h2" size="5" weight="bold" mb="2">
              {data.avatarsName}
            </Heading>
            <Text as="p" size="4" color="gray" style={{ lineHeight: '1.6' }}>
              {data.description}
            </Text>
          </Box>
        </Flex>
      </Card>
    </Container>
  </Section>
);