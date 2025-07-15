"use client";
import * as React from "react";
import { Avatar, Box, Card, Flex, Heading, Text } from "@radix-ui/themes";

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
  <Box p={{ initial: '0', sm: '4' }} pb="5" pt="5">
    {data.avatarHeader && (
      <Heading as="h1" size={{ initial: '6', sm: '9' }} mb="4">
        {data.avatarHeader}
      </Heading>
    )}
    <Card>
      <Flex gap="3" align="center">
        <Avatar
          src={data.avatarImage.src}
          fallback="A"
          size={{ initial: '6', sm: '8' }}
          mr="5"
        />
        <Box>
          <Heading size="4" weight="bold">
            {data.avatarsName}
          </Heading>
          <Text as="div" size="2" color="gray">
            {data.description}
          </Text>
        </Box>
      </Flex>
    </Card>
  </Box>
);


