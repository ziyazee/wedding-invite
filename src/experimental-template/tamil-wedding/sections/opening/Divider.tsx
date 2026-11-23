import type { SectionProps } from '../../core'
import { useDrawOnScroll } from '../../core'

/** Opening divider: a thamarai (lotus) in profile, three petals on a water line. */
export default function OpeningDivider({ ctx }: SectionProps) {
  const ref = useDrawOnScroll<HTMLDivElement>(ctx)
  return (
    <div ref={ref} className="tm-divider" aria-hidden="true">
      <svg width="260" height="44" viewBox="0 0 260 44">
        <path className="tm-draw" pathLength="1" d="M10 38 H98 M162 38 H250" />
        <path className="tm-draw" pathLength="1" d="M130 6 C121 17 121 29 130 38 C139 29 139 17 130 6Z" />
        <path className="tm-draw" pathLength="1" d="M130 38 C113 37 104 27 101 17 C114 17 125 26 130 38Z" />
        <path className="tm-draw" pathLength="1" d="M130 38 C147 37 156 27 159 17 C146 17 135 26 130 38Z" />
        <path className="tm-draw" pathLength="1" d="M130 38 C118 40 108 38 100 35 M130 38 C142 40 152 38 160 35" />
        <circle className="tm-fill-gold" cx="130" cy="4" r="1.8" />
      </svg>
    </div>
  )
}
