import React from 'react';

interface SvgProps {
  className?: string;
  style?: React.CSSProperties;
  /** 'white' (16x16, ambient sparkle) or 'gold' (12x12, countdown flash) */
  variant?: 'white' | 'gold';
}

/**
 * Four-pointed star sparkle for ambient animation.
 * White variant: 16x16, used across all sections as ambient sparkle.
 * Gold variant: 12x12, used for countdown number change flash.
 */
const FourPointStar: React.FC<SvgProps> = ({ className, style, variant = 'white' }) => {
  const size = variant === 'gold' ? 12 : 16;
  const half = size / 2;
  // Four elongated diamond points from center
  const armLength = half * 0.9;
  const armWidth = half * 0.18;

  return (
    <svg
      viewBox={`0 0 ${size} ${size}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={style}
      aria-hidden="true"
    >
      {/* Four-pointed star: top, right, bottom, left arms */}
      <path
        d={`
          M${half},${half - armLength}
          C${half + armWidth},${half - armWidth} ${half + armWidth},${half - armWidth} ${half + armLength},${half}
          C${half + armWidth},${half + armWidth} ${half + armWidth},${half + armWidth} ${half},${half + armLength}
          C${half - armWidth},${half + armWidth} ${half - armWidth},${half + armWidth} ${half - armLength},${half}
          C${half - armWidth},${half - armWidth} ${half - armWidth},${half - armWidth} ${half},${half - armLength}
          Z
        `}
        fill={variant === 'gold' ? '#D4A050' : '#FFFFFF'}
        fillOpacity={variant === 'gold' ? 1 : 0.7}
      />
      {/* Center glow dot */}
      <circle
        cx={half}
        cy={half}
        r={armWidth * 1.5}
        fill={variant === 'gold' ? '#D4A050' : '#FFFFFF'}
        fillOpacity={variant === 'gold' ? 0.8 : 0.9}
      />
    </svg>
  );
};

export default FourPointStar;
