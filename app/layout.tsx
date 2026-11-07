import type { Metadata } from 'next'
import { Header } from '@app/components/header'
import { ThemeProvider } from '@/components/theme-provider'
import './globals.css'
import { PlaystationStoreProvider } from '@/components/playstation-store-provider'
import { SteamStoreProvider } from '@/components/steam-store-provider'
import { TooltipProvider } from '@/components/ui/tooltip'
import { Footer } from './components/footer'

export const metadata: Metadata = {
  // 整个站点共用的 metadata
  formatDetection: {
    telephone: false,
  },
  // 默认 title，在 shallow merge 时可被覆盖
  title: "Rory's blog",
  alternates: {
    types: {
      'application/atom+xml': '/atom.xml',
    },
  },
}

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
      </body>
    </html>
  )
}
