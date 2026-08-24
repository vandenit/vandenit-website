import '@radix-ui/themes/styles.css';
import '../styles.css';
import React from "react";
import { ThemeProvider } from "../components/theme-provider";
import { Metadata, Viewport } from "next";
import { getGlobalConfig } from "../lib/contentlayer";
import { Theme } from "@radix-ui/themes";
import { Barlow_Condensed } from "next/font/google";

/*
 * Barlow Condensed is self-hosted via next/font (display headings only).
 * Geist and Geist Mono are loaded from Google Fonts CDN — the `geist` npm
 * package and next/font/google Geist export were added in Next.js 15+;
 * this project runs 14.2.21, so we keep CDN delivery for those two.
 */
const barlowCondensed = Barlow_Condensed({
  variable: "--font-barlow-condensed",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  display: "swap",
});

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
    <html
      lang="en"
      suppressHydrationWarning
      className={barlowCondensed.variable}
    >
      <head>
        {/* Geist & Geist Mono — CDN (Next.js 14 doesn't include Geist in next/font/google) */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500;600;700&family=Geist+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
        {/*
         * Expose Geist as CSS variables so vandenit-theme.css can reference them.
         * next/font injects --font-barlow-condensed automatically;
         * we manually declare --font-geist and --font-geist-mono here so the
         * token layer resolves correctly.
         */}
        <style>{`
          :root {
            --font-geist: 'Geist';
            --font-geist-mono: 'Geist Mono';
          }
        `}</style>
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
            radius="small"
          >
            {children}
          </Theme>
        </ThemeProvider>
      </body>
    </html>
  );
}
