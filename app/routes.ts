import {
  index,
  layout,
  type RouteConfig,
  route,
} from '@react-router/dev/routes'

export default [
  index('routes/home.tsx'),
  layout('routes/list-layout.tsx', [
    route('posts/:page?', 'routes/posts.tsx'),
    route('thoughts/:page?', 'routes/thoughts.tsx'),
  ]),
  route('post/:slug', 'routes/post.tsx'),
  route('thought/:slug', 'routes/thought.tsx'),
  layout('routes/gamer-layout.tsx', [
    route('gamer-profile/playstation', 'routes/playstation.tsx'),
    route('gamer-profile/steam', 'routes/steam.tsx'),
  ]),
  // `/404` 也由这个 splat 路由兜住：prerender 出 build/client/404/index.html，
  // 边缘 not_found_handling 再把它当 404.html 用
  route('*', 'routes/not-found.tsx'),
] satisfies RouteConfig
