import { useCallback, useEffect, useRef, useState } from 'react'
import type { ComponentProps } from 'react'
import type { InvitationData } from '../../invitations/model'
import { formatDate, formatTime, weddingISO } from '../../invitations/model'
import type { RsvpTarget } from '../../invitations/rsvp'
import { EditableText, InvitationLayoutProvider } from '../../invitations/components/EditableText'
import { InvitationSection as Section } from '../../invitations/components/InvitationSection'
import { useEmeraldGate } from './useEmeraldGate'
import { usePageSwipe } from './usePageSwipe'
import { useEmeraldMusic } from './useEmeraldMusic'
import { useCountdown } from './useCountdown'
import { useTouchSparkle } from './useTouchSparkle'
import './EmeraldParchment.css'

const ASSETS = '/templates/emerald-parchment/'
const FONTS_URL = 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&family=Katibeh&family=Parisienne&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600&display=swap'
const TOTAL_PAGES = 9

type CopyProps = Omit<ComponentProps<typeof EditableText>, 'textId'> & { field: string }
function Copy({ field, label, children, ...props }: CopyProps) {
  return <EditableText {...props} textId={`t10.${field}`} label={label || field.replaceAll('.', ' · ')}>{children}</EditableText>
}

const DEMO: InvitationData = {
  template: 10,
  groom: 'Shafi',
  bride: 'Ayisha',
  brideFirst: true,
  date: '2026-10-27',
  time: '11:30',
  offset: '+05:30',
  venue: 'Taj Malabar Resort & Spa',
  address: 'Willingdon Island, Kochi, Kerala',
  map: 'https://www.google.com/maps/search/?api=1&query=Taj%20Malabar%20Resort%20%26%20Spa%2C%20Willingdon%20Island%2C%20Kochi',
  message: 'With the blessings of God and our families, we invite you to celebrate our Nikkah. Your presence and prayers will make our day complete.',
  groomFamily: 'Son of Mr. & Mrs. Abdul Kareem',
  brideFamily: 'Daughter of Mr. & Mrs. Abdul Rasheed',
  dressCode: '',
  giftNote: '',
  music: '/audios/music.mp3',
  gallery: '',
  events: [
    { title: 'Nikkah', date: '2026-10-27', time: '11:30', venue: 'Taj Malabar Resort & Spa', address: 'Willingdon Island, Kochi, Kerala', map: 'https://www.google.com/maps/search/?api=1&query=Taj%20Malabar%20Resort%20%26%20Spa%2C%20Willingdon%20Island%2C%20Kochi' },
    { title: 'Reception', date: '2026-10-28', time: '13:00', venue: 'Le Méridien Kochi', address: 'Maradu', map: 'https://www.google.com/maps/search/?api=1&query=Le%20Meridien%20Kochi%2C%20Maradu' },
  ],
}

/* ── SVG ornaments ── */
function ArchOrn() {
  return (
    <svg viewBox="0 0 120 28" width={88} height={20} className="orn" aria-hidden="true" fill="none">
      <path d="M8 16c12-10 28-12 52-12s40 2 52 12" stroke="#b98a4a" strokeWidth="1.2" strokeLinecap="round" opacity="0.85"/>
      <path d="M28 18c8-6 18-8 32-8s24 2 32 8" stroke="#b98a4a" strokeWidth="1" strokeLinecap="round" opacity="0.55"/>
      <path d="M52 20c2.5-5 8-8 8-8s5.5 3 8 8" stroke="#b98a4a" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" opacity="0.9"/>
      <circle cx="60" cy="10" r="2.2" fill="#b98a4a" opacity="0.85"/>
    </svg>
  )
}
function LeafOrn() {
  return (
    <svg viewBox="0 0 36 20" width={28} height={16} aria-hidden="true" fill="none">
      <path d="M18 17c0-7-4.5-11-9-13 3.5 1 7 4.5 9 9 2-4.5 5.5-8 9-9-4.5 2-9 6-9 13Z" fill="#b98a4a" opacity="0.88"/>
      <path d="M18 17V6" stroke="#b98a4a" strokeWidth="1" strokeLinecap="round" opacity="0.7"/>
      <path d="M18 10c-3-2.5-5.5-3-7-3M18 10c3-2.5 5.5-3 7-3" stroke="#b98a4a" strokeWidth="0.9" strokeLinecap="round" opacity="0.65"/>
    </svg>
  )
}
function FanOrn({ full }: { full?: boolean }) {
  return (
    <svg viewBox="0 0 160 36" width={120} height={28} className="orn" aria-hidden="true" fill="none" style={{ opacity: 0.9 }}>
      <path d="M80 4v22M68 10c4 4 8 6 12 6s8-2 12-6M60 16c6 5 12 8 20 8s14-3 20-8" stroke="#b98a4a" strokeWidth="1.15" strokeLinecap="round" strokeLinejoin="round" opacity="0.85"/>
      <path d="M48 22c8 4 16 6 32 6s24-2 32-6" stroke="#b98a4a" strokeWidth="1" strokeLinecap="round" opacity="0.55"/>
      {full && <path d="M36 28c10 3 22 5 44 5s34-2 44-5" stroke="#b98a4a" strokeWidth="1" strokeLinecap="round" opacity="0.55"/>}
      <circle cx="80" cy="4" r="2" fill="#b98a4a" opacity="0.85"/>
      {full && <circle cx="20" cy="18" r="1.5" fill="#b98a4a" opacity="0.7"/>}
      {full && <circle cx="140" cy="18" r="1.5" fill="#b98a4a" opacity="0.7"/>}
    </svg>
  )
}
function DiamondOrn() {
  return (
    <svg viewBox="0 0 12 12" width={10} height={10} aria-hidden="true">
      <path d="M6 1.2 10.8 6 6 10.8 1.2 6Z" fill="#b98a4a" opacity="0.85"/>
    </svg>
  )
}
function Flourish({ flip }: { flip?: boolean }) {
  return (
    <svg viewBox="0 0 64 12" width={52} height={12} aria-hidden="true" fill="none" style={flip ? { transform: 'scaleX(-1)' } : undefined}>
      <path d="M4 6h52" stroke="#b98a4a" strokeWidth="1.15" strokeLinecap="round" opacity="0.8"/>
      <path d="M4 6c3-3.5 7-4.5 10-4.5" stroke="#b98a4a" strokeWidth="1" strokeLinecap="round" opacity="0.7"/>
      <circle cx="58" cy="6" r="1.4" fill="#b98a4a" opacity="0.75"/>
    </svg>
  )
}
function MapPinIcon({ size = 14 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width={size} height={size}>
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
    </svg>
  )
}
function ChevronDown() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
  )
}
function ScrollBtn({ onClick }: { onClick: () => void }) {
  return (
    <button className="ep-scroll-btn" onClick={onClick}>
      <span className="ep-scroll-btn-label f-heading">Scroll</span>
      <span className="ep-scroll-btn-chevron"><ChevronDown /></span>
    </button>
  )
}

export default function EmeraldParchment({ details: d = DEMO, rsvpTarget }: { details?: InvitationData; rsvpTarget?: RsvpTarget }) {
  const { state, heroRef, videoRef, posterRef, handleTap, heroScrollUp } = useEmeraldGate()
  const { currentPage, nextPage } = usePageSwipe(TOTAL_PAGES, heroScrollUp, state.heroGone)
  const { audioRef, startMusic, muted, toggleMute } = useEmeraldMusic()
  const sparkleRef = useTouchSparkle()

  const firstName = d.brideFirst !== false ? d.bride : d.groom
  const secondName = d.brideFirst !== false ? d.groom : d.bride
  const firstParents = d.brideFirst !== false ? (d.brideFamily || '') : (d.groomFamily || '')
  const secondParents = d.brideFirst !== false ? (d.groomFamily || '') : (d.brideFamily || '')

  // Date calculations
  const firstEvent = d.events?.[0]
  const eventDate = new Date((firstEvent?.date || d.date) + 'T12:00:00')
  const bigDay = String(eventDate.getDate())
  const monthYear = eventDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }).toUpperCase()
  const dayName = eventDate.toLocaleDateString('en-US', { weekday: 'long' })
  const whenTime = formatTime(firstEvent?.time || d.time)
  const whenLine = `${dayName} · ${whenTime}`

  const iso = weddingISO(d)
  const cd = useCountdown(iso)

  const galleryImages = d.gallery
    ? d.gallery.split(',').map(s => s.trim()).filter(Boolean)
    : [1, 2, 3, 4].map(n => `${ASSETS}gallery_${n}.webp`)

  // Typewriter state
  const [tw, setTw] = useState({ first: '', firstDone: false, firstParents: false, amp: false, second: '', secondDone: false, secondParents: false })
  useEffect(() => {
    if (!state.namesVisible) return
    const timers: ReturnType<typeof setTimeout>[] = []
    let delay = 400
    for (let i = 0; i <= firstName.length; i++) {
      timers.push(setTimeout(() => setTw(s => ({ ...s, first: firstName.slice(0, i) })), delay + i * 85))
    }
    delay += firstName.length * 85
    timers.push(setTimeout(() => setTw(s => ({ ...s, firstDone: true })), delay))
    timers.push(setTimeout(() => setTw(s => ({ ...s, firstParents: true })), delay + 400))
    timers.push(setTimeout(() => setTw(s => ({ ...s, amp: true })), delay + 700))
    delay += 900
    for (let i = 0; i <= secondName.length; i++) {
      timers.push(setTimeout(() => setTw(s => ({ ...s, second: secondName.slice(0, i) })), delay + i * 85))
    }
    delay += secondName.length * 85
    timers.push(setTimeout(() => setTw(s => ({ ...s, secondDone: true })), delay))
    timers.push(setTimeout(() => setTw(s => ({ ...s, secondParents: true })), delay + 900))
    return () => timers.forEach(clearTimeout)
  }, [state.namesVisible, firstName, secondName])

  // Start music when video first half begins
  useEffect(() => {
    if (state.heroPhase === 2) startMusic()
  }, [state.heroPhase, startMusic])

  // Font loading
  useEffect(() => {
    if (!document.querySelector(`link[href="${FONTS_URL}"]`)) {
      const link = document.createElement('link')
      link.rel = 'stylesheet'
      link.href = FONTS_URL
      document.head.appendChild(link)
    }
  }, [])

  // RSVP state
  const [rsvpDone, setRsvpDone] = useState<{ answer: string; name: string; guests: string } | null>(null)
  const rsvpNameRef = useRef<HTMLInputElement>(null)
  const rsvpGuestsRef = useRef<HTMLInputElement>(null)
  const submitRsvp = useCallback((answer: string) => {
    const name = rsvpNameRef.current?.value.trim() || 'Guest'
    const guests = rsvpGuestsRef.current?.value || '1'
    setRsvpDone({ answer, name, guests })
  }, [])

  // Lightbox state
  const [lightbox, setLightbox] = useState<number | null>(null)
  useEffect(() => {
    function onKey(e: KeyboardEvent) { if (e.key === 'Escape') setLightbox(null) }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  return (
    <InvitationLayoutProvider layout={d.textOverrides}>
    <div className="emerald-native">
      <div ref={sparkleRef} style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 70, overflow: 'hidden' }} />

      {/* Loading */}
      {!state.heroGone && (
        <div className={`ep-loading${state.loaded ? ' hidden' : ''}`}>
          <div className="ep-loading-ring" />
          <div className="ep-loading-names f-script">{d.bride} &amp; {d.groom}</div>
        </div>
      )}

      {/* Music toggle */}
      {state.heroPhase >= 2 && (
        <button onClick={toggleMute} style={{ position: 'fixed', top: 16, right: 16, zIndex: 90, background: 'rgba(15,30,22,0.6)', border: '1px solid rgba(185,138,74,0.4)', borderRadius: '50%', width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#d4b374' }} aria-label={muted ? 'Unmute' : 'Mute'}>
          {muted ? (
            <svg viewBox="0 0 24 24" width={18} height={18} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg>
          ) : (
            <svg viewBox="0 0 24 24" width={18} height={18} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>
          )}
        </button>
      )}

      <audio ref={audioRef} src={d.music || '/audios/music.mp3'} preload="none" loop />

      <div className="ep-shell">
        <div className="ep-card">

          {/* Hero */}
          {!state.heroGone && (
            <Section name="hero">
            <section className="ep-hero" ref={heroRef as React.RefObject<HTMLElement>}>
              <img ref={posterRef as React.RefObject<HTMLImageElement>} className="ep-hero-poster" src={ASSETS + 'intro.webp'} alt="" fetchPriority="high" />
              <video ref={videoRef as React.RefObject<HTMLVideoElement>} className="ep-hero-video" src={ASSETS + 'intro.mp4'} playsInline preload="auto" poster={ASSETS + 'intro.webp'} muted />

              <div className="ep-love-seal-hero">
                <img className="ep-love-seal" src={ASSETS + 'love_icon.webp'} alt="" />
              </div>

              <div className="ep-hero-overlay">
                <div className={`ep-names-wrap${state.namesVisible ? ' show' : ''}`}>
                  <Copy as="p" field="hero.salam" className="ep-salam-text">السلام عليكم ورحمة الله وبركاته</Copy>
                  <Copy as="p" field="hero.invited" className="ep-invited-text f-heading">You are cordially invited to the Nikkah</Copy>
                  <div className="ep-hero-names">
                    <div>
                      <h1 className="ep-hero-name">{tw.first}{!tw.firstDone && state.namesVisible && <span className="tw-cursor" />}</h1>
                      <p className={`ep-hero-parents f-heading${tw.firstParents ? ' visible' : ''}`}>{firstParents}</p>
                    </div>
                    <span className={`ep-hero-ampersand${tw.amp ? ' visible' : ''}`}>&amp;</span>
                    <div>
                      <h2 className="ep-hero-name">{tw.second}{!tw.secondDone && tw.amp && <span className="tw-cursor" />}</h2>
                      <p className={`ep-hero-parents f-heading${tw.secondParents ? ' visible' : ''}`}>{secondParents}</p>
                    </div>
                  </div>
                </div>
              </div>

              {state.heroPhase === 0 && state.loaded && (
                <button className="ep-tap-btn" onClick={handleTap} aria-label="Tap to open invitation">
                  <span className="ep-tap-ring"><span className="ep-tap-dot" /></span>
                  <span className="ep-tap-label f-heading">Tap to Open</span>
                </button>
              )}

              {(state.heroPhase === 1 || state.heroPhase === 3) && (
                <div className="ep-scroll-hint">
                  <span className="ep-scroll-hint-label f-heading">Scroll</span>
                  <span className="ep-scroll-hint-chevron"><ChevronDown /></span>
                </div>
              )}
            </section>
            </Section>
          )}

          {/* Content pages */}
          {state.heroGone && (
            <div className="ep-pages" style={{ minHeight: '100svh' }}>

              {/* Page 0: Welcome / Bismillah / Date */}
              <Section name="blessing">
              <div className={`ep-page${currentPage === 0 ? ' active' : ''}`}>
                <div className="ep-page-inner">
                  <div className="ep-reveal-item"><ArchOrn /></div>
                  <Copy as="p" field="blessing.bismillah" className="ep-bismillah ep-reveal-item">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</Copy>
                  <Copy as="p" field="blessing.text" className="ep-text-body ep-reveal-item" style={{ marginTop: 10 }}>
                    With the blessings of God and our families, we invite you to celebrate our Nikkah. Your presence and prayers will make our day complete.
                  </Copy>
                  <div className="ep-reveal-item" style={{ marginTop: 16, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <LeafOrn />
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8 }}>
                      <Flourish />
                      <span className="ep-big-day f-heading">{bigDay}</span>
                      <Flourish flip />
                    </div>
                    <p className="ep-month-year f-heading">{monthYear}</p>
                    <div style={{ margin: '10px 0' }}><DiamondOrn /></div>
                    <p className="ep-when-line f-heading">{whenLine}</p>
                    <div style={{ marginTop: 20 }}><FanOrn full /></div>
                  </div>
                </div>
                <ScrollBtn onClick={nextPage} />
              </div>
              </Section>

              {/* Page 1: Countdown */}
              <Section name="countdown">
              <div className={`ep-page${currentPage === 1 ? ' active' : ''}`}>
                <div className="ep-page-inner">
                  <div className="ep-reveal-item" style={{ marginBottom: 16 }}><ArchOrn /></div>
                  <Copy as="h2" field="countdown.heading" className="ep-page-heading ep-reveal-item" style={{ fontSize: 'clamp(1.1rem,5.5vw,1.4rem)', maxWidth: '14rem' }}>Until Our Special Day</Copy>
                  <div className="ep-reveal-item" style={{ marginTop: 14 }}><LeafOrn /></div>
                  <div className="ep-countdown-grid ep-reveal-item">
                    <div className="ep-cd-unit"><span className="ep-cd-num f-heading">{cd.days}</span><span className="ep-cd-label f-heading">Days</span></div>
                    <div className="ep-cd-unit"><span className="ep-cd-num f-heading">{cd.hours}</span><span className="ep-cd-label f-heading">Hours</span></div>
                    <div className="ep-cd-unit"><span className="ep-cd-num f-heading">{cd.mins}</span><span className="ep-cd-label f-heading">Mins</span></div>
                    <div className="ep-cd-unit"><span className="ep-cd-num f-heading">{cd.secs}</span><span className="ep-cd-label f-heading">Secs</span></div>
                  </div>
                  <div className="ep-reveal-item" style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, margin: '4px 0' }}>
                    <span style={{ flex: 1, height: 1, background: 'rgba(185,138,74,0.35)' }} />
                    <DiamondOrn />
                    <span style={{ flex: 1, height: 1, background: 'rgba(185,138,74,0.35)' }} />
                  </div>
                  <div className="ep-reveal-item" style={{ marginTop: 16 }}><FanOrn /></div>
                </div>
                <ScrollBtn onClick={nextPage} />
              </div>
              </Section>

              {/* Page 2: Venue */}
              <Section name="venue">
              <div className={`ep-page${currentPage === 2 ? ' active' : ''}`}>
                <div className="ep-page-inner">
                  <div className="ep-reveal-item" style={{ marginBottom: 16 }}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="#b98a4a" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" width={24} height={24} aria-hidden="true">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
                    </svg>
                  </div>
                  <Copy as="h2" field="venue.heading" className="ep-page-heading ep-reveal-item" style={{ fontSize: 'clamp(1.3rem,6vw,1.8rem)' }}>Venue</Copy>
                  <p className="ep-page-heading ep-venue-name ep-reveal-item">{d.venue}</p>
                  <p className="ep-text-body ep-venue-addr ep-reveal-item">{d.address}</p>
                  {d.map && (
                    <div className="ep-reveal-item">
                      <a className="ep-map-link f-heading" href={d.map} target="_blank" rel="noopener noreferrer">
                        <MapPinIcon /> View on Maps
                      </a>
                    </div>
                  )}
                  <div className="ep-reveal-item" style={{ marginTop: 28 }}><FanOrn /></div>
                </div>
                <ScrollBtn onClick={nextPage} />
              </div>
              </Section>

              {/* Page 3: Timeline (Program) */}
              <Section name="program">
              <div className={`ep-page${currentPage === 3 ? ' active' : ''}`}>
                <div className="ep-page-inner">
                  <Copy as="h2" field="program.heading" className="ep-page-heading ep-reveal-item" style={{ fontSize: 'clamp(1.3rem,6vw,1.8rem)', marginBottom: 24 }}>Program</Copy>
                  <ol className="ep-timeline ep-reveal-item">
                    <li className="ep-tl-line" aria-hidden="true" />
                    {(d.events || []).map((ev, i) => (
                      <li key={ev.id || i} className="ep-tl-item">
                        <span className="ep-tl-dot" />
                        <div className="ep-tl-content">
                          <p className="ep-tl-name f-heading">{ev.title}</p>
                          <p className="ep-tl-when">{formatDate(ev.date)} · {formatTime(ev.time)}</p>
                          <p className="ep-tl-venue">{ev.venue}{ev.address ? `, ${ev.address}` : ''}</p>
                          {ev.map && (
                            <div style={{ marginTop: 6 }}>
                              <a className="ep-tl-map f-heading" href={ev.map} target="_blank" rel="noopener noreferrer">
                                <MapPinIcon size={10} /> Directions
                              </a>
                            </div>
                          )}
                        </div>
                      </li>
                    ))}
                  </ol>
                </div>
                <ScrollBtn onClick={nextPage} />
              </div>
              </Section>

              {/* Page 4: Verse */}
              <Section name="verse">
              <div className={`ep-page${currentPage === 4 ? ' active' : ''}`}>
                <div className="ep-page-inner">
                  <figure style={{ width: '100%' }}>
                    <Copy as="p" field="verse.arabic" className="ep-verse-arabic ep-reveal-item">وَخَلَقْنَاكُمْ أَزْوَاجًا</Copy>
                    <Copy as="p" field="verse.translation" className="ep-verse-translation f-heading ep-reveal-item">"And We created you in pairs"</Copy>
                    <Copy as="p" field="verse.ref" className="ep-verse-ref f-heading ep-reveal-item">— Surah An-Naba, 78:8</Copy>
                  </figure>
                  <div className="ep-reveal-item" style={{ marginTop: 24 }}><FanOrn /></div>
                </div>
                <ScrollBtn onClick={nextPage} />
              </div>
              </Section>

              {/* Page 5: Gallery */}
              <Section name="gallery">
              <div className={`ep-page${currentPage === 5 ? ' active' : ''}`}>
                <div className="ep-page-inner">
                  <Copy as="h2" field="gallery.heading" className="ep-page-heading ep-reveal-item" style={{ fontSize: 'clamp(1.3rem,6vw,1.8rem)', marginBottom: 20 }}>Our Moments</Copy>
                  <div className="ep-gallery-grid ep-reveal-item">
                    {galleryImages.slice(0, 4).map((src, i) => (
                      <div key={i} className="ep-gallery-img-wrap" onClick={() => setLightbox(i)}>
                        <img src={src} alt={`Gallery ${i + 1}`} loading="lazy" />
                      </div>
                    ))}
                  </div>
                </div>
                <ScrollBtn onClick={nextPage} />
              </div>
              </Section>

              {/* Page 6: RSVP */}
              <Section name="rsvp">
              <div className={`ep-page${currentPage === 6 ? ' active' : ''}`}>
                <div className="ep-page-inner">
                  <Copy as="h2" field="rsvp.heading" className="ep-page-heading ep-reveal-item" style={{ fontSize: 'clamp(1.3rem,6vw,1.8rem)', marginBottom: 24 }}>Will You Join Us?</Copy>
                  <div className="ep-reveal-item">
                    {!rsvpDone ? (
                      <div className="ep-rsvp-form" data-no-nav="">
                        <input ref={rsvpNameRef} className="ep-rsvp-input f-heading" type="text" placeholder="Your name" autoComplete="name" />
                        <input ref={rsvpGuestsRef} className="ep-rsvp-input f-heading" type="number" placeholder="Number of guests" min={1} max={10} />
                        <div className="ep-rsvp-btns">
                          <button className="ep-rsvp-btn ep-rsvp-btn-yes f-heading" onClick={() => submitRsvp('yes')}>Attending</button>
                          <button className="ep-rsvp-btn ep-rsvp-btn-no f-heading" onClick={() => submitRsvp('no')}>Unable to attend</button>
                        </div>
                      </div>
                    ) : (
                      <div className="ep-rsvp-success f-heading">
                        {rsvpDone.answer === 'yes'
                          ? <>Thank you, {rsvpDone.name}!<br />We look forward to celebrating with you{Number(rsvpDone.guests) > 1 ? ` and ${rsvpDone.guests} guests` : ' and your guests'}.</>
                          : <>Thank you for letting us know, {rsvpDone.name}.<br />We will miss you and keep you in our prayers.</>
                        }
                      </div>
                    )}
                  </div>
                </div>
                <ScrollBtn onClick={nextPage} />
              </div>
              </Section>

              {/* Page 7: Ending note */}
              <Section name="ending">
              <div className={`ep-page${currentPage === 7 ? ' active' : ''}`}>
                <div className="ep-page-inner">
                  <Copy as="p" field="ending.note" className="ep-ending-note ep-reveal-item">
                    With the blessings of our beloved family, we cordially invite you to grace the auspicious occasion with your presence and prayers.
                  </Copy>
                  <div className="ep-reveal-item" style={{ marginTop: 28 }}><FanOrn /></div>
                </div>
                <ScrollBtn onClick={nextPage} />
              </div>
              </Section>

              {/* Page 8: Close */}
              <Section name="close">
              <div className={`ep-page${currentPage === 8 ? ' active' : ''}`}>
                <div className="ep-page-inner">
                  <p className="ep-close-name ep-reveal-item">{firstName}</p>
                  <div className="ep-reveal-item" style={{ margin: '20px 0' }}>
                    <img className="ep-love-seal" src={ASSETS + 'love_icon.webp'} alt="" style={{ mixBlendMode: 'multiply' }} />
                  </div>
                  <p className="ep-close-name ep-reveal-item">{secondName}</p>
                  <Copy as="footer" field="footer.text" className="ep-close-footer ep-reveal-item">Digital Wedding Invitation</Copy>
                </div>
              </div>
              </Section>

            </div>
          )}

        </div>
      </div>

      {/* Lightbox */}
      <div className={`ep-lightbox${lightbox !== null ? ' open' : ''}`} onClick={() => setLightbox(null)}>
        {lightbox !== null && <img src={galleryImages[lightbox]} alt="Gallery" />}
        <button className="ep-lightbox-close" onClick={() => setLightbox(null)} aria-label="Close">✕</button>
      </div>

    </div>
    </InvitationLayoutProvider>
  )
}
