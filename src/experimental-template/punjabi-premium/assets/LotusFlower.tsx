import React from 'react';

interface LotusFlowerProps extends React.SVGProps<SVGSVGElement> {
  petalColor?: string;
  innerPetalColor?: string;
  leafColor?: string;
  /** Size in pixels (width and height) */
  size?: number;
}

/**
 * Stylized lotus flower with layered pink petals and green base leaves.
 * Symbol of purity and new beginnings in Indian culture.
 *
 * Used as dividers, standalone accents, and footer motif.
 * Painterly, organic curves -- not geometric.
 */
const LotusFlower: React.FC<LotusFlowerProps> = ({
  petalColor = '#E8A0A8',
  innerPetalColor = '#D4708A',
  leafColor = '#7A9A6A',
  size,
  className,
  style,
  ...props
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 80 52"
    fill="none"
    aria-hidden="true"
    className={className}
    style={{
      ...style,
      ...(size ? { width: size, height: size * (52 / 80) } : {}),
    }}
    {...props}
  >
    {/* Base leaves -- broad, curved, sage green */}
    <path
      d="M8 38 C12 28, 22 24, 30 26 C26 30, 16 34, 8 38 Z"
      fill={leafColor}
      fillOpacity="0.8"
    />
    <path
      d="M72 38 C68 28, 58 24, 50 26 C54 30, 64 34, 72 38 Z"
      fill={leafColor}
      fillOpacity="0.8"
    />
    {/* Smaller inner leaves */}
    <path
      d="M16 40 C18 32, 26 28, 34 30 C30 34, 22 37, 16 40 Z"
      fill={leafColor}
      fillOpacity="0.5"
    />
    <path
      d="M64 40 C62 32, 54 28, 46 30 C50 34, 58 37, 64 40 Z"
      fill={leafColor}
      fillOpacity="0.5"
    />

    {/* Outer petals -- softest pink, wide spread */}
    {/* Far left petal */}
    <path
      d="M14 36 C12 26, 18 16, 26 14 C28 18, 24 28, 20 36 Z"
      fill={petalColor}
      fillOpacity="0.7"
    />
    {/* Left petal */}
    <path
      d="M22 34 C20 22, 26 12, 34 8 C36 14, 32 24, 28 34 Z"
      fill={petalColor}
      fillOpacity="0.85"
    />
    {/* Center-left petal */}
    <path
      d="M30 32 C29 18, 34 6, 38 2 C42 6, 40 18, 38 32 Z"
      fill={petalColor}
    />
    {/* Center petal (tallest) */}
    <path
      d="M36 30 C36 16, 39 4, 40 0 C41 4, 44 16, 44 30 Z"
      fill={petalColor}
    />
    {/* Center-right petal */}
    <path
      d="M42 32 C40 18, 42 6, 46 2 C48 6, 51 18, 50 32 Z"
      fill={petalColor}
    />
    {/* Right petal */}
    <path
      d="M52 34 C48 24, 44 14, 46 8 C54 12, 60 22, 58 34 Z"
      fill={petalColor}
      fillOpacity="0.85"
    />
    {/* Far right petal */}
    <path
      d="M60 36 C56 28, 52 18, 54 14 C62 16, 68 26, 66 36 Z"
      fill={petalColor}
      fillOpacity="0.7"
    />

    {/* Inner petals -- deeper pink, smaller, overlapping */}
    <path
      d="M32 34 C31 24, 35 14, 38 10 C40 14, 39 24, 37 34 Z"
      fill={innerPetalColor}
      fillOpacity="0.7"
    />
    <path
      d="M37 32 C37 22, 39 10, 40 6 C41 10, 43 22, 43 32 Z"
      fill={innerPetalColor}
      fillOpacity="0.8"
    />
    <path
      d="M43 34 C41 24, 40 14, 42 10 C45 14, 49 24, 48 34 Z"
      fill={innerPetalColor}
      fillOpacity="0.7"
    />

    {/* Center stamen dot */}
    <circle cx="40" cy="30" r="2.5" fill={innerPetalColor} fillOpacity="0.5" />

    {/* Base connection -- the stem/pad area */}
    <ellipse cx="40" cy="42" rx="18" ry="5" fill={leafColor} fillOpacity="0.3" />
  </svg>
);

export default LotusFlower;
