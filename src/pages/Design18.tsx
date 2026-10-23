import { useEffect, useRef, useState } from 'react'
import { downloadCalendar } from '../invitations/calendar'
import { useInvitationDetails } from '../invitations/context'
import { formatDate, formatTime, mapURL, weddingISO, type InvitationData } from '../invitations/model'
import HeartDateReveal from './HeartDateReveal'
import './Design18.css'

const demo: InvitationData = {
  template: 4,
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
  music: '/design18/inkem.mp3',
  gallery: '',
  events: [
    { title: 'Haldi & Mehendi', date: '2027-02-20', time: '11:00', venue: 'The Garden Pavilion', address: 'Jaipur, Rajasthan, India', map: '' },
    { title: 'Wedding Ceremony & Saat Phere', date: '2027-02-21', time: '18:30', venue: 'The Garden Pavilion', address: 'Jaipur, Rajasthan, India', map: '' },
    { title: 'Reception & Dinner', date: '2027-02-21', time: '20:30', venue: 'The Garden Pavilion', address: 'Jaipur, Rajasthan, India', map: '' },
  ],
}

function Flourish() {
  return <div className="d18-flourish" aria-hidden="true"><span />✧<span /></div>
}

function Arrow() {
  return <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true"><path d="M5 19 19 5M5 5h14v14" /></svg>
}

export default function Design18() {
  const details = useInvitationDetails() || demo
  const video = useRef<HTMLVideoElement>(null)
  const skipIntro = useRef(false)
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
    if (video.current && video.current.readyState >= 1) video.current.currentTime = 1.95
    else skipIntro.current = true
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
    <audio ref={audio} src={details.music || '/design18/inkem.mp3'} loop preload="none" onPlay={() => setMusic(true)} onPause={() => setMusic(false)} />
    <section className="d18-entry" aria-label="Wedding invitation entry">
      <video ref={video} className="d18-entry-video" src="/design18/entry.mp4" poster="/design18/entry-poster.jpg" muted playsInline disablePictureInPicture preload="auto" onLoadedMetadata={() => { if (skipIntro.current && video.current) { video.current.currentTime = 1.95; skipIntro.current = false } }} onEnded={finish} onError={() => { if (phase === 'playing') finish() }} />
      <div className="d18-entry-shade" />
      <button className={`d18-enter${phase !== 'closed' ? ' d18-enter-dismissed' : ''}`} aria-label="Open invitation" onClick={openInvitation} disabled={phase !== 'closed'} aria-hidden={phase !== 'closed'} tabIndex={phase === 'closed' ? 0 : -1}>
        <img src="/design18/open-invitation-button.png" alt="" width="1080" height="360" draggable={false} />
      </button>
      <button className="d18-music" aria-label={music ? 'Pause music' : 'Play music'} onClick={() => music ? audio.current?.pause() : void audio.current?.play().catch(() => {})}>{music ? 'Ⅱ' : '♫'}</button>
      {phase === 'open' && <div className="d18-ending-copy" aria-live="polite">
        <h1><span>{details.groom}</span><i>&</i><span>{details.bride}</span></h1>
      </div>}
    </section>

    {phase !== 'closed' && <>
      <div className="d18-seam-florals" aria-hidden="true" />
      <div id="d18-invitation" className="d18-paper">
      <section className="d18-intro d18-reveal">
        <p className="d18-kicker">AN INVITATION FROM THE HEART</p><Flourish />
        <h2 className="d18-script">Two souls.<br />One beautiful journey.</h2>
        <p className="d18-message">{details.message}</p>
        <p>Your presence, prayers, and love will make our day complete.</p>
        {(details.groomFamily || details.brideFamily) && <div className="d18-families">
          {details.groomFamily && <p data-family="groom"><small>GROOM’S FAMILY</small>{details.groomFamily}</p>}
          {details.brideFamily && <p data-family="bride"><small>BRIDE’S FAMILY</small>{details.brideFamily}</p>}
        </div>}
        <Flourish /><span className="d18-signature d18-script">{details.groom} & {details.bride}</span>
        <img className="d18-couple-art" src="/design16/couple-watercolor.png" alt="" aria-hidden="true" loading="lazy" />
      </section>

      <section className="d18-heart-section d18-reveal" aria-label="Scratch to reveal the wedding date">
        <HeartDateReveal date={formatDate(details.date, { day: 'numeric', month: 'long', year: 'numeric' })} day={formatDate(details.date, { weekday: 'long' })} time={formatTime(details.time)} tone="rose" coatingImage="/design18/scratch.png" revealedImage="/design18/post-scratch.png" />
      </section>

      <section className="d18-countdown d18-reveal">
        <p className="d18-kicker">COUNTING DOWN TO OUR WEDDING</p><h2 className="d18-script">Until our forever</h2>
        {remaining > 0 ? <div className="d18-counts">{countdown.map((value, index) => <div key={index}><strong>{String(value).padStart(2, '0')}</strong><span>{['Days', 'Hours', 'Minutes', 'Seconds'][index]}</span></div>)}</div> : <p className="d18-script d18-after-date">A day to remember, a love forever.</p>}
      </section>

      <section className="d18-events">
        <header className="d18-section-heading d18-reveal"><p className="d18-kicker">MOMENTS TO CELEBRATE</p><h2 className="d18-script">Every gathering.<br /><em>One beginning.</em></h2><Flourish /></header>
        {[...details.events].sort((a, b) => `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`)).map((event, index) => <article data-invite-event-key={event.id || `legacy-${details.events.indexOf(event)}`} className={`d18-event d18-reveal ${/nikah|wedding/i.test(event.title) ? 'd18-main-event' : ''}`} key={event.id || `legacy-${details.events.indexOf(event)}`}>
          <p className="d18-event-index">{String(index + 1).padStart(2, '0')} <span>✧</span> THE CELEBRATION</p>
          <h3 className="d18-script">{event.title}</h3>
          <div className="d18-event-date"><strong>{formatDate(event.date, { day: '2-digit' })}</strong><span>{formatDate(event.date, { weekday: 'long', month: 'long', year: 'numeric' })}<small>{formatTime(event.time)}</small></span></div>
          <Flourish /><h4>{event.venue}</h4>{event.address !== event.venue && <p className="d18-address">{event.address}</p>}
          <div className="d18-event-actions"><a href={mapURL(event.venue, event.address, event.map)} target="_blank" rel="noreferrer">Directions <Arrow /></a><button onClick={() => downloadCalendar(event, details.offset, `${details.groom} & ${details.bride}`)}>Save the date <span>＋</span></button></div>
        </article>)}
      </section>

      {(details.dressCode || details.giftNote || details.gallery) && <section className="d18-notes d18-reveal">
        {details.dressCode && <><p data-note="dress-heading" className="d18-kicker">A NOTE ON ATTIRE</p><p data-note="dress">{details.dressCode}</p></>}
        {details.giftNote && <><p data-note="gift-heading" className="d18-kicker">WITH LOVE</p><p data-note="gift">{details.giftNote}</p></>}
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
