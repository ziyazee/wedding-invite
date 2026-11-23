import React from 'react';

interface ArchSilhouetteProps extends React.SVGProps<SVGSVGElement> {
  strokeColor?: string;
  /** Stroke width in SVG units */
  strokeW?: number;
  /** Opacity of the stroke */
  opacity?: number;
  /** If true, the arch is open at the bottom (for RSVP form frame) */
  openBottom?: boolean;
}

/**
 * Simplified outline version of the full Mughal arch.
 * Thin stroke only, no fill. Used as a closing bookend and RSVP frame.
 *
 * S5 variant: openBottom=true (form content flows out below)
 * S7 variant: openBottom=false (full silhouette, closed pillars)
 *
 * Supports stroke-dashoffset animation for draw-in effect.
 * The total path length is available via ref.getTotalLength() for animation.
 */
const ArchSilhouette: React.FC<ArchSilhouetteProps> = ({
  strokeColor = '#D5C4A8',
  strokeW = 1.5,
  opacity = 0.6,
  openBottom = false,
  className,
  ...props
}) => {
  // The arch path: pointed top with scalloped inner edge, pillar sides
  const archPath = openBottom
    ? [
        // Open-bottom variant: pillars end without connecting
        // Left pillar base (open)
        'M60 480',
        // Up the left pillar
        'L60 160',
        // Left side of arch, curving up
        'C60 100, 90 50, 160 30',
        // Scalloped cusps across the top (5 cusps)
        // Cusp 1
        'C168 26, 170 22, 168 18',
        'C172 14, 182 10, 190 12',
        // Cusp 2
        'C194 10, 196 6, 194 4',
        'C198 0, 204 0, 206 4',
        // Cusp 3 (peak)
        'C208 6, 206 10, 210 12',
        'C218 10, 228 14, 232 18',
        // Cusp 4
        'C230 22, 232 26, 240 30',
        // Right side descending
        'C310 50, 340 100, 340 160',
        // Down the right pillar (open)
        'L340 480',
      ].join(' ')
    : [
        // Closed variant: full silhouette
        // Start at left pillar base
        'M60 520',
        // Up the left pillar
        'L60 160',
        // Left side of arch, curving up
        'C60 100, 90 50, 160 30',
        // Scalloped cusps across the top (5 cusps)
        'C168 26, 170 22, 168 18',
        'C172 14, 182 10, 190 12',
        'C194 10, 196 6, 194 4',
        'C198 0, 204 0, 206 4',
        'C208 6, 206 10, 210 12',
        'C218 10, 228 14, 232 18',
        'C230 22, 232 26, 240 30',
        // Right side descending
        'C310 50, 340 100, 340 160',
        // Down the right pillar
        'L340 520',
      ].join(' ');

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={`0 0 400 ${openBottom ? 480 : 520}`}
      fill="none"
      aria-hidden="true"
      className={className}
      {...props}
    >
      <path
        d={archPath}
        stroke={strokeColor}
        strokeWidth={strokeW}
        strokeOpacity={opacity}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />

      {/* Pillar capital details -- small horizontal bars */}
      <line
        x1="50"
        y1="160"
        x2="70"
        y2="160"
        stroke={strokeColor}
        strokeWidth={strokeW * 0.7}
        strokeOpacity={opacity * 0.7}
      />
      <line
        x1="330"
        y1="160"
        x2="350"
        y2="160"
        stroke={strokeColor}
        strokeWidth={strokeW * 0.7}
        strokeOpacity={opacity * 0.7}
      />
    </svg>
  );
};

export default ArchSilhouette;
