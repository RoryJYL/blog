import { withContentlayer } from 'next-contentlayer'
import { setupDevPlatform } from '@cloudflare/next-on-pages/next-dev'

if (process.env.NODE_ENV === 'development') {
  await setupDevPlatform()
}

/**
 * @type {import('next').NextConfig}
 **/
const nextConfig = withContentlayer({
  output: 'export',
  env: {
    PSN_API_URL: 'https://playstation-network-api.fw45rqnzhz.workers.dev',
    // PSN_API_URL: 'http://localhost:8787',
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
