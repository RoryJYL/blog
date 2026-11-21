import type { ComponentType } from 'react'
import * as runtime from 'react/jsx-runtime'
import { mdxComponents } from '@/app/components/markdown-components/mdx-components'

type MDXComponent = ComponentType<{
  components?: Record<string, unknown>
}>

const cache = new Map<string, MDXComponent>()

/**
 * 把 velite 生成的 `s.mdx()` function-body 字符串变成组件。
 *
 * 和 `next-contentlayer/hooks` 的 `useMDXComponent` 是同一套机制：
 * 生成的代码从 `arguments[0]` 取 `{ Fragment, jsx, jsxs }`。
 * 缓存函数体编译结果，列表页重复渲染同一条内容时不重复 `new Function`。
 */
function compile(code: string): MDXComponent {
  const cached = cache.get(code)
  if (cached) return cached

  const Component = (
    new Function(code) as (scope: typeof runtime) => { default: MDXComponent }
  )({ ...runtime }).default

  cache.set(code, Component)
  return Component
}

export function MDXContent({ code }: { code: string }) {
  const Component = compile(code)
  return <Component components={mdxComponents} />
}
