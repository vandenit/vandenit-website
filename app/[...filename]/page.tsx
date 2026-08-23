import React from "react";
import { getPageBySlug, getAllPages } from "../../lib/contentlayer";
import { Blocks } from "../../components/blocks";
import Layout from "../../components/layout/layout";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

export default async function Page({
  params,
}: {
  params: Promise<{ filename: string[] }>;
}) {
  const { filename } = await params;
  const slug = filename.join('/');
  const page = getPageBySlug(slug);

  if (!page) {
    notFound();
  }

  return (
    <Layout>
      <Blocks {...page} />
    </Layout>
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ filename: string[] }>;
}): Promise<Metadata> {
  const { filename } = await params;
  const slug = filename.join('/');
  const page = getPageBySlug(slug);

  if (!page) return {};

  const url = `/${slug}`;
  const title = page.title;
  const description = pageDescription(slug, title);

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: `${title} — Vanden IT`,
      description,
      url,
    },
  };
}

function pageDescription(slug: string, title: string): string {
  const descriptions: Record<string, string> = {
    'about': 'Senior full-stack engineer and fractional tech lead with 15 years of enterprise experience, combining hands-on delivery with structured AI-assisted development.',
    'how-i-work': 'How Filip joins teams as a senior developer or fractional tech lead, contributes to real delivery, and helps improve AI-assisted development workflows from inside the engagement.',
    'contact': 'Contact Filip Van den Broeck about senior full-stack development, fractional technical leadership, or AI-augmented delivery within your product team.',
  };
  return descriptions[slug] || `Vanden IT — ${title}. Senior engineering with AI-powered workflows.`;
}

export async function generateStaticParams() {
  const pages = getAllPages();
  const paths = pages.map((page) => ({
    filename: page.slug.split('/'),
  }));

  return paths;
}