import { useRef } from 'react'
import { OrnamentalDivider } from '../assets'

export default function Gallery() {
  const sectionRef = useRef<HTMLElement>(null)

  // Placeholder grid — in production, photos come from data
  const placeholders = [
    { id: 1, type: 'half' as const },
    { id: 2, type: 'half' as const },
    { id: 3, type: 'full' as const },
    { id: 4, type: 'half' as const },
    { id: 5, type: 'half' as const },
    { id: 6, type: 'full' as const },
  ]

  return (
    <section ref={sectionRef} className="tj-gallery">
      {/* Section heading */}
      <div className="tj-section-heading">
        <h2 className="tj-section-heading__text">Our Moments</h2>
        <OrnamentalDivider motif="diamond" width="30%" />
      </div>

      {/* Gallery grid — alternating 2-up / wide pattern */}
      <div className="tj-gallery-grid">
        {placeholders.map((item) => (
          <div
            key={item.id}
            className={`tj-gallery-item tj-gallery-item--${item.type}`}
          >
            {/* Placeholder — real images would use <img> with lazy loading */}
            <div className="tj-gallery-placeholder">
              Photo {item.id}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
