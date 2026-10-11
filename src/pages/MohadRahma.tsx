import { useEffect, useRef, useState } from 'react'
import './Design2.css'
import './MohadRahma.css'
import HeartDateReveal from './HeartDateReveal'
import FlowerTrail from './FlowerTrail'

const ASSETS = '/images/royal-grace/'
const eventDate = new Date('2026-12-20T11:00:00+05:30')
const SOURCE = 'https://mohad-rahma-wedding.fly.dev'
const events = [
  { id: 'mehendi-programme', title: 'Mehendi Programme', date: 'Thursday, December 17', iso: '2026-12-17T11:00:00+05:30', time: '11:00 AM', venue: 'Silvergate Homestay', address: 'Chikmagaluru', map: 'https://maps.app.goo.gl/uaSHaAyVXCriCCrw5' },
  { id: 'mehendi-mehfil', title: 'Mehendi Mehfil', date: 'Saturday, December 19', iso: '2026-12-19T17:00:00+05:30', time: '5:00 PM', venue: 'Royal Garden Beach Resort', address: 'Ullal, Mangalore', map: 'https://maps.app.goo.gl/43ui6W3Hn6N2cbui8' },
  { id: 'nikah', title: 'Nikah & Wedding', date: 'Sunday, December 20', iso: '2026-12-20T11:00:00+05:30', time: '11:00 AM', venue: 'TMA Pai Convention Centre', address: 'Mangalore', map: 'https://maps.app.goo.gl/1xf3k59k9QEaoQ717' },
  { id: 'wedding-reception', title: 'Wedding Reception', date: 'Monday, December 21', iso: '2026-12-21T19:00:00+05:30', time: '7:00 PM', venue: 'Shoolin Palace', address: 'Airport Road, Mangalore', map: 'https://maps.app.goo.gl/ARcdN5shsLC5og2f8' },
  { id: 'brides-reception-chikmagaluru', title: 'Bride’s Reception — Chikmagaluru', date: 'Thursday, December 24', iso: '2026-12-24T11:00:00+05:30', time: '11:00 AM', venue: 'Heritage Convention Hall', address: 'Chikmagaluru', map: 'https://maps.app.goo.gl/NbvAqoYtcacD5Xas6' },
]

function Divider() { return <div className="rg-divider" aria-hidden="true"><span />✧<span /></div> }

function CelebrationBotanical({ className = '' }: { className?: string }) {
  return <img className={className} src={`${ASSETS}celebration-roses.png`} alt="" aria-hidden="true" loading="lazy" />
}

function Countdown() {
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => { const id = window.setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(id) }, [])
  const diff = Math.max(0, eventDate.getTime() - now)
  if (!diff) return <p className="rg-script rg-celebrate">A day to remember, a love forever.</p>
  const values = [Math.floor(diff / 86400000), Math.floor(diff / 3600000) % 24, Math.floor(diff / 60000) % 60, Math.floor(diff / 1000) % 60]
  return <div className="rg-countdown">{values.map((v, i) => <div key={i}><strong>{String(v).padStart(2, '0')}</strong><small>{['Days', 'Hours', 'Minutes', 'Seconds'][i]}</small></div>)}</div>
}

export default function MohadRahma() {
  const video = useRef<HTMLVideoElement>(null)
  const audio = useRef<HTMLAudioElement>(null)
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const [opened, setOpened] = useState(false)
  const [namesVisible, setNamesVisible] = useState(false)
  const [videoFailed, setVideoFailed] = useState(false)

  useEffect(() => {
    const previousTitle = document.title
    document.title = 'Mohad & Rahma — Our Wedding'
    return () => { clearTimeout(timer.current); document.title = previousTitle }
  }, [])

  function playMusic() {
    const player = audio.current
    if (!player) return
    player.volume = 0.4
    void player.play().catch(() => {})
  }

  function openInvitation() {
    if (opened) return
    setOpened(true)
    playMusic()
    if (videoFailed || window.matchMedia('(prefers-reduced-motion: reduce)').matches) { setNamesVisible(true); return }
    video.current?.play().catch(() => { setVideoFailed(true); setNamesVisible(true) })
    timer.current = setTimeout(() => setNamesVisible(true), 6000)
  }

  return <main className="royal-grace mohad-rahma">
    <FlowerTrail />
    <audio ref={audio} src="/bisara.mp3" loop preload="auto" />
    <section className={`rg-hero ${namesVisible ? 'rg-is-open' : ''}`} aria-label="Wedding invitation">
      {!videoFailed && <video ref={video} src={`${ASSETS}opening.mp4`} muted playsInline preload="auto" onError={() => { setVideoFailed(true); if (opened) setNamesVisible(true) }} onEnded={() => setNamesVisible(true)} />}
      <div className="rg-hero-shade" />
      {!opened && <button className="rg-open" onClick={openInvitation} aria-label="Open your invitation" />}
      <div className="rg-names" aria-hidden={!namesVisible}>
        <span className="rg-heart">♥</span><p className="rg-script">We’re getting married</p><Divider />
        <h1><span>Mohad</span><i>&</i><span>Rahma</span></h1>
        <p className="rg-eyebrow">Together, with our families</p>
      </div>
      {namesVisible && <a className="rg-scroll" href="#rg-welcome" onClick={e => {
        e.preventDefault()
        document.getElementById('rg-welcome')?.scrollIntoView({
          behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth',
          block: 'start',
        })
      }}>SCROLL TO DISCOVER<span>⌄</span></a>}
    </section>

    {opened && <div className="rg-paper" id="rg-welcome">
      <section className="rg-section rg-welcome">
        <p className="rg-eyebrow">An invitation from the heart</p>
        <Divider />
        <h2 className="rg-script">Two souls. One beautiful journey.</h2>
        <p>With the blessings of Allah and the love of our families, we invite you to celebrate the beginning of our forever.</p>
        <p>Your presence, your prayers, and your love will make our day complete.</p>
        <Divider />
        <span className="rg-signature rg-script">Mohad &amp; Rahma</span>
      </section>
      <section className="rg-section"><h2 className="rg-script">Save our date</h2><HeartDateReveal date="20 December 2026" day="Sunday" time="11:00 in the morning" /></section>
      <section className="rg-section"><Divider /><p className="rg-eyebrow">Counting down to Nikah & Wedding</p><h2 className="rg-script">Until our forever</h2><Countdown /><Divider /></section>
      <section className="rg-section mr-celebrations" aria-labelledby="mr-celebrations-title">
        <div className="mr-celebration-heading"><CelebrationBotanical className="mr-heading-flower"/><p className="rg-eyebrow">Together, in celebration</p><h2 id="mr-celebrations-title" className="rg-script">Moments that<br/>become memories</h2><p className="mr-intro">Five gatherings. One beautiful beginning.</p><Divider /><p className="mr-year">December 2026 <span>✧</span> All times in IST</p></div>
        <div className="mr-celebration-body">
        <div className="mr-events">{events.map(event => <article className={`mr-event ${event.id === 'nikah' ? 'mr-main-event' : ''}`} key={event.id} aria-labelledby={`mr-title-${event.id}`}>
          <img className="mr-stationery-art" src={`${ASSETS}${event.id === 'nikah' ? 'sage-stationery-unframed.png' : 'ivory-stationery-unframed.png'}`} alt="" aria-hidden="true" loading="lazy"/><div className="mr-stationery-heading">M <span>&</span> R</div>
          <div className="mr-event-heading">
            <div className="mr-title-column"><h3 id={`mr-title-${event.id}`} className="rg-script">{event.title.split(' — ')[0]}</h3></div>
            <p className="mr-weekday">{event.date.split(',')[0]}</p>
            <time dateTime={event.iso} className="mr-date-column"><span>DEC</span><strong>{event.iso.slice(8,10)}</strong><small>2026</small></time>
            <p className="mr-time">{event.time}<span>IST</span></p>
          </div>
          <div className="mr-venue-row"><h4>{event.venue}</h4><p className="mr-address">{event.address}</p></div>
          {event.id === 'nikah' && <p className="mr-nikah-label">Two hearts. One beautiful beginning.</p>}
          <div className="mr-actions"><a className="mr-directions" href={event.map} target="_blank" rel="noreferrer" aria-label={`Directions to ${event.venue}`}>Directions <span>↗</span></a><a className="mr-calendar" href={`${SOURCE}/events/${event.id}/calendar`} target="_blank" rel="noreferrer" aria-label={`Add ${event.title} to calendar`}>Save the date <span>+</span></a></div>
        </article>)}</div>
        <div className="mr-celebration-close"><span aria-hidden="true">♡</span><p className="rg-script">Every celebration is sweeter with you.</p></div>
        </div>
      </section>
      <section className="rg-section mr-gallery"><Divider /><p className="rg-eyebrow">Captured with love</p><h2 className="rg-script">Every moment, held close.</h2><p>Visit the gallery as the celebration unfolds and relive the memories with us.</p><a className="rg-button" href={`${SOURCE}/gallery`} target="_blank" rel="noreferrer">Explore the gallery ↗</a><Divider /></section>
      <footer className="rg-ending"><p className="rg-eyebrow">Made with love for our family and friends</p><h2 className="rg-script">Forever & ever</h2><Divider /><span className="rg-script">Mohad & Rahma</span><p className="rg-eyebrow">20 · 12 · 26</p></footer>
    </div>}
  </main>
}
