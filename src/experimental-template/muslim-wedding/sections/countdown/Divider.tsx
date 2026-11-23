import type { SectionProps } from '../../core'
import { useDrawOnScroll } from '../../core'
import { khatam } from '../khatam'

const STARS = [44, 94, 144, 194].map((x) => ({ x, k: khatam(x + 20, 20, 13) }))

/** Countdown divider: a girih chain. Four khatam stars joined by lattice diamonds on two hairlines. */
export default function CountdownDivider({ ctx }: SectionProps) {
  const ref = useDrawOnScroll<HTMLDivElement>(ctx)
  return (
    <div ref={ref} className="mw-divider" aria-hidden="true">
      <svg width="260" height="40" viewBox="0 0 260 40">
        <path className="mw-draw" pathLength="1" d="M0 20 H27 M233 20 H260" />
        {STARS.map(({ x, k }) => (
          <g key={x}>
            <path className="mw-draw" pathLength="1" d={k.star} />
            <path className="mw-draw" pathLength="1" d={k.upright} style={{ opacity: 0.5 }} />
            <circle className="mw-fill-gold" cx={x + 20} cy="20" r="1.8" />
          </g>
        ))}
        {[89, 139, 189].map((x) => (
          <path key={x} className="mw-draw" pathLength="1" d={`M${x - 8} 20 L${x} 14 L${x + 8} 20 L${x} 26 Z M${x - 25} 20 H${x - 8} M${x + 8} 20 H${x + 25}`} />
        ))}
        <path className="mw-draw" pathLength="1" d="M20 6 H240 M20 34 H240" style={{ opacity: 0.35 }} />
      </svg>
    </div>
  )
}
