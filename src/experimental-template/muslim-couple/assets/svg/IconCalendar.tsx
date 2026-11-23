import React from 'react';

interface SvgProps {
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Calendar icon for Celebrations event card date rows.
 * viewBox: 18x18. Color: currentColor (apply --mc-gold via CSS).
 */
const IconCalendar: React.FC<SvgProps> = ({ className, style }) => (
  <svg
    viewBox="0 0 18 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={style}
    aria-hidden="true"
  >
    {/* Calendar body */}
    <rect x="2" y="4" width="14" height="12" rx="2" stroke="currentColor" strokeWidth="1.2" />
    {/* Top bar */}
    <line x1="2" y1="8" x2="16" y2="8" stroke="currentColor" strokeWidth="1" />
    {/* Calendar pins */}
    <line x1="6" y1="2" x2="6" y2="5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    <line x1="12" y1="2" x2="12" y2="5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    {/* Date dots */}
    <circle cx="6" cy="11" r="1" fill="currentColor" />
    <circle cx="9" cy="11" r="1" fill="currentColor" />
    <circle cx="12" cy="11" r="1" fill="currentColor" />
    <circle cx="6" cy="14" r="1" fill="currentColor" opacity="0.5" />
    <circle cx="9" cy="14" r="1" fill="currentColor" opacity="0.5" />
  </svg>
);

export default IconCalendar;
