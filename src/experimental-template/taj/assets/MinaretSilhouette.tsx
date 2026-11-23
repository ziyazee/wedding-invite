interface Props {
  className?: string
}

export default function MinaretSilhouette({ className }: Props) {
  return (
    <svg
      className={className}
      viewBox="0 0 80 300"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Dome top */}
      <path
        d="M40 10 Q20 30 30 50 L30 60 L50 60 L50 50 Q60 30 40 10Z"
        fill="var(--tj-gold)"
        opacity="0.15"
      />
      {/* Finial */}
      <line x1="40" y1="0" x2="40" y2="12" stroke="var(--tj-gold)" strokeWidth="1.5" opacity="0.4" />
      <circle cx="40" cy="4" r="2" fill="var(--tj-gold)" opacity="0.4" />
      {/* Tower body */}
      <rect x="32" y="60" width="16" height="200" fill="var(--tj-gold)" opacity="0.08" />
      <rect x="30" y="60" width="20" height="4" fill="var(--tj-gold)" opacity="0.15" />
      {/* Balcony rings */}
      <rect x="28" y="100" width="24" height="3" rx="1" fill="var(--tj-gold)" opacity="0.12" />
      <rect x="28" y="160" width="24" height="3" rx="1" fill="var(--tj-gold)" opacity="0.12" />
      <rect x="28" y="220" width="24" height="3" rx="1" fill="var(--tj-gold)" opacity="0.12" />
      {/* Base */}
      <rect x="24" y="260" width="32" height="40" fill="var(--tj-gold)" opacity="0.1" />
    </svg>
  )
}
