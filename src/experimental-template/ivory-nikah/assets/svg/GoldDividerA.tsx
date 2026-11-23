/**
 * Gold Divider A — Tapered Rule with Center Motif
 *
 * A horizontal line that tapers from thick center to thin ends,
 * with a small diamond/floral motif at center. Used between
 * Opening->Couple and RSVP->Closing sections.
 *
 * Default width: 280px (set via CSS or container)
 */

interface DividerProps {
  className?: string;
  style?: React.CSSProperties;
}

export function GoldDividerA({ className, style }: DividerProps) {
  return (
    <svg
      viewBox="0 0 280 24"
      className={className}
      style={style}
      aria-hidden="true"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="goldTaperA-left" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#C9A84C" stopOpacity="0" />
          <stop offset="60%" stopColor="#C9A84C" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#C9A84C" stopOpacity="0.85" />
        </linearGradient>
        <linearGradient id="goldTaperA-right" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#C9A84C" stopOpacity="0.85" />
          <stop offset="40%" stopColor="#C9A84C" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#C9A84C" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="goldMotifA" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#C9A84C" />
          <stop offset="100%" stopColor="#D5BD91" />
        </linearGradient>
      </defs>

      {/* Left tapered rule */}
      <line
        x1="10"
        y1="12"
        x2="124"
        y2="12"
        stroke="url(#goldTaperA-left)"
        strokeWidth="1"
      />

      {/* Right tapered rule */}
      <line
        x1="156"
        y1="12"
        x2="270"
        y2="12"
        stroke="url(#goldTaperA-right)"
        strokeWidth="1"
      />

      {/* Center diamond motif */}
      <path
        d="M140 5 L146 12 L140 19 L134 12 Z"
        fill="url(#goldMotifA)"
        opacity="0.9"
      />

      {/* Inner diamond (smaller, brighter) */}
      <path
        d="M140 8 L143.5 12 L140 16 L136.5 12 Z"
        fill="#E0CFA0"
        opacity="0.6"
      />

      {/* Small dots flanking the diamond */}
      <circle cx="126" cy="12" r="1.5" fill="#C9A84C" opacity="0.6" />
      <circle cx="154" cy="12" r="1.5" fill="#C9A84C" opacity="0.6" />

      {/* Tiny outer dots for flourish */}
      <circle cx="120" cy="12" r="0.8" fill="#C9A84C" opacity="0.35" />
      <circle cx="160" cy="12" r="0.8" fill="#C9A84C" opacity="0.35" />
    </svg>
  );
}
