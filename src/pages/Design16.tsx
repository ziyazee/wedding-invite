import { useEffect, useRef, useState } from 'react'
import { downloadCalendar } from '../invitations/calendar'
import { useInvitationDetails } from '../invitations/context'
import { formatDate, formatTime, mapURL, weddingISO, type InvitationData } from '../invitations/model'
import HeartDateReveal from './HeartDateReveal'
import './Design16.css'

const demo: InvitationData = {
  template: 16,
  groom: 'Arjun',
  bride: 'Meera',
  date: '2027-02-21',
  time: '18:30',
  offset: '+05:30',
  venue: 'The Garden Pavilion',
  address: 'Jaipur, Rajasthan, India',
  map: '',
  message: 'With the blessings of Lord Ganesha and our beloved families, we invite you to join us as we celebrate our wedding and begin a beautiful life together.',
  groomFamily: 'With love from the Sharma family',
  brideFamily: 'With love from the Iyer family',
  dressCode: 'Traditional Indian attire in warm jewel tones is welcome.',
  giftNote: 'Your blessings and presence are the greatest gifts.',
  music: '/bisara.mp3',
  gallery: '',
  events: [
    { title: 'Haldi & Mehendi', date: '2027-02-20', time: '11:00', venue: 'The Garden Pavilion', address: 'Jaipur, Rajasthan, India', map: '' },
    { title: 'Wedding Ceremony & Saat Phere', date: '2027-02-21', time: '18:30', venue: 'The Garden Pavilion', address: 'Jaipur, Rajasthan, India', map: '' },
    { title: 'Reception & Dinner', date: '2027-02-21', time: '20:30', venue: 'The Garden Pavilion', address: 'Jaipur, Rajasthan, India', map: '' },
  ],
}

function Flourish() {
  return <div className="d16-flourish" aria-hidden="true"><span />✧<span /></div>
}

function Arrow() {
  return <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true"><path d="M5 19 19 5M5 5h14v14" /></svg>
}

export default function Design16() {
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
    document.title = `${details.groom} & ${details.bride} — Sacred Mandap`
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
    if (phase === 'closed' || matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) return
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (!entry.isIntersecting) return
      entry.target.classList.add('d16-visible')
      observer.unobserve(entry.target)
    }), { threshold: 0.1 })
    root.current?.querySelectorAll('.d16-reveal').forEach(element => observer.observe(element))
    return () => observer.disconnect()
  }, [phase])

  const remaining = Math.max(0, new Date(weddingISO(details)).getTime() - now)
  const countdown = [
    Math.floor(remaining / 86400000),
    Math.floor(remaining / 3600000) % 24,
    Math.floor(remaining / 60000) % 60,
    Math.floor(remaining / 1000) % 60,
  ]

  return <main ref={root} className={`d16-page d16-${phase}`}>
    <audio ref={audio} src={details.music || '/bisara.mp3'} loop preload="none" onPlay={() => setMusic(true)} onPause={() => setMusic(false)} />
    <section className="d16-entry" aria-label="Wedding invitation entry">
      <video ref={video} className="d16-entry-video" src="/design16/entry-trimmed.mp4" poster="/design16/entry-poster.jpg" muted playsInline preload="auto" onEnded={finish} onError={() => { if (phase === 'playing') finish() }} />
      <div className="d16-entry-shade" />
      {phase === 'closed' && <button className="d16-enter" onClick={openInvitation}>
        <span aria-hidden="true">✧</span> Open invitation
      </button>}
      <button className="d16-music" aria-label={music ? 'Pause music' : 'Play music'} onClick={() => music ? audio.current?.pause() : void audio.current?.play().catch(() => {})}>{music ? 'Ⅱ' : '♫'}</button>
      {phase === 'open' && <div className="d16-ending-copy" aria-live="polite">
        <h1><span>{details.groom}</span><i>&</i><span>{details.bride}</span></h1>
      </div>}
    </section>

    {phase !== 'closed' && <>
      <div className="d16-seam-florals" aria-hidden="true" />
      <div id="d16-invitation" className="d16-paper">
      <section className="d16-intro d16-reveal">
        <p className="d16-kicker">AN INVITATION FROM THE HEART</p><Flourish />
        <h2 className="d16-script">Two souls.<br />One beautiful journey.</h2>
        <p className="d16-message">{details.message}</p>
        <p>Your presence, prayers, and love will make our day complete.</p>
        {(details.groomFamily || details.brideFamily) && <div className="d16-families">
          {details.groomFamily && <p><small>GROOM’S FAMILY</small>{details.groomFamily}</p>}
          {details.brideFamily && <p><small>BRIDE’S FAMILY</small>{details.brideFamily}</p>}
        </div>}
        <Flourish /><span className="d16-signature d16-script">{details.groom} & {details.bride}</span>
        <img className="d16-couple-art" src="/design16/couple-watercolor.png" alt="" aria-hidden="true" loading="lazy" />
      </section>

      <section className="d16-heart-section d16-reveal" aria-label="Scratch to reveal the wedding date">
        <HeartDateReveal date={formatDate(details.date, { day: 'numeric', month: 'long', year: 'numeric' })} day={formatDate(details.date, { weekday: 'long' })} time={formatTime(details.time)} tone="rose" />
      </section>

      <section className="d16-countdown d16-reveal">
        <p className="d16-kicker">COUNTING DOWN TO OUR WEDDING</p><h2 className="d16-script">Until our forever</h2>
        {remaining > 0 ? <div className="d16-counts">{countdown.map((value, index) => <div key={index}><strong>{String(value).padStart(2, '0')}</strong><span>{['Days', 'Hours', 'Minutes', 'Seconds'][index]}</span></div>)}</div> : <p className="d16-script d16-after-date">A day to remember, a love forever.</p>}
      </section>

      <section className="d16-events">
        <header className="d16-section-heading d16-reveal"><p className="d16-kicker">MOMENTS TO CELEBRATE</p><h2 className="d16-script">Every gathering.<br /><em>One beginning.</em></h2><Flourish /></header>
        {[...details.events].sort((a, b) => `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`)).map((event, index) => <article className={`d16-event d16-reveal ${/nikah|wedding/i.test(event.title) ? 'd16-main-event' : ''}`} key={`${event.title}-${event.date}`}>
          <p className="d16-event-index">{String(index + 1).padStart(2, '0')} <span>✧</span> THE CELEBRATION</p>
          <h3 className="d16-script">{event.title}</h3>
          <div className="d16-event-date"><strong>{formatDate(event.date, { day: '2-digit' })}</strong><span>{formatDate(event.date, { weekday: 'long', month: 'long', year: 'numeric' })}<small>{formatTime(event.time)} · {details.offset === '+05:30' ? 'IST' : `UTC${details.offset}`}</small></span></div>
          <Flourish /><h4>{event.venue}</h4>{event.address !== event.venue && <p className="d16-address">{event.address}</p>}
          <div className="d16-event-actions"><a href={mapURL(event.venue, event.address, event.map)} target="_blank" rel="noreferrer">Directions <Arrow /></a><button onClick={() => downloadCalendar(event, details.offset, `${details.groom} & ${details.bride}`)}>Save the date <span>＋</span></button></div>
        </article>)}
      </section>

      {(details.dressCode || details.giftNote || details.gallery) && <section className="d16-notes d16-reveal">
        {details.dressCode && <><p className="d16-kicker">A NOTE ON ATTIRE</p><p>{details.dressCode}</p></>}
        {details.giftNote && <><p className="d16-kicker">WITH LOVE</p><p>{details.giftNote}</p></>}
        {details.gallery && <a href={details.gallery} target="_blank" rel="noreferrer">Our memories <Arrow /></a>}
      </section>}

      <footer className="d16-footer d16-reveal">
        <p className="d16-kicker">MADE WITH LOVE FOR OUR FAMILY AND FRIENDS</p><Flourish />
        <h2 className="d16-script">Forever & ever</h2><p className="d16-footer-names">{details.groom} <i>&</i> {details.bride}</p>
        <p>{formatDate(details.date)} · {details.address}</p><a href={mapURL(details.venue, details.address, details.map)} target="_blank" rel="noreferrer">{details.venue} <Arrow /></a>
      </footer>
      </div>
    </>}
  </main>
}
