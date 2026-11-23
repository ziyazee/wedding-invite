import React from 'react';

interface GoldFlourishProps extends React.SVGProps<SVGSVGElement> {
  color?: string;
  /** Maximum width of the divider */
  maxWidth?: number;
}

/**
 * Thin horizontal gold line with a small diamond ornament at center.
 * Elegant section divider used between subsections.
 *
 * The line extends from center outward with tapered ends.
 * The diamond is a small rotated square with a subtle inner detail.
 */
const GoldFlourish: React.FC<GoldFlourishProps> = ({
  color = '#B59A5A',
  maxWidth,
  className,
  style,
  ...props
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 200 16"
    fill="none"
    aria-hidden="true"
    className={className}
    style={{
      ...style,
      ...(maxWidth ? { maxWidth } : {}),
    }}
    {...props}
  >
    {/* Left line -- tapers from center outward */}
    <line
      x1="8"
      y1="8"
      x2="88"
      y2="8"
      stroke={color}
      strokeWidth="1"
      strokeOpacity="0.55"
      strokeLinecap="round"
    />

    {/* Right line -- tapers from center outward */}
    <line
      x1="112"
      y1="8"
      x2="192"
      y2="8"
      stroke={color}
      strokeWidth="1"
      strokeOpacity="0.55"
      strokeLinecap="round"
    />

    {/* Tapered ends -- shorter strokes that fade */}
    <line
      x1="2"
      y1="8"
      x2="12"
      y2="8"
      stroke={color}
      strokeWidth="0.5"
      strokeOpacity="0.3"
      strokeLinecap="round"
    />
    <line
      x1="188"
      y1="8"
      x2="198"
      y2="8"
      stroke={color}
      strokeWidth="0.5"
      strokeOpacity="0.3"
      strokeLinecap="round"
    />

    {/* Center diamond ornament */}
    <path
      d="M100 2 L106 8 L100 14 L94 8 Z"
      fill={color}
      fillOpacity="0.65"
    />
    {/* Inner diamond detail */}
    <path
      d="M100 4.5 L103.5 8 L100 11.5 L96.5 8 Z"
      fill="none"
      stroke={color}
      strokeWidth="0.5"
      strokeOpacity="0.35"
    />

    {/* Small leaf/curl details flanking the diamond */}
    <path
      d="M88 8 C90 5, 92 4, 94 8"
      fill="none"
      stroke={color}
      strokeWidth="0.7"
      strokeOpacity="0.45"
      strokeLinecap="round"
    />
    <path
      d="M112 8 C110 5, 108 4, 106 8"
      fill="none"
      stroke={color}
      strokeWidth="0.7"
      strokeOpacity="0.45"
      strokeLinecap="round"
    />
  </svg>
);

export default GoldFlourish;
