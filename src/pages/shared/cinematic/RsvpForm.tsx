import { useCallback, useState } from 'react'
import type { RsvpTarget } from '../../../invitations/rsvp'

interface RsvpFormProps {
  rsvpTarget?: RsvpTarget
  rsvpHeading?: string
}

type Step = 'choice' | 'accept' | 'decline'

export function RsvpForm({ rsvpTarget, rsvpHeading = 'Will you be attending our wedding?' }: RsvpFormProps) {
  const [step, setStep] = useState<Step>('choice')
  const [guestCount, setGuestCount] = useState(1)
  const [status, setStatus] = useState('')
  const [statusDemo, setStatusDemo] = useState(false)

  const handleChoice = useCallback((yes: boolean) => {
    setStep(yes ? 'accept' : 'decline')
    setStatus('')
    setStatusDemo(false)
  }, [])

  const handleBack = useCallback(() => {
    setStep('choice')
    setStatus('')
    setStatusDemo(false)
  }, [])

  const handleSubmit = useCallback((e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if ((window as any).__AAMANTRAN__) return

    setStatus('Thank you — your RSVP would be sent on the live invitation.')
    setStatusDemo(true)
  }, [])

  return (
    <div className="card card--rsvp">
      {/* Choice step */}
      {step === 'choice' && (
        <div data-rsvp="choice">
          <h2 className="scene-title rsvp-heading" dangerouslySetInnerHTML={{ __html: rsvpHeading }} />
          <div className="rsvp-ask">
            <button className="btn btn--solid" type="button" onClick={() => handleChoice(true)}>
              Joyfully accept
            </button>
            <button className="btn btn--ghost" type="button" onClick={() => handleChoice(false)}>
              Respectfully decline
            </button>
          </div>
        </div>
      )}

      {/* Accept step — the actual form */}
      {step === 'accept' && (
        <form className="form rsvp-form" data-aamantran="rsvp" onSubmit={handleSubmit}>
          <input type="hidden" data-field="attending" value="yes" />
          <h2 className="scene-title rsvp-heading" dangerouslySetInnerHTML={{ __html: rsvpHeading }} />
          <input
            className="rsvp-line-input"
            data-field="guestName"
            type="text"
            required
            autoComplete="name"
            placeholder="Your name"
            aria-label="Your name"
          />
          <div className="rsvp-count-row">
            <span>Number of guests</span>
            <div className="rsvp-count-controls">
              <button type="button" aria-label="Remove one guest" onClick={() => setGuestCount(c => Math.max(1, c - 1))}>&#8722;</button>
              <input
                data-field="plusCount"
                data-rsvp="count"
                type="number"
                min={1}
                max={10}
                step={1}
                value={guestCount}
                onChange={e => setGuestCount(Math.min(10, Math.max(1, Number(e.target.value) || 1)))}
                aria-label="Number of guests"
              />
              <button type="button" aria-label="Add one guest" onClick={() => setGuestCount(c => Math.min(10, c + 1))}>+</button>
            </div>
          </div>
          <textarea
            className="rsvp-message"
            data-field="message"
            rows={1}
            placeholder="A personal message for us..."
            aria-label="A personal message for us"
          />
          <button className="btn btn--solid rsvp-submit" type="submit">Submit RSVP</button>
          <button className="btn btn--ghost" type="button" data-rsvp-back="" onClick={handleBack}>Go back</button>
          <p className={`status${statusDemo ? ' is-demo' : ''}`} data-aamantran="rsvp-status" role="status" aria-live="polite">{status}</p>
        </form>
      )}

      {/* Decline step */}
      {step === 'decline' && (
        <div data-rsvp="decline">
          <h2 className="scene-title rsvp-heading">We&rsquo;ll miss you</h2>
          <p className="lede">Thank you for letting us know. We hope to celebrate with you another time.</p>
          <button className="btn btn--ghost" type="button" data-rsvp-back="" onClick={handleBack}>Go back</button>
        </div>
      )}
    </div>
  )
}
