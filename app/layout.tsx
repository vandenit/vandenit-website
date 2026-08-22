import '@radix-ui/themes/styles.css';
import '../styles.css'
import React from "react";
import { ThemeProvider } from "../components/theme-provider";
import { Metadata, Viewport } from "next";
import { getGlobalConfig } from "../lib/contentlayer";
import { Theme } from "@radix-ui/themes";

const SITE_URL = 'https://vandenit.be'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Vanden IT — Senior Developer & Fractional Tech Lead",
    template: "%s — Vanden IT",
  },
  description: "Senior full-stack development and fractional technical leadership, strengthened by a structured AI workflow. Based in Antwerp and available for embedded product team engagements.",
  openGraph: {
    type: 'website',
    url: SITE_URL,
    siteName: 'Vanden IT',
    title: "Vanden IT — Senior Developer & Fractional Tech Lead",
    description: "Senior full-stack development and fractional technical leadership, strengthened by a structured AI workflow. Available for embedded product team engagements.",
    images: [
      {
        url: '/uploads/main/unnamed.jpg',
        width: 1200,
        height: 630,
        alt: 'Vanden IT',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Vanden IT — Senior Developer & Fractional Tech Lead",
    description: "Senior full-stack development and fractional technical leadership, strengthened by a structured AI workflow.",
    images: ['/uploads/main/unnamed.jpg'],
  },
  alternates: {
    canonical: '/',
  },
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