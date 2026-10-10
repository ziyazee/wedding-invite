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

export default function ClassicElegant({ details, sectionsOrder }: TemplateProps) {
  const sections: Record<SectionType, () => React.ReactNode> = {
    header: () => (
      <div key="header" className="text-center py-8">
        <div className="w-16 h-px bg-[#c9a84c] mx-auto mb-4" />
        <p className="text-sm tracking-[0.3em] uppercase text-[#c9a84c] font-[Lora]">
          Together with their families
        </p>
        <div className="w-16 h-px bg-[#c9a84c] mx-auto mt-4" />
      </div>
    ),
    coupleNames: () => (
      <div key="coupleNames" className="text-center py-6">
        <h2 className="font-[Playfair_Display] text-4xl md:text-5xl font-bold text-[#1a1a2e] mb-2">
          {details.groomName || 'Groom'}
        </h2>
        <p className="font-[Lora] text-xl text-[#c9a84c] italic my-3">&amp;</p>
        <h2 className="font-[Playfair_Display] text-4xl md:text-5xl font-bold text-[#1a1a2e]">
          {details.brideName || 'Bride'}
        </h2>
      </div>
    ),
    dateTime: () => (
      <div key="dateTime" className="text-center py-6">
        <p className="text-sm tracking-[0.2em] uppercase text-[#1a1a2e] font-[Lora] mb-2">
          Request the pleasure of your company
        </p>
        <p className="font-[Playfair_Display] text-2xl text-[#1a1a2e] font-semibold mb-3">
          {formatDate(details.weddingDate)}
        </p>
        <div className="flex justify-center gap-8 text-sm text-[#1a1a2e] font-[Lora]">
          {details.ceremonyTime && (
            <div>
              <p className="text-[#c9a84c] text-xs uppercase tracking-wider mb-1">Ceremony</p>
              <p>{formatTime(details.ceremonyTime)}</p>
            </div>
          )}
          {details.receptionTime && (
            <div>
              <p className="text-[#c9a84c] text-xs uppercase tracking-wider mb-1">Reception</p>
              <p>{formatTime(details.receptionTime)}</p>
            </div>
          )}
        </div>
      </div>
    ),
    venue: () => (
      <div key="venue" className="text-center py-6">
        <div className="w-8 h-px bg-[#c9a84c] mx-auto mb-4" />
        <p className="font-[Playfair_Display] text-xl text-[#1a1a2e] font-semibold">
          {details.venueName || 'Venue'}
        </p>
        <p className="font-[Lora] text-sm text-gray-600 mt-1">
          {details.venueAddress || 'Address'}
        </p>
      </div>
    ),
    message: () =>
      details.optionalMessage ? (
        <div key="message" className="text-center py-6 px-8">
          <div className="w-8 h-px bg-[#c9a84c] mx-auto mb-4" />
          <p className="font-[Lora] text-gray-600 italic leading-relaxed">
            "{details.optionalMessage}"
          </p>
        </div>
      ) : null,
    footer: () => (
      <div key="footer" className="text-center py-8">
        <div className="w-16 h-px bg-[#c9a84c] mx-auto mb-4" />
        <p className="text-xs tracking-[0.3em] uppercase text-[#c9a84c] font-[Lora]">
          We look forward to celebrating with you
        </p>
      </div>
    ),
  };

  return (
    <div className="bg-[#fdf8f0] min-h-full border border-[#e8dcc8] p-8 md:p-12">
      <div className="border border-[#c9a84c]/30 p-6 md:p-10">
        {sectionsOrder.map((section) => {
          const node = sections[section]?.();
          return node ? <div key={section}>{node}</div> : null;
        })}
      </div>
    </div>
  );
}
