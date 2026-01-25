import { allPosts, allThoughts } from 'contentlayer/generated'
import { type SupportedLanguages, readingTime } from 'reading-time-estimator'
import { remark } from 'remark'
import { visit } from 'unist-util-visit'

export const POST_PAGE_SIZE = 5
export const THOUGHT_PAGE_SIZE = 10

// 过滤掉草稿文章并按日期排序
const sortedPublishedPosts = allPosts
  .filter((post) => !post.draft)
  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

const sortedPublishedThoughts = allThoughts
  .filter((post) => !post.draft)
  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

/**
 * 获取所有文章的数量
 */
export function getTotalPostCount(): number {
  return sortedPublishedPosts.length
}

/**
 * 获取所有分类和数量
 */
export function getAllCategories() {
  const categoriesSet = new Set<string>()

  for (const post of sortedPublishedPosts) {
    categoriesSet.add(post.category)
  }

  return {
    categories: Array.from(categoriesSet),
    count: categoriesSet.size,
  }
}

/**
 * 获取所有标签的数量
 */
export function getAllTags() {
  const tagsSet = new Set<string>()

  for (const post of sortedPublishedPosts) {
    for (const tag of post.tags) {
      tagsSet.add(tag)
    }
  }

  return {
    tags: Array.from(tagsSet),
    count: tagsSet.size,
  }
}

/**
 * 返回分页的文章
 */
export function getPosts(page = 1, pageSize = POST_PAGE_SIZE) {
  const posts = sortedPublishedPosts

  // 计算总页数
  const totalPosts = posts.length
  const totalPages = Math.ceil(totalPosts / pageSize)

  // 获取当前页的数据
  const start = (page - 1) * pageSize
  const end = start + pageSize
  const pagePosts = posts.slice(start, end)

  return {
    page,
    pageSize,
    totalPosts,
    totalPages,
    posts: pagePosts,
  }
}

/**
 * 获取所有文章的简要信息
 */
export function getAllPostsInfo<
  K extends keyof (typeof sortedPublishedPosts)[0] = '_id' | 'title' | 'url',
>(
  keys: K[] = ['_id', 'title', 'url'] as K[],
): Pick<(typeof sortedPublishedPosts)[0], K>[] {
  return sortedPublishedPosts.map((post) => {
    const result = {} as Pick<(typeof sortedPublishedPosts)[0], K>
    for (const key of keys) {
      result[key] = post[key]
    }
    return result
  })
}

/**
 * 获取单篇文章
 */
export function getPost(slug: string) {
  const post = sortedPublishedPosts.find((post) => post.slug === slug)

  return post
}

/**
 * 获取所有文章的 slug
 */
export function getAllPostSlugs() {
  return sortedPublishedPosts.map((post) => post.slug)
}

/**
 * 根据标签获取分页的文章
 */
export function getPostsByTag(
  tag: string,
  page = 1,
  pageSize = POST_PAGE_SIZE,
) {
  const posts = sortedPublishedPosts.filter((post) => post.tags.includes(tag))

  // 计算总页数
  const totalPosts = posts.length
  const totalPages = Math.ceil(totalPosts / pageSize)

  // 获取当前页的数据
  const start = (page - 1) * pageSize
  const end = start + pageSize
  const pagePosts = posts.slice(start, end)

  return {
    page,
    pageSize,
    totalPosts,
    totalPages,
    posts: pagePosts,
  }
}

export function getThought(slug: string) {
  const thought = sortedPublishedThoughts.find(
    (thought) => thought.slug === slug,
  )

  return thought
}

export function getAllThoughtsInfo<
  K extends keyof (typeof sortedPublishedThoughts)[0] = '_id' | 'title' | 'url',
>(
  keys: K[] = ['_id', 'title', 'url'] as K[],
): Pick<(typeof sortedPublishedThoughts)[0], K>[] {
  return sortedPublishedThoughts.map((thought) => {
    const result = {} as Pick<(typeof sortedPublishedThoughts)[0], K>
    for (const key of keys) {
      result[key] = thought[key]
    }
    return result
  })
}

function slugify(text: string) {
  return text.toString().toLowerCase().trim().replace(/\s+/g, '-')
}

/**
 * 计算文章的阅读时间
 * @param content - 文章内容
 * @param wordsPerMinute - 每分钟阅读字数，默认400
 * @param language - 语言，默认中文
 * @returns 包含阅读时间文本的对象
 */
export function calculateReadingTime(
  content: string,
  wordsPerMinute = 400,
  language: SupportedLanguages = 'cn',
): { text: string } {
  const stats = readingTime(content, wordsPerMinute, language)
  const minutes = Math.ceil(stats.minutes) // 取整分钟数

  // 根据分钟数显示中文格式的阅读时间
  if (minutes <= 1) {
    return { text: '大约需要 1 分钟阅读' }
  }

  return { text: `大约需要 ${minutes} 分钟阅读` }
}

/**
 * 获取所有 Thoughts
 */
export function getAllThoughts() {
  return sortedPublishedThoughts
}

/**
 * 获取所有 Thoughts 的分页数据
 */
export function getThoughts(page = 1, pageSize = THOUGHT_PAGE_SIZE) {
  const thoughts = sortedPublishedThoughts

  // 计算总页数
  const totalThoughts = thoughts.length
  const totalPages = Math.ceil(totalThoughts / pageSize)

  // 获取当前页的数据
  const start = (page - 1) * pageSize
  const end = start + pageSize
  const pageThoughts = thoughts.slice(start, end)

  return {
    page,
    pageSize,
    totalThoughts,
    totalPages,
    thoughts: pageThoughts,
  }
}

export function getTotalThoughtCount() {
  return sortedPublishedThoughts.length
}

// export function buildNestedTOC(headings) {
//   const nestedTOC = []
//   const stack = []

//   headings.forEach((heading) => {
//     const { depth, text, id } = heading
//     const item = { text, id, depth, children: [] }

//     if (stack.length === 0) {
//       // 根节点
//       nestedTOC.push(item)
//       stack.push(item)
//     } else {
//       // 找到适合当前 heading 的父级
//       while (stack.length && stack[stack.length - 1].depth >= depth) {
//         stack.pop()
//       }

//       if (stack.length > 0) {
//         // 添加为父节点的子项
//         stack[stack.length - 1].children.push(item)
//       } else {
//         // 添加为根节点
//         nestedTOC.push(item)
//       }

//       stack.push(item)
//     }
//   })

//   return nestedTOC
// }

// export async function extractHeadings(content) {
//   const tree = await remark().parse(content)
//   const headings = []

//   visit(tree, 'heading', (node) => {
//     const depth = node.depth
//     const text = node.children
//       .filter((child) => child.type === 'text')
//       .map((child) => child.value)
//       .join('')

//     headings.push({ depth, text })
//   })

//   return buildNestedTOC(headings)
// }
