import { getAllPostsInfo, getAllThoughtsInfo } from '@/lib/contentplayer-utils'
import {
  SITE_AUTHOR,
  SITE_DESCRIPTION,
  SITE_TITLE,
  SITE_URL,
} from '@/lib/site-config'

export const dynamic = 'force-static'

const escapeXml = (value: string) =>
  value.replace(
    /[<>&'"]/g,
    (char) =>
      ({
        '<': '&lt;',
        '>': '&gt;',
        '&': '&amp;',
        "'": '&apos;',
        '"': '&quot;',
      })[char]!,
  )

type FeedEntry = {
  title: string
  url: string
  date: string
  summary: string
  categories: string[]
}

export function GET() {
  const entries: FeedEntry[] = [
    ...getAllPostsInfo([
      'title',
      'url',
      'date',
      'excerpt',
      'category',
      'tags',
    ]).map((post) => ({
      title: post.title,
      url: post.url,
      date: post.date,
      summary: post.excerpt,
      categories: [post.category, ...post.tags],
    })),
    ...getAllThoughtsInfo(['title', 'url', 'date', 'excerpt']).map(
      (thought) => ({
        title: thought.title,
        url: thought.url,
        date: thought.date,
        summary: thought.excerpt,
        categories: ['絮语'],
      }),
    ),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  // 用最新一条的日期作为更新时间的兜底，保证构建结果稳定
  const updated = entries[0]
    ? new Date(entries[0].date).toISOString()
    : '1970-01-01T00:00:00.000Z'

  const entryXml = entries
    .map((entry) => {
      const href = `${SITE_URL}${entry.url}`
      const published = new Date(entry.date).toISOString()

      return `  <entry>
    <title>${escapeXml(entry.title)}</title>
    <link rel="alternate" type="text/html" href="${escapeXml(href)}" />
    <id>${escapeXml(href)}</id>
    <published>${published}</published>
    <updated>${published}</updated>
    <summary type="text">${escapeXml(entry.summary)}</summary>
${entry.categories.map((category) => `    <category term="${escapeXml(category)}" />`).join('\n')}
  </entry>`
    })
    .join('\n')

  const xml = `<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom" xml:lang="zh-CN">
  <title>${escapeXml(SITE_TITLE)}</title>
  <subtitle>${escapeXml(SITE_DESCRIPTION)}</subtitle>
  <id>${SITE_URL}/</id>
  <link rel="self" type="application/atom+xml" href="${SITE_URL}/atom.xml" />
  <link rel="alternate" type="text/html" href="${SITE_URL}/" />
  <updated>${updated}</updated>
  <author>
    <name>${escapeXml(SITE_AUTHOR)}</name>
  </author>
${entryXml}
</feed>`

  return new Response(xml, {
    headers: { 'Content-Type': 'application/atom+xml; charset=utf-8' },
  })
}
