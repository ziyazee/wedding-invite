interface Props {
  className?: string
  motif?: 'star' | 'crescent' | 'dome' | 'diamond' | 'rose' | 'none'
  width?: string
}

export default function OrnamentalDivider({ className, motif = 'diamond', width = '40%' }: Props) {
  const motifSize = motif === 'dome' ? 20 : 12

  function renderMotif() {
    switch (motif) {
      case 'star':
        return (
          <g transform="translate(100, 10)">
            <path
              d="M0 -6 L1.5 -1.5 L6 0 L1.5 1.5 L0 6 L-1.5 1.5 L-6 0 L-1.5 -1.5 Z"
              fill="var(--tj-gold)"
            />
          </g>
        )
      case 'crescent':
        return (
          <g transform="translate(94, 4)">
            <path
              d="M9 0a6 6 0 1 0 0 12 5 5 0 1 1 0-12z"
              fill="var(--tj-gold)"
              opacity="0.85"
            />
          </g>
        )
      case 'dome':
        return (
          <g transform="translate(90, 2)">
            {/* Simplified dome + spire + crescent */}
            <path
              d="M10 16 L10 14 Q2 12 2 7 Q2 2 10 0 Q18 2 18 7 Q18 12 10 14 Z"
              fill="var(--tj-gold)"
              opacity="0.7"
            />
            <line x1="10" y1="0" x2="10" y2="-3" stroke="var(--tj-gold)" strokeWidth="0.8" />
            <circle cx="10" cy="-4" r="1.5" fill="none" stroke="var(--tj-gold)" strokeWidth="0.6" />
          </g>
        )
      case 'rose':
        return (
          <g transform="translate(100, 10)">
            {/* Simplified 3-petal bud */}
            <ellipse cx="0" cy="-2" rx="2.5" ry="4" fill="var(--tj-gold)" opacity="0.5" />
            <ellipse cx="-2.5" cy="0" rx="2" ry="3" fill="var(--tj-gold)" opacity="0.4" transform="rotate(-20)" />
            <ellipse cx="2.5" cy="0" rx="2" ry="3" fill="var(--tj-gold)" opacity="0.4" transform="rotate(20)" />
            <circle cx="0" cy="0" r="1" fill="var(--tj-gold)" opacity="0.7" />
          </g>
        )
      case 'diamond':
        return (
          <g transform="translate(100, 10)">
            <polygon
              points="0,-4 4,0 0,4 -4,0"
              fill="var(--tj-gold)"
              opacity="0.6"
            />
          </g>
        )
      case 'none':
      default:
        return null
    }
  }

  const gapHalf = motif === 'none' ? 0 : motifSize / 2 + 4

  return (
    <svg
      className={className}
      style={{ width, display: 'block', margin: '0 auto' }}
      viewBox="0 0 200 20"
      preserveAspectRatio="xMidYMid meet"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Left line */}
      <line
        x1="0"
        y1="10"
        x2={100 - gapHalf}
        y2="10"
        stroke="var(--tj-gold)"
        strokeWidth="1"
        className="tj-divider-line"
      />
      {/* Right line */}
      <line
        x1={100 + gapHalf}
        y1="10"
        x2="200"
        y2="10"
        stroke="var(--tj-gold)"
        strokeWidth="1"
        className="tj-divider-line"
      />
      {/* Center motif */}
      <g className="tj-divider-motif">
        {renderMotif()}
      </g>
    </svg>
  )
}
