import type { SectionProps } from '../../core'
import { useDrawOnScroll } from '../../core'

/** Opening divider: a khatam chain. Two squares make the eight-point star, with cusped lozenges and
 *  tapering hairlines drawn out from the centre to both sides like inlay set into marble. */
export default function OpeningDivider({ ctx }: SectionProps) {
  const ref = useDrawOnScroll<HTMLDivElement>(ctx)
  return (
    <div ref={ref} className="mr-divider" aria-hidden="true">
      <svg width="300" height="44" viewBox="0 0 300 44">
        <path className="mr-draw" pathLength="1" d="M6 22 H92" />
        <path className="mr-draw" pathLength="1" d="M208 22 H294" />
        <path className="mr-draw" pathLength="1" d="M150 3 L169 22 L150 41 L131 22 Z" />
        <path className="mr-draw" pathLength="1" d="M136.6 8.6 H163.4 V35.4 H136.6 Z" />
        <path className="mr-draw" pathLength="1" d="M150 13 L159 22 L150 31 L141 22 Z" />
        <path className="mr-draw" pathLength="1" d="M104 22 L114 14 L124 22 L114 30 Z" />
        <path className="mr-draw" pathLength="1" d="M176 22 L186 14 L196 22 L186 30 Z" />
        <path className="mr-draw" pathLength="1" d="M92 16 C95 19 95 25 92 28 M208 16 C205 19 205 25 208 28" />
        <circle className="mr-fill-gold" cx="150" cy="22" r="2.4" />
      </svg>
    </div>
  )
}
