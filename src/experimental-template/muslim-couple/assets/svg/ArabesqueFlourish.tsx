import React from 'react';

interface SvgProps {
  className?: string;
  style?: React.CSSProperties;
  /** 'wide' (120x20 for section titles) or 'small' (40x20 for Bismillah flanks) */
  variant?: 'wide' | 'small';
}

/**
 * Horizontal arabesque flourish ornament.
 * Wide variant: 120x20, used below section titles.
 * Small variant: 40x20, used flanking the Bismillah and as the countdown bottom pair.
 */
const ArabesqueFlourish: React.FC<SvgProps> = ({ className, style, variant = 'wide' }) => {
  if (variant === 'small') {
    return (
      <svg
        viewBox="0 0 40 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        style={style}
        aria-hidden="true"
      >
        {/* Central vine scroll */}
        <path
          d="M2,10 C6,4 12,2 18,6 C22,8 24,6 26,4 C28,2 32,2 36,6 L38,10"
          stroke="currentColor"
          strokeWidth="0.8"
          fill="none"
          strokeLinecap="round"
        />
        {/* Lower mirror curl */}
        <path
          d="M2,10 C6,16 12,18 18,14 C22,12 24,14 26,16 C28,18 32,18 36,14 L38,10"
          stroke="currentColor"
          strokeWidth="0.8"
          fill="none"
          strokeLinecap="round"
        />
        {/* Split leaf at center */}
        <path
          d="M18,6 C20,8 20,12 18,14"
          stroke="currentColor"
          strokeWidth="0.5"
          fill="none"
          opacity="0.6"
        />
        {/* Small palmette leaves */}
        <ellipse cx="10" cy="6" rx="2.5" ry="1.5" fill="currentColor" fillOpacity="0.15" transform="rotate(-20,10,6)" />
        <ellipse cx="10" cy="14" rx="2.5" ry="1.5" fill="currentColor" fillOpacity="0.15" transform="rotate(20,10,14)" />
        <ellipse cx="30" cy="5" rx="2.5" ry="1.5" fill="currentColor" fillOpacity="0.15" transform="rotate(20,30,5)" />
        <ellipse cx="30" cy="15" rx="2.5" ry="1.5" fill="currentColor" fillOpacity="0.15" transform="rotate(-20,30,15)" />
        {/* Terminal dots */}
        <circle cx="2" cy="10" r="1" fill="currentColor" opacity="0.4" />
        <circle cx="38" cy="10" r="1" fill="currentColor" opacity="0.4" />
      </svg>
    );
  }

  // Wide variant (120x20)
  return (
    <svg
      viewBox="0 0 120 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={style}
      aria-hidden="true"
    >
      {/* Central diamond accent */}
      <polygon points="60,4 64,10 60,16 56,10" stroke="currentColor" strokeWidth="0.6" fill="currentColor" fillOpacity="0.1" />
      {/* Left scrolling vine */}
      <path
        d="M4,10 C8,4 16,2 24,6 C30,9 36,6 42,4 C48,2 52,4 56,10"
        stroke="currentColor"
        strokeWidth="0.8"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M4,10 C8,16 16,18 24,14 C30,11 36,14 42,16 C48,18 52,16 56,10"
        stroke="currentColor"
        strokeWidth="0.8"
        fill="none"
        strokeLinecap="round"
      />
      {/* Right scrolling vine (mirror) */}
      <path
        d="M116,10 C112,4 104,2 96,6 C90,9 84,6 78,4 C72,2 68,4 64,10"
        stroke="currentColor"
        strokeWidth="0.8"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M116,10 C112,16 104,18 96,14 C90,11 84,14 78,16 C72,18 68,16 64,10"
        stroke="currentColor"
        strokeWidth="0.8"
        fill="none"
        strokeLinecap="round"
      />
      {/* Palmette leaves along left vine */}
      <ellipse cx="16" cy="5" rx="3" ry="1.8" fill="currentColor" fillOpacity="0.12" transform="rotate(-15,16,5)" />
      <ellipse cx="16" cy="15" rx="3" ry="1.8" fill="currentColor" fillOpacity="0.12" transform="rotate(15,16,15)" />
      <ellipse cx="36" cy="4" rx="3" ry="1.8" fill="currentColor" fillOpacity="0.12" transform="rotate(10,36,4)" />
      <ellipse cx="36" cy="16" rx="3" ry="1.8" fill="currentColor" fillOpacity="0.12" transform="rotate(-10,36,16)" />
      {/* Palmette leaves along right vine (mirrored) */}
      <ellipse cx="104" cy="5" rx="3" ry="1.8" fill="currentColor" fillOpacity="0.12" transform="rotate(15,104,5)" />
      <ellipse cx="104" cy="15" rx="3" ry="1.8" fill="currentColor" fillOpacity="0.12" transform="rotate(-15,104,15)" />
      <ellipse cx="84" cy="4" rx="3" ry="1.8" fill="currentColor" fillOpacity="0.12" transform="rotate(-10,84,4)" />
      <ellipse cx="84" cy="16" rx="3" ry="1.8" fill="currentColor" fillOpacity="0.12" transform="rotate(10,84,16)" />
      {/* Terminal dots */}
      <circle cx="4" cy="10" r="1.2" fill="currentColor" opacity="0.4" />
      <circle cx="116" cy="10" r="1.2" fill="currentColor" opacity="0.4" />
      {/* Small connector dots */}
      <circle cx="48" cy="10" r="0.8" fill="currentColor" opacity="0.3" />
      <circle cx="72" cy="10" r="0.8" fill="currentColor" opacity="0.3" />
    </svg>
  );
};

export default ArabesqueFlourish;
