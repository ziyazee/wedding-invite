import React from 'react';

interface HmScallopedCorniceProps {
  /** Width of the cornice strip — typically full container width */
  width?: number;
  /** Height of the cornice strip */
  height?: number;
  /** Width of each individual scallop arc */
  scallopWidth?: number;
  /** Stroke color — defaults to CSS var(--hm-gold) */
  strokeColor?: string;
  /** Stroke width */
  strokeWidth?: number;
  /** Stroke opacity (0-1) */
  strokeOpacity?: number;
  /** Whether to show finial dots at the peak of each scallop */
  showFinials?: boolean;
  /** Finial dot radius */
  finialRadius?: number;
  /** Additional CSS class */
  className?: string;
  /** Additional inline styles */
  style?: React.CSSProperties;
}

/**
 * HmScallopedCornice — Repeating semicircular scallop border strip.
 *
 * The decorative cornice ledge that separates each tier of the Hawa Mahal.
 * A 1px straight line at the top with semicircular arcs hanging below,
 * optionally with tiny finial dots at each scallop's peak.
 *
 * Full-width, 18px tall. Scallops ~24px wide each, evenly distributed.
 * Partial scallops are clipped at the edges.
 *
 * Color variants:
 *   - Gold full opacity: dark section boundaries (Welcome, Countdown, RSVP, Closing)
 *   - Sandstone 50% opacity: Family section bottom
 */
const HmScallopedCornice: React.FC<HmScallopedCorniceProps> = ({
  width = 402,
  height = 18,
  scallopWidth = 24,
  strokeColor = 'var(--hm-gold, #D4A055)',
  strokeWidth = 1,
  strokeOpacity = 1,
  showFinials = true,
  finialRadius = 1.5,
  className,
  style,
}) => {
  // Calculate number of scallops needed to fill the width (with partial scallops at edges)
  const scallopCount = Math.ceil(width / scallopWidth);
  // Adjust actual scallop width to distribute evenly
  const actualScallopWidth = width / scallopCount;

  // The top line sits at y=1 (accounting for stroke)
  const topLineY = strokeWidth;
  // Scallops hang below the top line
  const scallopArcHeight = height - strokeWidth * 2 - (showFinials ? finialRadius * 2 : 0);

  // Build the scalloped path
  const buildScallopPath = (): string => {
    const parts: string[] = [];

    // Start at the left edge on the top line
    parts.push(`M 0 ${topLineY.toFixed(2)}`);

    // Draw the straight top line
    parts.push(`L ${width.toFixed(2)} ${topLineY.toFixed(2)}`);

    // Now draw the scallop arcs from right to left (so the path closes properly)
    // Actually, let's draw arcs as a separate sub-path going left to right
    // Start a new sub-path for the scallops
    parts.push(`M 0 ${topLineY.toFixed(2)}`);

    for (let i = 0; i < scallopCount; i++) {
      const startX = i * actualScallopWidth;
      const endX = (i + 1) * actualScallopWidth;

      // Semi-circular arc from startX to endX, dipping down
      // Using cubic bezier to approximate a semicircle
      // For a semicircle, the control point distance from endpoints is ~0.5523 * radius
      const radius = actualScallopWidth / 2;
      const cpOffset = radius * 0.5523;

      parts.push(
        `C ${(startX + cpOffset).toFixed(2)} ${(topLineY + scallopArcHeight).toFixed(2)}, ` +
        `${(endX - cpOffset).toFixed(2)} ${(topLineY + scallopArcHeight).toFixed(2)}, ` +
        `${endX.toFixed(2)} ${topLineY.toFixed(2)}`
      );
    }

    return parts.join(' ');
  };

  // Build finial dots at the nadir of each scallop
  const buildFinials = (): Array<{ cx: number; cy: number }> => {
    if (!showFinials) return [];

    const finials: Array<{ cx: number; cy: number }> = [];
    for (let i = 0; i < scallopCount; i++) {
      const cx = (i + 0.5) * actualScallopWidth;
      const cy = topLineY + scallopArcHeight + finialRadius + 1;
      finials.push({ cx, cy });
    }
    return finials;
  };

  const scallopPath = buildScallopPath();
  const finials = buildFinials();

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={`0 0 ${width} ${height}`}
      width={width}
      height={height}
      fill="none"
      aria-hidden="true"
      className={className}
      style={{ display: 'block', ...style }}
      preserveAspectRatio="none"
    >
      {/* Scalloped arcs with top line */}
      <path
        d={scallopPath}
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        strokeOpacity={strokeOpacity}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      {/* Finial dots at each scallop nadir */}
      {finials.map((f, i) => (
        <circle
          key={i}
          cx={f.cx}
          cy={f.cy}
          r={finialRadius}
          fill={strokeColor}
          fillOpacity={strokeOpacity}
        />
      ))}
    </svg>
  );
};

export default HmScallopedCornice;
