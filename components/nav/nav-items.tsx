"use client";
import { usePathname } from "next/navigation";
import React from "react";
import { tinaField } from "tinacms/dist/react";
import Link from "next/link";
// import radix ui link with different name since Link already exists
import { AccessibleIcon, Box, Card, DropdownMenu, Flex, Heading, IconButton, TabNav, Link as RadixLink } from "@radix-ui/themes";
import { HamburgerMenuIcon } from '@radix-ui/react-icons'
import { VandenITLogo } from "../vanden-it-logo";
import { GlobalQuery } from "../../tina/__generated__/types";

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
      <Flex width="100%" display={{ initial: 'flex', sm: 'none' }} justify="between">
        <RadixLink asChild>
          <Link href="/">
            <VandenITLogo width={48} height={48} />
          </Link>

        </RadixLink>
        <Card><Heading>Vanden IT</Heading></Card>
        <DropdownMenu.Root>
          <DropdownMenu.Trigger>
            <IconButton size="4" variant="soft" ml="4">
              <HamburgerMenuIcon width="16" height="16" />
            </IconButton>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content>
            <DropdownMenu.Item asChild
            >
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
      </Flex>
    </>
  );
}
