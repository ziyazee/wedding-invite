import React from 'react';

interface GeometricPatternProps {
  className?: string;
  style?: React.CSSProperties;
}

const GeometricPattern: React.FC<GeometricPatternProps> = ({ className, style }) => (
  <svg
    viewBox="0 0 402 402"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={{ width: '100%', ...style }}
    aria-hidden="true"
    preserveAspectRatio="xMidYMid slice"
  >
    <defs>
      <pattern id="mc-geo-tile" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
        {/* 8-pointed star */}
        <polygon
          points="30,5 35,20 50,15 40,27 50,40 35,35 30,50 25,35 10,40 20,27 10,15 25,20"
          stroke="#D4A050"
          strokeWidth="0.5"
          fill="none"
          opacity="0.15"
        />
        {/* Inner octagon */}
        <polygon
          points="22,15 38,15 45,22 45,38 38,45 22,45 15,38 15,22"
          stroke="#D4A050"
          strokeWidth="0.3"
          fill="none"
          opacity="0.08"
        />
        {/* Corner diamonds */}
        <polygon points="0,0 8,4 0,8" fill="#D4A050" opacity="0.06" />
        <polygon points="60,0 52,4 60,8" fill="#D4A050" opacity="0.06" />
        <polygon points="0,60 8,56 0,52" fill="#D4A050" opacity="0.06" />
        <polygon points="60,60 52,56 60,52" fill="#D4A050" opacity="0.06" />
        {/* Center dot */}
        <circle cx="30" cy="30" r="1.5" fill="#D4A050" opacity="0.10" />
      </pattern>
      {/* Radial fade for depth */}
      <radialGradient id="mc-geo-fade" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="white" stopOpacity="1" />
        <stop offset="70%" stopColor="white" stopOpacity="0.6" />
        <stop offset="100%" stopColor="white" stopOpacity="0" />
      </radialGradient>
    </defs>
    <rect width="402" height="402" fill="url(#mc-geo-tile)" />
    <rect width="402" height="402" fill="url(#mc-geo-fade)" style={{ mixBlendMode: 'destination-in' }} />
  </svg>
);

export default GeometricPattern;
