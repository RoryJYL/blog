import { ThemeProvider } from '@/components/theme-provider'
import { Header } from '@app/components/header'
import type { Metadata } from 'next'
import { memo } from 'react'
import './globals.css'
import { TooltipProvider } from '@/components/ui/tooltip'
import { Footer } from './components/footer'

export const metadata: Metadata = {
  // 整个站点共用的 metadata
  // viewport: 'width=device-width, initial-scale=1, viewport-fit=cover',
  formatDetection: {
    telephone: false,
  },
  // 默认 title，在 shallow merge 时可被覆盖
  title: "Rory's blog",
}

const LeftHolder = memo(() => (
  <div className="block col-start-1 col-end-1 -order-1 w-0 min-w-0 h-0 max-h-0" />
))

export default function RootLayout({ children }: React.PropsWithChildren) {
  return (
    <html lang="zh-Hans-CN" suppressHydrationWarning>
      <body className="bg-slate-100 dark:bg-zinc-950">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <TooltipProvider delayDuration={300}>
            <Header />
            {children}
            <Footer />
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
