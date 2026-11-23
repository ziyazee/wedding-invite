import React from 'react';

interface VineBorderProps extends React.SVGProps<SVGSVGElement> {
  color?: string;
  /** Height of the vine in pixels */
  height?: number;
  /** Opacity of the vine */
  opacity?: number;
}

/**
 * Vertical vine with small leaves every ~40px.
 * Used as frame side borders for the countdown and RSVP sections.
 *
 * Simple single stem with alternating small leaves.
 * Low opacity -- purely ambient decoration.
 */
const VineBorder: React.FC<VineBorderProps> = ({
  color = '#7A9A6A',
  height = 300,
  opacity = 0.2,
  className,
  style,
  ...props
}) => {
  // Calculate how many leaf pairs we need based on height
  const leafSpacing = 40;
  const leafCount = Math.max(2, Math.floor(height / leafSpacing));
  const viewBoxHeight = leafCount * leafSpacing + 20;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={`0 0 16 ${viewBoxHeight}`}
      fill="none"
      aria-hidden="true"
      className={className}
      style={{
        ...style,
        height,
        opacity,
      }}
      {...props}
    >
      {/* Main vine stem -- gentle S-curve */}
      <path
        d={`M8 0 ${Array.from({ length: leafCount + 1 }, (_, i) => {
          const y = i * leafSpacing;
          const xOffset = i % 2 === 0 ? 1 : -1;
          return `S${8 + xOffset * 2} ${y + leafSpacing * 0.5}, 8 ${y + leafSpacing}`;
        }).join(' ')}`}
        stroke={color}
        strokeWidth="0.8"
        strokeLinecap="round"
        fill="none"
      />

      {/* Alternating leaves */}
      {Array.from({ length: leafCount }, (_, i) => {
        const y = (i + 0.5) * leafSpacing + 10;
        const isLeft = i % 2 === 0;
        const leafX = isLeft ? -1 : 11;
        const tipX = isLeft ? -4 : 20;

        return (
          <g key={i}>
            {/* Leaf shape */}
            <path
              d={`M8 ${y} C${leafX + 4} ${y - 4}, ${tipX} ${y - 3}, ${tipX} ${y} C${tipX} ${y + 3}, ${leafX + 4} ${y + 4}, 8 ${y} Z`}
              fill={color}
              fillOpacity="0.6"
            />
            {/* Leaf vein */}
            <line
              x1="8"
              y1={y}
              x2={tipX * 0.7 + 8 * 0.3}
              y2={y}
              stroke={color}
              strokeWidth="0.3"
              strokeOpacity="0.4"
            />
          </g>
        );
      })}
    </svg>
  );
};

export default VineBorder;
