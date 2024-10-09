"use client";
import React from "react";
import { Icon } from "../icon";
import { useLayout } from "../layout/layout-context";
import { Box, Container, Flex, Link as RadixLink } from "@radix-ui/themes";
import { Text } from "@radix-ui/themes/dist/cjs/components/callout";
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
          style={{ padding: '1.5rem 0' }} // Meer padding voor ruimte
        >
          {/* Logo link */}
          <RadixLink asChild>
            <Link href="/" aria-label="Home">
              <Icon
                data={{
                  name: globalSettings?.header.icon.name
                }}
              />
            </Link>
          </RadixLink>

          {/* Vanden IT text */}
          <Text size="4" color="gray" weight="bold"> {/* Grotere, opvallendere tekst */}
            Vanden IT
          </Text>

          {/* VAT number */}
          <Text size="2" color="gray">
            BE0768.999.370
          </Text>

          {/* LinkedIn link met extra margin voor ruimte */}
          <RadixLink asChild>
            <Link
              href="https://www.linkedin.com/in/filip-van-den-broeck/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              style={{ marginLeft: '1rem' }} // Extra margin voor spacing
            >
              <FaLinkedin size="1.5em" />
            </Link>
          </RadixLink>
        </Flex>

        {/* Subfooter links */}
        <Flex justify="center" gap="6" mt="2" mb="2">
          <RadixLink asChild>
            <Link href="/contact"  >
              Contact
            </Link>
          </RadixLink>
          <RadixLink asChild>
            <Link href="/about"  >
              About
            </Link>
          </RadixLink>

        </Flex>
      </Container>
    </footer>



  );
}
