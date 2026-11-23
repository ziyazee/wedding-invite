import type { SectionProps } from '../../core'
import { useDrawOnScroll } from '../../core'

/** Celebrations divider: a gopuram silhouette, stepped tiers under a barrel roof and kalasam. */
export default function CelebrationsDivider({ ctx }: SectionProps) {
  const ref = useDrawOnScroll<HTMLDivElement>(ctx)
  return (
    <div ref={ref} className="tm-divider" aria-hidden="true">
      <svg width="260" height="48" viewBox="0 0 260 48">
        <path className="tm-draw" pathLength="1" d="M10 42 H92 M168 42 H250" />
        <path className="tm-draw" pathLength="1" d="M96 42 L101 33 H159 L164 42Z" />
        <path className="tm-draw" pathLength="1" d="M104 33 L108 25 H152 L156 33" />
        <path className="tm-draw" pathLength="1" d="M111 25 L115 18 H145 L149 25" />
        <path className="tm-draw" pathLength="1" d="M118 18 C118 12 124 9 130 9 C136 9 142 12 142 18" />
        <path className="tm-draw" pathLength="1" d="M130 9 V3" />
        <path className="tm-draw" pathLength="1" d="M113 33 V42 M130 33 V42 M147 33 V42" style={{ opacity: 0.55 }} />
        <circle className="tm-fill-gold" cx="130" cy="2" r="1.6" />
      </svg>
    </div>
  )
}
