import React from 'react';

interface ArchBorderSvgProps {
  className?: string;
  width?: number;
}

/**
 * Mughal arch border band — an ornamental architectural divider
 * placed at the bottom of the hero section. Features a central
 * cusped (pointed) arch flanked by repeating smaller arches,
 * with filigree connecting elements.
 *
 * This is the SVG equivalent of arch-border.png — used as the
 * grand architectural gateway between the immersive hero and
 * the informational sections below.
 *
 * Default width: 402px (full mobile viewport).
 * Intrinsic height: ~80px at full width.
 */
export const ArchBorderSvg: React.FC<ArchBorderSvgProps> = ({
  className,
  width = 402,
}) => {
  const scale = width / 402;
  const h = 80 * scale;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 402 80"
      width={width}
      height={h}
      className={className}
      aria-hidden="true"
      style={{ display: 'block' }}
    >
      <defs>
        <linearGradient id="ag-arch-grad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="var(--ag-accent, #8B6914)" />
          <stop offset="45%" stopColor="var(--ag-gold, #D4A843)" />
          <stop offset="55%" stopColor="var(--ag-gold-bright, #E8C65A)" />
          <stop offset="100%" stopColor="var(--ag-accent, #8B6914)" />
        </linearGradient>
      </defs>

      <g
        fill="none"
        stroke="var(--ag-gold, #D4A843)"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* ── Central grand arch ── */}
        <g opacity="0.7">
          {/* Outer arch */}
          <path
            d="M161,78 L161,35 Q161,15 201,4 Q241,15 241,35 L241,78"
            strokeWidth="1.2"
          />
          {/* Inner arch (concentric) */}
          <path
            d="M169,78 L169,38 Q169,22 201,12 Q233,22 233,38 L233,78"
            strokeWidth="0.6"
            opacity="0.5"
          />
          {/* Arch peak finial — lotus bud */}
          <path
            d="M198,5 L201,0 L204,5"
            strokeWidth="0.8"
          />
          <circle
            cx="201"
            cy="0"
            r="1.2"
            fill="var(--ag-gold-bright, #E8C65A)"
            stroke="none"
            opacity="0.5"
          />
          {/* Cusp details at arch shoulders */}
          <path
            d="M165,42 Q170,34 178,36"
            strokeWidth="0.5"
            opacity="0.4"
          />
          <path
            d="M237,42 Q232,34 224,36"
            strokeWidth="0.5"
            opacity="0.4"
          />
          {/* Internal medallion */}
          <circle
            cx="201"
            cy="36"
            r="6"
            strokeWidth="0.5"
            opacity="0.35"
          />
          <circle
            cx="201"
            cy="36"
            r="3"
            strokeWidth="0.3"
            opacity="0.2"
          />
          <circle
            cx="201"
            cy="36"
            r="1"
            fill="var(--ag-gold, #D4A843)"
            stroke="none"
            opacity="0.3"
          />
        </g>

        {/* ── Left side smaller arches (3 repeating) ── */}
        {[0, 1, 2].map((i) => {
          const cx = 40 + i * 42;
          return (
            <g key={`left-arch-${i}`} opacity={0.45 - i * 0.05}>
              {/* Small arch */}
              <path
                d={`M${cx - 16},78 L${cx - 16},55 Q${cx - 16},42 ${cx},36 Q${cx + 16},42 ${cx + 16},55 L${cx + 16},78`}
                strokeWidth="0.7"
              />
              {/* Small arch inner */}
              <path
                d={`M${cx - 10},78 L${cx - 10},57 Q${cx - 10},47 ${cx},42 Q${cx + 10},47 ${cx + 10},57 L${cx + 10},78`}
                strokeWidth="0.35"
                opacity="0.4"
              />
              {/* Tiny finial */}
              <circle
                cx={cx}
                cy={35}
                r="0.8"
                fill="var(--ag-gold, #D4A843)"
                stroke="none"
                opacity="0.3"
              />
              {/* Pilaster lines connecting to base */}
              <line
                x1={cx - 16}
                y1={55}
                x2={cx - 16}
                y2={78}
                strokeWidth="0.3"
                opacity="0.2"
              />
              <line
                x1={cx + 16}
                y1={55}
                x2={cx + 16}
                y2={78}
                strokeWidth="0.3"
                opacity="0.2"
              />
            </g>
          );
        })}

        {/* ── Right side smaller arches (3 repeating, mirrored) ── */}
        {[0, 1, 2].map((i) => {
          const cx = 362 - i * 42;
          return (
            <g key={`right-arch-${i}`} opacity={0.45 - i * 0.05}>
              <path
                d={`M${cx - 16},78 L${cx - 16},55 Q${cx - 16},42 ${cx},36 Q${cx + 16},42 ${cx + 16},55 L${cx + 16},78`}
                strokeWidth="0.7"
              />
              <path
                d={`M${cx - 10},78 L${cx - 10},57 Q${cx - 10},47 ${cx},42 Q${cx + 10},47 ${cx + 10},57 L${cx + 10},78`}
                strokeWidth="0.35"
                opacity="0.4"
              />
              <circle
                cx={cx}
                cy={35}
                r="0.8"
                fill="var(--ag-gold, #D4A843)"
                stroke="none"
                opacity="0.3"
              />
              <line
                x1={cx - 16}
                y1={55}
                x2={cx - 16}
                y2={78}
                strokeWidth="0.3"
                opacity="0.2"
              />
              <line
                x1={cx + 16}
                y1={55}
                x2={cx + 16}
                y2={78}
                strokeWidth="0.3"
                opacity="0.2"
              />
            </g>
          );
        })}

        {/* ── Connecting horizontal bands ── */}
        {/* Upper band */}
        <line
          x1="0"
          y1="28"
          x2="161"
          y2="28"
          strokeWidth="0.5"
          opacity="0.25"
        />
        <line
          x1="241"
          y1="28"
          x2="402"
          y2="28"
          strokeWidth="0.5"
          opacity="0.25"
        />

        {/* Base band — the bottom edge of the arch border */}
        <line
          x1="0"
          y1="78"
          x2="402"
          y2="78"
          stroke="url(#ag-arch-grad)"
          strokeWidth="1.5"
          opacity="0.6"
        />
        {/* Secondary base band */}
        <line
          x1="0"
          y1="76"
          x2="402"
          y2="76"
          strokeWidth="0.4"
          opacity="0.2"
        />

        {/* ── Connecting filigree between side arches ── */}
        {/* Small diamond accents between arch bases */}
        {[61, 103, 145, 257, 299, 341].map((x) => (
          <rect
            key={`diamond-${x}`}
            x={x - 2}
            y={76}
            width="4"
            height="4"
            rx="0.3"
            transform={`rotate(45, ${x}, 78)`}
            fill="var(--ag-gold, #D4A843)"
            stroke="none"
            opacity="0.25"
          />
        ))}

        {/* ── Edge ornaments (far left and right) ── */}
        <g opacity="0.3">
          {/* Far left scroll */}
          <path
            d="M8,78 L8,60 Q8,52 16,48"
            strokeWidth="0.5"
          />
          <path
            d="M16,48 Q20,46 18,42 Q14,44 16,48"
            strokeWidth="0.4"
          />
          {/* Far right scroll */}
          <path
            d="M394,78 L394,60 Q394,52 386,48"
            strokeWidth="0.5"
          />
          <path
            d="M386,48 Q382,46 384,42 Q388,44 386,48"
            strokeWidth="0.4"
          />
        </g>
      </g>
    </svg>
  );
};
