import React from 'react';

interface HmCalendarIconProps {
  /** Icon size (square) */
  size?: number;
  /** Stroke color — defaults to CSS var(--hm-gold-deep) */
  strokeColor?: string;
  /** Stroke width */
  strokeWidth?: number;
  /** Additional CSS class */
  className?: string;
  /** Additional inline styles */
  style?: React.CSSProperties;
}

/**
 * HmCalendarIcon — Simple calendar outline for event cards.
 *
 * A rectangle with two vertical pins at the top and a horizontal
 * divider separating the header from the date grid area.
 * Stroke-only, no fill. 12x12px default.
 *
 * Used in: Celebrations section event cards, inline with date text.
 */
const HmCalendarIcon: React.FC<HmCalendarIconProps> = ({
  size = 12,
  strokeColor = 'var(--hm-gold-deep, #B8892E)',
  strokeWidth = 1.5,
  className,
  style,
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 16 16"
      width={size}
      height={size}
      fill="none"
      aria-hidden="true"
      className={className}
      style={style}
    >
      {/* Calendar body — rounded rectangle */}
      <rect
        x="1.5"
        y="3"
        width="13"
        height="11.5"
        rx="1.5"
        ry="1.5"
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Horizontal divider between header and dates */}
      <line
        x1="1.5"
        y1="6.5"
        x2="14.5"
        y2="6.5"
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
      {/* Left pin */}
      <line
        x1="5"
        y1="1.5"
        x2="5"
        y2="4.5"
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
      {/* Right pin */}
      <line
        x1="11"
        y1="1.5"
        x2="11"
        y2="4.5"
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
      {/* Small date dots — 2x3 grid */}
      <circle cx="5" cy="9" r="0.7" fill={strokeColor} />
      <circle cx="8" cy="9" r="0.7" fill={strokeColor} />
      <circle cx="11" cy="9" r="0.7" fill={strokeColor} />
      <circle cx="5" cy="12" r="0.7" fill={strokeColor} />
      <circle cx="8" cy="12" r="0.7" fill={strokeColor} />
      <circle cx="11" cy="12" r="0.7" fill={strokeColor} />
    </svg>
  );
};

export default HmCalendarIcon;
