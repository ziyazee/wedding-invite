import { SG } from './styles';

export function GoldDivider({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center gap-3 ${className}`}>
      <div className="h-px flex-1 max-w-16" style={{ background: `linear-gradient(to right, transparent, ${SG.gold})` }} />
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M10 2L12 8L18 10L12 12L10 18L8 12L2 10L8 8Z" fill={SG.gold} opacity="0.8" />
      </svg>
      <div className="h-px flex-1 max-w-16" style={{ background: `linear-gradient(to left, transparent, ${SG.gold})` }} />
    </div>
  );
}

export function GoldBorder({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center gap-2 py-2 ${className}`}>
      <div className="h-px flex-1 max-w-24" style={{ background: `linear-gradient(to right, transparent, ${SG.goldDim})` }} />
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
        <circle cx="6" cy="6" r="2" fill={SG.gold} opacity="0.6" />
      </svg>
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
        <circle cx="6" cy="6" r="2" fill={SG.gold} opacity="0.4" />
      </svg>
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
        <circle cx="6" cy="6" r="2" fill={SG.gold} opacity="0.6" />
      </svg>
      <div className="h-px flex-1 max-w-24" style={{ background: `linear-gradient(to left, transparent, ${SG.goldDim})` }} />
    </div>
  );
}

export function RoseCluster({ className = '' }: { className?: string }) {
  return (
    <svg className={className} width="120" height="60" viewBox="0 0 120 60" fill="none">
      {/* Center rose */}
      <circle cx="60" cy="25" r="10" fill={SG.rose} opacity="0.7" />
      <circle cx="60" cy="25" r="6" fill={SG.roseSoft} opacity="0.5" />
      <circle cx="60" cy="25" r="3" fill={SG.rose} opacity="0.8" />
      {/* Left bud */}
      <circle cx="38" cy="32" r="6" fill={SG.rose} opacity="0.5" />
      <circle cx="38" cy="32" r="3" fill={SG.roseSoft} opacity="0.4" />
      {/* Right bud */}
      <circle cx="82" cy="32" r="6" fill={SG.rose} opacity="0.5" />
      <circle cx="82" cy="32" r="3" fill={SG.roseSoft} opacity="0.4" />
      {/* Stems */}
      <path d="M60 35 Q55 45 45 50" stroke="#2d6b3f" strokeWidth="1.5" fill="none" opacity="0.6" />
      <path d="M60 35 Q65 45 75 50" stroke="#2d6b3f" strokeWidth="1.5" fill="none" opacity="0.6" />
      <path d="M60 35 L60 55" stroke="#2d6b3f" strokeWidth="1.5" fill="none" opacity="0.6" />
      {/* Leaves */}
      <ellipse cx="50" cy="44" rx="5" ry="2.5" fill="#2d6b3f" opacity="0.5" transform="rotate(-30 50 44)" />
      <ellipse cx="70" cy="44" rx="5" ry="2.5" fill="#2d6b3f" opacity="0.5" transform="rotate(30 70 44)" />
    </svg>
  );
}

export function GeometricCorner({ className = '' }: { className?: string }) {
  return (
    <svg className={className} width="60" height="60" viewBox="0 0 60 60" fill="none">
      <path d="M5 55 L5 20 Q5 5 20 5 L55 5" stroke={SG.gold} strokeWidth="1" fill="none" opacity="0.4" />
      <path d="M10 55 L10 25 Q10 10 25 10 L55 10" stroke={SG.gold} strokeWidth="0.5" fill="none" opacity="0.25" />
      <circle cx="5" cy="5" r="2" fill={SG.gold} opacity="0.5" />
      <circle cx="20" cy="5" r="1.5" fill={SG.gold} opacity="0.3" />
      <circle cx="5" cy="20" r="1.5" fill={SG.gold} opacity="0.3" />
    </svg>
  );
}
