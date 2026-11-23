import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { HmLotusMedallion, HmScallopedCornice } from '../assets/svg';
import type { InvitationData } from '../types';

gsap.registerPlugin(ScrollTrigger);

interface FamilyProps {
  data: InvitationData;
}

export default function Family({ data }: FamilyProps) {
  const sectionRef = useRef<HTMLElement>(null);

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
    <section ref={sectionRef} className="hm-section hm-family" style={{ position: 'relative' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', maxWidth: 'var(--hm-content-max, 354px)' }}>
        <h2 className="hm-family-heading hm-fade-up">The Families</h2>

        <div style={{ height: 8 }} />

        <div className="hm-family-gold-rule hm-fade-up" />

        <div style={{ height: 40 }} />

        {/* Groom's Family */}
        <div className="hm-fade-up" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <span className="hm-family-side-label">{data.groomFamily.label}</span>
          <div style={{ height: 12 }} />
          {data.groomFamily.members.map((member, idx) => (
            <React.Fragment key={idx}>
              <span className="hm-family-member-name">{member.name}</span>
              <div style={{ height: 4 }} />
              <span className="hm-family-member-desc">{member.description}</span>
              {idx < data.groomFamily.members.length - 1 && <div style={{ height: 16 }} />}
            </React.Fragment>
          ))}
        </div>

        <div style={{ height: 32 }} />

        <div className="hm-fade-up">
          <HmLotusMedallion size={24} strokeColor="var(--hm-gold-deep)" />
        </div>

        <div style={{ height: 32 }} />

        {/* Bride's Family */}
        <div className="hm-fade-up" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <span className="hm-family-side-label">{data.brideFamily.label}</span>
          <div style={{ height: 12 }} />
          {data.brideFamily.members.map((member, idx) => (
            <React.Fragment key={idx}>
              <span className="hm-family-member-name">{member.name}</span>
              <div style={{ height: 4 }} />
              <span className="hm-family-member-desc">{member.description}</span>
              {idx < data.brideFamily.members.length - 1 && <div style={{ height: 16 }} />}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Bottom cornice */}
      <div className="hm-section-cornice hm-cornice-shimmer">
        <HmScallopedCornice
          width={402}
          height={18}
          strokeColor="var(--hm-sandstone)"
          strokeOpacity={0.5}
        />
      </div>

      {/* Gradient bleed zone */}
      <div className="hm-section-bleed hm-section-bleed--family-to-countdown" />
    </section>
  );
}
