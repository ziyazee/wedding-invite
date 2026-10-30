import PersonalNotes from '../invitations/PersonalNotes'
import '../invitations/personalized.css'
import { useInvitationDetails } from '../invitations/context'
import { formatDate, formatTime, mapURL, weddingISO } from '../invitations/model'
import Celebrations from '../invitations/Celebrations'
import { useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import './Design4.css'

const A = '/templates/deprecated/design4/assets/'
const MAP = 'https://www.google.com/maps/search/?api=1&query=Beldi+Country+Club+Marrakech+Morocco'
const wedding = new Date('2027-05-20T16:00:00+01:00').getTime()

function Divider() { return <img className="bo-divider" src={`${A}divider.png`} alt="" /> }
function Heading({ children }: { children: ReactNode }) { return <><h2 className="bo-script">{children}</h2><Divider /></> }

function Countdown() {
  const details=useInvitationDetails()
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => { const id = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(id) }, [])
  const remaining = Math.max(0, (details ? new Date(weddingISO(details)).getTime() : wedding) - now)
  const values = [Math.floor(remaining / 86400000), Math.floor(remaining / 3600000) % 24, Math.floor(remaining / 60000) % 60, Math.floor(remaining / 1000) % 60]
  return <div className="bo-countdown" aria-label="Wedding countdown">{values.map((value, index) => <div key={index}><strong>{String(value).padStart(2, '0')}</strong><span>{['Days', 'Hours', 'Minutes', 'Seconds'][index]}</span></div>)}</div>
}

export default function Design4() {
  const details=useInvitationDetails()
  const map=details ? mapURL(details.venue,details.address,details.map) : MAP
  const [phase, setPhase] = useState<'closed' | 'opening' | 'open'>('closed')
  const [playing, setPlaying] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')
  const [attendance, setAttendance] = useState('yes')
  const audio = useRef<HTMLAudioElement>(null)
  const hero = useRef<HTMLVideoElement>(null)
  const sparkle = useRef<HTMLVideoElement>(null)
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const timeline = useRef<HTMLDivElement>(null)
  const marker = useRef<HTMLImageElement>(null)

  useEffect(() => {
    const title = document.title
    document.title = details ? `${details.groom} & ${details.bride} — Blossom & Oud` : 'Amira & Yusuf — Blossom & Oud'
    return () => { document.title = title; clearTimeout(timer.current) }
  }, [])
  useEffect(() => {
    if (phase === 'open') return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = previous }
  }, [phase])
  useEffect(() => {
    let frame = 0
    function update() {
      frame = 0
      const track = timeline.current
      if (!track || !marker.current) return
      const rect = track.getBoundingClientRect()
      const progress = Math.max(0, Math.min(1, (innerHeight * .65 - rect.top) / rect.height))
      marker.current.style.top = `${progress * 100}%`
    }
    function scroll() { if (!frame) frame = requestAnimationFrame(update) }
    window.addEventListener('scroll', scroll, { passive: true }); update()
    return () => { window.removeEventListener('scroll', scroll); cancelAnimationFrame(frame) }
  }, [])

  function open() {
    if (phase !== 'closed') return
    setPhase('opening')
    if (audio.current) { audio.current.volume = .4; void audio.current.play().catch(() => setPlaying(false)) }
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      void hero.current?.play().catch(() => {})
      void sparkle.current?.play().catch(() => {})
    }
    timer.current = setTimeout(() => setPhase('open'), window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 2300)
  }

  return <main className={`blossom-oud bo-${phase}`}>
    <audio ref={audio} src={details?.music || `${A}music.mp3`} loop preload="none" onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} onError={() => setPlaying(false)} />
    <video className="bo-sparkles" ref={sparkle} src={`${A}sparkles.mp4`} muted playsInline loop preload="metadata" aria-hidden="true" />
    {phase !== 'open' && <div className="bo-envelope" role="dialog" aria-label="Ouvrir l’invitation" aria-modal="true">
      <div className="bo-envelope-stage" aria-hidden="true">
        <img className="bo-flap bo-flap-right" src={`${A}envelope.png`} alt="" />
        <img className="bo-flap bo-flap-left" src={`${A}envelope.png`} alt="" />
        <img className="bo-flap bo-flap-bottom" src={`${A}envelope.png`} alt="" />
        <img className="bo-flap bo-flap-top" src={`${A}seal.png`} alt="" />
      </div>
      <button className="bo-enter" onClick={open} disabled={phase === 'opening'} aria-label="Appuyez pour ouvrir l’invitation">
        <img src={`${A}bismillah.png`} alt="Sceau doré" /><span>Appuyez pour ouvrir</span><img className="bo-cover-divider" src={`${A}cover-divider.png`} alt="" />
      </button>
    </div>}
    <div className="bo-content" inert={phase !== 'open'}>
      <section className="bo-hero">
        <video ref={hero} src={`${A}hero.mp4`} poster={`${A}hero-poster.jpg`} muted playsInline loop preload="metadata" aria-hidden="true" />
        <div className="bo-couple"><h1 className="bo-script"><span>{details?.groom || "Amira"}</span><i>&</i><span>{details?.bride || "Yusuf"}</span></h1><p>{details ? formatDate(details.date) : "20 Mai 2027"}<br />{details ? formatTime(details.time) : "à partir de 16h"}</p></div>
      </section>
      <section className="bo-arabic" lang="ar" dir="rtl">
        <img className="bo-arch" src={`${A}arch.png`} alt="" />
        <div className="bo-arabic-copy"><img className="bo-basmala" src={`${A}arabic-heading.png`} alt="بسم الله الرحمن الرحيم" /><img className="bo-small-flower" src={`${A}small-flower.png`} alt="" />
          {details ? <div dir="auto"><p><span>{details.groom}</span> <span>&</span> <span>{details.bride}</span></p><p>{details.message}</p><p>{formatDate(details.date)} · {formatTime(details.time)}</p><p>{details.venue}</p></div> : <>          <p>الآنسة أميرة والسيد يوسف</p><p>يسعدهما ويشرفهما أن يدعوا<br />حضرتكم الكريمة<br />لمشاركتهما فرحة حفل زفافهما</p><p>وذلك بمشيئة الله تعالى يوم<br />الخميس 20 ماي 2027<br />على الساعة الرابعة مساءً</p><p>بقاعة</p><p className="bo-script bo-arabic-venue" lang="fr" dir="ltr">Beldi Country Club</p></>}<Divider />
        </div>
      </section>
      <section className="bo-section bo-countdown-section"><Heading>La Célébration Commence</Heading><Countdown /></section>
      <section className="bo-section bo-schedule"><Heading>Chronologie de l’événement</Heading>{details ? <Celebrations /> : <div className="bo-timeline" ref={timeline}>
        <div className="bo-timeline-line" aria-hidden="true"><img ref={marker} src={`${A}timeline-flower.png`} alt="" /></div>
        {[['16:00', 'Welcome Reception'], ['17:00', 'Nikah Ceremony'], ['19:00', 'Dinner'], ['20:00', 'Party']].map(([time, label]) => <div className="bo-event" key={time}><time>{time}</time><img src={`${A}diamond.png`} alt="" /><p>{label}</p></div>)}
      </div>}</section>
      <section className="bo-venue bo-section"><Heading>Lieu</Heading><a className="bo-venue-link" href={map} target="_blank" rel="noreferrer"><img className="bo-pin" src={`${A}pin.png`} alt="Voir le lieu sur Google Maps" /><h3>{details?.venue || "Beldi Country Club"}</h3><p>{details?.address || "Marrakech, Morocco"}</p></a>{!details && <img className="bo-venue-image" src={`${A}venue.png`} alt="Palais marocain illuminé dans un jardin de palmiers" loading="lazy" />}</section>
      {!details && <section className="bo-section bo-dress"><Heading>Dress Code</Heading><img className="bo-guests" src={`${A}guests.png`} alt="Guests in formal gowns and suits" loading="lazy" /><p>We kindly invite you to dress in elegant attire that reflects the style and spirit of our special day.</p><h3 className="bo-script">Color palette</h3><div className="bo-palette"><span aria-label="Sage green" /><span aria-label="Champagne blush" /></div><h3 className="bo-script">Ladies</h3><p>Formal dresses in elegant,<br />polished styles are encouraged.</p><h3 className="bo-script">Gentlemen</h3><p>Well-tailored suits with classic<br />dress shoes are preferred.</p></section>}
      {!details && <section className="bo-section bo-rsvp"><Heading>Confirmez Votre Présence</Heading>
        {submitted ? <div className="bo-thankyou" role="status"><h3 className="bo-script">Merci pour votre réponse</h3><p>Votre réponse de démonstration a été enregistrée sur cet appareil.</p><button onClick={() => setSubmitted(false)}>Modifier ma réponse</button></div> : <form onSubmit={e => {
          e.preventDefault(); const form = e.currentTarget; const values = Object.fromEntries(new FormData(form))
          if (!String(values.name || '').trim()) { setError('Veuillez indiquer votre nom.'); return }
          try { localStorage.setItem('blossom-oud-rsvp', JSON.stringify(values)); setSubmitted(true); setError('') } catch { setError('Impossible d’enregistrer la réponse sur cet appareil. Veuillez autoriser le stockage local.') }
        }}>
          <label>Nom<input name="name" autoComplete="name" required maxLength={120} /></label>
          <label>Nombre de personnes<input name="guests" type="number" min={1} max={20} defaultValue={1} required disabled={attendance === 'no'} /></label>
          <fieldset><legend>Serez-vous présent?</legend><label><input type="radio" name="attendance" value="yes" checked={attendance === 'yes'} onChange={() => setAttendance('yes')} />Oui, je serai présent(e)</label><label><input type="radio" name="attendance" value="no" checked={attendance === 'no'} onChange={() => setAttendance('no')} />Désolé(e), je ne pourrai pas être présent(e)</label></fieldset>
          {error && <p className="bo-form-error" role="alert">{error}</p>}<button type="submit">SOUMETTRE</button><p className="bo-demo-note">Démonstration · réponse enregistrée uniquement sur cet appareil.</p>
        </form>}
      </section>}
      <section className="bo-section bo-map"><Heading>Itinéraire Google Maps</Heading><div className="bo-map-frame"><iframe title={details?.venue || "Beldi Country Club, Marrakech"} src={`https://maps.google.com/maps?q=${encodeURIComponent(details ? `${details.venue}, ${details.address}` : "Beldi Country Club Marrakech")}&z=14&output=embed`} loading="lazy" referrerPolicy="no-referrer-when-downgrade" /><a href={map} target="_blank" rel="noreferrer">Open in Maps ↗</a></div></section>
      <PersonalNotes/><footer className="bo-footer"><img className="bo-chandelier" src={`${A}chandelier.png`} alt="" loading="lazy" /><h2 className="bo-script">Au plaisir de vous accueillir</h2><img className="bo-closing-divider" src={`${A}closing-divider.png`} alt="" /><img className="bo-footer-flower" src={`${A}flowers.png`} alt="" /></footer>
    </div>
    {phase === 'open' && <button className="bo-music" aria-label={playing ? 'Mettre la musique en pause' : 'Écouter la musique'} aria-pressed={playing} onClick={() => {
      if (playing) audio.current?.pause(); else void audio.current?.play().catch(() => setPlaying(false))
    }}>{playing ? <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 5v14M17 5v14" stroke="currentColor" strokeWidth="4" /></svg> : <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m7 4 14 8-14 8Z" fill="currentColor" /></svg>}</button>}
  </main>
}
