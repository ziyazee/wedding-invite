import type { SectionProps } from '../../core'
import { useDrawOnScroll } from '../../core'

/** Celebrations divider: a rose bloom at the centre with a leafed stem curving out each side. */
export default function CelebrationsDivider({ ctx }: SectionProps) {
  const ref = useDrawOnScroll<HTMLDivElement>(ctx)
  return (
    <div ref={ref} className="pb-divider" aria-hidden="true">
      <svg width="280" height="48" viewBox="0 0 280 48">
        {/* bloom */}
        <circle className="pb-draw" pathLength="1" cx="140" cy="22" r="4" />
        <path className="pb-draw" pathLength="1" d="M140 22 C128 20 128 6 140 6 C152 6 152 20 140 22 C146 32 160 24 156 16 M140 22 C130 30 134 40 144 38" />
        {/* left stem + leaves */}
        <path className="pb-draw" pathLength="1" d="M122 26 C100 26 84 36 60 34 C40 33 24 26 6 28" />
        <path className="pb-draw" pathLength="1" d="M104 29 C98 20 90 18 84 20 C86 27 94 30 104 29Z" />
        <path className="pb-draw" pathLength="1" d="M72 35 C68 44 58 46 52 44 C54 38 62 34 72 35Z" />
        <path className="pb-draw" pathLength="1" d="M40 31 C36 24 28 22 22 24 C24 30 32 33 40 31Z" />
        {/* right stem + leaves (mirrored) */}
        <path className="pb-draw" pathLength="1" d="M158 26 C180 26 196 36 220 34 C240 33 256 26 274 28" />
        <path className="pb-draw" pathLength="1" d="M176 29 C182 20 190 18 196 20 C194 27 186 30 176 29Z" />
        <path className="pb-draw" pathLength="1" d="M208 35 C212 44 222 46 228 44 C226 38 218 34 208 35Z" />
        <path className="pb-draw" pathLength="1" d="M240 31 C244 24 252 22 258 24 C256 30 248 33 240 31Z" />
      </svg>
    </div>
  )
}
