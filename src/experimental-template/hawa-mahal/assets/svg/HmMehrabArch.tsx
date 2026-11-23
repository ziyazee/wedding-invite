import React from 'react';

interface HmMehrabArchProps {
  /** Width of the arch SVG */
  width?: number;
  /** Height of the arch SVG */
  height?: number;
  /** Number of cusps on each side of the arch (total cusps = cuspCount * 2 + 1 apex) */
  cuspCount?: number;
  /** Stroke color — defaults to CSS var(--hm-gold) */
  strokeColor?: string;
  /** Stroke width in px */
  strokeWidth?: number;
  /** Stroke opacity (0-1) */
  strokeOpacity?: number;
  /** Optional fill color — defaults to none */
  fillColor?: string;
  /** Fill opacity (0-1) */
  fillOpacity?: number;
  /** Additional CSS class */
  className?: string;
  /** Additional inline styles */
  style?: React.CSSProperties;
}

/**
 * HmMehrabArch — Multi-cusped pointed arch frame.
 *
 * The characteristic polylobed arch of Rajasthani palace architecture.
 * Each side has scalloped cusps curving inward, meeting at a pointed apex.
 *
 * Variants used across sections:
 *   - Welcome:      320 x 180, 5 cusps (large hero frame)
 *   - RSVP:         200 x 48,  3 cusps (form header)
 *   - Celebrations: 120 x 36,  3 cusps (card header)
 *   - Closing:      300 x 160, 5 cusps (soft farewell frame)
 */
const HmMehrabArch: React.FC<HmMehrabArchProps> = ({
  width = 320,
  height = 180,
  cuspCount = 5,
  strokeColor = 'var(--hm-gold, #D4A055)',
  strokeWidth = 1.5,
  strokeOpacity = 1,
  fillColor = 'none',
  fillOpacity = 0,
  className,
  style,
}) => {
  // Build the arch path.
  // The arch sits within a viewBox of [0, 0, width, height].
  // The arch starts at bottom-left, curves up the left side with cusps,
  // reaches the pointed apex at top-center, then mirrors down the right side.

  const halfW = width / 2;
  // Reserve a bit of bottom for the baseline
  const baseY = height - strokeWidth;
  // The apex sits near the top
  const apexY = strokeWidth + 2;

  // Each side gets `cuspCount` scalloped cusps
  // The cusps are distributed along the arch from base to apex
  const totalCusps = cuspCount;

  // Build the complete arch path with proper cusps
  const buildArchPath = (): string => {
    const parts: string[] = [];

    // We define cusp control points explicitly for authentic polylobed arch shape
    const edgeInset = width * 0.06; // How far from the edge the arch starts
    const baseLeft = edgeInset;
    const baseRight = width - edgeInset;
    const archSpan = baseRight - baseLeft;

    // The arch profile: scalloped cusps along each side meeting at pointed apex
    // Each cusp is a concave lobe that dips inward toward the center

    // Cusp geometry: distribute cusps evenly from base to near-apex
    const cuspZoneHeight = (baseY - apexY) * 0.75; // Cusps occupy lower 75% of arch height
    const apexZoneHeight = (baseY - apexY) * 0.25; // Upper 25% is the pointed apex

    const leftCusps: Array<{ x: number; y: number }> = [];
    const rightCusps: Array<{ x: number; y: number }> = [];

    for (let i = 0; i <= totalCusps; i++) {
      const t = i / totalCusps;
      const y = baseY - t * cuspZoneHeight;

      // X narrows as we go up, creating the arch shape
      const narrowing = Math.pow(t, 0.6) * archSpan * 0.25;
      const leftX = baseLeft + narrowing;
      const rightX = baseRight - narrowing;

      leftCusps.push({ x: leftX, y });
      rightCusps.push({ x: rightX, y });
    }

    // Apex transition points
    const lastLeftCusp = leftCusps[leftCusps.length - 1];
    const lastRightCusp = rightCusps[rightCusps.length - 1];

    // Start from bottom-left
    parts.push(`M ${baseLeft.toFixed(2)} ${baseY.toFixed(2)}`);

    // Left side: draw scalloped cusps going upward
    for (let i = 0; i < totalCusps; i++) {
      const from = leftCusps[i];
      const to = leftCusps[i + 1];

      // Each cusp: the edge curves inward (toward center) then back to the spine
      const cuspDepth = archSpan * 0.045 * (1 + (i / totalCusps) * 0.3);
      const midY = (from.y + to.y) / 2;

      // Cusp peak point (the innermost point of the scallop)
      const peakX = (from.x + to.x) / 2 + cuspDepth;

      // Smooth cubic beziers for each half of the scallop
      parts.push(
        `C ${from.x.toFixed(2)} ${(from.y - (from.y - midY) * 0.4).toFixed(2)}, ` +
        `${peakX.toFixed(2)} ${(midY + (from.y - midY) * 0.15).toFixed(2)}, ` +
        `${peakX.toFixed(2)} ${midY.toFixed(2)}`
      );
      parts.push(
        `C ${peakX.toFixed(2)} ${(midY - (midY - to.y) * 0.15).toFixed(2)}, ` +
        `${to.x.toFixed(2)} ${(to.y + (midY - to.y) * 0.4).toFixed(2)}, ` +
        `${to.x.toFixed(2)} ${to.y.toFixed(2)}`
      );
    }

    // Pointed apex: smooth transition from left spine through apex to right spine
    // The apex is a pointed ogee shape
    const apexCpOffsetX = archSpan * 0.12;
    const apexCpOffsetY = apexZoneHeight * 0.6;

    parts.push(
      `C ${lastLeftCusp.x.toFixed(2)} ${(lastLeftCusp.y - apexCpOffsetY).toFixed(2)}, ` +
      `${(halfW - apexCpOffsetX).toFixed(2)} ${(apexY + apexCpOffsetY * 0.2).toFixed(2)}, ` +
      `${halfW.toFixed(2)} ${apexY.toFixed(2)}`
    );
    parts.push(
      `C ${(halfW + apexCpOffsetX).toFixed(2)} ${(apexY + apexCpOffsetY * 0.2).toFixed(2)}, ` +
      `${lastRightCusp.x.toFixed(2)} ${(lastRightCusp.y - apexCpOffsetY).toFixed(2)}, ` +
      `${lastRightCusp.x.toFixed(2)} ${lastRightCusp.y.toFixed(2)}`
    );

    // Right side: draw scalloped cusps going downward (reversed)
    for (let i = totalCusps - 1; i >= 0; i--) {
      const from = rightCusps[i + 1];
      const to = rightCusps[i];

      const cuspDepth = archSpan * 0.045 * (1 + (i / totalCusps) * 0.3);
      const midY = (from.y + to.y) / 2;

      // Cusp peak (inward toward center)
      const peakX = (from.x + to.x) / 2 - cuspDepth;

      parts.push(
        `C ${from.x.toFixed(2)} ${(from.y + (midY - from.y) * 0.4).toFixed(2)}, ` +
        `${peakX.toFixed(2)} ${(midY - (midY - from.y) * 0.15).toFixed(2)}, ` +
        `${peakX.toFixed(2)} ${midY.toFixed(2)}`
      );
      parts.push(
        `C ${peakX.toFixed(2)} ${(midY + (to.y - midY) * 0.15).toFixed(2)}, ` +
        `${to.x.toFixed(2)} ${(to.y - (to.y - midY) * 0.4).toFixed(2)}, ` +
        `${to.x.toFixed(2)} ${to.y.toFixed(2)}`
      );
    }

    return parts.join(' ');
  };

  const archPath = buildArchPath();

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={`0 0 ${width} ${height}`}
      width={width}
      height={height}
      fill="none"
      aria-hidden="true"
      className={className}
      style={style}
    >
      <path
        d={archPath}
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        strokeOpacity={strokeOpacity}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill={fillColor !== 'none' ? fillColor : 'none'}
        fillOpacity={fillColor !== 'none' ? fillOpacity : 0}
      />
    </svg>
  );
};

export default HmMehrabArch;
