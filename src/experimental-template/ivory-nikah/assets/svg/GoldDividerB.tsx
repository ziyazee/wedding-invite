/**
 * Gold Divider B — Dot-and-Rule
 *
 * Three small gold circles spaced horizontally, with tapered
 * gold rules extending left and right from the outer dots.
 * Used between Couple->Dua and Dua->Celebrations sections,
 * and inside celebration event cards.
 *
 * Default width: 200px (set via CSS or container)
 */

interface DividerProps {
  className?: string;
  style?: React.CSSProperties;
}

export function GoldDividerB({ className, style }: DividerProps) {
  return (
    <svg
      viewBox="0 0 200 16"
      className={className}
      style={style}
      aria-hidden="true"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="goldTaperB-left" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#C9A84C" stopOpacity="0" />
          <stop offset="50%" stopColor="#C9A84C" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#C9A84C" stopOpacity="0.65" />
        </linearGradient>
        <linearGradient id="goldTaperB-right" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#C9A84C" stopOpacity="0.65" />
          <stop offset="50%" stopColor="#C9A84C" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#C9A84C" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="goldDotB" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#C9A84C" />
          <stop offset="100%" stopColor="#D5BD91" />
        </linearGradient>
      </defs>

      {/* Left tapered rule */}
      <line
        x1="10"
        y1="8"
        x2="82"
        y2="8"
        stroke="url(#goldTaperB-left)"
        strokeWidth="1"
      />

      {/* Three center dots */}
      <circle cx="88" cy="8" r="3" fill="url(#goldDotB)" opacity="0.75" />
      <circle cx="100" cy="8" r="3" fill="url(#goldDotB)" opacity="0.9" />
      <circle cx="112" cy="8" r="3" fill="url(#goldDotB)" opacity="0.75" />

      {/* Subtle inner highlights on dots */}
      <circle cx="88" cy="7" r="1.2" fill="#E0CFA0" opacity="0.5" />
      <circle cx="100" cy="7" r="1.2" fill="#E0CFA0" opacity="0.6" />
      <circle cx="112" cy="7" r="1.2" fill="#E0CFA0" opacity="0.5" />

      {/* Right tapered rule */}
      <line
        x1="118"
        y1="8"
        x2="190"
        y2="8"
        stroke="url(#goldTaperB-right)"
        strokeWidth="1"
      />
    </svg>
  );
}
