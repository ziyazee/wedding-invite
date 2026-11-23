interface SvgProps {
  className?: string
  width?: number
}

export function DoorInlaySvg({ className, width = 80 }: SvgProps) {
  return (
    <svg className={className} viewBox="0 0 80 160" width={width} fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Outer frame */}
      <rect x="2" y="2" width="76" height="156" rx="4" stroke="currentColor" strokeWidth="0.5" opacity="0.2" />
      {/* Inner arch panel */}
      <path d="M 12 156 V 50 Q 12 14 40 12 Q 68 14 68 50 V 156" stroke="currentColor" strokeWidth="0.6" opacity="0.3" />
      {/* Central 8-pointed star */}
      <g transform="translate(40, 70)" opacity="0.35">
        <path d="M 0 -18 L 5.4 -5.4 L 18 0 L 5.4 5.4 L 0 18 L -5.4 5.4 L -18 0 L -5.4 -5.4 Z" stroke="currentColor" strokeWidth="0.5" />
        <path d="M 0 -18 L 5.4 -5.4 L 18 0 L 5.4 5.4 L 0 18 L -5.4 5.4 L -18 0 L -5.4 -5.4 Z" stroke="currentColor" strokeWidth="0.5" transform="rotate(22.5)" />
        <circle r="4" stroke="currentColor" strokeWidth="0.5" />
        <circle r="1.5" fill="currentColor" opacity="0.5" />
      </g>
      {/* Upper diamond */}
      <g transform="translate(40, 36)" opacity="0.25">
        <path d="M 0 -8 L 8 0 L 0 8 L -8 0 Z" stroke="currentColor" strokeWidth="0.5" />
        <circle r="1.5" fill="currentColor" opacity="0.4" />
      </g>
      {/* Lower diamond */}
      <g transform="translate(40, 110)" opacity="0.25">
        <path d="M 0 -8 L 8 0 L 0 8 L -8 0 Z" stroke="currentColor" strokeWidth="0.5" />
        <circle r="1.5" fill="currentColor" opacity="0.4" />
      </g>
      {/* Horizontal lattice lines */}
      <line x1="18" y1="90" x2="62" y2="90" stroke="currentColor" strokeWidth="0.3" opacity="0.15" />
      <line x1="18" y1="50" x2="62" y2="50" stroke="currentColor" strokeWidth="0.3" opacity="0.15" />
      {/* Corner dots */}
      <circle cx="18" cy="136" r="1" fill="currentColor" opacity="0.2" />
      <circle cx="62" cy="136" r="1" fill="currentColor" opacity="0.2" />
    </svg>
  )
}

export function OrnamentDividerSvg({ className, width = 200 }: SvgProps) {
  const cx = width / 2
  const h = 20
  return (
    <svg className={className} viewBox={`0 0 ${width} ${h}`} width={width} height={h} fill="none" xmlns="http://www.w3.org/2000/svg">
      <line x1={cx - 50} y1={h / 2} x2={cx - 12} y2={h / 2} stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
      <line x1={cx + 12} y1={h / 2} x2={cx + 50} y2={h / 2} stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
      <path d={`M ${cx} ${h / 2 - 4} L ${cx + 4} ${h / 2} L ${cx} ${h / 2 + 4} L ${cx - 4} ${h / 2} Z`} stroke="currentColor" strokeWidth="0.6" opacity="0.4" />
      <circle cx={cx} cy={h / 2} r="1.2" fill="currentColor" opacity="0.35" />
    </svg>
  )
}

export function CrescentStarSvg({ className, width = 48 }: SvgProps) {
  return (
    <svg className={className} viewBox="0 0 48 48" width={width} fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M 28 6 A 18 18 0 1 0 28 42 A 14 14 0 1 1 28 6"
        stroke="currentColor"
        strokeWidth="1"
        opacity="0.5"
      />
      <path
        d="M 34 18 L 35.2 21.7 L 39 22 L 36 24.6 L 37 28.3 L 34 26.2 L 31 28.3 L 32 24.6 L 29 22 L 32.8 21.7 Z"
        fill="currentColor"
        opacity="0.4"
      />
    </svg>
  )
}

export function IslamicArchSvg({ className, width = 40 }: SvgProps) {
  return (
    <svg className={className} viewBox="0 0 40 52" width={width} fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M 4 52 V 22 Q 4 4 20 2 Q 36 4 36 22 V 52" stroke="currentColor" strokeWidth="1" opacity="0.4" />
      <path d="M 8 52 V 24 Q 8 8 20 6 Q 32 8 32 24 V 52" stroke="currentColor" strokeWidth="0.5" opacity="0.2" />
      <circle cx="20" cy="20" r="2" fill="currentColor" opacity="0.25" />
    </svg>
  )
}

export function LanternSvg({ className, width = 32 }: SvgProps) {
  const h = width * 2
  return (
    <svg className={className} viewBox={`0 0 ${width} ${h}`} width={width} fill="none" xmlns="http://www.w3.org/2000/svg">
      <line x1={width / 2} y1="0" x2={width / 2} y2={h * 0.15} stroke="currentColor" strokeWidth="0.75" opacity="0.35" />
      <path d={`M ${width * 0.3} ${h * 0.15} Q ${width / 2} ${h * 0.1} ${width * 0.7} ${h * 0.15}`} stroke="currentColor" strokeWidth="0.8" opacity="0.4" />
      <path
        d={`M ${width * 0.25} ${h * 0.18} Q ${width * 0.15} ${h * 0.5} ${width * 0.25} ${h * 0.8} L ${width * 0.75} ${h * 0.8} Q ${width * 0.85} ${h * 0.5} ${width * 0.75} ${h * 0.18} Z`}
        stroke="currentColor"
        strokeWidth="0.8"
        opacity="0.3"
      />
      <ellipse cx={width / 2} cy={h * 0.48} rx={width * 0.1} ry={h * 0.08} fill="currentColor" opacity="0.12" />
      <path d={`M ${width * 0.35} ${h * 0.8} L ${width / 2} ${h * 0.9} L ${width * 0.65} ${h * 0.8}`} stroke="currentColor" strokeWidth="0.6" opacity="0.3" />
      <circle cx={width / 2} cy={h * 0.93} r="1.2" fill="currentColor" opacity="0.25" />
    </svg>
  )
}

export function MoroccanTileSvg({ className, width = 120 }: SvgProps) {
  return (
    <svg className={className} viewBox="0 0 120 120" width={width} fill="none" xmlns="http://www.w3.org/2000/svg" opacity="0.1">
      <path d="M 60 15 L 67 40 L 90 30 L 80 53 L 105 60 L 80 67 L 90 90 L 67 80 L 60 105 L 53 80 L 30 90 L 40 67 L 15 60 L 40 53 L 30 30 L 53 40 Z" stroke="currentColor" strokeWidth="0.5" />
      <path d="M 60 35 L 64 50 L 78 44 L 70 56 L 85 60 L 70 64 L 78 76 L 64 70 L 60 85 L 56 70 L 42 76 L 50 64 L 35 60 L 50 56 L 42 44 L 56 50 Z" stroke="currentColor" strokeWidth="0.35" />
      <circle cx="60" cy="60" r="5" stroke="currentColor" strokeWidth="0.4" />
    </svg>
  )
}

export function SectionDividerSvg({ className, width = 240 }: SvgProps) {
  const h = width * 32 / 240
  return (
    <svg className={className} viewBox="0 0 240 32" width={width} height={h} fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M20 16 C38 16 52 9 78 16 C52 23 38 16 20 16" stroke="currentColor" strokeWidth="0.5" opacity="0.2" />
      <line x1="0" y1="16" x2="78" y2="16" stroke="currentColor" strokeWidth="0.35" opacity="0.18" />
      <path d="M220 16 C202 16 188 9 162 16 C188 23 202 16 220 16" stroke="currentColor" strokeWidth="0.5" opacity="0.2" />
      <line x1="162" y1="16" x2="240" y2="16" stroke="currentColor" strokeWidth="0.35" opacity="0.18" />
      <path d="M120 4 L132 16 L120 28 L108 16 Z" stroke="currentColor" strokeWidth="0.6" opacity="0.3" />
      <path d="M120 8 L128 16 L120 24 L112 16 Z" stroke="currentColor" strokeWidth="0.35" opacity="0.18" />
      <circle cx="120" cy="16" r="2" fill="currentColor" opacity="0.22" />
      <circle cx="86" cy="16" r="1" fill="currentColor" opacity="0.15" />
      <circle cx="154" cy="16" r="1" fill="currentColor" opacity="0.15" />
    </svg>
  )
}

export function ScrollHintSvg({ className, width = 20 }: SvgProps) {
  return (
    <svg className={className} viewBox="0 0 20 32" width={width} fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="1" y="1" width="18" height="30" rx="9" stroke="currentColor" strokeWidth="1" opacity="0.35" />
      <circle cx="10" cy="10" r="2" fill="currentColor" opacity="0.4" className="nn-scroll-dot" />
    </svg>
  )
}
