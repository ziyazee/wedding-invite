import React from 'react';

interface SvgProps {
  className?: string;
  style?: React.CSSProperties;
  /** Bird variant for visual variety */
  variant?: 1 | 2;
}

/**
 * Simple bird in flight silhouette.
 * Used in Closing section — 2 birds with gentle arc flight paths.
 * viewBox: 20x10
 */
const BirdSilhouette: React.FC<SvgProps> = ({ className, style, variant = 1 }) => (
  <svg
    viewBox="0 0 20 10"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={style}
    aria-hidden="true"
  >
    {variant === 1 ? (
      /* Variant 1: wings angled upward, classic V-shape */
      <path
        d="M0,5 Q5,0 10,4 Q15,0 20,5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    ) : (
      /* Variant 2: wings slightly more spread, softer curve */
      <path
        d="M0,6 Q4,1 10,4.5 Q16,1 20,6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    )}
  </svg>
);

export default BirdSilhouette;
