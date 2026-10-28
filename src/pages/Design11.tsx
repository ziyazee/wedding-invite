import { useEffect, useRef, useState, useCallback } from 'react'
import { useInvitationDetails } from '../invitations/context'
import { formatDate, formatTime, mapURL, weddingISO, type InvitationData } from '../invitations/model'
import { downloadCalendar } from '../invitations/calendar'
import useGoogleFonts from '../hooks/useGoogleFonts'
import './Design11.css'

const demo: InvitationData = {
  template: 11, groom: 'Kiran', bride: 'Rahul', date: '2026-12-15', time: '19:00', offset: '+05:30',
  venue: 'Taj Hotel', address: 'Mumbai, India', map: '',
  message: "Some souls are destined to find each other, no matter how long the journey. Krishna and Radha’s story wasn’t just about falling in love—it was about finding peace in each other’s presence, strength in every challenge, and a home in each other’s hearts. Through every smile, every tear, and every moment in between, their love only grew deeper. Today, as they take the sacred vows of forever, they carry with them not only dreams of a beautiful future but also the blessings of everyone who has been part of their journey. With hearts full of love and gratitude, they invite you to celebrate the beginning of their forever.",
  groomFamily: '', brideFamily: '', dressCode: '', giftNote: '', music: '/bisara.mp3', gallery: '',
  events: [
    { title: 'Mehendi Night', date: '2026-12-15', time: '19:00', venue: 'Taj Hotel', address: 'Mumbai, India', map: '' },
  ],
}

function CalIcon() { return <svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></svg> }
function ClockIcon() { return <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg> }
function MapPin() { return <svg viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 1 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg> }

export default function Design11() {
  useGoogleFonts('https://fonts.googleapis.com/css2?family=Asul&family=Elsie+Swash+Caps&family=Instrument+Serif&family=Jost:wght@300;400;500&family=Lusitana&family=Luxurious+Script&family=Philosopher&family=Open+Sans:wght@400;600&display=swap')
  const personal = useInvitationDetails()
  const d = personal || demo
  const audio = useRef<HTMLAudioElement>(null)
  const root = useRef<HTMLElement>(null)
  const [phase, setPhase] = useState<'closed' | 'open'>('closed')
  const [playing, setPlaying] = useState(false)
  const [now, setNow] = useState(Date.now())
  const [slide, setSlide] = useState(0)

  const slideImages = ['/design11/couple1.jpg', '/design11/couple2.jpg', '/design11/couple3.jpg', '/design11/slide1.webp', '/design11/slide2.webp']

  useEffect(() => { const id = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(id) }, [])

  // Auto-advance slideshow
  useEffect(() => {
    if (phase !== 'open') return
    const id = setInterval(() => setSlide(s => (s + 1) % slideImages.length), 4000)
    return () => clearInterval(id)
  }, [phase, slideImages.length])

  const prevSlide = useCallback(() => setSlide(s => (s - 1 + slideImages.length) % slideImages.length), [slideImages.length])
  const nextSlide = useCallback(() => setSlide(s => (s + 1) % slideImages.length), [slideImages.length])

  // Open invitation
  function enter() {
    setPhase('open')
    if (audio.current) { audio.current.volume = 0.3; void audio.current.play().catch(() => {}) }
  }

  // Scroll-reveal observer (matching Framer's translateY(40px) → visible)
  useEffect(() => {
    if (phase !== 'open' || matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) return
    const observer = new IntersectionObserver(entries => entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('d11-visible'); observer.unobserve(e.target) }
    }), { threshold: 0.08 })
    root.current?.querySelectorAll('.d11-anim').forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [phase])

  const remaining = Math.max(0, new Date(weddingISO(d)).getTime() - now)
  const counts = [Math.floor(remaining / 86400000), Math.floor(remaining / 3600000) % 24, Math.floor(remaining / 60000) % 60, Math.floor(remaining / 1000) % 60]
  const countLabels = ['Days', 'Hours', 'Minutes', 'Seconds']
  const mainEvent = d.events[0]

  return (
    <main ref={root} className={`d11 d11-${phase}`}>
      {d.music && <audio ref={audio} src={d.music} preload="none" loop onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} />}
      {phase === 'open' && d.music && (
        <button className="d11-music" aria-label={playing ? 'Pause music' : 'Play music'} onClick={() => playing ? audio.current?.pause() : void audio.current?.play().catch(() => {})}>{playing ? 'Ⅱ' : '♫'}</button>
      )}

      {/* ═══════════════ PAGE 1 — Hero ═══════════════ */}
      <section className="d11-p1">
        <img className="d11-p1-sky" src="/design11/sky-bg.webp" alt="" />
        <img className="d11-p1-temple" src="/design11/temple.webp" alt="" />
        <img className="d11-p1-tree-l" src="/design11/tree.webp" alt="" />
        <img className="d11-p1-tree-r" src="/design11/tree.webp" alt="" />
        <div className="d11-p1-content">
          <p className="d11-p1-tagline">are getting married</p>
          <div className="d11-p1-name">{d.groom.split(' ')[0]}</div>
          <div className="d11-p1-weds">WEDS</div>
          <div className="d11-p1-name">{d.bride.split(' ')[0]}</div>
        </div>
        {phase === 'closed' && (
          <button className="d11-open-btn" onClick={enter}>
            Touch Here For Magic <span>↓</span>
          </button>
        )}
        {phase === 'open' && (
          <button className="d11-scroll-prompt" onClick={() => document.getElementById('d11-invite')?.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' })}>
            Scroll Down <span>↓</span>
          </button>
        )}
      </section>

      {phase === 'open' && <>

        {/* ═══════════════ PAGE 2 — Invite / Event ═══════════════ */}
        <section className="d11-p2" id="d11-invite">
          <img className="d11-p2-bg" src="/design11/page2-bg.webp" alt="" />
          <div className="d11-p2-overlay" />
          <div className="d11-p2-content">
            <img className="d11-p2-ganesh d11-anim" src="/design11/ganesh.webp" alt="Ganesh ji" />

            {(d.groomFamily || d.brideFamily) ? (
              <div className="d11-p2-family d11-anim d11-anim-d1">
                {d.groomFamily && <p>{d.groomFamily}</p>}
                {d.brideFamily && <p>{d.brideFamily}</p>}
                <p style={{ marginTop: 8, fontStyle: 'italic', opacity: 0.7 }}>On the following events</p>
              </div>
            ) : (
              <div className="d11-p2-family d11-anim d11-anim-d1">
                <p style={{ fontStyle: 'italic', opacity: 0.7 }}>On the following events</p>
              </div>
            )}

            <div className="d11-p2-names d11-anim d11-anim-d2">
              <div className="d11-p2-name">{d.groom.split(' ')[0]}</div>
              <span className="d11-p2-amp">&amp;</span>
              <div className="d11-p2-name">{d.bride.split(' ')[0]}</div>
            </div>

            <p className="d11-p2-invite-label d11-anim d11-anim-d3">Invite you to celebrate</p>

            {d.events.length === 1 && (
              <div className="d11-event-card d11-anim d11-anim-d4">
                <div className="d11-event-title">{mainEvent.title}</div>
                <div className="d11-event-meta">
                  <span className="d11-event-chip"><CalIcon />{formatDate(mainEvent.date)}</span>
                  <span className="d11-event-chip"><ClockIcon />{formatTime(mainEvent.time)}</span>
                </div>
                <div className="d11-event-venue">{mainEvent.venue}</div>
                <p className="d11-event-desc">An evening of mehendi artistry, music, and family celebration.</p>
                <a className="d11-view-loc" href={mapURL(mainEvent.venue, mainEvent.address, mainEvent.map)} target="_blank" rel="noreferrer">
                  <MapPin /> View Location
                </a>
              </div>
            )}
          </div>
        </section>

        {/* Multiple celebrations */}
        {d.events.length > 1 && (
          <section className="d11-celebrations">
            <header className="d11-celebrations-header d11-anim">
              <h2>The Celebrations</h2>
            </header>
            {[...d.events].sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time)).map((event, i) => (
              <article className="d11-celeb d11-anim" style={{ transitionDelay: `${(i + 1) * 120}ms` }} key={i}>
                <h3>{event.title}</h3>
                <div className="d11-celeb-meta">
                  <span className="d11-celeb-chip"><CalIcon />{formatDate(event.date)}</span>
                  <span className="d11-celeb-chip"><ClockIcon />{formatTime(event.time)}</span>
                </div>
                <div className="d11-celeb-venue">{event.venue}</div>
                {event.address !== event.venue && <p className="d11-celeb-addr">{event.address}</p>}
                <div className="d11-celeb-actions">
                  <a href={mapURL(event.venue, event.address, event.map)} target="_blank" rel="noreferrer">Directions ↗</a>
                  <button onClick={() => downloadCalendar(event, d.offset, `${d.groom} & ${d.bride}`)}>Save date +</button>
                </div>
              </article>
            ))}
          </section>
        )}

        {/* ═══════════════ PAGE 3 — Photo Slideshow ═══════════════ */}
        <section className="d11-p3 d11-anim">
          <div className="d11-p3-track" style={{ transform: `translateX(-${slide * 100}%)` }}>
            {slideImages.map((src, i) => (
              <div className="d11-p3-slide" key={i}>
                <img src={src} alt={`Wedding photo ${i + 1}`} loading="lazy" />
              </div>
            ))}
          </div>
          <div className="d11-p3-controls">
            <button className="d11-p3-arrow" onClick={prevSlide} aria-label="Previous">‹</button>
            <div className="d11-p3-dots">
              {slideImages.map((_, i) => (
                <button key={i} className={`d11-p3-dot ${i === slide ? 'active' : ''}`} onClick={() => setSlide(i)} aria-label={`Photo ${i + 1}`} />
              ))}
            </div>
            <button className="d11-p3-arrow" onClick={nextSlide} aria-label="Next">›</button>
          </div>
        </section>

        {/* ═══════════════ PAGE 4 — Couple + Countdown ═══════════════ */}
        <section className="d11-p4">
          <img className="d11-p4-sky" src="/design11/page4-bg.webp" alt="" />
          <img className="d11-p4-clouds" src="/design11/clouds.webp" alt="" />
          <img className="d11-p4-couple" src="/design11/phone-mockup.jpg" alt={`${d.groom} & ${d.bride}`} />
          <div className="d11-p4-countdown d11-anim">
            <div className="d11-p4-count-label">{remaining > 0 ? 'Counting the Days' : 'Our Beautiful Beginning'}</div>
            <div className="d11-p4-grid">
              {counts.map((n, i) => (
                <div className="d11-p4-unit" key={i}>
                  <strong>{String(n).padStart(2, '0')}</strong>
                  <span>{countLabels[i]}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════ PAGE 5 — Our Story ═══════════════ */}
        <section className="d11-p5">
          <img className="d11-p5-bg" src="/design11/page5-bg.webp" alt="" />
          <div className="d11-p5-content">
            <span className="d11-p5-meet d11-anim">Meet the</span>
            <h2 className="d11-p5-bride-groom d11-anim d11-anim-d1">Bride &amp; Groom</h2>
            <div className="d11-p5-frame d11-anim d11-anim-d2">
              <img className="d11-p5-couple-photo" src="/design11/couple1.jpg" alt={`${d.groom} & ${d.bride}`} />
              <img className="d11-p5-frame-border" src="/design11/golden-frame.png" alt="" />
            </div>
            <span className="d11-p5-our-story d11-anim d11-anim-d3">Our Story</span>
            <p className="d11-p5-story d11-anim d11-anim-d4">{d.message || demo.message}</p>
          </div>
        </section>

        {/* ── Notes ── */}
        {(d.dressCode || d.giftNote || d.gallery) && (
          <section className="d11-notes d11-anim" style={{ background: 'var(--maroon-deep)' }}>
            {d.dressCode && <><span className="d11-notes-label">Dress Code</span><p>{d.dressCode}</p></>}
            {d.giftNote && <><span className="d11-notes-label">A Little Note</span><p>{d.giftNote}</p></>}
            {d.gallery && <a href={d.gallery} target="_blank" rel="noreferrer" style={{ color: 'var(--gold)', fontSize: 13, fontFamily: "'Jost', sans-serif" }}>View our gallery ↗</a>}
          </section>
        )}

        {/* ═══════════════ PAGE 6 — RSVP ═══════════════ */}
        <section className="d11-p6">
          <img className="d11-p6-bg" src="/design11/rsvp-bg.webp" alt="" />
          <div className="d11-p6-overlay" />
          <div className="d11-p6-content">
            <h2 className="d11-p6-will d11-anim">Will You</h2>
            <h2 className="d11-p6-join d11-anim d11-anim-d1">Join Us?</h2>
            <p className="d11-p6-note d11-anim d11-anim-d2">We would be truly honoured to celebrate this day with you. Please let us know if you'll be joining the festivities — your presence is the only gift we need.</p>
            <a className="d11-p6-btn d11-anim d11-anim-d3" href={`https://wa.me/?text=${encodeURIComponent(`RSVP for ${d.groom} & ${d.bride}'s wedding`)}`} target="_blank" rel="noreferrer">
              <svg viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" /></svg>
              RSVP on WhatsApp
            </a>
            <span className="d11-p6-tap d11-anim d11-anim-d4">TAP HERE</span>
          </div>
        </section>

        {/* ═══════════════ PAGE 7 — Instagram / Footer ═══════════════ */}
        <section className="d11-p7">
          <img className="d11-p7-bg" src="/design11/page7-bg.webp" alt="" />
          <div className="d11-p7-content">
            <span className="d11-p7-insta-label d11-anim">Instagram</span>
            <div className="d11-p7-hashtag d11-anim d11-anim-d1">#{d.bride.split(' ')[0].toLowerCase()}ki{d.groom.split(' ')[0].toLowerCase()}</div>
            <div className="d11-p7-cards d11-anim d11-anim-d2">
              <div className="d11-p7-card"><img src="/design11/insta1.jpg" alt="" loading="lazy" /></div>
              <div className="d11-p7-card"><img src="/design11/insta2.jpg" alt="" loading="lazy" /></div>
              <div className="d11-p7-card"><img src="/design11/insta3.jpg" alt="" loading="lazy" /></div>
            </div>
            <a className="d11-p7-insta-btn d11-anim d11-anim-d3" href="#" target="_blank" rel="noreferrer">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" /></svg>
              TAP HERE
            </a>
            <div className="d11-p7-footer d11-anim d11-anim-d4">
              {d.groom} &amp; {d.bride} · {formatDate(d.date)}
            </div>
          </div>
        </section>

      </>}
    </main>
  )
}
