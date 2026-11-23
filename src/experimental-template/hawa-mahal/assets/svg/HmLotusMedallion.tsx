import React from 'react';

interface HmLotusMedallionProps {
  /** Diameter of the medallion in px */
  size?: number;
  /** Stroke color — defaults to CSS var(--hm-gold) */
  strokeColor?: string;
  /** Stroke width */
  strokeWidth?: number;
  /** Additional CSS class */
  className?: string;
  /** Additional inline styles */
  style?: React.CSSProperties;
}

/**
 * HmLotusMedallion — Stylized lotus flower viewed from above.
 *
 * Concentric rings of pointed petals radiating from a center dot,
 * in the traditional Indian padma (lotus) medallion style.
 *
 * Three petal rings:
 *   - Inner ring: 8 petals
 *   - Middle ring: 12 petals
 *   - Outer ring: 16 petals
 *
 * Size variants used:
 *   - 24px: Family section divider, Celebrations transition, RSVP confirmation
 *   - 28px: Welcome top, Countdown top
 *   - 32px: Welcome scroll indicator, Closing top (largest)
 */
const HmLotusMedallion: React.FC<HmLotusMedallionProps> = ({
  size = 28,
  strokeColor = 'var(--hm-gold, #D4A055)',
  strokeWidth = 1,
  className,
  style,
}) => {
  // Work in a 100x100 viewBox for precision, scale via size prop
  const cx = 50;
  const cy = 50;

  /**
   * Build a ring of lotus petals.
   * Each petal is an elongated teardrop shape pointing outward from center.
   */
  const buildPetalRing = (
    petalCount: number,
    innerRadius: number,
    outerRadius: number,
    petalWidth: number,
    rotationOffset: number = 0,
  ): string => {
    const paths: string[] = [];

    for (let i = 0; i < petalCount; i++) {
      const angle = (i / petalCount) * Math.PI * 2 + rotationOffset;

      // Petal tip (outer point)
      const tipX = cx + Math.cos(angle) * outerRadius;
      const tipY = cy + Math.sin(angle) * outerRadius;

      // Petal base (inner point)
      const baseX = cx + Math.cos(angle) * innerRadius;
      const baseY = cy + Math.sin(angle) * innerRadius;

      // Control points for the petal sides (perpendicular to the radial line)
      const perpAngle = angle + Math.PI / 2;
      const halfWidth = petalWidth / 2;

      // Left side of petal
      const leftMidX = cx + Math.cos(angle) * (innerRadius + (outerRadius - innerRadius) * 0.55) + Math.cos(perpAngle) * halfWidth;
      const leftMidY = cy + Math.sin(angle) * (innerRadius + (outerRadius - innerRadius) * 0.55) + Math.sin(perpAngle) * halfWidth;

      // Right side of petal
      const rightMidX = cx + Math.cos(angle) * (innerRadius + (outerRadius - innerRadius) * 0.55) - Math.cos(perpAngle) * halfWidth;
      const rightMidY = cy + Math.sin(angle) * (innerRadius + (outerRadius - innerRadius) * 0.55) - Math.sin(perpAngle) * halfWidth;

      // Control points near the tip to create the pointed end
      const tipCtrlLeft = {
        x: cx + Math.cos(angle) * (outerRadius * 0.92) + Math.cos(perpAngle) * halfWidth * 0.3,
        y: cy + Math.sin(angle) * (outerRadius * 0.92) + Math.sin(perpAngle) * halfWidth * 0.3,
      };
      const tipCtrlRight = {
        x: cx + Math.cos(angle) * (outerRadius * 0.92) - Math.cos(perpAngle) * halfWidth * 0.3,
        y: cy + Math.sin(angle) * (outerRadius * 0.92) - Math.sin(perpAngle) * halfWidth * 0.3,
      };

      // Control points near the base
      const baseCtrlLeft = {
        x: baseX + Math.cos(perpAngle) * halfWidth * 0.4,
        y: baseY + Math.sin(perpAngle) * halfWidth * 0.4,
      };
      const baseCtrlRight = {
        x: baseX - Math.cos(perpAngle) * halfWidth * 0.4,
        y: baseY - Math.sin(perpAngle) * halfWidth * 0.4,
      };

      paths.push(
        `M ${baseX.toFixed(2)} ${baseY.toFixed(2)} ` +
        `C ${baseCtrlLeft.x.toFixed(2)} ${baseCtrlLeft.y.toFixed(2)}, ` +
        `${leftMidX.toFixed(2)} ${leftMidY.toFixed(2)}, ` +
        `${tipCtrlLeft.x.toFixed(2)} ${tipCtrlLeft.y.toFixed(2)} ` +
        `Q ${tipX.toFixed(2)} ${tipY.toFixed(2)}, ` +
        `${tipCtrlRight.x.toFixed(2)} ${tipCtrlRight.y.toFixed(2)} ` +
        `C ${rightMidX.toFixed(2)} ${rightMidY.toFixed(2)}, ` +
        `${baseCtrlRight.x.toFixed(2)} ${baseCtrlRight.y.toFixed(2)}, ` +
        `${baseX.toFixed(2)} ${baseY.toFixed(2)} Z`
      );
    }

    return paths.join(' ');
  };

  // Three petal rings, each offset by half a petal to interleave
  const innerPetals = buildPetalRing(8, 6, 22, 9, 0);
  const middlePetals = buildPetalRing(12, 14, 34, 9, Math.PI / 12);
  const outerPetals = buildPetalRing(16, 26, 46, 8, 0);

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      width={size}
      height={size}
      fill="none"
      aria-hidden="true"
      className={className}
      style={style}
    >
      {/* Outer petal ring (16 petals) */}
      <path
        d={outerPetals}
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
        fill="none"
      />
      {/* Middle petal ring (12 petals) */}
      <path
        d={middlePetals}
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
        fill="none"
      />
      {/* Inner petal ring (8 petals) */}
      <path
        d={innerPetals}
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
        fill="none"
      />
      {/* Center dot */}
      <circle
        cx={cx}
        cy={cy}
        r={3.5}
        fill={strokeColor}
      />
    </svg>
  );
};

export default HmLotusMedallion;
