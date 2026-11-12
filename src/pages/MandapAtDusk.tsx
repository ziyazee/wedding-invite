import { useEffect, useRef, useState } from 'react'
import { downloadCalendar } from '../invitations/calendar'
import { useInvitationDetails } from '../invitations/context'
import { formatDate, formatTime, mapURL, weddingISO } from '../invitations/model'
import { invitationExample } from '../invitations/templateData'
import HeartDateReveal from './HeartDateReveal'
import './Design18.css'

const demo = invitationExample(4)!
const formatRevealTime = (time: string) => time
  ? new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit', hour12: true, timeZone: 'UTC' }).format(new Date(`2000-01-01T${time}:00Z`))
  : ''

function Flourish() {
  return <div className="d18-flourish" aria-hidden="true"><span />✧<span /></div>
}

function Arrow() {
  return <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true"><path d="M5 19 19 5M5 5h14v14" /></svg>
}

export default function Design18() {
  const details = useInvitationDetails() || demo
  const firstName = details.brideFirst ? details.bride : details.groom
  const secondName = details.brideFirst ? details.groom : details.bride
  const firstFamily = details.brideFirst ? details.brideFamily : details.groomFamily
  const secondFamily = details.brideFirst ? details.groomFamily : details.brideFamily
  const firstRole = details.brideFirst ? 'BRIDE' : 'GROOM'
  const secondRole = details.brideFirst ? 'GROOM' : 'BRIDE'
  const video = useRef<HTMLVideoElement>(null)
  const heroText = useRef<HTMLDivElement>(null)
  const skipIntro = useRef(false)
  const audio = useRef<HTMLAudioElement>(null)
  const root = useRef<HTMLElement>(null)
  const [phase, setPhase] = useState<'closed' | 'playing' | 'open'>('closed')
  const [music, setMusic] = useState(false)
  const [showScrollPrompt, setShowScrollPrompt] = useState(false)
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
    const el = video.current
    if (!el) { finish(); return }
    if (el.readyState >= 1) el.currentTime = 1.95
    else skipIntro.current = true
    el.play().catch(() => {
      const tryAgain = () => { el.play().catch(finish) }
      if (el.readyState >= 3) { tryAgain(); return }
      el.addEventListener('canplaythrough', tryAgain, { once: true })
      setTimeout(() => { el.removeEventListener('canplaythrough', tryAgain); finish() }, 5000)
    })
  }

  useEffect(() => {
    const previousTitle = document.title
    document.title = `${firstName} & ${secondName} — Mangal`
    return () => { document.title = previousTitle }
  }, [firstName, secondName])

  useEffect(() => {
    const urls = [
      '/templates/mandap-at-dusk/seam-garland.webp',
      '/templates/mandap-at-dusk/border2.webp',
      '/templates/mandap-at-dusk/border3.png',
      '/templates/mandap-at-dusk/ivory-stationery-unframed.webp',
      '/templates/mandap-at-dusk/burgundy-stationery.webp',
      '/templates/mandap-at-dusk/couple-watercolor.webp',
      '/templates/mandap-at-dusk/scratch.webp',
      '/templates/mandap-at-dusk/post-scratch.webp',
    ]
    const links = urls.map(href => {
      const link = document.createElement('link')
      link.rel = 'preload'
      link.href = href
      link.setAttribute('as', 'image')
      document.head.appendChild(link)
      return link
    })
    return () => { links.forEach(link => link.remove()) }
  }, [])

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
    if (phase === 'closed') return
    const revealDuration = 2100 // Three consecutive 700ms text reveals.
    if (phase === 'open') {
      heroText.current?.style.setProperty('--d18-hero-elapsed', `${revealDuration}ms`)
      return
    }
    let frame = 0
    const syncText = () => {
      const player = video.current
      let elapsed = 0
      if (player && Number.isFinite(player.duration) && player.duration > 0) {
        const windowLength = Math.min(revealDuration, player.duration * 1000)
        const start = player.duration * 1000 - windowLength
        elapsed = Math.max(0, Math.min(1, (player.currentTime * 1000 - start) / windowLength)) * revealDuration
      }
      heroText.current?.style.setProperty('--d18-hero-elapsed', `${elapsed}ms`)
      frame = requestAnimationFrame(syncText)
    }
    syncText()
    return () => cancelAnimationFrame(frame)
  }, [phase])

  useEffect(() => {
    if (phase === 'closed' || matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) return
    const elements = Array.from(root.current?.querySelectorAll<HTMLElement>('.d18-reveal:not(.d18-visible)') || [])
    let nextRevealAt = 0
    const observer = new IntersectionObserver(entries => {
      const visible = entries.filter(entry => entry.isIntersecting)
        .sort((a, b) => elements.indexOf(a.target as HTMLElement) - elements.indexOf(b.target as HTMLElement))
      const now = performance.now()
      visible.forEach(entry => {
        const element = entry.target as HTMLElement
        const delay = Math.min(600, Math.max(0, nextRevealAt - now))
        element.style.setProperty('--d18-reveal-delay', `${delay}ms`)
        element.classList.add('d18-visible')
        element.classList.remove('d18-reveal-pending')
        nextRevealAt = now + delay + 200
        observer.unobserve(element)
      })
    }, { threshold: 0.1 })
    elements.forEach(element => {
      element.classList.add('d18-reveal-pending')
      observer.observe(element)
    })
    return () => {
      observer.disconnect()
      elements.forEach(element => element.classList.remove('d18-reveal-pending'))
    }
  }, [phase, details.events, details.dressCode, details.giftNote, details.gallery])

  const remaining = Math.max(0, new Date(weddingISO(details)).getTime() - now)
  const countdown = [
    Math.floor(remaining / 86400000),
    Math.floor(remaining / 3600000) % 24,
    Math.floor(remaining / 60000) % 60,
    Math.floor(remaining / 1000) % 60,
  ]

  return <main ref={root} className={`d18-page d18-${phase}`}>
    <audio ref={audio} src={details.music || '/templates/mandap-at-dusk/inkem.mp3'} loop preload="none" onPlay={() => setMusic(true)} onPause={() => setMusic(false)} />
    <section className="d18-entry" aria-label="Wedding invitation entry">
      <video ref={video} className="d18-entry-video" src="/templates/mandap-at-dusk/entry.mp4" poster="/templates/mandap-at-dusk/entry-poster.jpg" muted playsInline disablePictureInPicture preload="metadata" onLoadedMetadata={() => { if (skipIntro.current && video.current) { video.current.currentTime = 1.95; skipIntro.current = false } }} onTimeUpdate={event => { const player = event.currentTarget; if (phase === 'playing' && Number.isFinite(player.duration) && player.duration - player.currentTime <= 2 && player.duration > player.currentTime) setShowScrollPrompt(true) }} onEnded={finish} onError={() => { if (phase === 'playing') finish() }} />
      <div className="d18-entry-shade" />
      <button className={`d18-enter${phase !== 'closed' ? ' d18-enter-dismissed' : ''}`} aria-label="Open invitation" onClick={openInvitation} disabled={phase !== 'closed'} aria-hidden={phase !== 'closed'} tabIndex={phase === 'closed' ? 0 : -1}>
        <img src="/templates/mandap-at-dusk/open-invitation-button.webp" alt="" width="1080" height="360" draggable={false} />
      </button>
      <button className="d18-music" aria-label={music ? 'Pause music' : 'Play music'} onClick={() => music ? audio.current?.pause() : void audio.current?.play().catch(() => {})}>{music ? 'Ⅱ' : '♫'}</button>
      {showScrollPrompt && <div className="d18-scroll-prompt is-visible" aria-hidden="true"><span>Scroll down</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 4v15m-6-6 6 6 6-6" /></svg></div>}
      {phase !== 'closed' && <div ref={heroText} className="d18-ending-copy" aria-live="polite">
        <h1><span>{firstName}</span><i>&</i><span>{secondName}</span></h1>
      </div>}
    </section>

    {phase !== 'closed' && <>
      <div className="d18-seam-florals" aria-hidden="true" />
      <div id="d18-invitation" className="d18-paper">
      <section className="d18-intro" data-invite-section="welcome">
        <p className="d18-kicker d18-reveal">AN INVITATION FROM THE HEART</p><Flourish />
        <h2 className="d18-script d18-reveal">Two souls.<br />One beautiful journey.</h2>
        <p className="d18-message d18-reveal">{details.message}</p>
        <p className="d18-reveal">Your presence, prayers, and love will make our day complete.</p>
        {(firstFamily || secondFamily) && <div className="d18-families d18-reveal">
          {firstFamily && <p data-family={firstRole.toLowerCase()}><small>{firstRole}’S FAMILY</small><span data-invite-text={details.brideFirst ? 't4.bride.family' : 't4.groom.family'} data-invite-label={`${firstRole} family`}>{firstFamily}</span></p>}
          {secondFamily && <p data-family={secondRole.toLowerCase()}><small>{secondRole}’S FAMILY</small><span data-invite-text={details.brideFirst ? 't4.groom.family' : 't4.bride.family'} data-invite-label={`${secondRole} family`}>{secondFamily}</span></p>}
        </div>}
        <Flourish /><span className="d18-signature d18-script d18-reveal"><span>{firstName}</span><i>&</i><span>{secondName}</span></span>
        <img className="d18-couple-art" src="/templates/mandap-at-dusk/couple-watercolor.webp" alt="" aria-hidden="true" loading="lazy" />
      </section>

      <section className="d18-heart-section d18-reveal" aria-label="Scratch to reveal the wedding date">
        <HeartDateReveal date={formatDate(details.date, { day: 'numeric', month: 'long', year: 'numeric' })} day={formatDate(details.date, { weekday: 'long' })} time={formatRevealTime(details.time)} eventName={details.events.find(event => /wedding|nikah/i.test(event.title))?.title || details.events[0]?.title || ''} tone="rose" coatingImage="/templates/mandap-at-dusk/scratch.webp" revealedImage="/templates/mandap-at-dusk/post-scratch.webp" />
      </section>

      <section className="d18-countdown d18-reveal">
        <p className="d18-kicker">COUNTING DOWN TO OUR WEDDING</p><h2 className="d18-script">Until our forever</h2>
        {remaining > 0 ? <div className="d18-counts">{countdown.map((value, index) => <div key={index}><strong>{String(value).padStart(2, '0')}</strong><span>{['Days', 'Hours', 'Minutes', 'Seconds'][index]}</span></div>)}</div> : <p className="d18-script d18-after-date">A day to remember, a love forever.</p>}
      </section>

      <header className="d18-section-heading d18-reveal"><p className="d18-kicker">MOMENTS TO CELEBRATE</p><h2 className="d18-script">Every gathering.<br /><em>One beginning.</em></h2><Flourish /></header>
      <section className="d18-events">
        {[...details.events].sort((a, b) => `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`)).map(event => <article data-invite-event-key={event.id || `legacy-${details.events.indexOf(event)}`} className={`d18-event ${/nikah|wedding/i.test(event.title) ? 'd18-main-event' : ''}`} key={event.id || `legacy-${details.events.indexOf(event)}`}>
          <div className="d18-event-copy d18-reveal">
          <h3 className="d18-script">{event.title}</h3>
          <div className="d18-event-date"><strong>{formatDate(event.date, { day: '2-digit' })}</strong><span>{formatDate(event.date, { weekday: 'long', month: 'long', year: 'numeric' })}{event.time && <small>{formatTime(event.time)} onwards</small>}</span></div>
          <Flourish /><h4>{event.venue}</h4>{event.address !== event.venue && <p className="d18-address">{event.address}</p>}
        <div className="d18-event-actions"><a href={mapURL(event.venue, event.address, event.map)} target="_blank" rel="noreferrer">Directions <Arrow /></a><button onClick={() => downloadCalendar(event, details.offset, `${firstName} & ${secondName}`)}>Save the date <span>＋</span></button></div>
          </div>
        </article>)}
      </section>

      <div className="d18-closing">
      {(details.dressCode || details.giftNote || details.gallery) && <section className="d18-notes d18-reveal">
        {details.dressCode && <><p data-note="dress-heading" className="d18-kicker">A NOTE ON ATTIRE</p><p data-note="dress">{details.dressCode}</p></>}
        {details.giftNote && <><p data-note="gift-heading" className="d18-kicker">WITH LOVE</p><p data-note="gift">{details.giftNote}</p></>}
        {details.gallery && <a href={details.gallery} target="_blank" rel="noreferrer">Our memories <Arrow /></a>}
      </section>}

      <footer className="d18-footer d18-reveal">
        <p className="d18-kicker">MADE WITH LOVE FOR OUR FAMILY AND FRIENDS</p><Flourish />
        <h2 className="d18-script">Forever & ever</h2><p className="d18-footer-names"><span>{firstName}</span><i>&</i><span>{secondName}</span></p>
        <p>{formatDate(details.date)} · {details.address}</p><a href={mapURL(details.venue, details.address, details.map)} target="_blank" rel="noreferrer">{details.venue}</a>
      </footer>
      </div>
      </div>
    </>}
  </main>
}
