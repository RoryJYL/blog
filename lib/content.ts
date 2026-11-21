import { posts, thoughts } from '../.velite'

export const POST_PAGE_SIZE = 5
export const THOUGHT_PAGE_SIZE = 10

export type Post = (typeof posts)[number]
export type Thought = (typeof thoughts)[number]

const byDateDesc = (a: { date: string }, b: { date: string }) =>
  new Date(b.date).getTime() - new Date(a.date).getTime()

// 过滤掉草稿并按日期排序
export const publishedPosts: Post[] = posts
  .filter((p) => !p.draft)
  .sort(byDateDesc)
export const publishedThoughts: Thought[] = thoughts
  .filter((t) => !t.draft)
  .sort(byDateDesc)

/** 返回分页的文章 */
export function getPosts(page = 1, pageSize = POST_PAGE_SIZE) {
  const start = Math.max(0, (page - 1) * pageSize)

  return {
    page,
    pageSize,
    totalPosts: publishedPosts.length,
    totalPages: Math.ceil(publishedPosts.length / pageSize),
    posts: publishedPosts.slice(start, start + pageSize),
  }
}

/** 返回分页的絮语 */
export function getThoughts(page = 1, pageSize = THOUGHT_PAGE_SIZE) {
  const start = Math.max(0, (page - 1) * pageSize)

  return {
    page,
    pageSize,
    totalThoughts: publishedThoughts.length,
    totalPages: Math.ceil(publishedThoughts.length / pageSize),
    thoughts: publishedThoughts.slice(start, start + pageSize),
  }
}

export function getTotalPostCount() {
  return publishedPosts.length
}

export function getTotalThoughtCount() {
  return publishedThoughts.length
}

export function getPost(slug: string) {
  return publishedPosts.find((post) => post.slug === slug)
}

export function getThought(slug: string) {
  return publishedThoughts.find((thought) => thought.slug === slug)
}

export function getAllPostSlugs() {
  return publishedPosts.map((post) => post.slug)
}

export function getAllThoughtSlugs() {
  return publishedThoughts.map((thought) => thought.slug)
}

/**
 * 获取相邻内容：previous 为列表中靠前（更新）的一篇，next 为靠后（更早）的一篇
 */
function getAdjacent<T extends { slug: string }>(items: T[], slug: string) {
  const index = items.findIndex((item) => item.slug === slug)
  if (index === -1) {
    return { previous: undefined, next: undefined }
  }

  return {
    previous: index > 0 ? items[index - 1] : undefined,
    next: index < items.length - 1 ? items[index + 1] : undefined,
  }
}

/** 获取相邻文章 */
export function getAdjacentPosts(slug: string) {
  return getAdjacent(publishedPosts, slug)
}

/** 获取相邻絮语 */
export function getAdjacentThoughts(slug: string) {
  return getAdjacent(publishedThoughts, slug)
}
