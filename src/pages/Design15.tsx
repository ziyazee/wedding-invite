import { useEffect, useRef, useState } from 'react'
import { downloadCalendar } from '../invitations/calendar'
import { useInvitationDetails } from '../invitations/context'
import { formatDate, formatTime, mapURL, weddingISO, type InvitationData } from '../invitations/model'
import './Design15.css'

const demo: InvitationData = {
  template: 15,
  groom: 'Mohad',
  bride: 'Rahma',
  date: '2026-12-20',
  time: '11:00',
  offset: '+05:30',
  venue: 'TMA Pai Convention Centre',
  address: 'Mangalore, Karnataka',
  map: 'https://maps.app.goo.gl/1xf3k59k9QEaoQ717',
  message: 'With the blessings of Allah and the love of our families, we invite you to celebrate the beginning of our forever.',
  groomFamily: '',
  brideFamily: '',
  dressCode: 'Modest festive attire is warmly welcomed.',
  giftNote: 'Your presence and prayers are the greatest gift.',
  music: '/bisara.mp3',
  gallery: '',
  events: [
    { title: 'Mehendi Mehfil', date: '2026-12-19', time: '17:00', venue: 'Royal Garden Beach Resort', address: 'Ullal, Mangalore', map: 'https://maps.app.goo.gl/43ui6W3Hn6N2cbui8' },
    { title: 'Nikah & Wedding', date: '2026-12-20', time: '11:00', venue: 'TMA Pai Convention Centre', address: 'Mangalore, Karnataka', map: 'https://maps.app.goo.gl/1xf3k59k9QEaoQ717' },
    { title: 'Wedding Reception', date: '2026-12-21', time: '19:00', venue: 'Shoolin Palace', address: 'Airport Road, Mangalore', map: 'https://maps.app.goo.gl/ARcdN5shsLC5og2f8' },
  ],
}

function Flourish() {
  return <div className="d15-flourish" aria-hidden="true"><span />✧<span /></div>
}

function Arrow() {
  return <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true"><path d="M5 19 19 5M5 5h14v14" /></svg>
}

export default function Design15() {
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
    document.title = `${details.groom} & ${details.bride} — Ivory Arch`
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
      entry.target.classList.add('d15-visible')
      observer.unobserve(entry.target)
    }), { threshold: 0.1 })
    root.current?.querySelectorAll('.d15-reveal').forEach(element => observer.observe(element))
    return () => observer.disconnect()
  }, [phase])

  const remaining = Math.max(0, new Date(weddingISO(details)).getTime() - now)
  const countdown = [
    Math.floor(remaining / 86400000),
    Math.floor(remaining / 3600000) % 24,
    Math.floor(remaining / 60000) % 60,
    Math.floor(remaining / 1000) % 60,
  ]

  return <main ref={root} className={`d15-page d15-${phase}`}>
    <audio ref={audio} src={details.music || '/bisara.mp3'} loop preload="none" onPlay={() => setMusic(true)} onPause={() => setMusic(false)} />
    <section className="d15-entry" aria-label="Wedding invitation entry">
      <video ref={video} className="d15-entry-video" src="/design15/entry.mp4" poster="/design15/entry-poster.jpg" muted playsInline preload="auto" onEnded={finish} onError={() => { if (phase === 'playing') finish() }} />
      <div className="d15-entry-shade" />
      {phase === 'closed' && <button className="d15-enter" aria-label="Open invitation" onClick={openInvitation}>
        <span className="d15-enter-ornament d15-enter-ornament-top" aria-hidden="true">❧</span>
        <span className="d15-enter-label"><strong>OPEN</strong></span>
        <span className="d15-enter-ornament d15-enter-ornament-bottom" aria-hidden="true">❧</span>
      </button>}
      <button className="d15-music" aria-label={music ? 'Pause music' : 'Play music'} onClick={() => music ? audio.current?.pause() : void audio.current?.play().catch(() => {})}>{music ? 'Ⅱ' : '♫'}</button>
      {phase === 'open' && <div className="d15-ending-copy" aria-live="polite">
        <p className="d15-ending-kicker">WE ARE GETTING MARRIED</p>
        <h1><span>{details.groom}</span><i>&</i><span>{details.bride}</span></h1>
        <p className="d15-ending-date">{formatDate(details.date)}</p>
      </div>}
    </section>

    {phase === 'open' && <>
      <div className="d15-discover-wrap"><button className="d15-discover" onClick={() => document.getElementById('d15-invitation')?.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' })}>Discover the invitation <span aria-hidden="true">↓</span></button></div>
      <div id="d15-invitation" className="d15-paper">
      <section className="d15-intro d15-reveal">
        <p className="d15-kicker">TOGETHER WITH OUR FAMILIES</p><Flourish />
        <h2 className="d15-script">Two souls.<br />One beautiful journey.</h2>
        <p className="d15-message">{details.message}</p>
        <p>Your presence, prayers, and love will make our day complete.</p>
        {(details.groomFamily || details.brideFamily) && <div className="d15-families">
          {details.groomFamily && <p><small>GROOM’S FAMILY</small>{details.groomFamily}</p>}
          {details.brideFamily && <p><small>BRIDE’S FAMILY</small>{details.brideFamily}</p>}
        </div>}
        <Flourish /><span className="d15-signature d15-script">{details.groom} & {details.bride}</span>
      </section>

      <section className="d15-save-date d15-reveal">
        <p className="d15-kicker">PLEASE SAVE THE DATE</p>
        <h2 className="d15-script">A day made for us</h2>
        <div className="d15-date-stamp"><span>{formatDate(details.date, { month: 'long' })}</span><strong>{formatDate(details.date, { day: '2-digit' })}</strong><span>{formatDate(details.date, { year: 'numeric' })}</span></div>
        <p>{formatDate(details.date, { weekday: 'long' })} · {formatTime(details.time)}</p>
      </section>

      <section className="d15-countdown d15-reveal">
        <p className="d15-kicker">COUNTING DOWN TO OUR NIKAH</p><h2 className="d15-script">Until our forever</h2>
        {remaining > 0 ? <div className="d15-counts">{countdown.map((value, index) => <div key={index}><strong>{String(value).padStart(2, '0')}</strong><span>{['Days', 'Hours', 'Minutes', 'Seconds'][index]}</span></div>)}</div> : <p className="d15-script d15-after-date">A day to remember, a love forever.</p>}
      </section>

      <section className="d15-events">
        <header className="d15-section-heading d15-reveal"><p className="d15-kicker">MOMENTS TO CELEBRATE</p><h2 className="d15-script">Every gathering.<br /><em>One beginning.</em></h2><Flourish /></header>
        {[...details.events].sort((a, b) => `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`)).map((event, index) => <article className={`d15-event d15-reveal ${/nikah|wedding/i.test(event.title) ? 'd15-main-event' : ''}`} key={`${event.title}-${event.date}`}>
          <p className="d15-event-index">{String(index + 1).padStart(2, '0')} <span>✧</span> THE CELEBRATION</p>
          <h3 className="d15-script">{event.title}</h3>
          <div className="d15-event-date"><strong>{formatDate(event.date, { day: '2-digit' })}</strong><span>{formatDate(event.date, { weekday: 'long', month: 'long', year: 'numeric' })}<small>{formatTime(event.time)}</small></span></div>
          <Flourish /><h4>{event.venue}</h4>{event.address !== event.venue && <p className="d15-address">{event.address}</p>}
          <div className="d15-event-actions"><a href={mapURL(event.venue, event.address, event.map)} target="_blank" rel="noreferrer">Directions <Arrow /></a><button onClick={() => downloadCalendar(event, details.offset, `${details.groom} & ${details.bride}`)}>Save the date <span>＋</span></button></div>
        </article>)}
      </section>

      {(details.dressCode || details.giftNote || details.gallery) && <section className="d15-notes d15-reveal">
        {details.dressCode && <><p className="d15-kicker">A NOTE ON ATTIRE</p><p>{details.dressCode}</p></>}
        {details.giftNote && <><p className="d15-kicker">WITH LOVE</p><p>{details.giftNote}</p></>}
        {details.gallery && <a href={details.gallery} target="_blank" rel="noreferrer">Our memories <Arrow /></a>}
      </section>}

      <footer className="d15-footer d15-reveal">
        <p className="d15-kicker">MADE WITH LOVE FOR OUR FAMILY AND FRIENDS</p><Flourish />
        <h2 className="d15-script">Forever & ever</h2><p className="d15-footer-names">{details.groom} <i>&</i> {details.bride}</p>
        <p>{formatDate(details.date)} · {details.address}</p><a href={mapURL(details.venue, details.address, details.map)} target="_blank" rel="noreferrer">{details.venue} <Arrow /></a>
      </footer>
      </div>
    </>}
  </main>
}
