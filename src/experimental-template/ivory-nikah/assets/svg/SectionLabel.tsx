/**
 * Section Label with Flanking Rules
 *
 * Short gold lines extending left and right from a text label.
 * Used for the "Blessing" label in the Dua section and similar
 * small labels. The text is rendered outside this SVG; this component
 * provides just the decorative flanking lines.
 *
 * Usage: Place this behind or around the label text with CSS positioning,
 * or render two instances (left and right) flanking the label.
 */

interface LabelRuleProps {
  className?: string;
  style?: React.CSSProperties;
  /** Which side: 'left' extends to the left, 'right' extends to the right */
  side: 'left' | 'right';
}

export function SectionLabelRule({ className, style, side }: LabelRuleProps) {
  const isLeft = side === 'left';

  return (
    <svg
      viewBox="0 0 48 6"
      className={className}
      style={{
        ...style,
        ...(isLeft ? {} : { transform: 'scaleX(-1)', ...(style?.transform ? {} : {}) }),
      }}
      aria-hidden="true"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id={`sectionLabelRule-${side}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#C9A84C" stopOpacity="0" />
          <stop offset="100%" stopColor="#C9A84C" stopOpacity="0.6" />
        </linearGradient>
      </defs>
      <line
        x1="2"
        y1="3"
        x2="46"
        y2="3"
        stroke={`url(#sectionLabelRule-${side})`}
        strokeWidth="1"
        strokeLinecap="round"
      />
    </svg>
  );
}
