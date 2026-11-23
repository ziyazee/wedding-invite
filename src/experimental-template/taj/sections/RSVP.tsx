import { useState, useRef } from 'react'
import { OrnamentalDivider, RoseMotif } from '../assets'

export default function RSVP() {
  const sectionRef = useRef<HTMLElement>(null)
  const [form, setForm] = useState({
    name: '',
    guestCount: 1,
    attending: null as boolean | null,
    message: '',
  })
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    // Simulate submission
    setTimeout(() => {
      setSubmitting(false)
      setSubmitted(true)
    }, 800)
  }

  return (
    <section ref={sectionRef} className="tj-rsvp">
      {/* Section heading */}
      <div className="tj-section-heading">
        <h2 className="tj-section-heading__text">Kindly Respond</h2>
        <OrnamentalDivider motif="diamond" width="30%" />
      </div>

      {/* Intro text */}
      <p className="tj-rsvp-intro">
        We would be honored by your presence. Please let us know if you can join us.
      </p>

      {submitted ? (
        /* Confirmation */
        <div className="tj-rsvp-confirmation">
          <h3 className="tj-rsvp-confirmation__heading">JazakAllah Khair</h3>
          <p className="tj-rsvp-confirmation__text">
            Your response has been recorded. We look forward to celebrating with you.
          </p>
        </div>
      ) : (
        /* Form panel */
        <form className="tj-rsvp-panel" onSubmit={handleSubmit}>
          {/* Name field */}
          <div className="tj-rsvp-field">
            <label className="tj-rsvp-label" htmlFor="tj-rsvp-name">Your name</label>
            <input
              id="tj-rsvp-name"
              className="tj-input"
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Full name"
            />
          </div>

          {/* Guest count */}
          <div className="tj-rsvp-field">
            <label className="tj-rsvp-label" htmlFor="tj-rsvp-guests">Number of guests</label>
            <input
              id="tj-rsvp-guests"
              className="tj-input"
              type="number"
              min={1}
              max={10}
              value={form.guestCount}
              onChange={(e) => setForm({ ...form, guestCount: Number(e.target.value) })}
            />
          </div>

          {/* Attendance radio */}
          <div className="tj-rsvp-field">
            <span className="tj-rsvp-label">Attending</span>
            <div className="tj-rsvp-radio-group">
              <label className="tj-rsvp-radio">
                <input
                  className="tj-radio-input"
                  type="radio"
                  name="attending"
                  checked={form.attending === true}
                  onChange={() => setForm({ ...form, attending: true })}
                />
                <span className="tj-radio-circle" />
                <span className="tj-rsvp-radio__label">Joyfully accept</span>
              </label>
              <label className="tj-rsvp-radio">
                <input
                  className="tj-radio-input"
                  type="radio"
                  name="attending"
                  checked={form.attending === false}
                  onChange={() => setForm({ ...form, attending: false })}
                />
                <span className="tj-radio-circle" />
                <span className="tj-rsvp-radio__label">Regretfully decline</span>
              </label>
            </div>
          </div>

          {/* Message */}
          <div className="tj-rsvp-field">
            <label className="tj-rsvp-label" htmlFor="tj-rsvp-message">Message for the couple</label>
            <textarea
              id="tj-rsvp-message"
              className="tj-rsvp-textarea"
              rows={3}
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              placeholder="Your wishes..."
            />
          </div>

          {/* Submit button */}
          <button
            type="submit"
            className="tj-rsvp-submit"
            disabled={submitting}
          >
            {submitting ? 'Sending...' : 'Send Response'}
          </button>
        </form>
      )}

      {/* Rose border below form */}
      <div className="tj-rsvp-roses">
        <RoseMotif size={36} />
        <RoseMotif size={36} flip />
      </div>
    </section>
  )
}
