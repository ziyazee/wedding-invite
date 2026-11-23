interface ArchDividerProps {
  className?: string
}

export default function ArchDivider({ className }: ArchDividerProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 400 70"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      style={{ width: '100%', maxWidth: 360, height: 'auto', display: 'block', margin: '0 auto' }}
    >
      {/* Outer smooth arch */}
      <path
        d="M120 62 Q200 2 280 62"
        stroke="currentColor"
        strokeWidth="1.0"
        fill="none"
        opacity="0.3"
      />
      {/* Inner cusped multifoil arch — 5-lobe profile */}
      <path
        d="M138 62
          Q148 40 160 36
          Q168 44 175 32
          Q183 40 200 18
          Q217 40 225 32
          Q232 44 240 36
          Q252 40 262 62"
        stroke="currentColor"
        strokeWidth="0.6"
        fill="none"
        opacity="0.22"
      />
      {/* Teardrop spandrel fills — left */}
      <path
        d="M140 58 Q155 38 165 42 Q152 50 146 58 Z"
        fill="currentColor"
        opacity="0.06"
      />
      {/* Teardrop spandrel fills — right */}
      <path
        d="M260 58 Q245 38 235 42 Q248 50 254 58 Z"
        fill="currentColor"
        opacity="0.06"
      />
      {/* Lotus bud finial at apex */}
      <path
        d="M200 8 Q197 3 200 0 Q203 3 200 8"
        fill="currentColor"
        opacity="0.3"
      />
      <path
        d="M196 10 Q194 5 196 3 Q198 6 200 8 Q202 6 204 3 Q206 5 204 10"
        fill="currentColor"
        opacity="0.2"
      />
      <ellipse cx="200" cy="11" rx="3" ry="1.5" fill="currentColor" opacity="0.15" />
      {/* Baseline with decorative dots */}
      <line x1="40" y1="62" x2="120" y2="62" stroke="currentColor" strokeWidth="0.5" opacity="0.15" />
      <line x1="280" y1="62" x2="360" y2="62" stroke="currentColor" strokeWidth="0.5" opacity="0.15" />
      {/* Baseline decorative dots */}
      {[40, 56, 72, 88, 104, 296, 312, 328, 344, 360].map((cx) => (
        <circle key={cx} cx={cx} cy="62" r="1" fill="currentColor" opacity="0.18" />
      ))}
      {/* Flanking smaller cusped arches — left */}
      <path
        d="M68 62 Q82 42 96 48 Q104 38 120 62"
        stroke="currentColor"
        strokeWidth="0.4"
        fill="none"
        opacity="0.12"
      />
      {/* Flanking smaller cusped arches — right */}
      <path
        d="M280 62 Q296 38 304 48 Q318 42 332 62"
        stroke="currentColor"
        strokeWidth="0.4"
        fill="none"
        opacity="0.12"
      />
      {/* Endpoint accents */}
      <circle cx="40" cy="62" r="1.8" fill="currentColor" opacity="0.2" />
      <circle cx="360" cy="62" r="1.8" fill="currentColor" opacity="0.2" />
    </svg>
  )
}
