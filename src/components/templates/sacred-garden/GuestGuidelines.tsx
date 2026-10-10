import { SG } from './styles';

interface GuestGuidelinesProps {
  dressCode?: string;
  giftNote?: string;
}

function GuidelineCard({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return (
    <div
      className="flex-1 rounded-xl p-6 text-center border"
      style={{ backgroundColor: SG.bgCard, borderColor: SG.goldDim }}
    >
      <div className="mb-3 flex justify-center">{icon}</div>
      <h4
        className="text-sm tracking-[0.15em] uppercase mb-2"
        style={{ fontFamily: SG.fontBody, color: SG.gold }}
      >
        {title}
      </h4>
      <p className="text-sm leading-relaxed" style={{ fontFamily: SG.fontBody, color: SG.creamMuted }}>
        {text}
      </p>
    </div>
  );
}

export default function GuestGuidelines({ dressCode, giftNote }: GuestGuidelinesProps) {
  if (!dressCode && !giftNote) return null;

  const dressIcon = (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
      <path
        d="M16 4C14 4 12 6 12 8C12 10 13 11 14 12L10 28H22L18 12C19 11 20 10 20 8C20 6 18 4 16 4Z"
        stroke={SG.gold} strokeWidth="1.5" fill="none"
      />
      <path d="M13 8Q16 10 19 8" stroke={SG.gold} strokeWidth="1" fill="none" />
    </svg>
  );

  const giftIcon = (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
      <rect x="6" y="14" width="20" height="14" rx="2" stroke={SG.gold} strokeWidth="1.5" fill="none" />
      <rect x="4" y="10" width="24" height="5" rx="1" stroke={SG.gold} strokeWidth="1.5" fill="none" />
      <line x1="16" y1="10" x2="16" y2="28" stroke={SG.gold} strokeWidth="1.5" />
      <path d="M16 10C16 10 12 6 10 6C8 6 8 8 10 9C12 10 16 10 16 10Z" stroke={SG.gold} strokeWidth="1" fill={SG.goldDim} />
      <path d="M16 10C16 10 20 6 22 6C24 6 24 8 22 9C20 10 16 10 16 10Z" stroke={SG.gold} strokeWidth="1" fill={SG.goldDim} />
    </svg>
  );

  return (
    <div className="py-10 px-6">
      <div className="flex flex-col md:flex-row gap-4 max-w-lg mx-auto">
        {dressCode && <GuidelineCard icon={dressIcon} title="Dress Code" text={dressCode} />}
        {giftNote && <GuidelineCard icon={giftIcon} title="Gift Preference" text={giftNote} />}
      </div>
    </div>
  );
}
