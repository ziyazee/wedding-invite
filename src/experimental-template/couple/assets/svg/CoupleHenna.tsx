export function CoupleHenna({ style, className }: { style?: React.CSSProperties; className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 120 140"
      style={style}
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="cp-svg-henna-g" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#E0CFA0" />
          <stop offset="100%" stopColor="#C9A84C" stopOpacity="0.7" />
        </linearGradient>
      </defs>

      <g fill="none" stroke="url(#cp-svg-henna-g)" strokeLinecap="round" strokeLinejoin="round">
        {/* Bride — seated, showing decorated hands */}
        <ellipse cx="42" cy="26" rx="9" ry="10.5" strokeWidth="1.2" />
        <path d="M42 16 Q42 10 44 8" strokeWidth="0.8" />
        <path d="M33 36 Q30 50 28 65 Q27 75 30 85" strokeWidth="1.2" />
        <path d="M51 36 Q54 50 56 65 Q57 75 54 85" strokeWidth="1.2" />
        <path d="M30 85 Q42 92 54 85" strokeWidth="1" />

        {/* Bride's decorated hand — extended forward */}
        <path d="M28 65 Q22 62 16 64" strokeWidth="1" />
        <path d="M16 64 L14 62 M16 64 L13 64 M16 64 L14 66" strokeWidth="0.6" />
        {/* Henna patterns on hand */}
        <circle cx="20" cy="63" r="1.5" strokeWidth="0.5" />
        <circle cx="20" cy="63" r="3" strokeWidth="0.3" strokeDasharray="1 1.5" />
        <path d="M23 62 Q22 60 24 59" strokeWidth="0.4" />
        <path d="M17 65 Q16 67 18 68" strokeWidth="0.4" />

        {/* Bride dupatta/veil draping */}
        <path d="M33 22 Q25 28 22 45 Q20 55 22 65" strokeWidth="0.6" opacity="0.5" />
        <path d="M35 20 Q28 24 26 40" strokeWidth="0.5" opacity="0.4" />

        {/* Bangles on wrist */}
        <ellipse cx="24" cy="64" rx="3" ry="1.5" strokeWidth="0.5" />
        <ellipse cx="24" cy="65.5" rx="3" ry="1.5" strokeWidth="0.4" opacity="0.6" />

        {/* Groom — seated beside */}
        <ellipse cx="78" cy="26" rx="9" ry="10.5" strokeWidth="1.2" />
        <path d="M78 14 Q76 10 78 7 Q80 10 78 14" strokeWidth="0.8" fill="url(#cp-svg-henna-g)" fillOpacity="0.15" />
        <path d="M69 36 Q66 50 64 65 Q63 75 66 85" strokeWidth="1.2" />
        <path d="M87 36 Q90 50 92 65 Q93 75 90 85" strokeWidth="1.2" />
        <path d="M66 85 Q78 92 90 85" strokeWidth="1" />

        {/* Groom's hand holding bride's hand */}
        <path d="M64 65 Q58 63 52 64" strokeWidth="1" />
        <path d="M56 63 Q54 62 52 64 Q54 66 56 65" strokeWidth="0.6" />

        {/* Mehendi plate between them */}
        <ellipse cx="60" cy="95" rx="16" ry="5" strokeWidth="0.8" />
        <ellipse cx="60" cy="95" rx="12" ry="3.5" strokeWidth="0.4" opacity="0.5" />
        {/* Henna cone on plate */}
        <path d="M57 93 L60 82 L63 93" strokeWidth="0.6" fill="url(#cp-svg-henna-g)" fillOpacity="0.1" />
        <circle cx="60" cy="88" r="0.8" fill="#C9A84C" fillOpacity="0.3" stroke="none" />

        {/* Decorative floor rangoli dots */}
        <circle cx="35" cy="105" r="1" fill="#C9A84C" fillOpacity="0.2" stroke="none" />
        <circle cx="60" cy="108" r="1.2" fill="#E0CFA0" fillOpacity="0.15" stroke="none" />
        <circle cx="85" cy="105" r="1" fill="#C9A84C" fillOpacity="0.2" stroke="none" />
        <circle cx="45" cy="112" r="0.8" fill="#E0CFA0" fillOpacity="0.12" stroke="none" />
        <circle cx="75" cy="112" r="0.8" fill="#E0CFA0" fillOpacity="0.12" stroke="none" />
      </g>
    </svg>
  );
}
