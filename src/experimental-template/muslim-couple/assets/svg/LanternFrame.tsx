import React from 'react';

interface LanternFrameProps {
  side: 'left' | 'right';
  className?: string;
  style?: React.CSSProperties;
}

const LanternFrame: React.FC<LanternFrameProps> = ({ side, className, style }) => (
  <svg
    viewBox="0 0 60 200"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={{
      width: 60,
      transform: side === 'right' ? 'scaleX(-1)' : 'none',
      ...style,
    }}
    aria-hidden="true"
  >
    {/* Hanging chain */}
    <path d="M30 0 V40" stroke="#D4A050" strokeWidth="1" opacity="0.3" />
    {[10, 20, 30].map((y) => (
      <circle key={y} cx="30" cy={y} r="1" fill="#D4A050" opacity="0.2" />
    ))}
    {/* Lantern body */}
    <g transform="translate(30, 80)">
      {/* Top cap */}
      <path d="M-8 -30 Q0 -38 8 -30" stroke="#C89540" strokeWidth="1.5" fill="none" opacity="0.5" />
      <rect x="-10" y="-30" width="20" height="4" rx="2" fill="#C89540" opacity="0.3" />
      {/* Glass body — warm glow */}
      <rect x="-12" y="-26" width="24" height="40" rx="3" fill="#F0C870" opacity="0.15" />
      <rect x="-12" y="-26" width="24" height="40" rx="3" stroke="#D4A050" strokeWidth="1" fill="none" opacity="0.35" />
      {/* Inner geometric cut pattern */}
      <path d="M-8 -18 L0 -22 L8 -18 L8 -8 L0 -4 L-8 -8 Z" stroke="#D4A050" strokeWidth="0.5" fill="none" opacity="0.2" />
      <path d="M-8 -2 L0 -6 L8 -2 L8 8 L0 12 L-8 8 Z" stroke="#D4A050" strokeWidth="0.5" fill="none" opacity="0.2" />
      {/* Glow */}
      <circle r="20" fill="#F0C870" opacity="0.08" />
      <circle r="12" fill="#E8A040" opacity="0.06" />
      {/* Bottom cap */}
      <rect x="-10" y="14" width="20" height="4" rx="2" fill="#C89540" opacity="0.3" />
      <path d="M-6 18 Q0 24 6 18" stroke="#C89540" strokeWidth="1" fill="none" opacity="0.3" />
    </g>
    {/* Vine wrapping down from lantern */}
    <path
      d="M30 120 Q20 140 30 155 Q40 170 30 185 Q25 195 30 200"
      stroke="#5A7D5A"
      strokeWidth="0.8"
      fill="none"
      opacity="0.2"
    />
    {[145, 175].map((y, i) => (
      <circle key={i} cx={25 + (i % 2) * 10} cy={y} r="4" fill="#F2A8B8" opacity="0.18" />
    ))}
  </svg>
);

export default LanternFrame;
