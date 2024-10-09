import '@radix-ui/themes/styles.css';
import React from "react";
import { ThemeProvider } from "../components/theme-provider";
import { Metadata } from "next";
import client from "../tina/__generated__/client";
import { Theme } from "@radix-ui/themes";
import Head from 'next/head';

export const metadata: Metadata = {
  title: "Vanden IT",
  description: "Vanden IT",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const globalQuery = await client.queries.global({
    relativePath: "index.json",
  });
  const global = globalQuery.data.global;
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          disableTransitionOnChange
          forcedTheme={global.theme.darkMode}
        >
          <Theme
            accentColor={global.theme.accentCol || "blue" as any}
            grayColor={global.theme.greyColor || "gray" as any}
            panelBackground="solid"
            scaling="100%"
            radius="full">
            {children}
          </Theme>
        </ThemeProvider>
      </body>
    </html>
  );
}
