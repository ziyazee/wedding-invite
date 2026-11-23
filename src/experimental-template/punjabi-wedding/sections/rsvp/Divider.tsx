import type { SectionProps } from '../../core'
import { useDrawOnScroll } from '../../core'

/** RSVP divider: a domed palki pavilion in silhouette on a running line. */
export default function RsvpDivider({ ctx }: SectionProps) {
  const ref = useDrawOnScroll<HTMLDivElement>(ctx)
  return (
    <div ref={ref} className="pb-divider" aria-hidden="true">
      <svg width="260" height="72" viewBox="0 0 260 72">
        <path className="pb-draw" pathLength="1" d="M10 62 H98 M162 62 H250" />
        {/* finial + dome */}
        <path className="pb-draw" pathLength="1" d="M130 2 V8" />
        <path className="pb-draw" pathLength="1" d="M102 30 C102 18 114 10 130 8 C146 10 158 18 158 30 Z" />
        {/* pillars and plinth */}
        <path className="pb-draw" pathLength="1" d="M106 30 V62 M154 30 V62 M98 62 H162" />
        {/* cusped arch inside */}
        <path className="pb-draw" pathLength="1" d="M114 62 V46 C114 38 120 34 124 34 C126 31 134 31 136 34 C140 34 146 38 146 46 V62" />
        <circle className="pb-fill-gold" cx="130" cy="2" r="2" />
        <circle className="pb-fill-gold" cx="10" cy="62" r="2" />
        <circle className="pb-fill-gold" cx="250" cy="62" r="2" />
      </svg>
    </div>
  )
}
