/* Kerala Dawn -- Banana Leaf Card Background
   Used as the decorative container for celebration event cards.
   Enhanced with prominent veins and gentle sway animation class. */

interface BananaLeafProps {
  className?: string
  children?: React.ReactNode
}

/**
 * A banana leaf shape used as an event card background.
 * Renders as a clipped container with prominent veins and gold outline.
 * Add `kd-leaf--sway` class to enable gentle sway animation on scroll reveal.
 */
export default function BananaLeaf({ className, children }: BananaLeafProps) {
  return (
    <div className={`kd-leaf ${className || ''}`}>
      {/* Background leaf SVG */}
      <svg
        className="kd-leaf__bg"
        viewBox="0 0 300 400"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        aria-hidden="true"
        role="presentation"
      >
        {/* Leaf shape -- elongated oval with pointed ends, gentle wavy edges */}
        <path
          d="M150 8
             C 170 8, 210 30, 230 70
             C 248 106, 256 150, 258 190
             C 260 230, 254 270, 240 310
             C 226 348, 200 380, 150 394
             C 100 380, 74 348, 60 310
             C 46 270, 40 230, 42 190
             C 44 150, 52 106, 70 70
             C 90 30, 130 8, 150 8Z"
          fill="var(--kd-deep-moss)"
        />

        {/* Outer edge stroke */}
        <path
          d="M150 8
             C 170 8, 210 30, 230 70
             C 248 106, 256 150, 258 190
             C 260 230, 254 270, 240 310
             C 226 348, 200 380, 150 394
             C 100 380, 74 348, 60 310
             C 46 270, 40 230, 42 190
             C 44 150, 52 106, 70 70
             C 90 30, 130 8, 150 8Z"
          stroke="var(--kd-lamp-gold)"
          strokeWidth="1"
          fill="none"
          opacity="0.15"
        />

        {/* Central vein -- more prominent */}
        <line
          x1="150" y1="15" x2="150" y2="390"
          stroke="var(--kd-paddy)"
          strokeWidth="2"
          opacity="0.25"
        />

        {/* Side veins -- thicker, more visible, with gentle curves */}
        {[55, 90, 125, 165, 205, 245, 285, 325, 355].map((y, i) => {
          const progress = y / 400
          // Veins spread wider in the middle, narrower at tips
          const spread = 35 + Math.sin(progress * Math.PI) * 30
          const curveOffset = 8
          return (
            <g key={i}>
              {/* Right vein */}
              <path
                d={`M150 ${y} Q${150 + spread * 0.5} ${y - curveOffset}, ${150 + spread} ${y - 18}`}
                stroke="var(--kd-paddy)"
                strokeWidth="1.2"
                fill="none"
                opacity="0.2"
              />
              {/* Left vein */}
              <path
                d={`M150 ${y} Q${150 - spread * 0.5} ${y - curveOffset}, ${150 - spread} ${y - 18}`}
                stroke="var(--kd-paddy)"
                strokeWidth="1.2"
                fill="none"
                opacity="0.2"
              />
            </g>
          )
        })}

        {/* Secondary fine veins between major ones for texture */}
        {[72, 108, 145, 185, 225, 265, 305, 340].map((y, i) => {
          const progress = y / 400
          const spread = 22 + Math.sin(progress * Math.PI) * 18
          return (
            <g key={`fine-${i}`}>
              <path
                d={`M150 ${y} Q${150 + spread * 0.5} ${y - 4}, ${150 + spread} ${y - 10}`}
                stroke="var(--kd-paddy)"
                strokeWidth="0.5"
                fill="none"
                opacity="0.1"
              />
              <path
                d={`M150 ${y} Q${150 - spread * 0.5} ${y - 4}, ${150 - spread} ${y - 10}`}
                stroke="var(--kd-paddy)"
                strokeWidth="0.5"
                fill="none"
                opacity="0.1"
              />
            </g>
          )
        })}
      </svg>

      {/* Content area */}
      <div className="kd-leaf__content">
        {children}
      </div>
    </div>
  )
}
