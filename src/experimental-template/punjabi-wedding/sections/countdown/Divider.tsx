import type { SectionProps } from '../../core'
import { useDrawOnScroll } from '../../core'

const PEARLS: Array<[number, number]> = [
  [43, 13.6], [70, 26], [97, 38.4], [163, 38.4], [190, 26], [217, 13.6],
]

/** Countdown divider: a pearl ladi swag with a tassel drop at the centre. */
export default function CountdownDivider({ ctx }: SectionProps) {
  const ref = useDrawOnScroll<HTMLDivElement>(ctx)
  return (
    <div ref={ref} className="pb-divider" aria-hidden="true">
      <svg width="260" height="76" viewBox="0 0 260 76">
        <path className="pb-draw" pathLength="1" d="M10 8 C60 8 80 44 130 44 C180 44 200 8 250 8" />
        <path className="pb-draw" pathLength="1" d="M130 44 V64" />
        {PEARLS.map(([x, y]) => (
          <circle key={x} className="pb-fill-gold" cx={x} cy={y} r="2.2" />
        ))}
        <circle className="pb-fill-gold" cx="10" cy="8" r="2.6" />
        <circle className="pb-fill-gold" cx="250" cy="8" r="2.6" />
        <circle className="pb-fill-gold" cx="130" cy="44" r="3" />
        <path className="pb-draw" pathLength="1" d="M130 64 C124 68 124 72 130 74 C136 72 136 68 130 64Z" />
      </svg>
    </div>
  )
}
