import type { SectionProps } from '../../core'
import { useDrawOnScroll } from '../../core'

/** Celebrations divider: a lotus afloat on a garden pond, with its leaves. */
export default function CelebrationsDivider({ ctx }: SectionProps) {
  const ref = useDrawOnScroll<HTMLDivElement>(ctx)
  return (
    <div ref={ref} className="gw-divider" aria-hidden="true">
      <svg width="260" height="48" viewBox="0 0 260 48">
        <path className="gw-draw" pathLength="1" d="M0 40 H84" />
        <path className="gw-draw" pathLength="1" d="M176 40 H260" />
        <path className="gw-draw" pathLength="1" d="M130 6 C140 16 140 30 130 42 C120 30 120 16 130 6Z" />
        <path className="gw-draw" pathLength="1" d="M130 42 C118 40 108 34 106 22 C116 24 126 31 130 42" />
        <path className="gw-draw" pathLength="1" d="M130 42 C142 40 152 34 154 22 C144 24 134 31 130 42" />
        <path className="gw-draw" pathLength="1" d="M130 42 C114 44 102 40 96 34 C106 32 120 35 130 42" />
        <path className="gw-draw" pathLength="1" d="M130 42 C146 44 158 40 164 34 C154 32 140 35 130 42" />
        <path className="gw-draw" pathLength="1" d="M20 40 C26 30 40 30 46 40 M34 40 V34" style={{ opacity: 0.7 }} />
        <path className="gw-draw" pathLength="1" d="M214 40 C220 30 234 30 240 40 M226 40 V34" style={{ opacity: 0.7 }} />
      </svg>
    </div>
  )
}
