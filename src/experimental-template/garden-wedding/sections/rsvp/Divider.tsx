import type { SectionProps } from '../../core'
import { useDrawOnScroll } from '../../core'

/** RSVP divider: a lit diya between two sprigs, the welcome lamp at the garden gate. */
export default function RsvpDivider({ ctx }: SectionProps) {
  const ref = useDrawOnScroll<HTMLDivElement>(ctx)
  return (
    <div ref={ref} className="gw-divider" aria-hidden="true">
      <svg width="260" height="42" viewBox="0 0 260 42">
        <path className="gw-draw" pathLength="1" d="M0 28 C30 28 50 22 76 26 M76 26 C70 18 74 12 82 10 C84 18 82 24 76 26" />
        <path className="gw-draw" pathLength="1" d="M260 28 C230 28 210 22 184 26 M184 26 C190 18 186 12 178 10 C176 18 178 24 184 26" />
        <path className="gw-draw" pathLength="1" d="M108 24 C108 33 117 37 130 37 C143 37 152 33 152 24 Z" />
        <path className="gw-draw" pathLength="1" d="M130 22 C122 14 127 8 130 2 C133 8 138 14 130 22Z" />
        <circle className="gw-fill-gold" cx="130" cy="16" r="1.6" />
      </svg>
    </div>
  )
}
