import type { ReactNode } from 'react'
import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from 'react-router'
import { Footer } from '@/app/components/footer'
import { Header } from '@/app/components/header'
import { PlaystationStoreProvider } from '@/components/playstation-store-provider'
import { SteamStoreProvider } from '@/components/steam-store-provider'
import { ThemeProvider, themeInitScript } from '@/components/theme-provider'
import { TooltipProvider } from '@/components/ui/tooltip'
import { pageMeta } from '@/lib/meta'
import './globals.css'

export const meta = () => pageMeta("Rory's blog")

export function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="zh-Hans-CN" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
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

export function ErrorBoundary({ error }: { error: unknown }) {
  const isNotFound = isRouteErrorResponse(error) && error.status === 404

  return (
    <main className="mx-auto px-4 py-24 xl:max-w-7xl md:max-w-5xl text-center">
      <h1 className="text-4xl font-bold mb-4">
        {isNotFound ? '404' : '出错了'}
      </h1>
      <p className="text-muted-foreground mb-8">
        {isNotFound
          ? '这个页面不存在或者已经搬走了。'
          : '页面渲染时遇到了问题。'}
      </p>
      <a href="/" className="underline underline-offset-4">
        返回首页
      </a>
    </main>
  )
}
