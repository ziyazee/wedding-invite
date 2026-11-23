import type { SectionProps } from '../../core'
import { useDrawOnScroll } from '../../core'

/** Couple divider: a rail of counted-stitch chevrons (the phulkari border step), darned in
 *  one run of floss that doubles back on itself like a real running stitch. */
export default function CoupleDivider({ ctx }: SectionProps) {
  const ref = useDrawOnScroll<HTMLDivElement>(ctx)
  return (
    <div ref={ref} className="ph-divider" aria-hidden="true">
      <svg width="260" height="36" viewBox="0 0 260 36">
        <path className="ph-draw" pathLength="1" d="M6 18 H70" />
        <path className="ph-draw" pathLength="1" d="M190 18 H254" />
        <path className="ph-draw" pathLength="1" d="M82 18 L90 10 L98 18 L106 10 L114 18" />
        <path className="ph-draw" pathLength="1" d="M146 18 L154 10 L162 18 L170 10 L178 18" />
        <path className="ph-draw" pathLength="1" d="M82 18 L90 26 L98 18 L106 26 L114 18" />
        <path className="ph-draw" pathLength="1" d="M146 18 L154 26 L162 18 L170 26 L178 18" />
        <path className="ph-draw" pathLength="1" d="M130 6 L142 18 L130 30 L118 18 Z" />
        <rect className="ph-fill-gold" x="128" y="16" width="4" height="4" />
      </svg>
    </div>
  )
}
