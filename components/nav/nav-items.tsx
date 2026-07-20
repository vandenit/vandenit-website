"use client";
import { usePathname } from "next/navigation";
import React from "react";
import Link from "next/link";
import { Flex, DropdownMenu, IconButton, Text, Button } from "@radix-ui/themes";
import { HamburgerMenuIcon } from '@radix-ui/react-icons';
import { VandenITLogo } from "../vanden-it-logo";

const navLinkStyle = (isActive: boolean): React.CSSProperties => ({
  color: isActive ? 'var(--gray-12)' : 'var(--gray-11)',
  textDecoration: 'none',
  fontWeight: 500,
  fontSize: '14px',
  padding: '6px 12px',
  borderRadius: '6px',
  transition: 'color 0.15s ease, background 0.15s ease',
  position: 'relative',
  ...(isActive ? {
    background: 'var(--gray-3)',
  } : {}),
});

export default function NavItems({ navs }: { navs: any[] }) {
  const currentPath = usePathname();

  // Fallback nav items if CMS data is empty
  const items = navs.length > 0 ? navs : [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About' },
    { href: '/posts', label: 'Blog' },
    { href: '/contact', label: 'Contact' },
  ];

  return (
    <Flex align="center" justify="between" height="64px">
      {/* Logo — always visible */}
      <Link href="/" aria-label="Vanden IT Home" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none', color: 'var(--gray-12)' }}>
        <VandenITLogo width={28} height={28} />
        <Text size="4" weight="bold" style={{ letterSpacing: '-0.02em' }}>
          Vanden IT
        </Text>
      </Link>

      {/* Desktop nav — hidden on mobile */}
      <Flex align="center" gap="2" display={{ initial: 'none', sm: 'flex' }}>
        {items.map((item) => {
          const href = item.href.startsWith('/') ? item.href : `/${item.href}`;
          const isActive = currentPath === href || (href !== '/' && currentPath?.startsWith(href));
          return (
            <Link
              key={item.href}
              href={href}
              style={navLinkStyle(isActive)}
            >
              {item.label}
            </Link>
          );
        })}
        <Button asChild size="2" ml="3">
          <Link href="/contact" style={{ textDecoration: 'none' }}>
            Get in touch
          </Link>
        </Button>
      </Flex>

      {/* Mobile nav — hidden on desktop */}
      <Flex align="center" display={{ initial: 'flex', sm: 'none' }}>
        <DropdownMenu.Root>
          <DropdownMenu.Trigger>
            <IconButton size="3" variant="soft" color="gray" aria-label="Open menu">
              <HamburgerMenuIcon width="18" height="18" />
            </IconButton>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content>
            {items.map((item) => {
              const href = item.href.startsWith('/') ? item.href : `/${item.href}`;
              return (
                <DropdownMenu.Item asChild key={item.href}>
                  <Link href={href}>{item.label}</Link>
                </DropdownMenu.Item>
              );
            })}
            <DropdownMenu.Separator />
            <DropdownMenu.Item asChild>
              <Link href="/contact">Get in touch</Link>
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      </Flex>
    </Flex>
  );
}