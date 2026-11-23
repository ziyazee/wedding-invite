/**
 * Ivory Nikah — Couple & Family Section
 *
 * Introduces the families with floral vine borders framing both sides.
 * Vertically stacked text in the narrow content column.
 */
import type { WeddingData } from '../types';
import { GoldDividerB } from '../assets/svg';
import { AmbientLayer } from '../animations/AmbientLayer';
import { couplePetals } from '../animations/petalData';

const vineUrl = new URL('../assets/images/decorative/floral-vine-border.png', import.meta.url).href;

interface CoupleProps {
  data: WeddingData;
  reducedMotion: boolean;
}

export function Couple({ data, reducedMotion }: CoupleProps) {
  return (
    <section className="in-section in-section--ivory in-section--couple">
      <div className="in-section__bg" />

      {/* Vine borders (hidden on mobile via CSS) */}
      <div className="in-vine-border in-vine-border--left">
        <img src={vineUrl} alt="" draggable={false} />
      </div>
      <div className="in-vine-border in-vine-border--right">
        <img src={vineUrl} alt="" draggable={false} />
      </div>

      {/* Ambient petals */}
      <AmbientLayer petals={couplePetals} reducedMotion={reducedMotion} />

      <div className="in-section__content">
        <p className="in-text-body in-text-body--light in-reveal-child">
          Together with their families
        </p>

        <div className="in-reveal-child" style={{ margin: '24px auto 32px' }}>
          <GoldDividerB style={{ maxWidth: 200, width: '100%', margin: '0 auto' }} />
        </div>

        <p className="in-text-subtitle in-reveal-child" style={{ marginBottom: 4 }}>
          {data.couple.brideFatherName && data.couple.brideMotherName
            ? `Mr. & Mrs. ${data.couple.brideFatherName}`
            : data.couple.brideFamily}
        </p>

        <p className="in-text-body in-text-body--light in-reveal-child" style={{ marginBottom: 24 }}>
          request the honour of your presence{'\n'}at the marriage of their daughter
        </p>

        <h2 className="in-couple__bride-name in-reveal-child" style={{ marginBottom: 12 }}>
          {data.couple.brideName}
        </h2>

        <p className="in-couple__connector in-reveal-child">to</p>

        <h2 className="in-couple__groom-name in-reveal-child" style={{ marginBottom: 24, marginTop: 12 }}>
          {data.couple.groomName}
        </h2>

        <p className="in-text-body in-text-body--light in-reveal-child" style={{ marginBottom: 8 }}>
          son of
        </p>

        <p className="in-text-subtitle in-reveal-child">
          {data.couple.groomFatherName && data.couple.groomMotherName
            ? `Mr. & Mrs. ${data.couple.groomFatherName}`
            : data.couple.groomFamily}
        </p>

        {data.personalNote && (
          <>
            <div className="in-reveal-child" style={{ margin: '32px auto' }}>
              <GoldDividerB style={{ maxWidth: 140, width: '100%', margin: '0 auto' }} />
            </div>
            <p
              className="in-text-body in-text-body--light in-reveal-child"
              style={{ fontStyle: 'italic', maxWidth: 340, margin: '0 auto' }}
            >
              {data.personalNote}
            </p>
          </>
        )}
      </div>
    </section>
  );
}
