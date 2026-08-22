import React from "react";
import { getPageBySlug } from "../lib/contentlayer";
import { Blocks } from "../components/blocks";
import Layout from "../components/layout/layout";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Vanden IT — Senior Engineering with AI-Powered Workflows",
  description: "Senior engineer and fractional tech lead. AI agents handle the repetitive work, 15 years of enterprise experience covers the rest: architecture, security, and the decisions that keep code maintainable.",
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "Vanden IT — Senior Engineering with AI-Powered Workflows",
    description: "Senior engineer and fractional tech lead. AI agents handle the repetitive work, 15 years of enterprise experience covers the rest.",
    url: '/',
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