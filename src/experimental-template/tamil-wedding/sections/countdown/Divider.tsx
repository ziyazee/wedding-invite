import type { SectionProps } from '../../core'
import { useDrawOnScroll } from '../../core'

/* Padi kolam border: stepped temple-tooth pyramids on a base line. */
const tooth = (x: number) => `M${x} 24 V19 H${x + 8} V14 H${x + 16} V9 H${x + 24} V14 H${x + 32} V19 H${x + 40} V24`
const TEETH = [0, 56, 112, 168]

/** Countdown divider: a row of stepped padi-kolam teeth. */
export default function CountdownDivider({ ctx }: SectionProps) {
  const ref = useDrawOnScroll<HTMLDivElement>(ctx)
  return (
    <div ref={ref} className="tm-divider" aria-hidden="true">
      <svg width="248" height="30" viewBox="0 0 248 30">
        <path className="tm-draw" pathLength="1" d="M0 24 H248" />
        {TEETH.map((x) => (
          <path key={x} className="tm-draw" pathLength="1" d={tooth(x + 8)} />
        ))}
        {TEETH.map((x) => (
          <circle key={x} className="tm-fill-gold" cx={x + 8 + 20} cy="5" r="1.4" />
        ))}
      </svg>
    </div>
  )
}
