import '@radix-ui/themes/styles.css';
import '../styles.css'
import React from "react";
import { ThemeProvider } from "../components/theme-provider";
import { Metadata, Viewport } from "next";
import { getGlobalConfig } from "../lib/contentlayer";
import { Theme } from "@radix-ui/themes";

export const metadata: Metadata = {
  title: "Vanden IT — Software Consultancy",
  description: "Vanden IT specializes in developing high-performance software solutions that drive business success. Security audits, custom development, and tech lead services.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const global = getGlobalConfig();

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          rel="preconnect"
          href="https://fonts.googleapis.com"
        />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500;600;700&family=Geist+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          disableTransitionOnChange
          forcedTheme={global?.theme?.darkMode || "dark"}
        >
          <Theme
            accentColor={(global?.theme?.accentCol as any) || "blue"}
            grayColor={(global?.theme?.grayColor as any) || "gray"}
            panelBackground="translucent"
            scaling="100%"
            radius="medium"
          >
            {children}
          </Theme>
        </ThemeProvider>
      </body>
    </html>
  );
}