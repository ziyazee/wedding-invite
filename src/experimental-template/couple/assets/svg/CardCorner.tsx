type Corner = 'tl' | 'tr' | 'bl' | 'br';

const TRANSFORMS: Record<Corner, string> = {
  tl: '',
  tr: 'translate(60, 0) scale(-1, 1)',
  bl: 'translate(0, 60) scale(1, -1)',
  br: 'translate(60, 60) scale(-1, -1)',
};

export function CardCorner({ style, className, corner = 'tl' }: { style?: React.CSSProperties; className?: string; corner?: Corner; id?: string }) {
  const uid = `cp-cc-${corner}-${Math.random().toString(36).slice(2, 6)}`;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 60 60"
      style={style}
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={uid} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#E0CFA0" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#C9A84C" stopOpacity="0.5" />
        </linearGradient>
      </defs>

      <g transform={TRANSFORMS[corner]}>
        <path d="M4 30 L4 8 Q4 4, 8 4 L30 4" fill="none" stroke={`url(#${uid})`} strokeWidth="1" strokeLinecap="round" />
        <path d="M8 24 L8 12 Q8 8, 12 8 L24 8" fill="none" stroke="#C9A84C" strokeWidth="0.5" opacity="0.35" />
        <path d="M30 4 Q34 4, 36 6 Q38 8, 36 10 Q34 12, 32 10" fill="none" stroke="#E0CFA0" strokeWidth="0.6" opacity="0.5" />
        <path d="M4 30 Q4 34, 6 36 Q8 38, 10 36 Q12 34, 10 32" fill="none" stroke="#E0CFA0" strokeWidth="0.6" opacity="0.5" />
        <path d="M10 4 L12 2 L14 4 L12 6Z" fill="#C9A84C" opacity="0.4" />
        <path d="M8 8 Q12 6, 14 10 Q12 10, 8 8" fill="#C9A84C" opacity="0.2" />
        <circle cx="20" cy="4" r="0.8" fill="#E0CFA0" opacity="0.35" />
        <circle cx="4" cy="20" r="0.8" fill="#E0CFA0" opacity="0.35" />
      </g>
    </svg>
  );
}
