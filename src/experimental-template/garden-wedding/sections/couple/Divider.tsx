import type { SectionProps } from '../../core'
import { useDrawOnScroll } from '../../core'

const PETALS = Array.from({ length: 8 }, (_, i) => i * 45)

/** Couple divider: twin leafy vines meeting at a marigold. */
export default function CoupleDivider({ ctx }: SectionProps) {
  const ref = useDrawOnScroll<HTMLDivElement>(ctx)
  return (
    <div ref={ref} className="gw-divider" aria-hidden="true">
      <svg width="300" height="44" viewBox="0 0 300 44">
        <path className="gw-draw" pathLength="1" d="M0 22 C30 22 42 8 66 8 C84 8 88 20 78 24 C70 27 64 20 70 16 M66 8 C94 8 104 22 124 22" />
        <path className="gw-draw" pathLength="1" d="M300 22 C270 22 258 8 234 8 C216 8 212 20 222 24 C230 27 236 20 230 16 M234 8 C206 8 196 22 176 22" />
        <path className="gw-draw" pathLength="1" d="M40 17 C44 8 52 7 56 10 C52 16 46 18 40 17Z" />
        <path className="gw-draw" pathLength="1" d="M260 17 C256 8 248 7 244 10 C248 16 254 18 260 17Z" />
        <path className="gw-draw" pathLength="1" d="M96 16 C100 28 108 32 114 30 C112 22 104 17 96 16Z" />
        <path className="gw-draw" pathLength="1" d="M204 16 C200 28 192 32 186 30 C188 22 196 17 204 16Z" />
        {PETALS.map((a) => (
          <ellipse key={a} className="gw-draw" pathLength="1" cx="150" cy="14" rx="2.8" ry="6" transform={`rotate(${a} 150 22)`} />
        ))}
        <circle className="gw-fill-gold" cx="150" cy="22" r="2.6" />
      </svg>
    </div>
  )
}
