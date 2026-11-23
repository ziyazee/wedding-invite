/* Kerala Dawn -- Elephant Procession (Kudamattam)
   Three ceremonial elephants with parasols and nettipattam.
   Center elephant is largest, flanking elephants slightly smaller.
   Used as a prominent section divider between Couple and Countdown. */

interface ElephantProcessionProps {
  className?: string
}

export default function ElephantProcession({ className }: ElephantProcessionProps) {
  return (
    <svg
      className={`kd-procession ${className || ''}`}
      viewBox="0 0 360 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      role="presentation"
    >
      {/* ===== Left elephant -- smaller, facing right ===== */}
      <g className="kd-procession__left" transform="translate(20, 20) scale(0.75)">
        {/* Parasol (kudamattam) */}
        <ellipse cx="40" cy="6" rx="30" ry="6" fill="var(--kd-lamp-gold)" opacity="0.18" />
        <line x1="40" y1="6" x2="40" y2="22" stroke="var(--kd-lamp-gold)" strokeWidth="1" opacity="0.2" />
        {/* Parasol fringe */}
        {[14, 20, 26, 32, 38, 44, 50, 56, 62, 66].map(x => (
          <line key={x} x1={x} y1="11" x2={x} y2="15" stroke="var(--kd-lamp-gold)" strokeWidth="0.4" opacity="0.12" />
        ))}
        {/* Body */}
        <path d="M18 65 C18 50, 22 38, 28 30 L34 28 L50 26 C58 28, 62 38, 62 52 L62 65 Z" fill="var(--kd-lamp-gold)" opacity="0.15" />
        {/* Head */}
        <path d="M24 30 C24 22, 28 16, 34 15 C40 14, 44 17, 45 22 L44 28 L26 30 Z" fill="var(--kd-lamp-gold)" opacity="0.18" />
        {/* Trunk raised */}
        <path d="M26 28 C22 29, 18 28, 16 24 C14 20, 14 15, 15 12" stroke="var(--kd-lamp-gold)" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.15" />
        {/* Nettipattam */}
        <path d="M26 16 L34 8 L42 16" fill="var(--kd-lamp-gold)" opacity="0.22" />
        <circle cx="34" cy="9" r="2.5" fill="var(--kd-lamp-gold)" opacity="0.2" />
        <circle cx="28" cy="14" r="1.2" fill="var(--kd-lamp-gold)" opacity="0.15" />
        <circle cx="40" cy="14" r="1.2" fill="var(--kd-lamp-gold)" opacity="0.15" />
        {/* Caparison */}
        <rect x="34" y="28" width="26" height="14" rx="1" fill="var(--kd-lamp-gold)" opacity="0.1" />
        <line x1="34" y1="32" x2="60" y2="32" stroke="var(--kd-lamp-gold)" strokeWidth="0.5" opacity="0.12" />
        <line x1="34" y1="36" x2="60" y2="36" stroke="var(--kd-lamp-gold)" strokeWidth="0.5" opacity="0.12" />
        {/* Legs */}
        <rect x="22" y="65" width="6" height="12" rx="1.5" fill="var(--kd-lamp-gold)" opacity="0.15" />
        <rect x="32" y="66" width="6" height="11" rx="1.5" fill="var(--kd-lamp-gold)" opacity="0.12" />
        <rect x="46" y="66" width="6" height="11" rx="1.5" fill="var(--kd-lamp-gold)" opacity="0.12" />
        <rect x="54" y="65" width="6" height="12" rx="1.5" fill="var(--kd-lamp-gold)" opacity="0.15" />
        {/* Tail */}
        <path d="M62 52 C64 48, 66 44, 64 40" stroke="var(--kd-lamp-gold)" strokeWidth="1" strokeLinecap="round" fill="none" opacity="0.1" />
        {/* Bell */}
        <circle cx="30" cy="52" r="2" stroke="var(--kd-lamp-gold)" strokeWidth="0.5" fill="none" opacity="0.12" />
      </g>

      {/* ===== Center elephant -- largest, most prominent ===== */}
      <g className="kd-procession__center" transform="translate(120, 4)">
        {/* Large parasol */}
        <ellipse cx="50" cy="4" rx="40" ry="8" fill="var(--kd-lamp-gold)" opacity="0.22" />
        <line x1="50" y1="4" x2="50" y2="22" stroke="var(--kd-lamp-gold)" strokeWidth="1.2" opacity="0.25" />
        {/* Parasol fringe */}
        {[14, 22, 30, 38, 46, 54, 62, 70, 78, 86].map(x => (
          <line key={x} x1={x} y1="11" x2={x} y2="16" stroke="var(--kd-lamp-gold)" strokeWidth="0.5" opacity="0.15" />
        ))}
        {/* Parasol ornament */}
        <circle cx="50" cy="2" r="2" fill="var(--kd-lamp-gold)" opacity="0.3" />

        {/* Body -- large */}
        <path d="M22 72 C22 55, 26 42, 34 32 L38 30 L58 28 C66 30, 72 42, 72 58 L72 72 Z" fill="var(--kd-lamp-gold)" opacity="0.2" />
        {/* Head */}
        <path d="M28 32 C28 24, 32 18, 38 16 C44 15, 50 18, 52 24 L50 30 L30 32 Z" fill="var(--kd-lamp-gold)" opacity="0.25" />
        {/* Trunk raised */}
        <path d="M30 30 C26 32, 22 30, 18 26 C14 20, 14 14, 16 10" stroke="var(--kd-lamp-gold)" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.2" />
        {/* Tusk */}
        <path d="M28 28 L22 34 L24 35" fill="var(--kd-lamp-gold)" opacity="0.15" />
        {/* Eye */}
        <circle cx="36" cy="22" r="1.2" fill="var(--kd-teal-black, #0A1F1C)" opacity="0.5" />

        {/* Nettipattam -- large and ornate */}
        <path d="M30 18 L38 8 L48 18" fill="var(--kd-lamp-gold)" opacity="0.3" />
        <circle cx="38" cy="9" r="3" fill="var(--kd-lamp-gold)" opacity="0.28" />
        <circle cx="38" cy="9" r="1.5" fill="var(--kd-lamp-gold)" opacity="0.15" />
        <circle cx="32" cy="16" r="1.5" fill="var(--kd-lamp-gold)" opacity="0.2" />
        <circle cx="46" cy="16" r="1.5" fill="var(--kd-lamp-gold)" opacity="0.2" />
        <circle cx="38" cy="13" r="1" fill="var(--kd-lamp-gold)" opacity="0.18" />

        {/* Caparison with detail bands */}
        <rect x="40" y="30" width="30" height="18" rx="1.5" fill="var(--kd-lamp-gold)" opacity="0.12" />
        <line x1="40" y1="35" x2="70" y2="35" stroke="var(--kd-lamp-gold)" strokeWidth="0.6" opacity="0.15" />
        <line x1="40" y1="40" x2="70" y2="40" stroke="var(--kd-lamp-gold)" strokeWidth="0.6" opacity="0.15" />
        <line x1="40" y1="45" x2="70" y2="45" stroke="var(--kd-lamp-gold)" strokeWidth="0.6" opacity="0.15" />
        {/* Caparison fringe */}
        {[42, 46, 50, 54, 58, 62, 66].map(x => (
          <line key={x} x1={x} y1="48" x2={x} y2="52" stroke="var(--kd-lamp-gold)" strokeWidth="0.4" opacity="0.1" />
        ))}

        {/* Legs */}
        <rect x="26" y="72" width="7" height="14" rx="2" fill="var(--kd-lamp-gold)" opacity="0.2" />
        <rect x="36" y="73" width="7" height="13" rx="2" fill="var(--kd-lamp-gold)" opacity="0.16" />
        <rect x="54" y="73" width="7" height="13" rx="2" fill="var(--kd-lamp-gold)" opacity="0.16" />
        <rect x="64" y="72" width="7" height="14" rx="2" fill="var(--kd-lamp-gold)" opacity="0.2" />

        {/* Tail */}
        <path d="M72 56 C75 52, 76 46, 74 42" stroke="var(--kd-lamp-gold)" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.12" />

        {/* Bell */}
        <circle cx="34" cy="58" r="2.5" stroke="var(--kd-lamp-gold)" strokeWidth="0.6" fill="none" opacity="0.15" />
        <circle cx="34" cy="59.5" r="0.8" fill="var(--kd-lamp-gold)" opacity="0.1" />
      </g>

      {/* ===== Right elephant -- smaller, mirrored ===== */}
      <g className="kd-procession__right" transform="translate(284, 20) scale(-0.75, 0.75)">
        {/* Parasol */}
        <ellipse cx="40" cy="6" rx="30" ry="6" fill="var(--kd-lamp-gold)" opacity="0.18" />
        <line x1="40" y1="6" x2="40" y2="22" stroke="var(--kd-lamp-gold)" strokeWidth="1" opacity="0.2" />
        {[14, 20, 26, 32, 38, 44, 50, 56, 62, 66].map(x => (
          <line key={x} x1={x} y1="11" x2={x} y2="15" stroke="var(--kd-lamp-gold)" strokeWidth="0.4" opacity="0.12" />
        ))}
        {/* Body */}
        <path d="M18 65 C18 50, 22 38, 28 30 L34 28 L50 26 C58 28, 62 38, 62 52 L62 65 Z" fill="var(--kd-lamp-gold)" opacity="0.15" />
        {/* Head */}
        <path d="M24 30 C24 22, 28 16, 34 15 C40 14, 44 17, 45 22 L44 28 L26 30 Z" fill="var(--kd-lamp-gold)" opacity="0.18" />
        {/* Trunk */}
        <path d="M26 28 C22 29, 18 28, 16 24 C14 20, 14 15, 15 12" stroke="var(--kd-lamp-gold)" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.15" />
        {/* Nettipattam */}
        <path d="M26 16 L34 8 L42 16" fill="var(--kd-lamp-gold)" opacity="0.22" />
        <circle cx="34" cy="9" r="2.5" fill="var(--kd-lamp-gold)" opacity="0.2" />
        <circle cx="28" cy="14" r="1.2" fill="var(--kd-lamp-gold)" opacity="0.15" />
        <circle cx="40" cy="14" r="1.2" fill="var(--kd-lamp-gold)" opacity="0.15" />
        {/* Caparison */}
        <rect x="34" y="28" width="26" height="14" rx="1" fill="var(--kd-lamp-gold)" opacity="0.1" />
        <line x1="34" y1="32" x2="60" y2="32" stroke="var(--kd-lamp-gold)" strokeWidth="0.5" opacity="0.12" />
        <line x1="34" y1="36" x2="60" y2="36" stroke="var(--kd-lamp-gold)" strokeWidth="0.5" opacity="0.12" />
        {/* Legs */}
        <rect x="22" y="65" width="6" height="12" rx="1.5" fill="var(--kd-lamp-gold)" opacity="0.15" />
        <rect x="32" y="66" width="6" height="11" rx="1.5" fill="var(--kd-lamp-gold)" opacity="0.12" />
        <rect x="46" y="66" width="6" height="11" rx="1.5" fill="var(--kd-lamp-gold)" opacity="0.12" />
        <rect x="54" y="65" width="6" height="12" rx="1.5" fill="var(--kd-lamp-gold)" opacity="0.15" />
        {/* Tail */}
        <path d="M62 52 C64 48, 66 44, 64 40" stroke="var(--kd-lamp-gold)" strokeWidth="1" strokeLinecap="round" fill="none" opacity="0.1" />
        {/* Bell */}
        <circle cx="30" cy="52" r="2" stroke="var(--kd-lamp-gold)" strokeWidth="0.5" fill="none" opacity="0.12" />
      </g>

      {/* Ground line -- subtle */}
      <line x1="10" y1="92" x2="350" y2="92" stroke="var(--kd-lamp-gold)" strokeWidth="0.5" opacity="0.06" />

      {/* Decorative dots along ground */}
      {[40, 80, 120, 160, 200, 240, 280, 320].map(x => (
        <circle key={x} cx={x} cy="96" r="1" fill="var(--kd-lamp-gold)" opacity="0.08" />
      ))}
    </svg>
  )
}
