import React from "react";
import { getPageBySlug, getAllPages } from "../../lib/contentlayer";
import { Blocks } from "../../components/blocks";
import Layout from "../../components/layout/layout";
import { notFound } from "next/navigation";

export default async function Page({
  params,
}: {
  params: { filename: string[] };
}) {
  const slug = params.filename.join('/');
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

export async function generateStaticParams() {
  const pages = getAllPages();
  const paths = pages.map((page) => ({
    filename: page.slug.split('/'),
  }));

  return paths;
}
