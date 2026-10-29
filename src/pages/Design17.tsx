import { useEffect, useRef, useState } from 'react'
import { downloadCalendar } from '../invitations/calendar'
import { useInvitationDetails } from '../invitations/context'
import { formatDate, formatTime, mapURL, weddingISO, type InvitationData } from '../invitations/model'
import './Design17.css'

const demo: InvitationData = {
  template: 17,
  groom: 'Nikhil',
  bride: 'Aditi',
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
  return <div className="d17-flourish" aria-hidden="true"><span />✧<span /></div>
}

function Arrow() {
  return <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true"><path d="M5 19 19 5M5 5h14v14" /></svg>
}

export default function Design17() {
  const details = useInvitationDetails() || demo
  const video = useRef<HTMLVideoElement>(null)
  const audio = useRef<HTMLAudioElement>(null)
  const root = useRef<HTMLElement>(null)
  const [phase, setPhase] = useState<'closed' | 'playing' | 'open'>('closed')
  const [music, setMusic] = useState(false)
  const [now, setNow] = useState(() => Date.now())
  const finish = () => {
    video.current?.pause()
    setPhase('open')
  }

  function openInvitation() {
    if (phase !== 'closed') return
    if (audio.current) {
      audio.current.volume = 0.35
      void audio.current.play().catch(() => {})
    }
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setPhase('open')
      return
    }
    setPhase('playing')
    void video.current?.play().catch(finish)
  }

  useEffect(() => {
    const previousTitle = document.title
    document.title = `${details.groom} & ${details.bride} — Gulabi Mandap`
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
      entry.target.classList.add('d17-visible')
      observer.unobserve(entry.target)
    }), { threshold: 0.1 })
    root.current?.querySelectorAll('.d17-reveal').forEach(element => observer.observe(element))
    return () => observer.disconnect()
  }, [phase])

  const remaining = Math.max(0, new Date(weddingISO(details)).getTime() - now)
  const countdown = [
    Math.floor(remaining / 86400000),
    Math.floor(remaining / 3600000) % 24,
    Math.floor(remaining / 60000) % 60,
    Math.floor(remaining / 1000) % 60,
  ]

  return <main ref={root} className={`d17-page d17-${phase}`}>
    <audio ref={audio} src={details.music || '/bisara.mp3'} loop preload="none" onPlay={() => setMusic(true)} onPause={() => setMusic(false)} />
    <section className="d17-entry" aria-label="Wedding invitation entry">
      <video ref={video} className="d17-entry-video" src="/templates/deprecated/design17/entry.mp4" poster="/templates/deprecated/design17/entry-poster.jpg" muted playsInline preload="metadata" onEnded={finish} onError={() => { if (phase === 'playing') finish() }} />
      <div className="d17-entry-shade" />
      {phase === 'closed' && <button className="d17-enter" onClick={openInvitation}>
        <span aria-hidden="true">✧</span> Open invitation
      </button>}
      <button className="d17-music" aria-label={music ? 'Pause music' : 'Play music'} onClick={() => music ? audio.current?.pause() : void audio.current?.play().catch(() => {})}>{music ? 'Ⅱ' : '♫'}</button>
      {phase === 'open' && <div className="d17-ending-copy" aria-live="polite">
        <p className="d17-ending-kicker">A CELEBRATION OF LOVE & NEW BEGINNINGS</p>
        <h1><span>{details.groom}</span><i>&</i><span>{details.bride}</span></h1>
        <p className="d17-ending-date">JOIN US IN CELEBRATION · {formatDate(details.date)}</p>
      </div>}
    </section>

    {phase === 'open' && <>
      <div className="d17-discover-wrap"><button className="d17-discover" onClick={() => document.getElementById('d17-invitation')?.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' })}>Discover the invitation <span aria-hidden="true">↓</span></button></div>
      <div id="d17-invitation" className="d17-paper">
      <section className="d17-intro d17-reveal">
        <p className="d17-kicker">WITH THE BLESSINGS OF LORD GANESHA & OUR FAMILIES</p><Flourish />
        <h2 className="d17-script">Two souls.<br />One beautiful journey.</h2>
        <p className="d17-message">{details.message}</p>
        <p>Your presence, prayers, and love will make our day complete.</p>
        {(details.groomFamily || details.brideFamily) && <div className="d17-families">
          {details.groomFamily && <p><small>GROOM’S FAMILY</small>{details.groomFamily}</p>}
          {details.brideFamily && <p><small>BRIDE’S FAMILY</small>{details.brideFamily}</p>}
        </div>}
        <Flourish /><span className="d17-signature d17-script">{details.groom} & {details.bride}</span>
      </section>

      <section className="d17-save-date d17-reveal">
        <p className="d17-kicker">PLEASE SAVE THE DATE</p>
        <h2 className="d17-script">A day made for us</h2>
        <div className="d17-date-stamp"><span>{formatDate(details.date, { month: 'long' })}</span><strong>{formatDate(details.date, { day: '2-digit' })}</strong><span>{formatDate(details.date, { year: 'numeric' })}</span></div>
        <p>{formatDate(details.date, { weekday: 'long' })} · {formatTime(details.time)}</p>
      </section>

      <section className="d17-countdown d17-reveal">
        <p className="d17-kicker">COUNTING DOWN TO OUR WEDDING</p><h2 className="d17-script">Until our forever</h2>
        {remaining > 0 ? <div className="d17-counts">{countdown.map((value, index) => <div key={index}><strong>{String(value).padStart(2, '0')}</strong><span>{['Days', 'Hours', 'Minutes', 'Seconds'][index]}</span></div>)}</div> : <p className="d17-script d17-after-date">A day to remember, a love forever.</p>}
      </section>

      <section className="d17-events">
        <header className="d17-section-heading d17-reveal"><p className="d17-kicker">MOMENTS TO CELEBRATE</p><h2 className="d17-script">Every gathering.<br /><em>One beginning.</em></h2><Flourish /></header>
        {[...details.events].sort((a, b) => `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`)).map((event, index) => <article className={`d17-event d17-reveal ${/nikah|wedding/i.test(event.title) ? 'd17-main-event' : ''}`} key={`${event.title}-${event.date}`}>
          <p className="d17-event-index">{String(index + 1).padStart(2, '0')} <span>✧</span> THE CELEBRATION</p>
          <h3 className="d17-script">{event.title}</h3>
          <div className="d17-event-date"><strong>{formatDate(event.date, { day: '2-digit' })}</strong><span>{formatDate(event.date, { weekday: 'long', month: 'long', year: 'numeric' })}<small>{formatTime(event.time)}</small></span></div>
          <Flourish /><h4>{event.venue}</h4>{event.address !== event.venue && <p className="d17-address">{event.address}</p>}
          <div className="d17-event-actions"><a href={mapURL(event.venue, event.address, event.map)} target="_blank" rel="noreferrer">Directions <Arrow /></a><button onClick={() => downloadCalendar(event, details.offset, `${details.groom} & ${details.bride}`)}>Save the date <span>＋</span></button></div>
        </article>)}
      </section>

      {(details.dressCode || details.giftNote || details.gallery) && <section className="d17-notes d17-reveal">
        {details.dressCode && <><p className="d17-kicker">A NOTE ON ATTIRE</p><p>{details.dressCode}</p></>}
        {details.giftNote && <><p className="d17-kicker">WITH LOVE</p><p>{details.giftNote}</p></>}
        {details.gallery && <a href={details.gallery} target="_blank" rel="noreferrer">Our memories <Arrow /></a>}
      </section>}

      <footer className="d17-footer d17-reveal">
        <p className="d17-kicker">MADE WITH LOVE FOR OUR FAMILY AND FRIENDS</p><Flourish />
        <h2 className="d17-script">Forever & ever</h2><p className="d17-footer-names">{details.groom} <i>&</i> {details.bride}</p>
        <p>{formatDate(details.date)} · {details.address}</p><a href={mapURL(details.venue, details.address, details.map)} target="_blank" rel="noreferrer">{details.venue} <Arrow /></a>
      </footer>
      </div>
    </>}
  </main>
}
