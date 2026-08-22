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
    'about': 'Senior engineer and fractional tech lead based in Antwerp. 15 years building enterprise systems. The last two spent figuring out what AI actually changes about how software gets built.',
    'how-i-work': 'AI does the heavy lifting. Experience does the judgment. How I use multi-agent AI workflows to ship production-grade software with human ownership of architecture and quality.',
    'contact': 'Get in touch with Filip Van den Broeck at Vanden IT. Email filip@vandenit.be, or connect on LinkedIn. I read everything myself and respond within 24 hours.',
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