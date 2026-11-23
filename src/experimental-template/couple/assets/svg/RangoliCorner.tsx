export function RangoliCorner({ style, className }: { style?: React.CSSProperties; className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 200 200"
      style={style}
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="cp-svg-rangoli-g" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#E0CFA0" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#C9A84C" stopOpacity="0.5" />
        </linearGradient>
      </defs>

      <g fill="none" stroke="url(#cp-svg-rangoli-g)">
        {/* Curved vine from corner */}
        <path
          d="M0,0 Q40,10 60,50 Q70,80 60,120 Q55,140 40,160"
          strokeWidth="0.6"
          opacity="0.6"
        />
        <path
          d="M0,0 Q10,40 50,60 Q80,70 120,60 Q140,55 160,40"
          strokeWidth="0.6"
          opacity="0.6"
        />

        {/* Paisley on vertical vine */}
        <path
          d="M50,55 Q42,40 55,30 Q68,40 60,55 Q55,50 50,55Z"
          fill="url(#cp-svg-rangoli-g)"
          fillOpacity="0.1"
          strokeWidth="0.4"
        />
        <path
          d="M52,100 Q44,85 55,76 Q66,85 58,100 Q55,95 52,100Z"
          fill="url(#cp-svg-rangoli-g)"
          fillOpacity="0.08"
          strokeWidth="0.3"
        />

        {/* Paisley on horizontal vine */}
        <path
          d="M55,50 Q40,42 30,55 Q40,68 55,60 Q50,55 55,50Z"
          fill="url(#cp-svg-rangoli-g)"
          fillOpacity="0.1"
          strokeWidth="0.4"
        />
        <path
          d="M100,52 Q85,44 76,55 Q85,66 100,58 Q95,55 100,52Z"
          fill="url(#cp-svg-rangoli-g)"
          fillOpacity="0.08"
          strokeWidth="0.3"
        />

        {/* Lotus cluster at curve peak */}
        <g transform="translate(60,60)">
          {Array.from({ length: 6 }).map((_, i) => (
            <path
              key={i}
              d={`M0,-12 Q5,-7 0,0 Q-5,-7 0,-12Z`}
              transform={`rotate(${i * 60})`}
              fill="url(#cp-svg-rangoli-g)"
              fillOpacity="0.12"
              strokeWidth="0.3"
            />
          ))}
          <circle r="3" fill="#C9A84C" fillOpacity="0.15" strokeWidth="0.3" />
        </g>

        {/* Dot trails along vines */}
        <circle cx="25" cy="25" r="1.5" fill="#C9A84C" fillOpacity="0.2" stroke="none" />
        <circle cx="38" cy="38" r="1" fill="#E0CFA0" fillOpacity="0.25" stroke="none" />
        <circle cx="65" cy="85" r="1.2" fill="#C9A84C" fillOpacity="0.2" stroke="none" />
        <circle cx="85" cy="65" r="1.2" fill="#C9A84C" fillOpacity="0.2" stroke="none" />
        <circle cx="45" cy="135" r="1" fill="#E0CFA0" fillOpacity="0.15" stroke="none" />
        <circle cx="135" cy="45" r="1" fill="#E0CFA0" fillOpacity="0.15" stroke="none" />

        {/* Small leaf shapes */}
        <path d="M30,30 Q35,25 40,30 Q35,32 30,30Z" fill="#C9A84C" fillOpacity="0.1" strokeWidth="0.2" />
        <path d="M70,90 Q75,85 80,90 Q75,92 70,90Z" fill="#C9A84C" fillOpacity="0.08" strokeWidth="0.2" />
        <path d="M90,70 Q95,65 100,70 Q95,72 90,70Z" fill="#C9A84C" fillOpacity="0.08" strokeWidth="0.2" />
      </g>
    </svg>
  );
}
