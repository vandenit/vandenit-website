"use client";
import { usePathname } from "next/navigation";
import React from "react";
import { tinaField } from "tinacms/dist/react";
import Link from "next/link";
import { AccessibleIcon, Box, DropdownMenu, Flex, Heading, IconButton, TabNav } from "@radix-ui/themes";
import { HamburgerMenuIcon } from '@radix-ui/react-icons'
import { VandenITLogo } from "../vanden-it-logo";

export default function NavItems({ navs }: { navs: any }) {
  const currentPath = usePathname();
  return (
    <>
      <Box width="100%" display={{ initial: 'none', sm: 'block' }}>
        <Box>
          <TabNav.Root>
            <TabNav.Link asChild >
              <Link href="/" >
                <AccessibleIcon label="Radix Homepage">
                  <VandenITLogo width={25} height={25} />
                </AccessibleIcon>
              </Link>
            </TabNav.Link>
            {navs.map((item) => {
              return (
                <TabNav.Link active={currentPath === `/${item.href}`} asChild key={item.href}>
                  <Link href={item.href} data-tina-field={tinaField(item)} >
                    {item.label}
                  </Link>
                </TabNav.Link>
              );
            })}
          </TabNav.Root>
        </Box>
      </Box>
      <Box width="100%" display={{ initial: 'block', sm: 'none' }}>
        <DropdownMenu.Root>
          <DropdownMenu.Trigger>
            <IconButton size="3" variant="soft">
              <HamburgerMenuIcon width="16" height="16" />
            </IconButton>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content>
            <DropdownMenu.Item asChild
            >
              <Link href="/">
                <VandenITLogo width={30} height={30} />
              </Link>
            </DropdownMenu.Item>
            {navs.map((item) => (
              <DropdownMenu.Item asChild
                key={item.href}
              >
                <Link href={item.href}>
                  {item.label}
                </Link>
              </DropdownMenu.Item>
            ))}
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      </Box>
    </>
  );
}
