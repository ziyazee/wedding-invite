import React from 'react';

type CornerPosition = 'top-left' | 'top-right' | 'bottom-right' | 'bottom-left';

interface GoldCornerOrnamentProps {
  className?: string;
  size?: number;
  /** Which corner to render — applies appropriate rotation */
  position?: CornerPosition;
}

const rotations: Record<CornerPosition, number> = {
  'top-left': 0,
  'top-right': 90,
  'bottom-right': 180,
  'bottom-left': 270,
};

/**
 * Gold corner ornament — Mughal-inspired L-shaped filigree corner piece.
 * Features scrollwork along both arms of the corner, with a cusped
 * flourish at the vertex and small leaf/petal details along the edges.
 *
 * Base position is top-left. Pass `position` prop to auto-rotate
 * for other corners. Default size: 80px.
 *
 * SVG alternative to the gold-corner.png raster asset — lighter weight,
 * no blend-mode workaround needed, scales perfectly.
 */
export const GoldCornerOrnament: React.FC<GoldCornerOrnamentProps> = ({
  className,
  size = 80,
  position = 'top-left',
}) => {
  const rotation = rotations[position];

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 80 80"
      width={size}
      height={size}
      className={className}
      aria-hidden="true"
      style={{
        display: 'block',
        transform: rotation ? `rotate(${rotation}deg)` : undefined,
      }}
    >
      <g
        fill="none"
        stroke="var(--ag-gold, #D4A843)"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* ── Outer L-frame ── */}
        {/* Horizontal arm */}
        <path
          d="M4,4 L60,4"
          strokeWidth="1"
          opacity="0.6"
        />
        {/* Vertical arm */}
        <path
          d="M4,4 L4,60"
          strokeWidth="1"
          opacity="0.6"
        />

        {/* ── Inner L-frame (parallel, inset) ── */}
        <path
          d="M8,8 L50,8"
          strokeWidth="0.5"
          opacity="0.35"
        />
        <path
          d="M8,8 L8,50"
          strokeWidth="0.5"
          opacity="0.35"
        />

        {/* ── Corner vertex flourish ── */}
        {/* Cusped curl at the corner intersection */}
        <path
          d="M4,4 Q12,4 12,12 Q12,4 4,4"
          strokeWidth="0.6"
          opacity="0.4"
          fill="var(--ag-gold, #D4A843)"
          fillOpacity="0.15"
        />
        {/* Small diamond at corner vertex */}
        <rect
          x="2"
          y="2"
          width="4"
          height="4"
          rx="0.3"
          transform="rotate(45, 4, 4)"
          strokeWidth="0.5"
          opacity="0.5"
          fill="var(--ag-gold, #D4A843)"
          fillOpacity="0.25"
        />

        {/* ── Horizontal arm scrollwork ── */}
        {/* Scroll curl at end of horizontal arm */}
        <path
          d="M58,4 Q64,4 66,8 Q68,12 64,14 Q60,12 62,8"
          strokeWidth="0.7"
          opacity="0.45"
        />
        {/* Leaf accent along horizontal arm */}
        <path
          d="M28,4 Q26,0 28,-2 Q30,0 28,4"
          fill="var(--ag-gold, #D4A843)"
          fillOpacity="0.2"
          stroke="none"
        />
        <path
          d="M40,4 Q38,0 40,-2 Q42,0 40,4"
          fill="var(--ag-gold, #D4A843)"
          fillOpacity="0.15"
          stroke="none"
        />
        {/* Small dots along horizontal arm */}
        <circle cx="20" cy="4" r="0.7" fill="var(--ag-gold, #D4A843)" stroke="none" opacity="0.3" />
        <circle cx="35" cy="4" r="0.5" fill="var(--ag-gold, #D4A843)" stroke="none" opacity="0.25" />
        <circle cx="48" cy="4" r="0.7" fill="var(--ag-gold, #D4A843)" stroke="none" opacity="0.3" />

        {/* ── Vertical arm scrollwork ── */}
        {/* Scroll curl at end of vertical arm */}
        <path
          d="M4,58 Q4,64 8,66 Q12,68 14,64 Q12,60 8,62"
          strokeWidth="0.7"
          opacity="0.45"
        />
        {/* Leaf accent along vertical arm */}
        <path
          d="M4,28 Q0,26 -2,28 Q0,30 4,28"
          fill="var(--ag-gold, #D4A843)"
          fillOpacity="0.2"
          stroke="none"
        />
        <path
          d="M4,40 Q0,38 -2,40 Q0,42 4,40"
          fill="var(--ag-gold, #D4A843)"
          fillOpacity="0.15"
          stroke="none"
        />
        {/* Small dots along vertical arm */}
        <circle cx="4" cy="20" r="0.7" fill="var(--ag-gold, #D4A843)" stroke="none" opacity="0.3" />
        <circle cx="4" cy="35" r="0.5" fill="var(--ag-gold, #D4A843)" stroke="none" opacity="0.25" />
        <circle cx="4" cy="48" r="0.7" fill="var(--ag-gold, #D4A843)" stroke="none" opacity="0.3" />

        {/* ── Diagonal filigree between arms (inner curve) ── */}
        <path
          d="M12,12 Q20,12 20,20"
          strokeWidth="0.35"
          opacity="0.2"
        />
        <path
          d="M16,16 Q24,16 24,24"
          strokeWidth="0.3"
          opacity="0.15"
        />
      </g>
    </svg>
  );
};
