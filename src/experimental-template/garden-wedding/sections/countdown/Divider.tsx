import type { SectionProps } from '../../core'
import { useDrawOnScroll } from '../../core'

/** Countdown divider: two mirrored paisleys (keri) either side of a bindi, on a hairline. */
export default function CountdownDivider({ ctx }: SectionProps) {
  const ref = useDrawOnScroll<HTMLDivElement>(ctx)
  const paisley = 'M0 0 C10 -14 28 -14 32 0 C35 12 24 22 12 20 C2 18 -2 8 6 4 C11 2 14 7 10 10'
  return (
    <div ref={ref} className="gw-divider" aria-hidden="true">
      <svg width="280" height="40" viewBox="0 0 280 40">
        <path className="gw-draw" pathLength="1" d="M0 20 H66" />
        <path className="gw-draw" pathLength="1" d="M214 20 H280" />
        <g transform="translate(76 14) rotate(-20)">
          <path className="gw-draw" pathLength="1" d={paisley} />
        </g>
        <g transform="translate(204 14) scale(-1 1) rotate(-20)">
          <path className="gw-draw" pathLength="1" d={paisley} />
        </g>
        <circle className="gw-fill-gold" cx="140" cy="20" r="3" />
        <circle className="gw-draw" pathLength="1" cx="140" cy="20" r="7" />
        <circle className="gw-fill-gold" cx="116" cy="20" r="1.4" />
        <circle className="gw-fill-gold" cx="164" cy="20" r="1.4" />
      </svg>
    </div>
  )
}
