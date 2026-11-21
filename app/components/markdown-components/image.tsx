import Zoom from 'react-medium-image-zoom'
import 'react-medium-image-zoom/dist/styles.css'

export function ImageZoom({ src, alt }: { src?: string; alt?: string }) {
  return (
    <Zoom>
      <img src={src} alt={alt} loading="lazy" />
    </Zoom>
  )
}
