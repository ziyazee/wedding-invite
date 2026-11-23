/* Kerala Dawn — Kasavu Border Pattern
   Gold border of the Kerala mundu: two lines with diamond lozenges between */

interface KasavuBorderProps {
  className?: string
  width?: number | string
  height?: number
  color?: string
  style?: React.CSSProperties
}

export default function KasavuBorder({
  className,
  width = '100%',
  height = 12,
  color = 'var(--kd-lamp-gold)',
  style,
}: KasavuBorderProps) {
  const patternW = 12
  const diamondCount = 30 // enough to fill up to ~360px

  return (
    <svg
      className={className}
      style={style}
      width={width}
      height={height}
      viewBox={`0 0 ${patternW * diamondCount} ${height}`}
      preserveAspectRatio="none"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      role="presentation"
    >
      {/* Outer lines */}
      <line x1="0" y1="0.5" x2={patternW * diamondCount} y2="0.5" stroke={color} strokeWidth="1" opacity="0.3" />
      <line x1="0" y1={height - 0.5} x2={patternW * diamondCount} y2={height - 0.5} stroke={color} strokeWidth="1" opacity="0.3" />

      {/* Inner lines */}
      <line x1="0" y1="2.5" x2={patternW * diamondCount} y2="2.5" stroke={color} strokeWidth="0.5" opacity="0.5" />
      <line x1="0" y1={height - 2.5} x2={patternW * diamondCount} y2={height - 2.5} stroke={color} strokeWidth="0.5" opacity="0.5" />

      {/* Diamond lozenge pattern */}
      {Array.from({ length: diamondCount }).map((_, i) => {
        const cx = i * patternW + patternW / 2
        const cy = height / 2
        const outerR = (height - 5) / 2 // half the pattern zone height
        const innerR = outerR * 0.4
        return (
          <g key={i} className="kd-kasavu-pattern">
            {/* Outer diamond */}
            <polygon
              points={`${cx},${cy - outerR} ${cx + outerR},${cy} ${cx},${cy + outerR} ${cx - outerR},${cy}`}
              stroke={color}
              strokeWidth="0.75"
              fill="none"
              opacity="0.25"
            />
            {/* Inner diamond */}
            <polygon
              points={`${cx},${cy - innerR} ${cx + innerR},${cy} ${cx},${cy + innerR} ${cx - innerR},${cy}`}
              fill={color}
              opacity="0.08"
            />
            {/* Connection dot between diamonds */}
            <circle cx={cx + patternW / 2} cy={cy} r="0.8" fill={color} opacity="0.2" />
          </g>
        )
      })}
    </svg>
  )
}
