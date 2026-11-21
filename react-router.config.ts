import type { Config } from '@react-router/dev/config'
import { getStaticRoutes } from './lib/routes-manifest'

export default {
  // 运行时没有服务端：URL 直达吃预渲染出的 index.html
  ssr: false,
  // 构建时把每条路径渲染成 HTML + .data
  prerender: getStaticRoutes(),
} satisfies Config
