import React from 'react';

interface HmClockIconProps {
  /** Icon size (square) */
  size?: number;
  /** Stroke color — defaults to CSS var(--hm-gold-deep) */
  strokeColor?: string;
  /** Stroke width */
  strokeWidth?: number;
  /** Additional CSS class */
  className?: string;
  /** Additional inline styles */
  style?: React.CSSProperties;
}

/**
 * HmClockIcon — Simple clock face with two hands.
 *
 * A circle with an hour hand pointing to ~10 o'clock and a minute
 * hand pointing to 12 o'clock. Stroke-only, no fill. 12x12px default.
 *
 * Used in: Celebrations section event cards, inline with time text.
 */
const HmClockIcon: React.FC<HmClockIconProps> = ({
  size = 12,
  strokeColor = 'var(--hm-gold-deep, #B8892E)',
  strokeWidth = 1.5,
  className,
  style,
}) => {
  const cx = 8;
  const cy = 8;
  const radius = 6.5;

  // Hour hand: points to ~10 o'clock (300 degrees, or -60 from 12)
  // 10 o'clock = 300 degrees clockwise from 12 = -60 degrees
  const hourAngle = (-60 * Math.PI) / 180;
  const hourLength = 3.5;
  const hourX = cx + Math.sin(hourAngle) * hourLength;
  const hourY = cy - Math.cos(hourAngle) * hourLength;

  // Minute hand: points to 12 o'clock (straight up)
  const minuteLength = 4.5;
  const minuteX = cx;
  const minuteY = cy - minuteLength;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 16 16"
      width={size}
      height={size}
      fill="none"
      aria-hidden="true"
      className={className}
      style={style}
    >
      {/* Clock face circle */}
      <circle
        cx={cx}
        cy={cy}
        r={radius}
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
      {/* Hour hand */}
      <line
        x1={cx}
        y1={cy}
        x2={hourX.toFixed(2)}
        y2={hourY.toFixed(2)}
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
      {/* Minute hand */}
      <line
        x1={cx}
        y1={cy}
        x2={minuteX}
        y2={minuteY.toFixed(2)}
        stroke={strokeColor}
        strokeWidth={strokeWidth * 0.85}
        strokeLinecap="round"
      />
      {/* Center dot */}
      <circle
        cx={cx}
        cy={cy}
        r={1}
        fill={strokeColor}
      />
    </svg>
  );
};

export default HmClockIcon;
