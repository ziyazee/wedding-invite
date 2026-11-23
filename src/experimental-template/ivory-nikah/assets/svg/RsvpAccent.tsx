/**
 * RSVP Section Accent
 *
 * A pair of interlinked crescents with a small star between them,
 * rendered in gold. Used as a decorative header element above the
 * RSVP section title or within the RSVP form card.
 *
 * The crescents represent the Islamic crescent motif, fitting the
 * Nikah cultural context. Rendered with subtle gold gradients.
 */

interface AccentProps {
  className?: string;
  style?: React.CSSProperties;
}

export function RsvpAccent({ className, style }: AccentProps) {
  return (
    <svg
      viewBox="0 0 80 32"
      className={className}
      style={style}
      aria-hidden="true"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="rsvpCrescentL" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#C9A84C" />
          <stop offset="100%" stopColor="#D5BD91" />
        </linearGradient>
        <linearGradient id="rsvpCrescentR" x1="1" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#C9A84C" />
          <stop offset="100%" stopColor="#D5BD91" />
        </linearGradient>
        <linearGradient id="rsvpStarGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#C9A84C" />
          <stop offset="100%" stopColor="#E0CFA0" />
        </linearGradient>
      </defs>

      {/* Left crescent — faces right */}
      <path
        d="M12 6 A11 11 0 0 1 12 26 A8 8 0 0 0 12 6 Z"
        fill="url(#rsvpCrescentL)"
        opacity="0.55"
      />

      {/* Right crescent — faces left (mirrored) */}
      <path
        d="M68 6 A11 11 0 0 0 68 26 A8 8 0 0 1 68 6 Z"
        fill="url(#rsvpCrescentR)"
        opacity="0.55"
      />

      {/* Small 8-pointed star at center */}
      <path
        d={(() => {
          const cx = 40;
          const cy = 16;
          const outerR = 5;
          const innerR = 2.2;
          const points: string[] = [];
          for (let i = 0; i < 8; i++) {
            const outerAngle = (i * Math.PI) / 4 - Math.PI / 2;
            const innerAngle = ((i + 0.5) * Math.PI) / 4 - Math.PI / 2;
            points.push(
              `${cx + outerR * Math.cos(outerAngle)},${cy + outerR * Math.sin(outerAngle)}`
            );
            points.push(
              `${cx + innerR * Math.cos(innerAngle)},${cy + innerR * Math.sin(innerAngle)}`
            );
          }
          return 'M' + points.join(' L') + ' Z';
        })()}
        fill="url(#rsvpStarGrad)"
        opacity="0.7"
      />

      {/* Tiny center dot in star */}
      <circle cx="40" cy="16" r="1" fill="#E0CFA0" opacity="0.6" />

      {/* Connecting arc flourishes from crescents toward star */}
      <path
        d="M20 16 Q28 12, 34 14"
        stroke="#C9A84C"
        strokeWidth="0.5"
        strokeLinecap="round"
        opacity="0.3"
      />
      <path
        d="M60 16 Q52 12, 46 14"
        stroke="#C9A84C"
        strokeWidth="0.5"
        strokeLinecap="round"
        opacity="0.3"
      />
      <path
        d="M20 16 Q28 20, 34 18"
        stroke="#C9A84C"
        strokeWidth="0.5"
        strokeLinecap="round"
        opacity="0.3"
      />
      <path
        d="M60 16 Q52 20, 46 18"
        stroke="#C9A84C"
        strokeWidth="0.5"
        strokeLinecap="round"
        opacity="0.3"
      />
    </svg>
  );
}
