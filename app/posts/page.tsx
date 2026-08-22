import Layout from "../../components/layout/layout";
import { getAllPostsWithAuthors, getPostsByTag, getAllTags } from "../../lib/contentlayer";
import PostsClientPage from "./client-page";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog",
  description: "Practical workflows for development teams using AI as a first-class collaborator. Real examples, real failures, real results.",
  alternates: {
    canonical: '/posts',
  },
  openGraph: {
    title: "Blog — Vanden IT",
    description: "Practical workflows for development teams using AI as a first-class collaborator. Real examples, real failures, real results.",
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