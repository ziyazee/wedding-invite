interface Props {
  className?: string
  opacity?: number
  tileSize?: number
}

export default function JaliPattern({ className, opacity = 0.04, tileSize = 40 }: Props) {
  const half = tileSize / 2
  const quarter = tileSize / 4
  // 8-pointed star: two overlapping squares rotated 45deg
  // Square 1 (axis-aligned): centered at (half, half), side = half
  const s1 = half / 2
  // Square 2 (rotated 45): diamond centered at (half, half)
  const d = half * 0.5

  return (
    <svg
      className={className}
      width="100%"
      height="100%"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      style={{ position: 'absolute', inset: 0, opacity }}
    >
      <defs>
        <pattern
          id="tj-jali-tile"
          x="0"
          y="0"
          width={tileSize}
          height={tileSize}
          patternUnits="userSpaceOnUse"
        >
          {/* Square 1 (axis-aligned) */}
          <rect
            x={half - s1}
            y={half - s1}
            width={s1 * 2}
            height={s1 * 2}
            stroke="var(--tj-gold)"
            strokeWidth="0.6"
            fill="none"
          />
          {/* Square 2 (rotated 45 = diamond) */}
          <polygon
            points={`${half},${half - d} ${half + d},${half} ${half},${half + d} ${half - d},${half}`}
            stroke="var(--tj-gold)"
            strokeWidth="0.6"
            fill="none"
          />
          {/* Connecting lines at intersection points */}
          <line x1="0" y1="0" x2={quarter} y2={quarter} stroke="var(--tj-gold)" strokeWidth="0.4" />
          <line x1={tileSize} y1="0" x2={tileSize - quarter} y2={quarter} stroke="var(--tj-gold)" strokeWidth="0.4" />
          <line x1="0" y1={tileSize} x2={quarter} y2={tileSize - quarter} stroke="var(--tj-gold)" strokeWidth="0.4" />
          <line x1={tileSize} y1={tileSize} x2={tileSize - quarter} y2={tileSize - quarter} stroke="var(--tj-gold)" strokeWidth="0.4" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#tj-jali-tile)" />
    </svg>
  )
}
