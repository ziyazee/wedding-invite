import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import {
  Bismillah,
  GoldDivider,
  MughalArch,
  ArabesqueFlourish,
  RosePetal,
  JaliLatticeStrip,
  FloralBorder,
  OrnateArchFrame,
  GeometricPattern,
} from '../assets/svg';
import { useAmbientPause } from '../animations/useAmbientAnimation';
import { createPetalTimeline, createSparkleTimeline, PETAL_COLORS } from '../animations/ambientElements';
import type { FamilySide, CoupleInfo } from '../types';

interface FamilyProps {
  groomFamily: FamilySide;
  brideFamily: FamilySide;
  couple: CoupleInfo;
  isOpen: boolean;
}

/**
 * Section 2: Family
 * Bismillah, family cards for both sides, arch motifs,
 * arabesque corners, geometric star background, jali strip.
 */
const Family: React.FC<FamilyProps> = ({
  groomFamily,
  brideFamily,
  couple,
  isOpen,
}) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const petalRefs = useRef<(HTMLDivElement | null)[]>([]);
  const sparkleRefs = useRef<(HTMLDivElement | null)[]>([]);
  const timelinesRef = useRef<gsap.core.Timeline[]>([]);

  // Section entry animation: opacity + scale reveal (NO translateY)
  useGSAP(
    () => {
      if (!isOpen) return;

      gsap.matchMedia().add('(prefers-reduced-motion: no-preference)', () => {
        // Content fade in
        gsap.fromTo(
          '.mc-family-content',
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

        // Family cards staggered opacity
        gsap.fromTo(
          '.mc-card-family',
          { opacity: 0, scale: 0.95 },
          {
            opacity: 1,
            scale: 1,
            duration: 0.7,
            stagger: 0.25,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 70%',
              once: true,
            },
          }
        );
      });
    },
    { scope: sectionRef, dependencies: [isOpen] }
  );

  // Ambient petals and sparkles
  useGSAP(
    () => {
      if (!isOpen || !sectionRef.current) return;

      gsap.matchMedia().add('(prefers-reduced-motion: no-preference)', () => {
        const section = sectionRef.current;
        if (!section) return;
        const w = section.offsetWidth;
        const h = section.offsetHeight;

        const tls: gsap.core.Timeline[] = [];

        // 5 petals
        petalRefs.current.forEach((el) => {
          if (el) {
            const tl = createPetalTimeline(el, w, h);
            tls.push(tl);
          }
        });

        // 4 sparkles
        sparkleRefs.current.forEach((el) => {
          if (el) {
            const tl = createSparkleTimeline(el);
            tls.push(tl);
          }
        });

        timelinesRef.current = tls;
      });
    },
    { scope: sectionRef, dependencies: [isOpen] }
  );

  // Pause ambient when off-screen
  useAmbientPause(
    sectionRef,
    () => timelinesRef.current,
    () => [...petalRefs.current, ...sparkleRefs.current]
  );

  const familyLabel = (side: FamilySide) =>
    side.role === 'son' ? "Groom's Family" : "Bride's Family";

  return (
    <section
      ref={sectionRef}
      className="mc-section mc-section-family"
      aria-label="Families"
    >
      {/* Rich floral border at top */}
      <div aria-hidden="true" style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 2, pointerEvents: 'none' }}>
        <FloralBorder position="top" />
      </div>

      {/* Ornate arch frame behind content */}
      <div aria-hidden="true" style={{ position: 'absolute', top: '5%', left: '50%', transform: 'translateX(-50%)', width: '92%', zIndex: 1, pointerEvents: 'none', opacity: 0.6 }}>
        <OrnateArchFrame />
      </div>

      {/* Islamic geometric pattern background */}
      <div aria-hidden="true" style={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none', opacity: 0.5 }}>
        <GeometricPattern />
      </div>

      {/* Decorative corners */}
      <div className="mc-decor-corner-tl" aria-hidden="true">
        <ArabesqueFlourish variant="small" style={{ width: '100%', height: '100%' }} />
      </div>
      <div className="mc-decor-corner-br" aria-hidden="true">
        <ArabesqueFlourish variant="small" style={{ width: '100%', height: '100%' }} />
      </div>

      {/* Rich floral border at bottom */}
      <div aria-hidden="true" style={{ position: 'absolute', bottom: 40, left: 0, right: 0, zIndex: 2, pointerEvents: 'none' }}>
        <FloralBorder position="bottom" />
      </div>

      {/* Ambient petals */}
      <div className="mc-ambient-container" aria-hidden="true">
        {[0, 1, 2, 3, 4].map((i) => (
          <div
            key={`petal-f-${i}`}
            ref={(el) => { petalRefs.current[i] = el; }}
            className="mc-decor-petal"
          >
            <RosePetal
              variant={(['a', 'b', 'c', 'd'] as const)[i % 4]}
              style={{
                width: 14,
                height: 14,
                color: PETAL_COLORS[i % PETAL_COLORS.length],
              }}
            />
          </div>
        ))}
        {[0, 1, 2, 3].map((i) => (
          <div
            key={`sparkle-f-${i}`}
            ref={(el) => { sparkleRefs.current[i] = el; }}
            className="mc-decor-sparkle"
            style={{
              left: `${20 + i * 20}%`,
              top: `${30 + (i % 2) * 30}%`,
            }}
          >
            <svg width="6" height="6" viewBox="0 0 6 6" fill="none">
              <circle cx="3" cy="3" r="2" fill="#D4A050" fillOpacity="0.6" />
            </svg>
          </div>
        ))}
      </div>

      {/* Content */}
      <div className="mc-family-content">
        {/* Arch decoration */}
        <div className="mc-decor-arch" aria-hidden="true">
          <MughalArch style={{ width: '100%', height: '100%' }} />
        </div>

        {/* Bismillah */}
        <div className="mc-text-bismillah mc-font-arabic-lg">
          <Bismillah style={{ width: 200, height: 40, color: 'var(--mc-gold)' }} />
        </div>

        <div className="mc-divider-gold">
          <GoldDivider variant="line" style={{ width: '100%', height: '100%' }} />
        </div>

        {/* "Together with their families" */}
        <p className="mc-text-together mc-font-body-light" style={{ color: 'var(--mc-text-secondary)' }}>
          Together with their families
        </p>

        {/* Couple names */}
        <h2
          className="mc-font-display"
          style={{
            textAlign: 'center',
            color: 'var(--mc-text-primary)',
            marginBottom: 'var(--mc-element-gap)',
          }}
        >
          {couple.groom}
          <span className="mc-font-accent" style={{ display: 'block', color: 'var(--mc-gold)', fontSize: '1rem', margin: '4px 0' }}>
            &amp;
          </span>
          {couple.bride}
        </h2>

        {/* Groom's family card */}
        <div className="mc-card-family">
          <span className="mc-family-role mc-font-small" style={{ textTransform: 'uppercase' }}>
            {familyLabel(groomFamily)}
          </span>
          <p className="mc-family-parents mc-font-h2">
            {groomFamily.fatherName}
            <br />
            {groomFamily.motherName}
          </p>
          <p className="mc-family-message mc-font-body-light">
            {groomFamily.invitationMessage}
          </p>
        </div>

        {/* Petal cluster separator */}
        <div className="mc-petal-cluster" aria-hidden="true">
          <RosePetal variant="a" style={{ width: 10, height: 10, color: 'var(--mc-rose)' }} />
          <RosePetal variant="b" style={{ width: 8, height: 8, color: 'var(--mc-rose-deep)', opacity: 0.7 }} />
          <RosePetal variant="c" style={{ width: 10, height: 10, color: 'var(--mc-rose)' }} />
        </div>

        {/* Bride's family card */}
        <div className="mc-card-family">
          <span className="mc-family-role mc-font-small" style={{ textTransform: 'uppercase' }}>
            {familyLabel(brideFamily)}
          </span>
          <p className="mc-family-parents mc-font-h2">
            {brideFamily.fatherName}
            <br />
            {brideFamily.motherName}
          </p>
          <p className="mc-family-message mc-font-body-light">
            {brideFamily.invitationMessage}
          </p>
        </div>

        {/* Jali lattice strip at bottom */}
        <div className="mc-decor-jali-strip" aria-hidden="true">
          <JaliLatticeStrip style={{ width: '100%', height: '100%' }} />
        </div>
      </div>
    </section>
  );
};

export default Family;
