import React from 'react';

interface SvgProps {
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Bismillah calligraphic text rendered as SVG.
 * "In the name of Allah, the Most Gracious, the Most Merciful"
 * This is NOT decorative — it is the spiritual anchor of the invitation.
 * Uses the Amiri font rendered as text (not paths) so it remains selectable and accessible.
 * The component renders the Arabic text directly; font must be loaded.
 * viewBox: 300x60
 */
const Bismillah: React.FC<SvgProps> = ({ className, style }) => (
  <svg
    viewBox="0 0 300 60"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={style}
    role="img"
    aria-label="Bismillahir Rahmanir Rahim - In the name of Allah, the Most Gracious, the Most Merciful"
  >
    <text
      x="150"
      y="42"
      textAnchor="middle"
      fill="currentColor"
      fontFamily="'Amiri', 'Times New Roman', serif"
      fontSize="30"
      fontWeight="400"
      direction="rtl"
    >
      {'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ'}
    </text>
  </svg>
);

export default Bismillah;
