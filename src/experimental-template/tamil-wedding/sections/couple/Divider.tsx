import type { SectionProps } from '../../core'
import { useDrawOnScroll } from '../../core'

/* Sikku kolam: two out-of-phase waves woven around a row of pulli dots. */
const STEP = 36
const CELLS = 7
const wave = (flip: boolean) => {
  let d = 'M0 16'
  for (let i = 0; i < CELLS; i += 1) {
    const x = i * STEP
    const up = (i % 2 === 0) !== flip
    const y = up ? -2 : 34
    d += ` C${x + 12} ${y} ${x + 24} ${y} ${x + STEP} 16`
  }
  return d
}
const DOTS = Array.from({ length: CELLS }, (_, i) => i * STEP + STEP / 2)

/** Couple divider: a sikku kolam braid, one unbroken line around the dots. */
export default function CoupleDivider({ ctx }: SectionProps) {
  const ref = useDrawOnScroll<HTMLDivElement>(ctx)
  return (
    <div ref={ref} className="tm-divider" aria-hidden="true">
      <svg width={STEP * CELLS} height="32" viewBox={`0 0 ${STEP * CELLS} 32`}>
        <path className="tm-draw" pathLength="1" d={wave(false)} />
        <path className="tm-draw" pathLength="1" d={wave(true)} />
        {DOTS.map((x) => (
          <circle key={x} className="tm-fill-gold" cx={x} cy="16" r="1.7" />
        ))}
      </svg>
    </div>
  )
}
