import React from 'react';

interface FloralBorderProps extends React.SVGProps<SVGSVGElement> {
  variant?: 'top' | 'bottom' | 'side';
}

const FloralBorder: React.FC<FloralBorderProps> = ({
  variant = 'top',
  className,
  ...props
}) => {
  if (variant === 'bottom') {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 160" fill="none" aria-hidden="true" className={className} {...props}>
        {/* Dense bottom botanical arrangement — roses, leaves, marigolds filling the space */}
        {/* Background leaf mass */}
        <path d="M0 160 C20 130, 50 110, 80 100 C100 95, 120 98, 140 95 C160 92, 180 88, 200 85 C220 88, 240 92, 260 95 C280 98, 300 95, 320 100 C350 110, 380 130, 400 160Z" fill="#3D6B4A" fillOpacity="0.6" />
        <path d="M0 160 C30 140, 60 125, 100 115 C140 108, 170 105, 200 100 C230 105, 260 108, 300 115 C340 125, 370 140, 400 160Z" fill="#7A9A6A" fillOpacity="0.5" />

        {/* Individual leaf shapes scattered */}
        <path d="M30 150 C25 138, 15 132, 5 136 C12 142, 22 148, 30 150Z" fill="#3D6B4A" fillOpacity="0.7" />
        <path d="M60 140 C55 128, 42 122, 32 126 C40 132, 52 138, 60 140Z" fill="#7A9A6A" fillOpacity="0.6" />
        <path d="M100 130 C95 118, 82 112, 72 116 C80 122, 92 128, 100 130Z" fill="#3D6B4A" fillOpacity="0.65" />
        <path d="M340 150 C345 138, 355 132, 365 136 C358 142, 348 148, 340 150Z" fill="#3D6B4A" fillOpacity="0.7" />
        <path d="M310 140 C315 128, 328 122, 338 126 C330 132, 318 138, 310 140Z" fill="#7A9A6A" fillOpacity="0.6" />
        <path d="M280 130 C285 118, 298 112, 308 116 C300 122, 288 128, 280 130Z" fill="#3D6B4A" fillOpacity="0.65" />

        {/* Center leaves */}
        <path d="M170 110 C165 98, 155 92, 148 96 C155 102, 165 108, 170 110Z" fill="#7A9A6A" fillOpacity="0.55" />
        <path d="M230 110 C235 98, 245 92, 252 96 C245 102, 235 108, 230 110Z" fill="#7A9A6A" fillOpacity="0.55" />

        {/* Roses scattered across bottom */}
        {/* Left large rose */}
        <circle cx="60" cy="130" r="14" fill="#D4708A" fillOpacity="0.15" />
        <path d="M50 136 C46 130, 46 124, 52 120 C54 126, 54 132, 56 136Z" fill="#D4708A" fillOpacity="0.5" />
        <path d="M70 136 C74 130, 72 124, 66 120 C66 126, 68 132, 66 136Z" fill="#D4708A" fillOpacity="0.55" />
        <path d="M54 132 C50 128, 50 122, 56 120 C56 124, 56 130, 58 132Z" fill="#B85070" fillOpacity="0.65" />
        <path d="M66 132 C70 128, 68 122, 62 120 C64 124, 66 130, 64 132Z" fill="#B85070" fillOpacity="0.65" />
        <circle cx="60" cy="126" r="3" fill="#B85070" fillOpacity="0.8" />

        {/* Center-left rose */}
        <path d="M140 118 C136 112, 138 106, 144 106 C146 110, 144 116, 144 120Z" fill="#D4708A" fillOpacity="0.5" />
        <path d="M152 118 C156 112, 152 106, 146 106 C148 110, 150 116, 148 120Z" fill="#D4708A" fillOpacity="0.55" />
        <circle cx="146" cy="112" r="2" fill="#B85070" fillOpacity="0.8" />

        {/* Center marigold */}
        {[0, 40, 80, 120, 160, 200, 240, 280, 320].map((a, i) => {
          const rad = (a * Math.PI) / 180;
          const cx = 200 + Math.cos(rad) * 10;
          const cy = 105 + Math.sin(rad) * 10;
          return <ellipse key={i} cx={cx} cy={cy} rx="5" ry="3" fill="#E8A040" fillOpacity={0.4 + (i % 2) * 0.15} transform={`rotate(${a}, ${cx}, ${cy})`} />;
        })}
        <circle cx="200" cy="105" r="4" fill="#C9A84C" fillOpacity="0.6" />

        {/* Center-right rose */}
        <path d="M248 118 C244 112, 246 106, 252 106 C254 110, 252 116, 252 120Z" fill="#D4708A" fillOpacity="0.5" />
        <path d="M260 118 C264 112, 260 106, 254 106 C256 110, 258 116, 256 120Z" fill="#D4708A" fillOpacity="0.55" />
        <circle cx="254" cy="112" r="2" fill="#B85070" fillOpacity="0.8" />

        {/* Right large rose */}
        <circle cx="340" cy="130" r="14" fill="#D4708A" fillOpacity="0.15" />
        <path d="M330 136 C326 130, 326 124, 332 120 C334 126, 334 132, 336 136Z" fill="#D4708A" fillOpacity="0.5" />
        <path d="M350 136 C354 130, 352 124, 346 120 C346 126, 348 132, 346 136Z" fill="#D4708A" fillOpacity="0.55" />
        <path d="M334 132 C330 128, 330 122, 336 120 C336 124, 336 130, 338 132Z" fill="#B85070" fillOpacity="0.65" />
        <path d="M346 132 C350 128, 348 122, 342 120 C344 124, 346 130, 344 132Z" fill="#B85070" fillOpacity="0.65" />
        <circle cx="340" cy="126" r="3" fill="#B85070" fillOpacity="0.8" />

        {/* Small buds */}
        <path d="M110 125 C108 120, 112 118, 114 120 C114 124, 112 126, 110 126Z" fill="#D4708A" fillOpacity="0.6" />
        <path d="M180 100 C178 96, 182 94, 184 96 C184 100, 182 102, 180 102Z" fill="#E8A0A8" fillOpacity="0.6" />
        <path d="M220 100 C218 96, 222 94, 224 96 C224 100, 222 102, 220 102Z" fill="#E8A0A8" fillOpacity="0.6" />
        <path d="M290 125 C288 120, 292 118, 294 120 C294 124, 292 126, 290 126Z" fill="#D4708A" fillOpacity="0.6" />

        {/* Marigold accents in corners */}
        {[20, 380].map((baseX) =>
          [0, 60, 120, 180, 240, 300].map((a, i) => {
            const rad = (a * Math.PI) / 180;
            const cx = baseX + Math.cos(rad) * 8;
            const cy = 148 + Math.sin(rad) * 8;
            return <ellipse key={`${baseX}-${i}`} cx={cx} cy={cy} rx="4" ry="2.5" fill="#E8A040" fillOpacity={0.3 + (i % 2) * 0.1} transform={`rotate(${a}, ${cx}, ${cy})`} />;
          })
        )}

        {/* Gold dust */}
        <circle cx="90" cy="118" r="0.8" fill="#C9A84C" fillOpacity="0.3" />
        <circle cx="160" cy="100" r="0.6" fill="#C9A84C" fillOpacity="0.25" />
        <circle cx="240" cy="100" r="0.6" fill="#C9A84C" fillOpacity="0.25" />
        <circle cx="310" cy="118" r="0.8" fill="#C9A84C" fillOpacity="0.3" />
      </svg>
    );
  }

  // Top variant — garland of flowers draping across
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 100" fill="none" aria-hidden="true" className={className} {...props}>
      {/* Leaf background along top */}
      <path d="M0 0 C20 15, 50 25, 80 30 C120 36, 160 38, 200 40 C240 38, 280 36, 320 30 C350 25, 380 15, 400 0Z" fill="#7A9A6A" fillOpacity="0.3" />
      <path d="M0 0 C30 20, 70 35, 120 42 C160 48, 200 50, 200 50 C200 50, 240 48, 280 42 C330 35, 370 20, 400 0Z" fill="#3D6B4A" fillOpacity="0.25" />

      {/* Scattered leaves */}
      <path d="M40 20 C35 12, 28 10, 24 14 C30 18, 36 20, 40 20Z" fill="#7A9A6A" fillOpacity="0.5" />
      <path d="M80 30 C75 22, 65 18, 60 22 C66 28, 74 30, 80 30Z" fill="#3D6B4A" fillOpacity="0.5" />
      <path d="M320 30 C325 22, 335 18, 340 22 C334 28, 326 30, 320 30Z" fill="#3D6B4A" fillOpacity="0.5" />
      <path d="M360 20 C365 12, 372 10, 376 14 C370 18, 364 20, 360 20Z" fill="#7A9A6A" fillOpacity="0.5" />

      {/* Marigold chain — dense row of overlapping petals */}
      {[50, 100, 150, 200, 250, 300, 350].map((baseX, idx) => {
        const baseY = 15 + Math.sin((baseX / 400) * Math.PI) * 20;
        return (
          <g key={idx}>
            {[0, 45, 90, 135, 180, 225, 270, 315].map((a, i) => {
              const rad = (a * Math.PI) / 180;
              const cx = baseX + Math.cos(rad) * 8;
              const cy = baseY + Math.sin(rad) * 8;
              return <ellipse key={i} cx={cx} cy={cy} rx="5" ry="3" fill="#E8A040" fillOpacity={0.35 + (i % 3) * 0.1} transform={`rotate(${a}, ${cx}, ${cy})`} />;
            })}
            <circle cx={baseX} cy={baseY} r="3.5" fill="#C9A84C" fillOpacity="0.5" />
          </g>
        );
      })}

      {/* Small roses between marigolds */}
      {[75, 175, 275, 375].map((x, i) => {
        const y = 18 + Math.sin((x / 400) * Math.PI) * 18;
        return (
          <g key={`r${i}`}>
            <path d={`M${x-5} ${y+4} C${x-7} ${y}, ${x-5} ${y-4}, ${x} ${y-4} C${x+2} ${y}, ${x} ${y+2}, ${x-2} ${y+4}Z`} fill="#D4708A" fillOpacity="0.5" />
            <path d={`M${x+5} ${y+4} C${x+7} ${y}, ${x+5} ${y-4}, ${x} ${y-4} C${x-2} ${y}, ${x} ${y+2}, ${x+2} ${y+4}Z`} fill="#D4708A" fillOpacity="0.45" />
            <circle cx={x} cy={y} r="1.5" fill="#B85070" fillOpacity="0.6" />
          </g>
        );
      })}

      {/* Gold shimmer dots */}
      {[30, 125, 200, 275, 370].map((x, i) => (
        <circle key={`g${i}`} cx={x} cy={10 + Math.sin((x / 400) * Math.PI) * 15} r="0.7" fill="#C9A84C" fillOpacity="0.35" />
      ))}
    </svg>
  );
};

export default FloralBorder;
