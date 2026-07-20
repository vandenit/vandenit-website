"use client";

import React from "react";
import NavItems from "./nav-items";
import { useLayout } from "../layout/layout-context";
import { Box, Container } from "@radix-ui/themes";

export default function Header() {
  const { globalSettings } = useLayout();
  const header = globalSettings?.header;

  return (
    <Box
      position="sticky"
      top="0"
      className="header-blur"
      style={{ zIndex: 100 }}
    >
      <Container size="3" px="6">
        <NavItems navs={header?.nav ?? []} />
      </Container>
    </Box>
  );
}