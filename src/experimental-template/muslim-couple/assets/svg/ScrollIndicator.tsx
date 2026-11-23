import React from 'react';

interface SvgProps {
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Animated scroll indicator chevron.
 * Downward-pointing chevron at the bottom of the Entry screen.
 * Gold (#D4A050) stroke. Animated with GSAP vertical bounce.
 * viewBox: 24x12
 */
const ScrollIndicator: React.FC<SvgProps> = ({ className, style }) => (
  <svg
    viewBox="0 0 24 12"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={style}
    aria-hidden="true"
  >
    <polyline
      points="2,2 12,10 22,2"
      fill="none"
      stroke="#D4A050"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default ScrollIndicator;
