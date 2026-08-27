import React from "react";
import { getPageBySlug } from "../lib/contentlayer";
import { Blocks } from "../components/blocks";
import Layout from "../components/layout/layout";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Vanden IT — Senior Developer & Fractional Tech Lead",
  description: "Senior full-stack development and fractional technical leadership, strengthened by a structured AI workflow. Based in Antwerp and available for embedded product team engagements.",
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "Vanden IT — Senior Developer & Fractional Tech Lead",
    description: "Senior full-stack development and fractional technical leadership, strengthened by a structured AI workflow. Available for embedded product team engagements.",
    url: '/',
    images: [
      {
        url: 'https://vandenit.be/social/vandenit-home-social.png',
        width: 1200,
        height: 630,
        alt: 'Vanden IT — Senior Developer & Fractional Tech Lead',
      },
    ],
  },
};

export default async function HomePage() {
  const page = getPageBySlug('home');

  if (!page) {
    notFound();
  }

  return (
    <Layout>
      <Blocks {...page} />
    </Layout>
  );
}