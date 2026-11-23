import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import {
  Lantern,
  IconCalendar,
  IconClock,
  IconMapPin,
  IconMaps,
  IconCalendarAdd,
  ArabesqueFlourish,
  GoldDivider,
  FourPointStar,
  FloralBorder,
  GeometricPattern,
} from '../assets/svg';
import type { CelebrationEvent } from '../types';

interface CelebrationsProps {
  events: CelebrationEvent[];
  isOpen: boolean;
}

/**
 * Section 4: Celebrations
 * Dynamic event cards with lantern icon, date/time/venue rows,
 * maps & calendar action links, arabesque flourish separator.
 */
const Celebrations: React.FC<CelebrationsProps> = ({ events, isOpen }) => {
  const sectionRef = useRef<HTMLDivElement>(null);

  // Section entry animation
  useGSAP(
    () => {
      if (!isOpen) return;

      gsap.matchMedia().add('(prefers-reduced-motion: no-preference)', () => {
        gsap.fromTo(
          '.mc-celebrations-content',
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

        // Event cards staggered reveal
        gsap.fromTo(
          '.mc-card-event',
          { opacity: 0, scale: 0.95 },
          {
            opacity: 1,
            scale: 1,
            duration: 0.7,
            stagger: 0.2,
            ease: 'power2.out',
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

  return (
    <section
      ref={sectionRef}
      className="mc-section mc-section-celebrations"
      aria-label="Celebrations"
    >
      {/* Floral border at top */}
      <div aria-hidden="true" style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 2, pointerEvents: 'none' }}>
        <FloralBorder position="top" />
      </div>

      {/* Geometric pattern background */}
      <div aria-hidden="true" style={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none', opacity: 0.35 }}>
        <GeometricPattern />
      </div>

      <div className="mc-celebrations-content">
        <h2 className="mc-celebrations-title mc-font-h1">
          Celebrations
        </h2>

        <div className="mc-celebrations-flourish" aria-hidden="true">
          <ArabesqueFlourish
            variant="wide"
            style={{ width: 120, height: 20, color: 'var(--mc-gold)' }}
          />
        </div>

        {events.map((event, index) => (
          <React.Fragment key={event.id}>
            {/* Separator between cards */}
            {index > 0 && (
              <div className="mc-card-separator" aria-hidden="true">
                <FourPointStar variant="gold" style={{ width: 8, height: 8, color: 'var(--mc-gold)' }} />
                <GoldDivider variant="dots" style={{ width: 30, height: 4, color: 'var(--mc-gold-light)' }} />
                <FourPointStar variant="gold" style={{ width: 8, height: 8, color: 'var(--mc-gold)' }} />
              </div>
            )}

            {/* Event card */}
            <div className="mc-card-event">
              {/* Header: lantern icon + name */}
              <div className="mc-card-event-header">
                <Lantern variant="small" style={{ width: 24, height: 24, flexShrink: 0 }} />
                <h3 className="mc-event-name mc-font-h2">{event.name}</h3>
              </div>

              {/* Date row */}
              <div className="mc-card-event-row">
                <IconCalendar style={{ width: 18, height: 18 }} />
                <span className="mc-font-body">{event.date}</span>
              </div>

              {/* Time row */}
              <div className="mc-card-event-row">
                <IconClock style={{ width: 18, height: 18 }} />
                <span className="mc-font-body">{event.time}</span>
              </div>

              {/* Venue row */}
              <div className="mc-card-event-row">
                <IconMapPin style={{ width: 18, height: 18 }} />
                <div className="mc-card-event-venue">
                  <span className="mc-venue-name mc-font-body">{event.venue}</span>
                  <span className="mc-venue-address mc-font-caption">{event.address}</span>
                </div>
              </div>

              {/* Action links */}
              <div className="mc-card-event-actions">
                {event.mapsUrl && (
                  <a
                    href={event.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mc-card-event-action"
                    aria-label={`Open ${event.venue} in Maps`}
                  >
                    <IconMaps style={{ width: 22, height: 22 }} />
                    <span className="mc-font-small">Maps</span>
                  </a>
                )}
                {event.calendarUrl && (
                  <a
                    href={event.calendarUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mc-card-event-action"
                    aria-label={`Add ${event.name} to calendar`}
                  >
                    <IconCalendarAdd style={{ width: 22, height: 22 }} />
                    <span className="mc-font-small">Calendar</span>
                  </a>
                )}
              </div>
            </div>
          </React.Fragment>
        ))}
      </div>
    </section>
  );
};

export default Celebrations;
