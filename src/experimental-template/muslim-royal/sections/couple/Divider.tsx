import type { SectionProps } from '../../core'
import { useDrawOnScroll } from '../../core'

/** Couple divider: a girih rail. Interlaced kite pairs (the bow-tie) strung either side of a
 *  small cusped arch, drawn out from the centre as if inlaid with a fine brass wire. */
export default function CoupleDivider({ ctx }: SectionProps) {
  const ref = useDrawOnScroll<HTMLDivElement>(ctx)
  return (
    <div ref={ref} className="mr-divider" aria-hidden="true">
      <svg width="280" height="40" viewBox="0 0 280 40">
        <path className="mr-draw" pathLength="1" d="M6 20 H62" />
        <path className="mr-draw" pathLength="1" d="M218 20 H274" />
        <path className="mr-draw" pathLength="1" d="M76 20 L66 12 L69 20 L66 28 Z M76 20 L86 12 L83 20 L86 28 Z" />
        <path className="mr-draw" pathLength="1" d="M108 20 L98 12 L101 20 L98 28 Z M108 20 L118 12 L115 20 L118 28 Z" />
        <path className="mr-draw" pathLength="1" d="M172 20 L162 12 L165 20 L162 28 Z M172 20 L182 12 L179 20 L182 28 Z" />
        <path className="mr-draw" pathLength="1" d="M204 20 L194 12 L197 20 L194 28 Z M204 20 L214 12 L211 20 L214 28 Z" />
        <path className="mr-draw" pathLength="1" d="M126 32 V20 C126 14 131 10 134 8 C137 6 140 3 140 3 C140 3 143 6 146 8 C149 10 154 14 154 20 V32" />
        <path className="mr-draw" pathLength="1" d="M133 32 V21 C133 17 137 14 140 12 C143 14 147 17 147 21 V32" />
        <circle className="mr-fill-gold" cx="140" cy="22" r="2" />
      </svg>
    </div>
  )
}
