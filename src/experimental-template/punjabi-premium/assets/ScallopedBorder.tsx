import React from 'react';

interface ScallopedBorderProps extends React.SVGProps<SVGSVGElement> {
  /** Number of cusps: 3, 5, or 7 */
  cusps?: 3 | 5 | 7;
  /** Border color */
  color?: string;
  /** Whether to render as a clip-path definition instead of visible border */
  asClipPath?: boolean;
  /** Unique ID for clip-path reference */
  clipId?: string;
}

/**
 * Cusped arch edge as a horizontal decorative border.
 * Used as section dividers, card headers, and photo frame top edges.
 *
 * The scalloped shape is derived from the Mughal arch's inner edge,
 * abstracted into a repeating horizontal motif.
 */
const ScallopedBorder: React.FC<ScallopedBorderProps> = ({
  cusps = 5,
  color = '#E8D5C0',
  asClipPath = false,
  clipId = 'pp-scallop',
  className,
  ...props
}) => {
  const width = 400;
  const height = 40;

  // Generate the scalloped path based on cusp count
  const generateScallopPath = (cuspCount: number): string => {
    const segmentWidth = width / cuspCount;
    const parts: string[] = [`M0 ${height}`];

    for (let i = 0; i < cuspCount; i++) {
      const startX = i * segmentWidth;
      const midX = startX + segmentWidth / 2;
      const endX = startX + segmentWidth;
      const peakY = 8; // How high the cusps rise
      const valleyY = height * 0.65; // The scallop valley depth

      if (i === 0) {
        // First cusp starts from the left edge
        parts.push(
          `L${startX} ${valleyY}`,
          `C${startX + segmentWidth * 0.15} ${peakY}, ${midX - segmentWidth * 0.1} ${peakY}, ${midX} ${peakY + 4}`
        );
      } else {
        // Cusp valley
        parts.push(
          `C${startX - segmentWidth * 0.1} ${valleyY - 4}, ${startX + segmentWidth * 0.1} ${valleyY - 4}, ${startX} ${valleyY}`
        );
        // Cusp peak
        parts.push(
          `C${startX + segmentWidth * 0.15} ${peakY}, ${midX - segmentWidth * 0.1} ${peakY}, ${midX} ${peakY + 4}`
        );
      }

      if (i === cuspCount - 1) {
        // Last cusp descends to the right edge
        parts.push(
          `C${midX + segmentWidth * 0.1} ${peakY}, ${endX - segmentWidth * 0.15} ${peakY}, ${endX} ${valleyY}`,
          `L${endX} ${height}`
        );
      } else {
        parts.push(
          `C${midX + segmentWidth * 0.1} ${peakY}, ${endX - segmentWidth * 0.15} ${peakY}, ${endX} ${valleyY}`
        );
      }
    }

    parts.push('Z');
    return parts.join(' ');
  };

  const scallopPath = generateScallopPath(cusps);

  if (asClipPath) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox={`0 0 ${width} ${height}`}
        width="0"
        height="0"
        style={{ position: 'absolute' }}
        aria-hidden="true"
      >
        <defs>
          <clipPath id={clipId} clipPathUnits="objectBoundingBox">
            <path
              d={scallopPath}
              transform={`scale(${1 / width}, ${1 / height})`}
            />
          </clipPath>
        </defs>
      </svg>
    );
  }

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={`0 0 ${width} ${height}`}
      fill="none"
      preserveAspectRatio="none"
      aria-hidden="true"
      className={className}
      {...props}
    >
      <path d={scallopPath} fill={color} />
    </svg>
  );
};

export default ScallopedBorder;
