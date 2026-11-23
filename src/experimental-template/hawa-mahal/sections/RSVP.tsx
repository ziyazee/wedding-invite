import React, { useRef, useState, useCallback } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { HmMehrabArch, HmLotusMedallion, HmScallopedCornice, HmJaliPattern } from '../assets/svg';
import { HM_DURATION, HM_EASE, HM_BREAKPOINTS } from '../animations/constants';
import type { InvitationData, RSVPResponse } from '../types';

gsap.registerPlugin(ScrollTrigger);

interface RSVPProps {
  data: InvitationData;
}

export default function RSVP({ data }: RSVPProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const rsvpArchPathRef = useRef<SVGPathElement | null>(null);
  const formFieldsRef = useRef<HTMLFormElement>(null);
  const confirmationRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState<RSVPResponse>({
    guestName: '',
    attending: null,
    message: '',
  });
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [nameError, setNameError] = useState(false);

  // Arch draw-on + fade-up animations
  const { contextSafe } = useGSAP(() => {
    const mm = gsap.matchMedia();

    mm.add(HM_BREAKPOINTS.fullMotion, () => {
      // Arch draw-on
      const archPath = rsvpArchPathRef.current;
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

  const animateConfirmationIn = contextSafe((el: HTMLElement) => {
    gsap.fromTo(el,
      { opacity: 0 },
      {
        opacity: 1,
        duration: HM_DURATION.confirmReveal,
        ease: HM_EASE.confirmFade,
        delay: 0.1,
      }
    );
  });

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.guestName.trim()) {
      setNameError(true);
      return;
    }
    setNameError(false);

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      setShowConfirmation(true);
      return;
    }

    const fields = formFieldsRef.current?.querySelectorAll('.hm-rsvp-form-field');
    if (fields && fields.length > 0) {
      const tl = gsap.timeline({
        defaults: { ease: HM_EASE.confirmFade },
      });

      tl.to(Array.from(fields), {
        opacity: 0,
        duration: HM_DURATION.formFade,
        stagger: 0.05,
        onComplete: () => {
          setShowConfirmation(true);
          requestAnimationFrame(() => {
            if (confirmationRef.current) {
              animateConfirmationIn(confirmationRef.current);
            }
          });
        },
      });
    } else {
      setShowConfirmation(true);
    }
  }, [formData.guestName, animateConfirmationIn]);

  return (
    <section ref={sectionRef} className="hm-section hm-rsvp" style={{ position: 'relative' }}>
      {/* Jali overlay */}
      <div className="hm-rsvp-jali">
        <HmJaliPattern patternId="hm-jali-rsvp" />
      </div>

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 5, display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
        <h2 className="hm-rsvp-heading hm-fade-up">RSVP</h2>

        <div style={{ height: 8 }} />

        <div className="hm-rsvp-gold-rule hm-fade-up" />

        <div style={{ height: 16 }} />

        <p className="hm-rsvp-message hm-fade-up">{data.rsvpMessage}</p>

        <div style={{ height: 40 }} />

        {/* Form container */}
        <div className="hm-rsvp-form-container hm-fade-up">
          {/* Arch at top */}
          <div
            className="hm-rsvp-form-arch hm-rsvp-arch"
            ref={(el) => {
              if (el) {
                const path = el.querySelector('path');
                if (path) rsvpArchPathRef.current = path;
              }
            }}
          >
            <HmMehrabArch
              width={200}
              height={48}
              cuspCount={3}
              strokeColor="var(--hm-gold)"
              strokeWidth={1.5}
            />
          </div>

          {!showConfirmation ? (
            <form ref={formFieldsRef} onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              <div className={`hm-rsvp-form-field${focusedField === 'name' ? ' hm-rsvp-field--focused' : ''}`}>
                <label className="hm-rsvp-label" htmlFor="hm-rsvp-name">Your Name</label>
                <input
                  id="hm-rsvp-name"
                  type="text"
                  className={`hm-rsvp-input${nameError ? ' hm-rsvp-input--error' : ''}`}
                  placeholder="Enter your full name"
                  value={formData.guestName}
                  onChange={e => {
                    setFormData(prev => ({ ...prev, guestName: e.target.value }));
                    if (nameError) setNameError(false);
                  }}
                  onFocus={() => setFocusedField('name')}
                  onBlur={() => setFocusedField(null)}
                />
                {nameError && (
                  <span className="hm-rsvp-error hm-rsvp-error--visible">
                    Please enter your name
                  </span>
                )}
              </div>

              <div className="hm-rsvp-form-field">
                <label className="hm-rsvp-label">Will you attend?</label>
                <div style={{ height: 4 }} />
                <div className="hm-rsvp-toggle">
                  <button
                    type="button"
                    className={`hm-rsvp-toggle-option${formData.attending === true ? ' hm-rsvp-toggle-option--selected' : ''}`}
                    onClick={() => setFormData(prev => ({ ...prev, attending: true }))}
                  >
                    Joyfully Accept
                  </button>
                  <button
                    type="button"
                    className={`hm-rsvp-toggle-option${formData.attending === false ? ' hm-rsvp-toggle-option--selected' : ''}`}
                    onClick={() => setFormData(prev => ({ ...prev, attending: false }))}
                  >
                    Respectfully Decline
                  </button>
                </div>
              </div>

              <div className={`hm-rsvp-form-field${focusedField === 'message' ? ' hm-rsvp-field--focused' : ''}`}>
                <label className="hm-rsvp-label" htmlFor="hm-rsvp-message">Message (optional)</label>
                <textarea
                  id="hm-rsvp-message"
                  className="hm-rsvp-textarea"
                  placeholder="Share your wishes..."
                  rows={3}
                  value={formData.message}
                  onChange={e => setFormData(prev => ({ ...prev, message: e.target.value }))}
                  onFocus={() => setFocusedField('message')}
                  onBlur={() => setFocusedField(null)}
                />
              </div>

              <div className="hm-rsvp-form-field">
                <button type="submit" className="hm-rsvp-submit">
                  Send Response
                </button>
              </div>
            </form>
          ) : (
            <div ref={confirmationRef} className="hm-rsvp-confirmation" style={{ opacity: 0 }}>
              <HmLotusMedallion size={24} strokeColor="var(--hm-gold-bright)" />
              <div style={{ height: 16 }} />
              <h3 className="hm-rsvp-confirmation-heading">Thank You</h3>
              <div style={{ height: 8 }} />
              <p className="hm-rsvp-confirmation-text">
                {formData.attending === false
                  ? 'We understand. You will be missed dearly.'
                  : 'Your response has been received. We look forward to celebrating with you.'}
              </p>
            </div>
          )}
        </div>
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
    </section>
  );
}
