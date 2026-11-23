interface FloralCornerProps {
  className?: string
}

export default function FloralCorner({ className }: FloralCornerProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 60 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Main vine — curving from corner inward */}
      <path
        d="M2 2 Q8 8 14 16 Q18 24 24 30 Q28 34 34 36 Q38 37 42 36"
        stroke="var(--jt-rose-gold, #B76E79)"
        strokeWidth="0.8"
        opacity="0.25"
        strokeLinecap="round"
      />

      {/* Leaf 1 — near the start of the vine */}
      <path
        d="M10 12 Q6 8 10 5 Q14 8 10 12"
        fill="var(--jt-sandstone, #C4956A)"
        opacity="0.12"
        stroke="var(--jt-rose-gold, #B76E79)"
        strokeWidth="0.3"
        strokeOpacity="0.2"
      />
      {/* Leaf 1 midvein */}
      <line x1="10" y1="12" x2="10" y2="5.5" stroke="var(--jt-rose-gold, #B76E79)" strokeWidth="0.2" opacity="0.15" />

      {/* Leaf 2 — mid-vine, curving right */}
      <path
        d="M20 24 Q24 18 28 22 Q24 26 20 24"
        fill="var(--jt-sandstone, #C4956A)"
        opacity="0.1"
        stroke="var(--jt-rose-gold, #B76E79)"
        strokeWidth="0.3"
        strokeOpacity="0.2"
      />
      <line x1="20" y1="24" x2="27" y2="22" stroke="var(--jt-rose-gold, #B76E79)" strokeWidth="0.2" opacity="0.12" />

      {/* Leaf 3 — further along, curving down-left */}
      <path
        d="M30 34 Q26 30 30 27 Q34 30 30 34"
        fill="var(--jt-sandstone, #C4956A)"
        opacity="0.1"
        stroke="var(--jt-rose-gold, #B76E79)"
        strokeWidth="0.3"
        strokeOpacity="0.18"
      />
      <line x1="30" y1="34" x2="30" y2="27.5" stroke="var(--jt-rose-gold, #B76E79)" strokeWidth="0.2" opacity="0.12" />

      {/* Small 5-petal flower at vine end */}
      {[0, 72, 144, 216, 288].map((angle) => (
        <path
          key={`petal-${angle}`}
          d="M42 36 Q40.5 33 42 31 Q43.5 33 42 36"
          fill="var(--jt-rose-gold, #B76E79)"
          opacity="0.2"
          transform={`rotate(${angle} 42 36)`}
        />
      ))}
      <circle cx="42" cy="36" r="1.2" fill="var(--jt-gold, #D4A853)" opacity="0.3" />

      {/* Spiral tendril 1 — branching near leaf 1 */}
      <path
        d="M12 14 Q16 14 18 12 Q19 10 18 8"
        stroke="var(--jt-rose-gold, #B76E79)"
        strokeWidth="0.4"
        opacity="0.15"
        fill="none"
        strokeLinecap="round"
      />

      {/* Spiral tendril 2 — branching near leaf 2 */}
      <path
        d="M22 28 Q18 30 16 34 Q15 36 16 38"
        stroke="var(--jt-rose-gold, #B76E79)"
        strokeWidth="0.4"
        opacity="0.15"
        fill="none"
        strokeLinecap="round"
      />

      {/* Spiral tendril 3 — near the flower */}
      <path
        d="M38 38 Q36 42 38 44 Q40 45 42 44"
        stroke="var(--jt-rose-gold, #B76E79)"
        strokeWidth="0.35"
        opacity="0.12"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  )
}
