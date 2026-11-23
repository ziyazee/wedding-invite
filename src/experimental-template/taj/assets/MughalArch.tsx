interface Props {
  className?: string
}

export default function MughalArch({ className }: Props) {
  return (
    <svg
      className={className}
      viewBox="0 0 400 500"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Outer arch frame — pointed apex via two quadratic curves meeting at a point */}
      <path
        d="M40 500 V200 Q40 100 120 50 L200 15 L280 50 Q360 100 360 200 V500"
        stroke="var(--tj-gold)"
        strokeWidth="2"
        fill="none"
        className="tj-arch-path"
      />
      {/* Inner arch */}
      <path
        d="M65 500 V210 Q65 120 135 75 L200 45 L265 75 Q335 120 335 210 V500"
        stroke="var(--tj-gold)"
        strokeWidth="1"
        fill="none"
        opacity="0.5"
      />
      {/* Keystone ornament at apex */}
      <circle cx="200" cy="22" r="6" fill="var(--tj-gold)" opacity="0.4" />
      <circle cx="200" cy="22" r="3" fill="var(--tj-gold)" opacity="0.7" />
      {/* Side filigree lines */}
      <line x1="52" y1="220" x2="52" y2="460" stroke="var(--tj-gold)" strokeWidth="0.5" opacity="0.25" />
      <line x1="348" y1="220" x2="348" y2="460" stroke="var(--tj-gold)" strokeWidth="0.5" opacity="0.25" />
    </svg>
  )
}
