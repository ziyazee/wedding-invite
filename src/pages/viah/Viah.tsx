import { Fragment, useCallback, useEffect, useRef, useState } from 'react'
import type { InvitationData } from '../../invitations/model'
import { formatDate, formatTime, mapURL, weddingISO } from '../../invitations/model'
import { downloadCalendar } from '../../invitations/calendar'
import type { RsvpTarget } from '../../invitations/rsvp'
import { saveOrderRsvp } from '../../invitations/rsvp'
import { EditableText, InvitationLayoutProvider } from '../../invitations/components/EditableText'
import { InvitationSection } from '../../invitations/components/InvitationSection'
import { InvitationMedia } from '../../invitations/components/InvitationMedia'
import { mergeTextLayouts, textSizingKey } from '../../invitations/textLayout'
import { useCinematicGate } from '../shared/cinematic/useCinematicGate'
import { useParallaxScenes } from '../shared/cinematic/useParallaxScenes'
import { useLayerLoading } from '../shared/cinematic/useLayerLoading'
import { FloatingLanterns } from '../shared/cinematic/FloatingLanterns'
import './Viah.css'

const FONTS_URL = 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=Jost:wght@300;400;500&display=swap'

type CopyProps = Omit<React.ComponentProps<typeof EditableText>, 'textId'> & { field: string }
function Copy({ field, label, ...props }: CopyProps) {
  return <EditableText {...props} textId={`t16.${field}`} label={label || field.replaceAll('.', ' · ')} />
}

const VIAH_DEMO: InvitationData = {
  template: 16, groom: 'Navneet', bride: 'Jasleen',
  date: '2027-02-14', time: '11:00', offset: '+05:30',
  venue: 'Haveli Heritage', address: 'GT Road, Amritsar, Punjab',
  map: 'https://www.google.com/maps',
  message: 'We are both so happy that you will be with us as we begin our life together. Since our roka, the love and blessings we have received from our families and friends have touched us more deeply than we can say. We would like to thank each of you sincerely for your kindness, your warmth and your prayers. We would be honoured to have you with us at our viah, and we look forward to celebrating with you.',
  groomFamily: 'Mr. Harpreet Singh & Mrs. Gurpreet Kaur',
  brideFamily: 'Mr. Maninder Singh & Mrs. Rajwinder Kaur',
  dressCode: '', giftNote: '', music: '/templates/viah/music.mp3', gallery: '',
  events: [
    { title: 'Mehndi', date: '2027-02-12', time: '16:00', venue: 'Haveli Heritage', address: 'GT Road, Amritsar, Punjab', map: 'https://www.google.com/maps' },
    { title: 'Jago', date: '2027-02-12', time: '21:00', venue: 'Haveli Heritage', address: 'GT Road, Amritsar, Punjab', map: 'https://www.google.com/maps' },
    { title: 'Wedding', date: '2027-02-14', time: '11:00', venue: 'Haveli Heritage', address: 'GT Road, Amritsar, Punjab', map: 'https://www.google.com/maps' },
    { title: 'Reception', date: '2027-02-14', time: '19:00', venue: 'Haveli Heritage', address: 'GT Road, Amritsar, Punjab', map: 'https://www.google.com/maps' },
  ],
}

function coupleLabel(d: InvitationData) {
  return d.brideFirst ? `${d.bride} & ${d.groom}` : `${d.groom} & ${d.bride}`
}

function wantsPortrait() {
  return window.matchMedia('(max-width: 720px)').matches ||
    window.matchMedia('(min-width: 721px) and (max-width: 1024px) and (orientation: portrait)').matches
}

function GateArt({ d }: { d: InvitationData }) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const portrait = wantsPortrait()
    const url = portrait ? '/templates/viah/assets/gate/00-gate-p.png' : '/templates/viah/assets/gate/00-gate-p.png'
    const img = new Image()
    img.onload = () => { el.style.backgroundImage = `url("${url}")` }
    img.src = url
  }, [])
  return <div ref={ref} className="gate__art" aria-hidden="true" />
}

function Countdown({ d }: { d: InvitationData }) {
  const [now, setNow] = useState(Date.now)
  useEffect(() => { const t = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(t) }, [])
  let remaining = Math.max(0, Math.floor((new Date(weddingISO(d)).getTime() - now) / 1000))
  const units = [86400, 3600, 60, 1].map(u => { const v = Math.floor(remaining / u); remaining %= u; return v })
  const labels = ['days', 'hrs', 'min', 'sec']
  if (units.every(v => v === 0) && new Date(weddingISO(d)).getTime() <= now) return null
  return (
    <div className="countdown">
      {units.map((v, i) => (
        <div className="countdown__unit" key={i}>
          <span className="countdown__n">{v}</span>
          <span className="countdown__l">{labels[i]}</span>
        </div>
      ))}
    </div>
  )
}

function RsvpForm({ d, rsvpTarget }: { d: InvitationData; rsvpTarget?: RsvpTarget }) {
  const [count, setCount] = useState(1)
  const [busy, setBusy] = useState(false)
  const [status, setStatus] = useState('')
  const formRef = useRef<HTMLFormElement>(null)

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!rsvpTarget || busy) return
    const data = new FormData(e.currentTarget)
    setBusy(true); setStatus('Sending…')
    try {
      await saveOrderRsvp(rsvpTarget, {
        name: String(data.get('guestName') || '').trim(),
        attendance: 'yes', count,
        guests: [], message: String(data.get('message') || '').trim(),
      })
      setStatus('Thank you. Your reply has been saved.')
    } catch (err) { setStatus(err instanceof Error ? err.message : 'Please try again.') }
    finally { setBusy(false) }
  }

  return (
    <div className="card card--rsvp">
      <form ref={formRef} className="form rsvp-form" onSubmit={submit}>
        <input type="hidden" name="attending" value="yes" />
        <h2 className="scene-title rsvp-heading">Will you be attending <em>our wedding?</em></h2>
        <input className="rsvp-line-input" name="guestName" type="text" required autoComplete="name" placeholder="Your name" aria-label="Your name" />
        <div className="rsvp-count-row">
          <span>Number of guests</span>
          <div className="rsvp-count-controls">
            <button type="button" aria-label="Remove one guest" onClick={() => setCount(c => Math.max(1, c - 1))}>&#8722;</button>
            <input type="number" min={1} max={10} step={1} value={count} onChange={e => { const n = parseInt(e.target.value); if (n >= 1 && n <= 10) setCount(n) }} aria-label="Number of guests" />
            <button type="button" aria-label="Add one guest" onClick={() => setCount(c => Math.min(10, c + 1))}>+</button>
          </div>
        </div>
        <textarea className="rsvp-message" name="message" rows={1} placeholder="A personal message for us..." aria-label="A personal message for us" />
        <button className="btn btn--solid rsvp-submit" type="submit" disabled={busy}>Submit RSVP</button>
        <p className="status" role="status" aria-live="polite">{status}</p>
      </form>
    </div>
  )
}

function WishWall({ d, rsvpTarget }: { d: InvitationData; rsvpTarget?: RsvpTarget }) {
  const [busy, setBusy] = useState(false)
  const [status, setStatus] = useState('')
  const formRef = useRef<HTMLFormElement>(null)

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!rsvpTarget || busy) return
    const data = new FormData(e.currentTarget)
    setBusy(true); setStatus('Sending…')
    try {
      await saveOrderRsvp(rsvpTarget, {
        name: String(data.get('guestName') || '').trim(),
        attendance: 'yes', count: 0, guests: [],
        message: String(data.get('message') || '').trim(),
      })
      setStatus('Thank you for your blessing.')
      formRef.current?.reset()
    } catch (err) { setStatus(err instanceof Error ? err.message : 'Please try again.') }
    finally { setBusy(false) }
  }

  return (
    <div className="card">
      <Copy as="p" field="wish.eyebrow" className="eyebrow">Blessings for the couple</Copy>
      <Copy as="h2" field="wish.title" className="scene-title">Asheervad</Copy>
      <form ref={formRef} className="form" onSubmit={submit}>
        <div className="field">
          <label htmlFor="wish-name">Your name</label>
          <input id="wish-name" name="guestName" type="text" required autoComplete="name" />
        </div>
        <div className="field">
          <label htmlFor="wish-msg">Your blessing</label>
          <textarea id="wish-msg" name="message" rows={3} required />
        </div>
        <button className="btn btn--solid" type="submit" disabled={busy}>Send your blessing</button>
        <p className="status" role="status" aria-live="polite">{status}</p>
      </form>
    </div>
  )
}

function MusicToggle({ src, opened }: { src: string; opened: boolean }) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [playing, setPlaying] = useState(false)
  const startedRef = useRef(false)

  useEffect(() => {
    if (!opened || startedRef.current) return
    const audio = audioRef.current
    if (!audio) return
    startedRef.current = true
    audio.currentTime = 5
    audio.volume = 0.55
    audio.muted = false
    void audio.play().catch(() => {})
  }, [opened])

  function toggle() {
    const audio = audioRef.current
    if (!audio) return
    if (playing) {
      audio.pause()
    } else {
      audio.muted = false
      audio.volume = 0.55
      void audio.play().catch(() => {})
    }
  }

  return (
    <>
      <audio ref={audioRef} src={src} loop preload="none" muted playsInline
        onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} />
      <button className="music" type="button" aria-label="Toggle background music" aria-pressed={playing} onClick={toggle}>
        <svg className="music__on" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <path d="M9 18V6l10-2v12" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
          <circle cx="6.5" cy="18" r="2.5" fill="none" stroke="currentColor" strokeWidth="1.7"/>
          <circle cx="16.5" cy="16" r="2.5" fill="none" stroke="currentColor" strokeWidth="1.7"/>
        </svg>
        <span className="music__bars" aria-hidden="true"><i/><i/><i/></span>
      </button>
    </>
  )
}

export default function Viah({ details: d = VIAH_DEMO, rsvpTarget }: { details: InvitationData; rsvpTarget?: RsvpTarget }) {
  const rootRef = useRef<HTMLDivElement>(null)
  const scrollerRef = useRef<HTMLElement>(null)
  const scene4Ref = useRef<HTMLElement>(null)
  const { opened, openGate } = useCinematicGate(rootRef as React.RefObject<HTMLElement>)
  const reduceMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const refreshGateArt = useCallback(() => {
    const gate = rootRef.current?.querySelector<HTMLElement>('.gate__art')
    if (!gate) return
    const portrait = wantsPortrait()
    const url = portrait ? '/templates/viah/assets/gate/00-gate-p.png' : '/templates/viah/assets/gate/00-gate-p.png'
    const img = new Image()
    img.onload = () => { gate.style.backgroundImage = `url("${url}")` }
    img.src = url
  }, [])

  useLayerLoading(rootRef as React.RefObject<HTMLElement>, refreshGateArt)
  useParallaxScenes(scrollerRef, opened, reduceMotion)

  useEffect(() => {
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = FONTS_URL
    document.head.appendChild(link)
    const pc1 = document.createElement('link')
    pc1.rel = 'preconnect'
    pc1.href = 'https://fonts.googleapis.com'
    document.head.appendChild(pc1)
    const pc2 = document.createElement('link')
    pc2.rel = 'preconnect'
    pc2.href = 'https://fonts.gstatic.com'
    pc2.crossOrigin = 'anonymous'
    document.head.appendChild(pc2)
    return () => { link.remove(); pc1.remove(); pc2.remove() }
  }, [])

  const couple = coupleLabel(d)
  const events = d.events.map((event, index) => ({ event, key: event.id || `legacy-${index}` }))
    .sort((a, b) => `${a.event.date}T${a.event.time}`.localeCompare(`${b.event.date}T${b.event.time}`))

  useEffect(() => {
    const prev = document.title
    document.title = `${couple} — Wedding Invitation`
    return () => { document.title = prev }
  }, [couple])

  const people = d.brideFirst
    ? [{ key: 'bride', name: d.bride, family: d.brideFamily }, { key: 'groom', name: d.groom, family: d.groomFamily }]
    : [{ key: 'groom', name: d.groom, family: d.groomFamily }, { key: 'bride', name: d.bride, family: d.brideFamily }]

  return (
    <InvitationLayoutProvider layout={d.textOverrides} manualLayout={d.textOverrides ?? null}>
    <div ref={rootRef} className="viah-native">

      {/* Gate */}
      <div className="gate" id="gate">
        <GateArt d={d} />
        <div className="gate__inner">
          <Copy as="p" field="gate.eyebrow" className="gate__eyebrow">You are invited to the Viah of</Copy>
          <h1 className="gate__names">
            <Copy field="gate.groom" label="Groom · gate">{people[0].name}</Copy>
            <span className="gate__amp">&amp;</span>
            <Copy field="gate.bride" label="Bride · gate">{people[1].name}</Copy>
          </h1>
          <Copy as="p" field="gate.date" className="gate__date">{formatDate(d.date)}</Copy>
          <button className="gate__btn" type="button" onClick={openGate}>Open the invitation</button>
        </div>
      </div>

      {/* Scroller */}
      <main className="scroller" ref={scrollerRef}>

        {/* Scene 1 — Haveli dawn · couple names */}
        <InvitationSection as="section" data-invite-section="scene1" className="panel" data-scene="1" data-text="top-left" data-tint="warm">
          <div className="layer bg" data-depth="0" data-bg="/templates/viah/assets/scene1/01-haveli-dawn.png" data-bg-p="/templates/viah/assets/scene1/01-haveli-dawn-p.png" />
          <div className="layer el fig-left" data-depth="8" data-src="/templates/viah/assets/scene1/02-her.png" />
          <div className="layer el fig-right" data-depth="10" data-src="/templates/viah/assets/scene1/03-him.png" />
          <div className="panel__inner">
            <Copy as="p" field="scene1.eyebrow" className="eyebrow">With love and joy</Copy>
            <h1 className="names">
              <Copy field="scene1.groom" label="Groom · scene 1">{people[0].name}</Copy>
              <Copy field="scene1.amp" className="amp">&amp;</Copy>
              <Copy field="scene1.bride" label="Bride · scene 1">{people[1].name}</Copy>
            </h1>
            <Copy as="p" field="scene1.lede" className="lede">are getting married</Copy>
          </div>
          <div className="cue" aria-hidden="true">Scroll</div>
        </InvitationSection>

        {/* Scene 2 — Courtyard · families */}
        <InvitationSection as="section" data-invite-section="scene2" className="panel" data-scene="2" data-text="center" data-tint="warm">
          <div className="layer bg" data-depth="0" data-bg="/templates/viah/assets/scene2/01-courtyard.png" data-bg-p="/templates/viah/assets/scene2/01-courtyard-p.png" />
          <div className="layer el fill glow" data-depth="8" data-src="/templates/viah/assets/golden-bokeh.png" />
          <div className="panel__inner panel__inner--wide">
            <Copy as="p" field="scene2.eyebrow" className="eyebrow">Together with our families</Copy>
            <div className="families">
              <div className="family">
                <Copy as="p" field="scene2.person1" className="family__label family__person-name">{people[0].name}</Copy>
                <Copy as="p" field="scene2.family1" className="family__name">{people[0].family}</Copy>
              </div>
              <div className="family__sep" aria-hidden="true">
                <InvitationMedia src="/templates/viah/assets/phulkari-motif.png" alt="" />
              </div>
              <div className="family">
                <Copy as="p" field="scene2.person2" className="family__label family__person-name">{people[1].name}</Copy>
                <Copy as="p" field="scene2.family2" className="family__name">{people[1].family}</Copy>
              </div>
            </div>
            {d.message && <Copy as="p" field="scene2.message" className="lede lede--story">{d.message}</Copy>}
          </div>
        </InvitationSection>

        {/* Scene 3 — Night lights · date + countdown */}
        <InvitationSection as="section" data-invite-section="scene3" className="panel" data-scene="3" data-text="top-right" data-tint="cool">
          <div className="layer bg" data-depth="0" data-bg="/templates/viah/assets/scene3/01-diya-night.png" data-bg-p="/templates/viah/assets/scene3/01-diya-night-p.png" />
          <div className="layer el fill glow" data-depth="7" data-src="/templates/viah/assets/warm-lampglow.png" />
          <div className="layer el fig-center" data-depth="16" data-src="/templates/viah/assets/scene3/02-couple-seated.png" />
          <div className="panel__inner">
            <Copy as="p" field="scene3.eyebrow" className="eyebrow">Save the date</Copy>
            <Copy as="h2" field="scene3.date" className="date-big">{formatDate(d.date)}</Copy>
            <Copy as="p" field="scene3.venue" className="lede">{d.venue}</Copy>
            <Countdown d={d} />
          </div>
        </InvitationSection>

        {/* Scene 4 — Celebrations */}
        <InvitationSection as="section" ref={scene4Ref} data-invite-section="scene4" className="panel panel--tall" data-scene="4" data-text="bottom-left" data-tint="warm" data-lantern="/templates/viah/assets/kalire-float.png">
          <div className="layer bg" data-depth="0" data-bg="/templates/viah/assets/scene4/01-festive-court.png" data-bg-p="/templates/viah/assets/scene4/01-festive-court-p.png" />
          <div className="layer el fig-center" data-depth="16" data-src="/templates/viah/assets/scene4/02-festive-moment.png" />
          <FloatingLanterns src="/templates/viah/assets/kalire-float.png" scrollerRef={scrollerRef} sceneRef={scene4Ref} />
          <div className="panel__inner panel__inner--wide">
            <Copy as="p" field="scene4.eyebrow" className="eyebrow">The celebrations</Copy>
            <Copy as="h2" field="scene4.title" className="scene-title">Join us</Copy>
            <div className="functions">
              {events.map(({ event, key }) => (
                <article className="fn" key={key}>
                  <Copy as="h3" field={`event-${key}.name`} className="fn__name">{event.title}</Copy>
                  <div className="fn__when">
                    <Copy field={`event-${key}.date`} className="fn__date">{formatDate(event.date)}</Copy>
                    <Copy field={`event-${key}.time`} className="fn__time">{formatTime(event.time ?? '')}</Copy>
                  </div>
                  <p className="fn__venue">
                    <Copy field={`event-${key}.venue`}>{event.venue}</Copy>
                    <Copy field={`event-${key}.address`} className="fn__addr">{event.address}</Copy>
                  </p>
                  {d.dressCode && <p className="fn__meta"><span>Dress code</span> {d.dressCode}</p>}
                  {event.map && (
                    <a className="fn__map" href={mapURL(event.venue, event.address, event.map)} target="_blank" rel="noopener noreferrer">See the route</a>
                  )}
                </article>
              ))}
            </div>
          </div>
        </InvitationSection>

        {/* Scene 6 — The Wedding · ceremony */}
        <InvitationSection as="section" data-invite-section="scene6" className="panel" data-scene="6" data-text="top-left" data-tint="warm">
          <div className="layer bg" data-depth="0" data-bg="/templates/viah/assets/scene6/01-mandap-night.png" data-bg-p="/templates/viah/assets/scene6/01-mandap-night-p.png" />
          <div className="layer el fig-center" data-depth="16" data-src="/templates/viah/assets/scene6/02-ceremony-moment.png" />
          <div className="panel__inner">
            <InvitationMedia className="crest crest--sm" src="/templates/viah/assets/kalire-motif.png" alt="" aria-hidden="true" />
            <Copy as="p" field="scene6.eyebrow" className="eyebrow">The Wedding</Copy>
            <Copy as="h2" field="scene6.title" className="scene-title">Our Viah</Copy>
            <Copy as="p" field="scene6.note" className="lede nikah-note">With blessings and joy, we invite you to celebrate our viah and the beginning of our life together.</Copy>
            <div className="nikah-details">
              <Copy as="p" field="scene6.venue" className="lede nikah-venue">{d.venue}</Copy>
              <Copy as="p" field="scene6.address" className="lede nikah-address">{d.address}</Copy>
              <div className="nikah-date-time">
                <Copy as="p" field="scene6.date" className="lede nikah-date">{formatDate(d.date)}</Copy>
                <Copy as="p" field="scene6.time" className="lede nikah-time">{formatTime(d.time)}</Copy>
              </div>
            </div>
          </div>
        </InvitationSection>

        {/* Scene 7 — Garden pavilion · RSVP */}
        <InvitationSection as="section" data-invite-section="scene7" className="panel panel--tall" data-scene="7" data-text="bottom-right" data-tint="warm">
          <div className="layer bg" data-depth="0" data-bg="/templates/viah/assets/scene7/01-garden-pavilion.png" data-bg-p="/templates/viah/assets/scene7/01-garden-pavilion-p.png" />
          <div className="layer el fill glow" data-depth="6" data-src="/templates/viah/assets/golden-bokeh.png" />
          <div className="layer el fig-center" data-depth="16" data-src="/templates/viah/assets/scene7/02-couple-close.png" />
          <div className="panel__inner">
            <RsvpForm d={d} rsvpTarget={rsvpTarget} />
          </div>
        </InvitationSection>

        {/* Scene 8 — Starlit court · blessings */}
        <InvitationSection as="section" data-invite-section="scene8" className="panel panel--tall panel--finale" data-scene="8" data-text="top-left" data-tint="warm">
          <div className="layer bg" data-depth="0" data-bg="/templates/viah/assets/scene8/01-starlit-court.png" data-bg-p="/templates/viah/assets/scene8/01-starlit-court-p.png" />
          <div className="layer el fig-seated" data-depth="15" data-src="/templates/viah/assets/scene8/02-couple-sit.png" />
          <div className="panel__inner panel__inner--wide">
            <WishWall d={d} rsvpTarget={rsvpTarget} />
            <footer className="footer">
              <InvitationMedia className="footer__orn" src="/templates/viah/assets/footer-ornament.png" alt="" aria-hidden="true" />
              <Copy as="p" field="footer.names" className="footer__names">{couple}</Copy>
              <Copy as="p" field="footer.date" className="footer__date">{formatDate(d.date)}</Copy>
            </footer>
          </div>
        </InvitationSection>

      </main>

      <MusicToggle src={d.music || '/templates/viah/music.mp3'} opened={opened} />

    </div>
    </InvitationLayoutProvider>
  )
}
