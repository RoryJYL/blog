// 生成 atom.xml / sitemap.xml / 404.html，并把不该上线的构建残留清掉。
// 跑在 `react-router build` 之后，直接读写 build/client。
import { copyFile, readdir, rm, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { posts, thoughts } from '../.velite/index.js'
import {
  SITE_AUTHOR,
  SITE_DESCRIPTION,
  SITE_TITLE,
  SITE_URL,
} from '../lib/site-config.mjs'

const OUT_DIR = 'build/client'

const escapeXml = (value) =>
  value.replace(
    /[<>&'"]/g,
    (char) =>
      ({
        '<': '&lt;',
        '>': '&gt;',
        '&': '&amp;',
        "'": '&apos;',
        '"': '&quot;',
      })[char],
  )

/** Atom feed：文章 + 絮语按时间倒序 */
function buildAtom() {
  const entries = [
    ...posts
      .filter((post) => !post.draft)
      .map((post) => ({
        title: post.title,
        url: post.url,
        date: post.date,
        summary: post.excerpt,
        categories: [post.category, ...post.tags],
      })),
    ...thoughts
      .filter((thought) => !thought.draft)
      .map((thought) => ({
        title: thought.title,
        url: thought.url,
        date: thought.date,
        summary: thought.excerpt,
        categories: ['絮语'],
      })),
  ].sort((a, b) => Date.parse(b.date) - Date.parse(a.date))

  // 用最新一条的日期作为更新时间的兜底，保证构建结果稳定
  const updated = entries[0]
    ? new Date(entries[0].date).toISOString()
    : '1970-01-01T00:00:00.000Z'

  const entryXml = entries
    .map((entry) => {
      const href = `${SITE_URL}${entry.url}`
      const published = new Date(entry.date).toISOString()
      const categories = entry.categories
        .map((category) => `    <category term="${escapeXml(category)}" />`)
        .join('\n')

      return `  <entry>
    <title>${escapeXml(entry.title)}</title>
    <link rel="alternate" type="text/html" href="${escapeXml(href)}" />
    <id>${escapeXml(href)}</id>
    <published>${published}</published>
    <updated>${published}</updated>
    <summary type="text">${escapeXml(entry.summary)}</summary>
${categories}
  </entry>`
    })
    .join('\n')

  return `<?xml version="1.0" encoding="utf-8"?>
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
}

/**
 * sitemap 直接读构建产物，而不是复用 prerender 清单：
 * 产物里有什么页面，sitemap 就写什么，两边不可能漂移。
 */
function collectRoutes(files) {
  return (
    files
      .filter((file) => file.endsWith('index.html'))
      .map((file) => file.slice(0, -'index.html'.length).replace(/\/$/, ''))
      .map((dir) => (dir === '' ? '/' : `/${dir}`))
      // 404 页带 noindex，不该出现在 sitemap 里
      .filter((route) => route !== '/404')
      .sort()
  )
}

function buildSitemap(routes) {
  const urls = routes
    .map(
      (route) => `  <url><loc>${escapeXml(`${SITE_URL}${route}`)}</loc></url>`,
    )
    .join('\n')

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`
}

async function main() {
  const files = await readdir(OUT_DIR, { recursive: true, withFileTypes: true })
  const relativeFiles = files
    .filter((entry) => entry.isFile())
    .map((entry) => {
      const dir = entry.parentPath.slice(OUT_DIR.length + 1)
      return dir ? `${dir}/${entry.name}` : entry.name
    })

  const routes = collectRoutes(relativeFiles)

  await writeFile(join(OUT_DIR, 'atom.xml'), buildAtom())
  await writeFile(join(OUT_DIR, 'sitemap.xml'), buildSitemap(routes))

  // Workers 的 not_found_handling = "404-page" 认根目录下的 404.html
  await copyFile(join(OUT_DIR, '404/index.html'), join(OUT_DIR, '404.html'))

  // SPA fallback 用不上：所有路径要么预渲染，要么由边缘返回 404.html
  await rm(join(OUT_DIR, '__spa-fallback.html'), { force: true })

  console.log(
    `gen-static: atom.xml (${routes.length} pages in sitemap), 404.html, sitemap.xml`,
  )
}

await main()
