export function MandalaPattern({ style, className }: { style?: React.CSSProperties; className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 400 400"
      style={style}
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="cp-svg-mandala-g" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#E0CFA0" stopOpacity="1" />
          <stop offset="50%" stopColor="#C9A84C" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#E0CFA0" stopOpacity="0.6" />
        </linearGradient>
      </defs>

      <g fill="none" stroke="url(#cp-svg-mandala-g)" opacity="1" transform="translate(200,200)">
        {/* Outer ring */}
        <circle r="180" strokeWidth="0.5" />
        <circle r="170" strokeWidth="0.3" strokeDasharray="4 6" />
        <circle r="160" strokeWidth="0.5" />

        {/* Outer petal ring — 16 petals */}
        {Array.from({ length: 16 }).map((_, i) => (
          <g key={`op-${i}`} transform={`rotate(${i * 22.5})`}>
            <path
              d="M0,-155 Q12,-140 0,-120 Q-12,-140 0,-155Z"
              fill="url(#cp-svg-mandala-g)"
              fillOpacity="0.15"
              strokeWidth="0.4"
            />
            <line x1="0" y1="-160" x2="0" y2="-180" strokeWidth="0.3" />
            <circle cx="0" cy="-183" r="1.2" fill="#C9A84C" fillOpacity="0.4" stroke="none" />
          </g>
        ))}

        {/* Middle ring */}
        <circle r="115" strokeWidth="0.5" />
        <circle r="108" strokeWidth="0.3" strokeDasharray="2 4" />

        {/* Middle petal ring — 12 petals */}
        {Array.from({ length: 12 }).map((_, i) => (
          <g key={`mp-${i}`} transform={`rotate(${i * 30})`}>
            <path
              d="M0,-110 Q15,-95 0,-75 Q-15,-95 0,-110Z"
              fill="url(#cp-svg-mandala-g)"
              fillOpacity="0.12"
              strokeWidth="0.4"
            />
            <path
              d="M0,-100 Q8,-92 0,-82 Q-8,-92 0,-100Z"
              fill="url(#cp-svg-mandala-g)"
              fillOpacity="0.08"
              strokeWidth="0.3"
            />
          </g>
        ))}

        {/* Inner decorative ring */}
        <circle r="68" strokeWidth="0.5" />
        <circle r="62" strokeWidth="0.3" />

        {/* Inner petal ring — 8 petals */}
        {Array.from({ length: 8 }).map((_, i) => (
          <g key={`ip-${i}`} transform={`rotate(${i * 45})`}>
            <path
              d="M0,-60 Q18,-45 0,-25 Q-18,-45 0,-60Z"
              fill="url(#cp-svg-mandala-g)"
              fillOpacity="0.1"
              strokeWidth="0.4"
            />
            <line x1="0" y1="-62" x2="0" y2="-68" strokeWidth="0.4" />
            <circle cx="0" cy="-55" r="1" fill="#E0CFA0" fillOpacity="0.3" stroke="none" />
          </g>
        ))}

        {/* Central lotus */}
        <circle r="20" strokeWidth="0.5" />
        {Array.from({ length: 8 }).map((_, i) => (
          <g key={`cl-${i}`} transform={`rotate(${i * 45})`}>
            <path
              d="M0,-18 Q6,-12 0,-4 Q-6,-12 0,-18Z"
              fill="url(#cp-svg-mandala-g)"
              fillOpacity="0.2"
              strokeWidth="0.3"
            />
          </g>
        ))}
        <circle r="5" fill="#C9A84C" fillOpacity="0.15" strokeWidth="0.4" />

        {/* Diamond accents between outer petals */}
        {Array.from({ length: 16 }).map((_, i) => (
          <g key={`da-${i}`} transform={`rotate(${i * 22.5 + 11.25})`}>
            <path
              d="M0,-140 L2,-137 L0,-134 L-2,-137Z"
              fill="#C9A84C"
              fillOpacity="0.25"
              stroke="none"
            />
          </g>
        ))}

        {/* Paisley accents at cardinal points */}
        {[0, 90, 180, 270].map((angle) => (
          <g key={`pa-${angle}`} transform={`rotate(${angle})`}>
            <path
              d="M-8,-130 Q-8,-142 0,-148 Q8,-142 8,-130 Q4,-132 0,-128 Q-4,-132 -8,-130Z"
              fill="none"
              strokeWidth="0.3"
              opacity="0.5"
            />
          </g>
        ))}
      </g>
    </svg>
  );
}
