import { useState, useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import type { RSVPFormData } from '../types'

export default function RSVP() {
  const sectionRef = useRef<HTMLElement>(null)
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState<RSVPFormData>({
    name: '',
    guestCount: 1,
    dietary: '',
    attending: null,
  })

  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  useGSAP(
    () => {
      if (prefersReducedMotion || !sectionRef.current) return

      const els = sectionRef.current.querySelectorAll(
        '.jt-rsvp__title, .jt-rsvp__field, .jt-rsvp__submit'
      )

      gsap.set(els, { opacity: 0 })

      gsap.to(els, {
        opacity: 1,
        duration: 0.7,
        stagger: 0.1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
          once: true,
        },
      })
    },
    { scope: sectionRef }
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <section ref={sectionRef} className="jt-rsvp" aria-label="RSVP">
        <div className="jt-rsvp__thank-you">
          <h3>Thank You</h3>
          <p>Your response has been received. We look forward to celebrating with you.</p>
        </div>
      </section>
    )
  }

  return (
    <section ref={sectionRef} className="jt-rsvp" aria-label="RSVP">
      <h2 className="jt-rsvp__title">Kindly Respond</h2>
      <form className="jt-rsvp__form" onSubmit={handleSubmit}>
        <div className="jt-rsvp__field">
          <label className="jt-rsvp__label">Your Name</label>
          <input
            className="jt-rsvp__input"
            type="text"
            placeholder="Full name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
        </div>

        <div className="jt-rsvp__field">
          <label className="jt-rsvp__label">Will You Attend?</label>
          <div className="jt-rsvp__attendance">
            <button
              type="button"
              className={`jt-rsvp__attendance-btn ${form.attending === true ? 'jt-rsvp__attendance-btn--active' : ''}`}
              onClick={() => setForm({ ...form, attending: true })}
            >
              Joyfully Accept
            </button>
            <button
              type="button"
              className={`jt-rsvp__attendance-btn ${form.attending === false ? 'jt-rsvp__attendance-btn--active' : ''}`}
              onClick={() => setForm({ ...form, attending: false })}
            >
              Regretfully Decline
            </button>
          </div>
        </div>

        <div className="jt-rsvp__field">
          <label className="jt-rsvp__label">Number of Guests</label>
          <select
            className="jt-rsvp__select"
            value={form.guestCount}
            onChange={(e) => setForm({ ...form, guestCount: Number(e.target.value) })}
          >
            {[1, 2, 3, 4, 5].map((n) => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
        </div>

        <div className="jt-rsvp__field">
          <label className="jt-rsvp__label">Dietary Requirements</label>
          <input
            className="jt-rsvp__input"
            type="text"
            placeholder="Any dietary preferences"
            value={form.dietary}
            onChange={(e) => setForm({ ...form, dietary: e.target.value })}
          />
        </div>

        <button type="submit" className="jt-rsvp__submit">
          Send Response
        </button>
      </form>
    </section>
  )
}
