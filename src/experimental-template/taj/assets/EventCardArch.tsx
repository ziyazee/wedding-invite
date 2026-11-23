interface Props {
  className?: string
  highlight?: boolean
}

export default function EventCardArch({ className, highlight }: Props) {
  const strokeColor = 'var(--tj-gold)'
  const strokeW = highlight ? 2 : 1

  return (
    <svg
      className={className}
      viewBox="0 0 354 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
    >
      {/* Pointed arch spanning the card width */}
      <path
        d="M0 60 V30 Q0 10 80 5 Q140 0 177 0 Q214 0 274 5 Q354 10 354 30 V60"
        stroke={strokeColor}
        strokeWidth={strokeW}
        fill="var(--tj-navy-mid)"
        fillOpacity="0.5"
      />
      {/* Inner decorative arch line */}
      <path
        d="M20 60 V35 Q20 18 90 12 Q145 8 177 8 Q209 8 264 12 Q334 18 334 35 V60"
        stroke={strokeColor}
        strokeWidth="0.5"
        fill="none"
        opacity="0.3"
      />
      {/* Keystone ornament at apex */}
      <circle cx="177" cy="8" r="3" fill={strokeColor} opacity="0.5" />
      <circle cx="177" cy="8" r="1.5" fill={strokeColor} opacity="0.8" />
    </svg>
  )
}
