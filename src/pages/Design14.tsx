import { useEffect, useRef, useState } from 'react'
import { downloadCalendar } from '../invitations/calendar'
import { useInvitationDetails } from '../invitations/context'
import { formatDate, formatTime, mapURL, weddingISO, type InvitationData } from '../invitations/model'
import './Design14.css'

const A = '/design14/assets/'

const demo: InvitationData = {
  template: 14,
  groom: 'Krishna',
  bride: 'Radha',
  date: '2026-12-20',
  time: '11:00',
  offset: '+05:30',
  venue: 'The Royal Palace',
  address: 'Varanasi, Uttar Pradesh',
  map: '',
  message: 'With the blessings of the Almighty and our beloved elders, we invite you to celebrate our union and the beginning of a beautiful journey.',
  groomFamily: 'The Sharma family',
  brideFamily: 'The Verma family',
  dressCode: 'Traditional festive attire',
  giftNote: 'Your blessings and presence are the greatest gifts of all.',
  music: '',
  gallery: '',
  events: [
    { title: 'Mehendi Ki Raat', date: '2026-12-18', time: '18:00', venue: 'The Garden Courtyard', address: 'Varanasi, Uttar Pradesh', map: '' },
    { title: 'Wedding Ceremony', date: '2026-12-20', time: '11:00', venue: 'The Royal Palace', address: 'Varanasi, Uttar Pradesh', map: '' },
    { title: 'Wedding Reception', date: '2026-12-20', time: '19:00', venue: 'The Grand Ballroom', address: 'Varanasi, Uttar Pradesh', map: '' },
  ],
}

function Arrow() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h13M13 6l6 6-6 6" /></svg>
}

function Ornament() {
  return <div className="d14-ornament" aria-hidden="true"><span />✦<span /></div>
}

export default function Design14() {
  const details = useInvitationDetails() || demo
  const root = useRef<HTMLElement>(null)
  const audio = useRef<HTMLAudioElement>(null)
  const [music, setMusic] = useState(false)
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    const previousTitle = document.title
    document.title = `${details.groom} & ${details.bride} — A Timeless Union`
    return () => { document.title = previousTitle }
  }, [details.groom, details.bride])

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 1000)
    return () => window.clearInterval(timer)
  }, [])

  useEffect(() => {
    const element = root.current
    if (!element || matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let frame = 0
    const update = () => {
      frame = 0
      element.style.setProperty('--d14-scroll', `${window.scrollY}px`)
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [])

  useEffect(() => {
    const element = root.current
    if (!element || matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) return
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (!entry.isIntersecting) return
      entry.target.classList.add('d14-visible')
      observer.unobserve(entry.target)
    }), { threshold: 0.12 })
    element.querySelectorAll('.d14-reveal').forEach(node => observer.observe(node))
    return () => observer.disconnect()
  }, [])

  const remaining = Math.max(0, new Date(weddingISO(details)).getTime() - now)
  const countdown = [
    Math.floor(remaining / 86400000),
    Math.floor(remaining / 3600000) % 24,
    Math.floor(remaining / 60000) % 60,
    Math.floor(remaining / 1000) % 60,
  ]
  const sortedEvents = [...details.events].sort((a, b) => `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`))

  function toggleMusic() {
    if (!audio.current) return
    if (music) audio.current.pause()
    else void audio.current.play().catch(() => {})
  }

  return <main ref={root} className="d14-page">
    <audio ref={audio} src={details.music || '/bisara.mp3'} loop preload="none" onPlay={() => setMusic(true)} onPause={() => setMusic(false)} />

    <section className="d14-hero" aria-label={`${details.groom} and ${details.bride}'s wedding invitation`}>
      <img className="d14-sky" src={`${A}1Zg49ggjH1NeMsuurkKzD6m20vo.webp`} alt="" />
      <div className="d14-cloud-track d14-cloud-track-one" aria-hidden="true"><img src={`${A}zGWp5UP4NXxBVD059Ha4jDG8lIE.webp`} alt="" /><img src={`${A}zGWp5UP4NXxBVD059Ha4jDG8lIE.webp`} alt="" /></div>
      <div className="d14-cloud-track d14-cloud-track-two" aria-hidden="true"><img src={`${A}UeasMBu07jHUk5ch5onj5OD9f4.webp`} alt="" /><img src={`${A}UeasMBu07jHUk5ch5onj5OD9f4.webp`} alt="" /></div>
      <div className="d14-cloud-track d14-cloud-track-three" aria-hidden="true"><img src={`${A}0IJJIgu6Wx8qN5wGM26QzcUWTNg.webp`} alt="" /><img src={`${A}0IJJIgu6Wx8qN5wGM26QzcUWTNg.webp`} alt="" /></div>
      <img className="d14-temple" src={`${A}nMi6QUEDQLWoopKcsbxHe7tv3w.webp`} alt="" />
      <div className="d14-hero-copy"><p>|| ॐ श्री गणेशाय नमः ||</p><h1><span>{details.groom}</span><i>weds</i><span>{details.bride}</span></h1><p className="d14-hero-date">{formatDate(details.date)}</p></div>
      <img className="d14-gate" src={`${A}ELOlTg3x5fKABGtAydCmkvEWw.webp`} alt="" />
      <button className="d14-scroll-cue" onClick={() => document.getElementById('d14-invite')?.scrollIntoView({ behavior: 'smooth' })} aria-label="View invitation"><span>Explore</span><b>↓</b></button>
    </section>

    <section id="d14-invite" className="d14-invite">
      <img className="d14-invite-sky" src={`${A}1Zg49ggjH1NeMsuurkKzD6m20vo.webp`} alt="" />
      <img className="d14-invite-gate" src={`${A}B5f8HoBhbFrJjeGqkq0pmPmd2BE.webp`} alt="" />
      <div className="d14-invite-copy d14-reveal">
        <img src={`${A}7Jc7F5U6LjAzdX4ypVkjja74nO8.webp`} alt="Lord Ganesha" />
        <p className="d14-sacred">|| ॐ श्री गणेशाय नमः ||</p><p className="d14-kicker">Together with our families</p><h2>We invite you</h2><p>{details.message}</p>
        <div className="d14-couple-names"><strong>{details.groom}</strong><i>&</i><strong>{details.bride}</strong></div>
        {(details.groomFamily || details.brideFamily) && <div className="d14-families">{details.groomFamily && <p><small>GROOM’S FAMILY</small>{details.groomFamily}</p>}{details.brideFamily && <p><small>BRIDE’S FAMILY</small>{details.brideFamily}</p>}</div>}
      </div>
    </section>

    <section className="d14-river-story">
      <img className="d14-river" src={`${A}7zuZ0FhlmRAIbtHSZLZ5aiTTWg.webp`} alt="" /><div className="d14-river-clouds" aria-hidden="true"><img src={`${A}UeasMBu07jHUk5ch5onj5OD9f4.webp`} alt="" /></div>
      <img className="d14-color-temple" src={`${A}m6r8eopxGbzyLR1bYUq6zvkRnw.webp`} alt="" /><img className="d14-story-arch" src={`${A}PWKoRE4Df4zZJLisykUKiwZnlRE.webp`} alt="" /><img className="d14-story-couple" src={`${A}vQg4boZ9HQXfZOfpCDWS9lFQE.webp`} alt="Illustration of the couple" />
      <div className="d14-story-copy d14-reveal"><p className="d14-kicker">Our beginning</p><h2>A love written<br />in the stars</h2><Ornament /><p>Two hearts, two families, and one promise for a lifetime.</p></div>
    </section>

    <section className="d14-celebrations">
      <header className="d14-section-heading d14-reveal"><p className="d14-kicker">Come celebrate with us</p><h2>Wedding festivities</h2><Ornament /></header>
      <div className="d14-events">{sortedEvents.map((event, index) => <article className="d14-event d14-reveal" key={`${event.title}-${event.date}`}>
        <span className="d14-event-number">{String(index + 1).padStart(2, '0')}</span><p>{formatDate(event.date, { weekday: 'long' })}</p><h3>{event.title}</h3>
        <div className="d14-event-date"><strong>{formatDate(event.date, { day: '2-digit' })}</strong><span>{formatDate(event.date, { month: 'long', year: 'numeric' })}<small>{formatTime(event.time)}</small></span></div>
        <h4>{event.venue}</h4><p className="d14-event-address">{event.address}</p><div className="d14-event-actions"><a href={mapURL(event.venue, event.address, event.map)} target="_blank" rel="noreferrer">Directions <Arrow /></a><button onClick={() => downloadCalendar(event, details.offset, `${details.groom} & ${details.bride}`)}>Save date <span>＋</span></button></div>
      </article>)}</div>
    </section>

    <section className="d14-mehendi"><div className="d14-mehendi-image"><img src={`${A}bh8PHnz8c5jv6tyZFXIIzJ6Fs.webp`} alt="A couple celebrating their mehendi" /></div><div className="d14-mehendi-copy d14-reveal"><p className="d14-kicker">A little colour, a lot of love</p><h2>Mehendi<br />ki raat</h2><Ornament /><p>Join us for an evening of music, laughter, henna, and memories before the wedding day.</p></div></section>

    <section className="d14-memories"><header className="d14-section-heading d14-reveal"><p className="d14-kicker">Our journey</p><h2>Moments we treasure</h2><Ornament /></header><div className="d14-photo-row"><figure className="d14-reveal"><img src={`${A}n1sFMTrwVER1fJuLVUCmes4cE.webp`} alt="A wedding memory" /></figure><figure className="d14-reveal"><img src={`${A}MG9f4rzXDX8WcEBWoCYNl1HII.webp`} alt="A wedding memory" /></figure><figure className="d14-reveal"><img src={`${A}qCM6RcOZsA8So2CKCNItnUCqIWU.webp`} alt="A wedding memory" /></figure></div>{details.gallery && <a className="d14-gallery-link" href={details.gallery} target="_blank" rel="noreferrer">View our gallery <Arrow /></a>}</section>

    <section className="d14-finale"><img className="d14-finale-frame" src={`${A}xGJ7yIwTGEHcDFNWMGoLHiHkQ.webp`} alt="" /><div className="d14-finale-copy d14-reveal"><p className="d14-kicker">Counting down to forever</p><h2>{details.groom} <i>&</i> {details.bride}</h2>{remaining > 0 ? <div className="d14-countdown">{countdown.map((value, index) => <div key={index}><strong>{String(value).padStart(2, '0')}</strong><span>{['Days', 'Hours', 'Minutes', 'Seconds'][index]}</span></div>)}</div> : <p className="d14-arrived">Our forever has begun.</p>}<p className="d14-finale-date">{formatDate(details.date)} · {formatTime(details.time)}</p><p className="d14-finale-venue">{details.venue}<small>{details.address}</small></p><a href={mapURL(details.venue, details.address, details.map)} target="_blank" rel="noreferrer">View location <Arrow /></a>{(details.dressCode || details.giftNote) && <div className="d14-notes">{details.dressCode && <p><small>DRESS CODE</small>{details.dressCode}</p>}{details.giftNote && <p><small>WITH LOVE</small>{details.giftNote}</p>}</div>}</div></section>

    <footer className="d14-footer"><p>We cannot wait to celebrate with you</p><strong>{details.groom} & {details.bride}</strong></footer>
    <button className={`d14-music ${music ? 'd14-music-playing' : ''}`} onClick={toggleMusic} aria-label={music ? 'Pause music' : 'Play music'}><span>{music ? 'Ⅱ' : '♫'}</span><small>{music ? 'Pause' : 'Music'}</small></button>
  </main>
}
