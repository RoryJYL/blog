import { setupDevPlatform } from '@cloudflare/next-on-pages/next-dev'
import { withContentlayer } from 'next-contentlayer'

const isDev = process.env.NODE_ENV === 'development'

if (isDev) {
  await setupDevPlatform()
}

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

// 开发环境默认调用本地 API；GAMER_API_SOURCE=remote（或 pnpm dev:remote）直接用线上 Worker
const apiSource = isDev ? (process.env.GAMER_API_SOURCE ?? 'local') : 'remote'

if (!(apiSource in API_URLS)) {
  throw new Error(
    `GAMER_API_SOURCE 只能是 local 或 remote，当前值：${apiSource}`,
  )
}

const apiUrls = API_URLS[apiSource]

/**
 * @type {import('next').NextConfig}
 **/
const nextConfig = withContentlayer({
  output: 'export',
  env: {
    PSN_API_URL: apiUrls.PSN,
    STEAM_API_URL: apiUrls.STEAM,
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.webp.li',
      },
      {
        protocol: 'https',
        hostname: 'psn-rsc.prod.dl.playstation.net',
      },
      {
        protocol: 'http',
        hostname: 'psn-rsc.prod.dl.playstation.net',
      },
      {
        protocol: 'https',
        hostname: 'psnobj.prod.dl.playstation.net',
      },
      {
        protocol: 'https',
        hostname: 'image.api.playstation.com',
      },
      {
        protocol: 'https',
        hostname: '*.steamstatic.com',
      },
      {
        protocol: 'https',
        hostname: 'media.steampowered.com',
      },
    ],
  },
  webpack(config) {
    // 让 import xx.svg 变成 React 组件
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: ['@svgr/webpack'],
    })
    return config
  },
})

export default nextConfig
