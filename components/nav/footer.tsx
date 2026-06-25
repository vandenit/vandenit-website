"use client";
import React from "react";
import { Box, Container, Flex, Text } from "@radix-ui/themes";
import { Icon } from "../icon";
import { useLayout } from "../layout/layout-context";
import { FaLinkedin } from "react-icons/fa";
import Link from "next/link";

export default function Footer() {
  const { theme, globalSettings, pageData } = useLayout();
  const footer = globalSettings?.footer;

  return (
    <footer>
      <Container>
        <Flex
          justify="between"
          align="center"
          gap="6"
          wrap="wrap"
          style={{ padding: '1.5rem 0' }}
        >
          {/* Logo link */}
          <Link href="/" aria-label="Home">
            <Icon
              data={{
                name: globalSettings?.header.icon.name
              }}
            />
          </Link>

          {/* Vanden IT text */}
          <Text size="4" color="gray" weight="bold">
            Vanden IT
          </Text>

          {/* VAT number */}
          <Text size="2" color="gray">
            BE0768.999.370
          </Text>

          {/* LinkedIn link */}
          <Link
            href="https://www.linkedin.com/in/filip-van-den-broeck/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            style={{ marginLeft: '1rem' }}
          >
            <FaLinkedin size="1.5em" />
          </Link>
        </Flex>

        {/* Subfooter links */}
        <Flex justify="center" gap="6" mt="2" mb="2">
          <Link href="/contact">Contact</Link>
          <Link href="/about">About</Link>
          <Link href="/posts">Blog</Link>
        </Flex>
      </Container>
    </footer>
  );
}