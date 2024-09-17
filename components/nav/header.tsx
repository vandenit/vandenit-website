"use client";

import React from "react";
import NavItems from "./nav-items";
import { useLayout } from "../layout/layout-context";
import { Container } from "@radix-ui/themes";

export default function Header() {
  const { globalSettings, theme } = useLayout();
  const header = globalSettings.header;

  return (
    <Container>
      <NavItems navs={header.nav} />
    </Container>
  );
}
