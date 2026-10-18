'use client'

import type React from 'react'
import { useEffect, useRef } from 'react'
import hljs from 'highlight.js'

export function Code(props: React.PropsWithChildren<{ className?: string }>) {
  const { children } = props
  if (props.className?.startsWith('language-')) {
    return <CodeBlock className={props.className}>{children}</CodeBlock>
  }
  return <InlineCode>{children}</InlineCode>
}

export function CodeBlock({
  className = '',
  children,
}: React.PropsWithChildren<{ className?: string }>) {
  const codeRef = useRef<HTMLElement>(null)

  useEffect(() => {
    codeRef.current && hljs.highlightElement(codeRef.current)
  }, [])

  return (
    <code ref={codeRef} className={className}>
      {children}
    </code>
  )
}

export function InlineCode({ children }: React.PropsWithChildren) {
  return <code>{children}</code>
}

export function Pre({ children }: React.PropsWithChildren) {
  return <pre className="whitespace-pre-wrap">{children}</pre>
}
