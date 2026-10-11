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
  return <svg className={className} viewBox="0 0 160 230" fill="none" aria-hidden="true"><g stroke="currentColor" strokeWidth="1"><path d="M18 221C94 157 54 84 143 13M62 163 22 117M76 133l57-35M92 84 60 40M65 159l64 28"/>{[[37,198,-35],[54,177,40],[64,148,-40],[72,121,38],[84,96,-28],[102,66,35],[121,37,-25],[43,143,-36],[104,116,48],[101,178,62]].map(([x,y,r],i)=><path key={i} transform={`translate(${x} ${y}) rotate(${r})`} d="M0 0Q-24-16-12-37Q7-26 0 0ZM0 0-12-32" fill="currentColor" fillOpacity={i%2?'.16':'.27'}/>)}</g>{[[140,16],[59,40],[21,117],[134,96],[129,187]].map(([x,y],i)=><g key={i} transform={`translate(${x} ${y})`}>{[0,72,144,216,288].map(r=><ellipse key={r} cx="0" cy="-7" rx="4.5" ry="8" transform={`rotate(${r})`} fill="var(--mr-petal, #f9f1d9)" stroke="currentColor" strokeWidth=".5"/>)}<circle r="2.6" fill="#b7a374"/></g>)}</svg>
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
      <section className="rg-section rg-welcome"><p className="rg-eyebrow">Together with their families</p><Divider /><h2 className="rg-script">Our wedding celebration</h2><p>We cannot wait to celebrate this chapter with the people who mean the most to us.</p><Divider /><span className="rg-signature rg-script">Mohad & Rahma</span><p className="rg-eyebrow">Our wedding day · Sunday, December 20</p></section>
      <section className="rg-section"><p className="rg-eyebrow">Save the moments</p><h2 className="rg-script">Save our date</h2><HeartDateReveal date="20 December 2026" day="Sunday" time="11:00 in the morning" /></section>
      <section className="rg-section"><Divider /><p className="rg-eyebrow">Counting down to Nikah & Wedding</p><h2 className="rg-script">Until our forever</h2><Countdown /><Divider /></section>
      <section className="rg-section mr-celebrations" aria-labelledby="mr-celebrations-title">
        <div className="mr-celebration-heading"><CelebrationBotanical className="mr-heading-flower"/><p className="rg-eyebrow">Together, in celebration</p><h2 id="mr-celebrations-title" className="rg-script">Moments that<br/>become memories</h2><p className="mr-intro">Five gatherings. One beautiful beginning.</p><Divider /><p className="mr-year">December 2026 <span>✧</span> All times in IST</p></div>
        <div className="mr-events">{events.map((event, index) => <article className={`mr-event ${event.id === 'nikah' ? 'mr-main-event' : ''}`} key={event.id} aria-labelledby={`mr-title-${event.id}`}>
          <div className="mr-date-seal" aria-hidden="true"><span>DEC</span><strong>{event.iso.slice(8,10)}</strong><span>2026</span></div>
          <div className="mr-event-paper"><CelebrationBotanical className="mr-card-flower mr-card-flower-left"/><CelebrationBotanical className="mr-card-flower mr-card-flower-right"/>
            <div className="mr-event-content"><p className="mr-day">{event.date.split(',')[0]} <span>·</span> {event.time}</p>
            {event.id === 'nikah' && <p className="mr-nikah-label">The heart of our celebration</p>}
            <h3 id={`mr-title-${event.id}`} className="rg-script">{event.title.split(' — ')[0]}</h3>
            <time className="mr-full-date" dateTime={event.iso}>{event.date}, 2026 · {event.time}</time>
            <div className="mr-ornament" aria-hidden="true"><span/>❧<span/></div>
            <h4>{event.venue}</h4><p className="mr-address">{event.address}</p>
            <div className="mr-actions"><a className="mr-directions" href={event.map} target="_blank" rel="noreferrer" aria-label={`Directions to ${event.venue}`}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden="true"><path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/></svg>Find your way <span>↗</span></a><a className="mr-calendar" href={`${SOURCE}/events/${event.id}/calendar`} target="_blank" rel="noreferrer" aria-label={`Add ${event.title} to calendar`}>Save the date <span>+</span></a></div>
            <span className="mr-chapter" aria-hidden="true">{String(index + 1).padStart(2, '0')} <i>of</i> 05</span></div>
          </div>
        </article>)}</div>
        <div className="mr-celebration-close"><span aria-hidden="true">♡</span><p className="rg-script">Every celebration is sweeter with you.</p></div>
      </section>
      <section className="rg-section mr-gallery"><Divider /><p className="rg-eyebrow">Captured with love</p><h2 className="rg-script">Every moment, held close.</h2><p>Visit the gallery as the celebration unfolds and relive the memories with us.</p><a className="rg-button" href={`${SOURCE}/gallery`} target="_blank" rel="noreferrer">Explore the gallery ↗</a><Divider /></section>
      <footer className="rg-ending"><p className="rg-eyebrow">Made with love for our family and friends</p><h2 className="rg-script">Forever & ever</h2><Divider /><span className="rg-script">Mohad & Rahma</span><p className="rg-eyebrow">20 · 12 · 26</p></footer>
    </div>}
  </main>
}
