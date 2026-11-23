import { useRef, useCallback, useState, useEffect } from 'react';
import type { WeddingData } from '../types';

const videoUrl = new URL('../../public/couple.mp4', import.meta.url).href;

interface OpeningProps {
  data: WeddingData;
  reducedMotion: boolean;
}

export function Opening({ data, reducedMotion }: OpeningProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [phase, setPhase] = useState<'waiting' | 'playing' | 'open'>(
    reducedMotion ? 'open' : 'waiting',
  );

  const handleTap = useCallback(async () => {
    if (phase !== 'waiting') return;
    const video = videoRef.current;
    if (!video) return;

    setPhase('playing');

    const attemptPlay = () => {
      video.play().catch(() => {});
    };
    video.addEventListener('canplay', attemptPlay);
    if (video.readyState >= 3) attemptPlay();
    else video.load();

    try {
      const gsapModule = await import('gsap');
      const gsap = gsapModule.default || gsapModule.gsap || gsapModule;

      const tl = gsap.timeline();

      tl.to('.cp-opening__cta', { opacity: 0, duration: 0.4, ease: 'power1.out', pointerEvents: 'none' }, 0)
        .fromTo('.cp-opening__bride-name', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 1.2, ease: 'power2.out' }, 7.2)
        .fromTo('.cp-opening__ampersand', { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, 8.0)
        .fromTo('.cp-opening__groom-name', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 1.2, ease: 'power2.out' }, 8.2)
        .fromTo('.cp-opening__divider', { opacity: 0, scaleX: 0 }, { opacity: 1, scaleX: 1, duration: 0.6, ease: 'power2.out' }, 8.8)
        .fromTo('.cp-opening__date', { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }, 9.0);
    } catch {
      /* gsap failed — show everything */
      setPhase('open');
    }
  }, [phase]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onTimeUpdate = () => {
      if (video.duration && video.currentTime >= video.duration - 1) {
        video.pause();
        setPhase('open');
      }
    };
    video.addEventListener('timeupdate', onTimeUpdate);
    video.addEventListener('ended', () => setPhase('open'));
    return () => {
      video.removeEventListener('timeupdate', onTimeUpdate);
    };
  }, []);

  const formattedDate = formatWeddingDate(data.weddingDate);
  const vis = reducedMotion || phase === 'open' ? { opacity: 1 } : undefined;

  return (
    <section ref={sectionRef} className="cp-opening">
      <video
        ref={videoRef}
        className="cp-opening__video"
        src={videoUrl}
        muted
        playsInline
        preload="metadata"
      />

      <div className="cp-opening__overlay" />

      <div className="cp-opening__content">
        <h1 className="cp-opening__bride-name" style={vis}>
          {data.couple.brideName}
        </h1>

        <p className="cp-opening__ampersand" style={vis}>&amp;</p>

        <h1 className="cp-opening__groom-name" style={vis}>
          {data.couple.groomName}
        </h1>

        <div className="cp-opening__divider" style={vis} />

        <p className="cp-opening__date" style={vis}>{formattedDate}</p>
      </div>

      {phase === 'waiting' && (
        <button
          className="cp-opening__cta"
          onClick={handleTap}
          type="button"
        >
          Tap to Enter
        </button>
      )}

      {phase === 'open' && (
        <div className="cp-opening__scroll-hint">
          <span className="cp-opening__scroll-text">Scroll Down</span>
          <svg className="cp-opening__scroll-arrow" width="16" height="24" viewBox="0 0 16 24" aria-hidden="true">
            <path d="M8 0v20M2 15l6 7 6-7" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
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
