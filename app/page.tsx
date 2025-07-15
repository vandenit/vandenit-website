import React from "react";
import { getPageBySlug } from "../lib/contentlayer";
import { Blocks } from "../components/blocks";
import Layout from "../components/layout/layout";
import { notFound } from "next/navigation";

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
