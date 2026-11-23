/**
 * Gold Divider C — Vine Horizontal Snippet
 *
 * A small horizontal vine/branch motif with leaves and tendrils,
 * rendered as gold SVG paths. Used between Celebrations->Countdown
 * and Countdown->RSVP sections.
 *
 * Default width: 180px (set via CSS or container)
 */

interface DividerProps {
  className?: string;
  style?: React.CSSProperties;
}

export function GoldDividerC({ className, style }: DividerProps) {
  return (
    <svg
      viewBox="0 0 180 40"
      className={className}
      style={style}
      aria-hidden="true"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="vineGoldC-stem" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#C9A84C" stopOpacity="0" />
          <stop offset="15%" stopColor="#C9A84C" stopOpacity="0.5" />
          <stop offset="50%" stopColor="#C9A84C" stopOpacity="0.7" />
          <stop offset="85%" stopColor="#C9A84C" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#C9A84C" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="vineGoldC-leaf" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#C9A84C" />
          <stop offset="100%" stopColor="#D5BD91" />
        </linearGradient>
        <linearGradient id="vineGoldC-sage" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#8A9A7B" />
          <stop offset="100%" stopColor="#C9A84C" />
        </linearGradient>
      </defs>

      {/* Main vine stem — gentle S-curve */}
      <path
        d="M8 20 C30 20, 40 16, 55 17 S75 22, 90 20 S105 16, 125 17 S145 22, 172 20"
        stroke="url(#vineGoldC-stem)"
        strokeWidth="1"
        strokeLinecap="round"
      />

      {/* Left leaf pair */}
      <path
        d="M35 17 C32 12, 28 10, 26 12 C24 14, 28 17, 35 17 Z"
        fill="url(#vineGoldC-leaf)"
        opacity="0.5"
      />
      <path
        d="M38 18 C35 23, 31 25, 29 23 C27 21, 31 18, 38 18 Z"
        fill="url(#vineGoldC-sage)"
        opacity="0.35"
      />

      {/* Left tendril */}
      <path
        d="M42 16 C44 12, 47 11, 48 13"
        stroke="#C9A84C"
        strokeWidth="0.6"
        strokeLinecap="round"
        opacity="0.4"
      />

      {/* Center leaf cluster (up) */}
      <path
        d="M85 20 C82 14, 80 10, 83 9 C86 8, 88 12, 85 20 Z"
        fill="url(#vineGoldC-leaf)"
        opacity="0.55"
      />
      <path
        d="M90 20 C92 13, 94 10, 92 9 C90 8, 87 12, 90 20 Z"
        fill="url(#vineGoldC-leaf)"
        opacity="0.45"
      />

      {/* Center small bud */}
      <circle cx="88" cy="9" r="1.5" fill="#C9A84C" opacity="0.6" />
      <circle cx="88" cy="9" r="0.7" fill="#E0CFA0" opacity="0.5" />

      {/* Center leaf cluster (down) */}
      <path
        d="M92 21 C95 27, 97 30, 95 31 C93 32, 90 28, 92 21 Z"
        fill="url(#vineGoldC-sage)"
        opacity="0.35"
      />

      {/* Right leaf pair */}
      <path
        d="M130 17 C133 12, 137 10, 139 12 C141 14, 137 17, 130 17 Z"
        fill="url(#vineGoldC-leaf)"
        opacity="0.5"
      />
      <path
        d="M127 19 C130 24, 134 26, 136 24 C138 22, 134 19, 127 19 Z"
        fill="url(#vineGoldC-sage)"
        opacity="0.35"
      />

      {/* Right tendril */}
      <path
        d="M142 16 C140 12, 137 11, 136 13"
        stroke="#C9A84C"
        strokeWidth="0.6"
        strokeLinecap="round"
        opacity="0.4"
      />

      {/* Tiny accent dots along stem */}
      <circle cx="60" cy="18" r="0.8" fill="#C9A84C" opacity="0.35" />
      <circle cx="115" cy="18" r="0.8" fill="#C9A84C" opacity="0.35" />
    </svg>
  );
}
