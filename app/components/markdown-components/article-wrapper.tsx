import { cn } from '@/lib/tailwind-utils'

export function ArticleWrapper({ children }: React.PropsWithChildren) {
  return (
    <div
      className={cn(
        'prose prose-slate dark:prose-invert max-w-none',
        'prose-a:transition-opacity hover:prose-a:opacity-75 dark:hover:prose-a:opacity-85',
      )}
    >
      {children}
    </div>
  )
}
