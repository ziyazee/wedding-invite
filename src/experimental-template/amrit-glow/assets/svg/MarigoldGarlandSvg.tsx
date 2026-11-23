import React from 'react';

interface MarigoldGarlandSvgProps {
  width?: number;
  className?: string;
}

export const MarigoldGarlandSvg: React.FC<MarigoldGarlandSvgProps> = ({
  width = 300,
  className,
}) => {
  const w = 300;
  const h = 80;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={`0 0 ${w} ${h}`}
      width={width}
      height={width * (h / w)}
      className={className}
      aria-hidden="true"
      style={{ display: 'block' }}
    >
      <defs>
        <radialGradient id="ag-mg-bloom" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="var(--ag-gold-bright, #E8C65A)" />
          <stop offset="60%" stopColor="var(--ag-gold, #D4A843)" />
          <stop offset="100%" stopColor="var(--ag-accent, #8B6914)" stopOpacity="0.6" />
        </radialGradient>
        <radialGradient id="ag-mg-bloom-sm" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="var(--ag-gold-bright, #E8C65A)" stopOpacity="0.8" />
          <stop offset="100%" stopColor="var(--ag-gold, #D4A843)" stopOpacity="0.4" />
        </radialGradient>
      </defs>

      {/* Main swooping garland thread */}
      <path
        d={`M 10,15 Q 75,65 150,55 Q 225,45 290,15`}
        fill="none"
        stroke="var(--ag-gold-muted, #9A7B2E)"
        strokeWidth="1"
        opacity="0.4"
      />
      {/* Second parallel thread (slight offset for thickness) */}
      <path
        d={`M 10,13 Q 75,62 150,52 Q 225,42 290,13`}
        fill="none"
        stroke="var(--ag-gold, #D4A843)"
        strokeWidth="0.5"
        opacity="0.25"
      />

      {/* Marigold blooms along the garland — larger flowers */}
      {[
        { cx: 40, cy: 30, r: 7 },
        { cx: 80, cy: 48, r: 8 },
        { cx: 115, cy: 54, r: 7 },
        { cx: 150, cy: 55, r: 9 },
        { cx: 185, cy: 52, r: 7 },
        { cx: 220, cy: 44, r: 8 },
        { cx: 260, cy: 28, r: 7 },
      ].map((flower, i) => (
        <g key={i}>
          {/* Outer petals — 8 overlapping ellipses */}
          {Array.from({ length: 8 }).map((_, j) => {
            const angle = (360 / 8) * j;
            const rad = (angle * Math.PI) / 180;
            const px = flower.cx + Math.cos(rad) * (flower.r * 0.5);
            const py = flower.cy + Math.sin(rad) * (flower.r * 0.5);
            return (
              <ellipse
                key={j}
                cx={px}
                cy={py}
                rx={flower.r * 0.55}
                ry={flower.r * 0.3}
                transform={`rotate(${angle}, ${px}, ${py})`}
                fill="url(#ag-mg-bloom)"
                opacity={0.5 + (j % 2) * 0.1}
              />
            );
          })}
          {/* Center */}
          <circle cx={flower.cx} cy={flower.cy} r={flower.r * 0.3} fill="var(--ag-gold-bright, #E8C65A)" opacity="0.7" />
        </g>
      ))}

      {/* Smaller buds between main flowers */}
      {[
        { cx: 58, cy: 40 },
        { cx: 98, cy: 52 },
        { cx: 132, cy: 56 },
        { cx: 168, cy: 54 },
        { cx: 202, cy: 48 },
        { cx: 240, cy: 36 },
      ].map((bud, i) => (
        <g key={`bud-${i}`}>
          {Array.from({ length: 5 }).map((_, j) => {
            const angle = (360 / 5) * j;
            const rad = (angle * Math.PI) / 180;
            const px = bud.cx + Math.cos(rad) * 1.5;
            const py = bud.cy + Math.sin(rad) * 1.5;
            return (
              <ellipse
                key={j}
                cx={px}
                cy={py}
                rx="2.5"
                ry="1.5"
                transform={`rotate(${angle}, ${px}, ${py})`}
                fill="url(#ag-mg-bloom-sm)"
                opacity="0.45"
              />
            );
          })}
          <circle cx={bud.cx} cy={bud.cy} r="1" fill="var(--ag-gold-bright, #E8C65A)" opacity="0.5" />
        </g>
      ))}

      {/* Small leaf accents */}
      {[
        { x: 25, y: 20, angle: 30 },
        { x: 135, y: 48, angle: -15 },
        { x: 275, y: 20, angle: -30 },
      ].map((leaf, i) => (
        <path
          key={`leaf-${i}`}
          d="M 0,0 Q 4,-3 8,0 Q 4,3 0,0 Z"
          fill="var(--ag-gold-muted, #9A7B2E)"
          opacity="0.3"
          transform={`translate(${leaf.x}, ${leaf.y}) rotate(${leaf.angle})`}
        />
      ))}

      {/* Hanging threads from the drape */}
      {[60, 110, 150, 190, 240].map((x, i) => {
        const baseY = i === 2 ? 55 : i === 0 || i === 4 ? 35 : 48;
        return (
          <line
            key={`thread-${i}`}
            x1={x}
            y1={baseY}
            x2={x}
            y2={baseY + 8 + (i === 2 ? 4 : 0)}
            stroke="var(--ag-gold-muted, #9A7B2E)"
            strokeWidth="0.5"
            opacity="0.25"
          />
        );
      })}
    </svg>
  );
};
