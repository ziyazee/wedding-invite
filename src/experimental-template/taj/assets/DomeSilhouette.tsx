interface Props {
  className?: string
  size?: number
}

export default function DomeSilhouette({ className, size = 200 }: Props) {
  return (
    <svg
      className={className}
      width={size}
      height={size * 0.8}
      viewBox="0 0 200 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Base platform */}
      <rect x="40" y="140" width="120" height="8" rx="1" fill="var(--tj-gold)" opacity="0.5" />
      {/* Drum (cylindrical base of dome) */}
      <rect x="60" y="120" width="80" height="20" fill="var(--tj-gold)" opacity="0.4" />
      {/* Small arched niches on drum */}
      <path d="M75 140 V132 Q75 128 80 128 Q85 128 85 132 V140" stroke="var(--tj-gold)" strokeWidth="0.5" fill="none" opacity="0.3" />
      <path d="M95 140 V132 Q95 128 100 128 Q105 128 105 132 V140" stroke="var(--tj-gold)" strokeWidth="0.5" fill="none" opacity="0.3" />
      <path d="M115 140 V132 Q115 128 120 128 Q125 128 125 132 V140" stroke="var(--tj-gold)" strokeWidth="0.5" fill="none" opacity="0.3" />
      {/* Onion dome - bulbous curve */}
      <path
        d="M60 120 Q60 70 100 40 Q140 70 140 120"
        fill="var(--tj-gold)"
        opacity="0.35"
      />
      {/* Dome highlight curve */}
      <path
        d="M75 115 Q75 75 100 50 Q125 75 125 115"
        fill="var(--tj-gold)"
        opacity="0.15"
      />
      {/* Neck narrowing at top of dome */}
      <rect x="96" y="35" width="8" height="8" rx="4" fill="var(--tj-gold)" opacity="0.5" />
      {/* Lotus finial */}
      <path
        d="M100 32 Q95 28 97 24 Q100 20 103 24 Q105 28 100 32 Z"
        fill="var(--tj-gold)"
        opacity="0.6"
      />
      {/* Spire */}
      <line x1="100" y1="20" x2="100" y2="10" stroke="var(--tj-gold)" strokeWidth="1.5" opacity="0.5" />
      {/* Crescent at top */}
      <path
        d="M102 8 A3 3 0 1 0 102 14 A2.5 2.5 0 1 1 102 8 Z"
        fill="var(--tj-gold)"
        opacity="0.6"
      />
    </svg>
  )
}
