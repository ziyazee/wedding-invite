export function OmSymbol({ style, className }: { style?: React.CSSProperties; className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      style={style}
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="cp-svg-om-gold" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#E0CFA0" />
          <stop offset="40%" stopColor="#C9A84C" />
          <stop offset="100%" stopColor="#E0CFA0" stopOpacity="0.8" />
        </linearGradient>
      </defs>

      <text
        x="50"
        y="76"
        textAnchor="middle"
        fill="url(#cp-svg-om-gold)"
        fontFamily="'Noto Sans Devanagari', 'Mangal', 'Devanagari MT', 'Kohinoor Devanagari', serif"
        fontSize="80"
        fontWeight="400"
      >
        &#x0950;
      </text>
    </svg>
  );
}
