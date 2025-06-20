import React from "react";
import { getPostBySlug, getAllPosts, getPostWithAuthor } from "../../../lib/contentlayer";
import Layout from "../../../components/layout/layout";
import PostClientPage from "./client-page";
import { notFound } from "next/navigation";

export default async function PostPage({
  params,
}: {
  params: { filename: string[] };
}) {
  const slug = params.filename.join("/");
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const postWithAuthor = getPostWithAuthor(post);

  return (
    <Layout>
      <PostClientPage post={postWithAuthor} />
    </Layout>
  );
}

export async function generateStaticParams() {
  const posts = getAllPosts();
  const paths = posts.map((post) => ({
    filename: post.slug.split("/"),
  }));
  return paths;
}
