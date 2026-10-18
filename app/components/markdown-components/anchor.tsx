export function Anchor({
  href,
  children,
}: {
  href?: string
  children?: React.ReactNode
}) {
  const isExternal = href?.startsWith('http')

  return (
    <a href={href} target={isExternal ? '_blank' : undefined}>
      {children}
    </a>
  )
}
