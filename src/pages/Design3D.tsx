import { useEffect, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import './Design3D.css'

// ─── Sample content ───────────────────────────────────────────────────────
// Replace these values with your actual couple and event details,
// or wire this component into the existing InvitationData / order system.

const COUPLE = {
  groom: 'Aryan',
  bride: 'Zara',
  message:
    'Together with the love and blessings of their families, they joyfully invite you to celebrate the beginning of their forever.',
  coupleImageSrc: '', // set to '/path/to/couple.png' when available
}

const WEDDING = {
  date: '2027-02-14',    // YYYY-MM-DD
  time: '11:00',         // HH:MM
  venue: 'The Grand Palace',
  address: 'MG Road, Bangalore, Karnataka',
  mapUrl: 'https://www.google.com/maps/search/?api=1&query=The+Grand+Palace+MG+Road+Bangalore',
}

const EVENTS = [
  { title: 'Mehendi Ceremony', date: '2027-02-12', time: '15:00', venue: 'Garden Hall', address: 'Bangalore' },
  { title: 'Sangeet Night',    date: '2027-02-13', time: '19:00', venue: 'Rooftop Terrace', address: 'Bangalore' },
  { title: 'Wedding Ceremony', date: '2027-02-14', time: '11:00', venue: 'The Grand Palace', address: 'Bangalore' },
  { title: 'Wedding Reception',date: '2027-02-14', time: '19:00', venue: 'The Grand Palace', address: 'Bangalore' },
]
// ─────────────────────────────────────────────────────────────────────────

function formatDisplayDate(date: string) {
  return new Date(`${date}T12:00:00Z`).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC',
  })
}

function formatDisplayTime(time: string) {
  return new Date(`2000-01-01T${time}:00Z`).toLocaleTimeString('en-US', {
    hour: 'numeric', minute: '2-digit', timeZone: 'UTC',
  })
}

function useCountdown(date: string, time: string) {
  const [t, setT] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })
  useEffect(() => {
    const target = new Date(`${date}T${time}:00`).getTime()
    function tick() {
      const diff = target - Date.now()
      if (diff <= 0) { setT({ days: 0, hours: 0, minutes: 0, seconds: 0 }); return }
      setT({
        days:    Math.floor(diff / 86400000),
        hours:   Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      })
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [date, time])
  return t
}

export default function Design3D() {
  const rsvpRef = useRef<HTMLElement>(null)
  const { days, hours, minutes, seconds } = useCountdown(WEDDING.date, WEDDING.time)
  const [attending, setAttending] = useState<'yes' | 'no' | null>(null)
  const [name, setName]     = useState('')
  const [message, setMsg]   = useState('')
  const [sent, setSent]     = useState(false)

  function scrollToRsvp() {
    rsvpRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  function handleRsvp(e: FormEvent) {
    e.preventDefault()
    // TODO: connect to supabase.rpc('submit_order_rsvp', ...) for live orders
    setSent(true)
  }

  const tiles = [
    { label: 'Days',  value: days },
    { label: 'Hours', value: hours },
    { label: 'Mins',  value: minutes },
    { label: 'Secs',  value: seconds },
  ]

  return (
    <div className="d3d-root">
      {/* Ambient background blobs */}
      <div className="d3d-bg" aria-hidden="true">
        <span className="d3d-blob d3d-blob-1" />
        <span className="d3d-blob d3d-blob-2" />
        <span className="d3d-blob d3d-blob-3" />
      </div>

      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <section className="d3d-hero">
        {/* Couple portrait — drop an <img> here or set coupleImageSrc above */}
        <div className="d3d-couple-slot" aria-hidden="true">
          {COUPLE.coupleImageSrc
            ? <img src={COUPLE.coupleImageSrc} alt={`${COUPLE.groom} and ${COUPLE.bride}`} />
            : <div className="d3d-couple-placeholder" />}
        </div>

        <p className="d3d-kicker">Together with their families</p>

        <h1 className="d3d-names">
          <span>{COUPLE.groom}</span>
          <span className="d3d-ampersand">&amp;</span>
          <span>{COUPLE.bride}</span>
        </h1>

        <p className="d3d-message">{COUPLE.message}</p>

        <div className="d3d-date-pill">
          {formatDisplayDate(WEDDING.date)}
        </div>

        <button className="d3d-cta" onClick={scrollToRsvp} type="button">
          Respond to this invitation
        </button>
      </section>

      {/* ── Countdown ─────────────────────────────────────────────────── */}
      <section className="d3d-section d3d-countdown-section" aria-label="Countdown to the wedding">
        <h2 className="d3d-section-title">Counting down to our day</h2>
        <div className="d3d-countdown" role="timer">
          {tiles.map(({ label, value }) => (
            <div className="d3d-tile" key={label}>
              <span className="d3d-tile-num">{String(value).padStart(2, '0')}</span>
              <span className="d3d-tile-label">{label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Celebrations / Schedule ───────────────────────────────────── */}
      <section className="d3d-section" aria-labelledby="d3d-celebrations-heading">
        <h2 className="d3d-section-title" id="d3d-celebrations-heading">Our celebrations</h2>
        <div className="d3d-schedule">
          {EVENTS.map((event, i) => (
            <div className="d3d-event" key={i}>
              <div className="d3d-event-marker" aria-hidden="true">
                <span className="d3d-event-dot" />
              </div>
              <div className="d3d-event-card">
                <span className="d3d-event-time">
                  {formatDisplayDate(event.date)} &middot; {formatDisplayTime(event.time)}
                </span>
                <strong className="d3d-event-name">{event.title}</strong>
                <span className="d3d-event-venue">
                  {event.venue}{event.address ? `, ${event.address}` : ''}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Venue ─────────────────────────────────────────────────────── */}
      <section className="d3d-section" aria-labelledby="d3d-venue-heading">
        <h2 className="d3d-section-title" id="d3d-venue-heading">Where we celebrate</h2>
        <div className="d3d-venue-card">
          <div className="d3d-venue-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7Z"/>
              <circle cx="12" cy="9" r="2.5"/>
            </svg>
          </div>
          <div className="d3d-venue-details">
            <strong>{WEDDING.venue}</strong>
            <span>{WEDDING.address}</span>
          </div>
          {WEDDING.mapUrl && (
            <a href={WEDDING.mapUrl} target="_blank" rel="noreferrer" className="d3d-directions-btn">
              Get directions ↗
            </a>
          )}
        </div>
      </section>

      {/* ── RSVP ──────────────────────────────────────────────────────── */}
      <section className="d3d-section d3d-rsvp-section" ref={rsvpRef} aria-labelledby="d3d-rsvp-heading">
        <h2 className="d3d-section-title" id="d3d-rsvp-heading">Will you join us?</h2>

        {sent ? (
          <div className="d3d-rsvp-success" role="status">
            <p>Thank you{name ? `, ${name}` : ''}!</p>
            <p>
              {attending === 'yes'
                ? 'We cannot wait to celebrate with you.'
                : 'We will miss you and keep you in our prayers.'}
            </p>
          </div>
        ) : (
          <form className="d3d-rsvp-form" onSubmit={handleRsvp} noValidate>
            <div className="d3d-rsvp-choice" role="group" aria-label="Will you attend?">
              <button
                type="button"
                className={`d3d-choice-btn${attending === 'yes' ? ' active' : ''}`}
                onClick={() => setAttending('yes')}
                aria-pressed={attending === 'yes'}
              >
                Joyfully accepts
              </button>
              <button
                type="button"
                className={`d3d-choice-btn${attending === 'no' ? ' active' : ''}`}
                onClick={() => setAttending('no')}
                aria-pressed={attending === 'no'}
              >
                Regretfully declines
              </button>
            </div>

            <label className="d3d-field">
              <span>Your name</span>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Your full name"
                required
                autoComplete="name"
              />
            </label>

            <label className="d3d-field">
              <span>A message for us <small>(optional)</small></span>
              <textarea
                value={message}
                onChange={e => setMsg(e.target.value)}
                rows={3}
                placeholder="We'd love to hear from you…"
              />
            </label>

            <button
              type="submit"
              className="d3d-submit-btn"
              disabled={!attending || !name.trim()}
            >
              Send my response
            </button>
          </form>
        )}
      </section>

      {/* ── Closing ───────────────────────────────────────────────────── */}
      <footer className="d3d-footer">
        <p className="d3d-closing">
          We are so grateful to have you be a part of this beautiful beginning.
        </p>
        <p className="d3d-closing-names">
          <span>{COUPLE.groom}</span><i>&amp;</i><span>{COUPLE.bride}</span>
        </p>
      </footer>
    </div>
  )
}
