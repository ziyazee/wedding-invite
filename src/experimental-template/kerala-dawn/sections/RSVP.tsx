/* Kerala Dawn — Section 5: RSVP
   Form with name, guest count stepper, dietary textarea, two buttons */

import { useRef, useState, useCallback } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { KasavuBorder } from '../assets'

export default function RSVP() {
  const sectionRef = useRef<HTMLElement>(null)
  const stripTopRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const subtitleRef = useRef<HTMLParagraphElement>(null)
  const formRef = useRef<HTMLFormElement>(null)
  const buttonsRef = useRef<HTMLDivElement>(null)
  const stripBottomRef = useRef<HTMLDivElement>(null)
  const primaryBtnRef = useRef<HTMLButtonElement>(null)

  const [name, setName] = useState('')
  const [guestCount, setGuestCount] = useState(1)
  const [dietary, setDietary] = useState('')
  const [submitted, setSubmitted] = useState<'attending' | 'regret' | null>(null)

  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  useGSAP(
    () => {
      if (prefersReducedMotion) {
        gsap.set(
          [
            stripTopRef.current,
            titleRef.current,
            subtitleRef.current,
            formRef.current,
            buttonsRef.current,
            stripBottomRef.current,
          ],
          { opacity: 1, y: 0, scaleX: 1 }
        )
        return
      }

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
          once: true,
        },
        defaults: { ease: 'power2.out' },
      })

      tl.fromTo(
        stripTopRef.current,
        { opacity: 0, scaleX: 0 },
        { opacity: 1, scaleX: 1, duration: 0.7, ease: 'power3.out', transformOrigin: 'center center' },
        0
      )

      tl.fromTo(titleRef.current, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.6 }, 0.12)
      tl.fromTo(subtitleRef.current, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.6 }, 0.24)

      // Form fields as one block
      tl.fromTo(formRef.current, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.6 }, 0.36)

      // Button row
      tl.fromTo(buttonsRef.current, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.5 }, 0.48)

      // Bottom strip
      tl.fromTo(
        stripBottomRef.current,
        { opacity: 0, scaleX: 0 },
        { opacity: 1, scaleX: 1, duration: 0.7, ease: 'power3.out', transformOrigin: 'center center' },
        0.6
      )
    },
    { scope: sectionRef }
  )

  const handleSubmit = useCallback(
    (attending: boolean) => {
      if (!name.trim()) return
      setSubmitted(attending ? 'attending' : 'regret')
    },
    [name]
  )

  if (submitted) {
    return (
      <section
        ref={sectionRef}
        className="kd-rsvp kd-section kd-section--grain"
        aria-label="RSVP"
      >
        <div className="kd-section__content">
          <div className="kd-kasavu-strip" style={{ marginBottom: 32 }}>
            <KasavuBorder width={240} height={12} />
          </div>

          <div className="kd-rsvp__thanks">
            <h2 className="kd-rsvp__thanks-title">
              {submitted === 'attending' ? 'Nanni!' : 'We understand'}
            </h2>
            <p className="kd-rsvp__thanks-text">
              {submitted === 'attending'
                ? `Thank you, ${name}. We look forward to celebrating with you.`
                : `Thank you for letting us know, ${name}. You will be missed.`}
            </p>
          </div>

          <div className="kd-kasavu-strip" style={{ marginTop: 32 }}>
            <KasavuBorder width={240} height={12} />
          </div>
        </div>
      </section>
    )
  }

  return (
    <section
      ref={sectionRef}
      className="kd-rsvp kd-section kd-section--grain"
      aria-label="RSVP"
    >
      <div className="kd-section__content">
        {/* Kasavu strip top */}
        <div ref={stripTopRef} className="kd-kasavu-strip" style={{ marginBottom: 32 }}>
          <KasavuBorder width={240} height={12} />
        </div>

        <h2 ref={titleRef} className="kd-rsvp__title">Kindly Respond</h2>
        <p ref={subtitleRef} className="kd-rsvp__subtitle">
          We would love to hear from you
        </p>

        <form
          ref={formRef}
          className="kd-rsvp__form"
          onSubmit={(e) => {
            e.preventDefault()
            handleSubmit(true)
          }}
        >
          {/* Name */}
          <div className="kd-rsvp__field">
            <label className="kd-rsvp__label" htmlFor="kd-rsvp-name">
              Your Name
            </label>
            <input
              id="kd-rsvp-name"
              className="kd-input"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              required
            />
          </div>

          {/* Guest count stepper */}
          <div className="kd-rsvp__field">
            <label className="kd-rsvp__label">Number of Guests</label>
            <div className="kd-stepper">
              <button
                type="button"
                className="kd-stepper__btn kd-stepper__btn--minus"
                onClick={() => setGuestCount((c) => Math.max(1, c - 1))}
                aria-label="Decrease guest count"
              >
                &minus;
              </button>
              <span className="kd-stepper__value">{guestCount}</span>
              <button
                type="button"
                className="kd-stepper__btn kd-stepper__btn--plus"
                onClick={() => setGuestCount((c) => Math.min(10, c + 1))}
                aria-label="Increase guest count"
              >
                +
              </button>
            </div>
          </div>

          {/* Dietary requirements */}
          <div className="kd-rsvp__field">
            <label className="kd-rsvp__label" htmlFor="kd-rsvp-dietary">
              Dietary Requirements{' '}
              <span className="kd-rsvp__label-optional">(optional)</span>
            </label>
            <textarea
              id="kd-rsvp-dietary"
              className="kd-textarea"
              value={dietary}
              onChange={(e) => setDietary(e.target.value)}
              placeholder="Any dietary restrictions or preferences"
              rows={3}
            />
          </div>
        </form>

        {/* Button row */}
        <div ref={buttonsRef} className="kd-rsvp__buttons" style={{ marginTop: 8 }}>
          <button
            ref={primaryBtnRef}
            type="button"
            className="kd-btn-primary"
            onClick={() => handleSubmit(true)}
          >
            Will Attend
          </button>
          <button
            type="button"
            className="kd-btn-secondary"
            onClick={() => handleSubmit(false)}
          >
            Regret
          </button>
        </div>

        {/* Kasavu strip bottom */}
        <div ref={stripBottomRef} className="kd-kasavu-strip" style={{ marginTop: 32 }}>
          <KasavuBorder width={240} height={12} />
        </div>
      </div>
    </section>
  )
}
