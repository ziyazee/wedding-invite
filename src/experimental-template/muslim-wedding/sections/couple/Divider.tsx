import type { SectionProps } from '../../core'
import { useDrawOnScroll } from '../../core'

const XS = [28, 68, 108, 148, 188, 228, 268]

/** One cusped (ogee-shouldered) arch standing on the baseline, centred on x. */
const arch = (x: number) =>
  `M${x - 15} 30 V20 C${x - 15} 13 ${x - 8} 11 ${x - 4.5} 6.5 C${x - 2.5} 4 ${x - 1} 2.5 ${x} 0 C${x + 1} 2.5 ${x + 2.5} 4 ${x + 4.5} 6.5 C${x + 8} 11 ${x + 15} 13 ${x + 15} 20 V30`

/** Couple divider: an arcade of seven cusped Deccani arches, each with a pearl in its spandrel. */
export default function CoupleDivider({ ctx }: SectionProps) {
  const ref = useDrawOnScroll<HTMLDivElement>(ctx)
  return (
    <div ref={ref} className="mw-divider" aria-hidden="true">
      <svg width="296" height="42" viewBox="0 0 296 42">
        <path className="mw-draw" pathLength="1" d="M4 30 H292" />
        {XS.map((x) => (
          <path key={x} className="mw-draw" pathLength="1" d={arch(x)} />
        ))}
        {XS.map((x) => (
          <path key={`i${x}`} className="mw-draw" pathLength="1" d={`M${x - 8} 30 V22 C${x - 8} 18 ${x - 3} 17 ${x} 13 C${x + 3} 17 ${x + 8} 18 ${x + 8} 22 V30`} style={{ opacity: 0.55 }} />
        ))}
        {[48, 88, 128, 168, 208, 248].map((x) => (
          <circle key={x} className="mw-fill-gold" cx={x} cy="17" r="1.6" />
        ))}
        <path className="mw-draw" pathLength="1" d="M4 36 H292" style={{ opacity: 0.45 }} />
      </svg>
    </div>
  )
}
