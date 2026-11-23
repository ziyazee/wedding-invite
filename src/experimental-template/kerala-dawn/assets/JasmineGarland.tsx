/* Kerala Dawn — Jasmine Garland (Mulla Mala)
   Decorative strand of jasmine flowers in a catenary arc */

interface JasmineGarlandProps {
  className?: string
  width?: number
  color?: string
  style?: React.CSSProperties
}

export default function JasmineGarland({
  className,
  width = 200,
  color = 'var(--kd-kasavu-light)',
  style,
}: JasmineGarlandProps) {
  const h = 28
  const flowers: Array<{ x: number; y: number; r: number }> = []

  // Generate 14 flowers along a catenary curve
  for (let i = 0; i <= 13; i++) {
    const t = i / 13
    const x = t * (width - 10) + 5
    // Catenary sag: deepest at center
    const sag = 12 * Math.sin(t * Math.PI)
    const y = 6 + sag
    const r = i % 2 === 0 ? 3 : 2.2 // alternating larger and smaller
    flowers.push({ x, y, r })
  }

  return (
    <svg
      className={className}
      style={style}
      width={width}
      height={h}
      viewBox={`0 0 ${width} ${h}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      role="presentation"
    >
      {/* Connecting thread */}
      <path
        d={`M${flowers[0].x},${flowers[0].y} ${flowers
          .map((f) => `L${f.x},${f.y}`)
          .join(' ')}`}
        stroke={color}
        strokeWidth="0.5"
        opacity="0.2"
        fill="none"
      />

      {/* Flower circles */}
      {flowers.map((f, i) => (
        <circle
          key={i}
          cx={f.x}
          cy={f.y}
          r={f.r}
          fill={color}
          opacity="0.3"
        />
      ))}
    </svg>
  )
}
