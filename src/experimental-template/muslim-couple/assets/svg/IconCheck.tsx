import React from 'react';

interface SvgProps {
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Check mark icon for RSVP success state.
 * viewBox: 18x18. Color: currentColor.
 */
const IconCheck: React.FC<SvgProps> = ({ className, style }) => (
  <svg
    viewBox="0 0 18 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={style}
    aria-hidden="true"
  >
    <polyline
      points="3,10 7,14 15,4"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  </svg>
);

export default IconCheck;
