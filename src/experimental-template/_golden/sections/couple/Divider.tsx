import type { SectionProps } from '../../core'
import { useDrawOnScroll } from '../../core'

/** Couple divider: a twin-vine rule with a centre bud. */
export default function CoupleDivider({ ctx }: SectionProps) {
  const ref = useDrawOnScroll<HTMLDivElement>(ctx)
  return (
    <div ref={ref} className="gd-divider" aria-hidden="true">
      <svg width="280" height="40" viewBox="0 0 280 40">
        <path className="gd-draw" pathLength="1" d="M0 20 C30 20 40 6 62 6 C80 6 84 18 74 22 C66 25 60 18 66 14 M62 6 C90 6 100 20 128 20 H132" />
        <path className="gd-draw" pathLength="1" d="M280 20 C250 20 240 6 218 6 C200 6 196 18 206 22 C214 25 220 18 214 14 M218 6 C190 6 180 20 152 20 H148" />
        <path className="gd-draw" pathLength="1" d="M140 8 C146 14 146 26 140 32 C134 26 134 14 140 8Z" />
      </svg>
    </div>
  )
}
