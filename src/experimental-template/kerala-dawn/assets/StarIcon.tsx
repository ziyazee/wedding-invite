/* Kerala Dawn — Four-Pointed Star (Touch CTA indicator) */

interface StarIconProps {
  className?: string
  size?: number
  color?: string
  style?: React.CSSProperties
}

export default function StarIcon({
  className,
  size = 24,
  color = 'var(--kd-kasavu-light)',
  style,
}: StarIconProps) {
  return (
    <svg
      className={className}
      style={style}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={color}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      role="presentation"
    >
      {/* Four-pointed star with slightly concave edges */}
      <path
        d="M12 0 C12.8 5, 13.5 8, 16 9.5 C19 10.8 22 11.2 24 12
           C22 12.8 19 13.2 16 14.5 C13.5 16 12.8 19 12 24
           C11.2 19 10.5 16 8 14.5 C5 13.2 2 12.8 0 12
           C2 11.2 5 10.8 8 9.5 C10.5 8 11.2 5 12 0Z"
      />
    </svg>
  )
}
