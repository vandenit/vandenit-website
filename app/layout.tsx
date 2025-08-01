import '@radix-ui/themes/styles.css';
import '../styles.css'
import React from "react";
import { ThemeProvider } from "../components/theme-provider";
import { Metadata } from "next";
import { getGlobalConfig } from "../lib/contentlayer";
import { Box, Theme } from "@radix-ui/themes";

export const metadata: Metadata = {
  title: "Vanden IT",
  description: "Vanden IT",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const global = getGlobalConfig();

  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          disableTransitionOnChange
          forcedTheme={global?.theme?.darkMode || "system"}
        >
          <Theme
            accentColor={global?.theme?.accentCol || "blue" as any}
            grayColor={global?.theme?.greyColor || "gray" as any}
            panelBackground="translucent"
            scaling="100%"
            radius="full">
            <Box
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                height: 480,
                opacity: 0.6,
                background:
                  "linear-gradient(to bottom, var(--accent-4), transparent)",
              }}
            ></Box>
            {children}
        </Theme>
      </ThemeProvider>
    </body>
    </html >
  );
}
