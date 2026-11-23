/* Kerala Dawn — Ceremonial Elephant Motif
   Simplified Kerala temple elephant with nettipattam and caparison */

interface ElephantMotifProps {
  className?: string
  size?: number
  flip?: boolean
  color?: string
  style?: React.CSSProperties
}

export default function ElephantMotif({
  className,
  size = 40,
  flip,
  color = 'currentColor',
  style,
}: ElephantMotifProps) {
  const h = size * 1.2
  return (
    <svg
      className={className}
      style={{
        ...style,
        ...(flip ? { transform: 'scaleX(-1)' } : undefined),
      }}
      width={size}
      height={h}
      viewBox="0 0 40 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      role="presentation"
    >
      {/* Body — solid silhouette, walking profile facing right */}
      <path
        d="M10 40 C10 32, 12 26, 16 22 L18 20 L28 18 C33 20, 36 26, 36 34 L36 40 Z"
        fill={color}
      />

      {/* Head */}
      <path
        d="M14 22 C14 16, 17 11, 21 10 C25 9, 28 12, 29 16 L28 20 L16 22 Z"
        fill={color}
      />

      {/* Ear */}
      <path
        d="M12 16 C10 12, 10.5 9, 13 8 C14 10, 14.5 13, 14 17 Z"
        fill={color}
        opacity="0.8"
      />

      {/* Trunk — raised upward (auspicious gesture) */}
      <path
        d="M16 20 C13 21, 10 22, 8 21 C6 20, 5 17, 5 14 C5 12, 6 10, 7 9"
        stroke={color}
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />

      {/* Tusk */}
      <path
        d="M14 19 L11 22 L12.5 22.5"
        fill={color}
        opacity="0.9"
      />

      {/* Eye */}
      <circle cx="20" cy="13.5" r="1" fill="var(--kd-teal-black, #0A1F1C)" />

      {/* === Nettipattam (gold headpiece) === */}
      <path
        d="M16 10 L21 5 L26 10"
        fill={color}
        opacity="0.85"
      />
      {/* Central ornament on nettipattam */}
      <circle cx="21" cy="5.5" r="2.2" fill={color} />
      <circle cx="21" cy="5.5" r="1.2" fill={color} opacity="0.5" />
      {/* Side bells on nettipattam */}
      <circle cx="17" cy="9" r="1.2" fill={color} opacity="0.7" />
      <circle cx="25" cy="9" r="1.2" fill={color} opacity="0.7" />
      <circle cx="21" cy="7.5" r="0.8" fill={color} opacity="0.6" />

      {/* === Caparison (back cloth / ambari base) === */}
      <rect x="20" y="18" width="14" height="8" rx="1" fill={color} opacity="0.6" />
      {/* Decorative bands on caparison */}
      <line x1="20" y1="20" x2="34" y2="20" stroke={color} strokeWidth="0.6" opacity="0.35" />
      <line x1="20" y1="22.5" x2="34" y2="22.5" stroke={color} strokeWidth="0.6" opacity="0.35" />
      <line x1="20" y1="25" x2="34" y2="25" stroke={color} strokeWidth="0.6" opacity="0.35" />
      {/* Fringe at bottom of caparison */}
      {[21, 23.5, 26, 28.5, 31, 33.5].map((x) => (
        <line key={x} x1={x} y1="26" x2={x} y2="28" stroke={color} strokeWidth="0.5" opacity="0.3" />
      ))}

      {/* === Legs (one front forward for walking pose) === */}
      {/* Front left (forward) */}
      <path d="M14 38 L12 46 L15 46 L16 38" fill={color} />
      {/* Front right (back) */}
      <path d="M18 39 L19 46 L22 46 L20 39" fill={color} opacity="0.85" />
      {/* Rear left */}
      <path d="M28 39 L27 46 L30 46 L30 39" fill={color} opacity="0.85" />
      {/* Rear right (slightly forward) */}
      <path d="M33 38 L34 46 L37 46 L36 38" fill={color} />

      {/* Tail */}
      <path
        d="M36 34 C38 32, 39 30, 38 28"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
        opacity="0.6"
      />

      {/* Bell hanging from neck */}
      <circle cx="18" cy="30" r="1.8" stroke={color} strokeWidth="0.6" fill="none" opacity="0.5" />
      <circle cx="18" cy="31" r="0.7" fill={color} opacity="0.4" />
    </svg>
  )
}
