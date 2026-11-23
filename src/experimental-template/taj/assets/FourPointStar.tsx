interface Props {
  className?: string
  size?: number
}

export default function FourPointStar({ className, size = 16 }: Props) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Four elongated points radiating from center */}
      <path
        d="M12 0 L13.5 9.5 L24 12 L13.5 14.5 L12 24 L10.5 14.5 L0 12 L10.5 9.5 Z"
        fill="var(--tj-gold)"
      />
      {/* Bright center dot */}
      <circle cx="12" cy="12" r="2" fill="var(--tj-highlight)" />
    </svg>
  )
}
