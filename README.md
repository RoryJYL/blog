# blog

https://blog.rorytech.com —— Rory 的个人博客。纯静态站点，没有运行时服务端。

## 技术栈

| 层     | 选型                                                                                        |
| ------ | ------------------------------------------------------------------------------------------- |
| 框架   | [React Router](https://reactrouter.com/) 8（framework mode，`ssr: false` + 全量 prerender） |
| 构建   | Vite 7                                                                                      |
| 内容层 | [Velite](https://velite.js.org/)（`content/` 下的 MDX）                                     |
| 样式   | Tailwind CSS 4（`@tailwindcss/vite`）                                                       |
| 托管   | Cloudflare Workers Static Assets                                                            |

## 命令

```bash
pnpm dev       # velite watch + vite dev（http://localhost:5173）
pnpm build     # velite → react-router build → 生成 atom/sitemap/404
pnpm preview   # 用 wrangler 在本地跑真实产物（http://localhost:8787）
pnpm deploy    # wrangler deploy
pnpm typecheck # react-router typegen + tsc --noEmit
```

`pnpm dev` 默认连本地游戏 API（`localhost:8787` / `localhost:8788`）；
`pnpm dev:remote` 直接连线上 Worker。

## 结构

```
app/
├─ root.tsx            # html/head/body + Provider + Header/Footer
├─ routes.ts           # 路由表
└─ routes/             # 每个路由一个模块
content/               # MDX 原文，posts/ 与 thoughts/
lib/
├─ content.ts          # 内容查询（按日期排序、分页、相邻导航）
├─ routes-manifest.ts  # prerender 路径清单
├─ mdx.tsx             # MDX function-body → React 组件
└─ content-helpers.ts  # TOC / 摘要 / 阅读时长 / 封面图
scripts/gen-static.mjs # atom.xml、sitemap.xml、404.html
```

## 构建期约定

- **日期**：frontmatter 里的挂钟时间按东八区渲染成 `YYYY-MM-DD`，见 `velite.config.ts`。日期在构建时格式化，客户端不再做时区换算。
- **URL**：索引页是规范路径（`/posts`、`/thoughts`），`/posts/1`、`/thoughts/1` 由 `public/_redirects` 301 过去。
- **404**：`not_found_handling = "404-page"` 由边缘返回真 404 状态码，页面本体来自 prerender 出的 `404.html`。
- **静态文件**：`atom.xml` / `sitemap.xml` / `404.html` 由 `scripts/gen-static.mjs` 生成，不走路由。
