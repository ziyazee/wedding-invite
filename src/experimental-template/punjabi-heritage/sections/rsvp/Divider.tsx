import type { SectionProps } from '../../core'
import { useDrawOnScroll } from '../../core'

/** RSVP divider: a charkha wheel, the spinning-wheel craft sign of Punjabi homes. The rim
 *  is two concentric rings with eight stitched spokes, threaded to a hairline. */
export default function RsvpDivider({ ctx }: SectionProps) {
  const ref = useDrawOnScroll<HTMLDivElement>(ctx)
  return (
    <div ref={ref} className="ph-divider" aria-hidden="true">
      <svg width="240" height="36" viewBox="0 0 240 36">
        <path className="ph-draw" pathLength="1" d="M0 18 H92 M148 18 H240" />
        <circle className="ph-draw" pathLength="1" cx="120" cy="18" r="16" />
        <circle className="ph-draw" pathLength="1" cx="120" cy="18" r="8" />
        <path className="ph-draw" pathLength="1" d="M120 2 V34 M104 18 H136 M108.7 6.7 L131.3 29.3 M131.3 6.7 L108.7 29.3" />
        <circle className="ph-fill-gold" cx="120" cy="18" r="2" />
      </svg>
    </div>
  )
}
