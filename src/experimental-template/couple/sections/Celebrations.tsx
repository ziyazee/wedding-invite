import { useRef, useEffect } from 'react';
import type { CelebrationEvent } from '../types';
import { GoldDividerB, CardCorner, LotusOrnament, MandalaPattern } from '../assets/svg';
import { GoldSparkles } from '../animations/GoldSparkles';

interface CelebrationsProps {
  celebrations: CelebrationEvent[];
  reducedMotion: boolean;
}

function formatEventDate(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

export function Celebrations({ celebrations, reducedMotion }: CelebrationsProps) {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (reducedMotion) return;

    let ctx: { revert: () => void } | null = null;
    let cancelled = false;

    (async () => {
      try {
        const [gsapModule, stModule] = await Promise.all([
          import('gsap'),
          import('gsap/ScrollTrigger'),
        ]);
        if (cancelled) return;

        const gsap = gsapModule.default || gsapModule.gsap || gsapModule;
        const ScrollTrigger = stModule.ScrollTrigger || stModule.default || stModule;
        gsap.registerPlugin(ScrollTrigger);

        ctx = gsap.context(() => {
          const cards = sectionRef.current?.querySelectorAll('.cp-event-card');
          if (!cards?.length) return;

          cards.forEach((card: Element, i: number) => {
            const mandala = card.querySelector('.cp-event-card__mandala');

            if (mandala) {
              const dir = i % 2 === 0 ? 1 : -1;
              gsap.fromTo(
                mandala,
                { y: 80, rotation: 0, scale: 0.9 },
                {
                  y: -80,
                  rotation: dir * 90,
                  scale: 1.1,
                  ease: 'none',
                  scrollTrigger: {
                    trigger: card,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: 0.5,
                  },
                },
              );
            }

          });
        }, sectionRef);
      } catch {
        /* gsap unavailable */
      }
    })();

    return () => {
      cancelled = true;
      ctx?.revert();
    };
  }, [reducedMotion]);

  return (
    <section ref={sectionRef} className="cp-section cp-section--celebrations">
      <GoldSparkles count={14} reducedMotion={reducedMotion} />

      <div className="cp-section__content">
        <div className="cp-reveal-child cp-celebrations__header">
          <GoldDividerB style={{ maxWidth: 160, width: '100%' }} className="cp-shimmer cp-shimmer--slow" />
          <h2 className="cp-section__title">Celebrations</h2>
          <GoldDividerB style={{ maxWidth: 160, width: '100%' }} className="cp-shimmer cp-shimmer--slow cp-shimmer--delay-2" />
        </div>

        <div className="cp-celebrations__list">
          {celebrations.map((event, i) => (
            <article key={event.id} className="cp-reveal-child cp-event-card">
              {/* Cultural parallax layers */}
              <MandalaPattern
                className={`cp-event-card__mandala ${i % 2 === 0 ? 'cp-event-card__mandala--left' : 'cp-event-card__mandala--right'}`}
                style={{ width: 340 }}
              />

              <CardCorner className="cp-event-card__corner cp-event-card__corner--tl" style={{ width: 40 }} corner="tl" />
              <CardCorner className="cp-event-card__corner cp-event-card__corner--tr" style={{ width: 40 }} corner="tr" />
              <CardCorner className="cp-event-card__corner cp-event-card__corner--bl" style={{ width: 40 }} corner="bl" />
              <CardCorner className="cp-event-card__corner cp-event-card__corner--br" style={{ width: 40 }} corner="br" />

              <div className="cp-event-card__inner">
                <h3 className="cp-event-card__title">{event.title}</h3>

                <div className="cp-event-card__title-ornament">
                  <span className="cp-event-card__title-line" />
                  <LotusOrnament style={{ width: 24, height: 'auto' }} />
                  <span className="cp-event-card__title-line" />
                </div>

                <p className="cp-event-card__date">{formatEventDate(event.date)}</p>
                <p className="cp-event-card__time">{event.time}</p>

                <div className="cp-event-card__separator" />

                <p className="cp-event-card__venue">{event.venue}</p>
                <p className="cp-event-card__address">{event.address}</p>

                {event.description && (
                  <p className="cp-event-card__description">{event.description}</p>
                )}

                {event.dressCode && (
                  <div className="cp-event-card__dress">
                    <span className="cp-event-card__dress-label">Dress Code</span>
                    <span className="cp-event-card__dress-value">{event.dressCode}</span>
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
