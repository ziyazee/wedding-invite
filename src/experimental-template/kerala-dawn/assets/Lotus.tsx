/* Kerala Dawn — Lotus Flower Motif
   Open lotus viewed from above with three petal rows */

interface LotusProps {
  className?: string
  size?: number
  color?: string
  style?: React.CSSProperties
}

export default function Lotus({
  className,
  size = 32,
  color = 'var(--kd-lamp-gold)',
  style,
}: LotusProps) {
  return (
    <svg
      className={className}
      style={style}
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      role="presentation"
    >
      {/* === Outer petals (8, largest) === */}
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
        <path
          key={`outer-${angle}`}
          d="M32 32 C28 24, 26 14, 32 4 C38 14, 36 24, 32 32Z"
          stroke={color}
          strokeWidth="0.8"
          fill={color}
          fillOpacity="0.04"
          transform={`rotate(${angle} 32 32)`}
        />
      ))}

      {/* === Middle petals (8, narrower, rotated 22.5 deg offset) === */}
      {[22.5, 67.5, 112.5, 157.5, 202.5, 247.5, 292.5, 337.5].map((angle) => (
        <path
          key={`mid-${angle}`}
          d="M32 32 C30 26, 29 18, 32 10 C35 18, 34 26, 32 32Z"
          stroke={color}
          strokeWidth="0.7"
          fill={color}
          fillOpacity="0.03"
          transform={`rotate(${angle} 32 32)`}
        />
      ))}

      {/* === Inner petals (5, narrow) === */}
      {[0, 72, 144, 216, 288].map((angle) => (
        <path
          key={`inner-${angle}`}
          d="M32 32 C31 28, 30.5 22, 32 16 C33.5 22, 33 28, 32 32Z"
          stroke={color}
          strokeWidth="0.6"
          fill={color}
          fillOpacity="0.05"
          transform={`rotate(${angle} 32 32)`}
        />
      ))}

      {/* Center seed dots */}
      <circle cx="32" cy="32" r="4" stroke={color} strokeWidth="0.5" fill="none" opacity="0.3" />
      {[0, 60, 120, 180, 240, 300].map((angle) => {
        const r = 2.2
        const x = 32 + r * Math.cos((angle * Math.PI) / 180)
        const y = 32 + r * Math.sin((angle * Math.PI) / 180)
        return <circle key={`seed-${angle}`} cx={x} cy={y} r="0.6" fill={color} opacity="0.35" />
      })}
      <circle cx="32" cy="32" r="0.8" fill={color} opacity="0.4" />
    </svg>
  )
}
