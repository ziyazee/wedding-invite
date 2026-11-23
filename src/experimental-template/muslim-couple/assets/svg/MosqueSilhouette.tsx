import React from 'react';

interface SvgProps {
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Simplified mosque silhouette with central dome and two minarets.
 * Used in Closing section as a large background element at 10% opacity.
 * Clean geometric outline — no interior detail.
 * viewBox: 320x200 (scales to 80% of viewport width).
 */
const MosqueSilhouette: React.FC<SvgProps> = ({ className, style }) => (
  <svg
    viewBox="0 0 320 200"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={style}
    aria-hidden="true"
  >
    {/* Ground line */}
    <line x1="0" y1="200" x2="320" y2="200" stroke="currentColor" strokeWidth="1" opacity="0.5" />

    {/* Left minaret */}
    <rect x="40" y="60" width="16" height="140" fill="currentColor" opacity="0.8" />
    {/* Left minaret balcony */}
    <rect x="36" y="80" width="24" height="4" rx="1" fill="currentColor" opacity="0.6" />
    <rect x="36" y="120" width="24" height="4" rx="1" fill="currentColor" opacity="0.6" />
    {/* Left minaret dome (cupola) */}
    <path d="M40,60 Q48,44 56,60" fill="currentColor" opacity="0.8" />
    {/* Left minaret finial */}
    <line x1="48" y1="44" x2="48" y2="38" stroke="currentColor" strokeWidth="1.5" />
    <circle cx="48" cy="36" r="2" fill="currentColor" opacity="0.6" />

    {/* Right minaret */}
    <rect x="264" y="60" width="16" height="140" fill="currentColor" opacity="0.8" />
    {/* Right minaret balcony */}
    <rect x="260" y="80" width="24" height="4" rx="1" fill="currentColor" opacity="0.6" />
    <rect x="260" y="120" width="24" height="4" rx="1" fill="currentColor" opacity="0.6" />
    {/* Right minaret dome */}
    <path d="M264,60 Q272,44 280,60" fill="currentColor" opacity="0.8" />
    {/* Right minaret finial */}
    <line x1="272" y1="44" x2="272" y2="38" stroke="currentColor" strokeWidth="1.5" />
    <circle cx="272" cy="36" r="2" fill="currentColor" opacity="0.6" />

    {/* Main body / base structure */}
    <rect x="56" y="120" width="208" height="80" fill="currentColor" opacity="0.5" />

    {/* Central large dome — bulbous Mughal style */}
    <path
      d="M110,120 Q110,90 130,70 Q145,52 160,42 Q175,52 190,70 Q210,90 210,120"
      fill="currentColor"
      opacity="0.7"
    />
    {/* Dome drum (cylindrical base) */}
    <rect x="118" y="112" width="84" height="12" rx="2" fill="currentColor" opacity="0.6" />
    {/* Dome finial (lotus bud + spire) */}
    <line x1="160" y1="42" x2="160" y2="28" stroke="currentColor" strokeWidth="2" />
    <circle cx="160" cy="26" r="3" fill="currentColor" opacity="0.7" />
    <path d="M157,30 Q160,24 163,30" fill="currentColor" opacity="0.5" />

    {/* Left small dome */}
    <path
      d="M70,120 Q70,105 85,95 Q100,105 100,120"
      fill="currentColor"
      opacity="0.5"
    />
    {/* Left small dome finial */}
    <line x1="85" y1="95" x2="85" y2="90" stroke="currentColor" strokeWidth="1" />
    <circle cx="85" cy="89" r="1.5" fill="currentColor" opacity="0.5" />

    {/* Right small dome */}
    <path
      d="M220,120 Q220,105 235,95 Q250,105 250,120"
      fill="currentColor"
      opacity="0.5"
    />
    {/* Right small dome finial */}
    <line x1="235" y1="95" x2="235" y2="90" stroke="currentColor" strokeWidth="1" />
    <circle cx="235" cy="89" r="1.5" fill="currentColor" opacity="0.5" />

    {/* Central entrance arch (iwan) */}
    <path
      d="M140,200 L140,155 Q140,145 150,138 Q155,135 160,134 Q165,135 170,138 Q180,145 180,155 L180,200"
      stroke="currentColor"
      strokeWidth="1.5"
      fill="currentColor"
      fillOpacity="0.3"
    />

    {/* Small side arches */}
    <path
      d="M80,200 L80,170 Q80,162 90,158 Q100,162 100,170 L100,200"
      stroke="currentColor"
      strokeWidth="0.8"
      fill="currentColor"
      fillOpacity="0.2"
    />
    <path
      d="M220,200 L220,170 Q220,162 230,158 Q240,162 240,170 L240,200"
      stroke="currentColor"
      strokeWidth="0.8"
      fill="currentColor"
      fillOpacity="0.2"
    />

    {/* Chatris (small kiosks at roofline) */}
    {/* Left chatri */}
    <rect x="62" y="116" width="12" height="6" fill="currentColor" opacity="0.4" />
    <path d="M62,116 Q68,110 74,116" fill="currentColor" opacity="0.4" />
    {/* Right chatri */}
    <rect x="246" y="116" width="12" height="6" fill="currentColor" opacity="0.4" />
    <path d="M246,116 Q252,110 258,116" fill="currentColor" opacity="0.4" />
  </svg>
);

export default MosqueSilhouette;
