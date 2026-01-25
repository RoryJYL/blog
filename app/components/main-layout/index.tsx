import { cn } from '@/lib/tailwindUtils'

type MainLayoutProps = {
  left?: React.ReactNode
  main: React.ReactNode
  right?: React.ReactNode
}

export default function MainLayout({ left, main, right }: MainLayoutProps) {
  return (
    <>
      <div
        className={cn(
          'mx-auto px-4 py-6 xl:max-w-7xl md:max-w-5xl md:min-h-[calc(100vh-56px-168px)]',
          'md:grid md:gap-x-4 md:grid-cols-narrow-wide',
          'xl:grid-cols-balanced-wide',
        )}
      >
        <div className="order-0">{main}</div>
        <aside className="-order-1">{left}</aside>
        <aside className="order-1 hidden xl:block">{right}</aside>
      </div>
    </>
  )
}
