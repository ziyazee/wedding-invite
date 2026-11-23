export function CountdownFrame({ style, className }: { style?: React.CSSProperties; className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 90 100"
      style={style}
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="cp-svg-cdf-gold" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#E0CFA0" />
          <stop offset="50%" stopColor="#C9A84C" />
          <stop offset="100%" stopColor="#E0CFA0" />
        </linearGradient>
        <radialGradient id="cp-svg-cdf-bg" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#C9A84C" stopOpacity="0.07" />
          <stop offset="100%" stopColor="#C9A84C" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Warm background glow */}
      <ellipse cx="45" cy="45" rx="38" ry="42" fill="url(#cp-svg-cdf-bg)" />

      {/* Arch top */}
      <path d="M10 40 Q10 8 45 5 Q80 8 80 40" fill="none" stroke="url(#cp-svg-cdf-gold)" strokeWidth="0.6" opacity="0.4" />

      {/* Side lines flowing down from arch */}
      <line x1="10" y1="40" x2="10" y2="85" stroke="url(#cp-svg-cdf-gold)" strokeWidth="0.5" opacity="0.3" />
      <line x1="80" y1="40" x2="80" y2="85" stroke="url(#cp-svg-cdf-gold)" strokeWidth="0.5" opacity="0.3" />

      {/* Bottom curve */}
      <path d="M10 85 Q10 95 30 97 Q45 99 60 97 Q80 95 80 85" fill="none" stroke="url(#cp-svg-cdf-gold)" strokeWidth="0.5" opacity="0.3" />

      {/* Top crown lotus */}
      <path d="M39 6 Q45 0 51 6" fill="none" stroke="#C9A84C" strokeWidth="0.5" opacity="0.45" />
      <circle cx="45" cy="3" r="1.5" fill="#C9A84C" opacity="0.2" />

      {/* Small side paisley accents */}
      <path d="M10 55 Q6 58 10 62" fill="none" stroke="#C9A84C" strokeWidth="0.35" opacity="0.25" />
      <path d="M80 55 Q84 58 80 62" fill="none" stroke="#C9A84C" strokeWidth="0.35" opacity="0.25" />

      {/* Bottom center dot */}
      <circle cx="45" cy="97" r="1" fill="#C9A84C" opacity="0.2" />
    </svg>
  );
}
