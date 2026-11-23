import React from 'react';

interface TimerUnitFrameProps {
  className?: string;
  size?: number;
}

/**
 * Decorative framing for a single countdown timer unit (e.g., "42 DAYS").
 * Features a subtle cusped arch top with thin vertical side strokes and
 * a delicate base line. The number and label text are placed inside via CSS.
 *
 * Default size: 72px square. The arch at top echoes the Mughal arch motif
 * without being heavy — a structural whisper, not a loud frame.
 */
export const TimerUnitFrame: React.FC<TimerUnitFrameProps> = ({
  className,
  size = 72,
}) => {
  const scale = size / 72;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 72 72"
      width={size}
      height={size}
      className={className}
      aria-hidden="true"
      style={{ display: 'block' }}
    >
      <g
        fill="none"
        stroke="var(--ag-gold, #D4A843)"
        strokeLinecap="round"
      >
        {/* Top cusped arch — small ornamental arch crowning the unit */}
        <path
          d="M18,18 Q18,8 36,4 Q54,8 54,18"
          strokeWidth="0.7"
          opacity="0.4"
        />
        {/* Inner arch detail */}
        <path
          d="M24,16 Q24,10 36,7 Q48,10 48,16"
          strokeWidth="0.35"
          opacity="0.25"
        />
        {/* Arch peak finial dot */}
        <circle
          cx="36"
          cy="3"
          r="1"
          fill="var(--ag-gold, #D4A843)"
          stroke="none"
          opacity="0.35"
        />

        {/* Left vertical side stroke */}
        <line
          x1="16"
          y1="18"
          x2="16"
          y2="58"
          strokeWidth="0.5"
          opacity="0.25"
        />
        {/* Right vertical side stroke */}
        <line
          x1="56"
          y1="18"
          x2="56"
          y2="58"
          strokeWidth="0.5"
          opacity="0.25"
        />

        {/* Bottom base line with slight curve */}
        <path
          d="M18,60 Q36,64 54,60"
          strokeWidth="0.6"
          opacity="0.35"
        />

        {/* Small corner accents at the arch-to-side junctions */}
        <circle cx="18" cy="18" r="0.8" fill="var(--ag-gold, #D4A843)" stroke="none" opacity="0.3" />
        <circle cx="54" cy="18" r="0.8" fill="var(--ag-gold, #D4A843)" stroke="none" opacity="0.3" />

        {/* Very faint vertical center marker — alignment guide aesthetic */}
        <line
          x1="36"
          y1="14"
          x2="36"
          y2="16"
          strokeWidth="0.3"
          opacity="0.15"
        />
      </g>
    </svg>
  );
};
