import { Card, CardContent } from '@/components/ui/card'

export function PlatformUnavailable({ platform }: { platform: string }) {
  return (
    <Card>
      <CardContent className="py-8 text-center text-sm text-muted-foreground">
        {platform} 数据暂时不可用，请稍后再试。
      </CardContent>
    </Card>
  )
}
