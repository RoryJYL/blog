import { SITE_DESCRIPTION } from './site-config.mjs'

/**
 * 每个路由的页面元信息。
 *
 * React Router 的 `<Meta />` 用叶子路由的 meta 整体替换父级的，
 * 不会合并，所以公共项（描述、feed 链接、formatDetection）必须每页都带上。
 */
export function pageMeta(title: string, description = SITE_DESCRIPTION) {
  return [
    { title },
    { name: 'description', content: description },
    { name: 'formatDetection', content: 'telephone=no' },
    {
      tagName: 'link',
      rel: 'alternate',
      type: 'application/atom+xml',
      href: '/atom.xml',
    },
  ]
}
