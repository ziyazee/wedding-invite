import type { SectionProps } from '../../core'
import { useDrawOnScroll } from '../../core'
import { khatam } from '../khatam'

const K = khatam(130, 16, 7)

/** Opening divider: a cusped mehrab arch with a khatam at its apex, drawn on between hero and body. */
export default function OpeningDivider({ ctx }: SectionProps) {
  const ref = useDrawOnScroll<HTMLDivElement>(ctx)
  return (
    <div ref={ref} className="mw-divider" aria-hidden="true">
      <svg width="260" height="76" viewBox="0 0 260 76">
        <path className="mw-draw" pathLength="1" d="M10 68 H98" />
        <path className="mw-draw" pathLength="1" d="M162 68 H250" />
        <path className="mw-draw" pathLength="1" d="M98 68 V52 C98 44 104 40 110 36 C118 32 124 28 130 24 C136 28 142 32 150 36 C156 40 162 44 162 52 V68" />
        <path className="mw-draw" pathLength="1" d="M110 68 V54 C110 48 116 44 120 42 C124 40 128 38 130 35 C132 38 136 40 140 42 C144 44 150 48 150 54 V68" />
        <path className="mw-draw" pathLength="1" d={K.star} />
        <circle className="mw-fill-gold" cx="130" cy="16" r="1.6" />
      </svg>
    </div>
  )
}
