import React from 'react';

interface SvgProps {
  className?: string;
  style?: React.CSSProperties;
  /** Petal shape variant: a (curled from above), b (elongated side), c (wide open), d (tight curl) */
  variant?: 'a' | 'b' | 'c' | 'd';
}

/**
 * Individual rose petal shapes for ambient floating animation and decorative scatter.
 * 4 variants for visual variety. Each ~14x10.
 * Colors applied via CSS (currentColor) or inline style.
 */
const RosePetal: React.FC<SvgProps> = ({ className, style, variant = 'a' }) => {
  const paths: Record<string, React.ReactNode> = {
    // Variant A: curled petal viewed from above
    a: (
      <path
        d="M7,1 C10,0 13,2 13,5 C13,8 10,10 7,9 C4,8 2,6 3,3 C3.5,1.5 5,0.5 7,1 Z"
        fill="currentColor"
        stroke="currentColor"
        strokeWidth="0.3"
        strokeOpacity="0.4"
      />
    ),
    // Variant B: elongated side-view petal
    b: (
      <path
        d="M2,5 C2,2 5,0 8,1 C11,2 13,4 12,7 C11,9 8,10 5,9 C3,8 2,7 2,5 Z"
        fill="currentColor"
        stroke="currentColor"
        strokeWidth="0.3"
        strokeOpacity="0.4"
      />
    ),
    // Variant C: wide, partially open petal
    c: (
      <path
        d="M3,3 C5,0 10,0 12,3 C14,6 12,9 8,10 C4,10 1,7 3,3 Z"
        fill="currentColor"
        stroke="currentColor"
        strokeWidth="0.3"
        strokeOpacity="0.4"
      />
    ),
    // Variant D: small, tightly curled petal
    d: (
      <path
        d="M6,1 C9,0 12,2 11,5 C10,7 7,8 5,7 C3,6 3,3 5,2 C5.5,1.5 6,1 6,1 Z"
        fill="currentColor"
        stroke="currentColor"
        strokeWidth="0.3"
        strokeOpacity="0.4"
      />
    ),
  };

  return (
    <svg
      viewBox="0 0 14 10"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={style}
      aria-hidden="true"
    >
      {paths[variant]}
      {/* Subtle vein line for realism */}
      {variant === 'a' && (
        <path d="M7,2 C6,4 6.5,7 7,8.5" stroke="currentColor" strokeWidth="0.2" opacity="0.3" fill="none" />
      )}
      {variant === 'b' && (
        <path d="M4,4 C6,3 8,4 10,6" stroke="currentColor" strokeWidth="0.2" opacity="0.3" fill="none" />
      )}
      {variant === 'c' && (
        <path d="M6,2 C7,4 7,7 7.5,9" stroke="currentColor" strokeWidth="0.2" opacity="0.3" fill="none" />
      )}
      {variant === 'd' && (
        <path d="M6,2 C7,3 7.5,5 6.5,6.5" stroke="currentColor" strokeWidth="0.2" opacity="0.3" fill="none" />
      )}
    </svg>
  );
};

export default RosePetal;
