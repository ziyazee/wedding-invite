import React from 'react';

interface HmJaliPatternProps {
  /** Stroke color for the hexagonal grid — defaults to CSS var(--hm-gold) */
  strokeColor?: string;
  /** Stroke width */
  strokeWidth?: number;
  /** Pattern tile ID — must be unique if multiple instances exist on the page */
  patternId?: string;
  /** Additional CSS class on the container SVG */
  className?: string;
  /** Additional inline styles on the container SVG */
  style?: React.CSSProperties;
}

/**
 * HmJaliPattern — Hexagonal honeycomb lattice overlay.
 *
 * Renders a full-coverage SVG with an inline <pattern> tile that produces
 * the characteristic jali (lattice screen) pattern of the Hawa Mahal.
 *
 * The component renders as a full-size absolute-positioned overlay.
 * The parent must control opacity (typically 3-6%) and pointer-events.
 *
 * Pattern tile: 40px wide x ~46px tall (proper hexagonal tessellation).
 * Each hexagon has ~40px flat-to-flat width, 1px stroke, no fill.
 *
 * Color variants:
 *   - Gold (#D4A055): Welcome, Countdown full overlay, RSVP, Closing
 *   - Teal (#2A4540): Countdown timer band
 */
const HmJaliPattern: React.FC<HmJaliPatternProps> = ({
  strokeColor = 'var(--hm-gold, #D4A055)',
  strokeWidth = 1,
  patternId = 'hm-jali-hex',
  className,
  style,
}) => {
  // Hexagonal geometry for a pointy-top hexagon tessellation
  // For a hexagon with flat-to-flat width W = 40px:
  //   side length s = W / sqrt(3) ~ 23.09px
  //   point-to-point height = 2 * s ~ 46.19px
  //   flat-to-flat width = W = 40px
  //
  // Tessellation tile: width = W (40px), height = s * 1.5 (34.64px)
  // We need two hexagons per tile: one at (0,0) offset and one at (W/2, s*0.75)

  const W = 40; // flat-to-flat width
  const s = W / Math.sqrt(3); // side length (~23.09)
  const tileW = W;
  const tileH = s * 1.5; // ~34.64

  // Build a single hexagon path centered at (cx, cy) with pointy-top orientation
  const hexPath = (cx: number, cy: number): string => {
    const points: Array<[number, number]> = [];
    for (let i = 0; i < 6; i++) {
      // Pointy-top: first vertex at top (angle = -90 deg)
      const angle = (Math.PI / 3) * i - Math.PI / 2;
      points.push([
        cx + s * Math.cos(angle),
        cy + s * Math.sin(angle),
      ]);
    }
    return (
      `M ${points[0][0].toFixed(3)} ${points[0][1].toFixed(3)} ` +
      points
        .slice(1)
        .map(([x, y]) => `L ${x.toFixed(3)} ${y.toFixed(3)}`)
        .join(' ') +
      ' Z'
    );
  };

  // The two hexagon centers for the tile
  // Hex 1 at the tile origin (will be tiled)
  // Hex 2 offset by half-width horizontally and 3/4 height vertically
  const hex1 = hexPath(0, 0);
  const hex2 = hexPath(tileW / 2, tileH / 2);

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="100%"
      height="100%"
      aria-hidden="true"
      className={className}
      style={{ display: 'block', ...style }}
    >
      <defs>
        <pattern
          id={patternId}
          x="0"
          y="0"
          width={tileW}
          height={tileH}
          patternUnits="userSpaceOnUse"
        >
          <path
            d={hex1}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            fill="none"
          />
          <path
            d={hex2}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            fill="none"
          />
        </pattern>
      </defs>
      <rect
        width="100%"
        height="100%"
        fill={`url(#${patternId})`}
      />
    </svg>
  );
};

export default HmJaliPattern;
