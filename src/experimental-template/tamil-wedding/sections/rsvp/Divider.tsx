import type { SectionProps } from '../../core'
import { useDrawOnScroll } from '../../core'

const LEAVES = Array.from({ length: 9 }, (_, i) => 28 + i * 25.5)
const leaf = (x: number) => `M${x} 4 C${x - 6} 12 ${x - 5} 22 ${x} 31 C${x + 5} 22 ${x + 6} 12 ${x} 4Z`

/** RSVP divider: a mavilai thoranam, mango leaves hanging from a cord. */
export default function RsvpDivider({ ctx }: SectionProps) {
  const ref = useDrawOnScroll<HTMLDivElement>(ctx)
  return (
    <div ref={ref} className="tm-divider" aria-hidden="true">
      <svg width="260" height="36" viewBox="0 0 260 36">
        <path className="tm-draw" pathLength="1" d="M4 4 C80 8 180 8 256 4" />
        {LEAVES.map((x) => (
          <path key={x} className="tm-draw" pathLength="1" d={leaf(x)} />
        ))}
      </svg>
    </div>
  )
}
