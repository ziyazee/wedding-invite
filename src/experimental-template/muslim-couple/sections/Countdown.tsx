import React, { useRef, useState, useEffect, useCallback } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import {
  Lantern,
  FourPointStar,
  ArabesqueFlourish,
  GoldDivider,
  GeometricPattern,
  LanternFrame,
} from '../assets/svg';
import { useAmbientPause } from '../animations/useAmbientAnimation';
import { createLanternGlowTimeline, createSparkleTimeline } from '../animations/ambientElements';
import type { CoupleInfo } from '../types';

interface CountdownProps {
  couple: CoupleInfo;
  isOpen: boolean;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function computeTimeLeft(targetDate: string): TimeLeft {
  const target = new Date(targetDate).getTime();
  const now = Date.now();
  const diff = Math.max(0, target - now);

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

/**
 * Section 3: Countdown
 * Live countdown timer in a frosted glass card,
 * flanked by lanterns with glow, sparkles.
 */
const Countdown: React.FC<CountdownProps> = ({ couple, isOpen }) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const lanternGlowLeftRef = useRef<HTMLDivElement>(null);
  const lanternGlowRightRef = useRef<HTMLDivElement>(null);
  const sparkleRefs = useRef<(HTMLDivElement | null)[]>([]);
  const timelinesRef = useRef<gsap.core.Timeline[]>([]);

  const [timeLeft, setTimeLeft] = useState<TimeLeft>(() =>
    computeTimeLeft(couple.weddingDate)
  );

  // Live countdown tick
  useEffect(() => {
    const interval = window.setInterval(() => {
      setTimeLeft(computeTimeLeft(couple.weddingDate));
    }, 1000);
    return () => window.clearInterval(interval);
  }, [couple.weddingDate]);

  const padTwo = useCallback((n: number) => String(n).padStart(2, '0'), []);

  // Section entry animation
  useGSAP(
    () => {
      if (!isOpen) return;

      gsap.matchMedia().add('(prefers-reduced-motion: no-preference)', () => {
        gsap.fromTo(
          '.mc-countdown-content',
          { opacity: 0, scale: 0.97 },
          {
            opacity: 1,
            scale: 1,
            duration: 0.8,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 80%',
              once: true,
            },
          }
        );

        // Countdown card clip-path reveal
        gsap.fromTo(
          '.mc-card-countdown',
          { clipPath: 'inset(0 50% 0 50%)' },
          {
            clipPath: 'inset(0 0% 0 0%)',
            duration: 0.9,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 65%',
              once: true,
            },
          }
        );
      });
    },
    { scope: sectionRef, dependencies: [isOpen] }
  );

  // Ambient: lantern glow + sparkles
  useGSAP(
    () => {
      if (!isOpen) return;

      gsap.matchMedia().add('(prefers-reduced-motion: no-preference)', () => {
        const tls: gsap.core.Timeline[] = [];

        if (lanternGlowLeftRef.current) {
          tls.push(createLanternGlowTimeline(lanternGlowLeftRef.current));
        }
        if (lanternGlowRightRef.current) {
          tls.push(createLanternGlowTimeline(lanternGlowRightRef.current));
        }

        sparkleRefs.current.forEach((el) => {
          if (el) tls.push(createSparkleTimeline(el));
        });

        timelinesRef.current = tls;
      });
    },
    { scope: sectionRef, dependencies: [isOpen] }
  );

  useAmbientPause(
    sectionRef,
    () => timelinesRef.current,
    () => [lanternGlowLeftRef.current, lanternGlowRightRef.current, ...sparkleRefs.current]
  );

  const columns: { value: string; label: string }[] = [
    { value: padTwo(timeLeft.days), label: 'Days' },
    { value: padTwo(timeLeft.hours), label: 'Hours' },
    { value: padTwo(timeLeft.minutes), label: 'Min' },
    { value: padTwo(timeLeft.seconds), label: 'Sec' },
  ];

  return (
    <section
      ref={sectionRef}
      className="mc-section mc-section-countdown"
      aria-label="Countdown"
    >
      {/* Rich geometric background */}
      <div aria-hidden="true" style={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none', opacity: 0.6 }}>
        <GeometricPattern />
      </div>

      {/* Decorative lantern frames on sides */}
      <div aria-hidden="true" style={{ position: 'absolute', left: 0, top: '10%', zIndex: 1, pointerEvents: 'none', opacity: 0.5 }}>
        <LanternFrame side="left" />
      </div>
      <div aria-hidden="true" style={{ position: 'absolute', right: 0, top: '10%', zIndex: 1, pointerEvents: 'none', opacity: 0.5 }}>
        <LanternFrame side="right" />
      </div>

      {/* Sparkles */}
      <div className="mc-ambient-container" aria-hidden="true">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <div
            key={`sparkle-cd-${i}`}
            ref={(el) => { sparkleRefs.current[i] = el; }}
            className="mc-decor-sparkle"
            style={{
              left: `${10 + i * 15}%`,
              top: `${20 + (i % 3) * 25}%`,
            }}
          >
            <FourPointStar
              variant={i % 2 === 0 ? 'gold' : 'white'}
              style={{ width: 8, height: 8 }}
            />
          </div>
        ))}
      </div>

      <div className="mc-countdown-content">
        <h2 className="mc-countdown-title mc-font-h1">
          Counting the Days
        </h2>

        <div className="mc-celebrations-flourish" aria-hidden="true">
          <ArabesqueFlourish variant="wide" style={{ width: 120, height: 20, color: 'var(--mc-gold)' }} />
        </div>

        {/* Countdown card */}
        <div className="mc-card-countdown" style={{ position: 'relative' }}>
          {/* Left lantern */}
          <div className="mc-decor-lantern-left" aria-hidden="true" style={{ position: 'relative' }}>
            <Lantern variant="large" style={{ width: 24, height: 40 }} />
            <div ref={lanternGlowLeftRef} className="mc-anim-lantern-glow" />
          </div>

          {/* Right lantern */}
          <div className="mc-decor-lantern-right" aria-hidden="true" style={{ position: 'relative' }}>
            <Lantern variant="large" style={{ width: 24, height: 40 }} />
            <div ref={lanternGlowRightRef} className="mc-anim-lantern-glow" />
          </div>

          {/* Countdown grid */}
          <div className="mc-countdown-grid" role="timer" aria-live="polite">
            {columns.map((col) => (
              <div key={col.label} className="mc-countdown-column">
                <span className="mc-countdown-number mc-font-countdown">
                  {col.value}
                </span>
                <span className="mc-countdown-label mc-font-small">
                  {col.label}
                </span>
              </div>
            ))}
          </div>

          {/* Date and time below */}
          <p className="mc-countdown-date mc-font-h3">
            {couple.weddingDateFormatted}
          </p>
          <p className="mc-countdown-time mc-font-body-light">
            {couple.weddingTimeFormatted}
          </p>
        </div>

        {/* Bottom pair of four-point stars */}
        <div className="mc-countdown-bottom-pair" aria-hidden="true">
          <FourPointStar variant="gold" style={{ width: 10, height: 10, color: 'var(--mc-gold)' }} />
          <GoldDivider variant="dots" style={{ width: 40, height: 4, color: 'var(--mc-gold-light)' }} />
          <FourPointStar variant="gold" style={{ width: 10, height: 10, color: 'var(--mc-gold)' }} />
        </div>
      </div>
    </section>
  );
};

export default Countdown;
