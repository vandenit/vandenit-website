import React from "react";
import { Box, Container, Flex, Text, Separator } from "@radix-ui/themes";
import { FaLinkedin } from "react-icons/fa";
import { VandenITLogo } from "../vanden-it-logo";
import Link from "next/link";

export default function Footer() {
  return (
    <Box
      asChild
      className="vdit-footer"
    >
      <footer className="site-footer">
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
                <VandenITLogo width={22} height={22} color="var(--vdit-color-text-subtle)" />
              </Link>
              <Text
                size="3"
                weight="bold"
                style={{
                  color: 'var(--vdit-color-text-muted)',
                  fontFamily: 'var(--vdit-font-display)',
                  letterSpacing: '-0.02em',
                }}
              >
                Vanden IT
              </Text>
              <Text
                size="1"
                style={{ color: 'var(--vdit-color-text-subtle)', fontFamily: 'var(--vdit-font-mono)' }}
              >
                BE0768.999.370
              </Text>
            </Flex>

            {/* Subfooter links */}
            <Flex gap="5" align="center">
              {[
                { href: '/contact', label: 'Contact' },
                { href: '/about', label: 'About' },
                { href: '/posts', label: 'Blog' },
              ].map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  style={{
                    color: 'var(--vdit-color-text-subtle)',
                    textDecoration: 'none',
                    fontSize: '13px',
                    fontFamily: 'var(--vdit-font-mono)',
                    letterSpacing: '0.03em',
                    transition: 'color var(--vdit-duration-fast) var(--vdit-ease)',
                  }}
                >
                  {label}
                </Link>
              ))}
              <Link
                href="https://www.linkedin.com/in/filip-van-den-broeck/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                style={{ color: 'var(--vdit-color-text-subtle)', display: 'flex', alignItems: 'center' }}
              >
                <FaLinkedin size="1.2em" />
              </Link>
            </Flex>
          </Flex>
          <Separator size="4" mt="0" style={{ background: 'var(--vdit-color-line)' }} />
          <Flex justify="center" pt="2" pb="2">
            <Text
              size="1"
              style={{
                color: 'var(--vdit-color-text-subtle)',
                fontFamily: 'var(--vdit-font-mono)',
                letterSpacing: '0.04em',
              }}
            >
              © Vanden IT — Senior Engineering · AI-Augmented Delivery
            </Text>
          </Flex>
        </Container>
      </footer>
    </Box>
  );
}
