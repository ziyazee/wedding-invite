export function CoupleDance({ style, className }: { style?: React.CSSProperties; className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 120 140"
      style={style}
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="cp-svg-dance-g" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#E0CFA0" />
          <stop offset="100%" stopColor="#C9A84C" stopOpacity="0.7" />
        </linearGradient>
      </defs>

      <g fill="none" stroke="url(#cp-svg-dance-g)" strokeLinecap="round" strokeLinejoin="round">
        {/* Bride — dancing pose, leaning back */}
        <ellipse cx="45" cy="24" rx="8.5" ry="10" strokeWidth="1.2" />
        <path d="M45 15 Q44 10 46 8" strokeWidth="0.8" />
        {/* Torso leaning */}
        <path d="M45 34 Q40 50 38 65" strokeWidth="1.2" />
        {/* Lehenga flare */}
        <path d="M38 65 Q25 85 20 110" strokeWidth="1" />
        <path d="M38 65 Q42 85 40 110" strokeWidth="1" />
        <path d="M20 110 Q30 114 40 110" strokeWidth="0.8" />
        {/* Ghagra swirl lines */}
        <path d="M25 90 Q30 88 35 90" strokeWidth="0.4" opacity="0.5" />
        <path d="M22 100 Q28 97 34 100" strokeWidth="0.4" opacity="0.4" />

        {/* Bride arm raised — classical dance mudra */}
        <path d="M40 42 Q32 35 28 28" strokeWidth="1" />
        <path d="M28 28 L25 25 M28 28 L26 30" strokeWidth="0.6" />
        {/* Other arm extended */}
        <path d="M48 40 Q55 38 62 42" strokeWidth="1" />

        {/* Dupatta flowing */}
        <path d="M37 22 Q28 30 24 45 Q22 55 25 70" strokeWidth="0.5" opacity="0.4" />

        {/* Anklets */}
        <circle cx="22" cy="110" r="2" strokeWidth="0.4" strokeDasharray="1 1" opacity="0.5" />
        <circle cx="38" cy="110" r="2" strokeWidth="0.4" strokeDasharray="1 1" opacity="0.5" />

        {/* Groom — dancing, arms wide */}
        <ellipse cx="78" cy="24" rx="8.5" ry="10" strokeWidth="1.2" />
        {/* Turban/pagdi */}
        <path d="M70 18 Q72 10 78 8 Q84 10 86 18" strokeWidth="0.8" />
        <path d="M78 8 Q79 5 82 6" strokeWidth="0.5" />
        {/* Torso */}
        <path d="M78 34 Q80 50 82 65" strokeWidth="1.2" />
        {/* Kurta bottom */}
        <path d="M82 65 Q78 85 75 110" strokeWidth="1" />
        <path d="M82 65 Q86 85 90 110" strokeWidth="1" />

        {/* Groom arm raised high */}
        <path d="M84 40 Q92 32 96 24" strokeWidth="1" />
        <path d="M96 24 L98 21 M96 24 L99 25" strokeWidth="0.6" />
        {/* Other arm reaching to bride */}
        <path d="M73 42 Q67 40 62 42" strokeWidth="1" />

        {/* Hands meeting in the middle */}
        <circle cx="62" cy="42" r="2" strokeWidth="0.5" fill="url(#cp-svg-dance-g)" fillOpacity="0.1" />

        {/* Musical notes floating */}
        <path d="M95 15 Q97 12 96 9 L96 6" strokeWidth="0.5" opacity="0.4" />
        <circle cx="96" cy="9" r="1.5" strokeWidth="0.4" opacity="0.4" />
        <path d="M102 20 Q104 17 103 14 L103 11" strokeWidth="0.5" opacity="0.3" />
        <circle cx="103" cy="14" r="1.2" strokeWidth="0.4" opacity="0.3" />
        <path d="M18 18 Q16 15 17 12 L17 9" strokeWidth="0.5" opacity="0.3" />
        <circle cx="17" cy="12" r="1.2" strokeWidth="0.4" opacity="0.3" />

        {/* Floor decoration */}
        <circle cx="60" cy="118" r="1" fill="#C9A84C" fillOpacity="0.2" stroke="none" />
        <circle cx="50" cy="120" r="0.8" fill="#E0CFA0" fillOpacity="0.15" stroke="none" />
        <circle cx="70" cy="120" r="0.8" fill="#E0CFA0" fillOpacity="0.15" stroke="none" />
      </g>
    </svg>
  );
}
