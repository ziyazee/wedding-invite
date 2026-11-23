export function GoldDividerA({ style, className }: { style?: React.CSSProperties; className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 300 40"
      style={style}
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="cp-svg-divA-gold" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#C9A84C" stopOpacity="0" />
          <stop offset="20%" stopColor="#C9A84C" />
          <stop offset="50%" stopColor="#E0CFA0" />
          <stop offset="80%" stopColor="#C9A84C" />
          <stop offset="100%" stopColor="#C9A84C" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="cp-svg-divA-diamond" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#E0CFA0" />
          <stop offset="50%" stopColor="#C9A84C" />
          <stop offset="100%" stopColor="#E0CFA0" />
        </linearGradient>
      </defs>

      {/* Main horizontal line */}
      <line x1="10" y1="20" x2="290" y2="20" stroke="url(#cp-svg-divA-gold)" strokeWidth="0.5" />

      {/* Central diamond mandala */}
      <path d="M150 8 L162 20 L150 32 L138 20Z" fill="none" stroke="url(#cp-svg-divA-diamond)" strokeWidth="0.8" />
      <path d="M150 11 L159 20 L150 29 L141 20Z" fill="none" stroke="#C9A84C" strokeWidth="0.5" opacity="0.6" />
      <circle cx="150" cy="20" r="3" fill="url(#cp-svg-divA-diamond)" opacity="0.7" />
      <circle cx="150" cy="20" r="1.2" fill="#E0CFA0" opacity="0.8" />

      {/* Diamond corner accents */}
      <circle cx="150" cy="8" r="1" fill="#C9A84C" opacity="0.5" />
      <circle cx="162" cy="20" r="1" fill="#C9A84C" opacity="0.5" />
      <circle cx="150" cy="32" r="1" fill="#C9A84C" opacity="0.5" />
      <circle cx="138" cy="20" r="1" fill="#C9A84C" opacity="0.5" />

      {/* Left scrollwork */}
      <path
        d="M134 20 C130 20, 124 16, 118 16 C112 16, 108 20, 112 22 C116 24, 120 20, 116 18"
        fill="none" stroke="#C9A84C" strokeWidth="0.6" opacity="0.7"
      />
      <path
        d="M112 20 C108 20, 100 16, 94 18 C88 20, 86 24, 90 24 C94 24, 94 20, 90 20"
        fill="none" stroke="#C9A84C" strokeWidth="0.5" opacity="0.55"
      />
      <path
        d="M90 20 C84 20, 76 17, 70 19 C64 21, 62 24, 66 24"
        fill="none" stroke="#C9A84C" strokeWidth="0.4" opacity="0.4"
      />

      {/* Right scrollwork (mirrored) */}
      <path
        d="M166 20 C170 20, 176 16, 182 16 C188 16, 192 20, 188 22 C184 24, 180 20, 184 18"
        fill="none" stroke="#C9A84C" strokeWidth="0.6" opacity="0.7"
      />
      <path
        d="M188 20 C192 20, 200 16, 206 18 C212 20, 214 24, 210 24 C206 24, 206 20, 210 20"
        fill="none" stroke="#C9A84C" strokeWidth="0.5" opacity="0.55"
      />
      <path
        d="M210 20 C216 20, 224 17, 230 19 C236 21, 238 24, 234 24"
        fill="none" stroke="#C9A84C" strokeWidth="0.4" opacity="0.4"
      />

      {/* Accent dots along arms */}
      <circle cx="105" cy="20" r="0.8" fill="#E0CFA0" opacity="0.4" />
      <circle cx="80" cy="20" r="0.6" fill="#E0CFA0" opacity="0.3" />
      <circle cx="55" cy="20" r="0.5" fill="#E0CFA0" opacity="0.2" />
      <circle cx="195" cy="20" r="0.8" fill="#E0CFA0" opacity="0.4" />
      <circle cx="220" cy="20" r="0.6" fill="#E0CFA0" opacity="0.3" />
      <circle cx="245" cy="20" r="0.5" fill="#E0CFA0" opacity="0.2" />

      {/* Fine parallel lines flanking center */}
      <line x1="120" y1="16" x2="134" y2="16" stroke="#C9A84C" strokeWidth="0.25" opacity="0.3" />
      <line x1="120" y1="24" x2="134" y2="24" stroke="#C9A84C" strokeWidth="0.25" opacity="0.3" />
      <line x1="166" y1="16" x2="180" y2="16" stroke="#C9A84C" strokeWidth="0.25" opacity="0.3" />
      <line x1="166" y1="24" x2="180" y2="24" stroke="#C9A84C" strokeWidth="0.25" opacity="0.3" />

      {/* Outer terminal flourishes */}
      <path d="M30 20 C26 16, 20 18, 18 20 C16 22, 20 26, 24 22" fill="none" stroke="#C9A84C" strokeWidth="0.35" opacity="0.25" />
      <path d="M270 20 C274 16, 280 18, 282 20 C284 22, 280 26, 276 22" fill="none" stroke="#C9A84C" strokeWidth="0.35" opacity="0.25" />
    </svg>
  );
}
