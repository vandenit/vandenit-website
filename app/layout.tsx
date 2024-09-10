import '@radix-ui/themes/styles.css';
import React from "react";
import { ThemeProvider } from "../components/theme-provider";
import { Metadata } from "next";
import client from "../tina/__generated__/client";
import { Theme } from "@radix-ui/themes";

export const metadata: Metadata = {
  title: "Tina",
  description: "Tina Cloud Starter",
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
            accentColor="mint"
            grayColor="gray"
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
