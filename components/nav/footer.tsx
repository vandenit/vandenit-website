import React from "react";
import { Box, Container, Flex, Text, Separator } from "@radix-ui/themes";
import { FaLinkedin } from "react-icons/fa";
import { VandenITLogo } from "../vanden-it-logo";
import Link from "next/link";

export default function Footer() {
  return (
    <Box
      asChild
      style={{
        borderTop: '1px solid var(--gray-5)',
        background: 'var(--gray-2)',
      }}
    >
      <footer>
        <Container size="3" px="6">
          <Flex
            direction={{ initial: 'column', sm: 'row' }}
            justify="between"
            align="center"
            gap="4"
            py="6"
          >
            {/* Logo + name */}
            <Flex align="center" gap="3">
              <Link href="/" aria-label="Home" style={{ display: 'flex', alignItems: 'center' }}>
                <VandenITLogo width={24} height={24} />
              </Link>
              <Text size="3" weight="bold" color="gray">
                Vanden IT
              </Text>
              <Text size="2" color="gray" style={{ opacity: 0.7 }}>
                BE0768.999.370
              </Text>
            </Flex>

            {/* Subfooter links */}
            <Flex gap="5" align="center">
              <Link href="/contact" style={{ color: 'var(--gray-11)', textDecoration: 'none', fontSize: '14px' }}>
                Contact
              </Link>
              <Link href="/about" style={{ color: 'var(--gray-11)', textDecoration: 'none', fontSize: '14px' }}>
                About
              </Link>
              <Link href="/posts" style={{ color: 'var(--gray-11)', textDecoration: 'none', fontSize: '14px' }}>
                Blog
              </Link>
              <Link
                href="https://www.linkedin.com/in/filip-van-den-broeck/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                style={{ color: 'var(--gray-11)', display: 'flex', alignItems: 'center' }}
              >
                <FaLinkedin size="1.3em" />
              </Link>
            </Flex>
          </Flex>
          <Separator size="4" mt="0" />
          <Flex justify="center" pt="2" pb="2">
            <Text size="2" color="gray" style={{ opacity: 0.6 }}>
              © Vanden IT — AI-Powered Development
            </Text>
          </Flex>
        </Container>
      </footer>
    </Box>
  );
}