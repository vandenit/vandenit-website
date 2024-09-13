"use client";

import React from "react";
import Link from "next/link";
import { tinaField } from "tinacms/dist/react";
import { Icon } from "../icon";
import NavItems from "./nav-items";
import { useLayout } from "../layout/layout-context";
import { Box, Container } from "@radix-ui/themes";

export default function Header() {
  const { globalSettings, theme } = useLayout();
  const header = globalSettings.header;

  return (
    <Container>
          <h4>
            <Link
              href="/"
              >
              <span data-tina-field={tinaField(header, "name")}>
                {header.name}
              </span>
            </Link>
          </h4>
          <NavItems navs={header.nav} />
      </Container>
  );
}
