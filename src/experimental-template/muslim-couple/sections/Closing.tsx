import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import {
  MosqueSilhouette,
  CrescentMoon,
  BirdSilhouette,
  GoldDivider,
  ArabesqueFlourish,
} from '../assets/svg';
import { useAmbientPause } from '../animations/useAmbientAnimation';
import { createMoonGlowTimeline, createBirdTimeline } from '../animations/ambientElements';
import type { ClosingInfo } from '../types';

interface ClosingProps {
  closing: ClosingInfo;
  isOpen: boolean;
}

/**
 * Section 6: Closing
 * Sunset sky gradient, mosque silhouette, crescent moon with glow,
 * flying birds, Dua text, family sign-off, and footer.
 */
const Closing: React.FC<ClosingProps> = ({ closing, isOpen }) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const mosqueRef = useRef<HTMLDivElement>(null);
  const crescentRef = useRef<HTMLDivElement>(null);
  const moonGlowRef = useRef<HTMLDivElement>(null);
  const birdRefs = useRef<(HTMLDivElement | null)[]>([]);
  const timelinesRef = useRef<gsap.core.Timeline[]>([]);

  // Section entry: mosque + crescent fade in via scroll
  useGSAP(
    () => {
      if (!isOpen) return;

      gsap.matchMedia().add('(prefers-reduced-motion: no-preference)', () => {
        // Mosque silhouette fade
        if (mosqueRef.current) {
          gsap.fromTo(
            mosqueRef.current,
            { opacity: 0 },
            {
              opacity: 0.15,
              duration: 1.2,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: sectionRef.current,
                start: 'top 80%',
                once: true,
              },
            }
          );
        }

        // Crescent moon fade
        if (crescentRef.current) {
          gsap.fromTo(
            crescentRef.current,
            { opacity: 0 },
            {
              opacity: 0.8,
              duration: 1.0,
              delay: 0.3,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: sectionRef.current,
                start: 'top 75%',
                once: true,
              },
            }
          );
        }

        // Content fade
        gsap.fromTo(
          '.mc-closing-content',
          { opacity: 0, scale: 0.97 },
          {
            opacity: 1,
            scale: 1,
            duration: 0.8,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 60%',
              once: true,
            },
          }
        );
      });

      // Reduced motion: show everything
      gsap.matchMedia().add('(prefers-reduced-motion: reduce)', () => {
        if (mosqueRef.current) gsap.set(mosqueRef.current, { opacity: 0.15 });
        if (crescentRef.current) gsap.set(crescentRef.current, { opacity: 0.8 });
      });
    },
    { scope: sectionRef, dependencies: [isOpen] }
  );

  // Ambient: moon glow + birds
  useGSAP(
    () => {
      if (!isOpen || !sectionRef.current) return;

      gsap.matchMedia().add('(prefers-reduced-motion: no-preference)', () => {
        const section = sectionRef.current;
        if (!section) return;
        const w = section.offsetWidth;
        const h = section.offsetHeight;
        const tls: gsap.core.Timeline[] = [];

        // Moon glow
        if (moonGlowRef.current) {
          tls.push(createMoonGlowTimeline(moonGlowRef.current));
        }

        // 3 birds
        const birdConfigs = [
          { fromLeft: true, startYPercent: 0.12, endYPercent: 0.08 },
          { fromLeft: false, startYPercent: 0.18, endYPercent: 0.14 },
          { fromLeft: true, startYPercent: 0.1, endYPercent: 0.15 },
        ];

        birdRefs.current.forEach((el, i) => {
          if (el && birdConfigs[i]) {
            tls.push(
              createBirdTimeline(el, {
                ...birdConfigs[i],
                sectionWidth: w,
                sectionHeight: h,
              })
            );
          }
        });

        timelinesRef.current = tls;
      });
    },
    { scope: sectionRef, dependencies: [isOpen] }
  );

  useAmbientPause(
    sectionRef,
    () => timelinesRef.current,
    () => [moonGlowRef.current, ...birdRefs.current]
  );

  return (
    <section
      ref={sectionRef}
      className="mc-section mc-section-closing"
      aria-label="Closing"
    >
      {/* Mosque silhouette */}
      <div ref={mosqueRef} className="mc-decor-mosque" aria-hidden="true">
        <MosqueSilhouette style={{ width: '100%', height: 'auto' }} />
      </div>

      {/* Crescent moon */}
      <div ref={crescentRef} className="mc-decor-crescent" aria-hidden="true">
        <CrescentMoon style={{ width: 28, height: 28 }} />
      </div>

      {/* Moon glow */}
      <div ref={moonGlowRef} className="mc-anim-moon-glow" aria-hidden="true" />

      {/* Birds */}
      {[0, 1, 2].map((i) => (
        <div
          key={`bird-${i}`}
          ref={(el) => { birdRefs.current[i] = el; }}
          className="mc-decor-bird"
          aria-hidden="true"
        >
          <BirdSilhouette style={{ width: 20, height: 12 }} />
        </div>
      ))}

      {/* Content */}
      <div className="mc-closing-content">
        {/* Dua in Arabic */}
        <p className="mc-text-dua-arabic mc-font-arabic">
          {closing.duaArabic}
        </p>

        {/* English translation */}
        <p className="mc-text-dua-english mc-font-body-light">
          {closing.duaEnglish}
        </p>

        {/* Divider */}
        <div className="mc-divider-gold-light" aria-hidden="true">
          <GoldDivider variant="line" style={{ width: '100%', height: '100%', color: 'var(--mc-gold-light)', opacity: 0.4 }} />
        </div>

        {/* Sign-off */}
        <p className="mc-text-signoff-accent mc-font-accent">
          {closing.signoff}
        </p>

        <p className="mc-text-signoff-families mc-font-h3">
          {closing.families}
        </p>

        {/* Footer flourish */}
        <div style={{ marginTop: 40 }} aria-hidden="true">
          <ArabesqueFlourish variant="small" style={{ width: 60, height: 20, color: 'var(--mc-gold-light)', opacity: 0.4 }} />
        </div>

        {/* Attribution footer */}
        <p className="mc-text-footer mc-font-small">
          Made with love
        </p>
      </div>
    </section>
  );
};

export default Closing;
