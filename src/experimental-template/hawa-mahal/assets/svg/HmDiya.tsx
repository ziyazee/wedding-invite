import React from 'react';

interface HmDiyaProps {
  size?: number;
  fillColor?: string;
  strokeColor?: string;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Rajasthani diya (oil lamp) — geometric construction.
 *
 * Flame: two nested teardrop Béziers (outer glow + inner bright).
 * Bowl: symmetric cubic with belly, narrowing at rim.
 * Pedestal: trapezoidal taper with elliptical foot.
 * Decorative band: arc across bowl mid-height.
 * Three accent dots on bowl face.
 *
 * viewBox 0 0 80 100, portrait.
 */
const HmDiya: React.FC<HmDiyaProps> = ({
  size = 50,
  fillColor = 'rgba(181,138,67,0.15)',
  strokeColor = 'var(--hm-gold-deep, #B58A43)',
  className,
  style,
}) => {
  // Flame geometry — teardrop from tip down to base arc
  const flameTipY = 8;
  const flameBaseY = 42;
  const flameCx = 40;
  const flameW = 13; // half-width at widest

  const flameOuter = [
    `M ${flameCx} ${flameTipY}`,
    `C ${flameCx + 5} ${flameTipY + 12}, ${flameCx + flameW} ${flameBaseY - 14}, ${flameCx + flameW} ${flameBaseY - 6}`,
    `C ${flameCx + flameW} ${flameBaseY}, ${flameCx + 4} ${flameBaseY + 2}, ${flameCx} ${flameBaseY}`,
    `C ${flameCx - 4} ${flameBaseY + 2}, ${flameCx - flameW} ${flameBaseY}, ${flameCx - flameW} ${flameBaseY - 6}`,
    `C ${flameCx - flameW} ${flameBaseY - 14}, ${flameCx - 5} ${flameTipY + 12}, ${flameCx} ${flameTipY}`,
    'Z',
  ].join(' ');

  const innerW = flameW * 0.5;
  const innerTipY = flameTipY + 10;
  const innerBaseY = flameBaseY - 5;
  const flameInner = [
    `M ${flameCx} ${innerTipY}`,
    `C ${flameCx + 3} ${innerTipY + 8}, ${flameCx + innerW} ${innerBaseY - 8}, ${flameCx + innerW} ${innerBaseY - 2}`,
    `C ${flameCx + innerW} ${innerBaseY + 1}, ${flameCx + 2} ${innerBaseY + 2}, ${flameCx} ${innerBaseY}`,
    `C ${flameCx - 2} ${innerBaseY + 2}, ${flameCx - innerW} ${innerBaseY + 1}, ${flameCx - innerW} ${innerBaseY - 2}`,
    `C ${flameCx - innerW} ${innerBaseY - 8}, ${flameCx - 3} ${innerTipY + 8}, ${flameCx} ${innerTipY}`,
    'Z',
  ].join(' ');

  // Bowl — wide belly, narrower rim at top connecting to flame
  const bowlTop = 42;
  const bowlBot = 70;
  const rimHW = 10; // half-width at rim (top)
  const bellyHW = 22; // half-width at belly
  const bellyY = 58; // y of maximum width

  const bowlD = [
    `M ${flameCx - rimHW} ${bowlTop}`,
    `C ${flameCx - rimHW - 4} ${bowlTop + 6}, ${flameCx - bellyHW} ${bellyY - 8}, ${flameCx - bellyHW} ${bellyY}`,
    `C ${flameCx - bellyHW} ${bellyY + 6}, ${flameCx - 14} ${bowlBot}, ${flameCx} ${bowlBot}`,
    `C ${flameCx + 14} ${bowlBot}, ${flameCx + bellyHW} ${bellyY + 6}, ${flameCx + bellyHW} ${bellyY}`,
    `C ${flameCx + bellyHW} ${bellyY - 8}, ${flameCx + rimHW + 4} ${bowlTop + 6}, ${flameCx + rimHW} ${bowlTop}`,
    'Z',
  ].join(' ');

  // Decorative band arc across bowl
  const bandY = 54;
  const bandD = `M ${flameCx - 18} ${bandY} Q ${flameCx} ${bandY - 4}, ${flameCx + 18} ${bandY}`;

  // Pedestal — trapezoid from bowl bottom to foot
  const footY = 88;
  const footHW = 15;
  const stemTopHW = 10;

  const pedastalD = [
    `M ${flameCx - stemTopHW} ${bowlBot}`,
    `L ${flameCx - footHW} ${footY}`,
    `Q ${flameCx} ${footY + 4}, ${flameCx + footHW} ${footY}`,
    `L ${flameCx + stemTopHW} ${bowlBot}`,
  ].join(' ');

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 80 100"
      width={size * 0.8}
      height={size}
      aria-hidden="true"
      className={className}
      style={style}
    >
      {/* Flame outer glow */}
      <path d={flameOuter} fill={fillColor} stroke={strokeColor} strokeWidth="1" opacity="0.6" />
      {/* Flame inner bright */}
      <path d={flameInner} fill={strokeColor} opacity="0.22" />
      {/* Bowl */}
      <path d={bowlD} fill={fillColor} stroke={strokeColor} strokeWidth="1.2" />
      {/* Decorative band */}
      <path d={bandD} fill="none" stroke={strokeColor} strokeWidth="0.8" opacity="0.45" />
      {/* Pedestal */}
      <path d={pedastalD} fill={fillColor} stroke={strokeColor} strokeWidth="1" />
      {/* Foot ellipse */}
      <ellipse cx={flameCx} cy={footY} rx={footHW} ry={3} fill={strokeColor} opacity="0.18" />
      {/* Bowl accent dots */}
      <circle cx={flameCx - 8} cy={bellyY} r="1.5" fill={strokeColor} opacity="0.3" />
      <circle cx={flameCx} cy={bellyY - 2} r="1.5" fill={strokeColor} opacity="0.3" />
      <circle cx={flameCx + 8} cy={bellyY} r="1.5" fill={strokeColor} opacity="0.3" />
    </svg>
  );
};

export default HmDiya;
