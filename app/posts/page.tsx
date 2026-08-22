import Layout from "../../components/layout/layout";
import { getAllPostsWithAuthors, getPostsByTag, getAllTags } from "../../lib/contentlayer";
import PostsClientPage from "./client-page";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog — Vanden IT",
  description: "AI-powered development workflows, self-hosted AI infrastructure, and practical examples of using AI in software development.",
};

export default async function PostsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const { tag } = await searchParams;
  const posts = tag ? getPostsByTag(tag) : getAllPostsWithAuthors();
  const allTags = getAllTags();

  return (
    <Layout>
      <PostsClientPage posts={posts} tags={allTags} />
    </Layout>
  );
}