/* Kerala Dawn — Temple Gopuram Silhouette
   Simplified Dravidian temple tower watermark */

interface GopuramSilhouetteProps {
  className?: string
  width?: number
  color?: string
  style?: React.CSSProperties
}

export default function GopuramSilhouette({
  className,
  width = 48,
  color = 'var(--kd-lamp-gold)',
  style,
}: GopuramSilhouetteProps) {
  const h = width * 2
  return (
    <svg
      className={className}
      style={style}
      width={width}
      height={h}
      viewBox="0 0 48 96"
      fill={color}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      role="presentation"
    >
      {/* Kalasam finial at top */}
      <ellipse cx="24" cy="4" rx="2" ry="2.5" />
      <rect x="23" y="6" width="2" height="3" />

      {/* Tier 1 (narrowest) */}
      <path d="M18 9 L18 16 L30 16 L30 9 Q24 6, 18 9Z" />

      {/* Tier 2 */}
      <path d="M15 16 L15 26 L33 26 L33 16Z" />
      <rect x="15" y="16" width="18" height="1" opacity="0.3" fill="var(--kd-teal-black, #0A1F1C)" />

      {/* Tier 3 */}
      <path d="M12 26 L12 38 L36 38 L36 26Z" />
      <rect x="12" y="26" width="24" height="1" opacity="0.3" fill="var(--kd-teal-black, #0A1F1C)" />

      {/* Tier 4 */}
      <path d="M9 38 L9 52 L39 52 L39 38Z" />
      <rect x="9" y="38" width="30" height="1" opacity="0.3" fill="var(--kd-teal-black, #0A1F1C)" />

      {/* Tier 5 (widest) */}
      <path d="M6 52 L6 68 L42 68 L42 52Z" />
      <rect x="6" y="52" width="36" height="1" opacity="0.3" fill="var(--kd-teal-black, #0A1F1C)" />

      {/* Base / entrance gateway */}
      <path d="M3 68 L3 92 L45 92 L45 68Z" />
      {/* Entrance arch */}
      <path d="M18 92 L18 76 Q24 70, 30 76 L30 92Z" fill="var(--kd-teal-black, #0A1F1C)" opacity="0.3" />

      {/* Base platform */}
      <rect x="1" y="92" width="46" height="4" rx="1" />
    </svg>
  )
}
