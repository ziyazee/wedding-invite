import React from 'react';

interface MughalArchPatternProps {
  className?: string;
  width?: number;
  height?: number;
  /** Pattern opacity — should be very low (0.03–0.08) for background use */
  patternOpacity?: number;
}

/**
 * Repeating cusped Mughal arch pattern — used as a low-opacity background texture.
 * Each arch unit features a pointed (cusped) arch with internal filigree detail,
 * inspired by Mughal-Rajput jali screens. The arches tile horizontally.
 *
 * Use at very low opacity (0.03–0.08) behind section content for subtle depth.
 * The pattern is defined using SVG <pattern> so it tiles efficiently.
 */
export const MughalArchPattern: React.FC<MughalArchPatternProps> = ({
  className,
  width = 402,
  height = 300,
  patternOpacity = 0.05,
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={`0 0 ${width} ${height}`}
      width={width}
      height={height}
      className={className}
      aria-hidden="true"
      style={{ display: 'block' }}
    >
      <defs>
        {/* Single arch unit: 80x100 tile */}
        <pattern
          id="ag-mughal-arch-tile"
          x="0"
          y="0"
          width="80"
          height="100"
          patternUnits="userSpaceOnUse"
        >
          <g
            fill="none"
            stroke="var(--ag-gold, #D4A843)"
            strokeLinecap="round"
          >
            {/* Outer cusped arch */}
            <path
              d="M10,100 L10,45 Q10,25 25,15 Q40,5 40,5 Q40,5 55,15 Q70,25 70,45 L70,100"
              strokeWidth="0.6"
              opacity="0.6"
            />
            {/* Inner cusped arch — concentric, smaller */}
            <path
              d="M18,100 L18,50 Q18,34 30,24 Q40,16 40,16 Q40,16 50,24 Q62,34 62,50 L62,100"
              strokeWidth="0.4"
              opacity="0.35"
            />
            {/* Arch peak finial — lotus bud tip */}
            <path
              d="M38,6 L40,0 L42,6"
              strokeWidth="0.5"
              opacity="0.5"
            />
            {/* Small internal medallion at arch center */}
            <circle
              cx="40"
              cy="40"
              r="5"
              strokeWidth="0.35"
              opacity="0.3"
            />
            {/* Cross detail inside medallion */}
            <line x1="40" y1="36" x2="40" y2="44" strokeWidth="0.25" opacity="0.2" />
            <line x1="36" y1="40" x2="44" y2="40" strokeWidth="0.25" opacity="0.2" />

            {/* Cusp scallop details — small inward points at the arch shoulders */}
            <path
              d="M16,55 Q20,48 25,50"
              strokeWidth="0.3"
              opacity="0.25"
            />
            <path
              d="M64,55 Q60,48 55,50"
              strokeWidth="0.3"
              opacity="0.25"
            />

            {/* Vertical pilaster lines at arch sides */}
            <line x1="10" y1="50" x2="10" y2="100" strokeWidth="0.3" opacity="0.2" />
            <line x1="70" y1="50" x2="70" y2="100" strokeWidth="0.3" opacity="0.2" />

            {/* Base horizontal line connecting arches */}
            <line x1="0" y1="100" x2="80" y2="100" strokeWidth="0.4" opacity="0.15" />
          </g>
        </pattern>
      </defs>

      {/* Fill entire area with the tiled pattern */}
      <rect
        x="0"
        y="0"
        width={width}
        height={height}
        fill="url(#ag-mughal-arch-tile)"
        opacity={patternOpacity}
      />
    </svg>
  );
};
