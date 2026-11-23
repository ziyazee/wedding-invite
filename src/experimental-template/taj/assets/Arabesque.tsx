interface Props {
  className?: string
  flip?: boolean
}

export default function Arabesque({ className, flip }: Props) {
  return (
    <svg
      className={className}
      viewBox="0 0 200 300"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      style={flip ? { transform: 'scaleX(-1)' } : undefined}
    >
      {/* Flowing vine with leaves */}
      <path
        d="M100 10 Q60 60 100 100 Q140 140 100 180 Q60 220 100 260 Q120 280 100 300"
        stroke="var(--tj-gold)"
        strokeWidth="1.5"
        fill="none"
        opacity="0.5"
      />
      {/* Leaf pairs */}
      <path d="M100 50 Q80 40 70 55 Q80 65 100 55" fill="var(--tj-gold)" opacity="0.25" />
      <path d="M100 50 Q120 40 130 55 Q120 65 100 55" fill="var(--tj-gold)" opacity="0.25" />
      <path d="M100 130 Q75 120 65 135 Q75 145 100 135" fill="var(--tj-gold)" opacity="0.2" />
      <path d="M100 130 Q125 120 135 135 Q125 145 100 135" fill="var(--tj-gold)" opacity="0.2" />
      <path d="M100 210 Q80 200 70 215 Q80 225 100 215" fill="var(--tj-gold)" opacity="0.15" />
      <path d="M100 210 Q120 200 130 215 Q120 225 100 215" fill="var(--tj-gold)" opacity="0.15" />
      {/* Small rosette dots */}
      <circle cx="100" cy="100" r="4" fill="var(--tj-gold)" opacity="0.3" />
      <circle cx="100" cy="180" r="4" fill="var(--tj-gold)" opacity="0.25" />
      <circle cx="100" cy="260" r="3" fill="var(--tj-gold)" opacity="0.2" />
    </svg>
  )
}
