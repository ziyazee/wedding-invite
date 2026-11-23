interface Props {
  className?: string
}

export default function GeometricBorder({ className }: Props) {
  return (
    <svg
      className={className}
      viewBox="0 0 600 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      {/* Repeating Islamic geometric pattern */}
      {Array.from({ length: 15 }).map((_, i) => {
        const x = i * 40 + 20
        return (
          <g key={i} opacity="0.6">
            <polygon
              points={`${x},20 ${x + 10},8 ${x + 20},20 ${x + 10},32`}
              stroke="var(--tj-gold)"
              strokeWidth="1"
              fill="none"
            />
            <circle cx={x + 10} cy={20} r="3" fill="var(--tj-gold)" opacity="0.4" />
          </g>
        )
      })}
      {/* Top and bottom lines */}
      <line x1="0" y1="2" x2="600" y2="2" stroke="var(--tj-gold)" strokeWidth="0.5" opacity="0.3" />
      <line x1="0" y1="38" x2="600" y2="38" stroke="var(--tj-gold)" strokeWidth="0.5" opacity="0.3" />
    </svg>
  )
}
