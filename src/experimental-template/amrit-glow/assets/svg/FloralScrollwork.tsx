import React from 'react';

interface FloralScrollworkProps {
  className?: string;
  width?: number;
  /** Mirror horizontally — useful for paired left/right placement */
  mirror?: boolean;
}

/**
 * Mughal-inspired floral scrollwork motif — a single organic tendril
 * with leaf and petal details. Used as a versatile accent element:
 * beside section headings, flanking content blocks, or as a
 * standalone decorative mark.
 *
 * The design draws from Mughal illuminated manuscript border patterns:
 * a central flowing vine with stylized lotus buds and pointed leaves.
 *
 * Default width: 100px. Pass `mirror` to flip horizontally for
 * symmetric left/right pairs.
 */
export const FloralScrollwork: React.FC<FloralScrollworkProps> = ({
  className,
  width = 100,
  mirror = false,
}) => {
  const scale = width / 100;
  const h = 60 * scale;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 60"
      width={width}
      height={h}
      className={className}
      aria-hidden="true"
      style={{
        display: 'block',
        transform: mirror ? 'scaleX(-1)' : undefined,
      }}
    >
      <g
        fill="none"
        stroke="var(--ag-gold, #D4A843)"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* ── Main vine stem ── */}
        <path
          d="M8,48 Q12,42 20,38 Q32,30 42,28 Q56,24 68,22 Q80,20 90,16"
          strokeWidth="0.9"
          opacity="0.55"
        />

        {/* ── Large lotus bud at vine origin (left) ── */}
        <g opacity="0.5">
          {/* Central petal */}
          <path
            d="M8,48 Q4,42 8,36 Q12,42 8,48"
            fill="var(--ag-gold, #D4A843)"
            fillOpacity="0.2"
            strokeWidth="0.5"
          />
          {/* Left side petal */}
          <path
            d="M8,48 Q0,44 2,38 Q6,42 8,48"
            fill="var(--ag-gold, #D4A843)"
            fillOpacity="0.12"
            strokeWidth="0.4"
          />
          {/* Right side petal */}
          <path
            d="M8,48 Q16,44 14,38 Q10,42 8,48"
            fill="var(--ag-gold, #D4A843)"
            fillOpacity="0.12"
            strokeWidth="0.4"
          />
        </g>

        {/* ── First leaf pair (lower section of vine) ── */}
        <g opacity="0.4">
          {/* Upper leaf */}
          <path
            d="M26,34 Q22,28 26,24 Q30,28 26,34"
            fill="var(--ag-gold, #D4A843)"
            fillOpacity="0.18"
            strokeWidth="0.4"
          />
          {/* Lower leaf */}
          <path
            d="M30,38 Q34,42 38,38 Q34,36 30,38"
            fill="var(--ag-gold, #D4A843)"
            fillOpacity="0.12"
            strokeWidth="0.35"
          />
          {/* Leaf vein */}
          <line x1="26" y1="34" x2="26" y2="25" strokeWidth="0.2" opacity="0.3" />
        </g>

        {/* ── Second leaf pair (mid section) ── */}
        <g opacity="0.4">
          {/* Upper leaf — slightly larger */}
          <path
            d="M50,24 Q46,18 50,12 Q54,18 50,24"
            fill="var(--ag-gold, #D4A843)"
            fillOpacity="0.2"
            strokeWidth="0.45"
          />
          {/* Lower leaf */}
          <path
            d="M54,28 Q58,34 62,28 Q58,26 54,28"
            fill="var(--ag-gold, #D4A843)"
            fillOpacity="0.12"
            strokeWidth="0.35"
          />
          {/* Leaf vein */}
          <line x1="50" y1="24" x2="50" y2="13" strokeWidth="0.2" opacity="0.3" />
        </g>

        {/* ── Small bud at vine tip (right) ── */}
        <g opacity="0.45">
          <path
            d="M90,16 Q88,12 90,8 Q92,12 90,16"
            fill="var(--ag-gold, #D4A843)"
            fillOpacity="0.2"
            strokeWidth="0.4"
          />
          {/* Tiny tip */}
          <path
            d="M89.5,9 L90,5 L90.5,9"
            strokeWidth="0.35"
          />
        </g>

        {/* ── Small accent dots along vine ── */}
        <circle cx="16" cy="42" r="0.6" fill="var(--ag-gold, #D4A843)" stroke="none" opacity="0.3" />
        <circle cx="38" cy="30" r="0.6" fill="var(--ag-gold, #D4A843)" stroke="none" opacity="0.25" />
        <circle cx="60" cy="23" r="0.5" fill="var(--ag-gold, #D4A843)" stroke="none" opacity="0.25" />
        <circle cx="78" cy="20" r="0.5" fill="var(--ag-gold, #D4A843)" stroke="none" opacity="0.2" />

        {/* ── Subtle secondary tendril branching off the main vine ── */}
        <path
          d="M42,28 Q38,24 40,18"
          strokeWidth="0.35"
          opacity="0.2"
        />
        <path
          d="M68,22 Q72,18 70,12"
          strokeWidth="0.35"
          opacity="0.2"
        />
      </g>
    </svg>
  );
};
