import React from 'react';

interface FireworkBurstSvgProps {
  size?: number;
  className?: string;
}

export const FireworkBurstSvg: React.FC<FireworkBurstSvgProps> = ({
  size = 280,
  className,
}) => {
  const rays: Array<{ angle: number; len: number; opacity: number; width: number }> = [];
  const count = 36;
  for (let i = 0; i < count; i++) {
    const angle = (360 / count) * i;
    const isMain = i % 3 === 0;
    const isMid = i % 3 === 1;
    rays.push({
      angle,
      len: isMain ? 42 : isMid ? 30 : 20,
      opacity: isMain ? 0.45 : isMid ? 0.3 : 0.18,
      width: isMain ? 1.2 : isMid ? 0.8 : 0.5,
    });
  }

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      width={size}
      height={size}
      className={className}
      aria-hidden="true"
      style={{ display: 'block' }}
    >
      <defs>
        <radialGradient id="ag-fw-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="var(--ag-lamp, #FFE4A0)" stopOpacity="0.12" />
          <stop offset="35%" stopColor="var(--ag-gold, #D4A843)" stopOpacity="0.06" />
          <stop offset="100%" stopColor="var(--ag-gold, #D4A843)" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Central glow */}
      <circle cx="50" cy="50" r="48" fill="url(#ag-fw-glow)" />

      {/* Radiating rays */}
      <g stroke="var(--ag-gold, #D4A843)" strokeLinecap="round">
        {rays.map((r, i) => {
          const rad = (r.angle * Math.PI) / 180;
          const innerR = 6;
          const x1 = 50 + Math.cos(rad) * innerR;
          const y1 = 50 + Math.sin(rad) * innerR;
          const x2 = 50 + Math.cos(rad) * r.len;
          const y2 = 50 + Math.sin(rad) * r.len;
          return (
            <line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              strokeWidth={r.width}
              opacity={r.opacity}
            />
          );
        })}
      </g>

      {/* Small sparkle dots at the tips of longer rays */}
      <g fill="var(--ag-gold-bright, #E8C65A)">
        {rays
          .filter((_, i) => i % 3 === 0)
          .map((r, i) => {
            const rad = (r.angle * Math.PI) / 180;
            const cx = 50 + Math.cos(rad) * (r.len + 2);
            const cy = 50 + Math.sin(rad) * (r.len + 2);
            return <circle key={i} cx={cx} cy={cy} r="0.8" opacity="0.5" />;
          })}
      </g>

      {/* Inner ring */}
      <circle
        cx="50"
        cy="50"
        r="5"
        fill="none"
        stroke="var(--ag-gold, #D4A843)"
        strokeWidth="0.5"
        opacity="0.3"
      />

      {/* Center bright dot */}
      <circle cx="50" cy="50" r="2" fill="var(--ag-gold-bright, #E8C65A)" opacity="0.4" />
    </svg>
  );
};
