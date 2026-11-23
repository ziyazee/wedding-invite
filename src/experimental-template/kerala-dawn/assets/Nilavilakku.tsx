/* Kerala Dawn — Nilavilakku (Traditional Brass Oil Lamp) */

interface NilavilakkuProps {
  className?: string
  size?: number
  color?: string
  style?: React.CSSProperties
}

/**
 * Traditional five-wick Kerala brass oil lamp on a tiered pedestal.
 * Three stacked circular bases, turned stem with decorative nodes,
 * lotus-petal scalloped bowl, and five teardrop flames.
 */
export default function Nilavilakku({
  className,
  size = 48,
  color = 'var(--kd-lamp-gold)',
  style,
}: NilavilakkuProps) {
  const w = size
  const h = size * 2.5
  return (
    <svg
      className={className}
      style={style}
      width={w}
      height={h}
      viewBox="0 0 48 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      role="presentation"
    >
      {/* === Base tier 3 (widest) === */}
      <ellipse cx="24" cy="117" rx="21" ry="3" fill={color} opacity="0.55" />
      <path
        d="M3 117 C3 113, 9 109, 24 109 C39 109, 45 113, 45 117"
        fill={color}
        opacity="0.65"
      />
      <ellipse cx="24" cy="109" rx="17" ry="2.8" fill={color} opacity="0.75" />
      {/* Rim line */}
      <ellipse cx="24" cy="109" rx="17" ry="2.8" stroke={color} strokeWidth="0.5" fill="none" opacity="0.3" />

      {/* === Base tier 2 === */}
      <path
        d="M7 109 C7 105.5, 12 102, 24 102 C36 102, 41 105.5, 41 109"
        fill={color}
        opacity="0.65"
      />
      <ellipse cx="24" cy="102" rx="14" ry="2.4" fill={color} opacity="0.75" />
      <ellipse cx="24" cy="102" rx="14" ry="2.4" stroke={color} strokeWidth="0.5" fill="none" opacity="0.3" />

      {/* === Base tier 1 (smallest) === */}
      <path
        d="M10 102 C10 99.5, 14 97, 24 97 C34 97, 38 99.5, 38 102"
        fill={color}
        opacity="0.65"
      />
      <ellipse cx="24" cy="97" rx="11" ry="2" fill={color} opacity="0.7" />

      {/* === Stem — turned cylinder === */}
      <rect x="21.5" y="58" width="5" height="39" rx="1.2" fill={color} opacity="0.7" />

      {/* Lower decorative node (bulge) */}
      <ellipse cx="24" cy="90" rx="5.5" ry="2.8" fill={color} opacity="0.7" />
      <ellipse cx="24" cy="90" rx="5.5" ry="2.8" stroke={color} strokeWidth="0.4" fill="none" opacity="0.25" />

      {/* Mid decorative ring */}
      <ellipse cx="24" cy="80" rx="4.5" ry="1.8" fill={color} opacity="0.65" />

      {/* Upper decorative node */}
      <ellipse cx="24" cy="70" rx="5" ry="2.2" fill={color} opacity="0.65" />
      <ellipse cx="24" cy="70" rx="5" ry="2.2" stroke={color} strokeWidth="0.4" fill="none" opacity="0.2" />

      {/* === Oil bowl — wide, shallow, scalloped === */}
      <path
        d="M5 57 C5 50, 11 45, 24 45 C37 45, 43 50, 43 57 C43 59, 37 61, 24 61 C11 61, 5 59, 5 57Z"
        fill={color}
        opacity="0.8"
      />
      {/* Scalloped lotus-petal rim */}
      <path
        d="M5 55 Q9 51, 13 54 Q17 50, 21 54 Q24 50.5, 27 54 Q31 50, 35 54 Q39 51, 43 55"
        stroke={color}
        strokeWidth="0.8"
        fill="none"
        opacity="0.45"
      />
      {/* Inner bowl highlight */}
      <ellipse cx="24" cy="53" rx="14" ry="4.5" fill={color} opacity="0.12" />

      {/* === Five wick holders (small circles on bowl rim) === */}
      <circle cx="8" cy="55" r="1.8" fill={color} opacity="0.6" />
      <circle cx="16" cy="48" r="1.8" fill={color} opacity="0.6" />
      <circle cx="24" cy="46" r="2" fill={color} opacity="0.65" />
      <circle cx="32" cy="48" r="1.8" fill={color} opacity="0.6" />
      <circle cx="40" cy="55" r="1.8" fill={color} opacity="0.6" />

      {/* === Flames — five teardrop shapes === */}
      {/* Center flame (tallest) */}
      <path
        d="M24 44 C22.5 40, 21 36, 22 31 C23 27, 24 25, 24 24 C24 25, 25 27, 26 31 C27 36, 25.5 40, 24 44Z"
        fill={color}
        opacity="0.95"
      />
      {/* Left-inner flame */}
      <path
        d="M16 47 C14.8 44, 14 41, 14.5 37 C15 34, 16 32, 16 31 C16 32, 17 34, 17.5 37 C18 41, 17.2 44, 16 47Z"
        fill={color}
        opacity="0.75"
      />
      {/* Right-inner flame */}
      <path
        d="M32 47 C30.8 44, 30 41, 30.5 37 C31 34, 32 32, 32 31 C32 32, 33 34, 33.5 37 C34 41, 33.2 44, 32 47Z"
        fill={color}
        opacity="0.75"
      />
      {/* Left-outer flame (shorter) */}
      <path
        d="M8 54 C7 51.5, 6.5 49, 7 46 C7.5 43.5, 8 42, 8 41 C8 42, 8.5 43.5, 9 46 C9.5 49, 9 51.5, 8 54Z"
        fill={color}
        opacity="0.55"
      />
      {/* Right-outer flame (shorter) */}
      <path
        d="M40 54 C39 51.5, 38.5 49, 39 46 C39.5 43.5, 40 42, 40 41 C40 42, 40.5 43.5, 41 46 C41.5 49, 41 51.5, 40 54Z"
        fill={color}
        opacity="0.55"
      />

      {/* Flame glow halos */}
      <circle cx="24" cy="32" r="7" fill={color} opacity="0.06" />
      <circle cx="16" cy="39" r="5" fill={color} opacity="0.04" />
      <circle cx="32" cy="39" r="5" fill={color} opacity="0.04" />
    </svg>
  )
}
