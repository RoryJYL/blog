import {
  POST_PAGE_SIZE,
  publishedPosts,
  publishedThoughts,
  THOUGHT_PAGE_SIZE,
} from './content'

/** 列表页路径：索引页是规范路径，分页从第 2 页开始带数字（第 1 页不重复出现） */
function listRoutes(basePath: string, totalItems: number, pageSize: number) {
  const totalPages = Math.ceil(totalItems / pageSize)
  const routes = [basePath]

  for (let page = 2; page <= totalPages; page++) {
    routes.push(`${basePath}/${page}`)
  }

  return routes
}

/**
 * 构建期全量静态路径清单。
 * `react-router.config.ts` 的 prerender 和 `scripts/gen-static.mjs` 的 sitemap 共用同一份。
 */
export function getStaticRoutes(): string[] {
  return [
    '/',
    ...listRoutes('/posts', publishedPosts.length, POST_PAGE_SIZE),
    ...listRoutes('/thoughts', publishedThoughts.length, THOUGHT_PAGE_SIZE),
    ...publishedPosts.map((post) => post.url),
    ...publishedThoughts.map((thought) => thought.url),
    '/gamer-profile/playstation',
    '/gamer-profile/steam',
    '/404',
  ]
}
