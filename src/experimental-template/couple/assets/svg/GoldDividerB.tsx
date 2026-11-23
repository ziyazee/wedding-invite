export function GoldDividerB({ style, className }: { style?: React.CSSProperties; className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 240 30"
      style={style}
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="cp-svg-divB-fade" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#C9A84C" stopOpacity="0" />
          <stop offset="30%" stopColor="#C9A84C" stopOpacity="0.6" />
          <stop offset="50%" stopColor="#E0CFA0" />
          <stop offset="70%" stopColor="#C9A84C" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#C9A84C" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Main thin line */}
      <line x1="15" y1="15" x2="225" y2="15" stroke="url(#cp-svg-divB-fade)" strokeWidth="0.4" />

      {/* Central lotus bud */}
      <path d="M120 7 C118 10, 116 13, 120 15 C124 13, 122 10, 120 7Z" fill="#C9A84C" opacity="0.7" />
      <path d="M120 7 C117 11, 114 14, 120 16 C126 14, 123 11, 120 7Z" fill="none" stroke="#E0CFA0" strokeWidth="0.4" opacity="0.5" />

      {/* Side petals on bud */}
      <path d="M116 12 C113 10, 110 12, 112 15 C114 14, 116 13, 116 12Z" fill="#C9A84C" opacity="0.45" />
      <path d="M124 12 C127 10, 130 12, 128 15 C126 14, 124 13, 124 12Z" fill="#C9A84C" opacity="0.45" />

      {/* Tiny center dot */}
      <circle cx="120" cy="12" r="0.8" fill="#E0CFA0" opacity="0.6" />

      {/* Left leaf accents */}
      <path d="M100 15 C96 12, 90 13, 92 15 C90 17, 96 18, 100 15Z" fill="#C9A84C" opacity="0.3" />
      <path d="M78 15 C75 13, 70 14, 72 15 C70 16, 75 17, 78 15Z" fill="#C9A84C" opacity="0.22" />

      {/* Right leaf accents (mirrored) */}
      <path d="M140 15 C144 12, 150 13, 148 15 C150 17, 144 18, 140 15Z" fill="#C9A84C" opacity="0.3" />
      <path d="M162 15 C165 13, 170 14, 168 15 C170 16, 165 17, 162 15Z" fill="#C9A84C" opacity="0.22" />

      {/* Fine dots along line */}
      <circle cx="60" cy="15" r="0.5" fill="#C9A84C" opacity="0.25" />
      <circle cx="40" cy="15" r="0.4" fill="#E0CFA0" opacity="0.2" />
      <circle cx="180" cy="15" r="0.5" fill="#C9A84C" opacity="0.25" />
      <circle cx="200" cy="15" r="0.4" fill="#E0CFA0" opacity="0.2" />
    </svg>
  );
}
