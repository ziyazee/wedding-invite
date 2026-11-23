import type { SectionProps } from '../../core'
import { useDrawOnScroll } from '../../core'

/** Countdown divider: three nested diamonds on a hairline. */
export default function CountdownDivider({ ctx }: SectionProps) {
  const ref = useDrawOnScroll<HTMLDivElement>(ctx)
  return (
    <div ref={ref} className="gd-divider" aria-hidden="true">
      <svg width="240" height="28" viewBox="0 0 240 28">
        <path className="gd-draw" pathLength="1" d="M0 14 H96" />
        <path className="gd-draw" pathLength="1" d="M144 14 H240" />
        <path className="gd-draw" pathLength="1" d="M120 2 L132 14 L120 26 L108 14 Z" />
        <path className="gd-draw" pathLength="1" d="M120 7 L127 14 L120 21 L113 14 Z" />
        <path className="gd-draw" pathLength="1" d="M100 14 L104 10 L108 14 L104 18 Z M132 14 L136 10 L140 14 L136 18 Z" />
      </svg>
    </div>
  )
}
