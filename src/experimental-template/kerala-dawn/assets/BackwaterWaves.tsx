/* Kerala Dawn -- Animated Backwater Waves
   Three-layer animated wave SVG with floating oil lamp reflections.
   Uses SVG <animate> only -- no JS animation loops. */

interface BackwaterWavesProps {
  className?: string
  /** Visual variant: 'divider' (between sections) or 'footer' (bottom bleed) */
  variant?: 'divider' | 'footer'
}

export default function BackwaterWaves({ className, variant = 'divider' }: BackwaterWavesProps) {
  const height = variant === 'footer' ? 80 : 60

  return (
    <svg
      className={`kd-backwater ${className || ''}`}
      viewBox={`0 0 400 ${height}`}
      preserveAspectRatio="none"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      role="presentation"
    >
      {/* Water body fill -- subtle dark blue-teal gradient */}
      <defs>
        <linearGradient id="kd-water-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--kd-water-blue)" stopOpacity="0" />
          <stop offset="40%" stopColor="var(--kd-water-blue)" stopOpacity="0.15" />
          <stop offset="100%" stopColor="var(--kd-water-blue)" stopOpacity="0.25" />
        </linearGradient>
      </defs>

      {/* Water body */}
      <rect x="0" y="20" width="400" height={height - 20} fill="url(#kd-water-fill)" />

      {/* Layer 1 -- slow deep wave (gold shimmer) */}
      <path
        d="M0 28 Q50 18, 100 26 T200 24 T300 28 T400 22 V60 H0 Z"
        fill="rgba(212,162,54,0.04)"
      >
        <animate
          attributeName="d"
          values="M0 28 Q50 18, 100 26 T200 24 T300 28 T400 22 V60 H0 Z;
                  M0 24 Q50 32, 100 22 T200 28 T300 20 T400 28 V60 H0 Z;
                  M0 28 Q50 18, 100 26 T200 24 T300 28 T400 22 V60 H0 Z"
          dur="8s"
          repeatCount="indefinite"
        />
      </path>

      {/* Layer 1 stroke */}
      <path
        d="M0 28 Q50 18, 100 26 T200 24 T300 28 T400 22"
        stroke="rgba(212,162,54,0.15)"
        strokeWidth="1"
        fill="none"
      >
        <animate
          attributeName="d"
          values="M0 28 Q50 18, 100 26 T200 24 T300 28 T400 22;
                  M0 24 Q50 32, 100 22 T200 28 T300 20 T400 28;
                  M0 28 Q50 18, 100 26 T200 24 T300 28 T400 22"
          dur="8s"
          repeatCount="indefinite"
        />
      </path>

      {/* Layer 2 -- medium wave */}
      <path
        d="M0 34 Q60 22, 120 32 T240 28 T360 34 T400 26"
        stroke="rgba(212,162,54,0.10)"
        strokeWidth="0.8"
        fill="none"
      >
        <animate
          attributeName="d"
          values="M0 34 Q60 22, 120 32 T240 28 T360 34 T400 26;
                  M0 30 Q60 38, 120 26 T240 34 T360 26 T400 32;
                  M0 34 Q60 22, 120 32 T240 28 T360 34 T400 26"
          dur="6s"
          repeatCount="indefinite"
        />
      </path>

      {/* Layer 3 -- fast subtle ripple */}
      <path
        d="M0 40 Q40 34, 80 40 T160 38 T240 42 T320 38 T400 40"
        stroke="rgba(212,162,54,0.06)"
        strokeWidth="0.6"
        fill="none"
      >
        <animate
          attributeName="d"
          values="M0 40 Q40 34, 80 40 T160 38 T240 42 T320 38 T400 40;
                  M0 38 Q40 44, 80 36 T160 42 T240 36 T320 42 T400 38;
                  M0 40 Q40 34, 80 40 T160 38 T240 42 T320 38 T400 40"
          dur="4s"
          repeatCount="indefinite"
        />
      </path>

      {/* Floating lamp reflections -- golden circles wobbling on water */}
      <circle cx="80" cy="38" r="3" fill="var(--kd-lamp-gold)" opacity="0">
        <animate attributeName="opacity" values="0.08;0.20;0.05;0.15;0.08" dur="5s" repeatCount="indefinite" />
        <animate attributeName="cx" values="80;86;76;80" dur="7s" repeatCount="indefinite" />
        <animate attributeName="r" values="3;3.5;2.5;3" dur="6s" repeatCount="indefinite" />
      </circle>
      <circle cx="200" cy="36" r="2.5" fill="var(--kd-lamp-gold)" opacity="0">
        <animate attributeName="opacity" values="0.06;0.18;0.04;0.14;0.06" dur="6s" repeatCount="indefinite" />
        <animate attributeName="cx" values="200;194;205;200" dur="8s" repeatCount="indefinite" />
        <animate attributeName="r" values="2.5;3;2;2.5" dur="5.5s" repeatCount="indefinite" />
      </circle>
      <circle cx="320" cy="40" r="2" fill="var(--kd-lamp-gold)" opacity="0">
        <animate attributeName="opacity" values="0.07;0.16;0.04;0.12;0.07" dur="5.5s" repeatCount="indefinite" />
        <animate attributeName="cx" values="320;314;324;320" dur="9s" repeatCount="indefinite" />
        <animate attributeName="r" values="2;2.8;1.8;2" dur="7s" repeatCount="indefinite" />
      </circle>

      {/* Additional small reflective sparkles */}
      <circle cx="140" cy="42" r="1" fill="var(--kd-lamp-gold)" opacity="0">
        <animate attributeName="opacity" values="0;0.12;0;0.08;0" dur="4s" begin="1s" repeatCount="indefinite" />
      </circle>
      <circle cx="260" cy="44" r="1.2" fill="var(--kd-lamp-gold)" opacity="0">
        <animate attributeName="opacity" values="0;0.10;0;0.06;0" dur="3.5s" begin="2s" repeatCount="indefinite" />
      </circle>
    </svg>
  )
}
