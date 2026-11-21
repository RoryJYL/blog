import { fileURLToPath } from 'node:url'
import { reactRouter } from '@react-router/dev/vite'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'
import svgr from 'vite-plugin-svgr'

const root = fileURLToPath(new URL('.', import.meta.url))

const API_URLS = {
  local: {
    PSN: 'http://localhost:8787',
    STEAM: 'http://localhost:8788',
  },
  remote: {
    PSN: 'https://playstation-network-api.fw45rqnzhz.workers.dev',
    STEAM: 'https://steam-api.fw45rqnzhz.workers.dev',
  },
}

export default defineConfig(({ mode }) => {
  const isDev = mode === 'development'
  // 开发环境默认调用本地 API；GAMER_API_SOURCE=remote（或 pnpm dev:remote）直接用线上 Worker
  const apiSource = isDev ? (process.env.GAMER_API_SOURCE ?? 'local') : 'remote'

  if (!(apiSource in API_URLS)) {
    throw new Error(
      `GAMER_API_SOURCE 只能是 local 或 remote，当前值：${apiSource}`,
    )
  }

  const apiUrls = API_URLS[apiSource as keyof typeof API_URLS]

  return {
    plugins: [tailwindcss(), reactRouter(), svgr()],
    resolve: {
      alias: {
        '@': root,
        '@app': `${root}app`,
      },
    },
    define: {
      // 构建期常量，不是运行时配置
      'process.env.PSN_API_URL': JSON.stringify(apiUrls.PSN),
      'process.env.STEAM_API_URL': JSON.stringify(apiUrls.STEAM),
    },
  }
})
