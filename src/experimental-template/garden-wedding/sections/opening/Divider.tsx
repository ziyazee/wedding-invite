import type { SectionProps } from '../../core'
import { useDrawOnScroll } from '../../core'

const SWAG = 'M0 8 Q37.5 34 75 8 Q112.5 34 150 8 Q187.5 34 225 8 Q262.5 34 300 8'
const STRANDS = [37.5, 112.5, 187.5, 262.5]
const BEADS = [30, 37, 44, 51]

/** Opening divider: a marigold toran, with jasmine strands and magenta lotus buds hanging from it,
 *  taken from the garlands in the opening film. */
export default function OpeningDivider({ ctx }: SectionProps) {
  const ref = useDrawOnScroll<HTMLDivElement>(ctx)
  return (
    <div ref={ref} className="gw-divider" aria-hidden="true">
      <svg width="300" height="84" viewBox="0 0 300 84">
        <path className="gw-draw" pathLength="1" d={SWAG} />
        <path className="gw-draw" pathLength="1" d={SWAG} transform="translate(0 3)" style={{ opacity: 0.5 }} />
        {STRANDS.map((x) => (
          <g key={x}>
            <path className="gw-draw" pathLength="1" d={`M${x} 22 V58`} />
            {BEADS.map((y) => (
              <circle key={y} className="gw-draw" pathLength="1" cx={x} cy={y} r="2.4" style={{ fill: 'var(--gw-bg-elevated)' }} />
            ))}
            <path
              className="gw-draw"
              pathLength="1"
              d={`M${x} 58 C${x - 7} 64 ${x - 6} 72 ${x} 80 C${x + 6} 72 ${x + 7} 64 ${x} 58Z`}
              style={{ fill: 'var(--gw-rose)', stroke: 'var(--gw-rose)' }}
            />
            <path className="gw-draw" pathLength="1" d={`M${x} 60 C${x - 2} 66 ${x - 2} 72 ${x} 77`} style={{ stroke: 'var(--gw-bg-elevated)', opacity: 0.8 }} />
          </g>
        ))}
        {[75, 150, 225].map((x) => (
          <circle key={x} className="gw-fill-gold" cx={x} cy="8" r="2.4" />
        ))}
      </svg>
    </div>
  )
}
