"use client";
import * as React from "react";
import { Actions } from "./actions";
import { Box, Flex, Heading, Text } from "@radix-ui/themes";
import styles from './image-header.module.css';

interface ImageHeaderBlockData {
  tagline?: string;
  headline?: string;
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
  _template: string;
}

export const ImageHeader = ({ data }: { data: ImageHeaderBlockData }) => (
  <Box className={styles.imageHeader} style={{ backgroundImage: `url(${data.image?.src})` }}>
    <Flex position="relative" className={styles.imageBox} minHeight="400px" align="center" justify="center" direction="column"
    >
      {/* Hero Heading */}
      <Heading as="h1" size={{ initial: '6', sm: '9' }} mb="4"
      className={styles.textShadow}>
        {data.tagline}
      </Heading>
      <Box>
        <Text as="p" size={{ sm: '4', md: '5' }} mb="6" className={styles.textShadow}>
          {data.headline}
        </Text>
      </Box>
    </Flex>

    {/* Call to Action Button */}
    {data.actions && (
      <Flex mt="6" align="center" justify="center" >
        <Box className={styles.imageBox}>
          <Actions actions={data.actions} />
        </Box>
      </Flex>
    )}
    <Box
      position="absolute"
      top="0"
      left="0"
      width="100%"
      height="100%"
      className={styles.overlay}
    />
  </Box>
);



