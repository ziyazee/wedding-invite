import type { TemplateProps, SectionType } from '../../types';

function formatDate(dateStr: string): string {
  if (!dateStr) return '';
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

function formatTime(time: string): string {
  if (!time) return '';
  const [h, m] = time.split(':').map(Number);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const hour = h % 12 || 12;
  return `${hour}:${m.toString().padStart(2, '0')} ${ampm}`;
}

export default function ModernMinimal({ details, sectionsOrder }: TemplateProps) {
  const sections: Record<SectionType, () => React.ReactNode> = {
    header: () => (
      <div key="header" className="py-10">
        <p className="text-xs font-[Space_Grotesk] font-medium tracking-[0.4em] uppercase text-gray-400">
          Wedding Invitation
        </p>
      </div>
    ),
    coupleNames: () => (
      <div key="coupleNames" className="py-6">
        <h2 className="font-[Space_Grotesk] text-5xl md:text-6xl font-bold text-[#111] leading-tight">
          {details.groomName || 'Groom'}
          <br />
          <span className="font-[Inter] text-lg font-light text-gray-400">&</span>
          <br />
          {details.brideName || 'Bride'}
        </h2>
      </div>
    ),
    dateTime: () => (
      <div key="dateTime" className="py-6 border-t border-gray-200">
        <p className="font-[Inter] text-lg text-[#111] font-light">
          {formatDate(details.weddingDate)}
        </p>
        <div className="flex gap-6 mt-3 text-sm text-gray-500 font-[Inter]">
          {details.ceremonyTime && <p>Ceremony — {formatTime(details.ceremonyTime)}</p>}
          {details.receptionTime && <p>Reception — {formatTime(details.receptionTime)}</p>}
        </div>
      </div>
    ),
    venue: () => (
      <div key="venue" className="py-6 border-t border-gray-200">
        <p className="font-[Space_Grotesk] text-lg font-semibold text-[#111]">
          {details.venueName || 'Venue'}
        </p>
        <p className="font-[Inter] text-sm text-gray-500 mt-1">
          {details.venueAddress || 'Address'}
        </p>
      </div>
    ),
    message: () =>
      details.optionalMessage ? (
        <div key="message" className="py-6 border-t border-gray-200">
          <p className="font-[Inter] text-gray-600 text-sm leading-relaxed max-w-md">
            {details.optionalMessage}
          </p>
        </div>
      ) : null,
    footer: () => (
      <div key="footer" className="py-10 border-t border-gray-200">
        <p className="text-xs font-[Inter] text-gray-400 tracking-wider">
          We can't wait to celebrate with you.
        </p>
      </div>
    ),
  };

  return (
    <div className="bg-white min-h-full p-8 md:p-16">
      {sectionsOrder.map((section) => {
        const node = sections[section]?.();
        return node ? <div key={section}>{node}</div> : null;
      })}
    </div>
  );
}
