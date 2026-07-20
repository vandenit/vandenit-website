import React from "react";
import { getPageBySlug } from "../lib/contentlayer";
import { Blocks } from "../components/blocks";
import Layout from "../components/layout/layout";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Vanden IT — Software Consultancy",
  description: "Vanden IT specializes in developing high-performance software solutions that drive business success. Security audits, custom development, and tech lead services.",
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