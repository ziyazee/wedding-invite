import React from 'react';

interface ToranOrnamentsProps extends React.SVGProps<SVGSVGElement> {
  goldColor?: string;
  pearlColor?: string;
  mauveColor?: string;
}

/**
 * 5 hanging toran ornaments: golden bell/kalash + pearl strand + mauve teardrop.
 * Each ornament is a separate <g> for individual CSS pendulum animation.
 *
 * Arrangement: symmetrical, outer two slightly longer.
 * Transform-origin: top center of each ornament group for pendulum sway.
 */
const ToranOrnaments: React.FC<ToranOrnamentsProps> = ({
  goldColor = '#C9A84C',
  pearlColor = '#F5E6D3',
  mauveColor = '#8B5E8B',
  className,
  ...props
}) => {
  // Ornament positions: [x, strandLength]
  // Outer two are longer, creating a gentle concave curve
  const ornaments: [number, number][] = [
    [55, 62],   // leftmost (longer)
    [120, 52],  // inner left
    [200, 48],  // center (shortest)
    [280, 52],  // inner right
    [345, 62],  // rightmost (longer)
  ];

  const renderOrnament = (x: number, strandLen: number, index: number) => {
    const pearlCount = Math.floor(strandLen / 10);
    return (
      <g
        key={index}
        className="pp-opening__ornament"
        data-ornament={index}
        style={{ transformOrigin: `${x}px 0px` }}
      >
        {/* Connection point / hook */}
        <circle cx={x} cy={4} r={3} fill={goldColor} />

        {/* Golden bell / kalash shape */}
        <path
          d={[
            `M${x - 8} 8`,
            `C${x - 8} 4, ${x - 4} 2, ${x} 2`,
            `C${x + 4} 2, ${x + 8} 4, ${x + 8} 8`,
            // Bell body widens
            `C${x + 10} 14, ${x + 11} 18, ${x + 9} 22`,
            // Rim
            `L${x + 10} 24`,
            `L${x - 10} 24`,
            `L${x - 9} 22`,
            `C${x - 11} 18, ${x - 10} 14, ${x - 8} 8`,
            'Z',
          ].join(' ')}
          fill={goldColor}
        />
        {/* Bell highlight */}
        <ellipse
          cx={x - 2}
          cy={14}
          rx={3}
          ry={6}
          fill="white"
          fillOpacity="0.15"
        />

        {/* Pearl strand */}
        {Array.from({ length: pearlCount }, (_, i) => (
          <circle
            key={i}
            cx={x}
            cy={28 + i * 10}
            r={2.5}
            fill={pearlColor}
            stroke={goldColor}
            strokeWidth="0.5"
            strokeOpacity="0.4"
          />
        ))}

        {/* Mauve teardrop terminal */}
        <path
          d={[
            `M${x} ${28 + pearlCount * 10}`,
            `C${x - 5} ${32 + pearlCount * 10}, ${x - 6} ${38 + pearlCount * 10}, ${x} ${44 + pearlCount * 10}`,
            `C${x + 6} ${38 + pearlCount * 10}, ${x + 5} ${32 + pearlCount * 10}, ${x} ${28 + pearlCount * 10}`,
            'Z',
          ].join(' ')}
          fill={mauveColor}
        />
        {/* Teardrop highlight */}
        <ellipse
          cx={x - 1}
          cy={36 + pearlCount * 10}
          rx={1.5}
          ry={3}
          fill="white"
          fillOpacity="0.12"
        />
      </g>
    );
  };

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 400 120"
      fill="none"
      aria-hidden="true"
      className={className}
      {...props}
    >
      {/* Connecting garland line between ornament tops */}
      <path
        d={`M${ornaments[0][0]} 4 Q${ornaments[1][0]} 10, ${ornaments[2][0]} 4 Q${ornaments[3][0]} 10, ${ornaments[4][0]} 4`}
        stroke={goldColor}
        strokeWidth="1"
        strokeOpacity="0.4"
        fill="none"
      />

      {ornaments.map(([x, len], i) => renderOrnament(x, len, i))}
    </svg>
  );
};

export default ToranOrnaments;
