// hooks/useActiveSection.ts
import { useEffect, useMemo, useState } from 'react'

export type TocItem = { depth: number; value: string; slug: string }

type Options = {
  topLine?: number // 0~1，默认 0.2
  depths?: number[] // 参与切分 section 的标题层级，默认 [2,3]
  highlightBeforeFirst?: boolean // 20% 线在第一个标题上方时是否高亮第一个标题，默认 false
}

export function useActiveSection(items: TocItem[], opts: Options = {}) {
  const topLine = opts.topLine ?? 0.2
  const acceptDepths = useMemo(
    () => new Set(opts.depths ?? [2, 3]),
    [opts.depths],
  )
  const highlightBeforeFirst = opts.highlightBeforeFirst ?? false

  const [activeId, setActiveId] = useState<string>('')

  useEffect(() => {
    const heads = items
      .filter((i) => acceptDepths.has(i.depth))
      .map((i) => document.getElementById(i.slug))
      .filter(Boolean) as HTMLElement[]

    if (!heads.length) {
      setActiveId('')
      return
    }

    const pickActive = () => {
      const y = window.innerHeight * topLine

      const rects = heads.map((h) => ({
        id: h.id,
        top: h.getBoundingClientRect().top,
      }))

      // 文章底部用于最后一个 section 的 end
      const article = document.querySelector('article') as HTMLElement | null
      const articleBottom = article
        ? article.getBoundingClientRect().bottom
        : document.documentElement.getBoundingClientRect().bottom

      // 1) 在第一个标题之上：根据选项决定是否高亮
      if (y < rects[0].top) {
        setActiveId(highlightBeforeFirst ? rects[0].id : '')
        return
      }

      // 2) 命中某个 [start, end) 区间
      for (let i = 0; i < rects.length; i++) {
        const start = rects[i].top
        const end = i < rects.length - 1 ? rects[i + 1].top : articleBottom
        if (start <= y && y < end) {
          setActiveId(rects[i].id)
          return
        }
      }

      // 3) 超过最后一个标题之下：高亮最后一个
      setActiveId(rects[rects.length - 1].id)
    }

    let ticking = false
    const onScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(() => {
        pickActive()
        ticking = false
      })
    }

    pickActive()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)

    const imgs = Array.from(document.images)
    const offs: Array<() => void> = []
    for (const img of imgs) {
      if (!img.complete) {
        const fn = () => onScroll()
        img.addEventListener('load', fn, { once: true })
        offs.push(() => img.removeEventListener('load', fn))
      }
    }

    let ro: ResizeObserver | null = null
    const articleEl = document.querySelector('article')
    if (articleEl && 'ResizeObserver' in window) {
      ro = new ResizeObserver(() => onScroll())
      ro.observe(articleEl)
    }

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      for (const off of offs) {
        off()
      }
      ro?.disconnect()
    }
  }, [items, topLine, acceptDepths, highlightBeforeFirst])

  return activeId
}
