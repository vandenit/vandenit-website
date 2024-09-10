"use client";
import React from "react";
import Link from "next/link";
import { Icon } from "../icon";
import { useLayout } from "../layout/layout-context";
import { RawRenderer } from "../raw-renderer";
import { Container } from "@radix-ui/themes";

export default function Footer() {
  const { theme, globalSettings, pageData } = useLayout();
  const footer = globalSettings?.footer;

  return (
    <footer>
      <Container>
        <div className="flex justify-between items-center gap-6 flex-wrap">
          <Link
            href="/"
            className="group mx-2 flex items-center font-bold tracking-tight text-gray-400 dark:text-gray-300 opacity-50 hover:opacity-100 transition duration-150 ease-out whitespace-nowrap"
          >
            <Icon
              parentColor={footer.color}
              data={{
                name: globalSettings?.header.icon.name,
                color:
                  theme.color === "primary"
                    ? "primary"
                    : globalSettings?.header.icon.color,
                style: globalSettings?.header.icon.style,
              }}
              className="inline-block h-10 w-auto group-hover:text-orange-500"
            />
          </Link>
          <RawRenderer parentColor={footer.color} rawData={pageData} />
        </div>
        <div />
      </Container>
    </footer>
  );
}
