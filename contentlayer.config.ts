import {
  defineDocumentType,
  defineNestedType,
  makeSource,
} from 'contentlayer/source-files'
import GithubSlugger from 'github-slugger'
import type { Heading, PhrasingContent, Root } from 'mdast'
import { readingTime, type SupportedLanguages } from 'reading-time-estimator'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypeSlug from 'rehype-slug'
import remarkMdx from 'remark-mdx'
import remarkParse from 'remark-parse'
import { unified } from 'unified'
import { visit } from 'unist-util-visit'

// 目录项类型
const TocItem = defineNestedType(() => ({
  name: 'TocItem',
  fields: {
    depth: { type: 'number', required: true }, // 1..6
    value: { type: 'string', required: true }, // 标题文本
    slug: { type: 'string', required: true }, // 与 rehype-slug 一致
  },
}))

// 提取 TOC
function extractToc(raw: string) {
  const tree = unified().use(remarkParse).use(remarkMdx).parse(raw) as Root
  const slugger = new GithubSlugger()
  const items: Array<{ depth: number; value: string; slug: string }> = []

  visit(tree, 'heading', (node: Heading) => {
    const depth = node.depth
    if (depth < 2 || depth > 6) return // 只要 h2-h6（一般用 h2/h3 就够）

    // 拿纯文本
    const text = (node.children || [])
      .filter(
        (c: PhrasingContent) =>
          c.type === 'text' ||
          c.type === 'inlineCode' ||
          c.type === 'emphasis' ||
          c.type === 'strong' ||
          c.type === 'link',
      )
      .map((c: PhrasingContent) => {
        if (c.type === 'link') {
          return (c.children || [])
            .map((cc: PhrasingContent) => (cc.type === 'text' ? cc.value : ''))
            .join('')
        }
        if (c.type === 'text') {
          return c.value
        }
        return ''
      })
      .join('')
      .trim()

    if (!text) return
    const slug = slugger.slug(text)
    items.push({ depth, value: text, slug })
  })

  return items
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

const ReadingTime = defineNestedType(() => ({
  name: 'ReadingTime',
  fields: {
    text: { type: 'string' },
  },
}))

// 提取摘要：优先取 <!-- more --> 之前的内容，否则截取前 200 个字符
function buildExcerpt(content: string): string {
  const moreRegex = /<!-- more -->|{\/\* more \*\/}/
  const excerptContent =
    content.split(moreRegex)[0] || `${content.slice(0, 200)}...`

  // 将 Markdown 转换为纯文本，去除 Markdown 格式符号
  return excerptContent
    .replace(/!\[.*?\]\(.*?\)/g, '') // 移除图片
    .replace(/\[([^\]]+)\]\((.*?)\)/g, '$1') // 移除链接但保留链接文本
    .replace(/[`*_{}[\]()#+\-.!]/g, '') // 移除其他 Markdown 格式符号
    .replace(/\n/g, ' ') // 将换行符替换为空格
    .trim()
}

export const Post = defineDocumentType(() => ({
  name: 'Post',
  filePathPattern: 'posts/*.mdx',
  contentType: 'mdx',
  fields: {
    title: { type: 'string', required: true },
    date: { type: 'date', required: true },
    category: { type: 'string', required: true },
    tags: { type: 'list', of: { type: 'string' }, required: true },
    headerImage: { type: 'string', required: false },
    draft: { type: 'boolean', default: false },
  },
  computedFields: {
    url: {
      type: 'string',
      resolve: (post) =>
        `/post/${post._raw.flattenedPath.replace('posts/', '')}`,
    },
    excerpt: {
      type: 'string',
      resolve: (post) => buildExcerpt(post.body.raw),
    },
    headerImage: {
      type: 'string',
      resolve: (post) => {
        // 如果手动指定了 headerImage，就使用它
        if (post.headerImage) return post.headerImage

        // 使用正则表达式匹配 Markdown 中的第一张图片
        const imageRegex = /!\[.*?\]\((.*?)\)/
        const match = post.body.raw.match(imageRegex)
        return match ? match[1] : null // 返回匹配到的图片 URL，或 null
      },
    },
    slug: {
      type: 'string',
      resolve: (post) => post._raw.flattenedPath.replace('posts/', ''),
    },
    readingTime: {
      type: 'nested',
      of: ReadingTime,
      resolve: (post) => calculateReadingTime(post.body.raw),
    },
    toc: {
      type: 'list',
      of: TocItem,
      resolve: async (post) => extractToc(post.body.raw),
    },
  },
}))

export const Thought = defineDocumentType(() => ({
  name: 'Thought',
  filePathPattern: 'thoughts/*.mdx',
  contentType: 'mdx',
  fields: {
    title: { type: 'string', required: true },
    date: { type: 'date', required: true },
    draft: { type: 'boolean', default: false },
  },
  computedFields: {
    url: {
      type: 'string',
      resolve: (thought) =>
        `/thought/${thought._raw.flattenedPath.replace('thoughts/', '')}`,
    },
    readingTime: {
      type: 'nested',
      of: ReadingTime,
      resolve: (thought) => calculateReadingTime(thought.body.raw),
    },
    slug: {
      type: 'string',
      resolve: (thought) => thought._raw.flattenedPath.replace('thoughts/', ''),
    },
    excerpt: {
      type: 'string',
      resolve: (thought) => buildExcerpt(thought.body.raw),
    },
  },
}))

export default makeSource({
  contentDirPath: 'content',
  documentTypes: [Post, Thought],
  mdx: {
    // remarkPlugins: [remarkGfm],
    rehypePlugins: [
      rehypeSlug,
      [rehypeAutolinkHeadings, { behavior: 'append' }], // 可选
    ],
  },
})
