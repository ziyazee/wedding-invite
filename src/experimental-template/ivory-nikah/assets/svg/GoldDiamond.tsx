/**
 * Gold Diamond Marker
 *
 * A small rotated square (diamond) used as a minimal punctuation
 * mark between sections, between celebration cards, and as a
 * full-stop at the end of the Dua section.
 *
 * Default size: 6x6px visual (12x12px viewBox for padding)
 */

interface DiamondProps {
  className?: string;
  style?: React.CSSProperties;
  /** Size of the diamond in px. Default: 6 */
  size?: number;
}

export function GoldDiamond({ className, style, size = 6 }: DiamondProps) {
  const half = size / 2;
  return (
    <svg
      viewBox={`0 0 ${size + 4} ${size + 4}`}
      width={size + 4}
      height={size + 4}
      className={className}
      style={style}
      aria-hidden="true"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="goldDiamondGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#C9A84C" />
          <stop offset="100%" stopColor="#D5BD91" />
        </linearGradient>
      </defs>
      <rect
        x={2}
        y={2}
        width={size}
        height={size}
        rx={0.5}
        fill="url(#goldDiamondGrad)"
        opacity="0.8"
        transform={`rotate(45 ${half + 2} ${half + 2})`}
      />
    </svg>
  );
}
