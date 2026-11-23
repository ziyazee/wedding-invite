import React from 'react';

interface HmPaisleyProps {
  size?: number;
  fillColor?: string;
  strokeColor?: string;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * HmPaisley — Rajasthani mango/ambi paisley motif.
 *
 * Geometry: teardrop built from two cubic Béziers sharing
 * a pointed tip at top and a rounded base at bottom.
 * Inner detail ring offset inward by 18% of the radius.
 * Top curl: quarter-circle arc departing from the tip tangent.
 * Spine dots: evenly spaced along the vertical center.
 * Leaf veins: quadratic arcs from spine to outer contour at 3 heights.
 *
 * viewBox 0 0 100 150 — portrait; width derived from size * 0.667.
 */
const HmPaisley: React.FC<HmPaisleyProps> = ({
  size = 60,
  fillColor = 'rgba(181,138,67,0.15)',
  strokeColor = 'var(--hm-gold-deep, #B58A43)',
  className,
  style,
}) => {
  // Paisley geometry constants — all derived from viewBox 100×150
  const cx = 50;            // horizontal center
  const tipY = 10;          // pointed tip
  const baseY = 140;        // rounded base center
  const maxW = 38;          // half-width at widest point
  const wideY = 90;         // y of maximum width
  const curlR = 14;         // curl arc radius

  // Outer contour: tip → right bulge → base → left bulge → tip
  // Two cubics per side, meeting at the base with tangent continuity.
  const outerD = [
    `M ${cx} ${tipY}`,
    // Right side: tip down to widest point
    `C ${cx + 18} ${tipY + 20}, ${cx + maxW} ${wideY - 30}, ${cx + maxW} ${wideY}`,
    // Right side: widest point down and around to base
    `C ${cx + maxW} ${wideY + 28}, ${cx + 16} ${baseY - 4}, ${cx} ${baseY}`,
    // Left side: base back up to widest
    `C ${cx - 16} ${baseY - 4}, ${cx - maxW} ${wideY + 28}, ${cx - maxW} ${wideY}`,
    // Left side: widest back up to tip
    `C ${cx - maxW} ${wideY - 30}, ${cx - 18} ${tipY + 20}, ${cx} ${tipY}`,
    'Z',
  ].join(' ');

  // Inner contour: inset by ~18%
  const inR = 0.72; // scale factor
  const inMaxW = maxW * inR;
  const inWideY = tipY + (wideY - tipY) * 1.05;
  const inBaseY = baseY - 14;
  const inTipY = tipY + 14;
  const innerD = [
    `M ${cx} ${inTipY}`,
    `C ${cx + 14} ${inTipY + 16}, ${cx + inMaxW} ${inWideY - 24}, ${cx + inMaxW} ${inWideY}`,
    `C ${cx + inMaxW} ${inWideY + 20}, ${cx + 12} ${inBaseY - 3}, ${cx} ${inBaseY}`,
    `C ${cx - 12} ${inBaseY - 3}, ${cx - inMaxW} ${inWideY + 20}, ${cx - inMaxW} ${inWideY}`,
    `C ${cx - inMaxW} ${inWideY - 24}, ${cx - 14} ${inTipY + 16}, ${cx} ${inTipY}`,
    'Z',
  ].join(' ');

  // Top curl — a quarter arc from tip sweeping right
  const curlD = `M ${cx} ${tipY} C ${cx} ${tipY - 6}, ${cx + curlR - 2} ${tipY - 8}, ${cx + curlR} ${tipY - 2} C ${cx + curlR + 4} ${tipY + 6}, ${cx + 8} ${tipY + 12}, ${cx + 4} ${tipY + 8}`;

  // Spine dots: 5 evenly from inTipY+10 to inBaseY-10
  const spineCount = 5;
  const spineTop = inTipY + 12;
  const spineBot = inBaseY - 12;
  const spineGap = (spineBot - spineTop) / (spineCount - 1);
  const spineDots = Array.from({ length: spineCount }, (_, i) => ({
    y: spineTop + i * spineGap,
    r: 2.2 - i * 0.2,
  }));

  // Leaf veins: 3 pairs (left+right) at 3 heights
  const veinYs = [inTipY + 30, inTipY + 55, inTipY + 78];
  const veinReach = [22, 28, 24]; // how far the vein extends from center

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 150"
      width={size * 0.667}
      height={size}
      aria-hidden="true"
      className={className}
      style={style}
    >
      {/* Outer filled body */}
      <path d={outerD} fill={fillColor} stroke={strokeColor} strokeWidth="1.4" strokeLinejoin="round" />
      {/* Inner ring */}
      <path d={innerD} fill="none" stroke={strokeColor} strokeWidth="0.8" opacity="0.5" />
      {/* Top curl */}
      <path d={curlD} fill="none" stroke={strokeColor} strokeWidth="1.3" strokeLinecap="round" />
      {/* Spine dots */}
      {spineDots.map((dot, i) => (
        <circle key={i} cx={cx} cy={dot.y} r={dot.r} fill={strokeColor} opacity={0.5 - i * 0.05} />
      ))}
      {/* Leaf veins — left */}
      {veinYs.map((vy, i) => (
        <path
          key={`l${i}`}
          d={`M ${cx} ${vy} Q ${cx - veinReach[i] * 0.6} ${vy - 6}, ${cx - veinReach[i]} ${vy + 4}`}
          fill="none" stroke={strokeColor} strokeWidth="0.7" opacity="0.35" strokeLinecap="round"
        />
      ))}
      {/* Leaf veins — right */}
      {veinYs.map((vy, i) => (
        <path
          key={`r${i}`}
          d={`M ${cx} ${vy} Q ${cx + veinReach[i] * 0.6} ${vy - 6}, ${cx + veinReach[i]} ${vy + 4}`}
          fill="none" stroke={strokeColor} strokeWidth="0.7" opacity="0.35" strokeLinecap="round"
        />
      ))}
    </svg>
  );
};

export default HmPaisley;
