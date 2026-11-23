/**
 * Ivory Nikah — Celebrations Section
 *
 * Practical event information presented beautifully. Each ceremony
 * (Mehndi, Nikah, Walima) gets its own distinct card with corner
 * ornaments and gold accents.
 */
import type { CelebrationEvent } from '../types';
import { GoldDividerB, GoldDiamond } from '../assets/svg';
import { AmbientLayer } from '../animations/AmbientLayer';
import { celebrationsPetals } from '../animations/petalData';

const cornerUrl = new URL('../assets/images/decorative/floral-corner.png', import.meta.url).href;

interface CelebrationsProps {
  celebrations: CelebrationEvent[];
  reducedMotion: boolean;
}

export function Celebrations({ celebrations, reducedMotion }: CelebrationsProps) {
  return (
    <section className="in-section in-section--clear in-section--celebrations">
      {/* Ambient petals */}
      <AmbientLayer petals={celebrationsPetals} reducedMotion={reducedMotion} />

      {/* Section header */}
      <div className="in-section__content in-section__header">
        <h2 className="in-text-heading in-reveal-child" style={{ marginBottom: 16 }}>
          Celebrations
        </h2>
        <div className="in-reveal-child" style={{ marginBottom: 40 }}>
          <GoldDividerB style={{ maxWidth: 200, width: '100%', margin: '0 auto' }} />
        </div>
      </div>

      {/* Event cards */}
      <div className="in-section__content" style={{ maxWidth: 420 }}>
        {celebrations.map((event, i) => {
          const isNikah = event.title.toLowerCase().includes('nikah');
          return (
            <div key={event.id}>
              <div
                className={`in-celebration-card ${isNikah ? 'in-celebration-card--nikah' : ''}`}
              >
                {/* Corner ornaments */}
                <CornerOrnaments />

                {/* Card content */}
                <div style={{ position: 'relative', zIndex: 1 }}>
                  <h3 className="in-celebration-card__name in-reveal-child">
                    {event.title}
                  </h3>

                  <div className="in-celebration-card__divider in-reveal-child">
                    <GoldDividerB style={{ maxWidth: 140, width: '100%', margin: '0 auto' }} />
                  </div>

                  <p className="in-celebration-card__date in-reveal-child">
                    {formatEventDate(event.date)}
                  </p>

                  <p className="in-celebration-card__time in-reveal-child">
                    {event.time}
                  </p>

                  <p className="in-celebration-card__venue in-reveal-child">
                    {event.venue}
                  </p>

                  <p className="in-celebration-card__address in-reveal-child">
                    {event.address}
                  </p>

                  {event.description && (
                    <p className="in-celebration-card__desc in-reveal-child">
                      {event.description}
                    </p>
                  )}
                </div>
              </div>

              {/* Diamond separator between cards */}
              {i < celebrations.length - 1 && (
                <div className="in-card-separator">
                  <GoldDiamond size={6} />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

function CornerOrnaments() {
  return (
    <>
      <img className="in-floral-corner in-floral-corner--tl" src={cornerUrl} alt="" draggable={false} />
      <img className="in-floral-corner in-floral-corner--tr" src={cornerUrl} alt="" draggable={false} />
      <img className="in-floral-corner in-floral-corner--bl" src={cornerUrl} alt="" draggable={false} />
      <img className="in-floral-corner in-floral-corner--br" src={cornerUrl} alt="" draggable={false} />
    </>
  );
}

function formatEventDate(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });
}
