"use client";
import React from "react";
import Link from "next/link";
import { Icon } from "../icon";
import { useLayout } from "../layout/layout-context";
import { Box, Container, Flex } from "@radix-ui/themes";

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
        >
          <Link
            href="/"
            className="group mx-2 flex items-center font-bold tracking-tight text-gray-400 dark:text-gray-300 opacity-50 hover:opacity-100 transition duration-150 ease-out whitespace-nowrap"
          >
            <Icon
              data={{
                name: globalSettings?.header.icon.name,
                color:
                  footer.color,
              }}
            />
          </Link>
        </Flex>
        <div />
      </Container>
    </footer>
  );
}
