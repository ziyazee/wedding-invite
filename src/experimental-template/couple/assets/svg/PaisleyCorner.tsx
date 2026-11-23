export function PaisleyCorner({ style, className }: { style?: React.CSSProperties; className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      style={style}
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="cp-svg-paisley-gold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#E0CFA0" />
          <stop offset="50%" stopColor="#C9A84C" />
          <stop offset="100%" stopColor="#E0CFA0" />
        </linearGradient>
      </defs>

      {/* Main paisley teardrop outline */}
      <path
        d="M85 15 C78 8, 62 5, 48 12 C34 19, 22 36, 18 52 C14 68, 18 82, 30 88 C42 94, 56 86, 62 72 C68 58, 66 42, 58 32 C50 22, 68 16, 85 15Z"
        fill="none"
        stroke="url(#cp-svg-paisley-gold)"
        strokeWidth="1.2"
      />

      {/* Inner paisley echo */}
      <path
        d="M78 20 C72 15, 60 12, 50 18 C40 24, 30 38, 26 50 C22 62, 26 74, 34 78 C42 82, 52 76, 56 66 C60 56, 58 44, 52 36 C46 28, 60 22, 78 20Z"
        fill="none"
        stroke="#C9A84C"
        strokeWidth="0.6"
        opacity="0.5"
      />

      {/* Filigree spiral inside paisley */}
      <path
        d="M68 26 C62 22, 54 22, 48 28 C42 34, 36 44, 34 54 C32 64, 36 70, 42 72 C48 74, 52 68, 52 60 C52 52, 48 46, 44 42"
        fill="none"
        stroke="#C9A84C"
        strokeWidth="0.5"
        opacity="0.4"
      />

      {/* Inner teardrop detail */}
      <path
        d="M58 30 C52 26, 44 30, 40 38 C36 46, 36 56, 40 62 C44 68, 50 66, 50 58 C50 50, 46 44, 42 40"
        fill="none"
        stroke="#E0CFA0"
        strokeWidth="0.4"
        opacity="0.35"
      />

      {/* Central flower motif inside paisley */}
      <circle cx="44" cy="48" r="4" fill="none" stroke="#C9A84C" strokeWidth="0.6" opacity="0.6" />
      <circle cx="44" cy="48" r="1.5" fill="#C9A84C" opacity="0.5" />
      {/* Mini petals around central dot */}
      <ellipse cx="44" cy="43" rx="1.2" ry="2.5" fill="#C9A84C" opacity="0.35" />
      <ellipse cx="44" cy="53" rx="1.2" ry="2.5" fill="#C9A84C" opacity="0.35" />
      <ellipse cx="39" cy="48" rx="2.5" ry="1.2" fill="#C9A84C" opacity="0.35" />
      <ellipse cx="49" cy="48" rx="2.5" ry="1.2" fill="#C9A84C" opacity="0.35" />

      {/* Filigree dots along outer edge */}
      <circle cx="62" cy="14" r="1" fill="#C9A84C" opacity="0.5" />
      <circle cx="52" cy="10" r="0.8" fill="#E0CFA0" opacity="0.4" />
      <circle cx="38" cy="14" r="0.8" fill="#E0CFA0" opacity="0.4" />
      <circle cx="28" cy="26" r="1" fill="#C9A84C" opacity="0.5" />
      <circle cx="22" cy="40" r="0.8" fill="#E0CFA0" opacity="0.4" />
      <circle cx="20" cy="56" r="1" fill="#C9A84C" opacity="0.5" />
      <circle cx="22" cy="70" r="0.8" fill="#E0CFA0" opacity="0.4" />
      <circle cx="30" cy="82" r="1" fill="#C9A84C" opacity="0.5" />

      {/* Trailing vine from paisley tip */}
      <path
        d="M85 15 C90 12, 94 16, 92 22 C90 28, 86 26, 88 20"
        fill="none"
        stroke="#C9A84C"
        strokeWidth="0.5"
        opacity="0.45"
      />
      <circle cx="92" cy="22" r="1.2" fill="#C9A84C" opacity="0.35" />

      {/* Bottom vine accent */}
      <path
        d="M30 88 C26 92, 20 94, 16 90 C12 86, 16 82, 20 86"
        fill="none"
        stroke="#C9A84C"
        strokeWidth="0.5"
        opacity="0.4"
      />
      <circle cx="16" cy="90" r="1" fill="#E0CFA0" opacity="0.3" />

      {/* Fine interior hash lines for texture */}
      <line x1="55" y1="24" x2="50" y2="30" stroke="#E0CFA0" strokeWidth="0.2" opacity="0.25" />
      <line x1="60" y1="28" x2="54" y2="34" stroke="#E0CFA0" strokeWidth="0.2" opacity="0.25" />
      <line x1="32" y1="52" x2="28" y2="58" stroke="#E0CFA0" strokeWidth="0.2" opacity="0.25" />
      <line x1="34" y1="62" x2="30" y2="68" stroke="#E0CFA0" strokeWidth="0.2" opacity="0.25" />
    </svg>
  );
}
