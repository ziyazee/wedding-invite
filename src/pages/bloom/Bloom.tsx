import { useEffect, useRef, useState, useMemo } from 'react'
import type { ComponentProps, FormEvent } from 'react'
import type { InvitationData, Celebration } from '../../invitations/model'
import { formatDate, mapURL, weddingISO } from '../../invitations/model'
import { downloadCalendar } from '../../invitations/calendar'
import type { RsvpTarget } from '../../invitations/rsvp'
import { saveOrderRsvp } from '../../invitations/rsvp'
import { EditableText, InvitationLayoutProvider } from '../../invitations/components/EditableText'
import { InvitationSection as Section } from '../../invitations/components/InvitationSection'
import { InvitationMedia } from '../../invitations/components/InvitationMedia'
import PersonalMusic from '../../invitations/PersonalMusic'
import { wrapCardText } from '../../invitations/cardContentFit'
import { useBloomGate } from './useBloomGate'
import { useBloomMusic } from './useBloomMusic'
import { useBloomReveal } from './useBloomReveal'
import { useBloomCountdown } from './useBloomCountdown'
import { useBloomCardFit } from './useBloomCardFit'
import { useBloomNameFit } from './useBloomNameFit'
import { useBloomCardVideo } from './useBloomCardVideo'
import './Bloom.css'

const ASSETS = '/templates/bloom/assets/'

function formatBloomTime(time: string) {
  if (!time) return ''
  return new Date(`2000-01-01T${time}:00Z`).toLocaleTimeString('en-US', {
    hour: 'numeric', minute: '2-digit', hour12: true, timeZone: 'UTC',
  })
}

const DEMO: InvitationData = {
  template: 7, groom: 'Daniel', bride: 'Sarah',
  date: '2027-05-22', time: '10:00', offset: '+05:30',
  venue: 'The Blooming Courtyard', address: 'Bengaluru, Karnataka', map: '',
  message: 'Our favourite story is the one we are beginning together. Please celebrate with us.',
  groomFamily: 'The D\'Souza family', brideFamily: 'The Fernandes family',
  dressCode: '', giftNote: 'A card and your company are more than enough.',
  music: '', gallery: '', brideFirst: false, language: '',
  showCoupleIllustrations: true, musicStart: 0, musicEnd: 0,
  companyName: '', companyLogo: '', companyPhone: '',
  events: [
    { id: 'wedding', title: 'Wedding Ceremony', date: '2027-05-22', time: '10:00', venue: 'The Blooming Courtyard', address: 'Bengaluru, Karnataka', map: '' },
    { id: 'welcome-lunch', title: 'Welcome Lunch', date: '2027-05-21', time: '13:00', venue: 'The Garden Room', address: 'Bengaluru, Karnataka', map: '' },
    { id: 'reception', title: 'Celebration Reception', date: '2027-05-22', time: '18:30', venue: 'The Conservatory', address: 'Bengaluru, Karnataka', map: '' },
  ],
  textOverrides: null as any,
  labels: {} as any,
}

type CopyProps = Omit<ComponentProps<typeof EditableText>, 'textId'> & { field: string }
function Copy({ field, label, children, animation = 'fade-up', ...props }: CopyProps) {
  return <EditableText {...props} animation={animation} textId={`t7.${field}`} label={label || field.replaceAll('.', ' · ')}>{children}</EditableText>
}

function heroDateParts(iso: string) {
  const parts = new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: 'short', year: 'numeric', timeZone: 'UTC' }).formatToParts(new Date(`${iso}T12:00:00Z`))
  const part = (type: Intl.DateTimeFormatPartTypes) => parts.find(p => p.type === type)?.value || ''
  return { day: part('day'), month: part('month').toUpperCase(), year: part('year') }
}

function ceremonyDateText(dateStr: string) {
  const eventDate = new Date(`${dateStr}T12:00:00Z`)
  const day = eventDate.getUTCDate()
  const suffix = day % 100 >= 11 && day % 100 <= 13 ? 'th' : (['th','st','nd','rd'][day % 10] || 'th')
  return {
    line1: `${formatDate(dateStr, { weekday: 'long' })}, ${day}${suffix}`,
    line2: `of ${formatDate(dateStr, { month: 'long', year: 'numeric' }).replace(/ (\d{4})$/, ', $1')}`,
  }
}

export default function Bloom({ details: d, rsvpTarget }: { details?: InvitationData; rsvpTarget?: RsvpTarget }) {
  const details = d ?? DEMO
  const rootRef = useRef<HTMLDivElement>(null)
  const firstName = details.brideFirst ? details.bride : details.groom
  const secondName = details.brideFirst ? details.groom : details.bride
  const musicSrc = details.music || `${ASSETS}wedding-background-music-yxy0nS2O.mp3`

  const gate = useBloomGate()
  const music = useBloomMusic(musicSrc)
  useBloomReveal(rootRef)
  const countdown = useBloomCountdown(weddingISO(details))
  useBloomCardFit(rootRef)
  useBloomNameFit(rootRef, JSON.stringify([details.groom, details.bride]))
  useBloomCardVideo(rootRef)

  gate.onOpen.current = music.start

  useEffect(() => {
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = '/templates/bloom/fonts.css'
    document.head.append(link)
    return () => { link.remove() }
  }, [])

  const weddingEvent = details.events[0]
  const sortedEvents = useMemo(() =>
    [...details.events].sort((a, b) => `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`)),
    [details.events],
  )
  const additionalEvents = useMemo(() =>
    sortedEvents.filter(e => e !== weddingEvent),
    [sortedEvents, weddingEvent],
  )

  const dateParts = heroDateParts(details.date)
  const ceremonyDate = weddingEvent ? ceremonyDateText(weddingEvent.date) : null
  const addressParts = weddingEvent ? weddingEvent.address.split(/\n|,\s*/).map(p => p.trim()).filter(Boolean) : []
  const locality = weddingEvent?.address.includes('\n') ? '' : addressParts.slice(1).join(', ')

  const gateClass = gate.state === 'stage-one' ? 'bloom-stage-one' : gate.state === 'finished' ? 'bloom-finished' : gate.state === 'started' ? 'bloom-started' : ''

  return (
    <InvitationLayoutProvider layout={details.textOverrides} manualLayout={details.textOverrides ?? null}>
      <div className={`bloom-native ${gateClass}`} ref={rootRef}>

        {/* ── Hero ── */}
        <Section data-invite-section="hero" className="bloom-hero" id="hero">
          <div className="bloom-hero-bg" style={{ backgroundImage: `url('${ASSETS}hero-bg-RvVOmFvi.webp')` }} aria-hidden="true" />
          <div className="bloom-hero-content">
            <div className="bloom-hero-inner">
              <div className="bloom-arch-wrap" data-reveal style={{ transform: 'none' }}>
                <svg viewBox="-20 -160 440 380" className="bloom-arch-mobile" aria-label="We're getting married">
                  <defs><path id="bloom-arch-m" d="M 20,200 Q 200,-360 380,200" fill="none" /></defs>
                  <text className="bloom-arch-text" textAnchor="middle" style={{ fontSize: 20, letterSpacing: '0.25em' }}>
                    <textPath href="#bloom-arch-m" startOffset="50%">WE'RE GETTING MARRIED</textPath>
                  </text>
                </svg>
                <svg viewBox="0 0 400 120" className="bloom-arch-desktop" aria-label="We're getting married">
                  <defs><path id="bloom-arch-d" d="M 20,110 Q 200,30 380,110" fill="none" /></defs>
                  <text className="bloom-arch-text" textAnchor="middle" style={{ fontSize: 16, letterSpacing: '0.32em' }}>
                    <textPath href="#bloom-arch-d" startOffset="50%">WE'RE GETTING MARRIED</textPath>
                  </text>
                </svg>
              </div>
              <h1 className="bloom-hero-names">
                <Copy as="span" field="hero.groom" className="bloom-hero-name">{firstName}</Copy>
                <span className="bloom-hero-amp">&amp;</span>
                <Copy as="span" field="hero.bride" className="bloom-hero-name">{secondName}</Copy>
              </h1>
              <div style={{ marginTop: '.5rem', marginBottom: '.25rem' }} />
              <div className="bloom-hero-date" aria-label={formatDate(details.date)}>
                <span>{dateParts.day}</span>
                <span>{dateParts.month}</span>
                <span>{dateParts.year}</span>
              </div>
            </div>
          </div>
          <button className="bloom-discover" type="button" onClick={() => document.getElementById('countdown')?.scrollIntoView({ behavior: 'smooth' })}>
            <span>Discover</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
          </button>
        </Section>

        {/* ── Countdown ── */}
        <Section data-invite-section="countdown" className="bloom-countdown" id="countdown">
          <div className="bloom-countdown-frame" style={{ backgroundImage: `url('${ASSETS}countdown-frame-DEQv0lAm.webp')` }}>
            <Copy as="h2" field="countdown.heading" className="section-heading" data-reveal>{weddingEvent?.title || 'Countdown'}</Copy>
            <Copy as="p" field="countdown.subtitle" className="section-eyebrow" style={{ marginBottom: '.5rem', paddingBottom: 10 }} data-reveal>
              Until {formatDate(details.date, { day: 'numeric', month: 'long', year: 'numeric' })}
            </Copy>
            <div className="bloom-countdown-values" data-reveal>
              {[
                { value: countdown.days, label: 'Days' },
                { value: countdown.hours, label: 'Hours' },
                { value: countdown.minutes, label: 'Minutes' },
                { value: countdown.seconds, label: 'Seconds' },
              ].map((unit, i, arr) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center' }}>
                  <div className="bloom-countdown-unit">
                    <span className="bloom-countdown-value">{String(unit.value).padStart(2, '0')}</span>
                    <span className="bloom-countdown-label">{unit.label}</span>
                  </div>
                  {i < arr.length - 1 && <span className="bloom-countdown-divider" />}
                </div>
              ))}
            </div>
          </div>
        </Section>

        {/* ── Welcome ── */}
        <Section data-invite-section="welcome" className="bloom-welcome" id="welcome">
          <InvitationMedia className="bloom-welcome-flowers-top" src={`${ASSETS}welcome-flowers-Dy0evJgO.webp`} alt="" aria-hidden="true" style={{ width: '132%', left: '50%', transform: 'translateX(-50%)' }} />
          <div className="bloom-welcome-inner">
            <div data-reveal>
              <Copy as="h2" field="welcome.heading" className="bloom-welcome-heading">Welcome</Copy>
            </div>
            <Copy as="p" field="welcome.familyIntro" className="bloom-welcome-family-intro" data-reveal>
              {details.labels?.togetherWithFamilies || 'Together with their families'}
            </Copy>
            <div className="bloom-welcome-names" data-reveal>
              <WelcomePerson name={firstName} family={details.brideFirst ? details.brideFamily : details.groomFamily} person={details.brideFirst ? 'bride' : 'groom'} />
              <Copy as="p" field="welcome.separator" className="bloom-welcome-name-and">and</Copy>
              <WelcomePerson name={secondName} family={details.brideFirst ? details.groomFamily : details.brideFamily} person={details.brideFirst ? 'groom' : 'bride'} />
            </div>
          </div>
          <div className="bloom-welcome-floral-footer">
            <InvitationMedia className="bloom-welcome-flowers-bottom" src={`${ASSETS}welcome-flowers-bottom-CYQVvwo4.webp`} alt="" aria-hidden="true" />
          </div>
        </Section>

        {/* ── Ceremony (original wedding-events section) ── */}
        {weddingEvent && (
          <Section data-invite-section="ceremony" className="bloom-ceremony" id="wedding-events">
            <div className="bloom-ceremony-frame" style={{ backgroundImage: `url('${ASSETS}ceremony-oval-bg-Dus9vYNo.webp')`, backgroundSize: '100% 100%' }}>
              <div className="bloom-ceremony-aspect" data-bloom-card="image">
                <InvitationMedia className="bloom-ceremony-illustration" src={`${ASSETS}venue-illustration-CJozVy2q.webp`} alt="" />
                <div className="bloom-ceremony-copy">
                  <div className="bloom-ceremony-text" data-reveal data-bloom-copy>
                    <Copy as="h2" field="ceremony.title" className="bloom-ceremony-title">{wrapCardText(weddingEvent.title, 18)}</Copy>
                    <span className="section-rule" />
                    <p className="bloom-ceremony-subtitle" style={{ fontFamily: 'var(--font-subtitle)' }}>Where we celebrate</p>
                    <Copy as="h3" field="ceremony.venue" className="bloom-ceremony-venue">{wrapCardText(weddingEvent.venue, 24)}</Copy>
                    {locality && <p className="bloom-ceremony-location" style={{ fontFamily: 'var(--font-subtitle)' }}>{wrapCardText(locality, 32)}</p>}
                    <div className="bloom-ceremony-details">
                      <div className="bloom-ceremony-datetime">
                        {ceremonyDate && (
                          <span className="bloom-ceremony-date-text">
                            <span>{ceremonyDate.line1}</span>
                            <span>{ceremonyDate.line2}</span>
                          </span>
                        )}
                        <span className="bloom-ceremony-date-dot">·</span>
                        <Copy as="span" field="ceremony.time" className="bloom-ceremony-time">{formatBloomTime(weddingEvent.time ?? '')}</Copy>
                      </div>
                      <div className="bloom-ceremony-rule" />
                      <div className="bloom-ceremony-address">
                        <span className="bloom-ceremony-address-line">{wrapCardText(weddingEvent.address.includes('\n') ? weddingEvent.address : addressParts[0] || '', 32)}</span>
                        {locality && <span className="bloom-ceremony-address-line">{wrapCardText(locality, 32)}</span>}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="bloom-ceremony-buttons">
              {weddingEvent.map.trim() && (
                <a className="bloom-ceremony-btn" href={mapURL(weddingEvent.venue, weddingEvent.address, weddingEvent.map)} target="_blank" rel="noreferrer">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" /><circle cx="12" cy="10" r="3" /></svg>
                  Open in Maps
                </a>
              )}
              <button type="button" className="bloom-ceremony-btn" onClick={() => downloadCalendar(weddingEvent, details.offset, `${firstName} & ${secondName}`)}>
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 2v4" /><path d="M16 2v4" /><rect width="18" height="18" x="3" y="4" rx="2" /><path d="M3 10h18" /></svg>
                Add to Calendar
              </button>
            </div>
          </Section>
        )}

        {/* ── Additional Events ── */}
        {additionalEvents.length > 0 && (
          <div className="bloom-events">
            {additionalEvents.map((event, i) => (
              <EventCard key={event.id || i} event={event} index={details.events.indexOf(event)} details={details} couple={`${firstName} & ${secondName}`} />
            ))}
          </div>
        )}

        {/* ── Dress Code ── */}
        {details.dressCode.trim() && (
          <div className="bloom-note" data-reveal>
            <Copy as="h2" field="dressCode.heading" className="font-script">{details.labels?.dressCode || 'Dress code'}</Copy>
            <Copy as="p" field="dressCode.text">{details.dressCode}</Copy>
            {details.showCoupleIllustrations !== false && (
              <InvitationMedia className="bloom-couple-illustration" src={`${ASSETS}black-tie-illustration-Bzqxj15v.webp`} alt="Wedding attire illustration" />
            )}
          </div>
        )}

        {/* ── Gift Note ── */}
        {details.giftNote.trim() && (
          <div className="bloom-note" data-reveal>
            <Copy as="h2" field="giftNote.heading" className="font-script">{details.labels?.giftNote || 'A little note'}</Copy>
            <Copy as="p" field="giftNote.text">{details.giftNote}</Copy>
          </div>
        )}

        {/* ── Gallery ── */}
        {details.gallery.trim() && (
          <div className="bloom-note" data-reveal>
            <a href={details.gallery} target="_blank" rel="noreferrer">{details.labels?.photoGallery || 'Our photo gallery'} ↗</a>
          </div>
        )}

        {/* ── RSVP ── */}
        <BloomRsvp details={details} rsvpTarget={rsvpTarget} firstName={firstName} secondName={secondName} />

        {/* ── Footer ── */}
        <footer className="bloom-footer">
          <div className="bloom-footer-frame" data-reveal>
            <div className="bloom-footer-bordered">
              <div className="bloom-footer-content">
                <p className="bloom-footer-names bloom-welcome-names">
                  <Copy as="span" field="footer.groom">{firstName}</Copy>
                  <span className="bloom-closing-amp">&amp;</span>
                  <Copy as="span" field="footer.bride">{secondName}</Copy>
                </p>
                <Copy as="p" field="footer.date" className="bloom-footer-date section-eyebrow" style={{ marginTop: '1rem', fontSize: '.875rem' }}>
                  {formatDate(details.date)}
                </Copy>
              </div>
            </div>
          </div>
        </footer>

        {/* ── Opening gate ── */}
        <div className="bloom-opening" onClick={gate.open}>
          <div className="bloom-opening-bg" aria-hidden="true" />
          <InvitationMedia className="bloom-opening-poster" src={`${ASSETS}intro-video-2-poster.jpg`} alt="" aria-hidden="true" priority />
          <video ref={gate.videoRef} className="bloom-opening-video" src={`${ASSETS}intro-video-2-a-H3NxSy.mp4`} muted playsInline preload="auto" />
          <div className="bloom-opening-cta">
            <button type="button" className="bloom-opening-btn">Tap to open</button>
          </div>
        </div>

        {/* ── Audio ── */}
        <audio ref={music.audioRef} src={musicSrc} loop preload="none" />
        {music.visible && <button type="button" className="bloom-music-toggle" style={{ display: 'grid', position: 'fixed', visibility: 'visible', opacity: 1, zIndex: 9999 }} onClick={music.toggle} aria-label={music.muted ? 'Unmute music' : 'Mute music'}>
          {music.muted ? (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 5 6 9H2v6h4l5 4V5Z" /><line x1="23" y1="9" x2="17" y2="15" /><line x1="17" y1="9" x2="23" y2="15" /></svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 5 6 9H2v6h4l5 4V5Z" /><path d="M15.54 8.46a5 5 0 0 1 0 7.07" /><path d="M19.07 4.93a10 10 0 0 1 0 14.14" /></svg>
          )}
        </button>}

        {details.music && <PersonalMusic src={details.music} />}
      </div>
    </InvitationLayoutProvider>
  )
}

function WelcomePerson({ name, family, person }: { name: string; family: string; person: string }) {
  return (
    <div className="bloom-welcome-person">
      <Copy as="h3" field={`welcome.${person}`} label={`${person === 'groom' ? 'Groom' : 'Bride'} · welcome`} className="bloom-welcome-name">{name}</Copy>
      {family.trim() && <Copy as="p" field={`welcome.${person}Family`} className="bloom-welcome-family">{family}</Copy>}
    </div>
  )
}

function EventCard({ event, index, details, couple }: { event: Celebration; index: number; details: InvitationData; couple: string }) {
  const dateParts = (() => {
    const parts = new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: 'short', year: 'numeric', timeZone: 'UTC' }).formatToParts(new Date(`${event.date}T12:00:00Z`))
    const part = (type: Intl.DateTimeFormatPartTypes) => parts.find(p => p.type === type)?.value || ''
    return { day: part('day'), month: part('month').toUpperCase(), year: part('year') }
  })()

  return (
    <article className="bloom-event-card" data-bloom-card="video" data-reveal>
      <video className="bloom-event-video" src={`${ASSETS}humming.mp4`} autoPlay loop muted playsInline preload="metadata" aria-hidden="true" tabIndex={-1} />
      <div className="bloom-event-copy" data-bloom-copy>
        <Copy as="h2" field={`event-${index}.title`} className="font-script" data-card-text>{wrapCardText(event.title, 18)}</Copy>
        <div className="bloom-date-stacked" aria-label={formatDate(event.date)}>
          <span>{dateParts.day}</span><span>{dateParts.month}</span><span>{dateParts.year}</span>
        </div>
        <p>{formatBloomTime(event.time ?? '')}</p>
        <Copy as="h3" field={`event-${index}.venue`} data-card-text>{wrapCardText(event.venue, 24)}</Copy>
        <p data-card-text>{wrapCardText(event.address, 32)}</p>
        <div className="bloom-event-links">
          <a href={mapURL(event.venue, event.address, event.map)} target="_blank" rel="noreferrer" hidden={!event.map.trim()}>{details.labels?.directions || 'Directions'} ↗</a>
          <button type="button" onClick={() => downloadCalendar(event, details.offset, couple)}>Add to calendar</button>
        </div>
      </div>
    </article>
  )
}

function BloomRsvp({ details, rsvpTarget, firstName, secondName }: { details: InvitationData; rsvpTarget?: RsvpTarget; firstName: string; secondName: string }) {
  const [attendance, setAttendance] = useState<'yes' | 'no'>('yes')
  const [guestCount, setGuestCount] = useState(1)
  const [busy, setBusy] = useState(false)
  const [status, setStatus] = useState('')

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!rsvpTarget || busy) return
    const data = new FormData(e.currentTarget)
    setBusy(true)
    setStatus('Sending…')
    try {
      await saveOrderRsvp(rsvpTarget, {
        name: String(data.get('name') || '').trim(),
        attendance,
        count: attendance === 'yes' ? guestCount : 0,
        guests: [],
        message: String(data.get('message') || '').trim(),
      })
      setStatus('Your RSVP has been updated.')
    } catch (err) {
      setStatus(err instanceof Error ? err.message : 'Please try again.')
    } finally { setBusy(false) }
  }

  return (
    <Section data-invite-section="rsvp" className="bloom-rsvp-section" id="rsvp">
      <div style={{ maxWidth: '36rem', margin: '0 auto' }}>
        <div className="bloom-rsvp-header" data-reveal>
          <h2 className="section-heading" style={{ paddingTop: 30 }}>RSVP</h2>
          <span className="section-rule" />
          <p className="section-eyebrow">Kindly let us know if you can join us</p>
        </div>
        <div className="bloom-rsvp-form" data-reveal>
          <div className="card-refined" style={{ position: 'relative' }}>
            <InvitationMedia className="bloom-rsvp-floral-top" src={`${ASSETS}floral-top-right-CS2uPFt2.webp`} alt="" aria-hidden="true" />
            <InvitationMedia className="bloom-rsvp-floral-bottom" src={`${ASSETS}floral-bottom-left-_kTL5SSX.webp`} alt="" aria-hidden="true" />
            <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', fontFamily: 'var(--font-body)' }}>
              <div>
                <label htmlFor="bloom-guest-name">Full name *</label>
                <input id="bloom-guest-name" name="name" required maxLength={120} autoComplete="name" placeholder="Your full name" />
              </div>
              <fieldset>
                <legend>Will you be attending? *</legend>
                <div className="bloom-rsvp-radio-row">
                  <label><input type="radio" name="attendance" value="yes" checked={attendance === 'yes'} onChange={() => setAttendance('yes')} /> Joyfully accepts</label>
                  <label><input type="radio" name="attendance" value="no" checked={attendance === 'no'} onChange={() => setAttendance('no')} /> Regretfully declines</label>
                </div>
              </fieldset>
              {attendance === 'yes' && (
                <div>
                  <label>Number of guests attending *</label>
                  <div className="bloom-guest-counter">
                    <button type="button" aria-label="Remove one guest" onClick={() => setGuestCount(c => Math.max(1, c - 1))}>−</button>
                    <output aria-live="polite">{guestCount}</output>
                    <button type="button" aria-label="Add one guest" onClick={() => setGuestCount(c => Math.min(10, c + 1))}>+</button>
                  </div>
                </div>
              )}
              <div>
                <label htmlFor="bloom-message">A personal message for the couple</label>
                <textarea id="bloom-message" name="message" maxLength={1000} rows={4} placeholder="Share a wish, a memory, or anything you'd like us to read…" />
              </div>
              <p className="bloom-rsvp-note">
                {rsvpTarget ? 'Your reply will be shared with the hosts.' : 'Preview only. Guests can send their RSVP from the published invitation.'}
              </p>
              <button type="submit" className="bloom-rsvp-submit" disabled={!rsvpTarget || busy}>
                {busy ? 'Sending…' : 'Send RSVP'}
              </button>
              {status && <p className="bloom-rsvp-status" role="status" aria-live="polite">{status}</p>}
            </form>
          </div>
        </div>
      </div>
    </Section>
  )
}
