interface Props {
  className?: string
  size?: number
  glow?: boolean
  stars?: number
}

export default function CrescentMoon({ className, size = 48, glow = false, stars = 1 }: Props) {
  const filterId = 'tj-moon-glow-filter'

  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {glow && (
        <defs>
          <filter id={filterId} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="3" />
          </filter>
        </defs>
      )}
      {/* Glow layer behind crescent */}
      {glow && (
        <path
          d="M30 6C18.95 6 10 14.95 10 26s8.95 20 20 20c4.9 0 9.4-1.77 12.87-4.7A22 22 0 0126 44C14.95 44 6 35.05 6 24S14.95 4 26 4c1.37 0 2.71.13 4 .37A19.9 19.9 0 0030 6z"
          fill="var(--tj-gold-light)"
          opacity="0.15"
          filter={`url(#${filterId})`}
        />
      )}
      {/* Crescent */}
      <path
        d="M30 6C18.95 6 10 14.95 10 26s8.95 20 20 20c4.9 0 9.4-1.77 12.87-4.7A22 22 0 0126 44C14.95 44 6 35.05 6 24S14.95 4 26 4c1.37 0 2.71.13 4 .37A19.9 19.9 0 0030 6z"
        fill="var(--tj-gold)"
        opacity="0.85"
      />
      {/* Stars — rendered based on count */}
      {stars >= 1 && (
        <polygon
          points="38,14 39.5,18 43.5,18 40.2,20.8 41.4,25 38,22.2 34.6,25 35.8,20.8 32.5,18 36.5,18"
          fill="var(--tj-gold)"
          opacity="0.85"
        />
      )}
      {stars >= 2 && (
        <polygon
          points="42,30 43,33 46,33 43.5,35 44.3,38 42,36 39.7,38 40.5,35 38,33 41,33"
          fill="var(--tj-gold)"
          opacity="0.7"
        />
      )}
      {stars >= 3 && (
        <polygon
          points="34,36 35,38.5 37.5,38.5 35.5,40.2 36.2,42.5 34,41 31.8,42.5 32.5,40.2 30.5,38.5 33,38.5"
          fill="var(--tj-gold)"
          opacity="0.6"
        />
      )}
    </svg>
  )
}
