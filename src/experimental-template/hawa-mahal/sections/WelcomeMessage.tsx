import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { HmLotusMedallion, HmScallopedCornice, HmPaisley, HmMarigold, HmDiya, HmMehrabArch } from '../assets/svg';
import type { InvitationData } from '../types';

gsap.registerPlugin(ScrollTrigger);

interface WelcomeMessageProps {
  data: InvitationData;
}

export default function WelcomeMessage({ data }: WelcomeMessageProps) {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const section = sectionRef.current;
      if (!section) return;

      const els = section.querySelectorAll('.hm-wmsg-fade');
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
    <section ref={sectionRef} className="hm-section hm-welcome-msg">
      {/* Top cornice */}
      <div className="hm-section-cornice-top hm-cornice-shimmer">
        <HmScallopedCornice
          width={402}
          height={18}
          strokeColor="var(--hm-gold)"
          strokeOpacity={0.6}
        />
      </div>

      {/* Background floating motifs */}
      <div className="hm-wmsg-bg" aria-hidden="true">
        <div className="hm-wmsg-bg-el hm-wmsg-paisley-tl">
          <HmPaisley size={60} fillColor="rgba(181,138,67,0.06)" strokeColor="rgba(181,138,67,0.12)" />
        </div>
        <div className="hm-wmsg-bg-el hm-wmsg-paisley-br">
          <HmPaisley size={55} fillColor="rgba(181,138,67,0.06)" strokeColor="rgba(181,138,67,0.12)" />
        </div>
        <div className="hm-wmsg-bg-el hm-wmsg-marigold-tr">
          <HmMarigold size={42} fillColor="rgba(181,138,67,0.05)" strokeColor="rgba(181,138,67,0.1)" />
        </div>
        <div className="hm-wmsg-bg-el hm-wmsg-marigold-bl">
          <HmMarigold size={38} fillColor="rgba(181,138,67,0.05)" strokeColor="rgba(181,138,67,0.1)" />
        </div>
      </div>

      <div className="hm-wmsg-content">
        {/* Mehrab arch frame behind the text */}
        <div className="hm-wmsg-arch" aria-hidden="true">
          <HmMehrabArch
            width={340}
            height={200}
            cuspCount={4}
            strokeColor="var(--hm-gold-deep)"
            strokeWidth={1}
            strokeOpacity={0.2}
          />
        </div>

        {/* Top lotus */}
        <div className="hm-wmsg-fade">
          <HmLotusMedallion size={36} strokeColor="var(--hm-gold-bright)" className="hm-wmsg-lotus" />
        </div>

        <div style={{ height: 24 }} />

        {/* Flanking diyas beside the label */}
        <div className="hm-wmsg-label-row hm-wmsg-fade">
          <HmDiya size={28} strokeColor="var(--hm-gold)" fillColor="rgba(212,160,85,0.12)" className="hm-wmsg-diya" />
          <span className="hm-welcome-label">{data.welcomeLabel}</span>
          <HmDiya size={28} strokeColor="var(--hm-gold)" fillColor="rgba(212,160,85,0.12)" className="hm-wmsg-diya hm-wmsg-diya--flip" />
        </div>

        <div style={{ height: 20 }} />

        {/* Ornamental rule */}
        <div className="hm-wmsg-ornament hm-wmsg-fade">
          <span className="hm-wmsg-ornament-dot" />
          <span className="hm-wmsg-ornament-dot" />
          <span className="hm-wmsg-ornament-dot" />
          <div className="hm-wmsg-rule" />
          <HmLotusMedallion size={16} strokeColor="var(--hm-gold)" />
          <div className="hm-wmsg-rule" />
          <span className="hm-wmsg-ornament-dot" />
          <span className="hm-wmsg-ornament-dot" />
          <span className="hm-wmsg-ornament-dot" />
        </div>

        <div style={{ height: 28 }} />

        {/* Welcome message text */}
        <p className="hm-welcome-message hm-wmsg-fade">{data.welcomeMessage}</p>

        <div style={{ height: 24 }} />

        {/* Bottom marigold accent */}
        <div className="hm-wmsg-fade">
          <HmMarigold size={24} strokeColor="var(--hm-gold-deep)" fillColor="rgba(181,138,67,0.1)" />
        </div>
      </div>

      {/* Bottom cornice */}
      <div className="hm-section-cornice hm-cornice-shimmer">
        <HmScallopedCornice
          width={402}
          height={18}
          strokeColor="var(--hm-gold)"
          strokeOpacity={0.6}
        />
      </div>
    </section>
  );
}
