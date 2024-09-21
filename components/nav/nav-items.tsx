"use client";
import { usePathname } from "next/navigation";
import React from "react";
import { tinaField } from "tinacms/dist/react";
import Link from "next/link";
import { AccessibleIcon, Box, Card, DropdownMenu, Flex, Heading, IconButton, TabNav } from "@radix-ui/themes";
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
                  <VandenITLogo width={25} height={25} color="gold"/>
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
        <Link href="/">
          <VandenITLogo width={48} height={48} color="gold" />
        </Link>
        <Card><Heading>Vanden IT</Heading></Card>
        <DropdownMenu.Root>
          <DropdownMenu.Trigger>
            <IconButton size="4" variant="soft" ml="4" color="gold">
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
