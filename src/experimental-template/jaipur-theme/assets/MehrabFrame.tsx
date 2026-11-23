import type { ReactNode } from 'react'

interface MehrabFrameProps {
  className?: string
  children?: ReactNode
}

export default function MehrabFrame({ className, children }: MehrabFrameProps) {
  return (
    <div className={className} style={{ position: 'relative', textAlign: 'center' }}>
      <svg
        viewBox="0 0 300 80"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        style={{ width: '100%', maxWidth: 280, height: 'auto', display: 'block', margin: '0 auto' }}
      >
        {/* Outer cusped mehrab arch — 5-lobe multifoil */}
        <path
          d="M60 72
            Q75 52 90 48
            Q100 56 115 40
            Q125 50 150 16
            Q175 50 185 40
            Q200 56 210 48
            Q225 52 240 72"
          stroke="var(--jt-rose-gold, #B76E79)"
          strokeWidth="0.8"
          fill="none"
          opacity="0.3"
        />
        {/* Inner smooth pointed arch */}
        <path
          d="M80 72 Q150 20 220 72"
          stroke="var(--jt-rose-gold, #B76E79)"
          strokeWidth="0.5"
          fill="none"
          opacity="0.18"
        />
        {/* Lotus bud finial at apex */}
        <path
          d="M150 12 Q147 6 150 2 Q153 6 150 12"
          fill="var(--jt-gold, #D4A853)"
          opacity="0.35"
        />
        <path
          d="M146 14 Q144 9 147 6 Q148.5 8 150 12 Q151.5 8 153 6 Q156 9 154 14"
          fill="var(--jt-gold, #D4A853)"
          opacity="0.22"
        />
        {/* Small kalash base under finial */}
        <ellipse cx="150" cy="15" rx="3.5" ry="1.2" fill="var(--jt-gold, #D4A853)" opacity="0.18" />
        {/* Baseline with dot-dash pattern */}
        <line x1="20" y1="72" x2="60" y2="72" stroke="var(--jt-rose-gold, #B76E79)" strokeWidth="0.4" opacity="0.15" strokeDasharray="6 4" />
        <line x1="240" y1="72" x2="280" y2="72" stroke="var(--jt-rose-gold, #B76E79)" strokeWidth="0.4" opacity="0.15" strokeDasharray="6 4" />
        {/* Corner flourish — left inward-curling tendril */}
        <path
          d="M20 72 Q14 66 12 58 Q11 52 14 48 Q16 52 15 56"
          stroke="var(--jt-rose-gold, #B76E79)"
          strokeWidth="0.5"
          fill="none"
          opacity="0.18"
          strokeLinecap="round"
        />
        <path
          d="M20 72 Q24 64 22 56 Q21 50 18 48"
          stroke="var(--jt-rose-gold, #B76E79)"
          strokeWidth="0.35"
          fill="none"
          opacity="0.12"
          strokeLinecap="round"
        />
        {/* Corner flourish — right inward-curling tendril */}
        <path
          d="M280 72 Q286 66 288 58 Q289 52 286 48 Q284 52 285 56"
          stroke="var(--jt-rose-gold, #B76E79)"
          strokeWidth="0.5"
          fill="none"
          opacity="0.18"
          strokeLinecap="round"
        />
        <path
          d="M280 72 Q276 64 278 56 Q279 50 282 48"
          stroke="var(--jt-rose-gold, #B76E79)"
          strokeWidth="0.35"
          fill="none"
          opacity="0.12"
          strokeLinecap="round"
        />
        {/* Endpoint dots */}
        <circle cx="20" cy="72" r="1.2" fill="var(--jt-rose-gold, #B76E79)" opacity="0.2" />
        <circle cx="280" cy="72" r="1.2" fill="var(--jt-rose-gold, #B76E79)" opacity="0.2" />
      </svg>
      {children && (
        <div style={{ marginTop: -8 }}>
          {children}
        </div>
      )}
    </div>
  )
}
