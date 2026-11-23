import React from 'react';

interface SvgProps {
  className?: string;
  style?: React.CSSProperties;
  /** 'large' (24x40, flanking countdown) or 'small' (24x24, celebration card icon) */
  variant?: 'large' | 'small';
}

/**
 * Mughal/Moroccan box-shaped lantern.
 * Large: 24x40 — flanking the countdown card, decorative element.
 * Small: 24x24 — event card header icon.
 * Frame: --mc-bronze (#8B6838). Glass: --mc-gold at 40%.
 */
const Lantern: React.FC<SvgProps> = ({ className, style, variant = 'large' }) => {
  if (variant === 'small') {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        style={style}
        aria-hidden="true"
      >
        {/* Hanging hook */}
        <path d="M12,1 L12,3" stroke="#8B6838" strokeWidth="1" strokeLinecap="round" />
        <path d="M9,3 Q12,1.5 15,3" stroke="#8B6838" strokeWidth="0.8" fill="none" />
        {/* Cap */}
        <path d="M8,4 L16,4 L15,6 L9,6 Z" fill="#8B6838" />
        {/* Lantern body — pointed Mughal-style */}
        <path
          d="M9,6 L9,16 Q9,18 12,20 Q15,18 15,16 L15,6 Z"
          stroke="#8B6838"
          strokeWidth="0.8"
          fill="#D4A050"
          fillOpacity="0.35"
        />
        {/* Glass panel divisions */}
        <line x1="12" y1="6" x2="12" y2="19" stroke="#8B6838" strokeWidth="0.4" opacity="0.5" />
        <line x1="9" y1="11" x2="15" y2="11" stroke="#8B6838" strokeWidth="0.4" opacity="0.5" />
        {/* Finial at bottom */}
        <circle cx="12" cy="21" r="1" fill="#8B6838" />
      </svg>
    );
  }

  // Large variant (24x40)
  return (
    <svg
      viewBox="0 0 24 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={style}
      aria-hidden="true"
    >
      {/* Hanging chain */}
      <path d="M12,0 L12,4" stroke="#8B6838" strokeWidth="1" strokeLinecap="round" />
      {/* Decorative hook */}
      <path d="M10,2 Q12,0.5 14,2" stroke="#8B6838" strokeWidth="0.8" fill="none" />
      {/* Top cap — ornamental */}
      <path d="M7,5 L17,5 L16,8 L8,8 Z" fill="#8B6838" />
      <path d="M8.5,5 L15.5,5 L15,4 L9,4 Z" fill="#8B6838" opacity="0.7" />
      {/* Main body — pointed Mughal lantern shape */}
      <path
        d="M8,8 L8,28 Q8,32 12,35 Q16,32 16,28 L16,8 Z"
        stroke="#8B6838"
        strokeWidth="1"
        fill="#D4A050"
        fillOpacity="0.35"
      />
      {/* Glass panel vertical divisions */}
      <line x1="12" y1="8" x2="12" y2="33" stroke="#8B6838" strokeWidth="0.5" opacity="0.4" />
      {/* Glass panel horizontal divisions */}
      <line x1="8" y1="14" x2="16" y2="14" stroke="#8B6838" strokeWidth="0.5" opacity="0.4" />
      <line x1="8" y1="22" x2="16" y2="22" stroke="#8B6838" strokeWidth="0.5" opacity="0.4" />
      {/* Inner glow center */}
      <ellipse cx="12" cy="18" rx="3" ry="4" fill="#D4A050" fillOpacity="0.2" />
      {/* Small arch detail on panels */}
      <path d="M9,9 Q10,11 12,9" stroke="#8B6838" strokeWidth="0.3" fill="none" opacity="0.5" />
      <path d="M12,9 Q14,11 15,9" stroke="#8B6838" strokeWidth="0.3" fill="none" opacity="0.5" />
      {/* Bottom finial */}
      <ellipse cx="12" cy="36" rx="1.5" ry="1" fill="#8B6838" />
      <circle cx="12" cy="38" r="0.8" fill="#8B6838" opacity="0.7" />
    </svg>
  );
};

export default Lantern;
