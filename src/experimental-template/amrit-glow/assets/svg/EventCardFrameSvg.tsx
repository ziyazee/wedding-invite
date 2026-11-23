import React from 'react';

interface EventCardFrameSvgProps {
  width?: number;
  height?: number;
  className?: string;
}

export const EventCardFrameSvg: React.FC<EventCardFrameSvgProps> = ({
  width = 340,
  height = 280,
  className,
}) => {
  const w = 340;
  const h = 280;
  const pad = 8;
  const cornerLen = 40;
  const flourishLen = 20;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={`0 0 ${w} ${h}`}
      width={width}
      height={height}
      className={className}
      aria-hidden="true"
      style={{ display: 'block' }}
    >
      <defs>
        <linearGradient id="ag-ecf-gold-h" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="var(--ag-gold, #D4A843)" stopOpacity="0" />
          <stop offset="20%" stopColor="var(--ag-gold, #D4A843)" stopOpacity="0.5" />
          <stop offset="80%" stopColor="var(--ag-gold, #D4A843)" stopOpacity="0.5" />
          <stop offset="100%" stopColor="var(--ag-gold, #D4A843)" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="ag-ecf-gold-v" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="var(--ag-gold, #D4A843)" stopOpacity="0" />
          <stop offset="20%" stopColor="var(--ag-gold, #D4A843)" stopOpacity="0.5" />
          <stop offset="80%" stopColor="var(--ag-gold, #D4A843)" stopOpacity="0.5" />
          <stop offset="100%" stopColor="var(--ag-gold, #D4A843)" stopOpacity="0" />
        </linearGradient>
      </defs>

      <g fill="none" stroke="var(--ag-gold, #D4A843)" strokeLinecap="round" strokeLinejoin="round">
        {/* ── Top-left corner ── */}
        <path d={`M ${pad},${pad + cornerLen} L ${pad},${pad} L ${pad + cornerLen},${pad}`} strokeWidth="0.8" opacity="0.55" />
        {/* Flourish curl TL */}
        <path d={`M ${pad},${pad} Q ${pad + 10},${pad + 3} ${pad + flourishLen},${pad + flourishLen}`} strokeWidth="0.5" opacity="0.3" />
        {/* Inner corner TL */}
        <path d={`M ${pad + 4},${pad + cornerLen - 8} L ${pad + 4},${pad + 4} L ${pad + cornerLen - 8},${pad + 4}`} strokeWidth="0.4" opacity="0.25" />
        {/* Diamond at TL */}
        <rect x={pad - 1.5} y={pad - 1.5} width="3" height="3" rx="0.3" transform={`rotate(45, ${pad}, ${pad})`} strokeWidth="0.5" opacity="0.45" fill="var(--ag-gold, #D4A843)" fillOpacity="0.2" />

        {/* ── Top-right corner ── */}
        <path d={`M ${w - pad - cornerLen},${pad} L ${w - pad},${pad} L ${w - pad},${pad + cornerLen}`} strokeWidth="0.8" opacity="0.55" />
        <path d={`M ${w - pad},${pad} Q ${w - pad - 10},${pad + 3} ${w - pad - flourishLen},${pad + flourishLen}`} strokeWidth="0.5" opacity="0.3" />
        <path d={`M ${w - pad - cornerLen + 8},${pad + 4} L ${w - pad - 4},${pad + 4} L ${w - pad - 4},${pad + cornerLen - 8}`} strokeWidth="0.4" opacity="0.25" />
        <rect x={w - pad - 1.5} y={pad - 1.5} width="3" height="3" rx="0.3" transform={`rotate(45, ${w - pad}, ${pad})`} strokeWidth="0.5" opacity="0.45" fill="var(--ag-gold, #D4A843)" fillOpacity="0.2" />

        {/* ── Bottom-left corner ── */}
        <path d={`M ${pad},${h - pad - cornerLen} L ${pad},${h - pad} L ${pad + cornerLen},${h - pad}`} strokeWidth="0.8" opacity="0.55" />
        <path d={`M ${pad},${h - pad} Q ${pad + 10},${h - pad - 3} ${pad + flourishLen},${h - pad - flourishLen}`} strokeWidth="0.5" opacity="0.3" />
        <path d={`M ${pad + 4},${h - pad - cornerLen + 8} L ${pad + 4},${h - pad - 4} L ${pad + cornerLen - 8},${h - pad - 4}`} strokeWidth="0.4" opacity="0.25" />
        <rect x={pad - 1.5} y={h - pad - 1.5} width="3" height="3" rx="0.3" transform={`rotate(45, ${pad}, ${h - pad})`} strokeWidth="0.5" opacity="0.45" fill="var(--ag-gold, #D4A843)" fillOpacity="0.2" />

        {/* ── Bottom-right corner ── */}
        <path d={`M ${w - pad - cornerLen},${h - pad} L ${w - pad},${h - pad} L ${w - pad},${h - pad - cornerLen}`} strokeWidth="0.8" opacity="0.55" />
        <path d={`M ${w - pad},${h - pad} Q ${w - pad - 10},${h - pad - 3} ${w - pad - flourishLen},${h - pad - flourishLen}`} strokeWidth="0.5" opacity="0.3" />
        <path d={`M ${w - pad - cornerLen + 8},${h - pad - 4} L ${w - pad - 4},${h - pad - 4} L ${w - pad - 4},${h - pad - cornerLen + 8}`} strokeWidth="0.4" opacity="0.25" />
        <rect x={w - pad - 1.5} y={h - pad - 1.5} width="3" height="3" rx="0.3" transform={`rotate(45, ${w - pad}, ${h - pad})`} strokeWidth="0.5" opacity="0.45" fill="var(--ag-gold, #D4A843)" fillOpacity="0.2" />

        {/* ── Connecting lines (fading toward center) ── */}
        {/* Top edge */}
        <line x1={pad + cornerLen} y1={pad} x2={w - pad - cornerLen} y2={pad} stroke="url(#ag-ecf-gold-h)" strokeWidth="0.4" opacity="0.3" />
        {/* Bottom edge */}
        <line x1={pad + cornerLen} y1={h - pad} x2={w - pad - cornerLen} y2={h - pad} stroke="url(#ag-ecf-gold-h)" strokeWidth="0.4" opacity="0.3" />
        {/* Left edge */}
        <line x1={pad} y1={pad + cornerLen} x2={pad} y2={h - pad - cornerLen} stroke="url(#ag-ecf-gold-v)" strokeWidth="0.4" opacity="0.3" />
        {/* Right edge */}
        <line x1={w - pad} y1={pad + cornerLen} x2={w - pad} y2={h - pad - cornerLen} stroke="url(#ag-ecf-gold-v)" strokeWidth="0.4" opacity="0.3" />

        {/* ── Center top ornament (small diamond) ── */}
        <rect x={w / 2 - 2} y={pad - 2} width="4" height="4" rx="0.3" transform={`rotate(45, ${w / 2}, ${pad})`} strokeWidth="0.4" opacity="0.35" fill="var(--ag-gold, #D4A843)" fillOpacity="0.15" />

        {/* ── Center bottom ornament ── */}
        <rect x={w / 2 - 2} y={h - pad - 2} width="4" height="4" rx="0.3" transform={`rotate(45, ${w / 2}, ${h - pad})`} strokeWidth="0.4" opacity="0.35" fill="var(--ag-gold, #D4A843)" fillOpacity="0.15" />

        {/* ── Small accent dots along edges ── */}
        <circle cx={w / 4} cy={pad} r="0.6" fill="var(--ag-gold, #D4A843)" stroke="none" opacity="0.25" />
        <circle cx={(w * 3) / 4} cy={pad} r="0.6" fill="var(--ag-gold, #D4A843)" stroke="none" opacity="0.25" />
        <circle cx={w / 4} cy={h - pad} r="0.6" fill="var(--ag-gold, #D4A843)" stroke="none" opacity="0.25" />
        <circle cx={(w * 3) / 4} cy={h - pad} r="0.6" fill="var(--ag-gold, #D4A843)" stroke="none" opacity="0.25" />
      </g>
    </svg>
  );
};
