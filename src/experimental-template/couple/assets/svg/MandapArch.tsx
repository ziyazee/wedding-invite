export function MandapArch({ style, className }: { style?: React.CSSProperties; className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 200 250"
      style={style}
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="cp-svg-arch-gold" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#E0CFA0" />
          <stop offset="40%" stopColor="#C9A84C" />
          <stop offset="100%" stopColor="#E0CFA0" stopOpacity="0.6" />
        </linearGradient>
        <linearGradient id="cp-svg-arch-pillar" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#C9A84C" stopOpacity="0.4" />
          <stop offset="50%" stopColor="#E0CFA0" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#C9A84C" stopOpacity="0.4" />
        </linearGradient>
      </defs>

      {/* Dome / top finial */}
      <path
        d="M100 8 C98 8, 96 10, 96 14 C96 16, 98 18, 100 18 C102 18, 104 16, 104 14 C104 10, 102 8, 100 8Z"
        fill="url(#cp-svg-arch-gold)" opacity="0.7"
      />
      <line x1="100" y1="4" x2="100" y2="8" stroke="#C9A84C" strokeWidth="0.6" opacity="0.6" />
      <circle cx="100" cy="4" r="1.2" fill="#E0CFA0" opacity="0.6" />

      {/* Main arch curve */}
      <path
        d="M30 100 C30 40, 60 18, 100 18 C140 18, 170 40, 170 100"
        fill="none" stroke="url(#cp-svg-arch-gold)" strokeWidth="1.2"
      />
      {/* Inner arch echo */}
      <path
        d="M36 100 C36 46, 64 24, 100 24 C136 24, 164 46, 164 100"
        fill="none" stroke="#C9A84C" strokeWidth="0.5" opacity="0.35"
      />
      {/* Outer arch echo */}
      <path
        d="M24 100 C24 34, 56 12, 100 12 C144 12, 176 34, 176 100"
        fill="none" stroke="#C9A84C" strokeWidth="0.4" opacity="0.2"
      />

      {/* Scallop detail along inner arch */}
      <path
        d="M44 88 C48 82, 52 80, 56 82 C60 80, 64 78, 68 80 C72 78, 76 76, 80 78 C84 76, 88 74, 92 76 C96 74, 100 72, 104 74 C108 72, 112 74, 116 76 C120 74, 124 76, 128 78 C132 76, 136 78, 140 80 C144 78, 148 80, 152 82 C156 80, 160 84, 158 88"
        fill="none" stroke="#E0CFA0" strokeWidth="0.4" opacity="0.3"
      />

      {/* Left pillar */}
      <rect x="24" y="100" width="12" height="130" fill="url(#cp-svg-arch-pillar)" opacity="0.4" rx="1" />
      <line x1="24" y1="100" x2="36" y2="100" stroke="#C9A84C" strokeWidth="0.6" opacity="0.5" />
      <line x1="24" y1="230" x2="36" y2="230" stroke="#C9A84C" strokeWidth="0.6" opacity="0.5" />
      {/* Pillar ornament bands */}
      <rect x="26" y="110" width="8" height="2" rx="0.5" fill="#C9A84C" opacity="0.3" />
      <rect x="26" y="140" width="8" height="1" rx="0.5" fill="#E0CFA0" opacity="0.2" />
      <rect x="26" y="170" width="8" height="1" rx="0.5" fill="#E0CFA0" opacity="0.2" />
      <rect x="26" y="200" width="8" height="2" rx="0.5" fill="#C9A84C" opacity="0.3" />

      {/* Right pillar */}
      <rect x="164" y="100" width="12" height="130" fill="url(#cp-svg-arch-pillar)" opacity="0.4" rx="1" />
      <line x1="164" y1="100" x2="176" y2="100" stroke="#C9A84C" strokeWidth="0.6" opacity="0.5" />
      <line x1="164" y1="230" x2="176" y2="230" stroke="#C9A84C" strokeWidth="0.6" opacity="0.5" />
      {/* Pillar ornament bands */}
      <rect x="166" y="110" width="8" height="2" rx="0.5" fill="#C9A84C" opacity="0.3" />
      <rect x="166" y="140" width="8" height="1" rx="0.5" fill="#E0CFA0" opacity="0.2" />
      <rect x="166" y="170" width="8" height="1" rx="0.5" fill="#E0CFA0" opacity="0.2" />
      <rect x="166" y="200" width="8" height="2" rx="0.5" fill="#C9A84C" opacity="0.3" />

      {/* Pillar bases — ornamental */}
      <path d="M20 230 L40 230 L38 240 L22 240Z" fill="none" stroke="#C9A84C" strokeWidth="0.6" opacity="0.4" />
      <path d="M18 240 L42 240 L40 246 L20 246Z" fill="none" stroke="#C9A84C" strokeWidth="0.5" opacity="0.3" />
      <path d="M160 230 L180 230 L178 240 L162 240Z" fill="none" stroke="#C9A84C" strokeWidth="0.6" opacity="0.4" />
      <path d="M158 240 L182 240 L180 246 L160 246Z" fill="none" stroke="#C9A84C" strokeWidth="0.5" opacity="0.3" />

      {/* Keystone accent at top of arch */}
      <path d="M96 22 L100 16 L104 22Z" fill="none" stroke="#E0CFA0" strokeWidth="0.5" opacity="0.4" />

      {/* Corner filigree where arch meets pillars */}
      <path d="M36 100 C40 96, 38 92, 34 94" fill="none" stroke="#E0CFA0" strokeWidth="0.4" opacity="0.3" />
      <path d="M164 100 C160 96, 162 92, 166 94" fill="none" stroke="#E0CFA0" strokeWidth="0.4" opacity="0.3" />

      {/* Tiny decorative dots along arch */}
      <circle cx="60" cy="48" r="0.8" fill="#E0CFA0" opacity="0.3" />
      <circle cx="80" cy="32" r="0.8" fill="#E0CFA0" opacity="0.3" />
      <circle cx="120" cy="32" r="0.8" fill="#E0CFA0" opacity="0.3" />
      <circle cx="140" cy="48" r="0.8" fill="#E0CFA0" opacity="0.3" />
    </svg>
  );
}
