/**
 * Ivory Nikah — Opening Section
 *
 * Closed Mughal palace doors fill the entire viewport. User taps to open.
 * Doors swing apart with 3D perspective, revealing Bismillah + couple names.
 * Arch frame overlays the content after doors clear.
 */
import { useRef, useCallback, useState } from 'react';
import type { WeddingData } from '../types';
import { GoldDividerA } from '../assets/svg';

const archFrameUrl = new URL('../assets/images/decorative/arch-frame.png', import.meta.url).href;
const doorLeftUrl = new URL('../assets/images/decorative/door-left.png', import.meta.url).href;

interface OpeningProps {
  data: WeddingData;
  reducedMotion: boolean;
}

export function Opening({ data, reducedMotion }: OpeningProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const [phase, setPhase] = useState<'closed' | 'opening' | 'open'>(
    reducedMotion ? 'open' : 'closed',
  );

  const handleOpen = useCallback(async () => {
    if (phase !== 'closed' || !sectionRef.current) return;
    setPhase('opening');

    try {
      const gsapModule = await import('gsap');
      const gsap = gsapModule.default || gsapModule.gsap;

      const section = sectionRef.current;
      const doorLeft = section.querySelector('.in-door--left');
      const doorRight = section.querySelector('.in-door--right');

      if (!doorLeft || !doorRight) {
        setPhase('open');
        return;
      }

      gsap.set(doorLeft, {
        rotateY: 0,
        transformOrigin: 'left center',
        transformPerspective: 1000,
        willChange: 'transform',
      });
      gsap.set(doorRight, {
        rotateY: 0,
        scaleX: -1,
        transformOrigin: 'right center',
        transformPerspective: 1000,
        willChange: 'transform',
      });

      const tl = gsap.timeline({
        onComplete: () => setPhase('open'),
      });

      const doorEase = 'cubic-bezier(0.16, 1, 0.3, 1)';

      tl
        .to(doorLeft, { rotateY: -105, duration: 2.2, ease: doorEase }, 0)
        .to(doorRight, { rotateY: 105, scaleX: -1, duration: 2.2, ease: doorEase }, 0)
        .to('.in-opening__bismillah', { opacity: 1, duration: 0.6, ease: 'power1.out' }, 0.6)
        .to('.in-opening__divider', { opacity: 1, duration: 0.4, ease: 'power1.out' }, 0.8)
        .to('.in-opening__bride-name', { opacity: 1, duration: 0.6, ease: 'power1.out' }, 1.0)
        .to('.in-opening__ampersand', { opacity: 1, duration: 0.5, ease: 'power1.out' }, 1.2)
        .to('.in-opening__groom-name', { opacity: 1, duration: 0.6, ease: 'power1.out' }, 1.3)
        .to('.in-opening__date', { opacity: 1, duration: 0.6, ease: 'power1.out' }, 1.6)
        .to([doorLeft, doorRight], { opacity: 0, duration: 0.5, ease: 'power1.out' }, 2.0);
    } catch {
      setPhase('open');
    }
  }, [phase]);

  const formattedDate = formatWeddingDate(data.weddingDate);
  const showDoors = phase !== 'open' && !reducedMotion;

  return (
    <section ref={sectionRef} className="in-opening">
      {/* Arch frame — behind doors when closed, visible after open */}
      <div className="in-opening__arch">
        <img src={archFrameUrl} alt="" draggable={false} />
      </div>

      {/* Content revealed behind doors */}
      <div className="in-opening__content">
        <p className="in-opening__bismillah" style={reducedMotion ? { opacity: 1 } : undefined}>
          {data.bismillah}
        </p>

        <div className="in-opening__divider" style={reducedMotion ? { opacity: 1 } : undefined}>
          <GoldDividerA style={{ maxWidth: 200, width: '100%' }} />
        </div>

        <h1 className="in-opening__bride-name" style={reducedMotion ? { opacity: 1 } : undefined}>
          {data.couple.brideName}
        </h1>

        <p className="in-opening__ampersand" style={reducedMotion ? { opacity: 1 } : undefined}>
          &amp;
        </p>

        <h1 className="in-opening__groom-name" style={reducedMotion ? { opacity: 1 } : undefined}>
          {data.couple.groomName}
        </h1>

        <p className="in-opening__date" style={reducedMotion ? { opacity: 1 } : undefined}>
          {formattedDate}
        </p>
      </div>

      {/* Full-screen door overlay — tap to open */}
      {showDoors && (
        <>
          <div className="in-door-wrap" onClick={handleOpen} role="button" tabIndex={0}>
            <div
              className="in-door in-door--left"
              style={{ backgroundImage: `url(${doorLeftUrl})` }}
            />
            <div
              className="in-door in-door--right"
              style={{ backgroundImage: `url(${doorLeftUrl})` }}
            />
          </div>
          {phase === 'closed' && (
            <div className="in-door-cta" onClick={handleOpen}>Tap to Open</div>
          )}
        </>
      )}
    </section>
  );
}

function formatWeddingDate(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}
