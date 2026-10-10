import type { TemplateProps, SectionType } from '../../types';

function formatDate(dateStr: string): string {
  if (!dateStr) return '';
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
}

function formatTime(time: string): string {
  if (!time) return '';
  const [h, m] = time.split(':').map(Number);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const hour = h % 12 || 12;
  return `${hour}:${m.toString().padStart(2, '0')} ${ampm}`;
}

function FloralCorner({ className }: { className: string }) {
  return (
    <svg className={className} width="80" height="80" viewBox="0 0 80 80" fill="none">
      <path d="M10 70C10 70 20 40 50 20C55 17 60 15 65 14" stroke="#d4a0a0" strokeWidth="1.5" fill="none" />
      <circle cx="15" cy="60" r="4" fill="#e8c4c4" opacity="0.7" />
      <circle cx="30" cy="40" r="3" fill="#d4a0a0" opacity="0.6" />
      <circle cx="45" cy="25" r="5" fill="#e8c4c4" opacity="0.5" />
      <circle cx="60" cy="15" r="3.5" fill="#c4d4a0" opacity="0.6" />
      <path d="M12 65C12 65 15 55 25 45" stroke="#c4d4a0" strokeWidth="1" fill="none" opacity="0.5" />
      <path d="M42 28C42 28 48 22 55 18" stroke="#c4d4a0" strokeWidth="1" fill="none" opacity="0.5" />
    </svg>
  );
}

export default function FloralGarden({ details, sectionsOrder }: TemplateProps) {
  const sections: Record<SectionType, () => React.ReactNode> = {
    header: () => (
      <div key="header" className="text-center py-8">
        <p className="font-[Quicksand] text-sm tracking-[0.25em] uppercase text-[#2d5016]/70 font-medium">
          You are cordially invited to the wedding of
        </p>
      </div>
    ),
    coupleNames: () => (
      <div key="coupleNames" className="text-center py-6">
        <h2 className="font-[Great_Vibes] text-5xl md:text-6xl text-[#2d5016]">
          {details.groomName || 'Groom'}
        </h2>
        <p className="font-[Quicksand] text-[#d4a0a0] text-lg my-2">&amp;</p>
        <h2 className="font-[Great_Vibes] text-5xl md:text-6xl text-[#2d5016]">
          {details.brideName || 'Bride'}
        </h2>
      </div>
    ),
    dateTime: () => (
      <div key="dateTime" className="text-center py-6">
        <div className="inline-block border-t border-b border-[#d4a0a0]/40 py-4 px-8">
          <p className="font-[Quicksand] text-[#2d5016] font-semibold text-lg">
            {formatDate(details.weddingDate)}
          </p>
          <div className="flex justify-center gap-6 mt-3 text-sm text-[#2d5016]/70 font-[Quicksand]">
            {details.ceremonyTime && (
              <div>
                <p className="text-[#d4a0a0] text-xs uppercase tracking-wider mb-0.5">Ceremony</p>
                <p>{formatTime(details.ceremonyTime)}</p>
              </div>
            )}
            {details.receptionTime && (
              <div>
                <p className="text-[#d4a0a0] text-xs uppercase tracking-wider mb-0.5">Reception</p>
                <p>{formatTime(details.receptionTime)}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    ),
    venue: () => (
      <div key="venue" className="text-center py-6">
        <p className="font-[Quicksand] text-lg font-semibold text-[#2d5016]">
          {details.venueName || 'Venue'}
        </p>
        <p className="font-[Quicksand] text-sm text-[#2d5016]/60 mt-1">
          {details.venueAddress || 'Address'}
        </p>
      </div>
    ),
    message: () =>
      details.optionalMessage ? (
        <div key="message" className="text-center py-6 px-8">
          <p className="font-[Quicksand] text-[#2d5016]/70 italic leading-relaxed">
            "{details.optionalMessage}"
          </p>
        </div>
      ) : null,
    footer: () => (
      <div key="footer" className="text-center py-8">
        <p className="font-[Quicksand] text-sm text-[#d4a0a0] tracking-wider">
          With love and joy, we hope to see you there
        </p>
      </div>
    ),
  };

  return (
    <div className="bg-[#fef9f5] min-h-full p-6 md:p-12 relative overflow-hidden">
      <FloralCorner className="absolute top-4 left-4 opacity-70" />
      <FloralCorner className="absolute top-4 right-4 opacity-70 -scale-x-100" />
      <FloralCorner className="absolute bottom-4 left-4 opacity-70 -scale-y-100" />
      <FloralCorner className="absolute bottom-4 right-4 opacity-70 -scale-x-100 -scale-y-100" />
      <div className="relative z-10">
        {sectionsOrder.map((section) => {
          const node = sections[section]?.();
          return node ? <div key={section}>{node}</div> : null;
        })}
      </div>
    </div>
  );
}
