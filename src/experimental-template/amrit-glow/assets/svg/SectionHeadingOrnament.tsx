import React from 'react';

interface SectionHeadingOrnamentProps {
  className?: string;
  width?: number;
}

/**
 * Decorative ornament placed below section headings (e.g., "Celebrations", "RSVP").
 * Features a central cusped Mughal arch motif flanked by scrollwork tendrils,
 * with small dot accents. The arch nods to Mughal-Rajput architecture
 * without being a literal building element.
 *
 * Default width: 160px. Compact height — sits beneath a heading
 * without competing for vertical space.
 */
export const SectionHeadingOrnament: React.FC<SectionHeadingOrnamentProps> = ({
  className,
  width = 160,
}) => {
  const scale = width / 160;
  const h = 28 * scale;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 160 28"
      width={width}
      height={h}
      className={className}
      aria-hidden="true"
      style={{ display: 'block' }}
    >
      {/* Center cusped arch motif */}
      <g opacity="0.6">
        {/* Main arch silhouette — a cusped (pointed) arch */}
        <path
          d="M72,20 Q72,10 80,6 Q88,10 88,20"
          fill="none"
          stroke="var(--ag-gold, #D4A843)"
          strokeWidth="0.9"
          strokeLinecap="round"
        />
        {/* Inner cusps — the scalloped detail inside the arch */}
        <path
          d="M74,18 Q76,13 80,10 Q84,13 86,18"
          fill="none"
          stroke="var(--ag-gold, #D4A843)"
          strokeWidth="0.5"
          strokeLinecap="round"
          opacity="0.5"
        />
        {/* Arch peak finial — small pointed tip */}
        <path
          d="M79,7 L80,3 L81,7"
          fill="none"
          stroke="var(--ag-gold, #D4A843)"
          strokeWidth="0.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Tiny dot at peak */}
        <circle
          cx="80"
          cy="2"
          r="0.8"
          fill="var(--ag-gold-bright, #E8C65A)"
          opacity="0.6"
        />
      </g>

      {/* Left scrollwork tendril */}
      <g opacity="0.5">
        {/* Main horizontal line extending left from arch */}
        <line
          x1="14"
          y1="20"
          x2="72"
          y2="20"
          stroke="var(--ag-gold, #D4A843)"
          strokeWidth="0.7"
          strokeLinecap="round"
        />
        {/* Left scroll curl */}
        <path
          d="M14,20 Q10,20 8,18 Q6,15 9,14 Q11,13 13,15"
          fill="none"
          stroke="var(--ag-gold, #D4A843)"
          strokeWidth="0.7"
          strokeLinecap="round"
        />
        {/* Small leaf/petal sprouting from the tendril */}
        <path
          d="M36,20 Q34,16 36,14 Q38,16 36,20"
          fill="var(--ag-gold, #D4A843)"
          opacity="0.35"
        />
        {/* Accent dot */}
        <circle
          cx="52"
          cy="20"
          r="0.9"
          fill="var(--ag-gold, #D4A843)"
          opacity="0.45"
        />
      </g>

      {/* Right scrollwork tendril (mirrored) */}
      <g opacity="0.5">
        {/* Main horizontal line extending right from arch */}
        <line
          x1="88"
          y1="20"
          x2="146"
          y2="20"
          stroke="var(--ag-gold, #D4A843)"
          strokeWidth="0.7"
          strokeLinecap="round"
        />
        {/* Right scroll curl */}
        <path
          d="M146,20 Q150,20 152,18 Q154,15 151,14 Q149,13 147,15"
          fill="none"
          stroke="var(--ag-gold, #D4A843)"
          strokeWidth="0.7"
          strokeLinecap="round"
        />
        {/* Small leaf/petal sprouting from the tendril */}
        <path
          d="M124,20 Q126,16 124,14 Q122,16 124,20"
          fill="var(--ag-gold, #D4A843)"
          opacity="0.35"
        />
        {/* Accent dot */}
        <circle
          cx="108"
          cy="20"
          r="0.9"
          fill="var(--ag-gold, #D4A843)"
          opacity="0.45"
        />
      </g>

      {/* Arch base line — completes the arch's feet */}
      <line
        x1="72"
        y1="20"
        x2="88"
        y2="20"
        stroke="var(--ag-gold, #D4A843)"
        strokeWidth="0.7"
        opacity="0.45"
      />
    </svg>
  );
};
