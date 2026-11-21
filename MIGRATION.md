# 迁移方案：Next.js 14 → React Router 8 + Velite + Cloudflare Workers

> 状态：v2 · 2026-11-21 · 4 个未决问题已确认（见 §14）
> 目标站点：https://blog.rorytech.com
> 范围：只动前端站点。`playstation-network-api` / `steam-api` 两个 Worker 不动。

---

## 0. 一页结论

| 项     | 现在                                                            | 目标                                                               |
| ------ | --------------------------------------------------------------- | ------------------------------------------------------------------ |
| 框架   | Next.js 14.2.13（`output: 'export'`）                           | React Router 8.5.x framework mode（`ssr: false` + 全量 prerender） |
| 构建   | webpack / Turbopack                                             | Vite 7                                                             |
| 内容层 | contentlayer 0.3.4（上游停更）                                  | Velite 0.4.x                                                       |
| 渲染   | React 18                                                        | React 19.2.7+（RR8 硬要求）                                        |
| 宿主   | Cloudflare Pages + `@cloudflare/next-on-pages`（已 deprecated） | Cloudflare Workers Static Assets                                   |
| 产物   | `out/`                                                          | `build/client/`                                                    |

**三条硬决策**

1. **不用 `@cloudflare/vite-plugin`。** 它是给"应用跑在 workerd 里"用的（bindings、SSR）。我们是纯静态，构建产物就是一坨文件，`wrangler deploy` 上传即可。少一层运行时就少一类问题。
2. **不用 `@velite/plugin-vite`。** 该包版本 `0.0.1`，只有一个 `config` 选项，没有文档页。用 CLI：`predev` 先同步构建一次 + `--watch` 增量，`build` 里串在命令最前面。两行 npm script，比一个 0.0.1 的插件可预测。
3. **`atom.xml` / `sitemap.xml` / `404.html` 用独立脚本生成，不走路由。** 不为一个静态 XML 文件去和路由器的静态导出规则搏斗。

**前提（已确认）**

- 域名 NS 在 **Cloudflare** → Workers 自定义域可用，§9 的迁移路径没有阻塞
- CI 走 **Cloudflare 提供的 build** → 需要从 Pages Git 集成切到 Workers Builds（步骤见 §9）
- 待定两件：是否需要严格 CSP（影响 MDX 渲染方式，见 §6.4）；`date` 字段解析在 PR 1 抽查

---

## 1. 为什么走

不是"Next 不好用"，是这套组合已经停止维护：

- **`@cloudflare/next-on-pages` 在 npm 上标记 deprecated**（最后版本 1.13.16，2025-09-04），官方指路 OpenNext/vinext。而我们是 `output: 'export'`，本来也不该用它。
- **contentlayer 停更**，社区只能靠 `contentlayer2` fork 续命。整个 `contentlayer.config.ts` 205 行里有 150 行是在补它的缺失（TOC、readingTime、excerpt、headerImage 回退）。
- **Next 14 落后两个大版本**，升 15/16 要 React 19 + `params` 变 Promise，所有带 `params` 的路由都得改。也就是说"留在 Next"并不比"换框架"省事。
- 另外：不想继续用 Vercel 的东西。这条是偏好，不需要论证。

**同时明确不做什么**：不改设计、不改 URL 结构（除 §12 列出的缺陷修正）、不上 SSR、不引入数据库、不做 RSC。

---

## 2. 版本基线

```
node   >= 22.22.0     # RR8 硬要求；CI 锁 24.x
react  >= 19.2.7      # RR8 硬要求
vite   ^7             # RR8 硬要求
react-router ^8.5
velite ^0.4.0         # 不要用 1.0.0-alpha
tailwindcss ^4        # 改用 @tailwindcss/vite
wrangler              # 升到当前最新，别停在 3.x
```

`package.json` 需要加 `"type": "module"`：Velite 和 RR8 都是 ESM-only 包。副作用正好都在删除清单里——`postcss.config.js`（`module.exports`）和 `next-sitemap.config.js` 都要删。

React 19 会连带升级：`@radix-ui/*`（需 React 19 peer 版本）、`motion` 12（已支持）、`next-themes` → 移除。`next-themes` 依赖 next 的 `Script`，换成 20 行的 class 切换 + 内联脚本（避免主题闪烁）。

---

## 3. 目标结构

```
blog/
├─ app/
│  ├─ root.tsx                 # html/head/body + Provider + Header/Footer
│  ├─ routes.ts                # 路由表（唯一入口）
│  └─ routes/
│     ├─ home.tsx              # /
│     ├─ list-layout.tsx       # 列表页共用的 MainLayout（左栏 PostList）
│     ├─ posts.tsx             # /posts, /posts/:page
│     ├─ thoughts.tsx          # /thoughts, /thoughts/:page
│     ├─ post.tsx              # /post/:slug（TOC 左 / 正文 / PostList 右）
│     ├─ thought.tsx           # /thought/:slug
│     ├─ gamer-layout.tsx      # /gamer-profile/* 外壳
│     ├─ playstation.tsx
│     ├─ steam.tsx
│     └─ not-found.tsx         # *
├─ components/                 # 现有组件，基本不动
├─ lib/
│  ├─ content.ts               # 替代 contentplayer-utils.ts
│  ├─ mdx.tsx                  # MDX 渲染 helper
│  └─ routes-manifest.ts       # 静态路径清单（prerender 与 sitemap 共用）
├─ content/                    # 不动
├─ public/                     # 不动（清掉陈旧的 sitemap*.xml）
├─ scripts/gen-static.mjs      # atom.xml / sitemap.xml / 404.html
├─ velite.config.ts
├─ vite.config.ts
├─ react-router.config.ts
└─ wrangler.toml
```

`app/(normal)/layout.tsx` 这个 route group 消失：它只包了 4 个列表页，用一个 `list-layout` 布局路由表达即可。

---

## 4. 渲染模型

```
pnpm build
  ├─ velite build          → .velite/（类型安全的内容数据）
  ├─ react-router build
  │    ├─ 读 react-router.config.ts
  │    ├─ 按 prerender 列表逐条执行 route loader（构建时，Node 环境）
  │    └─ 每条路径产出两个文件：
  │         build/client/<path>/index.html   首屏文档
  │         build/client/<path>.data         客户端导航用的 loader 数据
  └─ node scripts/gen-static.mjs  → atom.xml / sitemap.xml / 404.html
```

运行时没有任何服务端。URL 直达吃 `index.html`，站内跳转读 `.data`。这正是现在 `output: 'export'` 的效果，只是换了个实现。

`react-router.config.ts`：

```ts
import type { Config } from '@react-router/dev/config'
import { getStaticRoutes } from './lib/routes-manifest'

export default {
  ssr: false, // 没有运行时服务端
  prerender: getStaticRoutes(), // 所有路径，构建时全部生成
} satisfies Config
```

注意 `ssr: false` 时的限制：任何路由都不能导出 `action` 或 `headers`。我们没有，不受影响。

---

## 5. 路由映射

| 现在                                 | 目标                                               | prerender                                  |
| ------------------------------------ | -------------------------------------------------- | ------------------------------------------ |
| `app/page.tsx`                       | `routes/home.tsx`（index）                         | `/`                                        |
| `app/(normal)/posts/[[...slug]]`     | `routes/posts.tsx`                                 | `/posts`, `/posts/2` … `/posts/N`          |
| `app/(normal)/thoughts/[[...slug]]`  | `routes/thoughts.tsx`                              | `/thoughts`, `/thoughts/2` … `/thoughts/N` |
| `app/post/[slug]/layout` + `page`    | **合并**为 `routes/post.tsx`                       | `/post/<slug>` × 3                         |
| `app/thought/[slug]/layout` + `page` | **合并**为 `routes/thought.tsx`                    | `/thought/<slug>` × 6                      |
| `app/gamer-profile/layout`           | `routes/gamer-layout.tsx`                          | —                                          |
| `app/gamer-profile/playstation/page` | `routes/playstation.tsx`                           | `/gamer-profile/playstation`               |
| `app/gamer-profile/steam/page`       | `routes/steam.tsx`                                 | `/gamer-profile/steam`                     |
| `app/atom.xml/route.ts`              | 删除，交给 `gen-static.mjs`                        | —                                          |
| 无                                   | `routes/not-found.tsx`，挂在 `404` 和 `*` 两个路径 | `/404`（用来产出 `404.html`）              |

详情页把 layout 和 page 合并：现在 layout 和 page 各调一次 `getPost(slug)`，合并后 loader 只调一次，TOC、正文、相邻导航在同一个组件里。

**`/posts/1` 和 `/thoughts/1` 的处理（已决）**：它们和索引页内容完全重复。规范路径定为 `/posts` / `/thoughts`，第 1 页用 `_redirects` 301 过去（见 §9），不进 prerender、不进 sitemap。同时把分页组件第 1 页的链接改成 `${basePath}`（见 §12），保证站内永远不再产生这种链接。保留 301 是为了兜住外部已经收进去的旧链接。

`app/routes.ts`：

```ts
import {
  type RouteConfig,
  index,
  layout,
  route,
} from '@react-router/dev/routes'

export default [
  index('routes/home.tsx'),
  layout('routes/list-layout.tsx', [
    route('posts', 'routes/posts.tsx'),
    route('posts/:page', 'routes/posts.tsx'),
    route('thoughts', 'routes/thoughts.tsx'),
    route('thoughts/:page', 'routes/thoughts.tsx'),
  ]),
  route('post/:slug', 'routes/post.tsx'),
  route('thought/:slug', 'routes/thought.tsx'),
  route('404', 'routes/not-found.tsx'),
  route('*', 'routes/not-found.tsx'),
  layout('routes/gamer-layout.tsx', [
    route('gamer-profile/playstation', 'routes/playstation.tsx'),
    route('gamer-profile/steam', 'routes/steam.tsx'),
  ]),
] satisfies RouteConfig
```

`not-found.tsx` 只导出组件，不导出 loader：`/404` 要能被 prerender 成 HTML，`*` 用来兜住客户端跳转。**HTTP 404 状态码由边缘（`not_found_handling`）负责，不靠路由抛错。**

`/gamer-profile` 的 301 继续由 `_redirects` 在边缘处理，不进路由。

`root.tsx` 骨架（`Meta`/`Links`/`Scripts`/`ScrollRestoration` 四个是必须的）：

```tsx
export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-Hans-CN" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="bg-background">
        <ThemeProvider>
          <PlaystationStoreProvider>
            <SteamStoreProvider>
              <TooltipProvider delayDuration={300}>
                <Header />
                {children}
                <Footer />
              </TooltipProvider>
            </SteamStoreProvider>
          </PlaystationStoreProvider>
        </ThemeProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  )
}

export default function App() {
  return <Outlet />
}
```

好消息：RR 只有一个 React 根，现有 Provider 嵌套树可以原样搬过来，不用像 Astro 那样拆 island。

---

## 6. 内容层（Velite）

### 6.1 事实核对

- 最新稳定版 **0.4.0**（2026-06-17），另有 1.0.0-alpha.3；仓库 2026-08 仍在提交。
- `s` 是 Zod 的扩展，`s.string()/s.boolean()/s.array()` 都是标准 Zod 用法，自定义 schema 免费。
- 内置 schema 覆盖大部分字段：`s.mdx()`、`s.toc()`、`s.isodate()`、`s.path()`、`s.raw()`、`s.excerpt()`、`s.metadata()`。但摘要和阅读时长有自定义规则（中文计数、`{/* more */}` 标记），仍要自己算，见 6.2。
- `s.mdx()` 产出的是 **function-body 字符串**，渲染方式和现在 `useMDXComponent(post.body.code)` 完全一致。

### 6.2 `velite.config.ts` 草案

```ts
import { defineConfig, s, context } from 'velite'
import {
  buildExcerpt,
  calcReadingTime,
  firstImage,
} from './lib/content-helpers'

export default defineConfig({
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
          slug: s.path(), // 从文件路径生成
          toc: s.toc(),
          code: s.mdx(),
        })
        .transform((post) => {
          const { file } = context()
          return {
            ...post,
            url: `/post/${post.slug}`,
            excerpt: buildExcerpt(file.content),
            headerImage: post.headerImage ?? firstImage(file.content),
            readingTime: { text: calcReadingTime(file.content) },
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
          slug: s.path(),
          code: s.mdx(),
        })
        .transform((post) => {
          const { file } = context()
          return {
            ...post,
            url: `/thought/${post.slug}`,
            excerpt: buildExcerpt(file.content),
            readingTime: { text: calcReadingTime(file.content) },
          }
        }),
    },
  },
})
```

`s.path()` 从文件路径生成 slug。**验证点**：如果产出带 `posts/` 前缀，加一行 `.replace(/^posts\//, '')` 兜底；这一步在 PR 1 里必须确认，因为所有 URL 都依赖它。

`lib/content-helpers.ts` 里三个函数**从 `contentlayer.config.ts` 原样搬过来**，逻辑不改：

| 函数                   | 来源                             | 说明                                                                |
| ---------------------- | -------------------------------- | ------------------------------------------------------------------- |
| `buildExcerpt(raw)`    | config `buildExcerpt`            | 认 `<!-- more -->` 和 `{/* more */}`，`s.excerpt()` 不认，必须保留  |
| `calcReadingTime(raw)` | config `calculateReadingTime`    | 中文 400 字/分钟 + "大约需要 N 分钟阅读"，`s.metadata()` 不按中文算 |
| `firstImage(raw)`      | config 里 headerImage 的 resolve | 正文第一张图作封面                                                  |

**结论先说清楚：Velite 替掉的是声明方式（`defineDocumentType` → Zod）和 `_raw.flattenedPath` 这类反人类字段，替不掉那 150 行自定义逻辑。** 那 150 行是业务，不是框架债。

`extractToc` 那 40 行可以删——`s.toc()` 底层就是 `mdast-util-toc`。但注意输出形状不同（`{title, url, depth, items}`，默认嵌套树），而 `components/toc` 期望 `{depth, value, slug}` 的扁平数组。写个十行 adapter，或者把 `extractToc` 原样塞进 transform。**先按 adapter 做，形状对不齐再退回原函数。**

### 6.3 MDX 渲染

```tsx
// lib/mdx.tsx
import * as runtime from 'react/jsx-runtime'
import type { ComponentType } from 'react'
import { mdxComponents } from '@/app/components/markdown-components/mdx-components'

export function MDXContent({ code }: { code: string }) {
  // eslint-disable-next-line no-new-func
  const Component = new Function(code)({ ...runtime })
    .default as ComponentType<{
    components?: Record<string, unknown>
  }>
  return <Component components={mdxComponents} />
}
```

和现在 `next-contentlayer/hooks` 的 `useMDXComponent` 是同一个机制。内容里没有任何 `import`（已确认），所以组件注入模式完全够用。

### 6.4 已知限制

- **`new Function` 与 CSP 不兼容。** 如果要上严格 CSP，需要 `'unsafe-eval'`，或者改成构建时打包 MDX（`@mdx-js/rollup` + `import.meta.glob`）。但后者在 `ssr: false` + prerender 下会踩"loader 数据不可序列化"的坑，不值当。见 §13。
- **所有文章的 `code` 会进同一个模块。** 详情页 route 会加载全部正文。现状（contentlayer 的 `allPosts` 也带全部 `body.code`）就是这样，不算回退。文章数上到 50+ 再考虑拆 meta / body 两个 collection。

### 6.5 `app/gamer-profile/*` 的环境变量

现在 `next.config.mjs` 的 `env` 在构建时注入 `PSN_API_URL` / `STEAM_API_URL`（`wrangler.toml` 里的 `[vars]` 对静态导出其实是死配置）。Vite 下改成 `vite.config.ts` 的 `define`，语义不变：**构建时常量，不是运行时配置**。新的 wrangler 配置里不再需要 `[vars]`。

---

## 7. 组件与 API 映射

| Next                                                    | 替换为                                                                                          | 涉及文件数 |
| ------------------------------------------------------- | ----------------------------------------------------------------------------------------------- | ---------- |
| `next/link`                                             | `react-router` 的 `Link`                                                                        | 13         |
| `next/image`                                            | `<img>`（全部远程图 + `unoptimized: true`，零功能损失）                                         | 10         |
| `next/navigation` `usePathname`                         | `useLocation().pathname`                                                                        | 3          |
| `next/navigation` `notFound`                            | loader 里 `throw data(null, { status: 404 })`（或 `throw new Response(null, { status: 404 })`） | 4          |
| `next/navigation` `useRouter`                           | `useNavigate`                                                                                   | 0          |
| `generateMetadata`                                      | route module 的 `meta` export                                                                   | 6          |
| `generateStaticParams`                                  | `react-router.config.ts` 的 `prerender`                                                         | 3          |
| `useMDXComponent`                                       | `lib/mdx.tsx` 的 `MDXContent`                                                                   | 2          |
| `next-themes`                                           | 自写 20 行（class 切换 + 内联脚本）                                                             | 1          |
| `@svgr/webpack`                                         | `vite-plugin-svgr`，导入加 `?react` 后缀                                                        | 1          |
| `@tailwindcss/postcss`                                  | `@tailwindcss/vite`                                                                             | 1          |
| `next-sitemap`                                          | `scripts/gen-static.mjs`                                                                        | —          |
| `highlight.js` / `dayjs` / `motion` / `zustand` / Radix | 不动                                                                                            | —          |

`state` 相关全部不动：zustand store、Radix 组件、motion 动画、`reading-time-estimator` 都在客户端跑，与框架无关。**唯一必须动的是 React 19 兼容**（Radix 各包要升到支持 19 的版本）。

全仓 75 个源文件里，只有 20 来个 import 了 `next/*`（`next/link` 13 个、`next/image` 10 个、`next/navigation` 7 个，有重叠）。真正的逻辑改动集中在 6 个路由文件 + 3 个 lib 文件，其余是改 import 和 props 名。

新增 devDependencies：`concurrently`、`vite-plugin-svgr`、`@tailwindcss/vite`。其余全是删除。

---

## 8. 静态产物

`app/atom.xml/route.ts` 删除。`scripts/gen-static.mjs` 在 `react-router build` 之后运行，输出到 `build/client/`：

| 文件          | 内容                                                                                                 | 备注                                                                                                  |
| ------------- | ---------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| `atom.xml`    | 沿用现有 `route.ts` 里的逻辑（`escapeXml` + 条目拼装），字段从 velite 取                             | 必须校验 XML 合法性                                                                                   |
| `sitemap.xml` | 遍历 `getStaticRoutes()`，排除 `/atom.xml` 和 `/404`                                                 | 替代 next-sitemap                                                                                     |
| `404.html`    | 把 `/404` 加进 prerender 列表，构建后把 `build/client/404/index.html` 复制成 `build/client/404.html` | Workers `not_found_handling = "404-page"` 靠它；这样 404 页也带完整站点外壳。状态码由边缘给，不靠路由 |
| `robots.txt`  | 不放脚本里，继续放 `public/`                                                                         | 现有内容正确，不动                                                                                    |

**404 页面（已决：做一个真的，不复用旧的 `404.html`）**

- 复用 `root.tsx` 外壳（Header/Footer 自动存在），不新建布局
- 内容三块：大号 `404`、一句"这个页面不存在或者已经搬走了"、一个"返回首页"按钮，再加最近 3 篇文章的链接（复用现有 `Button` / `PostCard`）——误入的人有地方可去
- 该路由的 `meta` 里加 `{ name: 'robots', content: 'noindex' }`，避免 `/404` 自己被索引
- 不新增依赖

脚本用 `.mjs` 而不是 `.ts`：不引入 `tsx` 依赖，也不依赖 Node 的 TS 剥离版本。

---

## 9. 部署（Workers Static Assets）

`wrangler.toml`：

```toml
name = "blog"
compatibility_date = "2026-11-21"

[assets]
directory = "./build/client"
not_found_handling = "404-page"
```

没有 `main`，没有 Worker 脚本，就是纯资源。`_redirects` 和 `_headers` Workers 原生支持，现有那条 `/gamer-profile` 301 一个字不用改，只追加两行：

```txt
# public/_redirects —— 按顺序匹配，第一条命中即停
/gamer-profile /gamer-profile/playstation 301
/posts/1 /posts 301
/thoughts/1 /thoughts 301
```

命令映射：

| 现在                            | 目标                                       |
| ------------------------------- | ------------------------------------------ |
| `wrangler pages deploy out`     | `wrangler deploy`                          |
| `wrangler pages dev`            | `wrangler dev`（本地端口 8787，不是 8788） |
| `npx @cloudflare/next-on-pages` | 删除                                       |

`package.json` scripts：

```json
{
  "predev": "velite build",
  "dev": "concurrently -n velite,rr \"velite --watch\" \"react-router dev\"",
  "build": "velite build && react-router build && node scripts/gen-static.mjs",
  "preview": "wrangler dev",
  "deploy": "wrangler deploy"
}
```

`predev` 不能省：`react-router.config.ts` 在启动时就要 import `.velite` 拿路径清单，必须保证它已存在。`predev` 先同步构建一次，`--watch` 负责后续增量。

前置条件：

1. **自定义域名**：已确认 NS 在 Cloudflare，`blog.rorytech.com` 可以直接挂成 Worker 的自定义域。切换时先把 Worker 挂上去验证，再改 Pages 项目。
2. **CI（现在是 Pages 的 Git 集成，需要换）**：
   - 在 Workers Builds 里连同一个仓库：build command = `pnpm build`，deploy command = `pnpm deploy`
   - 在 Workers Builds 的 **build 环境**里重配 `PSN_API_URL` / `STEAM_API_URL`——Pages 的构建变量不会自动搬过来，这是最容易漏的一步，漏了 gamer-profile 两页会静默变成"平台不可用"
   - 打开 preview builds，替代现在 Pages 的分支预览
   - **最后**再关 Pages 项目的自动部署：切域名前别关，它是回滚通道
3. **构建期环境变量**：`PSN_API_URL` / `STEAM_API_URL` 需要在构建环境里存在（Vite `define` 读 `process.env`）。

成本：静态资源请求在 Workers 上同样免费无限，价格结构不变。

---

## 10. 施工计划

每个 PR 独立可验证，任何一步卡住都能停在那儿不影响线上。

### PR 1 — 骨架跑通

- `package.json` 依赖重写、React 19 升级、Vite/Tailwind 配置
- `root.tsx` / `routes.ts` / `react-router.config.ts`
- `velite.config.ts` + `lib/content-helpers.ts` + `lib/content.ts`
- 迁 `home.tsx`、`list-layout.tsx`、`posts.tsx`、`thoughts.tsx`
- **验收**：`/`、`/posts`、`/thoughts` 由 prerender 生成 HTML，`grep` 能搜到文章标题；分页链接可点；`/posts/1` 能 301 到 `/posts`（`_redirects` 本地用 `wrangler dev` 验证）；无 hydration 报错

### PR 2 — 详情页

- `post.tsx` / `thought.tsx`（含 TOC、相邻导航、PostList 高亮）
- `lib/mdx.tsx` + 现有 `mdx-components` 接入
- **验收**：3 篇文章 + 6 条絮语全部生成；代码块高亮、图片缩放、TOC 滚动定位正常；`post.toc` 与渲染出的 heading id 一一对应

### PR 3 — 游戏档案与交互

- `gamer-layout.tsx` / `playstation.tsx` / `steam.tsx`
- `next-themes` 替换、`vite-plugin-svgr`、Radix React 19 升级
- **验收**：两页数据能拉取渲染；主题切换无闪烁；移动端抽屉、回到顶部、图片缩放全部正常

### PR 4 — 产物与部署切换

- `scripts/gen-static.mjs`、`wrangler.toml`、`_redirects` 追加两行
- 404 页面（设计见 §8）
- CI 切 Workers Builds、自定义域切换
- 删除 `app/atom.xml/route.ts`、`next.config.mjs`、`next-sitemap.config.js`、`@cloudflare/next-on-pages`
- **验收**：见 §11；域名切换后观察 3 天再删 Pages 项目

---

## 11. 验收标准

功能：

- [ ] prerender 列表里的每一条都生成了对应的 `index.html`，逐条核对
- [ ] 每页内容与现网一致（同一路径下 `index.html` 抽正文纯文本后 diff，允许空白差异）
- [ ] `/atom.xml` 通过 XML 校验，条目数 = 3 篇文章 + 6 条絮语
- [ ] `/sitemap.xml` 覆盖除 `atom.xml` 外的所有页面
- [ ] `/posts/1` → `/posts`、`/thoughts/1` → `/thoughts` 返回 301
- [ ] `_redirects` 的 `/gamer-profile` 301 生效
- [ ] 不存在的路径返回 404 状态码 + 新的 `404.html`
- [ ] `/404` 页面带 `noindex` 且不在 sitemap 里
- [ ] 全站内链无死链（爬一遍 `build/client`）

性能（与现网对比，记录数字进 PR）：

- [ ] 首屏 JS 体积 ≤ 现网
- [ ] `build/client` 总体积 ≤ 现网 `out`
- [ ] `pnpm build` 耗时 ≤ 现网
- [ ] Lighthouse 四项不低于现网

工程：

- [ ] `pnpm-lock.yaml` 里不再有 `next`、`contentlayer`、`@cloudflare/next-on-pages`
- [ ] `node_modules` 包数量显著下降（基线：现在 1043 个 / 920MB）
- [ ] `pnpm dev` 下改 MDX 能热更新

---

## 12. 顺带修掉的既有缺陷

这三个是在盘点时挖出来的，迁移时顺手处理：

1. **`app/components/pagination/index.tsx` 的链接写死。** 第 52、82 行把第 1 页指向 `/`（首页），第 93 行写死 `/posts/`。这个组件被絮语列表复用，目前絮语 6 条 ≤ 每页 10 条，翻页按钮永远不显示，所以 bug 是睡着的。改成接收 `basePath` prop：第 1 页 → `${basePath}`。
2. **`public/sitemap.xml` 和 `public/sitemap-0.xml` 是陈旧副本。** next-sitemap 输出到 `out/`，`public/` 里这两个是历史残留，会覆盖新生成的文件。删掉。
3. **`out/` 里混入了 dev 构建。** `out/_next/static/chunks/main.js` 5.2MB 且带 `eval-source-map`，产物目录被污染过。新流程里 `build/client` 每次构建前清空。

---

## 13. 风险与回滚

| 风险                           | 概率 | 应对                                                                    |
| ------------------------------ | ---- | ----------------------------------------------------------------------- |
| Velite `s.toc()` 形状对不齐    | 中   | 保留 `extractToc` 塞进 transform，40 行的事                             |
| `date` 字段解析漂移            | 中   | 上线前抽查 3 篇的显示日期与 atom 的 `<updated>`                         |
| RR8 生态偏新                   | 低   | v8 是 v7 的非破坏升级，RR 有十年历史；锁定 `^8.x`                       |
| `new Function` 与未来 CSP 冲突 | 中   | 先不做 CSP；要做就单独评估                                              |
| Workers Builds 漏配构建变量    | 中   | `PSN_API_URL` / `STEAM_API_URL` 必须重配；漏了 gamer-profile 会静默降级 |
| Workers Builds 首次配置踩坑    | 低   | 先用 `wrangler deploy --dry-run` 和本地 `wrangler dev` 验证             |

**回滚**：全程在分支上做，Pages 项目保留不删。域名切回 Pages 只需改 DNS，几分钟的事。删除 Pages 项目的动作延后到新栈稳定运行一周后。

---

## 14. 决策记录

| #   | 问题                             | 结论                                                                                           | 落点        |
| --- | -------------------------------- | ---------------------------------------------------------------------------------------------- | ----------- |
| 1   | 域名 NS 托管在哪                 | **Cloudflare**。Workers 自定义域可用，原方案无阻塞                                             | §9          |
| 2   | 是否保留 `/posts/1` 这种重复 URL | **不保留**。索引页为规范路径，`/posts/1`、`/thoughts/1` 301 过去，不进 prerender、不进 sitemap | §5、§9、§12 |
| 3   | 是否需要真正的 404 页面          | **做**。复用 root 外壳，返回首页 + 最近三篇，`noindex`                                         | §8          |
| 4   | 现在 CI 是什么                   | **Cloudflare 提供的 build**（Pages 的 Git 集成）→ 切到 Workers Builds，注意构建变量要手工搬    | §9          |

剩下的两件不是阻塞项，按计划在施工中被验证：

- **CSP**：先不做。真要做，MDX 渲染方式必须换（`new Function` 与严格 CSP 冲突），是独立议题
- **`date` 字段解析**：PR 1 抽查三篇的显示日期与 atom `<updated>`

---

## 15. 验收实测（2026-11-21）

分支 `migrate-to-react-router`。旧栈基线来自 `HEAD~1` 的干净构建（`git worktree` + `pnpm install` + `pnpm build`），不是仓库里那个被 dev 构建污染过的 `out/`（13M）。

| 项                       | Next 14        | React Router 8 | 结论               |
| ------------------------ | -------------- | -------------- | ------------------ |
| 全量构建（冷启动）       | 21.8s          | 8.1s           | −63%               |
| 产物总体积               | 6.1M（`out/`） | 4.0M           | −34%               |
| 首屏 JS `/`（gzip）      | 237 KiB        | 224 KiB        | −5%                |
| 首屏 JS `/posts`         | 282 KiB        | 244 KiB        | −14%               |
| 首屏 JS 文章页           | 593 KiB        | 559 KiB        | −6%                |
| 依赖数量 / 磁盘          | 1043 包 / 920M | 462 包 / 600M  | −56%               |
| 12 个页面正文纯文本 diff | —              | 逐字一致       | 仅页脚致谢文字变化 |

Lighthouse（mobile，3 次取中位数，`/` · `/posts` · 文章页）：

| 指标     | 现网            | 新栈            |
| -------- | --------------- | --------------- |
| 性能     | 90 · 80 · 76    | 93 · 83 · 73    |
| 可访问性 | 100 · 96 · 91   | 100 · 96 · 95   |
| 最佳实践 | 100 · 100 · 100 | 100 · 100 · 100 |
| SEO      | 100 · 92 · 92   | 100 · 100 · 100 |

文章页性能低 3 分是本地服务器不压缩造成的：`wrangler dev` 直接吐未压缩 JS（1.7 MiB），Cloudflare 会走 brotli（515 KiB）。其余两项（TBT 0ms vs 38–72ms、CLS 0）都更好。

### 与方案的偏差

1. **没有拆成 4 个 PR。** 内容层、路由、构建管线只有一起改才能 typecheck/构建；"只迁列表页"的中间态确实能构建，但部署上去详情页全 404，不是可发布状态。硬拆只会得到 4 个历史上并不存在的 commit。
2. **新增 `html_handling = "drop-trailing-slash"`。** §9 漏了这条：Workers 静态资源默认把 `/posts` 307 到 `/posts/`，等于全站规范 URL 变成尾斜杠版。
3. **CI 不需要构建变量。** 生产 API URL 一直是 `next.config.mjs` 里的硬编码常量（`wrangler.toml` 的 `[vars]` 对静态导出是死配置），`vite.config.ts` 原样照搬。§9「必须重配 `PSN_API_URL` / `STEAM_API_URL`」作废，也就不存在漏配后静默降级。
4. **顺带修了 §12 之外两处：** 分页边界不再渲染 `href="/posts/0"` 这种死链（改为非链接的 `span`）；MDX 锚点转发 `aria-hidden` / `tabIndex`，标题旁的自动锚点不再是无名字链接。
5. **日期改成构建时格式化。** 原来 `dayjs(date).format()` 在构建机和访客两端各算一次时区，UTC 以西的访客 hydration 时会看到日期跳变；现在按东八区在 `velite.config.ts` 里一次算死。
6. **补了 `public/_headers`。** Workers 静态资源默认对一切返回 `max-age=0, must-revalidate`，而 Pages 给哈希资源 `max-age=14400`。不补规则等于每个带哈希的 JS/CSS 每次访问都要回源确认；现在 `/assets/*` 是 `max-age=31536000, immutable`，比现网更好，其余路径保持默认。

### 未完成

- **域名切换**：需要 `wrangler login`（本机 token 已过期）后 `pnpm deploy`、挂自定义域、打开 Workers Builds，再关 Pages 自动部署。代码侧已就绪，`wrangler deploy --dry-run` 通过。
