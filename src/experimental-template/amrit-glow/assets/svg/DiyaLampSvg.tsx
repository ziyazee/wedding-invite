import React from 'react';

interface DiyaLampSvgProps {
  size?: number;
  className?: string;
}

export const DiyaLampSvg: React.FC<DiyaLampSvgProps> = ({
  size = 48,
  className,
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 60 80"
    width={size}
    height={size * (80 / 60)}
    className={className}
    aria-hidden="true"
    style={{ display: 'block' }}
  >
    <defs>
      <radialGradient id="ag-diya-flame-glow" cx="50%" cy="60%" r="50%">
        <stop offset="0%" stopColor="var(--ag-lamp, #FFE4A0)" stopOpacity="0.35" />
        <stop offset="50%" stopColor="var(--ag-gold, #D4A843)" stopOpacity="0.12" />
        <stop offset="100%" stopColor="var(--ag-gold, #D4A843)" stopOpacity="0" />
      </radialGradient>
      <linearGradient id="ag-diya-flame" x1="50%" y1="0%" x2="50%" y2="100%">
        <stop offset="0%" stopColor="#FFF7E0" />
        <stop offset="30%" stopColor="var(--ag-lamp, #FFE4A0)" />
        <stop offset="70%" stopColor="var(--ag-gold-bright, #E8C65A)" />
        <stop offset="100%" stopColor="var(--ag-gold, #D4A843)" stopOpacity="0.6" />
      </linearGradient>
      <linearGradient id="ag-diya-body" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="var(--ag-gold-bright, #E8C65A)" />
        <stop offset="50%" stopColor="var(--ag-gold, #D4A843)" />
        <stop offset="100%" stopColor="var(--ag-accent, #8B6914)" />
      </linearGradient>
      <linearGradient id="ag-diya-rim" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="var(--ag-accent, #8B6914)" />
        <stop offset="50%" stopColor="var(--ag-gold-bright, #E8C65A)" />
        <stop offset="100%" stopColor="var(--ag-accent, #8B6914)" />
      </linearGradient>
    </defs>

    {/* Flame glow aura */}
    <circle cx="30" cy="28" r="22" fill="url(#ag-diya-flame-glow)" />

    {/* Flame — teardrop shape */}
    <path
      d="M 30,10 Q 36,22 34,30 Q 32,34 30,35 Q 28,34 26,30 Q 24,22 30,10 Z"
      fill="url(#ag-diya-flame)"
      opacity="0.9"
    />
    {/* Flame inner bright core */}
    <path
      d="M 30,16 Q 33,24 32,29 Q 31,32 30,33 Q 29,32 28,29 Q 27,24 30,16 Z"
      fill="#FFF7E0"
      opacity="0.5"
    />

    {/* Wick */}
    <line
      x1="30" y1="33" x2="30" y2="40"
      stroke="var(--ag-gold-deep, #5C4410)"
      strokeWidth="1"
      opacity="0.6"
    />

    {/* Diya bowl — traditional oil lamp shape */}
    {/* Rim / lip */}
    <ellipse
      cx="30" cy="44"
      rx="18" ry="4"
      fill="url(#ag-diya-rim)"
      opacity="0.85"
    />
    {/* Bowl body */}
    <path
      d="M 12,44 Q 12,56 20,62 Q 25,65 30,65 Q 35,65 40,62 Q 48,56 48,44"
      fill="url(#ag-diya-body)"
      opacity="0.8"
    />
    {/* Inner bowl shadow */}
    <ellipse
      cx="30" cy="44"
      rx="14" ry="3"
      fill="var(--ag-accent, #8B6914)"
      opacity="0.4"
    />

    {/* Spout (traditional diya has a small lip for the wick) */}
    <path
      d="M 46,44 Q 50,43 52,42 Q 50,46 46,45"
      fill="var(--ag-gold, #D4A843)"
      opacity="0.6"
    />

    {/* Base / pedestal */}
    <ellipse
      cx="30" cy="65"
      rx="10" ry="2.5"
      fill="var(--ag-accent, #8B6914)"
      opacity="0.7"
    />
    <path
      d="M 22,65 Q 22,70 26,72 Q 28,73 30,73 Q 32,73 34,72 Q 38,70 38,65"
      fill="url(#ag-diya-body)"
      opacity="0.65"
    />
    <ellipse
      cx="30" cy="73"
      rx="8" ry="2"
      fill="var(--ag-accent, #8B6914)"
      opacity="0.5"
    />

    {/* Decorative dots on the bowl */}
    <circle cx="22" cy="52" r="0.8" fill="var(--ag-gold-bright, #E8C65A)" opacity="0.4" />
    <circle cx="30" cy="55" r="0.8" fill="var(--ag-gold-bright, #E8C65A)" opacity="0.35" />
    <circle cx="38" cy="52" r="0.8" fill="var(--ag-gold-bright, #E8C65A)" opacity="0.4" />
    <circle cx="26" cy="57" r="0.5" fill="var(--ag-gold-bright, #E8C65A)" opacity="0.25" />
    <circle cx="34" cy="57" r="0.5" fill="var(--ag-gold-bright, #E8C65A)" opacity="0.25" />

    {/* Rim highlight line */}
    <ellipse
      cx="30" cy="43"
      rx="16" ry="2.5"
      fill="none"
      stroke="var(--ag-gold-bright, #E8C65A)"
      strokeWidth="0.4"
      opacity="0.4"
    />
  </svg>
);
