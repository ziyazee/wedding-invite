import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { HmLotusMedallion, HmScallopedCornice, HmCalendarIcon, HmClockIcon, HmPaisley, HmMarigold, HmDiya } from '../assets/svg';
import type { InvitationData } from '../types';

gsap.registerPlugin(ScrollTrigger);

interface CelebrationsProps {
  data: InvitationData;
}

function CardConnector() {
  return (
    <div className="hm-card-connector" aria-hidden="true">
      <div className="hm-card-connector-dots" />
      <svg className="hm-card-connector-motif" viewBox="0 0 60 44" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M4 44 C4 28, 12 12, 30 4 C48 12, 56 28, 56 44"
          stroke="var(--hm-gold-deep)"
          strokeWidth="1.2"
          fill="none"
          opacity="0.5"
        />
        <path
          d="M12 44 C12 32, 18 18, 30 10 C42 18, 48 32, 48 44"
          stroke="var(--hm-gold-deep)"
          strokeWidth="0.8"
          fill="none"
          opacity="0.35"
        />
        <g opacity="0.55">
          <line x1="20" y1="44" x2="40" y2="44" stroke="var(--hm-gold-deep)" strokeWidth="1" />
          <line x1="22" y1="44" x2="22" y2="34" stroke="var(--hm-gold-deep)" strokeWidth="1" />
          <line x1="38" y1="44" x2="38" y2="34" stroke="var(--hm-gold-deep)" strokeWidth="1" />
          <line x1="28" y1="44" x2="28" y2="36" stroke="var(--hm-gold-deep)" strokeWidth="0.8" />
          <line x1="32" y1="44" x2="32" y2="36" stroke="var(--hm-gold-deep)" strokeWidth="0.8" />
          <line x1="21" y1="34" x2="39" y2="34" stroke="var(--hm-gold-deep)" strokeWidth="1" />
          <path d="M24 34 C24 30, 27 27, 30 26 C33 27, 36 30, 36 34" stroke="var(--hm-gold-deep)" strokeWidth="0.8" fill="none" />
          <line x1="30" y1="26" x2="30" y2="23" stroke="var(--hm-gold-deep)" strokeWidth="0.8" />
          <circle cx="30" cy="22" r="1.5" fill="var(--hm-gold-deep)" />
        </g>
      </svg>
    </div>
  );
}

function generateCalendarUrl(event: { name: string; date: string; time: string; venue: string; address: string[] }): string {
  const title = encodeURIComponent(event.name);
  const location = encodeURIComponent(`${event.venue}, ${event.address.join(', ')}`);
  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&location=${location}`;
}

export default function Celebrations({ data }: CelebrationsProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  const eventCount = data.events.length;
  const isSingleEvent = eventCount === 1;

  // Pause background CSS animations when off-screen
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.removeAttribute('data-hm-paused');
          } else {
            entry.target.setAttribute('data-hm-paused', '');
          }
        });
      },
      { threshold: 0 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    cardRefs.current.forEach((card) => {
      if (card) observer.observe(card);
    });

    return () => observer.disconnect();
  }, [eventCount]);

  // GSAP scroll-triggered card + connector animations
  useGSAP(() => {
    const mm = gsap.matchMedia();

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const section = sectionRef.current;
      if (!section) return;

      // Cards: start hidden, reveal on scroll — fast entrance
      const cards = section.querySelectorAll('.hm-event-card');
      gsap.set(cards, { opacity: 0, y: -30, scale: 0.97 });

      cards.forEach((card) => {
        gsap.to(card, {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.45,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: card,
            start: 'top 88%',
            toggleActions: 'play none none none',
          },
        });
      });

      // Connectors: line grows then motif appears — snappy
      const connectors = section.querySelectorAll('.hm-card-connector');
      connectors.forEach((conn) => {
        const dots = conn.querySelector('.hm-card-connector-dots') as HTMLElement;
        const motif = conn.querySelector('.hm-card-connector-motif') as HTMLElement;

        if (dots && motif) {
          gsap.set(dots, { scaleY: 0, transformOrigin: 'top center' });
          gsap.set(motif, { opacity: 0, scale: 0.5, transformOrigin: 'top center' });

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: conn,
              start: 'top 85%',
              toggleActions: 'play none none none',
            },
          });

          tl.to(dots, {
            scaleY: 1,
            duration: 0.3,
            ease: 'power1.inOut',
          })
          .to(motif, {
            opacity: 1,
            scale: 1,
            duration: 0.25,
            ease: 'back.out(1.5)',
          }, '-=0.05');
        }
      });
    });
  }, { scope: sectionRef, dependencies: [eventCount] });

  return (
    <section
      ref={sectionRef}
      className={`hm-section hm-celebrations${isSingleEvent ? ' hm-celebrations--single-event' : ''}`}
      style={{ position: 'relative' }}
    >
      {/* Floating Rajasthani motifs */}
      <div className="hm-celebrations-bg" aria-hidden="true">
        <div className="hm-cb-el hm-cb-paisley-1"><HmPaisley size={70} /></div>
        <div className="hm-cb-el hm-cb-paisley-2"><HmPaisley size={55} /></div>
        <div className="hm-cb-el hm-cb-paisley-3"><HmPaisley size={45} /></div>
        <div className="hm-cb-el hm-cb-marigold-1"><HmMarigold size={65} /></div>
        <div className="hm-cb-el hm-cb-marigold-2"><HmMarigold size={50} /></div>
        <div className="hm-cb-el hm-cb-marigold-3"><HmMarigold size={40} /></div>
        <div className="hm-cb-el hm-cb-diya-1"><HmDiya size={55} /></div>
        <div className="hm-cb-el hm-cb-diya-2"><HmDiya size={42} /></div>
      </div>

      <div className="hm-celebrations-inner">
        <h2 className="hm-celebrations-heading">Celebrations</h2>
        <div style={{ height: 8 }} />
        <div className="hm-celebrations-gold-rule" />
        <div style={{ height: 40 }} />

        {data.events.map((event, idx) => (
          <React.Fragment key={event.id}>
            {idx > 0 && <CardConnector />}

            <div
              ref={el => { cardRefs.current[idx] = el; }}
              className="hm-event-card"
            >
              {/* Gold header band */}
              <div className="hm-event-card-header">
                <div className="hm-event-card-header-rule" />
                <span className="hm-event-type">{event.type}</span>
                <div className="hm-event-card-header-rule" />
              </div>

              {/* Card body */}
              <div className="hm-event-card-body">
                <div className="hm-event-card-accent hm-event-card-accent--left" aria-hidden="true">
                  <HmPaisley size={44} fillColor="rgba(184,137,46,0.08)" strokeColor="rgba(184,137,46,0.2)" />
                </div>
                <div className="hm-event-card-accent hm-event-card-accent--right" aria-hidden="true">
                  <HmPaisley size={44} fillColor="rgba(184,137,46,0.08)" strokeColor="rgba(184,137,46,0.2)" />
                </div>

                <h3 className="hm-event-name">{event.name}</h3>
                <div style={{ height: 16 }} />

                <div className="hm-event-ornament-rule">
                  <HmLotusMedallion size={18} strokeColor="var(--hm-gold-deep)" />
                </div>
                <div style={{ height: 16 }} />

                <div className="hm-event-detail-row">
                  <HmCalendarIcon size={15} strokeColor="var(--hm-gold-deep)" />
                  <span className="hm-event-detail-text">{event.date}</span>
                </div>
                <div style={{ height: 4 }} />
                <div className="hm-event-detail-row">
                  <HmClockIcon size={15} strokeColor="var(--hm-gold-deep)" />
                  <span className="hm-event-detail-text">{event.time}</span>
                </div>

                <div style={{ height: 20 }} />
                <div className="hm-event-card-divider" />
                <div style={{ height: 20 }} />

                <span className="hm-event-venue">{event.venue}</span>
                <div style={{ height: 4 }} />
                {event.address.map((line, addrIdx) => (
                  <span key={addrIdx} className="hm-event-address">{line}</span>
                ))}

                <div style={{ height: 28 }} />

                <div className="hm-event-actions">
                  {event.mapUrl && (
                    <a href={event.mapUrl} target="_blank" rel="noopener noreferrer" className="hm-event-btn hm-event-btn--outline">
                      View Map
                    </a>
                  )}
                  <a href={generateCalendarUrl(event)} target="_blank" rel="noopener noreferrer" className="hm-event-btn hm-event-btn--filled">
                    Add to Calendar
                  </a>
                </div>
              </div>
            </div>
          </React.Fragment>
        ))}
      </div>

      {/* Bottom cornice */}
      <div className="hm-section-cornice hm-cornice-shimmer">
        <HmScallopedCornice width={402} height={18} strokeColor="var(--hm-gold)" strokeOpacity={1} />
      </div>

      <div className="hm-celebrations-transition-lotus">
        <HmLotusMedallion size={24} strokeColor="var(--hm-gold)" />
      </div>

      <div className="hm-section-bleed hm-section-bleed--celebrations-to-rsvp" />
    </section>
  );
}
