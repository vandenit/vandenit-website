import Layout from "../../components/layout/layout";
import { getAllPostsWithAuthors, getPostsByTag, getAllTags } from "../../lib/contentlayer";
import PostsClientPage from "./client-page";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Building & Shipping with AI",
  description: "Practical notes from real development work: AI-assisted workflows, technical failures, review patterns, and the human judgment behind production delivery.",
  alternates: {
    canonical: '/posts',
  },
  openGraph: {
    title: "Building & Shipping with AI — Vanden IT",
    description: "Practical notes from real development work: AI-assisted workflows, technical failures, review patterns, and the human judgment behind production delivery.",
    url: '/posts',
  },
};

export default async function PostsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const { tag } = await searchParams;
  const posts = tag ? getPostsByTag(tag) : getAllPostsWithAuthors();
  const allTags = getAllTags();
  const totalPostsCount = getAllPostsWithAuthors().length;

  return (
    <Layout>
      <PostsClientPage posts={posts} tags={allTags} currentTag={tag} totalPostsCount={totalPostsCount} />
    </Layout>
  );
}