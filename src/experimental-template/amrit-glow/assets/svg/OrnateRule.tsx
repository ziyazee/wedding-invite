import React from 'react';

interface OrnateRuleProps {
  className?: string;
  width?: number;
}

/**
 * Ornamental rule with diamond center and tapered gold lines.
 * Mughal-inspired formal divider — used between couple/family sections,
 * below section headings, and as standard-weight content separators.
 *
 * Default width: 200px. The lines taper from the diamond outward,
 * with small decorative curls at the endpoints.
 */
export const OrnateRule: React.FC<OrnateRuleProps> = ({
  className,
  width = 200,
}) => {
  const scale = width / 200;
  const h = 24 * scale;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 200 24"
      width={width}
      height={h}
      className={className}
      aria-hidden="true"
      style={{ display: 'block' }}
    >
      {/* Left decorative line with taper and end curl */}
      <g opacity="0.55">
        {/* Left line — tapers from center outward */}
        <line
          x1="12"
          y1="12"
          x2="88"
          y2="12"
          stroke="var(--ag-gold, #D4A843)"
          strokeWidth="1"
          strokeLinecap="round"
        />
        {/* Left fine outer stroke for depth */}
        <line
          x1="18"
          y1="12"
          x2="88"
          y2="12"
          stroke="var(--ag-gold-bright, #E8C65A)"
          strokeWidth="0.3"
          strokeLinecap="round"
          opacity="0.4"
        />
        {/* Left end curl — small inward scroll */}
        <path
          d="M12,12 Q8,12 7,10 Q6,8 8,7"
          fill="none"
          stroke="var(--ag-gold, #D4A843)"
          strokeWidth="0.8"
          strokeLinecap="round"
        />
        {/* Left small teardrop accent near diamond */}
        <ellipse
          cx="84"
          cy="12"
          rx="1.2"
          ry="1.2"
          fill="var(--ag-gold, #D4A843)"
          opacity="0.5"
        />
      </g>

      {/* Right decorative line with taper and end curl */}
      <g opacity="0.55">
        {/* Right line */}
        <line
          x1="112"
          y1="12"
          x2="188"
          y2="12"
          stroke="var(--ag-gold, #D4A843)"
          strokeWidth="1"
          strokeLinecap="round"
        />
        {/* Right fine outer stroke for depth */}
        <line
          x1="112"
          y1="12"
          x2="182"
          y2="12"
          stroke="var(--ag-gold-bright, #E8C65A)"
          strokeWidth="0.3"
          strokeLinecap="round"
          opacity="0.4"
        />
        {/* Right end curl — small inward scroll */}
        <path
          d="M188,12 Q192,12 193,10 Q194,8 192,7"
          fill="none"
          stroke="var(--ag-gold, #D4A843)"
          strokeWidth="0.8"
          strokeLinecap="round"
        />
        {/* Right small teardrop accent near diamond */}
        <ellipse
          cx="116"
          cy="12"
          rx="1.2"
          ry="1.2"
          fill="var(--ag-gold, #D4A843)"
          opacity="0.5"
        />
      </g>

      {/* Center diamond — rotated square with inner detail */}
      <g transform="translate(100, 12)">
        {/* Outer diamond */}
        <rect
          x="-4.5"
          y="-4.5"
          width="9"
          height="9"
          rx="0.5"
          transform="rotate(45)"
          fill="none"
          stroke="var(--ag-gold, #D4A843)"
          strokeWidth="0.8"
          opacity="0.7"
        />
        {/* Inner diamond fill */}
        <rect
          x="-2.5"
          y="-2.5"
          width="5"
          height="5"
          transform="rotate(45)"
          fill="var(--ag-gold, #D4A843)"
          opacity="0.6"
        />
        {/* Diamond highlight dot */}
        <circle
          cx="0"
          cy="0"
          r="1"
          fill="var(--ag-gold-bright, #E8C65A)"
          opacity="0.5"
        />
      </g>

      {/* Small flanking dots beside the diamond */}
      <circle
        cx="90"
        cy="12"
        r="0.8"
        fill="var(--ag-gold, #D4A843)"
        opacity="0.4"
      />
      <circle
        cx="110"
        cy="12"
        r="0.8"
        fill="var(--ag-gold, #D4A843)"
        opacity="0.4"
      />
    </svg>
  );
};
