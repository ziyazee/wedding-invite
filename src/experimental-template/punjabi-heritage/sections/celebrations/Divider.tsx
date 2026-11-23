import type { SectionProps } from '../../core'
import { useDrawOnScroll } from '../../core'

/** Celebrations divider: a toran of hanging kalire — a thread, then scalloped pendants
 *  with tassels, as strung across a doorway before a wedding. */
export default function CelebrationsDivider({ ctx }: SectionProps) {
  const ref = useDrawOnScroll<HTMLDivElement>(ctx)
  const pendants = [40, 90, 140, 190, 240]
  return (
    <div ref={ref} className="ph-divider" aria-hidden="true">
      <svg width="280" height="40" viewBox="0 0 280 40">
        <path className="ph-draw" pathLength="1" d="M0 6 H280" />
        {pendants.map((x) => (
          <g key={x}>
            <path className="ph-draw" pathLength="1" d={`M${x} 6 V12 M${x - 8} 24 C${x - 8} 16 ${x - 4} 12 ${x} 12 C${x + 4} 12 ${x + 8} 16 ${x + 8} 24 Z`} />
            <path className="ph-draw" pathLength="1" d={`M${x} 24 V32`} />
            <circle className="ph-fill-gold" cx={x} cy="34" r="2" />
          </g>
        ))}
      </svg>
    </div>
  )
}
