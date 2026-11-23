import React from 'react';

interface HmMarigoldProps {
  size?: number;
  fillColor?: string;
  strokeColor?: string;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Rajasthani marigold — concentric petal rings with computed radial geometry.
 */
const HmMarigold: React.FC<HmMarigoldProps> = ({
  size = 60,
  fillColor = 'rgba(181,138,67,0.15)',
  strokeColor = 'var(--hm-gold-deep, #B58A43)',
  className,
  style,
}) => {
  const cx = 50;
  const cy = 50;

  function r(n: number): string {
    return (Math.round(n * 100) / 100).toString();
  }

  function petalRing(
    count: number,
    innerR: number,
    outerR: number,
    width: number,
    offsetDeg: number = 0,
  ): string {
    const paths: string[] = [];
    const step = (2 * Math.PI) / count;

    for (let i = 0; i < count; i++) {
      const angle = i * step + (offsetDeg * Math.PI) / 180;
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);

      // Base (near center) and tip (outer edge)
      const bx = cx + innerR * cos;
      const by = cy + innerR * sin;
      const tx = cx + outerR * cos;
      const ty = cy + outerR * sin;

      // Perpendicular for petal width
      const px = -sin;
      const py = cos;

      // Mid-control — bulge point at 55% of petal length
      const midR = (innerR + outerR) * 0.55;
      const mx = cx + midR * cos;
      const my = cy + midR * sin;

      const c1x = mx + width * px;
      const c1y = my + width * py;
      const c2x = mx - width * px;
      const c2y = my - width * py;

      paths.push(
        `M ${r(bx)} ${r(by)} Q ${r(c1x)} ${r(c1y)}, ${r(tx)} ${r(ty)} Q ${r(c2x)} ${r(c2y)}, ${r(bx)} ${r(by)} Z`
      );
    }
    return paths.join(' ');
  }

  // Three rings, each offset so petals interleave
  const outerPetals = petalRing(14, 14, 46, 9, 0);
  const midPetals = petalRing(10, 9, 34, 7.5, (360 / 14) / 2);
  const innerPetals = petalRing(6, 5, 22, 6, 15);

  // Center ring of dots
  const dotCount = 8;
  const dotR = 6.5;
  const centerDots = Array.from({ length: dotCount }, (_, i) => {
    const a = (i * Math.PI * 2) / dotCount;
    return { x: cx + dotR * Math.cos(a), y: cy + dotR * Math.sin(a) };
  });

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      width={size}
      height={size}
      aria-hidden="true"
      className={className}
      style={style}
    >
      <path d={outerPetals} fill={fillColor} stroke={strokeColor} strokeWidth="0.8" />
      <path d={midPetals} fill={fillColor} stroke={strokeColor} strokeWidth="0.7" opacity="0.7" />
      <path d={innerPetals} fill={strokeColor} opacity="0.12" stroke={strokeColor} strokeWidth="0.6" />
      <circle cx={cx} cy={cy} r={4} fill={strokeColor} opacity="0.2" />
      <circle cx={cx} cy={cy} r={2} fill={strokeColor} opacity="0.35" />
      {centerDots.map((d, i) => (
        <circle key={i} cx={r(d.x)} cy={r(d.y)} r="1.2" fill={strokeColor} opacity="0.25" />
      ))}
    </svg>
  );
};

export default HmMarigold;
