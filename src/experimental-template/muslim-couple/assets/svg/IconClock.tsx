import React from 'react';

interface SvgProps {
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Clock icon for Celebrations event card time rows.
 * viewBox: 18x18. Color: currentColor.
 */
const IconClock: React.FC<SvgProps> = ({ className, style }) => (
  <svg
    viewBox="0 0 18 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={style}
    aria-hidden="true"
  >
    <circle cx="9" cy="9" r="7" stroke="currentColor" strokeWidth="1.2" />
    {/* Hour hand */}
    <line x1="9" y1="9" x2="9" y2="5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    {/* Minute hand */}
    <line x1="9" y1="9" x2="12.5" y2="9" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
    {/* Center dot */}
    <circle cx="9" cy="9" r="0.8" fill="currentColor" />
  </svg>
);

export default IconClock;
