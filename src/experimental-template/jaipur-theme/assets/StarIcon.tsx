interface StarIconProps {
  className?: string
  size?: number
}

export default function StarIcon({ className, size = 24 }: StarIconProps) {
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
      {/* 4-pointed star — two overlapping diamonds */}
      <path
        d="M12 2 L14.5 9.5 L22 12 L14.5 14.5 L12 22 L9.5 14.5 L2 12 L9.5 9.5 Z"
        fill="currentColor"
      />
      <circle cx="12" cy="12" r="1.5" fill="currentColor" opacity="0.6" />
    </svg>
  )
}
