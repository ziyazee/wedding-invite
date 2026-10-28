import { useEffect, useRef, useState, useCallback } from 'react'
import { useInvitationDetails } from '../invitations/context'
import { formatDate, formatTime, mapURL, weddingISO, type InvitationData } from '../invitations/model'
import { downloadCalendar } from '../invitations/calendar'
import useGoogleFonts from '../hooks/useGoogleFonts'
import './Design12.css'

const demo: InvitationData = {
  template: 12, groom: 'Kiran', bride: 'Rahul', date: '2026-12-15', time: '19:00', offset: '+05:30',
  venue: 'Taj Hotel', address: 'Mumbai, India', map: '',
  message: "Some souls are destined to find each other, no matter how long the journey. Krishna and Radha's story wasn't just about falling in love—it was about finding peace in each other's presence, strength in every challenge, and a home in each other's hearts. Through every smile, every tear, and every moment in between, their love only grew deeper. Today, as they take the sacred vows of forever, they carry with them not only dreams of a beautiful future but also the blessings of everyone who has been part of their journey. With hearts full of love and gratitude, they invite you to celebrate the beginning of their forever.",
  groomFamily: "Mr. [Grandfather's Name] & Mrs. [Grandmother's Name]",
  brideFamily: "Mr. [Bride's Father Name] & Mrs. [Bride's Mother Name]",
  dressCode: '', giftNote: '', music: '/bisara.mp3', gallery: '',
  events: [
    { title: 'Mehendi Night', date: '2026-12-15', time: '19:00', venue: 'Taj Hotel', address: 'Mumbai, India', map: '' },
  ],
}

function StarSvg({ fill1, fill2 }: { fill1: string; fill2: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M3 12C8 12 12 8 12 3C12 8 16 12 21 12C16 12 12 16 12 21C12 16 8 12 3 12Z" fill={fill1} />
      <circle cx="12" cy="12" r="2" fill={fill2} />
    </svg>
  )
}

function CalIcon() {
  return (
    <span className="d12-icon" aria-hidden="true">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="5" width="18" height="16" rx="3" stroke="currentColor" strokeWidth="1.8" />
        <path d="M8 3V7M16 3V7M3 10H21" stroke="currentColor" strokeWidth="1.8" />
      </svg>
    </span>
  )
}
function ClockIcon() {
  return (
    <span className="d12-icon" aria-hidden="true">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
        <path d="M12 7V12L15.5 14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    </span>
  )
}
function MapPin() {
  return (
    <span className="d12-icon" aria-hidden="true">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        <path d="M12 21C12 21 19 14.5 19 9.8C19 6.1 15.9 3 12 3C8.1 3 5 6.1 5 9.8C5 14.5 12 21 12 21Z" stroke="currentColor" strokeWidth="1.8" />
        <circle cx="12" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.8" />
      </svg>
    </span>
  )
}

export default function Design12() {
  useGoogleFonts('https://fonts.googleapis.com/css2?family=Abhaya+Libre:wght@400;700;800&family=Amethysta&family=Asul&family=EB+Garamond:wght@700&family=Elsie+Swash+Caps&family=Instrument+Serif&family=Jost:wght@300;400;500;600&family=Junge&family=Lunasima&family=Lusitana&family=Luxurious+Script&family=Philosopher:wght@400;700&family=Open+Sans:wght@400;600&display=swap')
  const personal = useInvitationDetails()
  const d = personal || demo
  const audio = useRef<HTMLAudioElement>(null)
  const root = useRef<HTMLElement>(null)
  const [phase, setPhase] = useState<'closed' | 'open'>('closed')
  const [playing, setPlaying] = useState(false)
  const [now, setNow] = useState(Date.now())
  const [slide, setSlide] = useState(0)
  const [framePhoto, setFramePhoto] = useState(0)

  const slideImages = [
    '/design12/couple1.jpg', '/design12/couple2.jpg', '/design12/couple3.jpg',
    '/design12/slide1.webp', '/design12/slide2.webp',
  ]
  const framePhotos = [
    '/design12/couple1.jpg', '/design12/couple2.jpg', '/design12/couple3.jpg',
  ]

  useEffect(() => { const id = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(id) }, [])

  useEffect(() => {
    if (phase !== 'open') return
    const id = setInterval(() => setSlide(s => (s + 1) % slideImages.length), 4000)
    return () => clearInterval(id)
  }, [phase, slideImages.length])

  useEffect(() => {
    if (phase !== 'open') return
    const id = setInterval(() => setFramePhoto(s => (s + 1) % framePhotos.length), 3500)
    return () => clearInterval(id)
  }, [phase, framePhotos.length])

  const prevSlide = useCallback(() => setSlide(s => (s - 1 + slideImages.length) % slideImages.length), [slideImages.length])
  const nextSlide = useCallback(() => setSlide(s => (s + 1) % slideImages.length), [slideImages.length])

  function enter() {
    setPhase('open')
    if (audio.current) { audio.current.volume = 0.3; void audio.current.play().catch(() => {}) }
  }

  useEffect(() => {
    if (phase !== 'open' || matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) return
    const observer = new IntersectionObserver(entries => entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('d12-visible'); observer.unobserve(e.target) }
    }), { threshold: 0.08 })
    root.current?.querySelectorAll('.d12-anim').forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [phase])

  const remaining = Math.max(0, new Date(weddingISO(d)).getTime() - now)
  const counts = [Math.floor(remaining / 86400000), Math.floor(remaining / 3600000) % 24, Math.floor(remaining / 60000) % 60, Math.floor(remaining / 1000) % 60]
  const countLabels = ['Days', 'Hours', 'Minutes', 'Seconds']
  const mainEvent = d.events[0]

  return (
    <main ref={root} className={`d12 d12-${phase}`}>
      {d.music && <audio ref={audio} src={d.music} preload="none" loop onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} />}
      {phase === 'open' && d.music && (
        <button className="d12-music" aria-label={playing ? 'Pause music' : 'Play music'} onClick={() => playing ? audio.current?.pause() : void audio.current?.play().catch(() => {})}>{playing ? 'Ⅱ' : '♫'}</button>
      )}

      {/* ═══════════════ PAGE 1 — Hero Temple ═══════════════ */}
      <section className="d12-p1">
        <img className="d12-p1-sky" src="/design12/sky-bg.webp" alt="" />
        <img className="d12-p1-temple" src="/design12/temple.webp" alt="" />
        <img className="d12-p1-tree" src="/design12/tree.webp" alt="" />
        <div className="d12-p1-groom-name">{d.groom.split(' ')[0]}</div>
        <div className="d12-p1-weds">WEDS</div>
        <div className="d12-p1-bride-name">{d.bride.split(' ')[0]}</div>
        <div className="d12-p1-tagline">are getting married</div>
        {phase === 'closed' && (
          <button className="d12-open-btn" onClick={enter}>
            Touch Here For Magic <span>↓</span>
          </button>
        )}
        {phase === 'open' && (
          <button className="d12-scroll-prompt" onClick={() => document.getElementById('d12-invite')?.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' })}>
            Scroll Down ↓
          </button>
        )}
      </section>

      {phase === 'open' && <>

        {/* ═══════════════ PAGE 2 — Invite / Ganesh / Family / Names ═══════════════ */}
        <section className="d12-p2" id="d12-invite">
          <img className="d12-p2-bg" src="/design12/page2-bg.webp" alt="" />
          <div className="d12-p2-content">
            <img className="d12-p2-ganesh d12-anim" src="/design12/ganesh.webp" alt="Ganesh ji" />
            <p className="d12-p2-sanskrit d12-anim d12-anim-d1">||ॐ श्री गणेशाय नमः||</p>

            <div className="d12-p2-eb-garamond d12-anim d12-anim-d1">शुभ विवाह</div>

            {(d.groomFamily || d.brideFamily) && (
              <div className="d12-p2-family d12-anim d12-anim-d2">
                <p>With the blessings of the Almighty and our beloved elders,</p>
                {d.groomFamily && <p>{d.groomFamily}</p>}
                {d.brideFamily && <><p style={{ opacity: 0.6, fontSize: '0.85em' }}>together with</p><p>{d.brideFamily}</p></>}
                <p style={{ marginTop: 8, fontStyle: 'italic', opacity: 0.7 }}>
                  cordially invite you to grace the auspicious wedding ceremony of their beloved
                </p>
              </div>
            )}

            <div className="d12-p2-names d12-anim d12-anim-d3">
              <div className="d12-p2-name">{d.groom.split(' ')[0]}</div>
              <span className="d12-p2-amp">&amp;</span>
              <div className="d12-p2-name">{d.bride.split(' ')[0]}</div>
            </div>

            <div className="d12-p2-invite d12-anim d12-anim-d4">Invite</div>

            <p className="d12-p2-invite-tagline d12-anim d12-anim-d5">
              you to celebrate their union of love with your gracious presence on the following auspicious occasion
            </p>
          </div>
        </section>

        {/* ═══════════════ PAGE 3 — Event Slideshow (exact Framer component) ═══════════════ */}
        <section className="d12-p3 d12-anim">
          <div className="d12-p3-bg-img" style={{ backgroundImage: `url(/design12/page2-bg.webp)` }} />
          <div className="d12-p3-bg-overlay" />
          <div className="d12-p3-inner">
            {/* Corner star decorations */}
            <StarSvg fill1="rgb(215, 162, 42)" fill2="rgb(10, 48, 127)" />
            <svg viewBox="0 0 24 24" className="d12-p3-star d12-p3-star--tl"><path d="M3 12C8 12 12 8 12 3C12 8 16 12 21 12C16 12 12 16 12 21C12 16 8 12 3 12Z" fill="rgb(215, 162, 42)" /><circle cx="12" cy="12" r="2" fill="rgb(10, 48, 127)" /></svg>
            <svg viewBox="0 0 24 24" className="d12-p3-star d12-p3-star--tr"><path d="M3 12C8 12 12 8 12 3C12 8 16 12 21 12C16 12 12 16 12 21C12 16 8 12 3 12Z" fill="rgb(7, 95, 203)" /><circle cx="12" cy="12" r="2" fill="rgb(10, 48, 127)" /></svg>
            <svg viewBox="0 0 24 24" className="d12-p3-star d12-p3-star--bl"><path d="M3 12C8 12 12 8 12 3C12 8 16 12 21 12C16 12 12 16 12 21C12 16 8 12 3 12Z" fill="rgb(7, 95, 203)" /><circle cx="12" cy="12" r="2" fill="rgb(10, 48, 127)" /></svg>
            <svg viewBox="0 0 24 24" className="d12-p3-star d12-p3-star--br"><path d="M3 12C8 12 12 8 12 3C12 8 16 12 21 12C16 12 12 16 12 21C12 16 8 12 3 12Z" fill="rgb(215, 162, 42)" /><circle cx="12" cy="12" r="2" fill="rgb(10, 48, 127)" /></svg>

            <span className="d12-p3-couple-label">{d.groom} &amp; {d.bride}</span>

            <div className="d12-p3-grid">
              {/* Photo shell with blue border, gold inset, exact Framer styling */}
              <div className="d12-p3-photo-shell">
                <div className="d12-p3-photo-inner" key={slide}>
                  <img src={slideImages[slide]} alt={`Wedding photo ${slide + 1}`} loading="lazy" />
                </div>
                <div className="d12-p3-photo-controls">
                  <div className="d12-p3-arrows">
                    <button className="d12-p3-arrow" onClick={prevSlide} aria-label="Previous slide">‹</button>
                    <button className="d12-p3-arrow" onClick={nextSlide} aria-label="Next slide">›</button>
                  </div>
                  <div className="d12-p3-dots">
                    {slideImages.map((_, i) => (
                      <button key={i} className={`d12-p3-dot ${i === slide ? 'active' : ''}`} onClick={() => setSlide(i)} aria-label={`Go to slide ${i + 1}`} />
                    ))}
                  </div>
                </div>
              </div>

              {/* Event details */}
              <div className="d12-p3-event">
                <h2 className="d12-p3-event-title">{mainEvent.title}</h2>
                <div className="d12-p3-event-meta">
                  <div className="d12-p3-event-chip"><CalIcon /><span>{formatDate(mainEvent.date)}</span></div>
                  <div className="d12-p3-event-chip"><ClockIcon /><span>{formatTime(mainEvent.time)}</span></div>
                  <div className="d12-p3-event-chip"><MapPin /><span>{mainEvent.venue.toUpperCase()}</span></div>
                </div>
                <p className="d12-p3-event-desc">An evening of mehendi artistry, music, and family celebration.</p>
                <div style={{ display: 'flex', justifyContent: 'flex-start', marginTop: 6 }}>
                  <a className="d12-p3-view-loc" href={mapURL(mainEvent.venue, mainEvent.address, mainEvent.map)} target="_blank" rel="noreferrer">
                    View Location
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Multiple celebrations */}
        {d.events.length > 1 && (
          <section className="d12-celebrations">
            <header className="d12-celebrations-header d12-anim"><h2>The Celebrations</h2></header>
            {[...d.events].sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time)).map((event, i) => (
              <article className="d12-celeb d12-anim" style={{ transitionDelay: `${(i + 1) * 120}ms` }} key={i}>
                <h3>{event.title}</h3>
                <div className="d12-celeb-meta">
                  <span className="d12-celeb-chip"><CalIcon />{formatDate(event.date)}</span>
                  <span className="d12-celeb-chip"><ClockIcon />{formatTime(event.time)}</span>
                </div>
                <div className="d12-celeb-venue">{event.venue}</div>
                {event.address !== event.venue && <p className="d12-celeb-addr">{event.address}</p>}
                <div className="d12-celeb-actions">
                  <a href={mapURL(event.venue, event.address, event.map)} target="_blank" rel="noreferrer">Directions ↗</a>
                  <button onClick={() => downloadCalendar(event, d.offset, `${d.groom} & ${d.bride}`)}>Save date +</button>
                </div>
              </article>
            ))}
          </section>
        )}

        {/* ═══════════════ PAGE 4 — Sky / Clouds / Temple / Couple / Countdown ═══════════════ */}
        <section className="d12-p4">
          <img className="d12-p4-sky" src="/design12/sky-bg.webp" alt="" />
          <img className="d12-p4-cloud d12-p4-cloud1" src="/design12/clouds.webp" alt="" />
          <img className="d12-p4-cloud d12-p4-cloud2" src="/design12/clouds.webp" alt="" />
          <img className="d12-p4-cloud d12-p4-cloud3" src="/design12/clouds.webp" alt="" />
          <img className="d12-p4-temple" src="/design12/temple.webp" alt="" />
          <img className="d12-p4-couple" src="/design12/couple1.jpg" alt={`${d.groom} & ${d.bride}`} />
          <div className="d12-p4-countdown d12-anim">
            <div className="d12-p4-count-label">{remaining > 0 ? 'Counting the Days' : 'Our Beautiful Beginning'}</div>
            <div className="d12-p4-grid">
              {counts.map((n, i) => (
                <div className="d12-p4-unit" key={i}>
                  <strong>{String(n).padStart(2, '0')}</strong>
                  <span>{countLabels[i]}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════ PAGE 5 — Meet Bride & Groom / Our Story ═══════════════ */}
        <section className="d12-p5">
          <img className="d12-p5-bg" src="/design12/page5-bg.webp" alt="" />
          <span className="d12-p5-meet d12-anim">Meet The</span>
          <h2 className="d12-p5-bride-groom d12-anim d12-anim-d1">Bride &amp; Groom</h2>

          <div className="d12-p5-frame d12-anim d12-anim-d2">
            <div className="d12-p5-slideshow">
              <img src={framePhotos[framePhoto]} alt={`${d.groom} & ${d.bride}`} />
            </div>
            <img className="d12-p5-frame-border" src="/design12/golden-frame.png" alt="" />
          </div>

          <p className="d12-p5-story d12-anim d12-anim-d3">{d.message || demo.message}</p>
          <span className="d12-p5-our-story d12-anim d12-anim-d4">Our Story</span>
        </section>

        {/* ── Notes ── */}
        {(d.dressCode || d.giftNote || d.gallery) && (
          <section className="d12-notes d12-anim">
            {d.dressCode && <><span className="d12-notes-label">Dress Code</span><p>{d.dressCode}</p></>}
            {d.giftNote && <><span className="d12-notes-label">A Little Note</span><p>{d.giftNote}</p></>}
            {d.gallery && <a href={d.gallery} target="_blank" rel="noreferrer" style={{ color: 'var(--blue-accent)', fontSize: 13, fontFamily: "'Jost', sans-serif" }}>View our gallery ↗</a>}
          </section>
        )}

        {/* ═══════════════ PAGE 6 — RSVP (landscape 1.6:1) ═══════════════ */}
        <section className="d12-p6">
          <img className="d12-p6-bg" src="/design12/rsvp-bg.webp" alt="" />
          <div className="d12-p6-will-join d12-anim">
            <p className="d12-p6-will">Will You</p>
            <p className="d12-p6-join">Join Us?</p>
          </div>
          <p className="d12-p6-note d12-anim d12-anim-d1">
            We would be truly honoured to celebrate this day with you. Please let us know if you'll be joining the festivities — your presence is the only gift we need.
          </p>
          <div className="d12-p6-rsvp-wrap d12-anim d12-anim-d2">
            <a className="d12-p6-rsvp-btn" href={`https://wa.me/?text=${encodeURIComponent(`RSVP for ${d.groom} & ${d.bride}'s wedding`)}`} target="_blank" rel="noreferrer">
              <svg viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" fill="currentColor" /><path d="M12.05 2.05C6.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.465 3.488" fill="none" stroke="currentColor" strokeWidth="1.5" /></svg>
              <span>RSVP on WhatsApp</span>
            </a>
          </div>
          <div className="d12-p6-tap d12-anim d12-anim-d3">TAP HERE</div>
        </section>

        {/* ═══════════════ PAGE 7 — Instagram (landscape 1.6:1) ═══════════════ */}
        <section className="d12-p7">
          <img className="d12-p7-bg" src="/design12/page7-bg.webp" alt="" />
          <div className="d12-p7-insta-header d12-anim">
            <div className="d12-p7-insta-label">Tag us on Instagram</div>
            <div className="d12-p7-hashtag">#{d.groom.split(' ')[0].toLowerCase()}weds{d.bride.split(' ')[0].toLowerCase()}</div>
          </div>

          <div className="d12-p7-cards d12-anim d12-anim-d1">
            {['/design12/insta1.jpg', '/design12/insta2.jpg', '/design12/insta3.jpg'].map((src, i) => (
              <div className="d12-p7-card" key={i}>
                <img className="d12-p7-card-img" src={src} alt="" loading="lazy" />
                <div className="d12-p7-card-icons">
                  <div className="d12-p7-card-icon" />
                  <div className="d12-p7-card-icon" />
                  <div className="d12-p7-card-icon" />
                </div>
              </div>
            ))}
          </div>

          <div className="d12-p7-insta-pill d12-anim d12-anim-d2">
            <div className="d12-p7-insta-gradient">
              <div className="d12-p7-insta-bg">
                <a className="d12-p7-insta-inner" href="#" target="_blank" rel="noreferrer">
                  <svg viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" /></svg>
                  Follow on Instagram
                </a>
              </div>
            </div>
          </div>
        </section>

      </>}
    </main>
  )
}
