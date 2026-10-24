/** ISO 8601 duration（PT228H56M33S）→ 人话。PlayStation 用它 */
export function formatIsoDuration(iso: string): string {
  const match = iso.match(/^P(?:(\d+)D)?(?:T(?:(\d+)H)?(?:(\d+)M)?)?/)
  const days = Number(match?.[1] ?? 0)
  const hours = Number(match?.[2] ?? 0)
  const minutes = Number(match?.[3] ?? 0)

  const totalHours = days * 24 + hours
  if (totalHours > 0) return `${totalHours} 小时`
  if (minutes > 0) return `${minutes} 分钟`
  return '不到 1 分钟'
}

/** 累计分钟数 → 人话。Steam 用它 */
export function formatPlaytimeMinutes(minutes: number): string {
  const totalHours = Math.floor(minutes / 60)
  if (totalHours > 0) return `${totalHours} 小时`
  if (minutes > 0) return `${minutes} 分钟`
  return '不到 1 分钟'
}
