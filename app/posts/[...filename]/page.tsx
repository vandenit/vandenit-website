import React from "react";
import { getPostBySlug, getAllPosts, getPostWithAuthor } from "../../../lib/contentlayer";
import Layout from "../../../components/layout/layout";
import PostClientPage from "./client-page";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

// Extract H2 headings from raw markdown body and slugify them
// (matching the same slug logic used by MarkdownRenderer)
function extractTocItems(rawBody: string): { id: string; label: string }[] {
  const h2Regex = /^## (.+)$/gm;
  const items: { id: string; label: string }[] = [];
  let match;
  while ((match = h2Regex.exec(rawBody)) !== null) {
    const label = match[1].trim();
    const slug = label.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
    items.push({ id: slug, label });
  }
  return items;
}

// Calculate honest reading time from word count
// Average reading speed: 200 words per minute
function calculateReadingTime(rawBody: string): number {
  // Strip markdown syntax to get a rough word count
  const text = rawBody
    .replace(/```[\s\S]*?```/g, ' ') // code blocks
    .replace(/`[^`]+`/g, ' ') // inline code
    .replace(/[#*>\-_~|]/g, ' ') // markdown symbols
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1') // links → text
    .replace(/\s+/g, ' ')
    .trim();
  const words = text.split(' ').filter((w) => w.length > 0).length;
  return Math.max(1, Math.round(words / 200));
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ filename: string[] }>;
}) {
  const { filename } = await params;
  const slug = filename.join("/");
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const postWithAuthor = getPostWithAuthor(post);
  const tocItems = extractTocItems(post.body.raw);
  const readingTime = calculateReadingTime(post.body.raw);

  return (
    <Layout>
      <PostClientPage post={postWithAuthor} readingTime={readingTime} tocItems={tocItems} />
    </Layout>
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ filename: string[] }>;
}): Promise<Metadata> {
  const { filename } = await params;
  const slug = filename.join("/");
  const post = getPostBySlug(slug);

  if (!post) return {};

  const postUrl = `/posts/${post.slug}`;
  const socialImageUrl = `/social/${post.slug}-social.png`;

  return {
    title: post.title,
    description: post.excerpt || `Vanden IT Blog — ${post.title}`,
    alternates: {
      canonical: postUrl,
    },
    openGraph: {
      type: 'article',
      title: `${post.title} — Vanden IT Blog`,
      description: post.excerpt || `Vanden IT Blog — ${post.title}`,
      url: postUrl,
      images: [
        {
          url: socialImageUrl,
          width: 1200,
          height: 630,
          alt: `Case File: ${post.title}`,
        },
      ],
      publishedTime: post.date,
      authors: ['Filip Van den Broeck'],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt || `Vanden IT Blog — ${post.title}`,
      images: [socialImageUrl],
    },
  };
}

export async function generateStaticParams() {
  const posts = getAllPosts();
  const paths = posts.map((post) => ({
    filename: post.slug.split("/"),
  }));
  return paths;
}