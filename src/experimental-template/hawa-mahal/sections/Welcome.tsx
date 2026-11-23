import { useRef, useMemo, useEffect, useCallback, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { HM_EASE, HM_DURATION, HM_BREAKPOINTS } from '../animations/constants';
import type { InvitationData } from '../types';

const VIDEO_SRC = '/templates/hawa-mahal-entry.mp4';
const VIDEO_POSTER = '/templates/hawa-mahal-poster.png';

gsap.registerPlugin(useGSAP, ScrollTrigger);

interface WelcomeProps {
  data: InvitationData;
}

export default function Welcome({ data }: WelcomeProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const tapButtonRef = useRef<HTMLButtonElement>(null);
  const starsRef = useRef<HTMLDivElement>(null);
  const welcomeRef = useRef<HTMLDivElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);
  const revealTimelineRef = useRef<gsap.core.Timeline | null>(null);
  const videoEndedRef = useRef(false);
  const [tapped, setTapped] = useState(false);
  const [music, setMusic] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const stars = useMemo(() => {
    return Array.from({ length: 14 }, (_, i) => ({
      id: i,
      top: `${gsap.utils.random(5, 85)}%`,
      left: `${gsap.utils.random(3, 97)}%`,
      size: gsap.utils.random(2, 4),
      duration: `${gsap.utils.random(2.5, 5)}s`,
      delay: `${gsap.utils.random(0, 4)}s`,
    }));
  }, []);

  const startReveal = useCallback(() => {
    if (videoEndedRef.current) return;
    videoEndedRef.current = true;
    revealTimelineRef.current?.play();
  }, []);

  const handleTap = useCallback(() => {
    if (tapped) return;
    setTapped(true);

    const btn = tapButtonRef.current;
    const video = videoRef.current;

    if (btn) {
      gsap.to(btn, {
        opacity: 0,
        duration: 0.4,
        ease: 'power1.out',
        onComplete: () => { btn.style.display = 'none'; },
      });
    }

    if (video) {
      video.play().catch(() => {
        const onCanPlay = () => {
          video.removeEventListener('canplay', onCanPlay);
          video.play().catch(() => startReveal());
        };
        video.addEventListener('canplay', onCanPlay);
      });
    }
  }, [tapped, startReveal]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const REVEAL_LEAD_TIME = 5.5;

    const onTimeUpdate = () => {
      if (videoEndedRef.current) return;
      const remaining = video.duration - video.currentTime;
      if (remaining <= REVEAL_LEAD_TIME) {
        video.removeEventListener('timeupdate', onTimeUpdate);
        startReveal();
      }
    };

    video.addEventListener('timeupdate', onTimeUpdate);
    video.addEventListener('ended', startReveal);

    const fallbackTimer = setTimeout(() => {
      if (!videoEndedRef.current) {
        startReveal();
      }
    }, 15000);

    return () => {
      video.removeEventListener('timeupdate', onTimeUpdate);
      video.removeEventListener('ended', startReveal);
      clearTimeout(fallbackTimer);
    };
  }, [startReveal]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          section.removeAttribute('data-hm-paused');
        } else {
          section.setAttribute('data-hm-paused', '');
        }
      },
      { threshold: 0 }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  useGSAP(() => {
    const mm = gsap.matchMedia();

    mm.add(HM_BREAKPOINTS.fullMotion, () => {
      const starsEl = starsRef.current;
      const welcomeEl = welcomeRef.current;
      const scrollIndicatorEl = scrollIndicatorRef.current;

      const revealTl = gsap.timeline({
        paused: true,
        defaults: { ease: HM_EASE.reveal },
        onStart: () => {
          if (welcomeEl) welcomeEl.style.visibility = 'visible';
        },
      });

      const allWords = sectionRef.current?.querySelectorAll('.hm-word') ?? [];

      revealTl
        .to(starsEl, {
          opacity: 1,
          visibility: 'visible',
          duration: HM_DURATION.overlayFade,
        }, 0)
        .set(welcomeEl, { visibility: 'visible' }, 0.3)
        .fromTo(allWords, {
          opacity: 0,
          y: 20,
        }, {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: HM_EASE.reveal,
          stagger: 0.35,
        }, 0.3)
        .to(scrollIndicatorEl, {
          opacity: 0.6,
          visibility: 'visible',
          duration: HM_DURATION.medium,
        }, '>');

      revealTimelineRef.current = revealTl;

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top top',
        end: '5% top',
        scrub: true,
        onUpdate: (self) => {
          if (scrollIndicatorEl) {
            const fade = Math.max(0, 0.8 * (1 - self.progress * 3));
            scrollIndicatorEl.style.opacity = String(fade);
          }
        },
      });
    });
  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} className="hm-section hm-welcome">
      <video
        ref={videoRef}
        className="hm-entry-video"
        src={VIDEO_SRC}
        poster={VIDEO_POSTER}
        muted
        playsInline
        preload="auto"
        aria-hidden="true"
      />

      {!tapped && (
        <button
          ref={tapButtonRef}
          className="hm-tap-to-open"
          onClick={handleTap}
          type="button"
        >
          Tap to Open
        </button>
      )}

      <div ref={starsRef} className="hm-welcome-stars">
        {stars.map(star => (
          <div
            key={star.id}
            className="hm-star"
            style={{
              top: star.top,
              left: star.left,
              width: `${star.size}px`,
              height: `${star.size}px`,
              '--hm-star-duration': star.duration,
              '--hm-star-delay': star.delay,
            } as React.CSSProperties}
          />
        ))}
      </div>

      {/* Couple names + date revealed after video */}
      <div ref={welcomeRef} className="hm-welcome-content-wrapper" style={{ visibility: 'hidden' }}>
        <span className="hm-couple-name hm-word">{data.groomName}</span>
        <span className="hm-couple-ampersand hm-word">&amp;</span>
        <span className="hm-couple-name hm-word">{data.brideName}</span>
        <div style={{ height: 12 }} />
        <span className="hm-welcome-date hm-word">{data.weddingDateDisplay}</span>
      </div>

      <div ref={scrollIndicatorRef} className="hm-scroll-indicator">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--hm-gold)" strokeWidth="1.5">
          <path d="M12 5v14M5 12l7 7 7-7" />
        </svg>
      </div>

      <audio ref={audioRef} loop preload="auto" onPlay={() => setMusic(true)} onPause={() => setMusic(false)} />
      <button
        className="hm-music"
        aria-label={music ? 'Pause music' : 'Play music'}
        onClick={() => music ? audioRef.current?.pause() : void audioRef.current?.play().catch(() => {})}
      >
        {music ? 'Ⅱ' : '♫'}
      </button>
    </section>
  );
}
