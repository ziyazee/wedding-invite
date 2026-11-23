import React from 'react';

interface SvgProps {
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Mughal pointed arch (ogee arch) silhouette.
 * Used above family cards at 15% opacity as a decorative crown.
 * viewBox: 80x50
 */
const MughalArch: React.FC<SvgProps> = ({ className, style }) => (
  <svg
    viewBox="0 0 80 50"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={style}
    aria-hidden="true"
  >
    {/* Outer arch profile — characteristic Mughal ogee with cusped interior */}
    <path
      d="M4 50 L4 22 C4 18, 8 12, 14 8 C20 4, 28 1, 34 0.5 Q38 0, 40 0 Q42 0, 46 0.5 C52 1, 60 4, 66 8 C72 12, 76 18, 76 22 L76 50"
      stroke="currentColor"
      strokeWidth="1.2"
      fill="none"
      strokeLinecap="round"
    />
    {/* Inner cusped arch detail */}
    <path
      d="M12 50 L12 26 C12 22, 16 16, 22 12 C26 9.5, 32 7, 36 6 Q38 5.5, 40 5.5 Q42 5.5, 44 6 C48 7, 54 9.5, 58 12 C64 16, 68 22, 68 26 L68 50"
      stroke="currentColor"
      strokeWidth="0.6"
      fill="none"
      opacity="0.5"
      strokeLinecap="round"
    />
    {/* Finial at the apex */}
    <circle cx="40" cy="3" r="1.5" fill="currentColor" opacity="0.6" />
    {/* Small spandrel dots */}
    <circle cx="10" cy="36" r="0.8" fill="currentColor" opacity="0.3" />
    <circle cx="70" cy="36" r="0.8" fill="currentColor" opacity="0.3" />
  </svg>
);

export default MughalArch;
