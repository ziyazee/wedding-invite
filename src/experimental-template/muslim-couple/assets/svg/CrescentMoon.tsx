import React from 'react';

interface SvgProps {
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Slim waxing crescent moon.
 * Used in the Closing section at 25% opacity in --mc-gold.
 * Standalone crescent (no star — per cultural direction: crescent-and-star is political).
 * viewBox: 28x28
 */
const CrescentMoon: React.FC<SvgProps> = ({ className, style }) => (
  <svg
    viewBox="0 0 28 28"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={style}
    aria-hidden="true"
  >
    {/* Waxing crescent: outer circle minus inner circle offset to the right */}
    <path
      d="M18,2 A12,12 0 1,0 18,26 A9,9 0 1,1 18,2 Z"
      fill="currentColor"
    />
  </svg>
);

export default CrescentMoon;
