"use client";
import { usePathname } from "next/navigation";
import React from "react";
import { tinaField } from "tinacms/dist/react";
import Link from "next/link";
import { Box, DropdownMenu, IconButton, TabNav } from "@radix-ui/themes";
import { HamburgerMenuIcon } from '@radix-ui/react-icons'

export default function NavItems({ navs }: { navs: any }) {
  const currentPath = usePathname();
  return (
    <>
      <Box width="100%" display={{ initial: 'none', sm: 'block' }}>
        <TabNav.Root>
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
      <Box width="100%" display={{ initial: 'block', sm: 'none' }}>
        <DropdownMenu.Root>
          <DropdownMenu.Trigger>
            <IconButton size="3" variant="soft">
              <HamburgerMenuIcon width="16" height="16" />
            </IconButton>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content>
            {navs.map((item) => (
              <DropdownMenu.Item asChild
                key={item.value}
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
