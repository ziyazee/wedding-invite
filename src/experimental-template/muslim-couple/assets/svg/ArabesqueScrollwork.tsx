import React from 'react';

interface SvgProps {
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Corner arabesque scrollwork ornament.
 * Used at top-left and bottom-right of Family and RSVP sections.
 * Designed for top-left placement; mirror/rotate for other positions.
 * viewBox: 60x60
 */
const ArabesqueScrollwork: React.FC<SvgProps> = ({ className, style }) => (
  <svg
    viewBox="0 0 60 60"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={style}
    aria-hidden="true"
  >
    {/* Main vine tendril curving from corner */}
    <path
      d="M2,2 C6,4 12,8 18,14 C24,20 26,28 22,34 C18,38 12,36 10,32 C8,28 10,24 14,22 C18,20 22,22 24,26"
      stroke="currentColor"
      strokeWidth="1"
      fill="none"
      strokeLinecap="round"
    />
    {/* Secondary tendril */}
    <path
      d="M2,8 C6,10 10,14 14,20 C18,26 18,32 14,36"
      stroke="currentColor"
      strokeWidth="0.7"
      fill="none"
      opacity="0.7"
      strokeLinecap="round"
    />
    {/* Split palmette leaf 1 */}
    <path
      d="M16,12 C12,10 8,12 10,16 C12,20 16,18 16,14"
      stroke="currentColor"
      strokeWidth="0.6"
      fill="currentColor"
      fillOpacity="0.15"
    />
    {/* Split palmette leaf 2 */}
    <path
      d="M22,22 C18,20 14,22 16,26 C18,30 22,28 22,24"
      stroke="currentColor"
      strokeWidth="0.6"
      fill="currentColor"
      fillOpacity="0.15"
    />
    {/* Small leaf buds along vine */}
    <path
      d="M8,8 C6,6 4,7 5,9 C6,11 8,10 8,8 Z"
      fill="currentColor"
      fillOpacity="0.2"
    />
    <path
      d="M12,16 C10,14 8,15 9,17 C10,19 12,18 12,16 Z"
      fill="currentColor"
      fillOpacity="0.2"
    />
    {/* Spiral tendril tip */}
    <path
      d="M24,26 C26,28 28,26 26,24"
      stroke="currentColor"
      strokeWidth="0.5"
      fill="none"
      strokeLinecap="round"
    />
    {/* Decorative dot at origin */}
    <circle cx="3" cy="3" r="1.5" fill="currentColor" opacity="0.3" />
  </svg>
);

export default ArabesqueScrollwork;
