import React from 'react';

interface NoiseTextureProps {
  className?: string;
  width?: number;
  height?: number;
  /** Noise opacity — design bible specifies 1-2% */
  opacity?: number;
}

/**
 * Inline SVG fractal noise texture — applied as a full-section overlay
 * at 1-2% opacity to prevent gradient banding on AMOLED displays.
 *
 * Uses SVG feTurbulence filter to generate a 100x100 noise tile that
 * is tiled across the element. This is pure CSS-compatible noise
 * (no external image dependency).
 *
 * Referenced in design bible section 4, Background Rules item 2:
 * "Apply a CSS noise overlay at 1-2% opacity over all section backgrounds
 * to prevent gradient banding on AMOLED displays."
 */
export const NoiseTexture: React.FC<NoiseTextureProps> = ({
  className,
  width = 100,
  height = 100,
  opacity = 0.015,
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      width={width}
      height={height}
      className={className}
      aria-hidden="true"
      style={{
        display: 'block',
        opacity,
      }}
    >
      <defs>
        <filter id="ag-noise-filter" x="0" y="0" width="100%" height="100%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.65"
            numOctaves="3"
            stitchTiles="stitch"
            result="noise"
          />
          <feColorMatrix
            type="saturate"
            values="0"
            in="noise"
            result="desaturated"
          />
        </filter>
      </defs>
      <rect
        x="0"
        y="0"
        width="100"
        height="100"
        filter="url(#ag-noise-filter)"
      />
    </svg>
  );
};

/**
 * Returns a CSS background-image value using an inline SVG data URI
 * for the noise texture. Use this in CSS-in-JS or style attributes
 * when you need the noise as a repeating background tile rather than
 * an inline SVG element.
 *
 * Usage: `backgroundImage: noiseTextureDataUri()`
 */
export const noiseTextureDataUri = (): string => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100"><filter id="n" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/></filter><rect width="100" height="100" filter="url(#n)"/></svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
};
