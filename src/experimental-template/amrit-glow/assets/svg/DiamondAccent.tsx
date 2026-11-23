import React from 'react';

interface DiamondAccentProps {
  className?: string;
  size?: number;
}

/**
 * Standalone diamond accent — a small rotated square with an inner highlight
 * and optional surrounding dots. Used as a focal point in dividers, as
 * bullet-point alternatives in lists, or as standalone decorative marks.
 *
 * Default size: 12px. Compact and versatile.
 */
export const DiamondAccent: React.FC<DiamondAccentProps> = ({
  className,
  size = 12,
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 12 12"
      width={size}
      height={size}
      className={className}
      aria-hidden="true"
      style={{ display: 'block' }}
    >
      {/* Outer diamond outline */}
      <rect
        x="2"
        y="2"
        width="8"
        height="8"
        rx="0.5"
        transform="rotate(45, 6, 6)"
        fill="none"
        stroke="var(--ag-gold, #D4A843)"
        strokeWidth="0.7"
        opacity="0.6"
      />
      {/* Inner diamond fill */}
      <rect
        x="3.5"
        y="3.5"
        width="5"
        height="5"
        transform="rotate(45, 6, 6)"
        fill="var(--ag-gold, #D4A843)"
        opacity="0.5"
      />
      {/* Center bright highlight */}
      <circle
        cx="6"
        cy="6"
        r="1"
        fill="var(--ag-gold-bright, #E8C65A)"
        opacity="0.45"
      />
    </svg>
  );
};
