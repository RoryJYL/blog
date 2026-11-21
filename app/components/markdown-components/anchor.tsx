type AnchorProps = React.ComponentProps<'a'>

/**
 * MDX 里的 `<a>`。
 *
 * 必须把其余属性转发下去：rehype-autolink-headings 给标题后面那个锚点加了
 * `aria-hidden` 和 `tabIndex={-1}`，丢掉它们就会变成一堆没有可访问名字的空链接。
 */
export function Anchor({ href, children, ...rest }: AnchorProps) {
  const isExternal = href?.startsWith('http')

  return (
    <a
      {...rest}
      href={href}
      target={isExternal ? '_blank' : rest.target}
      rel={isExternal ? 'noreferrer' : rest.rel}
    >
      {children}
    </a>
  )
}
