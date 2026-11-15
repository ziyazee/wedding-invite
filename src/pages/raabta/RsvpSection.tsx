import { useRef, useState } from 'react'
import { saveOrderRsvp } from '../../invitations/rsvp'
import type { RsvpTarget } from '../../invitations/rsvp'
import { fireConfetti } from './Confetti'

export default function RsvpSection({ rsvpTarget }: { rsvpTarget?: RsvpTarget }) {
  const [choice, setChoice] = useState<'none' | 'yes' | 'no'>('none')
  const [rsvpName, setRsvpName] = useState('')
  const [attending, setAttending] = useState('yes')
  const [guestCount, setGuestCount] = useState(1)
  const [rsvpStatus, setRsvpStatus] = useState('')
  const confettiRef = useRef<HTMLDivElement>(null)

  const handleYes = () => {
    setChoice('yes')
    fireConfetti(confettiRef.current)
  }

  const handleNo = () => {
    setChoice('no')
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (rsvpTarget) {
      setRsvpStatus('Sending...')
      saveOrderRsvp(rsvpTarget, { name: rsvpName, attendance: attending as 'yes' | 'no', count: guestCount, guests: [], message: '' })
        .then(() => setRsvpStatus('RSVP submitted successfully. Thank you!'))
        .catch(() => setRsvpStatus('Could not submit RSVP right now.'))
    } else {
      setRsvpStatus('RSVP submitted successfully. Thank you!')
    }
  }

  return (
    <div className="rsvp-block">
      <h2 className="rsvp-title reveal">Will you join us?</h2>
      <p className="rsvp-text reveal">Let us know you&rsquo;re coming so we can celebrate together.</p>

      <div className="rsvp-action-area">
        {choice === 'none' && (
          <div className="rsvp-buttons">
            <button className="rsvp-btn rsvp-yes" onClick={handleYes}>Yes, I&rsquo;ll be there</button>
            <button className="rsvp-btn rsvp-no" onClick={handleNo}>No, I can&rsquo;t make it</button>
          </div>
        )}
        <div className="confetti-burst" ref={confettiRef} aria-hidden="true" />

        {choice === 'yes' && (
          <form className="rsvp-form" onSubmit={handleSubmit}>
            <input type="hidden" value={attending} />

            <div className="rsvp-row">
              <svg className="rsvp-icon" viewBox="0 0 24 24" fill="none" stroke="#8C6318" strokeWidth="1.5" width="22" height="22"><circle cx="12" cy="7.5" r="3.5"/><path d="M5.5 20a6.5 6.5 0 0 1 13 0"/></svg>
              <span className="rsvp-sep" />
              <input type="text" required className="rsvp-input" placeholder="Your name" value={rsvpName} onChange={e => setRsvpName(e.target.value)} />
            </div>

            <div className="rsvp-row">
              <svg className="rsvp-icon" viewBox="0 0 24 24" fill="none" stroke="#8C6318" strokeWidth="1.5" width="22" height="22"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 10h18"/><path d="M9 2v4M15 2v4"/><path d="m9 15 2 2 4-4"/></svg>
              <span className="rsvp-sep" />
              <select className="rsvp-input rsvp-select" value={attending} onChange={e => setAttending(e.target.value)}>
                <option value="yes">Attending</option>
                <option value="no">Not attending</option>
              </select>
              <svg className="rsvp-chevron" viewBox="0 0 20 20" fill="#8C6318" width="18" height="18"><path fillRule="evenodd" d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 11.168l3.71-3.938a.75.75 0 1 1 1.08 1.04l-4.25 4.5a.75.75 0 0 1-1.08 0l-4.25-4.5a.75.75 0 0 1 .02-1.06Z" clipRule="evenodd"/></svg>
            </div>

            <div className="rsvp-row">
              <svg className="rsvp-icon" viewBox="0 0 24 24" fill="none" stroke="#8C6318" strokeWidth="1.5" width="22" height="22"><circle cx="9" cy="7" r="3"/><path d="M4 20a5 5 0 0 1 10 0"/><circle cx="17" cy="9" r="2.25"/><path d="M20.5 20a3.5 3.5 0 0 0-5.25-3"/></svg>
              <span className="rsvp-sep" />
              <input type="number" min="1" value={guestCount} readOnly className="rsvp-input rsvp-count-input" />
              <div className="rsvp-stepper">
                <button type="button" className="rsvp-step-btn" onClick={() => setGuestCount(Math.max(1, guestCount - 1))} aria-label="Remove guest">&minus;</button>
                <span className="rsvp-step-val">{guestCount}</span>
                <button type="button" className="rsvp-step-btn" onClick={() => setGuestCount(guestCount + 1)} aria-label="Add guest">+</button>
              </div>
            </div>

            <button type="submit" className="rsvp-submit">
              <svg viewBox="0 0 24 24" fill="#1A2340" width="20" height="20"><path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z"/></svg>
              Send RSVP
            </button>
            {rsvpStatus && <p style={{ marginTop: '10px', fontSize: '0.85rem', textAlign: 'center', color: rsvpStatus.includes('Could not') ? '#E58F8F' : 'var(--gold-300)' }}>{rsvpStatus}</p>}
          </form>
        )}

        {choice === 'no' && (
          <div className="rsvp-thank-you">
            <p>Thank you for letting us know!</p>
            <p className="rsvp-miss">You&rsquo;ll be deeply missed.</p>
          </div>
        )}
      </div>
    </div>
  )
}
