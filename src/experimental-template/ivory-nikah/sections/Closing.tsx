/**
 * Ivory Nikah — Closing Section
 *
 * A gracious farewell. Simple, warm, final. The quietest section —
 * reduced ornaments, vine borders return at lower opacity.
 */
import type { WeddingData } from '../types';
import { GoldDividerA } from '../assets/svg';
import { AmbientLayer } from '../animations/AmbientLayer';
import { closingPetals } from '../animations/petalData';

const vineUrl = new URL('../assets/images/decorative/floral-vine-border.png', import.meta.url).href;

interface ClosingProps {
  data: WeddingData;
  reducedMotion: boolean;
}

export function Closing({ data, reducedMotion }: ClosingProps) {
  return (
    <section className="in-section in-section--ivory in-section--closing">
      <div className="in-section__bg" />

      {/* Vine borders at reduced opacity (0.4 set in CSS) */}
      <div className="in-vine-border in-vine-border--left">
        <img src={vineUrl} alt="" draggable={false} />
      </div>
      <div className="in-vine-border in-vine-border--right">
        <img src={vineUrl} alt="" draggable={false} />
      </div>

      {/* Ambient petals */}
      <AmbientLayer petals={closingPetals} reducedMotion={reducedMotion} />

      <div className="in-section__content">
        <p className="in-closing__love in-reveal-child">
          With love &amp; prayers
        </p>

        <h2 className="in-closing__names in-reveal-child">
          {data.couple.brideName} &amp; {data.couple.groomName}
        </h2>

        <div className="in-reveal-child" style={{ marginBottom: 24 }}>
          <GoldDividerA style={{ maxWidth: 200, width: '100%', margin: '0 auto' }} />
        </div>

        <p className="in-closing__message in-reveal-child">
          We look forward to celebrating with you
        </p>

        {data.tagline && (
          <p className="in-closing__hashtag in-reveal-child">
            #{data.couple.brideName}{data.couple.groomName}
          </p>
        )}
      </div>
    </section>
  );
}
