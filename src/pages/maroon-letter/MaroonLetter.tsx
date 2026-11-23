import { useEffect, useRef, useState } from 'react'
import type { ComponentProps } from 'react'
import type { Celebration, InvitationData } from '../../invitations/model'
import { formatDate, formatTime, mapURL } from '../../invitations/model'
import type { RsvpTarget } from '../../invitations/rsvp'
import { EditableText, InvitationLayoutProvider } from '../../invitations/components/EditableText'
import { useMaroonGate } from './useMaroonGate'
import { useMaroonMusic } from './useMaroonMusic'
import { useScrollReveal } from './useScrollReveal'
import { useScratchCard } from './useScratchCard'
import { useCountdown } from './useCountdown'
import { useTouchSparkle } from './useTouchSparkle'
import './MaroonLetter.css'

const ASSETS = '/templates/maroon-letter/'
const FONTS_URL = 'https://fonts.googleapis.com/css2?family=Parisienne&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400;1,500&family=Katibeh&display=swap'

type CopyProps = Omit<ComponentProps<typeof EditableText>, 'textId'> & { field: string }
function Copy({ field, label, children, ...props }: CopyProps) {
  return <EditableText {...props} textId={`t9.${field}`} label={label || field.replaceAll('.', ' · ')}>{children}</EditableText>
}

const DEMO: InvitationData = {
  template: 9,
  groom: 'Muhammed Shafi',
  bride: 'Ayisha Nasrin',
  brideFirst: true,
  date: '2026-10-26',
  time: '11:30',
  offset: '+05:30',
  venue: 'Taj Malabar Resort & Spa',
  address: 'Willingdon Island, Kochi, Kerala',
  map: 'https://www.google.com/maps/search/?api=1&query=Taj%20Malabar%20Resort%20%26%20Spa%2C%20Willingdon%20Island%2C%20Kochi',
  message: '“With the blessings of God and our families, we invite you to celebrate our Nikkah. Your presence and prayers will make our day complete.”',
  groomFamily: 'Son of Mr. & Mrs. Abdul Kareem',
  brideFamily: 'Daughter of Mr. & Mrs. Abdul Rasheed',
  dressCode: '',
  giftNote: '',
  music: `${ASSETS}wedding_nasheed.mp3`,
  gallery: '',
  events: [
    { title: 'Nikkah', date: '2026-10-26', time: '11:30', venue: 'Taj Malabar Resort & Spa', address: 'Willingdon Island, Kochi, Kerala', map: 'https://www.google.com/maps/search/?api=1&query=Taj%20Malabar%20Resort%20%26%20Spa%2C%20Willingdon%20Island%2C%20Kochi' },
    { title: 'Reception', date: '2026-10-27', time: '13:00', venue: 'Le Méridien Kochi', address: 'Maradu', map: 'https://www.google.com/maps/search/?api=1&query=Le%20Meridien%20Kochi%2C%20Maradu' },
  ],
}

export default function MaroonLetter({ details: d = DEMO, rsvpTarget }: { details?: InvitationData; rsvpTarget?: RsvpTarget }) {
  const { state, heroRef, videoRef, openGate, showContent } = useMaroonGate()
  const { muted, toggleMute } = useMaroonMusic(d.music || `${ASSETS}wedding_nasheed.mp3`, state.opened)
  const contentRef = useScrollReveal(state.contentVisible)
  useTouchSparkle(state.opened, '#e9c877')
  const [secondNameStarted, setSecondNameStarted] = useState(false)
  const [allNamesDone, setAllNamesDone] = useState(false)

  const firstEvent = d.events[0]
  const countdown = useCountdown(firstEvent?.date || d.date, firstEvent?.time || d.time, d.offset)

  const firstName = d.brideFirst ? d.bride : d.groom
  const secondName = d.brideFirst ? d.groom : d.bride
  const firstFamily = d.brideFirst ? d.brideFamily : d.groomFamily
  const secondFamily = d.brideFirst ? d.groomFamily : d.brideFamily

  useEffect(() => {
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = FONTS_URL
    document.head.appendChild(link)
    return () => { link.remove() }
  }, [])

  return (
    <InvitationLayoutProvider layout={d.textOverrides} manualLayout={d.textOverrides}>
      <div className="maroon-native">

        {/* Loading */}
        <div className={`loading-screen${state.loaded ? ' hidden' : ''}`}>
          <div className="loading-spinner" />
          <p className="loading-text f-heading">Loading</p>
        </div>

        {/* Mute */}
        {state.contentVisible && (
          <button className="mute-btn" aria-label={muted ? 'Unmute music' : 'Mute music'} onClick={toggleMute}>
            {muted ? <MutedIcon /> : <UnmutedIcon />}
          </button>
        )}

        {/* Hero */}
        <section
          ref={heroRef}
          className={`hero${state.loaded && !state.opened ? ' tappable' : ''}`}
          onClick={openGate}
          onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openGate() } }}
          {...(!state.opened && state.loaded ? { role: 'button', tabIndex: 0 } : {})}
          aria-label="Tap to open invitation"
        >
          <video
            ref={videoRef}
            className="maroon-cover-video"
            src={`${ASSETS}cover.mp4`}
            poster={`${ASSETS}cover.webp`}
            muted
            playsInline
            preload="auto"
          />
          <img className="maroon-cover-poster" src={`${ASSETS}cover.webp`} alt="" draggable={false} />
          <div className="hero-gradient" />

          <div className={`lantern-pair${state.namesVisible ? ' visible' : ''}`}>
            <div className="lantern-side left">
              <div className="lantern-glow" />
              <img className="lantern-img" src={`${ASSETS}lantern.webp`} alt="" draggable={false} />
            </div>
            <div className="lantern-side right">
              <div className="lantern-glow" />
              <img className="lantern-img" src={`${ASSETS}lantern.webp`} alt="" draggable={false} style={{ animationDelay: '0.3s' }} />
            </div>
          </div>

          <div className={`names-reveal${state.namesVisible ? ' visible' : ''}`}>
            <div className="hero-bismillah" dir="rtl" lang="ar">السَّلَامُ عَلَيْكُمْ وَرَحْمَةُ اللَّهِ وَبَرَكَاتُهُ</div>
            <Copy as="p" field="hero.label" className="hero-event-label f-heading">WE JOYFULLY INVITE YOU TO OUR CELEBRATIONS</Copy>
            <TypewriterName
              className="hero-name"
              name={firstName}
              field={d.brideFirst ? 'hero.bride' : 'hero.groom'}
              started={state.namesVisible}
              onDone={() => setSecondNameStarted(true)}
            />
            <FadeInFamily className={`hero-parents f-parents${secondNameStarted ? ' visible' : ''}`} family={firstFamily} field={d.brideFirst ? 'hero.brideParents' : 'hero.groomParents'} />
            <span className={`hero-ampersand${secondNameStarted ? ' visible' : ''}`}>&amp;</span>
            <TypewriterName
              className="hero-name"
              name={secondName}
              field={d.brideFirst ? 'hero.groom' : 'hero.bride'}
              started={secondNameStarted}
              onDone={() => { setAllNamesDone(true); showContent() }}
            />
            <FadeInFamily className={`hero-parents f-parents${allNamesDone ? ' visible' : ''}`} family={secondFamily} field={d.brideFirst ? 'hero.groomParents' : 'hero.brideParents'} />
          </div>

          <button
            className={`tap-to-open${state.loaded && !state.opened ? ' visible' : ''}`}
            style={state.opened ? { display: 'none' } : undefined}
            aria-label="Tap to open the invitation"
            onClick={e => { e.stopPropagation(); openGate() }}
          >
            <span className="tap-ring"><span className="tap-dot" /></span>
            <span className="tap-label f-heading">TAP TO OPEN</span>
          </button>

          <button
            className={`scroll-indicator${state.contentVisible ? ' visible' : ''}`}
            aria-label="Scroll to event details"
            onClick={e => {
              e.stopPropagation()
              contentRef.current?.querySelector('.bismillah-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
            }}
          >
            <p className="scroll-text f-heading">SCROLL</p>
            <span className="scroll-chevron">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
            </span>
          </button>
        </section>

        {/* Content */}
        <div
          ref={contentRef}
          className={`content-section${state.contentVisible ? ' visible' : ''}`}
          aria-hidden={!state.contentVisible}
        >
          <div className="sticky-bg" aria-hidden="true" />
          <div className="content-body">

            <ContentLanterns />

            {/* Bismillah + Story */}
            <section className="bismillah-section">
              <div className="reveal">
                <p className="section-bismillah" dir="rtl" lang="ar" style={{ fontFamily: "'Katibeh','Scheherazade New',serif" }}>بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</p>
              </div>
              <div className="reveal reveal-d1">
                <Copy as="p" field="bismillah.quote" className="story-quote f-heading">{d.message}</Copy>
              </div>
            </section>

            {/* Events */}
            <section className="events-section">
              <div className="reveal">
                <p className="sec-label events-label f-heading">EVENTS</p>
              </div>
              <div className="events-container">
                {d.events.map((ev, i) => (
                  <EventScratchCard
                    key={ev.id || i}
                    event={ev}
                    index={i}
                    enabled={state.contentVisible}
                  />
                ))}
              </div>
              <CountdownBlock countdown={countdown} events={d.events} contentVisible={state.contentVisible} />
            </section>

            {/* Verse */}
            <section className="verse-section">
              <div className="reveal" style={{ maxWidth: '36rem', margin: '0 auto', padding: '0 16px', textAlign: 'center' }}>
                <p className="verse-arabic" dir="rtl" lang="ar" style={{ fontFamily: "'Playfair Display',serif" }}>وَخَلَقْنَاكُمْ أَزْوَاجًا</p>
                <Copy as="p" field="verse.translation" className="verse-translation f-heading">{"“And We created you in pairs”"}</Copy>
                <Copy as="span" field="verse.ref" className="verse-ref f-heading">{"— AN-NABA, 78:8 —"}</Copy>
              </div>
            </section>

            {/* Gallery */}
            <section className="gallery-section">
              <div className="reveal">
                <p className="gallery-heading f-heading">OUR MOMENTS</p>
              </div>
              <div className="gallery-grid reveal reveal-d1">
                {[1, 2, 3, 4].map(n => (
                  <div className="gallery-item" key={n}>
                    <img src={`${ASSETS}gallery_${n}.webp`} alt="" loading="lazy" />
                  </div>
                ))}
              </div>
            </section>

            {/* RSVP */}
            <section className="rsvp-section">
              <div className="reveal">
                <p className="sec-label rsvp-heading f-heading">RSVP</p>
              </div>
              <div className="reveal reveal-d1">
                <Copy as="p" field="rsvp.text" className="rsvp-text f-parents">Kindly grace us with your presence and confirm your attendance.</Copy>
                <RsvpButton />
              </div>
            </section>

            {/* Ending Note */}
            <section className="ending-note-section">
              <div className="reveal">
                <Copy as="p" field="ending.text" className="ending-note-text f-parents">With the blessings of our beloved family, we cordially invite you to grace the auspicious occasion with your presence and prayers.</Copy>
              </div>
            </section>

            {/* Closing Names */}
            <section className="closing-names-section">
              <div style={{ position: 'relative', zIndex: 10, maxWidth: '42rem', margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0 8px' }}>
                <div className="reveal" style={{ maxWidth: '100%' }}>
                  <Copy as="p" field="closing.first" className="closing-name">{firstName.split(' ')[0]}</Copy>
                </div>
                <div className="reveal reveal-d1" style={{ display: 'flex', justifyContent: 'center' }}>
                  <img src={`${ASSETS}love_heart.svg`} alt="" className="closing-heart" draggable={false} />
                </div>
                <div className="reveal reveal-d2" style={{ maxWidth: '100%' }}>
                  <Copy as="p" field="closing.second" className="closing-name">{secondName.split(' ')[0]}</Copy>
                </div>
              </div>
            </section>

            {/* Footer */}
            <footer>
              <div className="reveal">
                <p className="footer-text">
                  Digital invitation made by{' '}
                  <a className="footer-link f-heading" href="https://forevertale.in" target="_blank" rel="noopener noreferrer">Forever Tale</a>
                </p>
              </div>
            </footer>

          </div>
        </div>
      </div>
    </InvitationLayoutProvider>
  )
}

const noop = () => {}

/* ── Typewriter name ── */
function TypewriterName({ className, name, field, started, onDone }: {
  className: string; name: string; field: string; started: boolean; onDone: () => void
}) {
  const ref = useRef<HTMLElement>(null)
  const doneRef = useRef(false)

  useEffect(() => {
    if (!started || doneRef.current) return
    const el = ref.current
    if (!el) return
    const text = name
    let i = 0
    el.textContent = ''
    const cursor = document.createElement('span')
    cursor.className = 'cursor-blink'
    el.appendChild(cursor)

    function tick() {
      if (!cursor.isConnected) { finish(); return }
      if (i < text.length) {
        cursor.before(text[i++])
        setTimeout(tick, 120)
      } else {
        cursor.remove()
        finish()
      }
    }
    function finish() {
      if (doneRef.current) return
      doneRef.current = true
      setTimeout(onDone, 500)
    }

    setTimeout(tick, 120)
  }, [started, name, onDone])

  return (
    <EditableText as="h1" textId={`t9.${field}`} label={field.replaceAll('.', ' · ')} className={className} aria-label={name}>
      <span ref={ref as any} />
    </EditableText>
  )
}

function FadeInFamily({ className, family, field }: { className: string; family: string; field: string }) {
  return <Copy as="p" field={field} className={className}>{family}</Copy>
}

/* ── Event scratch card ── */
function EventScratchCard({ event, index, enabled }: { event: Celebration; index: number; enabled: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const { revealed, forceReveal } = useScratchCard(canvasRef, containerRef, `${ASSETS}scratch.webp`, enabled)
  const [detailsVisible, setDetailsVisible] = useState(false)

  useEffect(() => {
    if (revealed) {
      setDetailsVisible(true)
      burstConfetti(containerRef.current)
    }
  }, [revealed])

  const eventKey = event.id || `event${index}`
  const dateStr = formatDate(event.date, { day: 'numeric', month: 'long', year: 'numeric' }).toUpperCase()
  const timeStr = formatTime(event.time || '')
  const venueUrl = mapURL(event.venue, event.address, event.map)

  return (
    <div className={`event-card reveal${index > 0 ? ' reveal-d1' : ''}`}>
      <p className="event-inshallah" dir="rtl" lang="ar">إن شاء الله</p>
      <EditableText as="h3" textId={`t9.event-${eventKey}.title`} className="event-name-large f-heading">{event.title}</EditableText>
      <div className="scratch-wrap">
        <div className="scratch-card" ref={containerRef}>
          <div className="scratch-inner">
            <div className="scratch-border-outer" />
            <span className="scratch-corner tl" />
            <span className="scratch-corner tr" />
            <span className="scratch-corner bl" />
            <span className="scratch-corner br" />
            <p className="scratch-event-name">{event.title}</p>
            <span className="scratch-divider" />
            <p className="scratch-date f-heading">{dateStr}</p>
            <p className="scratch-time">{timeStr}</p>
            <p className="scratch-venue">{event.venue}</p>
          </div>
          <canvas className="scratch-canvas" ref={canvasRef} />
        </div>
        {!revealed && (
          <>
            <p className="scratch-hint f-heading">Scratch to reveal {event.title} Date</p>
            <button className="scratch-hint-btn f-heading" onClick={() => forceReveal()}>Reveal Date</button>
          </>
        )}
      </div>
      <div className={`event-details${detailsVisible ? ' visible' : ''}`}>
        <p className="detail-date f-heading">{dateStr}</p>
        <p className="detail-time">{timeStr}</p>
        <div style={{ paddingTop: 4, display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'center' }}>
          <p className="detail-venue">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
            <span>{event.venue}{event.address ? `, ${event.address}` : ''}</span>
          </p>
          <a className="detail-map f-heading" href={venueUrl} target="_blank" rel="noopener noreferrer">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12h15M13 5l7 7-7 7" /></svg>
            Get Directions
          </a>
        </div>
      </div>
    </div>
  )
}

/* ── Countdown block ── */
function CountdownBlock({ countdown, events, contentVisible }: {
  countdown: { days: string; hours: string; mins: string; secs: string }
  events: Celebration[]
  contentVisible: boolean
}) {
  const [show, setShow] = useState(false)
  useEffect(() => {
    if (contentVisible && events.length > 0) {
      const timer = setTimeout(() => setShow(true), 2400)
      return () => clearTimeout(timer)
    }
  }, [contentVisible, events.length])

  if (!show) return null
  return (
    <div className="countdown-section">
      <div className="reveal in">
        <p className="sec-label countdown-label f-heading">COUNTING DOWN TO</p>
      </div>
      <div className="reveal reveal-d1 in">
        <div className="countdown-grid">
          <div className="countdown-box">
            <span className="countdown-num f-heading">{countdown.days}</span>
            <span className="countdown-unit f-heading">DAYS</span>
          </div>
          <div className="countdown-box">
            <span className="countdown-num f-heading">{countdown.hours}</span>
            <span className="countdown-unit f-heading">HRS</span>
          </div>
          <div className="countdown-box">
            <span className="countdown-num f-heading">{countdown.mins}</span>
            <span className="countdown-unit f-heading">MIN</span>
          </div>
          <div className="countdown-box">
            <span className="countdown-num f-heading">{countdown.secs}</span>
            <span className="countdown-unit f-heading">SEC</span>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ── RSVP button ── */
function RsvpButton() {
  return (
    <a className="rsvp-btn f-heading" href="https://forevertale.in" target="_blank" rel="noopener noreferrer">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.64 12 19.79 19.79 0 0 1 1.5 3.45a2 2 0 0 1 1.95-2.18h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 9.1a16 16 0 0 0 7 7l1.06-1.06a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 17Z" />
      </svg>
      Confirm Attendance
    </a>
  )
}

/* ── Content lanterns ── */
function ContentLanterns() {
  return (
    <div className="content-lanterns" aria-hidden="true">
      {[0, 1, 2, 3, 4].map(i => (
        <div key={i} className={`clant cl-pos-${i}`}>
          <div className={`cl-glow-${i}`} />
          <img
            className={`clant-img cl-h${i}`}
            src={`${ASSETS}lantern.webp`}
            alt=""
            draggable={false}
            style={{
              animation: `maroon-sway ${[4.2, 4.8, 5.4, 4.5, 5.1][i]}s ease-in-out ${[0, 1.1, 0.5, 1.6, 0.9][i]}s infinite`,
              transformOrigin: '50% 0%',
            }}
          />
        </div>
      ))}
    </div>
  )
}

/* ── Confetti burst ── */
function burstConfetti(origin: HTMLElement | null) {
  if (!origin) return
  const rect = origin.getBoundingClientRect()
  const cx = rect.left + rect.width / 2
  const cy = rect.top + rect.height / 2
  const colors = ['#e9c877', '#d4af37', '#f2ddac', '#faf1d9', '#b8912a']
  for (let k = 0; k < 18; k++) {
    setTimeout(() => {
      const p = document.createElement('div')
      p.className = 'maroon-native-burst'
      const angle = (k / 18) * Math.PI * 2
      const dist = 60 + Math.random() * 60
      p.style.setProperty('--dx', Math.cos(angle) * dist + 'px')
      p.style.setProperty('--dy', (Math.sin(angle) * dist - 20) + 'px')
      p.style.left = cx + 'px'
      p.style.top = cy + 'px'
      p.style.background = colors[k % colors.length]
      const size = (4 + Math.random() * 4) + 'px'
      p.style.width = size
      p.style.height = size
      document.body.appendChild(p)
      setTimeout(() => p.remove(), 900)
    }, k * 20)
  }
}

/* ── SVG Icons ── */
function UnmutedIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" /><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
    </svg>
  )
}
function MutedIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" /><line x1="23" y1="9" x2="17" y2="15" /><line x1="17" y1="9" x2="23" y2="15" />
    </svg>
  )
}
