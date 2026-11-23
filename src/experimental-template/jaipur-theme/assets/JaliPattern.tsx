interface JaliPatternProps {
  className?: string
}

export default function JaliPattern({ className }: JaliPatternProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <pattern id="jt-jali" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
          {/* 8-pointed Islamic star (octagram) — two overlapping rotated squares */}
          <path
            d="M30 8 L38 22 L52 22 L42 30 L46 44 L30 38 L14 44 L18 30 L8 22 L22 22 Z"
            fill="currentColor"
            opacity="0.035"
          />
          <path
            d="M30 8 L38 22 L52 22 L42 30 L46 44 L30 38 L14 44 L18 30 L8 22 L22 22 Z"
            stroke="currentColor"
            strokeWidth="0.4"
            fill="none"
            opacity="0.05"
          />
          {/* Second rotated square overlay for octagram effect */}
          <path
            d="M22 10 L30 18 L38 10 L44 18 L52 22 L44 30 L52 38 L44 42 L38 50 L30 42 L22 50 L16 42 L8 38 L16 30 L8 22 L16 18 Z"
            stroke="currentColor"
            strokeWidth="0.3"
            fill="none"
            opacity="0.04"
          />
          {/* Radial spokes from star tips to cell boundary */}
          <line x1="30" y1="8" x2="30" y2="0" stroke="currentColor" strokeWidth="0.3" opacity="0.04" />
          <line x1="52" y1="22" x2="60" y2="22" stroke="currentColor" strokeWidth="0.3" opacity="0.04" />
          <line x1="30" y1="44" x2="30" y2="52" stroke="currentColor" strokeWidth="0.3" opacity="0.04" />
          <line x1="8" y1="22" x2="0" y2="22" stroke="currentColor" strokeWidth="0.3" opacity="0.04" />
          <line x1="46" y1="44" x2="52" y2="52" stroke="currentColor" strokeWidth="0.3" opacity="0.035" />
          <line x1="14" y1="44" x2="8" y2="52" stroke="currentColor" strokeWidth="0.3" opacity="0.035" />
          <line x1="46" y1="8" x2="52" y2="0" stroke="currentColor" strokeWidth="0.3" opacity="0.035" />
          <line x1="14" y1="8" x2="8" y2="0" stroke="currentColor" strokeWidth="0.3" opacity="0.035" />
          {/* Lattice arcs connecting cells */}
          <path d="M0 0 Q30 12 60 0" stroke="currentColor" strokeWidth="0.35" fill="none" opacity="0.045" />
          <path d="M0 60 Q30 48 60 60" stroke="currentColor" strokeWidth="0.35" fill="none" opacity="0.045" />
          <path d="M0 0 Q12 30 0 60" stroke="currentColor" strokeWidth="0.35" fill="none" opacity="0.045" />
          <path d="M60 0 Q48 30 60 60" stroke="currentColor" strokeWidth="0.35" fill="none" opacity="0.045" />
          {/* Secondary circles at intersection points */}
          <circle cx="30" cy="0" r="1.8" fill="currentColor" opacity="0.04" />
          <circle cx="60" cy="30" r="1.8" fill="currentColor" opacity="0.04" />
          <circle cx="30" cy="60" r="1.8" fill="currentColor" opacity="0.04" />
          <circle cx="0" cy="30" r="1.8" fill="currentColor" opacity="0.04" />
          {/* Corner intersection dots */}
          <circle cx="0" cy="0" r="1.2" fill="currentColor" opacity="0.035" />
          <circle cx="60" cy="0" r="1.2" fill="currentColor" opacity="0.035" />
          <circle cx="0" cy="60" r="1.2" fill="currentColor" opacity="0.035" />
          <circle cx="60" cy="60" r="1.2" fill="currentColor" opacity="0.035" />
          {/* Small diamond accents at midpoints between corners and center */}
          <path d="M15 15 L16.5 13.5 L18 15 L16.5 16.5 Z" fill="currentColor" opacity="0.03" />
          <path d="M42 15 L43.5 13.5 L45 15 L43.5 16.5 Z" fill="currentColor" opacity="0.03" />
          <path d="M15 45 L16.5 43.5 L18 45 L16.5 46.5 Z" fill="currentColor" opacity="0.03" />
          <path d="M42 45 L43.5 43.5 L45 45 L43.5 46.5 Z" fill="currentColor" opacity="0.03" />
        </pattern>
      </defs>
      <rect width="120" height="120" fill="url(#jt-jali)" />
    </svg>
  )
}
