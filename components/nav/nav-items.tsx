"use client";
import { usePathname } from "next/navigation";
import React from "react";
import Link from "next/link";
import { Flex, DropdownMenu, IconButton } from "@radix-ui/themes";
import { HamburgerMenuIcon } from '@radix-ui/react-icons';
import { VandenITLogo } from "../vanden-it-logo";

export default function NavItems({ navs }: { navs: any[] }) {
  const currentPath = usePathname();
  const isContactPage = currentPath === '/contact';

  // Fallback nav items if CMS data is empty
  const items = navs.length > 0 ? navs : [
    { href: '/', label: 'Home' },
    { href: '/how-i-work', label: 'How I work' },
    { href: '/about', label: 'About' },
    { href: '/posts', label: 'Blog' },
  ];

  return (
    <Flex align="center" justify="between" height="64px">
      {/* Logo — always visible */}
      <Link
        href="/"
        aria-label="Vanden IT Home"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          textDecoration: 'none',
          color: 'var(--vdit-color-text)',
          fontFamily: 'var(--vdit-font-display)',
          fontWeight: 600,
          fontSize: '1.15rem',
          letterSpacing: '-0.02em',
        }}
      >
        <VandenITLogo width={26} height={26} />
        Vanden IT
      </Link>

      {/* Desktop nav — hidden on mobile */}
      <Flex align="center" gap="5" display={{ initial: 'none', sm: 'flex' }}>
        {items.map((item) => {
          const href = item.href.startsWith('/') ? item.href : `/${item.href}`;
          const isActive = currentPath === href || (href !== '/' && currentPath?.startsWith(`${href}/`));
          return (
            <Link
              key={item.href}
              href={href}
              className="vdit-nav-link"
              aria-current={isActive ? 'page' : undefined}
            >
              {item.label}
            </Link>
          );
        })}
        {!isContactPage && (
          <Link href="/contact" className="vdit-nav-cta" style={{ marginLeft: '8px' }}>
            Discuss a project
          </Link>
        )}
      </Flex>

      {/* Mobile nav — hidden on desktop */}
      <Flex align="center" display={{ initial: 'flex', sm: 'none' }}>
        <DropdownMenu.Root>
          <DropdownMenu.Trigger>
            <IconButton
              size="3"
              variant="ghost"
              color="gray"
              aria-label="Open menu"
              style={{ color: 'var(--vdit-color-text-muted)' }}
            >
              <HamburgerMenuIcon width="20" height="20" />
            </IconButton>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content
            style={{
              background: 'var(--vdit-color-surface-raised)',
              border: 'var(--vdit-border)',
              borderRadius: 'var(--vdit-radius-sm)',
            }}
          >
            {items.map((item) => {
              const href = item.href.startsWith('/') ? item.href : `/${item.href}`;
              const isActive = currentPath === href || (href !== '/' && currentPath?.startsWith(`${href}/`));
              return (
                <DropdownMenu.Item asChild key={item.href}>
                  <Link
                    href={href}
                    aria-current={isActive ? 'page' : undefined}
                    style={{
                      color: isActive ? 'var(--vdit-color-text)' : 'var(--vdit-color-text-muted)',
                      textDecoration: 'none',
                    }}
                  >
                    {item.label}
                  </Link>
                </DropdownMenu.Item>
              );
            })}
            {!isContactPage && (
              <>
                <DropdownMenu.Separator />
                <DropdownMenu.Item asChild>
                  <Link
                    href="/contact"
                    style={{
                      color: 'var(--vdit-color-human-strong)',
                      fontWeight: 600,
                      textDecoration: 'none',
                    }}
                  >
                    Discuss a project
                  </Link>
                </DropdownMenu.Item>
              </>
            )}
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      </Flex>
    </Flex>
  );
}
