import { useState, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import type { RSVPFormData } from '../types'
import { SectionHeadingOrnament, DiyaRuleComposition, NoiseTexture } from '../assets/svg'

gsap.registerPlugin(ScrollTrigger)

const REVEAL = { y: 24, opacity: 0, duration: 0.8, ease: 'power2.out' }
const TRIGGER = { start: 'top 85%', once: true, toggleActions: 'play none none none' as const }

export default function RSVP() {
  const sectionRef = useRef<HTMLElement>(null)
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState<RSVPFormData>({
    name: '',
    guestCount: 1,
    dietary: '',
    attending: null,
  })

  useGSAP(
    () => {
      if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

      gsap.from('.ag-rsvp-heading', {
        ...REVEAL,
        scrollTrigger: { trigger: '.ag-section-rsvp', ...TRIGGER },
      })

      gsap.from('.ag-rsvp-form > *', {
        ...REVEAL,
        stagger: 0.1,
        scrollTrigger: { trigger: '.ag-rsvp-form', ...TRIGGER, start: 'top 85%' },
      })
    },
    { scope: sectionRef },
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  const updateField = <K extends keyof RSVPFormData>(key: K, value: RSVPFormData[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  return (
    <section ref={sectionRef} className="ag-section-rsvp">
      <NoiseTexture className="ag-noise-overlay" />

      {/* Water shimmer effect (CSS-only) */}
      <div className="ag-rsvp-water-bg ag-water-shimmer" />

      {/* Heading */}
      <div className="ag-rsvp-heading">
        <h2 className="ag-type-section">RSVP</h2>
        <SectionHeadingOrnament width={160} />
        <p className="ag-rsvp-subtitle ag-type-body">
          We would be honoured by your presence
        </p>
      </div>

      {submitted ? (
        <div className="ag-rsvp-thankyou">
          <div className="ag-rsvp-checkmark">
            <svg viewBox="0 0 40 40" width="40" height="40" aria-hidden="true">
              <circle cx="20" cy="20" r="18" fill="none" stroke="var(--ag-gold)" strokeWidth="2" />
              <polyline
                points="12,20 18,26 28,14"
                fill="none"
                stroke="var(--ag-gold-bright)"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <h3 className="ag-type-event">Thank You</h3>
          <p className="ag-type-body ag-rsvp-thankyou-text">
            We have received your response and look forward to celebrating with you.
          </p>
        </div>
      ) : (
        <form className="ag-rsvp-form" onSubmit={handleSubmit}>
          {/* Name */}
          <div className="ag-rsvp-field">
            <label htmlFor="ag-rsvp-name" className="ag-type-small ag-rsvp-label">
              Guest Name
            </label>
            <input
              id="ag-rsvp-name"
              type="text"
              className="ag-input"
              placeholder="Your full name"
              value={form.name}
              onChange={(e) => updateField('name', e.target.value)}
              required
              autoComplete="name"
            />
          </div>

          {/* Attendance toggle */}
          <div className="ag-rsvp-field">
            <span className="ag-type-small ag-rsvp-label">Will you attend?</span>
            <div className="ag-rsvp-toggle-row">
              <button
                type="button"
                className={`ag-btn-primary ag-rsvp-toggle${form.attending === true ? ' is-active' : ''}`}
                onClick={() => updateField('attending', true)}
              >
                Joyfully Accept
              </button>
              <button
                type="button"
                className={`ag-btn-ghost ag-rsvp-toggle${form.attending === false ? ' is-active' : ''}`}
                onClick={() => updateField('attending', false)}
              >
                With Regrets
              </button>
            </div>
          </div>

          {/* Conditional fields: guest count + dietary */}
          {form.attending === true && (
            <>
              <div className="ag-rsvp-field">
                <label htmlFor="ag-rsvp-guests" className="ag-type-small ag-rsvp-label">
                  Number of Guests
                </label>
                <select
                  id="ag-rsvp-guests"
                  className="ag-input"
                  value={form.guestCount}
                  onChange={(e) => updateField('guestCount', Number(e.target.value))}
                >
                  {[1, 2, 3, 4, 5].map((n) => (
                    <option key={n} value={n}>{n}</option>
                  ))}
                </select>
              </div>

              <div className="ag-rsvp-field">
                <label htmlFor="ag-rsvp-dietary" className="ag-type-small ag-rsvp-label">
                  Dietary Requirements
                </label>
                <input
                  id="ag-rsvp-dietary"
                  type="text"
                  className="ag-input"
                  placeholder="Any dietary needs"
                  value={form.dietary}
                  onChange={(e) => updateField('dietary', e.target.value)}
                />
              </div>
            </>
          )}

          {/* Submit */}
          <button
            type="submit"
            className="ag-btn-primary ag-rsvp-submit"
            disabled={form.attending === null || !form.name.trim()}
          >
            Send RSVP
          </button>
        </form>
      )}

      {/* Decorative close */}
      <div className="ag-rsvp-close">
        <DiyaRuleComposition width={200} />
      </div>
    </section>
  )
}
