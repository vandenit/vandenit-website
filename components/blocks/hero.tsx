"use client";
import * as React from "react";
import { Actions } from "./actions";
import { Box, Flex, Heading, Text } from "@radix-ui/themes";

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
    <Box p={{ initial: '0', sm: '4' }} pb="5" pt="5">
      <Box>
        {/* Hero Heading */}
        <Heading as="h1" size={{ initial: '6', sm: '9' }} mb="4">
          {data.tagline}
        </Heading>
        <Box>
          <Text as="p" size={{ sm: '4', md: '5' }} mb="6">
            {data.headline}
          </Text>
        </Box>
      </Box>

      {/* Call to Action Button */}
      {data.actions && (
        <Flex mt="6" align="center" justify="center">
          <Actions
            actions={data.actions}
          />
        </Flex>
      )}
    </Box>
  );
};


