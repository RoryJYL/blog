import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypeSlug from 'rehype-slug'
import { context, defineConfig, s } from 'velite'
import {
  buildExcerpt,
  calculateReadingTime,
  extractToc,
  firstImage,
} from './lib/content-helpers'

/**
 * velite 的 `s.path()` 返回相对 `root` 的完整路径（`posts/foo`），
 * 而站点的 URL 结构是 `/post/<slug>`，所以要把目录前缀剥掉。
 */
const stripDir = (dir: string) => (path: string) =>
  path.replace(new RegExp(`^${dir}/`), '')

/**
 * 构建时把日期渲染成 YYYY-MM-DD。
 *
 * 不在组件里调 dayjs：那样子产物里是构建机的时区、浏览器里是访客的时区，
 * 跨时区访客一 hydration 就会发现文本对不上。frontmatter 写的是作者的挂钟时间，
 * 固定按东八区取日历日，构建环境在哪个时区都不影响输出。
 */
const DATE_FORMAT = new Intl.DateTimeFormat('en-CA', {
  timeZone: 'Asia/Shanghai',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
})
const displayDate = (iso: string) => DATE_FORMAT.format(new Date(iso))

export default defineConfig({
  root: 'content',
  // 校验失败直接让构建失败，而不是静默跳过文件
  strict: true,
  collections: {
    posts: {
      name: 'Post',
      pattern: 'posts/*.mdx',
      schema: s
        .object({
          title: s.string(),
          date: s.isodate(),
          category: s.string(),
          tags: s.array(s.string()).default([]),
          headerImage: s.string().optional(),
          draft: s.boolean().default(false),
          slug: s.path().transform(stripDir('posts')),
          code: s.mdx(),
        })
        .transform((post) => {
          const { file } = context()
          const raw = file.content ?? ''

          return {
            ...post,
            url: `/post/${post.slug}`,
            displayDate: displayDate(post.date),
            excerpt: buildExcerpt(raw),
            headerImage: post.headerImage ?? firstImage(raw),
            readingTime: calculateReadingTime(raw),
            toc: extractToc(raw),
          }
        }),
    },
    thoughts: {
      name: 'Thought',
      pattern: 'thoughts/*.mdx',
      schema: s
        .object({
          title: s.string(),
          date: s.isodate(),
          draft: s.boolean().default(false),
          slug: s.path().transform(stripDir('thoughts')),
          code: s.mdx(),
        })
        .transform((post) => {
          const { file } = context()
          const raw = file.content ?? ''

          return {
            ...post,
            url: `/thought/${post.slug}`,
            displayDate: displayDate(post.date),
            excerpt: buildExcerpt(raw),
            readingTime: calculateReadingTime(raw),
          }
        }),
    },
  },
  mdx: {
    rehypePlugins: [
      rehypeSlug,
      [rehypeAutolinkHeadings, { behavior: 'append' }],
    ],
  },
})
