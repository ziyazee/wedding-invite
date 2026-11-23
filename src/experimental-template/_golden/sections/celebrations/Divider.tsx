import type { SectionProps } from '../../core'
import { useDrawOnScroll } from '../../core'

const SCALLOP = `M0 18 ${'q10 -16 20 0 t20 0 '.repeat(7).trim()}`

/** Celebrations divider: a scalloped wave, like water or a mandap valance. */
export default function CelebrationsDivider({ ctx }: SectionProps) {
  const ref = useDrawOnScroll<HTMLDivElement>(ctx)
  return (
    <div ref={ref} className="gd-divider" aria-hidden="true">
      <svg width="280" height="30" viewBox="0 0 280 30">
        <path className="gd-draw" pathLength="1" d={SCALLOP} />
        <path className="gd-draw" pathLength="1" d="M0 26 H280" style={{ opacity: 0.5 }} />
      </svg>
    </div>
  )
}
