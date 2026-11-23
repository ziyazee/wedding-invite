import React from 'react';

interface SvgProps {
  className?: string;
  style?: React.CSSProperties;
  /** 'line' for a gradient gold line, 'dots' for 3 gold dot separator */
  variant?: 'line' | 'dots';
}

/**
 * Gold divider elements.
 * Line variant: 60% width gradient gold line (below Bismillah, between Dua and sign-off).
 * Dots variant: 3 gold dots spaced 8px apart (between event cards, below countdown date).
 */
const GoldDivider: React.FC<SvgProps> = ({ className, style, variant = 'line' }) => {
  if (variant === 'dots') {
    return (
      <svg
        viewBox="0 0 28 4"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        style={style}
        aria-hidden="true"
      >
        <circle cx="2" cy="2" r="2" fill="#D4A050" />
        <circle cx="14" cy="2" r="2" fill="#D4A050" />
        <circle cx="26" cy="2" r="2" fill="#D4A050" />
      </svg>
    );
  }

  // Line variant
  return (
    <svg
      viewBox="0 0 200 1"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ width: '60%', height: '1px', ...style }}
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="mc-gold-divider-grad" x1="0" y1="0" x2="200" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#D4A050" stopOpacity="0" />
          <stop offset="20%" stopColor="#D4A050" stopOpacity="1" />
          <stop offset="80%" stopColor="#D4A050" stopOpacity="1" />
          <stop offset="100%" stopColor="#D4A050" stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect width="200" height="1" fill="url(#mc-gold-divider-grad)" />
    </svg>
  );
};

export default GoldDivider;
