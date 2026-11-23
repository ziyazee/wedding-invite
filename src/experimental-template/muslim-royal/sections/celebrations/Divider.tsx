import type { SectionProps } from '../../core'
import { useDrawOnScroll } from '../../core'

/** Celebrations divider: a colonnade of cusped arches on a hairline plinth, each arch a pointed
 *  multifoil with a small dome finial, drawn in from the centre outward like a gallery cloister. */
export default function CelebrationsDivider({ ctx }: SectionProps) {
  const ref = useDrawOnScroll<HTMLDivElement>(ctx)
  const arches = [58, 104, 150, 196, 242]
  return (
    <div ref={ref} className="mr-divider" aria-hidden="true">
      <svg width="300" height="46" viewBox="0 0 300 46">
        <path className="mr-draw" pathLength="1" d="M0 40 H300" />
        <path className="mr-draw" pathLength="1" d="M0 6 H300" />
        {arches.map((x) => (
          <g key={x}>
            <path className="mr-draw" pathLength="1" d={`M${x - 14} 40 V22 C${x - 14} 17 ${x - 10} 14 ${x - 7} 13 C${x - 4} 12 ${x - 2} 9 ${x} 7 C${x + 2} 9 ${x + 4} 12 ${x + 7} 13 C${x + 10} 14 ${x + 14} 17 ${x + 14} 22 V40`} />
            <path className="mr-draw" pathLength="1" d={`M${x - 8} 40 V25 C${x - 8} 21 ${x - 4} 19 ${x} 17 C${x + 4} 19 ${x + 8} 21 ${x + 8} 25 V40`} />
            <circle className="mr-fill-gold" cx={x} cy="4" r="1.6" />
          </g>
        ))}
      </svg>
    </div>
  )
}
