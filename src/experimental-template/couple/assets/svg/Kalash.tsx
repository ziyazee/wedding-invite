export function Kalash({ style, className }: { style?: React.CSSProperties; className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 80 110"
      style={style}
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="cp-svg-kalash-gold" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#E0CFA0" />
          <stop offset="50%" stopColor="#C9A84C" />
          <stop offset="100%" stopColor="#E0CFA0" stopOpacity="0.7" />
        </linearGradient>
      </defs>

      {/* Mango leaves fanning out */}
      <path d="M40 28 Q30 14, 20 8 Q22 16, 28 24" fill="none" stroke="#C9A84C" strokeWidth="0.7" opacity="0.5" />
      <path d="M40 28 Q34 12, 28 4 Q32 14, 36 24" fill="none" stroke="#C9A84C" strokeWidth="0.7" opacity="0.5" />
      <path d="M40 28 Q46 12, 52 4 Q48 14, 44 24" fill="none" stroke="#C9A84C" strokeWidth="0.7" opacity="0.5" />
      <path d="M40 28 Q50 14, 60 8 Q58 16, 52 24" fill="none" stroke="#C9A84C" strokeWidth="0.7" opacity="0.5" />
      {/* Center leaf */}
      <path d="M40 28 Q40 10, 40 2" fill="none" stroke="#E0CFA0" strokeWidth="0.8" opacity="0.6" />

      {/* Coconut on top */}
      <circle cx="40" cy="30" r="7" fill="none" stroke="url(#cp-svg-kalash-gold)" strokeWidth="1" />
      <circle cx="40" cy="30" r="4" fill="none" stroke="#E0CFA0" strokeWidth="0.4" opacity="0.3" />
      {/* Coconut tuft */}
      <path d="M38 24 Q40 22, 42 24" fill="none" stroke="#C9A84C" strokeWidth="0.5" opacity="0.4" />

      {/* Pot neck */}
      <path
        d="M32 37 L32 42 Q32 44, 34 44 L46 44 Q48 44, 48 42 L48 37"
        fill="none" stroke="url(#cp-svg-kalash-gold)" strokeWidth="1"
      />

      {/* Pot rim decoration */}
      <line x1="30" y1="44" x2="50" y2="44" stroke="#E0CFA0" strokeWidth="0.6" opacity="0.4" />
      <line x1="30" y1="46" x2="50" y2="46" stroke="#C9A84C" strokeWidth="0.4" opacity="0.3" />

      {/* Pot body — rounded belly */}
      <path
        d="M30 46 Q28 50, 22 62 Q18 72, 20 80 Q22 88, 30 92 L50 92 Q58 88, 60 80 Q62 72, 58 62 Q52 50, 50 46"
        fill="none" stroke="url(#cp-svg-kalash-gold)" strokeWidth="1.2"
      />

      {/* Belly decoration — horizontal bands */}
      <path d="M24 65 Q40 62, 56 65" fill="none" stroke="#E0CFA0" strokeWidth="0.5" opacity="0.3" />
      <path d="M22 75 Q40 72, 58 75" fill="none" stroke="#E0CFA0" strokeWidth="0.5" opacity="0.3" />

      {/* Belly center — Om or floral motif */}
      <circle cx="40" cy="70" r="6" fill="none" stroke="#C9A84C" strokeWidth="0.5" opacity="0.35" />
      <path
        d="M37 70 Q38 67, 40 68 Q42 67, 43 70 Q42 72, 40 71 Q38 72, 37 70"
        fill="none" stroke="#E0CFA0" strokeWidth="0.5" opacity="0.4"
      />

      {/* Pot base */}
      <path
        d="M28 92 Q28 96, 32 98 L48 98 Q52 96, 52 92"
        fill="none" stroke="url(#cp-svg-kalash-gold)" strokeWidth="1"
      />

      {/* Base platform */}
      <line x1="26" y1="98" x2="54" y2="98" stroke="#C9A84C" strokeWidth="0.8" opacity="0.5" />
      <line x1="28" y1="100" x2="52" y2="100" stroke="#E0CFA0" strokeWidth="0.5" opacity="0.3" />

      {/* Water drops / prosperity symbols */}
      <circle cx="26" cy="56" r="1" fill="#E0CFA0" opacity="0.2" />
      <circle cx="54" cy="56" r="1" fill="#E0CFA0" opacity="0.2" />
      <circle cx="20" cy="82" r="0.8" fill="#E0CFA0" opacity="0.15" />
      <circle cx="60" cy="82" r="0.8" fill="#E0CFA0" opacity="0.15" />
    </svg>
  );
}
