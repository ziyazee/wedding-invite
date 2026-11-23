export function LotusOrnament({ style, className }: { style?: React.CSSProperties; className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 120 80"
      style={style}
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="cp-svg-lotus-gold" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#E0CFA0" />
          <stop offset="50%" stopColor="#C9A84C" />
          <stop offset="100%" stopColor="#E0CFA0" />
        </linearGradient>
        <linearGradient id="cp-svg-lotus-inner" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#C9A84C" />
          <stop offset="100%" stopColor="#A8893A" />
        </linearGradient>
        <radialGradient id="cp-svg-lotus-glow" cx="50%" cy="60%" r="40%">
          <stop offset="0%" stopColor="#E0CFA0" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#C9A84C" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Inner glow */}
      <ellipse cx="60" cy="50" rx="28" ry="18" fill="url(#cp-svg-lotus-glow)" />

      {/* Back petals — widest layer */}
      <path d="M60 22 C54 32, 28 40, 22 54 C28 50, 42 44, 60 42Z" fill="url(#cp-svg-lotus-gold)" opacity="0.5" />
      <path d="M60 22 C66 32, 92 40, 98 54 C92 50, 78 44, 60 42Z" fill="url(#cp-svg-lotus-gold)" opacity="0.5" />

      {/* Second layer petals */}
      <path d="M60 24 C55 33, 32 39, 28 50 C34 47, 46 43, 60 41Z" fill="url(#cp-svg-lotus-gold)" opacity="0.6" />
      <path d="M60 24 C65 33, 88 39, 92 50 C86 47, 74 43, 60 41Z" fill="url(#cp-svg-lotus-gold)" opacity="0.6" />

      {/* Third layer — mid petals, wider spread */}
      <path d="M60 26 C52 36, 24 44, 18 56 C26 51, 40 45, 60 42Z" fill="url(#cp-svg-lotus-gold)" opacity="0.55" />
      <path d="M60 26 C68 36, 96 44, 102 56 C94 51, 80 45, 60 42Z" fill="url(#cp-svg-lotus-gold)" opacity="0.55" />

      {/* Fourth layer — inner petals */}
      <path d="M60 28 C56 36, 36 42, 32 52 C38 48, 48 44, 60 42Z" fill="url(#cp-svg-lotus-gold)" opacity="0.7" />
      <path d="M60 28 C64 36, 84 42, 88 52 C82 48, 72 44, 60 42Z" fill="url(#cp-svg-lotus-gold)" opacity="0.7" />

      {/* Fifth layer — tighter petals */}
      <path d="M60 30 C57 37, 40 43, 38 50 C42 47, 50 44, 60 42Z" fill="url(#cp-svg-lotus-inner)" opacity="0.75" />
      <path d="M60 30 C63 37, 80 43, 82 50 C78 47, 70 44, 60 42Z" fill="url(#cp-svg-lotus-inner)" opacity="0.75" />

      {/* Center top petal */}
      <path d="M60 18 C57 28, 54 36, 60 42 C66 36, 63 28, 60 18Z" fill="url(#cp-svg-lotus-inner)" opacity="0.85" />

      {/* Center bud detail */}
      <ellipse cx="60" cy="42" rx="5" ry="3.5" fill="#C9A84C" opacity="0.9" />
      <ellipse cx="60" cy="42" rx="2.5" ry="1.8" fill="#E0CFA0" opacity="0.7" />

      {/* Fine vein lines on center petals */}
      <line x1="60" y1="22" x2="60" y2="40" stroke="#E0CFA0" strokeWidth="0.3" opacity="0.4" />
      <line x1="56" y1="30" x2="52" y2="42" stroke="#E0CFA0" strokeWidth="0.25" opacity="0.3" />
      <line x1="64" y1="30" x2="68" y2="42" stroke="#E0CFA0" strokeWidth="0.25" opacity="0.3" />

      {/* Base leaves */}
      <path d="M60 44 C52 48, 30 52, 20 58 C30 56, 44 52, 60 48Z" fill="#C9A84C" opacity="0.3" />
      <path d="M60 44 C68 48, 90 52, 100 58 C90 56, 76 52, 60 48Z" fill="#C9A84C" opacity="0.3" />

      {/* Tiny accent dots along base curve */}
      <circle cx="35" cy="52" r="0.8" fill="#E0CFA0" opacity="0.5" />
      <circle cx="45" cy="48" r="0.6" fill="#E0CFA0" opacity="0.5" />
      <circle cx="75" cy="48" r="0.6" fill="#E0CFA0" opacity="0.5" />
      <circle cx="85" cy="52" r="0.8" fill="#E0CFA0" opacity="0.5" />
    </svg>
  );
}
