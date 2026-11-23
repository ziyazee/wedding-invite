interface DiwaLampProps {
  className?: string
}

export default function DiwaLamp({ className }: DiwaLampProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Flame glow halo */}
      <circle cx="12" cy="8" r="5" fill="var(--jt-rose-gold-light, #D4929B)" opacity="0.08" />

      {/* Teardrop flame */}
      <path
        d="M12 3 Q9.5 6 10 8.5 Q10.5 10 12 10.5 Q13.5 10 14 8.5 Q14.5 6 12 3"
        fill="var(--jt-rose-gold-light, #D4929B)"
        opacity="0.5"
      />
      {/* Flame inner core */}
      <path
        d="M12 5 Q10.8 7 11 8.5 Q11.5 9.5 12 9.5 Q12.5 9.5 13 8.5 Q13.2 7 12 5"
        fill="var(--jt-gold, #D4A853)"
        opacity="0.6"
      />

      {/* Oil bowl — oval */}
      <ellipse
        cx="12" cy="14"
        rx="6" ry="3"
        fill="var(--jt-gold, #D4A853)"
        opacity="0.3"
        stroke="var(--jt-gold, #D4A853)"
        strokeWidth="0.5"
        strokeOpacity="0.4"
      />
      {/* Oil surface line */}
      <ellipse
        cx="12" cy="13"
        rx="4.5" ry="1.5"
        fill="var(--jt-gold-warm, #C5964A)"
        opacity="0.15"
      />

      {/* Wick base */}
      <line x1="12" y1="11" x2="12" y2="10.5" stroke="var(--jt-sandstone, #C4956A)" strokeWidth="0.5" opacity="0.3" />

      {/* Pedestal stem */}
      <line x1="12" y1="17" x2="12" y2="24" stroke="var(--jt-gold, #D4A853)" strokeWidth="1" opacity="0.3" strokeLinecap="round" />

      {/* Pedestal base */}
      <ellipse
        cx="12" cy="25"
        rx="4.5" ry="1.5"
        fill="var(--jt-gold, #D4A853)"
        opacity="0.2"
        stroke="var(--jt-gold, #D4A853)"
        strokeWidth="0.4"
        strokeOpacity="0.3"
      />
      {/* Base ring detail */}
      <ellipse
        cx="12" cy="26"
        rx="3.5" ry="1"
        stroke="var(--jt-gold, #D4A853)"
        strokeWidth="0.3"
        fill="none"
        opacity="0.15"
      />
    </svg>
  )
}
