interface Props {
  className?: string
  size?: number
  flip?: boolean
  variant?: 'full' | 'bud'
}

export default function RoseMotif({ className, size = 60, flip = false, variant = 'full' }: Props) {
  const transform = flip ? `scale(-1, 1)` : undefined
  const transformOrigin = flip ? 'center' : undefined

  if (variant === 'bud') {
    return (
      <svg
        className={className}
        width={size}
        height={size}
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        style={{ transform, transformOrigin }}
      >
        {/* Simplified 3-petal bud for divider use at ~12px */}
        <path
          d="M10 3 Q8 6 8 9 Q8 12 10 14 Q12 12 12 9 Q12 6 10 3 Z"
          stroke="var(--tj-gold)"
          strokeWidth="0.8"
          fill="var(--tj-rose)"
          fillOpacity="0.3"
        />
        <path
          d="M6 7 Q8 8 9 10 Q8 12 6 13 Q4 11 5 9 Q5 8 6 7 Z"
          stroke="var(--tj-gold)"
          strokeWidth="0.6"
          fill="var(--tj-rose)"
          fillOpacity="0.2"
        />
        <path
          d="M14 7 Q12 8 11 10 Q12 12 14 13 Q16 11 15 9 Q15 8 14 7 Z"
          stroke="var(--tj-gold)"
          strokeWidth="0.6"
          fill="var(--tj-rose)"
          fillOpacity="0.2"
        />
        <circle cx="10" cy="10" r="1.2" fill="var(--tj-gold)" opacity="0.7" />
      </svg>
    )
  }

  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 60 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      style={{ transform, transformOrigin }}
    >
      {/* Side-view stylized Mughal miniature rose — gold stroke first */}
      {/* Outer petals */}
      <path
        d="M30 10 Q22 16 20 24 Q18 32 22 38 Q26 32 30 26 Q34 32 38 38 Q42 32 40 24 Q38 16 30 10 Z"
        stroke="var(--tj-gold)"
        strokeWidth="1.2"
        fill="var(--tj-rose)"
        fillOpacity="0.15"
      />
      {/* Left outer petal */}
      <path
        d="M22 38 Q16 34 14 28 Q12 22 16 18 Q18 24 22 30 Z"
        stroke="var(--tj-gold)"
        strokeWidth="0.8"
        fill="var(--tj-rose)"
        fillOpacity="0.1"
      />
      {/* Right outer petal */}
      <path
        d="M38 38 Q44 34 46 28 Q48 22 44 18 Q42 24 38 30 Z"
        stroke="var(--tj-gold)"
        strokeWidth="0.8"
        fill="var(--tj-rose)"
        fillOpacity="0.1"
      />
      {/* Inner cup */}
      <path
        d="M30 18 Q26 22 25 28 Q28 32 30 34 Q32 32 35 28 Q34 22 30 18 Z"
        stroke="var(--tj-gold)"
        strokeWidth="0.8"
        fill="var(--tj-rose)"
        fillOpacity="0.25"
      />
      {/* Stem hint at bottom */}
      <line x1="30" y1="38" x2="30" y2="50" stroke="var(--tj-gold)" strokeWidth="0.8" opacity="0.4" />
      {/* Small leaves on stem */}
      <path d="M30 44 Q26 42 24 44 Q26 46 30 44 Z" stroke="var(--tj-gold)" strokeWidth="0.5" fill="var(--tj-gold)" fillOpacity="0.2" />
      <path d="M30 42 Q34 40 36 42 Q34 44 30 42 Z" stroke="var(--tj-gold)" strokeWidth="0.5" fill="var(--tj-gold)" fillOpacity="0.2" />
      {/* Center dot */}
      <circle cx="30" cy="26" r="2.5" fill="var(--tj-gold)" opacity="0.5" />
    </svg>
  )
}
