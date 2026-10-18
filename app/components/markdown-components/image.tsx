import Zoom from 'react-medium-image-zoom'
import 'react-medium-image-zoom/dist/styles.css'

export function ImageZoom({ src, alt }: { src?: string; alt?: string }) {
  return (
    <Zoom>
      {/* biome-ignore lint/performance/noImgElement: markdown 图片为任意外部 URL，无法预知尺寸，next/image 不适用 */}
      <img src={src} alt={alt} />
    </Zoom>
  )
}
