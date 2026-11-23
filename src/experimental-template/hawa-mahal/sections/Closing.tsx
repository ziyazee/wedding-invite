import React, { useRef, useMemo, useEffect } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { HmMehrabArch, HmLotusMedallion, HmJaliPattern } from '../assets/svg';
import { HM_DURATION, HM_EASE, HM_BREAKPOINTS } from '../animations/constants';
import type { InvitationData } from '../types';

gsap.registerPlugin(ScrollTrigger);

interface ClosingProps {
  data: InvitationData;
}

export default function Closing({ data }: ClosingProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const closingArchPathRef = useRef<SVGPathElement | null>(null);

  const stars = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => ({
      id: i,
      top: `${gsap.utils.random(2, 48)}%`,
      left: `${gsap.utils.random(3, 97)}%`,
      size: gsap.utils.random(3, 4),
      duration: `${gsap.utils.random(2.5, 5)}s`,
      delay: `${gsap.utils.random(0, 4)}s`,
    }));
  }, []);

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

  // Arch draw-on + fade-up animations
  useGSAP(() => {
    const mm = gsap.matchMedia();

    mm.add(HM_BREAKPOINTS.fullMotion, () => {
      // Arch draw-on
      const archPath = closingArchPathRef.current;
      if (archPath) {
        const pathLength = archPath.getTotalLength();
        gsap.set(archPath, {
          strokeDasharray: pathLength,
          strokeDashoffset: pathLength,
        });

        const observer = new IntersectionObserver(
          ([entry]) => {
            if (entry.isIntersecting) {
              observer.disconnect();
              gsap.to(archPath, {
                strokeDashoffset: 0,
                duration: HM_DURATION.long,
                ease: HM_EASE.strokeDraw,
                onStart: () => { archPath.style.willChange = 'stroke-dashoffset'; },
                onComplete: () => { archPath.style.willChange = 'auto'; },
              });
            }
          },
          { threshold: 0.3 }
        );

        if (sectionRef.current) {
          observer.observe(sectionRef.current);
        }
      }

      // Fade-up for text elements
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
    <section ref={sectionRef} className="hm-section hm-closing" style={{ position: 'relative' }}>
      {/* Jali pattern overlay */}
      <div className="hm-closing-jali">
        <HmJaliPattern patternId="hm-jali-closing" />
      </div>

      {/* Stars */}
      <div className="hm-closing-stars">
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

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 5, display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
        <div className="hm-fade-up">
          <HmLotusMedallion size={32} strokeColor="var(--hm-gold-deep)" />
        </div>

        <div style={{ height: 24 }} />

        <div className="hm-closing-gold-rule hm-fade-up" />

        <div style={{ height: 24 }} />

        {/* Mehrab arch + closing message */}
        <div className="hm-closing-arch-container hm-fade-up" style={{ minHeight: 160, minWidth: 300, position: 'relative' }}>
          <div
            className="hm-closing-arch"
            ref={(el) => {
              if (el) {
                const path = el.querySelector('path');
                if (path) closingArchPathRef.current = path;
              }
            }}
          >
            <HmMehrabArch
              width={300}
              height={160}
              cuspCount={5}
              strokeColor="var(--hm-gold-deep)"
              strokeWidth={1.5}
              strokeOpacity={0.4}
              fillColor="var(--hm-gold-deep)"
              fillOpacity={0.04}
            />
          </div>
          <p className="hm-closing-message" style={{ position: 'relative', zIndex: 2, padding: '16px 24px' }}>
            {data.closingMessage}
          </p>
        </div>

        <div style={{ height: 40 }} />

        <div className="hm-closing-couple-names hm-fade-up">
          <span className="hm-closing-couple-name">{data.groomName}</span>
          <span className="hm-closing-ampersand">&amp;</span>
          <span className="hm-closing-couple-name">{data.brideName}</span>
        </div>

        <div style={{ height: 40 }} />

        <span className="hm-closing-hashtag hm-fade-up">{data.hashtag}</span>

        <div style={{ height: 64 }} />

        <div className="hm-closing-footer hm-fade-up" style={{ fontSize: 12, letterSpacing: '0.05em' }}>
          <span className="hm-font-label">Crafted with love</span>
        </div>
      </div>
    </section>
  );
}
