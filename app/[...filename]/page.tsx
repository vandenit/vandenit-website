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

  return {
    title: `${page.title} — Vanden IT`,
    description: `Vanden IT — ${page.title}. Software consultancy specializing in secure, scalable solutions.`,
  };
}

export async function generateStaticParams() {
  const pages = getAllPages();
  const paths = pages.map((page) => ({
    filename: page.slug.split('/'),
  }));

  return paths;
}