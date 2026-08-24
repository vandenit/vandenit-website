import '@radix-ui/themes/styles.css';
import '../styles.css';
import React from "react";
import { ThemeProvider } from "../components/theme-provider";
import { Metadata, Viewport } from "next";
import { getGlobalConfig } from "../lib/contentlayer";
import { Theme } from "@radix-ui/themes";
import { Barlow_Condensed } from "next/font/google";
import localFont from "next/font/local";

/*
 * Barlow Condensed — via next/font/google (display headings only).
 * Geist and Geist Mono — self-hosted via next/font/local using variable
 * woff2 files from the `geist` npm package copied to public/fonts/.
 * Both variable fonts cover all required weights (300–700) in a single file.
 */
const barlowCondensed = Barlow_Condensed({
  variable: "--font-barlow-condensed",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  display: "swap",
});

const geistSans = localFont({
  src: "../public/fonts/Geist-Variable.woff2",
  variable: "--font-geist",
  display: "swap",
  weight: "100 900",
});

const geistMono = localFont({
  src: "../public/fonts/GeistMono-Variable.woff2",
  variable: "--font-geist-mono",
  display: "swap",
  weight: "100 900",
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
      className={`${barlowCondensed.variable} ${geistSans.variable} ${geistMono.variable}`}
    >
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
