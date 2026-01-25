import { Card } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import {
  getAllCategories,
  getAllTags,
  getTotalPostCount,
} from '@/lib/contentplayer-utils'
import Image from 'next/image'

export function Info() {
  const totalPost = getTotalPostCount()
  const { categories, count: totalCategory } = getAllCategories()
  const { tags, count: totalTag } = getAllTags()

  const contentInfoList = [
    {
      title: '文章',
      count: totalPost,
    },
  ]

  return (
    <>
      {/*  头像和信息 */}
      <Card className="p-6">
        <div className="space-y-2">
          <div className="w-24 h-24 relative rounded-full overflow-hidden mx-auto">
            {/* 头像 */}
            <Image
              className="scale-110 translate-x-[-2px] translate-y-[-3px]"
              src="/avatar-min.webp"
              alt="avatar"
              fill
              sizes="6rem"
            />
          </div>
          <h2 className="text-lg text-center font-medium">Rory</h2>
          <div className="flex items-center space-x-4 h-12 w-fit mx-auto">
            {contentInfoList.map((contentInfo, index) => (
              <>
                <div key={contentInfo.title} className="text-center">
                  <div>{contentInfo.count}</div>
                  <div>{contentInfo.title}</div>
                </div>
                {index < contentInfoList.length - 1 && (
                  <Separator orientation="vertical" />
                )}
              </>
            ))}
          </div>
        </div>
      </Card>
      {/* 分类 */}
      {/* 标签 */}
    </>
  )
}
