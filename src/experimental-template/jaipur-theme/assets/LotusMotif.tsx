interface LotusMotifProps {
  className?: string
  size?: number
}

export default function LotusMotif({ className, size = 72 }: LotusMotifProps) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="jt-lotus-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="var(--jt-gold, #D4A853)" stopOpacity="0.08" />
          <stop offset="100%" stopColor="var(--jt-gold, #D4A853)" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="40" cy="40" r="38" fill="url(#jt-lotus-glow)" />

      {/* 8 outer petals — teardrop shapes radiating outward */}
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
        <path
          key={`outer-${angle}`}
          d="M40 12 Q36 22 37 28 Q38.5 32 40 34 Q41.5 32 43 28 Q44 22 40 12"
          fill="var(--jt-rose-gold, #B76E79)"
          opacity="0.28"
          stroke="var(--jt-rose-gold, #B76E79)"
          strokeWidth="0.3"
          strokeOpacity="0.35"
          transform={`rotate(${angle} 40 40)`}
        />
      ))}

      {/* 8 inner petals — smaller, offset 22.5° */}
      {[22.5, 67.5, 112.5, 157.5, 202.5, 247.5, 292.5, 337.5].map((angle) => (
        <path
          key={`inner-${angle}`}
          d="M40 20 Q37.5 27 38.5 30 Q39.5 32 40 33 Q40.5 32 41.5 30 Q42.5 27 40 20"
          fill="var(--jt-rose-gold-light, #D4929B)"
          opacity="0.3"
          stroke="var(--jt-rose-gold, #B76E79)"
          strokeWidth="0.2"
          strokeOpacity="0.25"
          transform={`rotate(${angle} 40 40)`}
        />
      ))}

      {/* Fine stamens from center outward */}
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
        <line
          key={`stamen-${angle}`}
          x1="40" y1="34" x2="40" y2="27"
          stroke="var(--jt-gold, #D4A853)"
          strokeWidth="0.25"
          opacity="0.15"
          transform={`rotate(${angle} 40 40)`}
        />
      ))}

      {/* Seed pod — concentric circles */}
      <circle cx="40" cy="40" r="7" fill="var(--jt-gold, #D4A853)" opacity="0.12" />
      <circle cx="40" cy="40" r="5" stroke="var(--jt-gold, #D4A853)" strokeWidth="0.4" fill="none" opacity="0.25" />
      <circle cx="40" cy="40" r="3.5" stroke="var(--jt-gold, #D4A853)" strokeWidth="0.3" fill="none" opacity="0.2" />
      <circle cx="40" cy="40" r="2" fill="var(--jt-gold, #D4A853)" opacity="0.4" />

      {/* Seed dots in a ring */}
      {[0, 60, 120, 180, 240, 300].map((angle) => {
        const rad = (angle * Math.PI) / 180
        const cx = 40 + 4.2 * Math.cos(rad)
        const cy = 40 + 4.2 * Math.sin(rad)
        return (
          <circle key={`seed-${angle}`} cx={cx} cy={cy} r="0.5" fill="var(--jt-gold, #D4A853)" opacity="0.22" />
        )
      })}
    </svg>
  )
}
