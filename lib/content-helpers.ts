import GithubSlugger from 'github-slugger'
import type { Heading, PhrasingContent, Root } from 'mdast'
import { readingTime, type SupportedLanguages } from 'reading-time-estimator'
import remarkMdx from 'remark-mdx'
import remarkParse from 'remark-parse'
import { unified } from 'unified'
import { visit } from 'unist-util-visit'

export type TocItem = {
  depth: number
  value: string
  slug: string
}

/**
 * 从 MDX 原文提取目录。
 *
 * 刻意不用 velite 的 `s.toc()`：它产出 `{ title, url, items }` 嵌套树，丢掉了
 * 绝对标题层级（h2 与 h4 在同一层嵌套里无法区分），而 `components/toc`
 * 依赖 `depth` 做缩进、`hooks/use-active-section` 依赖 `depth` 过滤。
 * 这里的 slug 与 `rehype-slug` 同源（github-slugger），能和渲染出的 heading id 对上。
 */
export function extractToc(raw: string): TocItem[] {
  const tree = unified().use(remarkParse).use(remarkMdx).parse(raw) as Root
  const slugger = new GithubSlugger()
  const items: TocItem[] = []

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

/**
 * 提取摘要：优先取 more 标记之前的内容，否则截取前 200 个字符
 */
export function buildExcerpt(content: string): string {
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

/**
 * 正文第一张图作为封面
 */
export function firstImage(content: string): string | null {
  const match = content.match(/!\[.*?\]\((.*?)\)/)
  return match ? match[1] : null
}
