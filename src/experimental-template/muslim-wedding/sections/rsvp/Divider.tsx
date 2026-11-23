import type { SectionProps } from '../../core'
import { useDrawOnScroll } from '../../core'

/** A garden rose seen from above: a spiral of petals, drawn as one stroke, centred on x. */
const rose = (x: number) =>
  `M${x} 16 C${x - 3} 16 ${x - 4} 13 ${x - 2} 12 C${x} 11 ${x + 2} 12 ${x + 2} 14.5 C${x + 2} 18 ${x - 1} 19.5 ${x - 4} 18.5 C${x - 7.5} 17.4 ${x - 8.5} 13 ${x - 6.5} 10.5 C${x - 4} 7.5 ${x + 1} 7 ${x + 4.5} 9.5 C${x + 8.5} 12.5 ${x + 8.5} 18 ${x + 5} 21.5`

/** RSVP divider: a rose vine. Three roses on a gently waving stem, with paired leaves and pearl beads. */
export default function RsvpDivider({ ctx }: SectionProps) {
  const ref = useDrawOnScroll<HTMLDivElement>(ctx)
  return (
    <div ref={ref} className="mw-divider" aria-hidden="true">
      <svg width="260" height="40" viewBox="0 0 260 40">
        <path className="mw-draw" pathLength="1" d="M0 16 C20 10 34 22 54 16 C70 11 80 16 88 16 M172 16 C180 16 190 11 206 16 C226 22 240 10 260 16" />
        <path className="mw-draw" pathLength="1" d={rose(130)} />
        <path className="mw-draw" pathLength="1" d={rose(70)} transform="translate(0 4) scale(0.8) translate(17.5 0)" />
        <path className="mw-draw" pathLength="1" d={rose(190)} transform="translate(0 4) scale(0.8) translate(47.5 0)" />
        {[28, 102, 158, 232].map((x) => (
          <path key={x} className="mw-draw" pathLength="1" d={`M${x} 16 C${x - 4} 8 ${x - 10} 8 ${x - 12} 12 C${x - 8} 15 ${x - 3} 15 ${x} 16 M${x} 16 C${x + 4} 24 ${x + 10} 24 ${x + 12} 20 C${x + 8} 17 ${x + 3} 17 ${x} 16`} />
        ))}
        {[10, 46, 214, 250].map((x) => (
          <circle key={x} className="mw-fill-gold" cx={x} cy={x < 130 ? 14.5 : 15} r="1.5" />
        ))}
        <path className="mw-draw" pathLength="1" d="M4 34 H256" style={{ opacity: 0.35 }} />
      </svg>
    </div>
  )
}
