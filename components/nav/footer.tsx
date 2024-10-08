"use client";
import React from "react";
import { Icon } from "../icon";
import { useLayout } from "../layout/layout-context";
import { Box, Container, Flex, Link } from "@radix-ui/themes";
import { Text } from "@radix-ui/themes/dist/cjs/components/callout";
import { FaLinkedin } from "react-icons/fa";

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
          style={{ padding: '1.5rem 0' }} // Meer padding voor ruimte
        >
          {/* Logo link */}
          <Link href="/" aria-label="Home">
            <Icon
              data={{
                name: globalSettings?.header.icon.name,
                color: globalSettings?.header.icon.color || 'gray',
              }}
            />
          </Link>

          {/* Vanden IT text */}
          <Text size="4" color="gray" weight="bold"> {/* Grotere, opvallendere tekst */}
            Vanden IT
          </Text>

          {/* VAT number */}
          <Text size="2" color="gray">
            BE0768.999.370
          </Text>

          {/* LinkedIn link met extra margin voor ruimte */}
          <Link
            href="https://www.linkedin.com/in/filip-van-den-broeck/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            style={{ marginLeft: '1rem' }} // Extra margin voor spacing
          >
            <FaLinkedin size="1.5em" style={{ color: 'gray' }} />
          </Link>
        </Flex>

        {/* Subfooter links */}
        <Flex justify="center" gap="6" mt="2" mb="2">
          <Link href="/contact"  >
            Contact
          </Link>
          <Link href="/about"  >
            About
          </Link>
        </Flex>
      </Container>
    </footer>



  );
}
