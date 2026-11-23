import type { SectionProps } from '../../core'
import { useDrawOnScroll } from '../../core'

/** Opening divider: an onion-arch doorway drawn on between hero and body. */
export default function OpeningDivider({ ctx }: SectionProps) {
  const ref = useDrawOnScroll<HTMLDivElement>(ctx)
  return (
    <div ref={ref} className="gd-divider" aria-hidden="true">
      <svg width="260" height="72" viewBox="0 0 260 72">
        <path className="gd-draw" pathLength="1" d="M10 62 H104" />
        <path className="gd-draw" pathLength="1" d="M156 62 H250" />
        <path className="gd-draw" pathLength="1" d="M104 62 C104 36 116 18 130 6 C144 18 156 36 156 62" />
        <path className="gd-draw" pathLength="1" d="M116 62 C116 44 122 30 130 22 C138 30 144 44 144 62" />
        <path className="gd-draw" pathLength="1" d="M130 62 V40" />
        <circle className="gd-fill-gold" cx="130" cy="4" r="2" />
      </svg>
    </div>
  )
}
