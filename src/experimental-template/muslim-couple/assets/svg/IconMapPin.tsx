import React from 'react';

interface SvgProps {
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Map pin icon for Celebrations event card venue rows.
 * viewBox: 18x18. Color: currentColor.
 */
const IconMapPin: React.FC<SvgProps> = ({ className, style }) => (
  <svg
    viewBox="0 0 18 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={style}
    aria-hidden="true"
  >
    {/* Pin body */}
    <path
      d="M9,2 C5.7,2 3,4.7 3,8 C3,12.5 9,17 9,17 C9,17 15,12.5 15,8 C15,4.7 12.3,2 9,2 Z"
      stroke="currentColor"
      strokeWidth="1.2"
      fill="none"
    />
    {/* Center circle */}
    <circle cx="9" cy="8" r="2.5" stroke="currentColor" strokeWidth="1" />
  </svg>
);

export default IconMapPin;
