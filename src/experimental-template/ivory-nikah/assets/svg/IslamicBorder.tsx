/**
 * Islamic Geometric Pattern Border
 *
 * A horizontal border strip using Islamic 8-pointed star / octagonal
 * interlace geometry. Tileable/repeating. Used as a decorative accent
 * band between sections or as a subtle background element.
 *
 * The pattern is based on a classic Islamic 8-pointed star (octagram)
 * created from two overlapping squares rotated 45 degrees, with
 * interlacing kite shapes filling the gaps.
 *
 * One tile is 60x60px; the viewBox shows 5 tiles (300x60).
 * Use CSS background-repeat or render at desired width.
 */

interface BorderProps {
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Generates one 8-pointed star tile centered at (cx, cy).
 * The star is inscribed in a circle of radius r.
 */
function StarTile({ cx, cy, r }: { cx: number; cy: number; r: number }) {
  // 8-pointed star: two overlapping squares rotated 45 degrees
  // Outer square vertices
  const sq1 = [
    [cx - r, cy - r],
    [cx + r, cy - r],
    [cx + r, cy + r],
    [cx - r, cy + r],
  ];

  // Rotated square vertices (45 degrees)
  const d = r * Math.SQRT2 * 0.5; // half-diagonal for inner overlap
  const sq2 = [
    [cx, cy - r],
    [cx + r, cy],
    [cx, cy + r],
    [cx - r, cy],
  ];

  // Inner octagon radius (where the two squares intersect)
  const ir = r * 0.414; // tan(22.5deg) * r

  // 8 intersection points of the two squares (forms the inner octagon)
  const angles = Array.from({ length: 8 }, (_, i) => (i * Math.PI) / 4 - Math.PI / 8);
  const innerOctagon = angles.map((a) => [
    cx + ir * Math.cos(a),
    cy + ir * Math.sin(a),
  ]);

  // 8 outer star points
  const outerPoints = Array.from({ length: 8 }, (_, i) => {
    const a = (i * Math.PI) / 4;
    return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
  });

  // Build star path: alternate outer point -> inner octagon vertices
  const starPoints: number[][] = [];
  for (let i = 0; i < 8; i++) {
    starPoints.push(outerPoints[i]);
    starPoints.push(innerOctagon[i]);
  }

  const starPath =
    'M' +
    starPoints.map((p) => `${p[0].toFixed(2)},${p[1].toFixed(2)}`).join(' L') +
    ' Z';

  // Inner octagon path
  const octPath =
    'M' +
    innerOctagon.map((p) => `${p[0].toFixed(2)},${p[1].toFixed(2)}`).join(' L') +
    ' Z';

  return (
    <g>
      {/* Star outline */}
      <path
        d={starPath}
        fill="none"
        stroke="#C9A84C"
        strokeWidth="0.6"
        opacity="0.35"
      />
      {/* Inner octagon fill */}
      <path
        d={octPath}
        fill="#C9A84C"
        opacity="0.08"
      />
      {/* Center dot */}
      <circle
        cx={cx}
        cy={cy}
        r={1.2}
        fill="#C9A84C"
        opacity="0.25"
      />
    </g>
  );
}

export function IslamicBorder({ className, style }: BorderProps) {
  const tileSize = 60;
  const tileCount = 5;
  const width = tileSize * tileCount;
  const height = tileSize;
  const starR = 22; // Star inscribed radius

  // Generate tile centers
  const tiles = Array.from({ length: tileCount }, (_, i) => ({
    cx: tileSize * i + tileSize / 2,
    cy: height / 2,
  }));

  // Connecting diamonds between stars (at tile boundaries)
  const diamonds = Array.from({ length: tileCount - 1 }, (_, i) => {
    const x = tileSize * (i + 1);
    const y = height / 2;
    const dh = 10;
    const dw = 6;
    return `M${x},${y - dh} L${x + dw},${y} L${x},${y + dh} L${x - dw},${y} Z`;
  });

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className={className}
      style={style}
      aria-hidden="true"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="islamicBorderGold" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#C9A84C" stopOpacity="0" />
          <stop offset="10%" stopColor="#C9A84C" stopOpacity="1" />
          <stop offset="90%" stopColor="#C9A84C" stopOpacity="1" />
          <stop offset="100%" stopColor="#C9A84C" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Top and bottom border lines */}
      <line
        x1="0"
        y1="1"
        x2={width}
        y2="1"
        stroke="url(#islamicBorderGold)"
        strokeWidth="0.5"
        opacity="0.3"
      />
      <line
        x1="0"
        y1={height - 1}
        x2={width}
        y2={height - 1}
        stroke="url(#islamicBorderGold)"
        strokeWidth="0.5"
        opacity="0.3"
      />

      {/* Star tiles */}
      {tiles.map((tile, i) => (
        <StarTile key={i} cx={tile.cx} cy={tile.cy} r={starR} />
      ))}

      {/* Connecting diamonds between tiles */}
      {diamonds.map((d, i) => (
        <path
          key={`diamond-${i}`}
          d={d}
          fill="none"
          stroke="#C9A84C"
          strokeWidth="0.5"
          opacity="0.25"
        />
      ))}

      {/* Interlace cross-hatching between stars */}
      {tiles.map((tile, i) => {
        if (i >= tileCount - 1) return null;
        const x1 = tile.cx + starR * 0.7;
        const x2 = tiles[i + 1].cx - starR * 0.7;
        const y = height / 2;
        return (
          <g key={`interlace-${i}`}>
            <line
              x1={x1}
              y1={y - 8}
              x2={x2}
              y2={y - 8}
              stroke="#E0CFA0"
              strokeWidth="0.4"
              opacity="0.2"
            />
            <line
              x1={x1}
              y1={y + 8}
              x2={x2}
              y2={y + 8}
              stroke="#E0CFA0"
              strokeWidth="0.4"
              opacity="0.2"
            />
          </g>
        );
      })}
    </svg>
  );
}
