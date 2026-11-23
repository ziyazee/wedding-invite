import type { SectionProps } from '../../core'
import { useDrawOnScroll } from '../../core'

/** Countdown divider: a stepped phulkari "pyramid" — counted stitches rising to a single lamp point. */
export default function CountdownDivider({ ctx }: SectionProps) {
  const ref = useDrawOnScroll<HTMLDivElement>(ctx)
  return (
    <div ref={ref} className="ph-divider" aria-hidden="true">
      <svg width="240" height="32" viewBox="0 0 240 32">
        <path className="ph-draw" pathLength="1" d="M0 26 H76" />
        <path className="ph-draw" pathLength="1" d="M164 26 H240" />
        <path className="ph-draw" pathLength="1" d="M88 26 V20 H98 V14 H108 V8 H120 V8 H132 V14 H142 V20 H152 V26 Z" />
        <path className="ph-draw" pathLength="1" d="M120 8 V2" />
        <path className="ph-draw" pathLength="1" d="M108 26 V20 H132 V26" />
        <circle className="ph-fill-gold" cx="120" cy="2" r="2" />
      </svg>
    </div>
  )
}
