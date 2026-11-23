import React from 'react';

interface SvgProps {
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Maps action icon for Celebrations event card action row (link to maps).
 * viewBox: 18x18. Color: currentColor.
 */
const IconMaps: React.FC<SvgProps> = ({ className, style }) => (
  <svg
    viewBox="0 0 18 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={style}
    aria-hidden="true"
  >
    {/* Folded map shape */}
    <path
      d="M2,4 L6,2 L12,4 L16,2 L16,14 L12,16 L6,14 L2,16 Z"
      stroke="currentColor"
      strokeWidth="1.2"
      fill="none"
      strokeLinejoin="round"
    />
    {/* Fold lines */}
    <line x1="6" y1="2" x2="6" y2="14" stroke="currentColor" strokeWidth="0.8" opacity="0.5" />
    <line x1="12" y1="4" x2="12" y2="16" stroke="currentColor" strokeWidth="0.8" opacity="0.5" />
  </svg>
);

export default IconMaps;
