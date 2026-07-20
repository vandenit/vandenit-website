import Layout from "../../components/layout/layout";
import { getAllPostsWithAuthors, getPostsByTag, getAllTags } from "../../lib/contentlayer";
import PostsClientPage from "./client-page";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog — Vanden IT",
  description: "Security & Development insights from Vanden IT. Stay updated with the latest in web security, development best practices, and field experience.",
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