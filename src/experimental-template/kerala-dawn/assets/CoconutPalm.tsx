/* Kerala Dawn — Coconut Palm Silhouette
   Atmospheric background watermark element */

interface CoconutPalmProps {
  className?: string
  height?: number
  color?: string
  style?: React.CSSProperties
}

export default function CoconutPalm({
  className,
  height = 140,
  color = 'var(--kd-paddy-dark)',
  style,
}: CoconutPalmProps) {
  const w = height * 0.55
  return (
    <svg
      className={className}
      style={style}
      width={w}
      height={height}
      viewBox="0 0 80 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      role="presentation"
    >
      {/* Trunk — gentle S-curve, tapering */}
      <path
        d="M42 160 C42 140, 40 120, 38 100 C36 80, 35 60, 36 42"
        stroke={color}
        strokeWidth="5"
        strokeLinecap="round"
        fill="none"
      />
      {/* Ring marks on trunk */}
      {[60, 80, 100, 120, 140].map((y) => (
        <line key={y} x1="34" y1={y} x2="42" y2={y} stroke={color} strokeWidth="0.6" opacity="0.3" />
      ))}

      {/* Crown — 7 fronds radiating from top */}
      {/* Left fronds */}
      <path d="M36 42 C28 32, 14 22, 2 16" stroke={color} strokeWidth="1.8" fill="none" strokeLinecap="round" />
      <path d="M36 42 C30 30, 18 14, 8 4" stroke={color} strokeWidth="1.8" fill="none" strokeLinecap="round" />
      <path d="M36 42 C34 28, 28 10, 24 0" stroke={color} strokeWidth="1.8" fill="none" strokeLinecap="round" />

      {/* Center frond */}
      <path d="M36 42 C38 28, 40 10, 42 0" stroke={color} strokeWidth="1.8" fill="none" strokeLinecap="round" />

      {/* Right fronds */}
      <path d="M36 42 C42 28, 52 10, 58 0" stroke={color} strokeWidth="1.8" fill="none" strokeLinecap="round" />
      <path d="M36 42 C44 30, 58 16, 68 6" stroke={color} strokeWidth="1.8" fill="none" strokeLinecap="round" />
      <path d="M36 42 C46 34, 62 24, 76 18" stroke={color} strokeWidth="1.8" fill="none" strokeLinecap="round" />

      {/* Leaflet details on fronds (subtle ribs) */}
      {/* Left frond leaflets */}
      <path d="M22 28 L18 24 M26 24 L22 19 M30 18 L26 12" stroke={color} strokeWidth="0.5" opacity="0.4" />
      {/* Right frond leaflets */}
      <path d="M48 26 L52 22 M52 20 L56 15 M46 16 L50 10" stroke={color} strokeWidth="0.5" opacity="0.4" />

      {/* Coconut cluster */}
      <circle cx="34" cy="44" r="3" fill={color} opacity="0.5" />
      <circle cx="38" cy="43" r="3" fill={color} opacity="0.5" />
      <circle cx="36" cy="46" r="2.5" fill={color} opacity="0.4" />
    </svg>
  )
}
