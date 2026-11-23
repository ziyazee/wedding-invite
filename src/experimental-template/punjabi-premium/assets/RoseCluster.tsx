import React from 'react';

interface RoseClusterProps extends React.SVGProps<SVGSVGElement> {
  roseColor?: string;
  deepRose?: string;
  leafColor?: string;
  deepLeafColor?: string;
  goldAccent?: string;
  mirror?: boolean;
  size?: number;
}

const RoseCluster: React.FC<RoseClusterProps> = ({
  roseColor = '#D4708A',
  deepRose = '#B85070',
  leafColor = '#7A9A6A',
  deepLeafColor = '#3D6B4A',
  goldAccent = '#C9A84C',
  mirror = false,
  size,
  className,
  style,
  ...props
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 120 100"
    fill="none"
    aria-hidden="true"
    className={className}
    style={{
      ...style,
      ...(size ? { width: size, height: size * (100 / 120) } : {}),
      ...(mirror ? { transform: 'scaleX(-1)' } : {}),
    }}
    {...props}
  >
    {/* Main stems */}
    <path d="M100 90 C90 75, 70 60, 50 45 C40 38, 32 30, 28 20" stroke={deepLeafColor} strokeWidth="1.8" strokeLinecap="round" fill="none" />
    <path d="M85 88 C78 72, 68 62, 62 50 C58 42, 56 34, 60 24" stroke={deepLeafColor} strokeWidth="1.4" strokeLinecap="round" fill="none" />
    <path d="M92 92 C84 80, 74 70, 58 58" stroke={deepLeafColor} strokeWidth="1.2" strokeLinecap="round" fill="none" />

    {/* Large leaves - deep green, bottom */}
    <path d="M96 86 C88 72, 72 66, 58 70 C68 78, 82 84, 96 86Z" fill={deepLeafColor} fillOpacity="0.8" />
    <path d="M82 84 C76 72, 62 64, 48 66 C56 74, 68 80, 82 84Z" fill={leafColor} fillOpacity="0.75" />
    <path d="M72 80 C68 70, 56 62, 42 62 C50 70, 62 78, 72 80Z" fill={deepLeafColor} fillOpacity="0.65" />

    {/* Mid leaves - sage */}
    <path d="M56 60 C50 48, 36 42, 24 44 C32 52, 46 58, 56 60Z" fill={leafColor} fillOpacity="0.7" />
    <path d="M66 56 C60 44, 48 38, 36 40 C44 48, 58 54, 66 56Z" fill={leafColor} fillOpacity="0.6" />
    <path d="M48 50 C42 40, 30 36, 20 38 C28 44, 40 48, 48 50Z" fill={leafColor} fillOpacity="0.55" />

    {/* Upper leaves near buds */}
    <path d="M36 34 C30 26, 22 24, 16 28 C22 32, 30 34, 36 34Z" fill={leafColor} fillOpacity="0.5" />
    <path d="M64 36 C58 28, 48 24, 42 26 C48 32, 58 36, 64 36Z" fill={leafColor} fillOpacity="0.45" />

    {/* Leaf vein details */}
    <path d="M96 86 C84 76, 70 68, 58 70" stroke={deepLeafColor} strokeWidth="0.4" strokeOpacity="0.3" fill="none" />
    <path d="M82 84 C72 74, 60 66, 48 66" stroke={leafColor} strokeWidth="0.3" strokeOpacity="0.3" fill="none" />

    {/* Rose 1 - main bloom, largest */}
    <circle cx="26" cy="22" r="16" fill={roseColor} fillOpacity="0.15" />
    {/* Outer petals */}
    <path d="M14 28 C8 22, 6 14, 14 8 C18 14, 18 22, 22 26Z" fill={roseColor} fillOpacity="0.5" />
    <path d="M38 28 C44 22, 44 14, 36 8 C34 14, 34 22, 30 26Z" fill={roseColor} fillOpacity="0.55" />
    <path d="M10 22 C4 18, 2 10, 10 6 C12 12, 12 18, 16 22Z" fill={roseColor} fillOpacity="0.6" />
    <path d="M42 22 C48 18, 48 10, 40 6 C40 12, 40 18, 36 22Z" fill={roseColor} fillOpacity="0.6" />
    <path d="M16 10 C12 4, 16 0, 22 0 C24 4, 22 8, 20 12Z" fill={roseColor} fillOpacity="0.65" />
    <path d="M36 10 C40 4, 36 0, 30 0 C28 4, 30 8, 32 12Z" fill={roseColor} fillOpacity="0.65" />
    {/* Mid petals */}
    <path d="M18 24 C14 18, 14 10, 22 8 C24 14, 22 20, 22 24Z" fill={deepRose} fillOpacity="0.6" />
    <path d="M34 24 C38 18, 36 10, 28 8 C28 14, 30 20, 30 24Z" fill={deepRose} fillOpacity="0.6" />
    {/* Inner spiral */}
    <path d="M22 20 C18 16, 18 10, 24 8 C28 10, 30 16, 30 20 C28 22, 24 22, 22 20Z" fill={deepRose} fillOpacity="0.75" />
    <path d="M24 18 C22 14, 22 10, 26 10 C28 12, 28 16, 26 18Z" fill={deepRose} fillOpacity="0.9" />
    <circle cx="25" cy="14" r="2" fill={deepRose} />
    {/* Rose highlight */}
    <ellipse cx="22" cy="14" rx="3" ry="5" fill="white" fillOpacity="0.08" />

    {/* Rose 2 - medium, right side */}
    <circle cx="62" cy="38" r="12" fill={roseColor} fillOpacity="0.12" />
    <path d="M52 44 C48 38, 48 32, 56 28 C58 34, 56 40, 58 44Z" fill={roseColor} fillOpacity="0.5" />
    <path d="M72 44 C76 38, 74 32, 66 28 C66 34, 68 40, 66 44Z" fill={roseColor} fillOpacity="0.55" />
    <path d="M54 40 C50 36, 50 30, 58 28 C58 32, 56 38, 58 40Z" fill={deepRose} fillOpacity="0.6" />
    <path d="M70 40 C74 36, 72 30, 64 28 C66 32, 68 38, 66 40Z" fill={deepRose} fillOpacity="0.6" />
    <path d="M58 38 C56 32, 58 28, 64 28 C66 32, 66 36, 64 38 C62 40, 58 38, 58 38Z" fill={deepRose} fillOpacity="0.8" />
    <circle cx="62" cy="34" r="1.5" fill={deepRose} />

    {/* Rose 3 - small bud, upper right */}
    <path d="M68 22 C64 14, 68 8, 74 8 C78 12, 76 18, 72 22Z" fill={roseColor} fillOpacity="0.65" />
    <path d="M70 18 C68 12, 70 8, 74 8 C74 12, 74 16, 74 20Z" fill={deepRose} fillOpacity="0.8" />
    <path d="M72 22 C70 24, 66 22, 68 18" stroke={leafColor} strokeWidth="0.8" fill="none" />
    {/* Sepal leaves */}
    <path d="M66 22 C64 18, 60 18, 62 22Z" fill={leafColor} fillOpacity="0.5" />

    {/* Rose 4 - tiny bud */}
    <path d="M44 46 C42 40, 46 36, 50 38 C50 42, 48 46, 46 48Z" fill={roseColor} fillOpacity="0.6" />
    <path d="M46 44 C44 40, 46 38, 48 38 C48 40, 48 44, 48 46Z" fill={deepRose} fillOpacity="0.7" />

    {/* Gold dust accents */}
    <circle cx="20" cy="8" r="0.8" fill={goldAccent} fillOpacity="0.4" />
    <circle cx="40" cy="16" r="0.6" fill={goldAccent} fillOpacity="0.3" />
    <circle cx="72" cy="14" r="0.7" fill={goldAccent} fillOpacity="0.35" />
    <circle cx="50" cy="52" r="0.5" fill={goldAccent} fillOpacity="0.25" />
    <circle cx="34" cy="38" r="0.6" fill={goldAccent} fillOpacity="0.3" />
  </svg>
);

export default RoseCluster;
