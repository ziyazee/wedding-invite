import type { SectionProps } from '../../core'
import { useDrawOnScroll } from '../../core'

/** Opening divider: a phulkari "bagh" chain. Counted-stitch diamonds, 45 and 90 degrees only,
 *  stitched out from a centre motif to both sides as if darned in floss silk. */
export default function OpeningDivider({ ctx }: SectionProps) {
  const ref = useDrawOnScroll<HTMLDivElement>(ctx)
  return (
    <div ref={ref} className="ph-divider" aria-hidden="true">
      <svg width="280" height="40" viewBox="0 0 280 40">
        <path className="ph-draw" pathLength="1" d="M8 20 H96" />
        <path className="ph-draw" pathLength="1" d="M184 20 H272" />
        <path className="ph-draw" pathLength="1" d="M140 4 L156 20 L140 36 L124 20 Z" />
        <path className="ph-draw" pathLength="1" d="M140 12 L148 20 L140 28 L132 20 Z" />
        <path className="ph-draw" pathLength="1" d="M110 20 L118 12 L126 20 L118 28 Z" />
        <path className="ph-draw" pathLength="1" d="M154 20 L162 12 L170 20 L162 28 Z" />
        <path className="ph-draw" pathLength="1" d="M96 14 V26 M184 14 V26" />
        <rect className="ph-fill-gold" x="138" y="18" width="4" height="4" />
      </svg>
    </div>
  )
}
