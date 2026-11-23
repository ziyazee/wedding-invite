import React from 'react';

interface SvgProps {
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Horizontal jali lattice strip for section transitions.
 * Full width x 40px, tone-on-tone divider between Family and Countdown.
 * viewBox: 402x40
 */
const JaliLatticeStrip: React.FC<SvgProps> = ({ className, style }) => (
  <svg
    viewBox="0 0 402 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={{ width: '100%', height: '40px', ...style }}
    preserveAspectRatio="none"
    aria-hidden="true"
  >
    <defs>
      {/* Single unit cell of the jali pattern */}
      <pattern id="mc-jali-unit" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
        {/* Interlocking arched cutout */}
        <path
          d="M0,20 Q10,5 20,0 Q30,5 40,20 Q30,35 20,40 Q10,35 0,20 Z"
          stroke="currentColor"
          strokeWidth="0.8"
          fill="none"
        />
        {/* Inner diamond */}
        <polygon
          points="20,8 28,20 20,32 12,20"
          stroke="currentColor"
          strokeWidth="0.5"
          fill="none"
          opacity="0.5"
        />
        {/* Tiny center dot */}
        <circle cx="20" cy="20" r="1.2" fill="currentColor" opacity="0.3" />
      </pattern>
    </defs>
    <rect width="402" height="40" fill="url(#mc-jali-unit)" />
    {/* Top and bottom border lines */}
    <line x1="0" y1="0.5" x2="402" y2="0.5" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
    <line x1="0" y1="39.5" x2="402" y2="39.5" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
  </svg>
);

export default JaliLatticeStrip;
