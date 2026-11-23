export function SwastikSymbol({ style, className }: { style?: React.CSSProperties; className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 60 60"
      style={style}
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="cp-svg-swastik-gold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#E0CFA0" />
          <stop offset="50%" stopColor="#C9A84C" />
          <stop offset="100%" stopColor="#E0CFA0" />
        </linearGradient>
      </defs>

      {/* Swastik — auspicious Hindu symbol */}
      {/* Vertical line */}
      <line x1="30" y1="12" x2="30" y2="48" stroke="url(#cp-svg-swastik-gold)" strokeWidth="1.5" strokeLinecap="round" />
      {/* Horizontal line */}
      <line x1="12" y1="30" x2="48" y2="30" stroke="url(#cp-svg-swastik-gold)" strokeWidth="1.5" strokeLinecap="round" />

      {/* Four arms — clockwise hooks */}
      <path d="M30 12 L42 12" fill="none" stroke="url(#cp-svg-swastik-gold)" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M48 30 L48 42" fill="none" stroke="url(#cp-svg-swastik-gold)" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M30 48 L18 48" fill="none" stroke="url(#cp-svg-swastik-gold)" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M12 30 L12 18" fill="none" stroke="url(#cp-svg-swastik-gold)" strokeWidth="1.5" strokeLinecap="round" />

      {/* Center dot */}
      <circle cx="30" cy="30" r="2" fill="#C9A84C" opacity="0.5" />

      {/* Four corner dots (auspicious) */}
      <circle cx="22" cy="22" r="1.5" fill="#C9A84C" opacity="0.35" />
      <circle cx="38" cy="22" r="1.5" fill="#C9A84C" opacity="0.35" />
      <circle cx="22" cy="38" r="1.5" fill="#C9A84C" opacity="0.35" />
      <circle cx="38" cy="38" r="1.5" fill="#C9A84C" opacity="0.35" />
    </svg>
  );
}
