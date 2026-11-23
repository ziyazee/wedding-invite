import React, { useRef, useState, useCallback, useEffect } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollIndicator, IconMusic } from '../assets/svg';
import type { CoupleInfo } from '../types';
import posterImage from '../assets/images/muslim-couple-poster.jpg';

interface WelcomeProps {
  couple: CoupleInfo;
  musicUrl?: string;
  onOpen: () => void;
  isOpen: boolean;
  isPlaying: boolean;
  onMusicToggle: () => void;
}

/**
 * Section 1: Welcome / Entry Screen
 * Full-viewport video background with tap-to-open gate,
 * per-word name reveal via video timeupdate, music button,
 * and scroll indicator.
 */
const Welcome: React.FC<WelcomeProps> = ({
  couple,
  musicUrl,
  onOpen,
  isOpen,
  isPlaying,
  onMusicToggle,
}) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const nameWordsRef = useRef<(HTMLSpanElement | null)[]>([]);
  const tapBtnRef = useRef<HTMLButtonElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const musicBtnRef = useRef<HTMLButtonElement>(null);
  const hasRevealedRef = useRef(false);
  const [videoReady, setVideoReady] = useState(false);

  // Build the name words: "Groom & Bride Date"
  const nameText = `${couple.groom} & ${couple.bride}`;
  const nameWords = nameText.split(' ');
  const words = [...nameWords, couple.weddingDate ?? ''];

  // Video canplay handler with retry
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleCanPlay = () => {
      setVideoReady(true);
    };

    video.addEventListener('canplay', handleCanPlay);

    // 15s fallback if video never loads
    const fallbackTimer = window.setTimeout(() => {
      if (!videoReady) {
        setVideoReady(true);
      }
    }, 15000);

    return () => {
      video.removeEventListener('canplay', handleCanPlay);
      window.clearTimeout(fallbackTimer);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Per-word name reveal via video timeupdate
  // Last word must finish 1s before video ends
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !isOpen || hasRevealedRef.current) return;

    const wordCount = words.length;
    const WORD_DURATION = 1; // each word fade-in
    const WORD_STAGGER = 0.35;
    const BUFFER = 1; // finish 1s before video ends

    let triggerTime: number | null = null;
    let revealStarted = false;

    const totalRevealDuration = WORD_DURATION + WORD_STAGGER * (wordCount - 1);

    const handleTimeUpdate = () => {
      const duration = video.duration;
      if (!duration || !isFinite(duration)) return;

      if (triggerTime === null) {
        triggerTime = duration - totalRevealDuration - BUFFER;
        if (triggerTime < 0.5) triggerTime = 0.5;
      }

      if (video.currentTime >= triggerTime && !revealStarted) {
        revealStarted = true;
        hasRevealedRef.current = true;

        words.forEach((_w, i) => {
          const el = nameWordsRef.current[i];
          if (el) {
            gsap.to(el, {
              opacity: 1,
              y: 0,
              duration: WORD_DURATION,
              delay: i * WORD_STAGGER,
              ease: 'power2.out',
            });
          }
        });

        video.removeEventListener('timeupdate', handleTimeUpdate);
      }
    };

    video.addEventListener('timeupdate', handleTimeUpdate);

    // 15s fallback — force reveal if video is too long or stalls
    const fallback = window.setTimeout(() => {
      if (!hasRevealedRef.current) {
        hasRevealedRef.current = true;
        words.forEach((_w, i) => {
          const el = nameWordsRef.current[i];
          if (el) {
            gsap.to(el, {
              opacity: 1,
              y: 0,
              duration: WORD_DURATION,
              delay: i * WORD_STAGGER,
              ease: 'power2.out',
            });
          }
        });
      }
    }, 15000);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      window.clearTimeout(fallback);
    };
  }, [isOpen, words]);

  // Reduced motion: show everything immediately
  useGSAP(
    () => {
      gsap.matchMedia().add('(prefers-reduced-motion: reduce)', () => {
        nameWordsRef.current.forEach((el) => {
          if (el) gsap.set(el, { opacity: 1, y: 0 });
        });
        if (scrollRef.current) gsap.set(scrollRef.current, { opacity: 0.8 });
      });
    },
    { scope: sectionRef }
  );

  // Scroll indicator gentle bounce (only after opened)
  useGSAP(
    () => {
      if (!isOpen || !scrollRef.current) return;

      gsap.matchMedia().add('(prefers-reduced-motion: no-preference)', () => {
        gsap.to(scrollRef.current, {
          opacity: 0.8,
          duration: 0.6,
          ease: 'power2.out',
        });

        gsap.to(scrollRef.current, {
          y: 6,
          duration: 1.2,
          ease: 'sine.inOut',
          yoyo: true,
          repeat: -1,
        });
      });
    },
    { scope: sectionRef, dependencies: [isOpen] }
  );

  // Tap-to-open handler — fade button, play video, notify parent
  const handleTapOpen = useCallback(() => {
    if (isOpen) return;

    if (tapBtnRef.current) {
      gsap.to(tapBtnRef.current, {
        opacity: 0,
        scale: 0.9,
        duration: 0.4,
        ease: 'power2.in',
      });
    }

    const video = videoRef.current;
    if (video) {
      video.play().catch(() => {
        video.muted = true;
        video.play().catch(() => {});
      });
    }

    onOpen();
  }, [isOpen, onOpen]);

  return (
    <section
      ref={sectionRef}
      className="mc-section mc-section-welcome"
      aria-label="Welcome"
    >
      {/* Video background */}
      <video
        ref={videoRef}
        className="mc-entry-video"
        src="/experimental-template/muslim-couple.mp4"
        poster={posterImage}
        playsInline
        muted
        preload="auto"
      />

      {/* Top gradient overlay */}
      <div className="mc-entry-overlay-top" />

      {/* Per-word name reveal */}
      <div className="mc-entry-names">
        <div
          className="mc-font-display"
          style={{
            color: 'var(--mc-text-on-dark)',
            textShadow: '0 2px 12px rgba(0,0,0,0.3)',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '0 10px',
          }}
        >
          {words.map((word, i) => (
            <span
              key={`${word}-${i}`}
              ref={(el) => {
                nameWordsRef.current[i] = el;
              }}
              className="mc-entry-word"
              style={{ display: 'inline-block', transform: 'translateY(20px)' }}
            >
              {word}
            </span>
          ))}
        </div>
      </div>

      {/* Tap-to-open button */}
      {!isOpen && (
        <button
          ref={tapBtnRef}
          className="mc-entry-tap-btn"
          onClick={handleTapOpen}
          aria-label="Open invitation"
          style={{ opacity: videoReady ? 1 : 0.5 }}
        >
          Tap to Open
        </button>
      )}

      {/* Music button — always visible */}
      {musicUrl && (
        <button
          ref={musicBtnRef}
          className="mc-ui-music-btn"
          onClick={onMusicToggle}
          aria-label={isPlaying ? 'Pause music' : 'Play music'}
        >
          <IconMusic
            variant={isPlaying ? 'pause' : 'note'}
            style={{ width: 20, height: 20 }}
          />
        </button>
      )}

      {/* Scroll indicator */}
      {isOpen && (
        <div ref={scrollRef} className="mc-entry-scroll-indicator">
          <ScrollIndicator style={{ width: 24, height: 12 }} />
        </div>
      )}
    </section>
  );
};

export default Welcome;
