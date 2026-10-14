import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { downloadCalendar } from '../invitations/calendar'
import { useInvitationDetails } from '../invitations/context'
import { formatDate, formatTime, mapURL, weddingISO, type InvitationData } from '../invitations/model'
import './Design18.css'

const demo: InvitationData = {
  template: 18,
  groom: 'Rahul',
  bride: 'Naina',
  date: '2027-02-28',
  time: '17:30',
  offset: '+05:30',
  venue: 'Jai Mahal Palace',
  address: 'Jaipur, Rajasthan, India',
  map: '',
  message: 'With the blessings of Lord Ganesha and the love of our families, we invite you to join us as we exchange our vows and begin a life together.',
  groomFamily: 'With love from the Mehta family',
  brideFamily: 'With love from the Kapoor family',
  dressCode: 'Traditional Indian attire in rose, gold, or festive jewel tones is welcome.',
  giftNote: 'Your blessings and presence are the greatest gifts.',
  music: '/bisara.mp3',
  gallery: '',
  events: [
    { title: 'Haldi & Mehendi', date: '2027-02-27', time: '11:00', venue: 'Jai Mahal Palace', address: 'Jaipur, Rajasthan, India', map: '' },
    { title: 'Wedding Ceremony & Saat Phere', date: '2027-02-28', time: '17:30', venue: 'Jai Mahal Palace', address: 'Jaipur, Rajasthan, India', map: '' },
    { title: 'Reception & Dinner', date: '2027-02-28', time: '20:00', venue: 'Jai Mahal Palace', address: 'Jaipur, Rajasthan, India', map: '' },
  ],
}

function Flourish() {
  return <div className="d18-flourish" aria-hidden="true"><span />✧<span /></div>
}

function Arrow() {
  return <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true"><path d="M5 19 19 5M5 5h14v14" /></svg>
}

function WrittenWord({ value, className = '' }: { value: string; className?: string }) {
  return <span className={`d18-written-word ${className}`} aria-hidden="true">{Array.from(value).map((character, index) => {
    if (/\s/.test(character)) return <span className="d18-letter-space" key={`space-${index}`} />
    const style = { '--letter-delay': `${index * 0.34}s` } as CSSProperties
    return <svg className="d18-script-letter" key={`${character}-${index}`} viewBox="0 0 80 120" preserveAspectRatio="none" style={style}><text x="40" y="94" textAnchor="middle">{character}</text></svg>
  })}</span>
}

export default function Design18() {
  const details = useInvitationDetails() || demo
  const video = useRef<HTMLVideoElement>(null)
  const audio = useRef<HTMLAudioElement>(null)
  const root = useRef<HTMLElement>(null)
  const [phase, setPhase] = useState<'closed' | 'playing' | 'open'>('closed')
  const [showNames, setShowNames] = useState(false)
  const skipIntro = useRef(false)
  const [music, setMusic] = useState(false)
  const [now, setNow] = useState(() => Date.now())
  const finish = () => {
    video.current?.pause()
    setShowNames(true)
    setPhase('open')
  }

  function syncNameReveal() {
    const clip = video.current
    if (clip && clip.duration - clip.currentTime <= 2) setShowNames(true)
  }

  function openInvitation() {
    if (phase !== 'closed') return
    if (audio.current) {
      audio.current.volume = 0.35
      void audio.current.play().catch(() => {})
    }
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setShowNames(true)
      setPhase('open')
      return
    }
    setPhase('playing')
    if (video.current?.readyState && video.current.readyState >= 1) video.current.currentTime = 1.95
    else skipIntro.current = true
    void video.current?.play().catch(finish)
  }

  useEffect(() => {
    const previousTitle = document.title
    document.title = `${details.groom} & ${details.bride} — Mandap at Dusk`
    return () => { document.title = previousTitle }
  }, [details.groom, details.bride])

  useEffect(() => {
    const interval = window.setInterval(() => setNow(Date.now()), 1000)
    return () => window.clearInterval(interval)
  }, [])

  useEffect(() => {
    if (phase !== 'playing') return
    const timeout = window.setTimeout(finish, 12000)
    return () => window.clearTimeout(timeout)
  }, [phase])

  useEffect(() => {
    if (phase !== 'open' || matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) return
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (!entry.isIntersecting) return
      entry.target.classList.add('d18-visible')
      observer.unobserve(entry.target)
    }), { threshold: 0.1 })
    root.current?.querySelectorAll('.d18-reveal').forEach(element => observer.observe(element))
    return () => observer.disconnect()
  }, [phase])

  const remaining = Math.max(0, new Date(weddingISO(details)).getTime() - now)
  const countdown = [
    Math.floor(remaining / 86400000),
    Math.floor(remaining / 3600000) % 24,
    Math.floor(remaining / 60000) % 60,
    Math.floor(remaining / 1000) % 60,
  ]

  return <main ref={root} className={`d18-page d18-${phase}`}>
    <audio ref={audio} src={details.music || '/bisara.mp3'} loop preload="none" onPlay={() => setMusic(true)} onPause={() => setMusic(false)} />
    <section className="d18-entry" aria-label="Wedding invitation entry">
      <video ref={video} className="d18-entry-video" src="/design18/entry.mp4" poster="/design18/entry-poster.jpg" muted playsInline preload="auto" onLoadedMetadata={() => { if (skipIntro.current && video.current) { video.current.currentTime = 1.95; skipIntro.current = false } }} onTimeUpdate={syncNameReveal} onEnded={finish} onError={() => { if (phase === 'playing') finish() }} />
      <div className="d18-entry-shade" />
      {phase === 'closed' && <button className="d18-enter" onClick={openInvitation}>
        <span aria-hidden="true">✧</span> Open invitation
      </button>}
      <button className="d18-music" aria-label={music ? 'Pause music' : 'Play music'} onClick={() => music ? audio.current?.pause() : void audio.current?.play().catch(() => {})}>{music ? 'Ⅱ' : '♫'}</button>
      {showNames && <div className="d18-ending-names" aria-live="polite">
        <h1 aria-label={`${details.groom} weds ${details.bride}`}><WrittenWord value={details.groom} /><span className="d18-love-mark" aria-hidden="true"><svg viewBox="0 0 120 72"><path className="d18-heart" pathLength="1" d="M60 50 C49 39 31 27 31 14 C31 0 50 -1 60 12 C70 -1 89 0 89 14 C89 27 71 39 60 50Z"/></svg><WrittenWord value="Weds" className="d18-weds-word" /></span><WrittenWord value={details.bride} /><svg className="d18-name-swash" viewBox="0 0 600 70" preserveAspectRatio="none" aria-hidden="true"><path pathLength="1" d="M4 30 C93 8 184 8 255 35 C287 48 307 49 333 31 C398 -5 495 1 596 29" /></svg></h1>
      </div>}
    </section>

    {phase === 'open' && <>
      <div className="d18-discover-wrap"><button className="d18-discover" onClick={() => document.getElementById('d18-invitation')?.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' })}>Discover the invitation <span aria-hidden="true">↓</span></button></div>
      <div id="d18-invitation" className="d18-paper">
      <section className="d18-intro d18-reveal">
        <p className="d18-kicker">WITH THE BLESSINGS OF LORD GANESHA & OUR FAMILIES</p><Flourish />
        <h2 className="d18-script">Two souls.<br />One beautiful journey.</h2>
        <p className="d18-message">{details.message}</p>
        <p>Your presence, prayers, and love will make our day complete.</p>
        {(details.groomFamily || details.brideFamily) && <div className="d18-families">
          {details.groomFamily && <p><small>GROOM’S FAMILY</small>{details.groomFamily}</p>}
          {details.brideFamily && <p><small>BRIDE’S FAMILY</small>{details.brideFamily}</p>}
        </div>}
        <Flourish /><span className="d18-signature d18-script">{details.groom} & {details.bride}</span>
      </section>

      <section className="d18-save-date d18-reveal">
        <p className="d18-kicker">PLEASE SAVE THE DATE</p>
        <h2 className="d18-script">A day made for us</h2>
        <div className="d18-date-stamp"><span>{formatDate(details.date, { month: 'long' })}</span><strong>{formatDate(details.date, { day: '2-digit' })}</strong><span>{formatDate(details.date, { year: 'numeric' })}</span></div>
        <p>{formatDate(details.date, { weekday: 'long' })} · {formatTime(details.time)} · {details.offset === '+05:30' ? 'IST' : `UTC${details.offset}`}</p>
      </section>

      <section className="d18-countdown d18-reveal">
        <p className="d18-kicker">COUNTING DOWN TO OUR WEDDING</p><h2 className="d18-script">Until our forever</h2>
        {remaining > 0 ? <div className="d18-counts">{countdown.map((value, index) => <div key={index}><strong>{String(value).padStart(2, '0')}</strong><span>{['Days', 'Hours', 'Minutes', 'Seconds'][index]}</span></div>)}</div> : <p className="d18-script d18-after-date">A day to remember, a love forever.</p>}
      </section>

      <section className="d18-events">
        <header className="d18-section-heading d18-reveal"><p className="d18-kicker">MOMENTS TO CELEBRATE</p><h2 className="d18-script">Every gathering.<br /><em>One beginning.</em></h2><Flourish /></header>
        {[...details.events].sort((a, b) => `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`)).map((event, index) => <article className={`d18-event d18-reveal ${/nikah|wedding/i.test(event.title) ? 'd18-main-event' : ''}`} key={`${event.title}-${event.date}`}>
          <p className="d18-event-index">{String(index + 1).padStart(2, '0')} <span>✧</span> THE CELEBRATION</p>
          <h3 className="d18-script">{event.title}</h3>
          <div className="d18-event-date"><strong>{formatDate(event.date, { day: '2-digit' })}</strong><span>{formatDate(event.date, { weekday: 'long', month: 'long', year: 'numeric' })}<small>{formatTime(event.time)} · {details.offset === '+05:30' ? 'IST' : `UTC${details.offset}`}</small></span></div>
          <Flourish /><h4>{event.venue}</h4>{event.address !== event.venue && <p className="d18-address">{event.address}</p>}
          <div className="d18-event-actions"><a href={mapURL(event.venue, event.address, event.map)} target="_blank" rel="noreferrer">Directions <Arrow /></a><button onClick={() => downloadCalendar(event, details.offset, `${details.groom} & ${details.bride}`)}>Save the date <span>＋</span></button></div>
        </article>)}
      </section>

      {(details.dressCode || details.giftNote || details.gallery) && <section className="d18-notes d18-reveal">
        {details.dressCode && <><p className="d18-kicker">A NOTE ON ATTIRE</p><p>{details.dressCode}</p></>}
        {details.giftNote && <><p className="d18-kicker">WITH LOVE</p><p>{details.giftNote}</p></>}
        {details.gallery && <a href={details.gallery} target="_blank" rel="noreferrer">Our memories <Arrow /></a>}
      </section>}

      <footer className="d18-footer d18-reveal">
        <p className="d18-kicker">MADE WITH LOVE FOR OUR FAMILY AND FRIENDS</p><Flourish />
        <h2 className="d18-script">Forever & ever</h2><p className="d18-footer-names">{details.groom} <i>&</i> {details.bride}</p>
        <p>{formatDate(details.date)} · {details.address}</p><a href={mapURL(details.venue, details.address, details.map)} target="_blank" rel="noreferrer">{details.venue} <Arrow /></a>
      </footer>
      </div>
    </>}
  </main>
}
