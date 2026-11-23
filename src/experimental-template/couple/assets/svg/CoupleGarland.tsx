export function CoupleGarland({ style, className }: { style?: React.CSSProperties; className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 120 140"
      style={style}
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="cp-svg-garland-g" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#E0CFA0" />
          <stop offset="100%" stopColor="#C9A84C" stopOpacity="0.7" />
        </linearGradient>
      </defs>

      <g fill="none" stroke="url(#cp-svg-garland-g)" strokeLinecap="round" strokeLinejoin="round">
        {/* Mandap arch above */}
        <path d="M15 35 Q15 5 60 5 Q105 5 105 35" strokeWidth="0.8" opacity="0.4" />
        <path d="M20 35 Q20 12 60 12 Q100 12 100 35" strokeWidth="0.6" opacity="0.3" />
        {/* Mandap pillars */}
        <line x1="15" y1="35" x2="15" y2="120" strokeWidth="0.8" opacity="0.3" />
        <line x1="105" y1="35" x2="105" y2="120" strokeWidth="0.8" opacity="0.3" />
        {/* Pillar garland drapes */}
        <path d="M15 40 Q12 50 15 60 Q12 70 15 80" strokeWidth="0.4" opacity="0.3" />
        <path d="M105 40 Q108 50 105 60 Q108 70 105 80" strokeWidth="0.4" opacity="0.3" />

        {/* Bride — standing, placing garland */}
        <ellipse cx="48" cy="42" rx="8" ry="9.5" strokeWidth="1.2" />
        {/* Maang tikka */}
        <path d="M48 33 L48 30" strokeWidth="0.5" />
        <circle cx="48" cy="29" r="1" fill="#C9A84C" fillOpacity="0.3" stroke="none" />
        {/* Veil */}
        <path d="M40 38 Q34 42 32 55 Q30 65 33 75" strokeWidth="0.6" opacity="0.4" />
        {/* Torso */}
        <path d="M48 52 Q46 65 44 78" strokeWidth="1.2" />
        {/* Saree drape */}
        <path d="M44 78 Q35 95 30 115" strokeWidth="1" />
        <path d="M44 78 Q48 95 46 115" strokeWidth="1" />
        <path d="M30 115 Q38 118 46 115" strokeWidth="0.8" />

        {/* Bride arms — reaching up to place garland on groom */}
        <path d="M52 58 Q58 52 65 48" strokeWidth="1" />
        <path d="M44 58 Q40 54 38 50" strokeWidth="0.8" />

        {/* Groom — standing, head slightly bowed */}
        <ellipse cx="75" cy="40" rx="8" ry="9.5" strokeWidth="1.2" />
        {/* Sehra/headpiece */}
        <path d="M67 34 Q68 28 75 26 Q82 28 83 34" strokeWidth="0.8" />
        <path d="M67 34 L65 38 M69 34 L67 38 M71 34 L69 38" strokeWidth="0.3" opacity="0.4" />
        {/* Torso */}
        <path d="M75 50 Q76 65 78 78" strokeWidth="1.2" />
        {/* Sherwani bottom */}
        <path d="M78 78 Q74 95 72 115" strokeWidth="1" />
        <path d="M78 78 Q82 95 84 115" strokeWidth="1" />

        {/* Groom arms — at sides, slightly forward */}
        <path d="M70 55 Q64 60 60 62" strokeWidth="0.8" />
        <path d="M82 55 Q88 60 90 65" strokeWidth="0.8" />

        {/* THE GARLAND — jaimala between them */}
        <path
          d="M65 48 Q68 44 72 43 Q76 44 78 48 Q76 52 72 53 Q68 52 65 48"
          strokeWidth="0.8"
          fill="url(#cp-svg-garland-g)"
          fillOpacity="0.1"
        />
        {/* Garland flower details */}
        <circle cx="68" cy="45" r="1.2" fill="#C9A84C" fillOpacity="0.2" stroke="none" />
        <circle cx="72" cy="44" r="1.2" fill="#E0CFA0" fillOpacity="0.2" stroke="none" />
        <circle cx="76" cy="45" r="1.2" fill="#C9A84C" fillOpacity="0.2" stroke="none" />
        <circle cx="70" cy="48" r="1" fill="#E0CFA0" fillOpacity="0.15" stroke="none" />
        <circle cx="74" cy="48" r="1" fill="#E0CFA0" fillOpacity="0.15" stroke="none" />

        {/* Fire/agni in front */}
        <path d="M58 105 Q60 95 62 105 Q64 95 66 105" strokeWidth="0.6" opacity="0.5" />
        <path d="M60 108 Q62 100 64 108" strokeWidth="0.4" opacity="0.35" />
        <ellipse cx="62" cy="110" rx="8" ry="3" strokeWidth="0.5" opacity="0.3" />

        {/* Flower petals on ground */}
        <circle cx="40" cy="120" r="1" fill="#C9A84C" fillOpacity="0.15" stroke="none" />
        <circle cx="55" cy="122" r="0.8" fill="#E0CFA0" fillOpacity="0.12" stroke="none" />
        <circle cx="70" cy="122" r="0.8" fill="#E0CFA0" fillOpacity="0.12" stroke="none" />
        <circle cx="85" cy="120" r="1" fill="#C9A84C" fillOpacity="0.15" stroke="none" />
      </g>
    </svg>
  );
}
