import React from 'react';

interface OrnateArchFrameProps {
  className?: string;
  style?: React.CSSProperties;
}

const OrnateArchFrame: React.FC<OrnateArchFrameProps> = ({ className, style }) => (
  <svg
    viewBox="0 0 360 480"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={{ width: '100%', ...style }}
    aria-hidden="true"
  >
    {/* Outer arch frame */}
    <path
      d="M30 480 V160 Q30 40 180 20 Q330 40 330 160 V480"
      stroke="#D4A050"
      strokeWidth="2"
      fill="none"
      opacity="0.3"
    />
    {/* Inner arch frame */}
    <path
      d="M45 480 V170 Q45 60 180 42 Q315 60 315 170 V480"
      stroke="#D4A050"
      strokeWidth="1"
      fill="none"
      opacity="0.2"
    />
    {/* Cusped arch detail at top */}
    <path
      d="M80 140 Q100 90 130 80 Q150 95 165 70 Q175 55 180 45 Q185 55 195 70 Q210 95 230 80 Q260 90 280 140"
      stroke="#D4A050"
      strokeWidth="1.5"
      fill="none"
      opacity="0.25"
    />
    {/* Geometric star at keystone */}
    <g transform="translate(180, 30)" opacity="0.35">
      {[0, 45, 90, 135].map((angle, i) => (
        <rect
          key={i}
          x="-3"
          y="-10"
          width="6"
          height="20"
          rx="1"
          fill="#D4A050"
          transform={`rotate(${angle})`}
        />
      ))}
    </g>
    {/* Corner arabesque flourishes — top left */}
    <g transform="translate(30, 160)" opacity="0.2">
      <path d="M0 0 Q10 -15 25 -20 Q15 -5 20 5 Q8 2 0 0Z" fill="#D4A050" />
      <path d="M0 0 Q-5 -20 5 -35 Q10 -20 15 -10 Q5 -5 0 0Z" fill="#D4A050" />
    </g>
    {/* Corner arabesque — top right */}
    <g transform="translate(330, 160) scale(-1,1)" opacity="0.2">
      <path d="M0 0 Q10 -15 25 -20 Q15 -5 20 5 Q8 2 0 0Z" fill="#D4A050" />
      <path d="M0 0 Q-5 -20 5 -35 Q10 -20 15 -10 Q5 -5 0 0Z" fill="#D4A050" />
    </g>
    {/* Side pillar decorations */}
    {[200, 280, 360, 440].map((y, i) => (
      <React.Fragment key={i}>
        <circle cx="30" cy={y} r="3" fill="#D4A050" opacity="0.15" />
        <circle cx="330" cy={y} r="3" fill="#D4A050" opacity="0.15" />
      </React.Fragment>
    ))}
    {/* Floral vine climbing left pillar */}
    <path
      d="M32 480 Q25 420 35 380 Q45 340 30 300 Q20 260 38 220 Q48 190 32 160"
      stroke="#5A7D5A"
      strokeWidth="1"
      fill="none"
      opacity="0.2"
    />
    {/* Small roses on left vine */}
    {[380, 300, 220].map((y, i) => (
      <circle key={`lr-${i}`} cx={33 + (i % 2) * 5} cy={y} r="5" fill="#F2A8B8" opacity="0.2" />
    ))}
    {/* Right vine */}
    <path
      d="M328 480 Q335 420 325 380 Q315 340 330 300 Q340 260 322 220 Q312 190 328 160"
      stroke="#5A7D5A"
      strokeWidth="1"
      fill="none"
      opacity="0.2"
    />
    {[380, 300, 220].map((y, i) => (
      <circle key={`rr-${i}`} cx={327 - (i % 2) * 5} cy={y} r="5" fill="#F2A8B8" opacity="0.2" />
    ))}
    {/* Hanging floral garlands from arch top */}
    <path
      d="M80 140 Q100 180 130 170 Q150 160 160 155"
      stroke="#F2A8B8"
      strokeWidth="1"
      fill="none"
      opacity="0.25"
    />
    <path
      d="M280 140 Q260 180 230 170 Q210 160 200 155"
      stroke="#F2A8B8"
      strokeWidth="1"
      fill="none"
      opacity="0.25"
    />
    {/* Top garland flowers */}
    {[95, 120, 145].map((x, i) => (
      <circle key={`tfl-${i}`} cx={x} cy={165 + i * 3} r="4" fill="#F2A8B8" opacity="0.3" />
    ))}
    {[265, 240, 215].map((x, i) => (
      <circle key={`tfr-${i}`} cx={x} cy={165 + i * 3} r="4" fill="#F2A8B8" opacity="0.3" />
    ))}
  </svg>
);

export default OrnateArchFrame;
