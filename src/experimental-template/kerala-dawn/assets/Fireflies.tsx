/* Kerala Dawn -- Ambient Floating Fireflies / Lamp Sparks
   Golden particles that drift across sections using pure SVG <animate>.
   No requestAnimationFrame loops. Respects prefers-reduced-motion via CSS. */

interface FirefliesProps {
  count?: number
  className?: string
}

/** Fixed particle configs -- deterministic, SSR-safe, no Math.random(). */
const PARTICLES = [
  { cx: 8,  cy: 12, r: 1.6, durX: 18, durY: 22, dx: 6,  dy: -8,  peak: 0.55, delay: 0 },
  { cx: 25, cy: 35, r: 1.2, durX: 22, durY: 18, dx: -5, dy: -10, peak: 0.40, delay: 2 },
  { cx: 42, cy: 8,  r: 1.8, durX: 20, durY: 24, dx: 7,  dy: -6,  peak: 0.50, delay: 4 },
  { cx: 60, cy: 55, r: 1.0, durX: 24, durY: 20, dx: -4, dy: -12, peak: 0.35, delay: 1 },
  { cx: 78, cy: 22, r: 1.5, durX: 19, durY: 26, dx: 5,  dy: -7,  peak: 0.45, delay: 3 },
  { cx: 92, cy: 68, r: 1.3, durX: 21, durY: 19, dx: -6, dy: -9,  peak: 0.38, delay: 5 },
  { cx: 15, cy: 78, r: 1.7, durX: 23, durY: 21, dx: 4,  dy: -11, peak: 0.52, delay: 2.5 },
  { cx: 55, cy: 42, r: 1.1, durX: 17, durY: 23, dx: -7, dy: -5,  peak: 0.42, delay: 6 },
  { cx: 35, cy: 90, r: 1.4, durX: 25, durY: 17, dx: 3,  dy: -8,  peak: 0.48, delay: 1.5 },
  { cx: 70, cy: 5,  r: 1.9, durX: 16, durY: 25, dx: -3, dy: -6,  peak: 0.55, delay: 4.5 },
  { cx: 88, cy: 45, r: 1.0, durX: 22, durY: 20, dx: 5,  dy: -10, peak: 0.30, delay: 7 },
  { cx: 48, cy: 72, r: 1.6, durX: 20, durY: 22, dx: -5, dy: -7,  peak: 0.46, delay: 3.5 },
  { cx: 5,  cy: 50, r: 1.2, durX: 18, durY: 24, dx: 6,  dy: -9,  peak: 0.38, delay: 8 },
  { cx: 95, cy: 85, r: 1.3, durX: 24, durY: 18, dx: -4, dy: -11, peak: 0.44, delay: 5.5 },
  { cx: 30, cy: 60, r: 1.5, durX: 21, durY: 19, dx: 7,  dy: -6,  peak: 0.50, delay: 0.5 },
]

export default function Fireflies({ count = 15, className }: FirefliesProps) {
  const particles = PARTICLES.slice(0, count)

  return (
    <svg
      className={`kd-fireflies ${className || ''}`}
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      role="presentation"
    >
      {particles.map((p, i) => (
        <circle key={i} cx={p.cx} cy={p.cy} r={p.r} fill="var(--kd-lamp-gold)" opacity={0}>
          {/* Horizontal drift */}
          <animate
            attributeName="cx"
            values={`${p.cx};${p.cx + p.dx};${p.cx - p.dx * 0.3};${p.cx}`}
            dur={`${p.durX}s`}
            begin={`${p.delay}s`}
            repeatCount="indefinite"
          />
          {/* Vertical drift */}
          <animate
            attributeName="cy"
            values={`${p.cy};${p.cy + p.dy};${p.cy}`}
            dur={`${p.durY}s`}
            begin={`${p.delay}s`}
            repeatCount="indefinite"
          />
          {/* Fade in/out pulse */}
          <animate
            attributeName="opacity"
            values={`0;${p.peak};${p.peak * 0.5};${p.peak};0`}
            dur={`${p.durX}s`}
            begin={`${p.delay}s`}
            repeatCount="indefinite"
          />
        </circle>
      ))}
    </svg>
  )
}
