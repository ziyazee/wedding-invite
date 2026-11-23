import { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { HmLotusMedallion, HmScallopedCornice, HmJaliPattern } from '../assets/svg';
import { HM_DURATION, HM_EASE, HM_BREAKPOINTS } from '../animations/constants';
import type { InvitationData } from '../types';

gsap.registerPlugin(ScrollTrigger);

interface CountdownProps {
  data: InvitationData;
}

interface TimeRemaining {
  days: string;
  hours: string;
  mins: string;
  secs: string;
}

function getTimeRemaining(target: Date): TimeRemaining {
  const now = new Date().getTime();
  const diff = Math.max(0, target.getTime() - now);

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const secs = Math.floor((diff % (1000 * 60)) / 1000);

  return {
    days: String(days).padStart(2, '0'),
    hours: String(hours).padStart(2, '0'),
    mins: String(mins).padStart(2, '0'),
    secs: String(secs).padStart(2, '0'),
  };
}

function CountdownDigit({ value, label }: { value: string; label: string }) {
  const digitRef = useRef<HTMLSpanElement>(null);
  const prevValueRef = useRef(value);
  const isFirstRender = useRef(true);

  useGSAP(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (prevValueRef.current === value) return;
    prevValueRef.current = value;

    const el = digitRef.current;
    if (!el) return;

    const mm = gsap.matchMedia();
    mm.add(HM_BREAKPOINTS.fullMotion, () => {
      gsap.fromTo(el,
        { opacity: 0, scale: 0.8 },
        {
          opacity: 1,
          scale: 1,
          duration: HM_DURATION.fast,
          ease: HM_EASE.digitIn,
          overwrite: true,
        }
      );
    });
  }, { dependencies: [value], scope: digitRef, revertOnUpdate: true });

  return (
    <div className="hm-countdown-col">
      <span ref={digitRef} className="hm-countdown-digit">{value}</span>
      <span className="hm-countdown-unit">{label}</span>
    </div>
  );
}

export default function Countdown({ data }: CountdownProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const jaliTimerBandRef = useRef<HTMLDivElement>(null);
  const [time, setTime] = useState<TimeRemaining>(() => getTimeRemaining(data.weddingDate));

  useEffect(() => {
    let id: ReturnType<typeof setTimeout>;
    const tick = () => {
      setTime(getTimeRemaining(data.weddingDate));
      id = setTimeout(tick, 1000);
    };
    id = setTimeout(tick, 1000);
    return () => clearTimeout(id);
  }, [data.weddingDate]);

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

  // Scroll-triggered fade-up for text elements
  useGSAP(() => {
    const mm = gsap.matchMedia();

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const section = sectionRef.current;
      if (!section) return;

      const els = section.querySelectorAll('.hm-fade-up');
      gsap.set(els, { opacity: 0, y: 30 });

      els.forEach((el) => {
        gsap.to(el, {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 90%',
            toggleActions: 'play none none none',
          },
        });
      });
    });
  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} className="hm-section hm-countdown" style={{ position: 'relative' }}>
      {/* Jali pattern overlay */}
      <div className="hm-countdown-jali-overlay">
        <HmJaliPattern patternId="hm-jali-countdown" />
      </div>

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 5, display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
        <div className="hm-fade-up">
          <HmLotusMedallion size={28} strokeColor="var(--hm-gold-bright)" />
        </div>

        <div style={{ height: 24 }} />

        <span className="hm-countdown-label hm-fade-up">counting down to</span>

        <div style={{ height: 16 }} />

        {/* Timer area */}
        <div className="hm-fade-up" style={{ position: 'relative' }}>
          <div
            ref={jaliTimerBandRef}
            className="hm-countdown-jali-band"
            style={{
              position: 'absolute',
              top: '50%',
              left: '-24px',
              right: '-24px',
              transform: 'translateY(-50%)',
            }}
          >
            <HmJaliPattern
              patternId="hm-jali-countdown-band"
              strokeColor="var(--hm-teal)"
            />
          </div>

          <div className="hm-countdown-timer">
            <CountdownDigit value={time.days} label="days" />
            <div className="hm-countdown-separator" />
            <CountdownDigit value={time.hours} label="hours" />
            <div className="hm-countdown-separator" />
            <CountdownDigit value={time.mins} label="mins" />
            <div className="hm-countdown-separator" />
            <CountdownDigit value={time.secs} label="secs" />
          </div>
        </div>

        <div style={{ height: 32 }} />

        <span className="hm-countdown-full-date hm-fade-up">{data.weddingDateDisplay}</span>

        <div style={{ height: 8 }} />

        <span className="hm-countdown-day hm-fade-up">{data.weddingDay}</span>

        <div style={{ height: 8 }} />

        <span className="hm-countdown-time hm-fade-up">{data.weddingTime}</span>
      </div>

      {/* Bottom cornice */}
      <div className="hm-section-cornice hm-cornice-shimmer">
        <HmScallopedCornice
          width={402}
          height={18}
          strokeColor="var(--hm-gold)"
          strokeOpacity={1}
        />
      </div>

      <div className="hm-section-bleed hm-section-bleed--countdown-to-celebrations" />
    </section>
  );
}
