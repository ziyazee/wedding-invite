import React, { useRef, useState, useCallback } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import {
  ArabesqueFlourish,
  GoldDivider,
  IconCheck,
  OrnateArchFrame,
  FloralBorder,
} from '../assets/svg';
import type { RSVPConfig, RSVPFormData } from '../types';

interface RSVPProps {
  rsvp: RSVPConfig;
  isOpen: boolean;
}

/**
 * Section 5: RSVP
 * Form with name input, guest stepper, attendance radio buttons,
 * message textarea, and frosted glass submit button.
 */
const RSVPSection: React.FC<RSVPProps> = ({ rsvp, isOpen }) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [formData, setFormData] = useState<RSVPFormData>({
    name: '',
    guestCount: 1,
    attending: null,
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  // Section entry animation
  useGSAP(
    () => {
      if (!isOpen) return;

      gsap.matchMedia().add('(prefers-reduced-motion: no-preference)', () => {
        gsap.fromTo(
          '.mc-rsvp-content',
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

        // RSVP card clip-path reveal
        gsap.fromTo(
          '.mc-card-rsvp',
          { clipPath: 'inset(0 0 100% 0)' },
          {
            clipPath: 'inset(0 0 0% 0)',
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 60%',
              once: true,
            },
          }
        );
      });
    },
    { scope: sectionRef, dependencies: [isOpen] }
  );

  const handleNameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, name: e.target.value }));
  }, []);

  const handleGuestIncrement = useCallback(() => {
    setFormData((prev) => ({ ...prev, guestCount: Math.min(prev.guestCount + 1, 20) }));
  }, []);

  const handleGuestDecrement = useCallback(() => {
    setFormData((prev) => ({ ...prev, guestCount: Math.max(prev.guestCount - 1, 1) }));
  }, []);

  const handleAttendingChange = useCallback((value: boolean) => {
    setFormData((prev) => ({ ...prev, attending: value }));
  }, []);

  const handleMessageChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, message: e.target.value }));
  }, []);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!formData.name.trim() || formData.attending === null) return;

      if (rsvp.onSubmit) {
        rsvp.onSubmit(formData);
      }
      setSubmitted(true);
    },
    [formData, rsvp]
  );

  if (!rsvp.enabled) return null;

  return (
    <section
      ref={sectionRef}
      className="mc-section mc-section-rsvp"
      aria-label="RSVP"
    >
      {/* Ornate arch background */}
      <div aria-hidden="true" style={{ position: 'absolute', top: '2%', left: '50%', transform: 'translateX(-50%)', width: '95%', zIndex: 0, pointerEvents: 'none', opacity: 0.4 }}>
        <OrnateArchFrame />
      </div>

      {/* Bottom floral border */}
      <div aria-hidden="true" style={{ position: 'absolute', bottom: 60, left: 0, right: 0, zIndex: 2, pointerEvents: 'none' }}>
        <FloralBorder position="bottom" />
      </div>

      <div className="mc-rsvp-content">
        <h2 className="mc-rsvp-title mc-font-h1">
          Will You Join Us?
        </h2>

        <div className="mc-celebrations-flourish" aria-hidden="true">
          <ArabesqueFlourish
            variant="wide"
            style={{ width: 120, height: 20, color: 'var(--mc-gold)' }}
          />
        </div>

        <p className="mc-rsvp-subtitle mc-font-body-light">
          Kindly let us know if you will be gracing us with your presence
        </p>

        <div className="mc-card-rsvp">
          <form onSubmit={handleSubmit}>
            {/* Name field */}
            <div className="mc-rsvp-field">
              <label className="mc-rsvp-label" htmlFor="mc-rsvp-name">
                YOUR NAME
              </label>
              <input
                id="mc-rsvp-name"
                type="text"
                className="mc-rsvp-input"
                placeholder="Enter your name"
                value={formData.name}
                onChange={handleNameChange}
                required
                autoComplete="name"
              />
            </div>

            {/* Guest count stepper */}
            <div className="mc-rsvp-field">
              <label className="mc-rsvp-label">
                NUMBER OF GUESTS
              </label>
              <div className="mc-rsvp-stepper">
                <button
                  type="button"
                  className="mc-rsvp-stepper-btn"
                  onClick={handleGuestDecrement}
                  aria-label="Decrease guest count"
                >
                  -
                </button>
                <span className="mc-rsvp-count" aria-live="polite">
                  {formData.guestCount}
                </span>
                <button
                  type="button"
                  className="mc-rsvp-stepper-btn"
                  onClick={handleGuestIncrement}
                  aria-label="Increase guest count"
                >
                  +
                </button>
              </div>
            </div>

            {/* Attendance radio */}
            <div className="mc-rsvp-field">
              <span className="mc-rsvp-label">
                WILL YOU ATTEND?
              </span>
              <div className="mc-rsvp-radio-group" role="radiogroup" aria-label="Attendance">
                <div
                  className="mc-rsvp-radio-row"
                  onClick={() => handleAttendingChange(true)}
                  role="radio"
                  aria-checked={formData.attending === true}
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleAttendingChange(true);
                    }
                  }}
                >
                  <div className="mc-rsvp-radio-circle">
                    <div
                      className={`mc-rsvp-radio-dot${formData.attending === true ? ' mc-active' : ''}`}
                    />
                  </div>
                  <span className="mc-rsvp-radio-label">Joyfully Accepts</span>
                </div>
                <div
                  className="mc-rsvp-radio-row"
                  onClick={() => handleAttendingChange(false)}
                  role="radio"
                  aria-checked={formData.attending === false}
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleAttendingChange(false);
                    }
                  }}
                >
                  <div className="mc-rsvp-radio-circle">
                    <div
                      className={`mc-rsvp-radio-dot${formData.attending === false ? ' mc-active' : ''}`}
                    />
                  </div>
                  <span className="mc-rsvp-radio-label">Respectfully Declines</span>
                </div>
              </div>
            </div>

            {/* Message textarea */}
            <div className="mc-rsvp-field">
              <label className="mc-rsvp-label" htmlFor="mc-rsvp-message">
                MESSAGE (OPTIONAL)
              </label>
              <textarea
                id="mc-rsvp-message"
                className="mc-rsvp-textarea"
                placeholder="Share a message for the couple..."
                value={formData.message}
                onChange={handleMessageChange}
                rows={3}
              />
            </div>

            {/* Divider */}
            <div style={{ margin: '16px 0' }} aria-hidden="true">
              <GoldDivider variant="line" style={{ width: '100%', height: 1, color: 'var(--mc-cream)' }} />
            </div>

            {/* Submit button */}
            <button
              type="submit"
              className={`mc-rsvp-submit${submitted ? ' mc-success' : ''}`}
              disabled={submitted}
            >
              {submitted ? (
                <>
                  <IconCheck style={{ width: 18, height: 18 }} />
                  <span>Sent with Love</span>
                </>
              ) : (
                'Send RSVP'
              )}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default RSVPSection;
