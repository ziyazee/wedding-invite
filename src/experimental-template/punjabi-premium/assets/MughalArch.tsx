import React from 'react';

interface MughalArchProps extends React.SVGProps<SVGSVGElement> {
  archColor?: string;
  pillarColor?: string;
  goldAccent?: string;
  deepAccent?: string;
}

const MughalArch: React.FC<MughalArchProps> = ({
  archColor = '#E8D5C0',
  pillarColor = '#DBBFA8',
  goldAccent = '#C9A84C',
  deepAccent = '#8B6B3D',
  className,
  ...props
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 400 520"
    fill="none"
    aria-hidden="true"
    className={className}
    {...props}
  >
    <defs>
      <pattern id="pp-jali" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
        <path d="M10 0 C14 4, 14 8, 10 10 C6 8, 6 4, 10 0Z" fill={goldAccent} fillOpacity="0.12" />
        <path d="M0 10 C4 14, 8 14, 10 10 C8 6, 4 6, 0 10Z" fill={goldAccent} fillOpacity="0.08" />
        <path d="M20 10 C16 14, 12 14, 10 10 C12 6, 16 6, 20 10Z" fill={goldAccent} fillOpacity="0.08" />
        <path d="M10 20 C14 16, 14 12, 10 10 C6 12, 6 16, 10 20Z" fill={goldAccent} fillOpacity="0.12" />
        <circle cx="10" cy="10" r="1" fill={goldAccent} fillOpacity="0.2" />
      </pattern>

      <pattern id="pp-pillar-flute" x="0" y="0" width="12" height="24" patternUnits="userSpaceOnUse">
        <path d="M2 0 Q6 12 2 24" stroke={goldAccent} strokeWidth="0.4" strokeOpacity="0.2" fill="none" />
        <path d="M6 0 Q10 12 6 24" stroke={goldAccent} strokeWidth="0.3" strokeOpacity="0.15" fill="none" />
        <path d="M10 0 Q6 12 10 24" stroke={goldAccent} strokeWidth="0.4" strokeOpacity="0.2" fill="none" />
        <circle cx="6" cy="12" r="0.8" fill={goldAccent} fillOpacity="0.12" />
      </pattern>

      <linearGradient id="pp-gold-border" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor={goldAccent} stopOpacity="0.1" />
        <stop offset="30%" stopColor={goldAccent} stopOpacity="0.5" />
        <stop offset="50%" stopColor={goldAccent} stopOpacity="0.7" />
        <stop offset="70%" stopColor={goldAccent} stopOpacity="0.5" />
        <stop offset="100%" stopColor={goldAccent} stopOpacity="0.1" />
      </linearGradient>

      <radialGradient id="pp-keystone-glow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor={goldAccent} stopOpacity="0.3" />
        <stop offset="100%" stopColor={goldAccent} stopOpacity="0" />
      </radialGradient>

      <g id="pp-floral-motif">
        <path d="M0 0 C3 -6, 8 -8, 12 -6 C10 -2, 6 0, 0 0Z" fill={goldAccent} fillOpacity="0.18" />
        <path d="M0 0 C-3 -6, -8 -8, -12 -6 C-10 -2, -6 0, 0 0Z" fill={goldAccent} fillOpacity="0.14" />
        <path d="M0 0 C6 -3, 8 -8, 6 -12 C2 -10, 0 -6, 0 0Z" fill={goldAccent} fillOpacity="0.16" />
        <path d="M0 0 C-6 -3, -8 -8, -6 -12 C-2 -10, 0 -6, 0 0Z" fill={goldAccent} fillOpacity="0.12" />
        <circle cx="0" cy="-4" r="2" fill={goldAccent} fillOpacity="0.2" />
      </g>
    </defs>

    {/* Left pillar */}
    <rect x="24" y="178" width="50" height="342" fill={pillarColor} />
    <rect x="24" y="178" width="50" height="342" fill="url(#pp-pillar-flute)" />
    <rect x="24" y="178" width="6" height="342" fill="rgba(0,0,0,0.06)" />
    <rect x="68" y="178" width="6" height="342" fill="rgba(0,0,0,0.04)" />

    {/* Left pillar base */}
    <rect x="18" y="488" width="62" height="32" rx="2" fill={archColor} />
    <rect x="20" y="492" width="58" height="4" fill={goldAccent} fillOpacity="0.25" />
    <rect x="20" y="510" width="58" height="4" fill={goldAccent} fillOpacity="0.15" />
    <path d="M36 504 C38 498, 44 496, 49 498 C52 500, 52 504, 49 506 C44 508, 38 506, 36 504Z" fill={goldAccent} fillOpacity="0.15" />

    {/* Left pillar capital */}
    <rect x="18" y="168" width="62" height="14" rx="2" fill={archColor} />
    <rect x="20" y="170" width="58" height="3" fill={goldAccent} fillOpacity="0.3" />
    <rect x="20" y="176" width="58" height="2" fill={goldAccent} fillOpacity="0.15" />
    <path d="M30 172 Q49 166 68 172" stroke={goldAccent} strokeWidth="0.6" strokeOpacity="0.3" fill="none" />

    {/* Right pillar */}
    <rect x="326" y="178" width="50" height="342" fill={pillarColor} />
    <rect x="326" y="178" width="50" height="342" fill="url(#pp-pillar-flute)" />
    <rect x="326" y="178" width="6" height="342" fill="rgba(0,0,0,0.04)" />
    <rect x="370" y="178" width="6" height="342" fill="rgba(0,0,0,0.06)" />

    {/* Right pillar base */}
    <rect x="320" y="488" width="62" height="32" rx="2" fill={archColor} />
    <rect x="322" y="492" width="58" height="4" fill={goldAccent} fillOpacity="0.25" />
    <rect x="322" y="510" width="58" height="4" fill={goldAccent} fillOpacity="0.15" />
    <path d="M338 504 C340 498, 346 496, 351 498 C354 500, 354 504, 351 506 C346 508, 340 506, 338 504Z" fill={goldAccent} fillOpacity="0.15" />

    {/* Right pillar capital */}
    <rect x="320" y="168" width="62" height="14" rx="2" fill={archColor} />
    <rect x="322" y="170" width="58" height="3" fill={goldAccent} fillOpacity="0.3" />
    <rect x="322" y="176" width="58" height="2" fill={goldAccent} fillOpacity="0.15" />
    <path d="M332 172 Q351 166 370 172" stroke={goldAccent} strokeWidth="0.6" strokeOpacity="0.3" fill="none" />

    {/* Arch body */}
    <path
      d={[
        'M24 168', 'L24 140',
        'C24 80, 90 20, 200 6',
        'C310 20, 376 80, 376 140',
        'L376 168', 'L326 168', 'L326 150',
        'C326 95, 280 42, 200 26',
        'C120 42, 74 95, 74 150',
        'L74 168', 'Z',
      ].join(' ')}
      fill={archColor}
    />
    <path
      d={[
        'M24 168', 'L24 140',
        'C24 80, 90 20, 200 6',
        'C310 20, 376 80, 376 140',
        'L376 168', 'L326 168', 'L326 150',
        'C326 95, 280 42, 200 26',
        'C120 42, 74 95, 74 150',
        'L74 168', 'Z',
      ].join(' ')}
      fill="url(#pp-jali)"
    />

    {/* Outer gold border */}
    <path
      d={['M24 168', 'L24 140', 'C24 80, 90 20, 200 6', 'C310 20, 376 80, 376 140', 'L376 168'].join(' ')}
      stroke={goldAccent} strokeWidth="1.5" strokeOpacity="0.4" fill="none"
    />

    {/* Inner gold border */}
    <path
      d={['M74 168', 'L74 150', 'C74 95, 120 42, 200 26', 'C280 42, 326 95, 326 150', 'L326 168'].join(' ')}
      stroke={goldAccent} strokeWidth="1" strokeOpacity="0.3" fill="none"
    />

    {/* Mid decorative dashed border */}
    <path
      d={['M48 168', 'L48 146', 'C48 88, 104 30, 200 16', 'C296 30, 352 88, 352 146', 'L352 168'].join(' ')}
      stroke={goldAccent} strokeWidth="0.6" strokeOpacity="0.2" fill="none" strokeDasharray="4 4"
    />

    {/* 9-cusp scalloped inner edge */}
    <path
      d={[
        'M74 168', 'L74 155',
        'C74 146, 80 136, 88 128', 'C92 124, 90 118, 86 114',
        'C92 108, 102 98, 112 90', 'C116 86, 114 80, 110 76',
        'C118 70, 132 60, 144 52', 'C148 48, 146 44, 142 40',
        'C152 36, 168 28, 180 24', 'C184 22, 182 18, 178 16',
        'C186 12, 194 8, 200 6',
        'C206 8, 214 12, 222 16',
        'C218 18, 216 22, 220 24', 'C232 28, 248 36, 258 40',
        'C254 44, 252 48, 256 52', 'C268 60, 282 70, 290 76',
        'C286 80, 284 86, 288 90', 'C298 98, 308 108, 314 114',
        'C310 118, 308 124, 312 128', 'C320 136, 326 146, 326 155',
        'L326 168',
      ].join(' ')}
      fill="none" stroke={deepAccent} strokeWidth="2" strokeOpacity="0.5"
    />

    {/* Inner shadow for carved depth */}
    <path
      d={[
        'M78 164',
        'C78 148, 84 136, 92 126', 'C100 116, 110 104, 118 94',
        'C128 82, 142 68, 156 56', 'C170 44, 186 32, 200 26',
        'C214 32, 230 44, 244 56', 'C258 68, 272 82, 282 94',
        'C290 104, 300 116, 308 126', 'C316 136, 322 148, 322 164',
      ].join(' ')}
      fill="none" stroke="rgba(139,107,61,0.12)" strokeWidth="1"
    />

    {/* Keystone */}
    <path d="M188 6 L200 0 L212 6 L208 14 L192 14 Z" fill={archColor} stroke={goldAccent} strokeWidth="0.8" strokeOpacity="0.4" />
    <circle cx="200" cy="8" r="12" fill="url(#pp-keystone-glow)" />
    <path d="M196 8 C198 4, 200 2, 200 2 C200 2, 202 4, 204 8 C202 7, 198 7, 196 8Z" fill={goldAccent} fillOpacity="0.3" />

    {/* Spandrel florals - left */}
    <use href="#pp-floral-motif" x="42" y="120" />
    <use href="#pp-floral-motif" x="50" y="100" />
    <use href="#pp-floral-motif" x="38" y="140" />

    {/* Spandrel florals - right */}
    <g transform="translate(400,0) scale(-1,1)">
      <use href="#pp-floral-motif" x="42" y="120" />
      <use href="#pp-floral-motif" x="50" y="100" />
      <use href="#pp-floral-motif" x="38" y="140" />
    </g>

    {/* Connecting horizontal line at base */}
    <line x1="74" y1="168" x2="326" y2="168" stroke="url(#pp-gold-border)" strokeWidth="1" />
  </svg>
);

export default MughalArch;
