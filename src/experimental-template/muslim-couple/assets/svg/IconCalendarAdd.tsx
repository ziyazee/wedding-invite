import React from 'react';

interface SvgProps {
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Add-to-calendar action icon for Celebrations event card action row.
 * viewBox: 18x18. Color: currentColor.
 */
const IconCalendarAdd: React.FC<SvgProps> = ({ className, style }) => (
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
    {/* Plus sign */}
    <line x1="9" y1="10.5" x2="9" y2="14.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    <line x1="7" y1="12.5" x2="11" y2="12.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
  </svg>
);

export default IconCalendarAdd;
