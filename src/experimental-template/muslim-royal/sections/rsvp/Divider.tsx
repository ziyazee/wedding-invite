import type { SectionProps } from '../../core'
import { useDrawOnScroll } from '../../core'

/** RSVP divider: a rub el hizb. Two squares make the eight-point star inside a ring, with
 *  a small hilal either side, drawn out from the centre like the marker in a Quran margin. */
export default function RsvpDivider({ ctx }: SectionProps) {
  const ref = useDrawOnScroll<HTMLDivElement>(ctx)
  return (
    <div ref={ref} className="mr-divider" aria-hidden="true">
      <svg width="260" height="40" viewBox="0 0 260 40">
        <path className="mr-draw" pathLength="1" d="M0 20 H76 M184 20 H260" />
        <circle className="mr-draw" pathLength="1" cx="130" cy="20" r="18" />
        <path className="mr-draw" pathLength="1" d="M130 7 L137 13 L143 20 L137 27 L130 33 L123 27 L117 20 L123 13 Z" />
        <path className="mr-draw" pathLength="1" d="M119.8 9.8 H140.2 V30.2 H119.8 Z" />
        <path className="mr-draw" pathLength="1" d="M96 14 C90 14 86 18 86 22 C86 26 90 30 96 30 C92 27 92 17 96 14 Z" />
        <path className="mr-draw" pathLength="1" d="M164 14 C170 14 174 18 174 22 C174 26 170 30 164 30 C168 27 168 17 164 14 Z" />
        <circle className="mr-fill-gold" cx="130" cy="20" r="2" />
      </svg>
    </div>
  )
}
