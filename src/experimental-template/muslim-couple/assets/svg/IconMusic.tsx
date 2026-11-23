import React from 'react';

interface SvgProps {
  className?: string;
  style?: React.CSSProperties;
  /** 'note' for music playing, 'pause' for paused state */
  variant?: 'note' | 'pause';
}

/**
 * Music toggle icon for the persistent music button.
 * Note variant: musical note glyph.
 * Pause variant: pause bars.
 * viewBox: 20x20. Color: currentColor.
 */
const IconMusic: React.FC<SvgProps> = ({ className, style, variant = 'note' }) => (
  <svg
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={style}
    aria-hidden="true"
  >
    {variant === 'note' ? (
      <>
        {/* Musical note stem */}
        <line x1="12" y1="4" x2="12" y2="14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        {/* Note head */}
        <ellipse cx="8.5" cy="14" rx="3" ry="2.2" fill="currentColor" transform="rotate(-15,8.5,14)" />
        {/* Flag */}
        <path d="M12,4 C14,5 15,7 14,9" stroke="currentColor" strokeWidth="1.3" fill="none" strokeLinecap="round" />
      </>
    ) : (
      <>
        {/* Pause bars */}
        <rect x="6" y="5" width="2.5" height="10" rx="1" fill="currentColor" />
        <rect x="11.5" y="5" width="2.5" height="10" rx="1" fill="currentColor" />
      </>
    )}
  </svg>
);

export default IconMusic;
