import React from 'react';

interface DiyaRuleCompositionProps {
  className?: string;
  width?: number;
}

/**
 * Diya-flanking-rule composition — two stylized diya (oil lamp) silhouettes
 * flanking a thin gold rule with diamond center. Used in the Countdown section,
 * RSVP section footer, and Closing section as a decorative closing element.
 *
 * The diyas are SVG-only stylized forms (not photo-realistic) — a small flame
 * atop a cupped vessel shape, rendered in gold strokes. This avoids needing
 * raster PNG diya assets for the divider context.
 *
 * Default width: 200px.
 */
export const DiyaRuleComposition: React.FC<DiyaRuleCompositionProps> = ({
  className,
  width = 200,
}) => {
  const scale = width / 200;
  const h = 32 * scale;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 200 32"
      width={width}
      height={h}
      className={className}
      aria-hidden="true"
      style={{ display: 'block' }}
    >
      {/* ── Left diya ── */}
      <g transform="translate(30, 8)" opacity="0.55">
        {/* Flame */}
        <path
          d="M0,8 Q-3,2 0,-2 Q3,2 0,8"
          fill="var(--ag-lamp, #FFE4A0)"
          fillOpacity="0.6"
          stroke="var(--ag-gold, #D4A843)"
          strokeWidth="0.5"
          strokeLinecap="round"
        />
        {/* Inner flame core */}
        <path
          d="M0,6 Q-1,3 0,1 Q1,3 0,6"
          fill="var(--ag-gold-bright, #E8C65A)"
          fillOpacity="0.4"
          stroke="none"
        />
        {/* Flame glow halo */}
        <circle
          cx="0"
          cy="4"
          r="5"
          fill="var(--ag-lamp, #FFE4A0)"
          opacity="0.08"
        />
        {/* Vessel body — cupped oil lamp */}
        <path
          d="M-6,10 Q-7,14 -5,16 Q-2,18 0,18 Q2,18 5,16 Q7,14 6,10"
          fill="none"
          stroke="var(--ag-gold, #D4A843)"
          strokeWidth="0.7"
          strokeLinecap="round"
        />
        {/* Vessel rim */}
        <line
          x1="-6"
          y1="10"
          x2="6"
          y2="10"
          stroke="var(--ag-gold, #D4A843)"
          strokeWidth="0.5"
          opacity="0.6"
        />
        {/* Small base */}
        <ellipse
          cx="0"
          cy="18"
          rx="3"
          ry="1"
          fill="none"
          stroke="var(--ag-gold, #D4A843)"
          strokeWidth="0.4"
          opacity="0.4"
        />
      </g>

      {/* ── Center rule with diamond ── */}
      <g opacity="0.5">
        {/* Left line segment */}
        <line
          x1="52"
          y1="18"
          x2="94"
          y2="18"
          stroke="var(--ag-gold, #D4A843)"
          strokeWidth="0.7"
          strokeLinecap="round"
        />
        {/* Right line segment */}
        <line
          x1="106"
          y1="18"
          x2="148"
          y2="18"
          stroke="var(--ag-gold, #D4A843)"
          strokeWidth="0.7"
          strokeLinecap="round"
        />
        {/* Center diamond */}
        <rect
          x="97"
          y="15"
          width="6"
          height="6"
          rx="0.3"
          transform="rotate(45, 100, 18)"
          fill="var(--ag-gold, #D4A843)"
          opacity="0.5"
        />
        {/* Diamond highlight */}
        <circle
          cx="100"
          cy="18"
          r="0.8"
          fill="var(--ag-gold-bright, #E8C65A)"
          opacity="0.4"
        />
      </g>

      {/* ── Right diya (mirrored) ── */}
      <g transform="translate(170, 8)" opacity="0.55">
        {/* Flame */}
        <path
          d="M0,8 Q-3,2 0,-2 Q3,2 0,8"
          fill="var(--ag-lamp, #FFE4A0)"
          fillOpacity="0.6"
          stroke="var(--ag-gold, #D4A843)"
          strokeWidth="0.5"
          strokeLinecap="round"
        />
        {/* Inner flame core */}
        <path
          d="M0,6 Q-1,3 0,1 Q1,3 0,6"
          fill="var(--ag-gold-bright, #E8C65A)"
          fillOpacity="0.4"
          stroke="none"
        />
        {/* Flame glow halo */}
        <circle
          cx="0"
          cy="4"
          r="5"
          fill="var(--ag-lamp, #FFE4A0)"
          opacity="0.08"
        />
        {/* Vessel body */}
        <path
          d="M-6,10 Q-7,14 -5,16 Q-2,18 0,18 Q2,18 5,16 Q7,14 6,10"
          fill="none"
          stroke="var(--ag-gold, #D4A843)"
          strokeWidth="0.7"
          strokeLinecap="round"
        />
        {/* Vessel rim */}
        <line
          x1="-6"
          y1="10"
          x2="6"
          y2="10"
          stroke="var(--ag-gold, #D4A843)"
          strokeWidth="0.5"
          opacity="0.6"
        />
        {/* Small base */}
        <ellipse
          cx="0"
          cy="18"
          rx="3"
          ry="1"
          fill="none"
          stroke="var(--ag-gold, #D4A843)"
          strokeWidth="0.4"
          opacity="0.4"
        />
      </g>
    </svg>
  );
};
