import type { SectionProps } from '../../core'
import { useDrawOnScroll } from '../../core'

/** Countdown divider: a muqarnas drop. Stepped honeycomb tiers narrow toward a single point,
 *  the way the cells of a ceiling vault corbel inward, with a hairline plumb to a small pearl. */
export default function CountdownDivider({ ctx }: SectionProps) {
  const ref = useDrawOnScroll<HTMLDivElement>(ctx)
  return (
    <div ref={ref} className="mr-divider" aria-hidden="true">
      <svg width="260" height="36" viewBox="0 0 260 36">
        <path className="mr-draw" pathLength="1" d="M0 6 H84" />
        <path className="mr-draw" pathLength="1" d="M176 6 H260" />
        <path className="mr-draw" pathLength="1" d="M94 6 H166 L158 12 H102 Z" />
        <path className="mr-draw" pathLength="1" d="M106 12 L114 12 L110 19 Z M118 12 H142 L130 19 Z M146 12 H154 L150 19 Z" />
        <path className="mr-draw" pathLength="1" d="M112 19 H148 L140 25 H120 Z" />
        <path className="mr-draw" pathLength="1" d="M122 25 H138 L130 31 Z" />
        <circle className="mr-fill-gold" cx="130" cy="33" r="2" />
      </svg>
    </div>
  )
}
