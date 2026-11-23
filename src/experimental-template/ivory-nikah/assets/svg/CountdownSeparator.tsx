/**
 * Countdown Separator
 *
 * A thin vertical gold line used between countdown units
 * (Days | Hours | Minutes | Seconds). Minimal and elegant.
 *
 * Default: 1px wide, 32px tall at 0.3 opacity (per design bible)
 */

interface SeparatorProps {
  className?: string;
  style?: React.CSSProperties;
}

export function CountdownSeparator({ className, style }: SeparatorProps) {
  return (
    <svg
      viewBox="0 0 4 32"
      width={4}
      height={32}
      className={className}
      style={style}
      aria-hidden="true"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="countdownSepGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#C9A84C" stopOpacity="0" />
          <stop offset="25%" stopColor="#C9A84C" stopOpacity="0.3" />
          <stop offset="75%" stopColor="#C9A84C" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#C9A84C" stopOpacity="0" />
        </linearGradient>
      </defs>
      <line
        x1="2"
        y1="0"
        x2="2"
        y2="32"
        stroke="url(#countdownSepGrad)"
        strokeWidth="1"
      />
    </svg>
  );
}
