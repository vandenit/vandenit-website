import { allPosts, allPages, allAuthors, global, allThemes } from '.contentlayer/generated'
import type { Post, Page, Author, Global, Theme } from '.contentlayer/generated'

// Get all posts
export function getAllPosts(): Post[] {
  return allPosts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

// Get post by slug
export function getPostBySlug(slug: string): Post | undefined {
  return allPosts.find((post) => post.slug === slug)
}

// Get posts by tag
export function getPostsByTag(tag: string): Post[] {
  return allPosts.filter((post) => post.tags?.includes(tag))
}

// Get all pages
export function getAllPages(): Page[] {
  return allPages
}

// Get page by slug
export function getPageBySlug(slug: string): Page | undefined {
  return allPages.find((page) => page.slug === slug)
}

// Get all authors
export function getAllAuthors(): Author[] {
  return allAuthors
}

// Get author by reference path
export function getAuthorByPath(path: string): Author | undefined {
  // Convert path like "content/authors/pedro.md" to slug "pedro"
  const slug = path.replace('content/authors/', '').replace('.md', '')
  return allAuthors.find((author) => author._raw.flattenedPath === slug)
}

// Get global configuration
export function getGlobalConfig(): Global | undefined {
  return global // Should be singleton
}

// Get all themes/tags
export function getAllThemes(): Theme[] {
  return allThemes
}

// Get all tags from themes
export function getAllTags(): string[] {
  const themes = getAllThemes()
  return themes.flatMap(theme => theme.data || [])
}

// Helper function to resolve author for posts
export function getPostWithAuthor(post: Post): Post & { authorData?: Author } {
  if (!post.author) return post
  
  const authorData = getAuthorByPath(post.author)
  return {
    ...post,
    authorData
  }
}

// Get all posts with resolved authors
export function getAllPostsWithAuthors(): (Post & { authorData?: Author })[] {
  return getAllPosts().map(getPostWithAuthor)
}
