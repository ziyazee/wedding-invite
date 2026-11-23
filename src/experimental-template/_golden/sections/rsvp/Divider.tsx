import type { SectionProps } from '../../core'
import { useDrawOnScroll } from '../../core'

/** RSVP divider: a hairline strung with beads and a centre knot. */
export default function RsvpDivider({ ctx }: SectionProps) {
  const ref = useDrawOnScroll<HTMLDivElement>(ctx)
  return (
    <div ref={ref} className="gd-divider" aria-hidden="true">
      <svg width="240" height="24" viewBox="0 0 240 24">
        <path className="gd-draw" pathLength="1" d="M0 12 H100 M140 12 H240" />
        <path className="gd-draw" pathLength="1" d="M120 4 C128 4 136 8 136 12 C136 16 128 20 120 20 C112 20 104 16 104 12 C104 8 112 4 120 4Z" />
        <circle className="gd-fill-gold" cx="120" cy="12" r="2" />
        <circle className="gd-fill-gold" cx="30" cy="12" r="1.5" />
        <circle className="gd-fill-gold" cx="60" cy="12" r="1.5" />
        <circle className="gd-fill-gold" cx="180" cy="12" r="1.5" />
        <circle className="gd-fill-gold" cx="210" cy="12" r="1.5" />
      </svg>
    </div>
  )
}
