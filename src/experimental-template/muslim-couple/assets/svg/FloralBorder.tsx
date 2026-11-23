import React from 'react';

interface FloralBorderProps {
  position: 'top' | 'bottom';
  className?: string;
  style?: React.CSSProperties;
}

const FloralBorder: React.FC<FloralBorderProps> = ({ position, className, style }) => {
  const isTop = position === 'top';
  return (
    <svg
      viewBox="0 0 402 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{
        width: '100%',
        display: 'block',
        transform: isTop ? 'none' : 'scaleY(-1)',
        ...style,
      }}
      aria-hidden="true"
    >
      {/* Cascading vine with leaves */}
      <path
        d="M0 80 Q30 60 60 70 Q90 80 120 65 Q150 50 180 60 Q210 70 240 55 Q270 40 300 50 Q330 60 360 48 Q390 36 402 42"
        stroke="#5A7D5A"
        strokeWidth="1.5"
        fill="none"
        opacity="0.4"
      />
      <path
        d="M0 90 Q40 75 80 82 Q120 90 160 78 Q200 66 240 74 Q280 82 320 70 Q360 58 402 65"
        stroke="#5A7D5A"
        strokeWidth="1"
        fill="none"
        opacity="0.3"
      />
      {/* Leaves along the vine */}
      {[40, 100, 160, 220, 280, 340].map((x, i) => (
        <g key={i} transform={`translate(${x}, ${55 + (i % 2) * 15}) rotate(${i % 2 === 0 ? -30 : 30})`}>
          <ellipse rx="8" ry="4" fill="#5A7D5A" opacity="0.25" />
          <ellipse rx="6" ry="3" fill="#5A7D5A" opacity="0.15" transform="translate(2, -1)" />
        </g>
      ))}
      {/* Pink roses — large */}
      {[60, 150, 250, 350].map((x, i) => (
        <g key={`rose-${i}`} transform={`translate(${x}, ${40 + (i % 3) * 12})`}>
          <circle r="10" fill="#F2A8B8" opacity="0.55" />
          <circle r="7" fill="#E88DA0" opacity="0.45" />
          <circle r="4" fill="#D87890" opacity="0.35" />
          <circle r="1.5" fill="#C86878" opacity="0.3" />
        </g>
      ))}
      {/* White flowers — small */}
      {[30, 110, 195, 290, 375].map((x, i) => (
        <g key={`white-${i}`} transform={`translate(${x}, ${50 + (i % 2) * 18})`}>
          {[0, 72, 144, 216, 288].map((angle, j) => (
            <ellipse
              key={j}
              rx="4"
              ry="2.5"
              fill="#FFF8F0"
              opacity="0.5"
              transform={`rotate(${angle}) translate(4, 0)`}
            />
          ))}
          <circle r="2" fill="#F0C870" opacity="0.4" />
        </g>
      ))}
      {/* Scattered petals drifting down */}
      {[20, 80, 140, 200, 260, 320, 380].map((x, i) => (
        <ellipse
          key={`petal-${i}`}
          cx={x}
          cy={85 + (i % 3) * 10}
          rx={3 + (i % 2)}
          ry={2}
          fill="#F2A8B8"
          opacity={0.2 + (i % 3) * 0.08}
          transform={`rotate(${i * 35}, ${x}, ${85 + (i % 3) * 10})`}
        />
      ))}
      {/* Gold sparkle dots */}
      {[90, 180, 270, 360].map((x, i) => (
        <circle
          key={`spark-${i}`}
          cx={x}
          cy={35 + (i % 2) * 20}
          r="1.5"
          fill="#D4A050"
          opacity="0.35"
        />
      ))}
    </svg>
  );
};

export default FloralBorder;
