import type { SectionProps } from '../../core'
import { useDrawOnScroll } from '../../core'

/** A pointed muqarnas cell standing on y, centred on x. */
const cell = (x: number, y: number) =>
  `M${x - 14} ${y} V${y - 5} Q${x - 14} ${y - 11} ${x} ${y - 15} Q${x + 14} ${y - 11} ${x + 14} ${y - 5} V${y}`

const TIERS = [
  { y: 46, xs: [34, 66, 98, 130, 162, 194, 226] },
  { y: 35, xs: [50, 82, 114, 146, 178, 210] },
  { y: 24, xs: [66, 98, 130, 162, 194] },
  { y: 13, xs: [98, 130, 162] },
]

/** Celebrations divider: a muqarnas honeycomb, four tiers of pointed cells stepping up to a centre pearl. */
export default function CelebrationsDivider({ ctx }: SectionProps) {
  const ref = useDrawOnScroll<HTMLDivElement>(ctx)
  return (
    <div ref={ref} className="mw-divider" aria-hidden="true">
      <svg width="260" height="56" viewBox="0 0 260 56">
        <path className="mw-draw" pathLength="1" d="M4 46 H256" />
        {TIERS.map((t) =>
          t.xs.map((x) => <path key={`${t.y}-${x}`} className="mw-draw" pathLength="1" d={cell(x, t.y)} style={{ opacity: 1 - (46 - t.y) / 90 }} />),
        )}
        <circle className="mw-fill-gold" cx="130" cy="4" r="2.2" />
        <path className="mw-draw" pathLength="1" d="M130 6 V9" />
        <path className="mw-draw" pathLength="1" d="M4 52 H256" style={{ opacity: 0.4 }} />
      </svg>
    </div>
  )
}
