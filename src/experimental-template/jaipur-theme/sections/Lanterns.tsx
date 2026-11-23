import { useMemo } from 'react'

const LANTERN_COUNT = 14

interface LanternConfig {
  id: number
  left: number
  size: number
  duration: number
  delay: number
  drift: number
  opacity: number
  swayDuration: number
}

function seededRandom(seed: number) {
  const x = Math.sin(seed * 9301 + 49297) * 49297
  return x - Math.floor(x)
}

function generateLanterns(): LanternConfig[] {
  return Array.from({ length: LANTERN_COUNT }, (_, i) => ({
    id: i,
    left: seededRandom(i * 7 + 1) * 90 + 5,
    size: 30 + seededRandom(i * 3 + 2) * 26,
    duration: 26 + seededRandom(i * 5 + 3) * 30,
    delay: -(seededRandom(i * 11 + 4) * 45),
    drift: -20 + seededRandom(i * 13 + 5) * 40,
    opacity: 0.5 + seededRandom(i * 17 + 6) * 0.35,
    swayDuration: 3 + seededRandom(i * 19 + 7) * 4,
  }))
}

function LanternSVG({ id }: { id: number }) {
  const g = `jl${id}`
  return (
    <svg viewBox="0 0 36 40" fill="none" className="jt-lantern__svg">
      <defs>
        <radialGradient id={`${g}b`} cx="50%" cy="55%" r="55%">
          <stop offset="0%" stopColor="#FFF0C0" stopOpacity="1" />
          <stop offset="30%" stopColor="#FFD070" stopOpacity="0.95" />
          <stop offset="60%" stopColor="#E8A030" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#B07020" stopOpacity="0.7" />
        </radialGradient>
      </defs>

      {/* Lantern body — rounded rectangle / paper bag shape
           Slightly domed top, straight sides, flat open bottom */}
      <path
        d="M7 34
           L7 12
           C7 5 11 3 18 3
           C25 3 29 5 29 12
           L29 34
           Z"
        fill={`url(#${g}b)`}
      />

      {/* Bottom edge — darker rim of the opening */}
      <line x1="7" y1="34" x2="29" y2="34"
        stroke="#805020" strokeWidth="1" opacity="0.5" />

      {/* Faint vertical seam */}
      <line x1="18" y1="4" x2="18" y2="34"
        stroke="#C89040" strokeWidth="0.3" opacity="0.12" />
    </svg>
  )
}

export default function Lanterns() {
  const lanterns = useMemo(generateLanterns, [])

  return (
    <div className="jt-lanterns" aria-hidden="true">
      {lanterns.map((l) => (
        <div
          key={l.id}
          className="jt-lantern"
          style={{
            left: `${l.left}%`,
            width: `${l.size}px`,
            animationDuration: `${l.duration}s`,
            animationDelay: `${l.delay}s`,
            '--jt-lantern-drift': `${l.drift}px`,
            '--jt-lantern-opacity': l.opacity,
            '--jt-lantern-sway': `${l.swayDuration}s`,
          } as React.CSSProperties}
        >
          <LanternSVG id={l.id} />
        </div>
      ))}
    </div>
  )
}
