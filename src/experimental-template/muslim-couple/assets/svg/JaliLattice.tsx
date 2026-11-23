import React from 'react';

interface SvgProps {
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Jali lattice screen pattern tile.
 * Two usages:
 *  1. As a 60x60 repeating background tile (Countdown section, 4% opacity)
 *  2. As a horizontal strip (full width x 40px, Family/Countdown transition)
 * viewBox: 60x60
 */
const JaliLattice: React.FC<SvgProps> = ({ className, style }) => (
  <svg
    viewBox="0 0 60 60"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={style}
    aria-hidden="true"
  >
    {/* Interlocking hexagonal/star lattice pattern inspired by Mughal jali screens */}
    {/* Central star cutout */}
    <polygon
      points="30,10 36,18 46,18 40,26 42,36 30,30 18,36 20,26 14,18 24,18"
      stroke="currentColor"
      strokeWidth="0.6"
      fill="none"
    />
    {/* Outer frame connecting to tile edges for seamless repeat */}
    <path
      d="M0,0 L14,18 M0,60 L14,42 M60,0 L46,18 M60,60 L46,42"
      stroke="currentColor"
      strokeWidth="0.5"
      opacity="0.6"
    />
    {/* Horizontal connectors */}
    <line x1="0" y1="30" x2="18" y2="36" stroke="currentColor" strokeWidth="0.5" opacity="0.6" />
    <line x1="42" y1="36" x2="60" y2="30" stroke="currentColor" strokeWidth="0.5" opacity="0.6" />
    <line x1="0" y1="30" x2="18" y2="24" stroke="currentColor" strokeWidth="0.5" opacity="0.6" />
    <line x1="42" y1="24" x2="60" y2="30" stroke="currentColor" strokeWidth="0.5" opacity="0.6" />
    {/* Vertical connector lines to edges */}
    <line x1="30" y1="0" x2="30" y2="10" stroke="currentColor" strokeWidth="0.5" opacity="0.6" />
    <line x1="30" y1="50" x2="30" y2="60" stroke="currentColor" strokeWidth="0.5" opacity="0.6" />
    {/* Lower reflected star partial for tiling */}
    <path
      d="M18,42 L24,42 L30,50 L36,42 L42,42"
      stroke="currentColor"
      strokeWidth="0.6"
      fill="none"
    />
    {/* Small diamond details at intersections */}
    <polygon points="30,22 33,26 30,30 27,26" stroke="currentColor" strokeWidth="0.3" fill="none" opacity="0.4" />
  </svg>
);

export default JaliLattice;
