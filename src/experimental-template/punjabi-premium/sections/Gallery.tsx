import type { GalleryImage } from '../types'
import { LotusFlower } from '../assets'

interface Props {
  images: GalleryImage[]
}

/**
 * Alternating aspect ratio pattern for visual rhythm:
 * Row 1: portrait, square
 * Row 2: square, portrait
 * Row 3: portrait, square
 */
function getAspectClass(index: number): string {
  // Alternate: even indices get portrait on odd rows, square on even rows
  const row = Math.floor(index / 2)
  const col = index % 2
  if (row % 2 === 0) {
    return col === 0 ? 'pp-gallery__photo--portrait' : 'pp-gallery__photo--square'
  }
  return col === 0 ? 'pp-gallery__photo--square' : 'pp-gallery__photo--portrait'
}

export default function Gallery({ images }: Props) {
  return (
    <section className="pp-gallery" aria-label="Photo gallery">
      <h2 className="pp-gallery__heading">Our Moments</h2>

      <div className="pp-gallery__grid">
        {images.map((img, i) => (
          <div
            key={i}
            className={`pp-gallery__photo ${getAspectClass(i)}`}
          >
            {/* CSS gradient placeholder since we have no real photos */}
            <div className="pp-gallery__placeholder" role="img" aria-label={img.alt} />
          </div>
        ))}
      </div>

      {/* Transition lotus */}
      <div className="pp-gallery__transition-lotus" aria-hidden="true">
        <LotusFlower size={28} />
      </div>
    </section>
  )
}
