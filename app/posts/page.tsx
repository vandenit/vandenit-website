import Layout from "../../components/layout/layout";
import { getAllPostsWithAuthors, getPostsByTag, getAllTags } from "../../lib/contentlayer";
import PostsClientPage from "./client-page";

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
