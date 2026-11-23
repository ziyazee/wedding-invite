import React from 'react';

interface SvgProps {
  className?: string;
  style?: React.CSSProperties;
}

/**
 * 8-pointed star (Rub el Hizb / octagram) tessellation tile.
 * Used as a repeating background texture at 5% opacity on sections.
 * Two sizes: 80x80 (Family) and 100x100 (Celebrations).
 * viewBox: 80x80 — scale via CSS for larger variant.
 */
const IslamicGeometricStar: React.FC<SvgProps> = ({ className, style }) => (
  <svg
    viewBox="0 0 80 80"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={style}
    aria-hidden="true"
  >
    {/* Central 8-pointed star constructed from two overlapping squares rotated 45deg */}
    <g transform="translate(40,40)">
      {/* First square */}
      <rect
        x="-14"
        y="-14"
        width="28"
        height="28"
        transform="rotate(0)"
        stroke="currentColor"
        strokeWidth="0.5"
        fill="none"
      />
      {/* Second square rotated 45deg — creates the 8-pointed star intersection */}
      <rect
        x="-14"
        y="-14"
        width="28"
        height="28"
        transform="rotate(45)"
        stroke="currentColor"
        strokeWidth="0.5"
        fill="none"
      />
      {/* Inner octagon formed at the intersection */}
      <polygon
        points="0,-14 10,-10 14,0 10,10 0,14 -10,10 -14,0 -10,-10"
        stroke="currentColor"
        strokeWidth="0.4"
        fill="none"
        opacity="0.6"
      />
    </g>
    {/* Corner quarter-stars for seamless tiling */}
    {/* Top-left */}
    <g transform="translate(0,0)">
      <rect x="-14" y="-14" width="28" height="28" stroke="currentColor" strokeWidth="0.5" fill="none" />
      <rect x="-14" y="-14" width="28" height="28" transform="rotate(45)" stroke="currentColor" strokeWidth="0.5" fill="none" />
    </g>
    {/* Top-right */}
    <g transform="translate(80,0)">
      <rect x="-14" y="-14" width="28" height="28" stroke="currentColor" strokeWidth="0.5" fill="none" />
      <rect x="-14" y="-14" width="28" height="28" transform="rotate(45)" stroke="currentColor" strokeWidth="0.5" fill="none" />
    </g>
    {/* Bottom-left */}
    <g transform="translate(0,80)">
      <rect x="-14" y="-14" width="28" height="28" stroke="currentColor" strokeWidth="0.5" fill="none" />
      <rect x="-14" y="-14" width="28" height="28" transform="rotate(45)" stroke="currentColor" strokeWidth="0.5" fill="none" />
    </g>
    {/* Bottom-right */}
    <g transform="translate(80,80)">
      <rect x="-14" y="-14" width="28" height="28" stroke="currentColor" strokeWidth="0.5" fill="none" />
      <rect x="-14" y="-14" width="28" height="28" transform="rotate(45)" stroke="currentColor" strokeWidth="0.5" fill="none" />
    </g>
    {/* Connecting lines between stars */}
    <line x1="14" y1="40" x2="26" y2="40" stroke="currentColor" strokeWidth="0.4" opacity="0.4" />
    <line x1="54" y1="40" x2="66" y2="40" stroke="currentColor" strokeWidth="0.4" opacity="0.4" />
    <line x1="40" y1="14" x2="40" y2="26" stroke="currentColor" strokeWidth="0.4" opacity="0.4" />
    <line x1="40" y1="54" x2="40" y2="66" stroke="currentColor" strokeWidth="0.4" opacity="0.4" />
  </svg>
);

export default IslamicGeometricStar;
