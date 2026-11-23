import React from 'react';

interface CrescentMoonSvgProps {
  size?: number;
  className?: string;
}

export const CrescentMoonSvg: React.FC<CrescentMoonSvgProps> = ({
  size = 100,
  className,
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 120 120"
    width={size}
    height={size}
    className={className}
    aria-hidden="true"
    style={{ display: 'block' }}
  >
    <defs>
      <radialGradient id="ag-moon-glow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="var(--ag-lamp, #FFE4A0)" stopOpacity="0.18" />
        <stop offset="40%" stopColor="var(--ag-gold, #D4A843)" stopOpacity="0.08" />
        <stop offset="100%" stopColor="var(--ag-gold, #D4A843)" stopOpacity="0" />
      </radialGradient>
      <linearGradient id="ag-moon-body" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="var(--ag-gold-bright, #E8C65A)" />
        <stop offset="40%" stopColor="var(--ag-gold, #D4A843)" />
        <stop offset="100%" stopColor="var(--ag-accent, #8B6914)" />
      </linearGradient>
      <linearGradient id="ag-moon-inner" x1="20%" y1="0%" x2="80%" y2="100%">
        <stop offset="0%" stopColor="var(--ag-gold-bright, #E8C65A)" stopOpacity="0.3" />
        <stop offset="100%" stopColor="var(--ag-accent, #8B6914)" stopOpacity="0.1" />
      </linearGradient>
    </defs>

    {/* Outer glow halo */}
    <circle cx="60" cy="55" r="55" fill="url(#ag-moon-glow)" />

    {/* Crescent body — outer arc minus inner arc to create crescent shape */}
    <path
      d="M 45,12 A 42,42 0 1,1 45,98 A 32,32 0 1,0 45,12 Z"
      fill="url(#ag-moon-body)"
      opacity="0.85"
    />

    {/* Inner edge highlight */}
    <path
      d="M 45,14 A 41,41 0 1,1 45,96"
      fill="none"
      stroke="var(--ag-gold-bright, #E8C65A)"
      strokeWidth="0.6"
      opacity="0.5"
    />

    {/* Subtle crater texture marks */}
    <circle cx="68" cy="40" r="3" fill="url(#ag-moon-inner)" opacity="0.4" />
    <circle cx="80" cy="58" r="4.5" fill="url(#ag-moon-inner)" opacity="0.3" />
    <circle cx="62" cy="72" r="2.5" fill="url(#ag-moon-inner)" opacity="0.35" />
    <circle cx="75" cy="45" r="1.8" fill="url(#ag-moon-inner)" opacity="0.25" />
    <circle cx="70" cy="82" r="2" fill="url(#ag-moon-inner)" opacity="0.2" />

    {/* Star accents near the moon */}
    <g fill="var(--ag-gold-bright, #E8C65A)" opacity="0.6">
      <circle cx="25" cy="22" r="0.8" />
      <circle cx="18" cy="45" r="0.5" />
      <circle cx="30" cy="90" r="0.6" />
    </g>
  </svg>
);
