export function GaneshSymbol({ style, className }: { style?: React.CSSProperties; className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 120 140"
      style={style}
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="cp-svg-ganesh-gold" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#E0CFA0" />
          <stop offset="40%" stopColor="#C9A84C" />
          <stop offset="100%" stopColor="#E0CFA0" stopOpacity="0.8" />
        </linearGradient>
        <radialGradient id="cp-svg-ganesh-glow" cx="50%" cy="40%" r="50%">
          <stop offset="0%" stopColor="#E0CFA0" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#C9A84C" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Aura glow */}
      <ellipse cx="60" cy="65" rx="50" ry="55" fill="url(#cp-svg-ganesh-glow)" />

      {/* Head — rounded dome */}
      <ellipse cx="60" cy="42" rx="26" ry="28" fill="none" stroke="url(#cp-svg-ganesh-gold)" strokeWidth="1.2" />

      {/* Crown / tiara detail */}
      <path
        d="M42 30 Q46 18, 52 22 Q56 14, 60 20 Q64 14, 68 22 Q74 18, 78 30"
        fill="none" stroke="#E0CFA0" strokeWidth="0.8" opacity="0.6"
      />
      <circle cx="60" cy="16" r="2" fill="#C9A84C" opacity="0.5" />

      {/* Left ear */}
      <ellipse cx="35" cy="40" rx="8" ry="12" fill="none" stroke="url(#cp-svg-ganesh-gold)" strokeWidth="0.9" />
      <ellipse cx="35" cy="40" rx="5" ry="8" fill="none" stroke="#E0CFA0" strokeWidth="0.4" opacity="0.3" />

      {/* Right ear */}
      <ellipse cx="85" cy="40" rx="8" ry="12" fill="none" stroke="url(#cp-svg-ganesh-gold)" strokeWidth="0.9" />
      <ellipse cx="85" cy="40" rx="5" ry="8" fill="none" stroke="#E0CFA0" strokeWidth="0.4" opacity="0.3" />

      {/* Eyes */}
      <ellipse cx="50" cy="38" rx="4" ry="2.5" fill="none" stroke="#C9A84C" strokeWidth="0.8" />
      <ellipse cx="70" cy="38" rx="4" ry="2.5" fill="none" stroke="#C9A84C" strokeWidth="0.8" />
      <circle cx="50" cy="38" r="1" fill="#E0CFA0" opacity="0.6" />
      <circle cx="70" cy="38" r="1" fill="#E0CFA0" opacity="0.6" />

      {/* Tilak / bindi */}
      <ellipse cx="60" cy="32" rx="1.5" ry="2" fill="#C9A84C" opacity="0.7" />

      {/* Trunk — curving left */}
      <path
        d="M60 50 Q58 58, 52 66 Q48 72, 44 74 Q40 76, 38 72"
        fill="none" stroke="url(#cp-svg-ganesh-gold)" strokeWidth="1.4" strokeLinecap="round"
      />
      {/* Trunk inner line */}
      <path
        d="M58 52 Q56 58, 50 66 Q47 70, 44 72"
        fill="none" stroke="#E0CFA0" strokeWidth="0.4" opacity="0.3"
      />

      {/* Trunk tip curl */}
      <path
        d="M38 72 Q36 68, 38 66 Q40 64, 42 66"
        fill="none" stroke="#C9A84C" strokeWidth="0.8" opacity="0.6"
      />

      {/* Tusk — right */}
      <path
        d="M64 52 L68 60 L65 58"
        fill="none" stroke="#E0CFA0" strokeWidth="0.8" opacity="0.5"
      />

      {/* Body — rounded */}
      <ellipse cx="60" cy="85" rx="22" ry="20" fill="none" stroke="url(#cp-svg-ganesh-gold)" strokeWidth="1" />

      {/* Belly center dot (modak) */}
      <circle cx="60" cy="85" r="4" fill="none" stroke="#C9A84C" strokeWidth="0.6" opacity="0.4" />
      <circle cx="60" cy="85" r="1.5" fill="#C9A84C" opacity="0.3" />

      {/* Left arm — holding lotus */}
      <path
        d="M38 78 Q30 74, 26 70 Q24 68, 22 66"
        fill="none" stroke="url(#cp-svg-ganesh-gold)" strokeWidth="1" strokeLinecap="round"
      />
      {/* Lotus in left hand */}
      <circle cx="22" cy="64" r="3" fill="none" stroke="#E0CFA0" strokeWidth="0.6" opacity="0.5" />
      <path d="M20 62 Q22 58, 24 62" fill="none" stroke="#C9A84C" strokeWidth="0.5" opacity="0.4" />

      {/* Right arm — blessing gesture */}
      <path
        d="M82 78 Q90 74, 94 70 Q96 68, 96 64"
        fill="none" stroke="url(#cp-svg-ganesh-gold)" strokeWidth="1" strokeLinecap="round"
      />
      {/* Blessing hand (open palm) */}
      <path
        d="M94 64 Q92 60, 94 58 Q96 56, 98 58 Q100 60, 98 64"
        fill="none" stroke="#E0CFA0" strokeWidth="0.6" opacity="0.5"
      />

      {/* Legs / base — sitting pose */}
      <path
        d="M42 100 Q44 108, 50 112 Q56 114, 60 112 Q64 114, 70 112 Q76 108, 78 100"
        fill="none" stroke="url(#cp-svg-ganesh-gold)" strokeWidth="0.9"
      />

      {/* Feet */}
      <ellipse cx="46" cy="112" rx="6" ry="3" fill="none" stroke="#C9A84C" strokeWidth="0.6" opacity="0.4" />
      <ellipse cx="74" cy="112" rx="6" ry="3" fill="none" stroke="#C9A84C" strokeWidth="0.6" opacity="0.4" />

      {/* Mouse / vahana at bottom */}
      <ellipse cx="60" cy="128" rx="8" ry="5" fill="none" stroke="#C9A84C" strokeWidth="0.5" opacity="0.3" />
      <circle cx="56" cy="126" r="0.8" fill="#E0CFA0" opacity="0.3" />
      <path d="M52 128 Q48 126, 46 128" fill="none" stroke="#C9A84C" strokeWidth="0.4" opacity="0.25" />

      {/* Decorative dots around */}
      <circle cx="30" cy="55" r="0.8" fill="#E0CFA0" opacity="0.2" />
      <circle cx="90" cy="55" r="0.8" fill="#E0CFA0" opacity="0.2" />
      <circle cx="25" cy="90" r="0.8" fill="#E0CFA0" opacity="0.2" />
      <circle cx="95" cy="90" r="0.8" fill="#E0CFA0" opacity="0.2" />
    </svg>
  );
}
