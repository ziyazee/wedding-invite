import { useState, useCallback } from 'react'
import type { RSVPEntry } from '../types'
import { ArchSilhouette, LotusFlower, RoseCluster } from '../assets'

type Attending = 'yes' | 'no' | null

interface FormErrors {
  guestName?: string
}

export default function RSVP() {
  const [form, setForm] = useState<RSVPEntry>({
    guestName: '',
    attending: 'yes',
    guestCount: 1,
    message: '',
  })
  const [attending, setAttending] = useState<Attending>(null)
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})
  const [shakeError, setShakeError] = useState(false)

  const validate = useCallback((): boolean => {
    const newErrors: FormErrors = {}
    if (!form.guestName.trim()) {
      newErrors.guestName = 'Please enter your name'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }, [form.guestName])

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()

      if (!validate()) {
        setShakeError(true)
        setTimeout(() => setShakeError(false), 400)
        return
      }

      if (attending === null) {
        setShakeError(true)
        setTimeout(() => setShakeError(false), 400)
        return
      }

      setSubmitting(true)
      // Simulate submission
      setTimeout(() => {
        setSubmitted(true)
      }, 400)
    },
    [validate, attending]
  )

  const incrementGuests = useCallback(() => {
    setForm((f) => ({ ...f, guestCount: Math.min(10, f.guestCount + 1) }))
  }, [])

  const decrementGuests = useCallback(() => {
    setForm((f) => ({ ...f, guestCount: Math.max(1, f.guestCount - 1) }))
  }, [])

  return (
    <section className="pp-rsvp" aria-label="RSVP">
      <div className="pp-rsvp__arch-frame">
        {/* Arch outline frame */}
        <ArchSilhouette openBottom className="pp-rsvp__arch-svg" />

        {/* Rose pair flanking heading */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--pp-space-sm)', marginTop: 'var(--pp-space-xl)' }}>
          <RoseCluster size={24} aria-hidden="true" />
          <h2 className="pp-rsvp__heading" style={{ margin: 0 }}>Kindly Respond</h2>
          <RoseCluster size={24} mirror aria-hidden="true" />
        </div>

        {submitted ? (
          <div className={`pp-rsvp__thankyou ${submitted ? 'pp-rsvp__thankyou--visible' : ''}`}>
            <h3 className="pp-rsvp__thankyou-title pp-script">Thank You</h3>
            <p className="pp-rsvp__thankyou-subtitle">
              We look forward to celebrating with you
            </p>
            <div className="pp-rsvp__thankyou-lotus" aria-hidden="true">
              <LotusFlower size={32} />
            </div>
          </div>
        ) : (
          <form
            className={`pp-rsvp__form ${submitting ? 'pp-rsvp__form--submitting' : ''}`}
            onSubmit={handleSubmit}
            noValidate
          >
            {/* Guest name */}
            <div className="pp-rsvp__field">
              <label className="pp-rsvp__label" htmlFor="pp-rsvp-name">
                Your Name
              </label>
              <input
                id="pp-rsvp-name"
                type="text"
                className={`pp-rsvp__input ${errors.guestName ? 'pp-rsvp__input--error' : ''}`}
                placeholder="Enter your full name"
                value={form.guestName}
                onChange={(e) => {
                  setForm((f) => ({ ...f, guestName: e.target.value }))
                  if (errors.guestName) setErrors((err) => ({ ...err, guestName: undefined }))
                }}
                aria-describedby={errors.guestName ? 'pp-rsvp-name-error' : undefined}
                aria-invalid={!!errors.guestName}
              />
              {errors.guestName && (
                <span id="pp-rsvp-name-error" className="pp-rsvp__error-text" role="alert">
                  {errors.guestName}
                </span>
              )}
            </div>

            {/* Attendance */}
            <div className="pp-rsvp__field">
              <span className="pp-rsvp__label">Will You Attend?</span>
              <div
                className="pp-rsvp__attendance"
                role="radiogroup"
                aria-label="Attendance selection"
              >
                <button
                  type="button"
                  className={`pp-rsvp__attend-btn ${attending === 'yes' ? 'pp-rsvp__attend-btn--selected' : ''}`}
                  onClick={() => {
                    setAttending('yes')
                    setForm((f) => ({ ...f, attending: 'yes' }))
                  }}
                  role="radio"
                  aria-checked={attending === 'yes'}
                >
                  Joyfully Accept
                </button>
                <button
                  type="button"
                  className={`pp-rsvp__attend-btn ${attending === 'no' ? 'pp-rsvp__attend-btn--selected' : ''}`}
                  onClick={() => {
                    setAttending('no')
                    setForm((f) => ({ ...f, attending: 'no' }))
                  }}
                  role="radio"
                  aria-checked={attending === 'no'}
                >
                  Regretfully Decline
                </button>
              </div>
            </div>

            {/* Guest count */}
            {attending === 'yes' && (
              <div className="pp-rsvp__field">
                <span className="pp-rsvp__label">Number of Guests</span>
                <div className="pp-rsvp__stepper">
                  <button
                    type="button"
                    className="pp-rsvp__stepper-btn"
                    onClick={decrementGuests}
                    aria-label="Decrease guest count"
                    disabled={form.guestCount <= 1}
                  >
                    &minus;
                  </button>
                  <span className="pp-rsvp__stepper-count" aria-live="polite">
                    {form.guestCount}
                  </span>
                  <button
                    type="button"
                    className="pp-rsvp__stepper-btn"
                    onClick={incrementGuests}
                    aria-label="Increase guest count"
                    disabled={form.guestCount >= 10}
                  >
                    +
                  </button>
                </div>
              </div>
            )}

            {/* Message */}
            <div className="pp-rsvp__field">
              <label className="pp-rsvp__label" htmlFor="pp-rsvp-message">
                Message (optional)
              </label>
              <textarea
                id="pp-rsvp-message"
                className="pp-rsvp__textarea"
                placeholder="Share your wishes..."
                value={form.message}
                onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              className={`pp-rsvp__submit ${shakeError ? 'pp-rsvp__submit--error' : ''}`}
            >
              {submitting ? 'Sending...' : 'Send RSVP'}
            </button>
          </form>
        )}
      </div>

      {/* Three gold dots separator */}
      <div
        style={{
          display: 'flex',
          gap: '12px',
          justifyContent: 'center',
          marginTop: 'var(--pp-space-2xl)',
        }}
        aria-hidden="true"
      >
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            style={{
              width: 4,
              height: 4,
              borderRadius: '50%',
              background: 'var(--pp-gold)',
            }}
          />
        ))}
      </div>
    </section>
  )
}
