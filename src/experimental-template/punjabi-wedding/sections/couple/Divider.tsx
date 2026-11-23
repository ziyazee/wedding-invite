import type { SectionProps } from '../../core'
import { useDrawOnScroll } from '../../core'

/** Couple divider: a kalire, the bridal dome with a pearl drop, flanked by stitched lines. */
export default function CoupleDivider({ ctx }: SectionProps) {
  const ref = useDrawOnScroll<HTMLDivElement>(ctx)
  return (
    <div ref={ref} className="pb-divider" aria-hidden="true">
      <svg width="260" height="84" viewBox="0 0 260 84">
        <path className="pb-draw" pathLength="1" d="M10 22 H92" />
        <path className="pb-draw" pathLength="1" d="M168 22 H250" />
        {/* dome */}
        <path className="pb-draw" pathLength="1" d="M104 40 C104 24 114 12 130 4 C146 12 156 24 156 40 C148 35 139 36 130 40 C121 36 112 35 104 40Z" />
        <path className="pb-draw" pathLength="1" d="M117 38 C117 28 122 21 130 15 C138 21 143 28 143 38" />
        <path className="pb-draw" pathLength="1" d="M130 2 V4" />
        {/* hanging pearl strands */}
        <path className="pb-draw" pathLength="1" d="M112 40 V58 M121 41 V66 M130 40 V76 M139 41 V66 M148 40 V58" />
        <circle className="pb-fill-gold" cx="112" cy="61" r="2" />
        <circle className="pb-fill-gold" cx="121" cy="69" r="2" />
        <circle className="pb-fill-gold" cx="130" cy="79" r="2.6" />
        <circle className="pb-fill-gold" cx="139" cy="69" r="2" />
        <circle className="pb-fill-gold" cx="148" cy="61" r="2" />
        <circle className="pb-fill-gold" cx="92" cy="22" r="2" />
        <circle className="pb-fill-gold" cx="168" cy="22" r="2" />
      </svg>
    </div>
  )
}
