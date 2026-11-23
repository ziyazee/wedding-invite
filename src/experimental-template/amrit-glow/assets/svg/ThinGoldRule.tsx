import React from 'react';

interface ThinGoldRuleProps {
  className?: string;
  width?: number;
}

/**
 * Thin horizontal gold gradient rule — minimal separator.
 * Used as a minor divider between closely related content elements,
 * between events, and as quiet boundaries.
 *
 * Features a subtle gradient that brightens at center and fades at edges,
 * with very fine terminal points that taper to nothing.
 */
export const ThinGoldRule: React.FC<ThinGoldRuleProps> = ({
  className,
  width = 120,
}) => {
  const h = 6;
  const scale = width / 120;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 120 6"
      width={width}
      height={h * scale}
      className={className}
      aria-hidden="true"
      style={{ display: 'block' }}
    >
      <defs>
        {/* Gradient that brightens at center and fades at edges */}
        <linearGradient id="ag-thin-rule-grad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="var(--ag-gold, #D4A843)" stopOpacity="0" />
          <stop offset="15%" stopColor="var(--ag-gold, #D4A843)" stopOpacity="0.4" />
          <stop offset="50%" stopColor="var(--ag-gold-bright, #E8C65A)" stopOpacity="0.65" />
          <stop offset="85%" stopColor="var(--ag-gold, #D4A843)" stopOpacity="0.4" />
          <stop offset="100%" stopColor="var(--ag-gold, #D4A843)" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Primary line */}
      <line
        x1="4"
        y1="3"
        x2="116"
        y2="3"
        stroke="url(#ag-thin-rule-grad)"
        strokeWidth="1"
        strokeLinecap="round"
      />

      {/* Subtle secondary highlight line — offset slightly above */}
      <line
        x1="20"
        y1="2.4"
        x2="100"
        y2="2.4"
        stroke="var(--ag-gold-bright, #E8C65A)"
        strokeWidth="0.2"
        strokeLinecap="round"
        opacity="0.25"
      />
    </svg>
  );
};
