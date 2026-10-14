import PersonalMusic from '../invitations/PersonalMusic'
import PersonalNotes from '../invitations/PersonalNotes'
import '../invitations/personalized.css'
import { useEffect, useRef, useState } from 'react'
import './Design2.css'
import './MohadRahma.css'
import HeartDateReveal from './HeartDateReveal'
import FlowerTrail from './FlowerTrail'
import { useInvitationDetails } from '../invitations/context'
import { formatDate, formatTime, mapURL, weddingISO } from '../invitations/model'
import { downloadCalendar } from '../invitations/calendar'
import InvitationLayoutEditor from './InvitationLayoutEditor'

const ASSETS = '/images/royal-grace/'
const eventDate = new Date('2026-12-20T11:00:00+05:30')
const SOURCE = 'https://mohad-rahma-wedding.fly.dev'
const defaultEvents = [
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
  const details = useInvitationDetails()
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => { const id = window.setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(id) }, [])
  const diff = Math.max(0, (details ? new Date(weddingISO(details)).getTime() : eventDate.getTime()) - now)
  if (!diff) return <p className="rg-script rg-celebrate">A day to remember, a love forever.</p>
  const values = [Math.floor(diff / 86400000), Math.floor(diff / 3600000) % 24, Math.floor(diff / 60000) % 60, Math.floor(diff / 1000) % 60]
  return <div className="rg-countdown">{values.map((v, i) => <div key={i}><strong>{String(v).padStart(2, '0')}</strong><small>{['Days', 'Hours', 'Minutes', 'Seconds'][i]}</small></div>)}</div>
}

export default function MohadRahma() {
  const details = useInvitationDetails()
  const groom = details?.groom || 'Mohad'
  const bride = details?.bride || 'Rahma'
  const couple = `${groom} & ${bride}`
  const events = details ? [...details.events].sort((a,b)=>`${a.date}T${a.time}`.localeCompare(`${b.date}T${b.time}`)).map((event,index)=>({
    id: event.title === 'Nikah & Wedding' ? 'nikah' : `event-${index}`,
    title:event.title,date:formatDate(event.date,{weekday:'long',month:'long',day:'numeric'}),
    iso:`${event.date}T${event.time}:00${details.offset}`,time:formatTime(event.time),venue:event.venue,address:event.address,map:mapURL(event.venue,event.address===event.venue?'':event.address,event.map),
  })) : defaultEvents
  const video = useRef<HTMLVideoElement>(null)
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const [opened, setOpened] = useState(false)
  const [namesVisible, setNamesVisible] = useState(false)
  const [videoFailed, setVideoFailed] = useState(false)
  const [videoFrameReady, setVideoFrameReady] = useState(false)

  useEffect(() => {
    const previousTitle = document.title
    document.title = `${couple} — Our Wedding`
    return () => { clearTimeout(timer.current); document.title = previousTitle }
  }, [couple])

  useEffect(() => {
    if (!opened || !('IntersectionObserver' in window)) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    if (new URLSearchParams(window.location.search).get('edit') === '1') return
    const paper = document.getElementById('rg-welcome')
    if (!paper) return
    const elements = paper.querySelectorAll<HTMLElement>([
      '.rg-section > h2', '.rg-section > p', '.rg-signature',
      '.rg-countdown', '.mr-celebration-heading > h2',
      '.mr-celebration-heading > p', '[data-layout-id]',
      '.mr-celebration-close > p', '.mr-gallery > a', '.rg-ending > *',
    ].join(','))
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return
        entry.target.classList.add('mr-scroll-visible')
        observer.unobserve(entry.target)
      })
    }, { threshold: 0.12, rootMargin: '0px 0px -20px 0px' })
    elements.forEach((element, index) => {
      element.style.setProperty('--mr-reveal-delay', `${(index % 3) * 60}ms`)
      element.classList.add('mr-scroll-reveal')
      observer.observe(element)
    })
    return () => {
      observer.disconnect()
      elements.forEach(element => {
        element.classList.remove('mr-scroll-reveal', 'mr-scroll-visible')
        element.style.removeProperty('--mr-reveal-delay')
      })
    }
  }, [opened])

  function openInvitation() {
    if (opened) return
    setOpened(true)
    if (videoFailed || window.matchMedia('(prefers-reduced-motion: reduce)').matches) { setNamesVisible(true); return }
    video.current?.play().catch(() => { setVideoFailed(true); setNamesVisible(true) })
    timer.current = setTimeout(() => setNamesVisible(true), 6000)
  }

  return <main className="royal-grace mohad-rahma">
    <FlowerTrail />
    <PersonalMusic src={details?.music || "/bisara.mp3"} />
    <section className={`rg-hero ${namesVisible ? 'rg-is-open' : ''}`} style={!namesVisible ? { backgroundImage: `url('${ASSETS}opening-poster.jpg')` } : undefined} aria-label="Wedding invitation">
      {!videoFailed && <video ref={video} src={`${ASSETS}opening.mp4`} poster={`${ASSETS}opening-poster.jpg`} muted playsInline preload="auto" onPlaying={event => {
        const player = event.currentTarget
        if (typeof player.requestVideoFrameCallback === 'function') {
          player.requestVideoFrameCallback(() => setVideoFrameReady(true))
        } else {
          requestAnimationFrame(() => requestAnimationFrame(() => setVideoFrameReady(true)))
        }
      }} onError={() => { setVideoFailed(true); if (opened) setNamesVisible(true) }} onEnded={() => setNamesVisible(true)} />}
      <img className={`mr-opening-poster ${videoFrameReady || namesVisible ? 'mr-opening-poster-hidden' : ''}`} src={`${ASSETS}opening-poster.jpg`} alt="" aria-hidden="true" fetchPriority="high" />
      <div className="rg-hero-shade" />
      {!opened && <button className="rg-open" onClick={openInvitation} aria-label="Open your invitation" />}
      <div className="rg-names" aria-hidden={!namesVisible}>
        <span className="rg-heart">♥</span><p className="rg-script">We’re getting married</p><Divider />
        <h1><span>{groom}</span><i>&</i><span>{bride}</span></h1>
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
        <p>{details?.message || "With the blessings of Allah and the love of our families, we invite you to celebrate the beginning of our forever."}</p>
        <p>Your presence, your prayers, and your love will make our day complete.</p>
        <Divider />
        <span className="rg-signature rg-script">{couple}</span>
      </section>
      <section className="rg-section"><h2 className="rg-script">Save our date</h2><HeartDateReveal date={details ? formatDate(details.date) : "20 December 2026"} day={details ? formatDate(details.date,{weekday:"long"}) : "Sunday"} time={details ? formatTime(details.time) : "11:00 in the morning"} /></section>
      <section className="rg-section"><Divider /><p className="rg-eyebrow">Counting down to Nikah & Wedding</p><h2 className="rg-script">Until our forever</h2><Countdown /><Divider /></section>
      <section className="rg-section mr-celebrations" aria-labelledby="mr-celebrations-title">
        <div className="mr-celebration-heading"><CelebrationBotanical className="mr-heading-flower"/><p className="rg-eyebrow">Together, in celebration</p><h2 id="mr-celebrations-title" className="rg-script">Moments that<br/>become memories</h2><p className="mr-intro">{details ? `${events.length} celebrations. One beautiful beginning.` : "Five gatherings. One beautiful beginning."}</p><Divider /><p className="mr-year">{details ? formatDate(details.date,{month:"long",year:"numeric"}) : "December 2026"} <span>✧</span> All times in {details ? `UTC${details.offset}` : "IST"}</p></div>
        <div className="mr-celebration-body">
        <InvitationLayoutEditor><div className="mr-events">{events.map(event => <article className={`mr-event ${event.id === 'nikah' ? 'mr-main-event' : ''}`} key={event.id} aria-labelledby={`mr-title-${event.id}`}>
          <div className="mr-event-paper">
          <img className="mr-stationery-art" src={`${ASSETS}${event.id === 'nikah' ? 'sage-stationery-unframed.png' : 'ivory-stationery-unframed.png'}`} alt="" aria-hidden="true" loading="lazy"/>
          <div className="mr-event-heading">
            <div className="mr-title-column"><h3 data-layout-id={`${event.id}:title`} id={`mr-title-${event.id}`} className="rg-script">{event.title.split(' — ')[0]}</h3></div>
            <time data-layout-id={`${event.id}:date`} dateTime={event.iso} className="mr-event-date"><strong>{event.iso.slice(8,10)}</strong><span>{formatDate(event.iso.slice(0,10),{month:"long"})}<small>{event.iso.slice(0,4)}</small></span></time>
            <p data-layout-id={`${event.id}:weekday`} className="mr-weekday">{event.date.split(',')[0]}</p>
            <p data-layout-id={`${event.id}:time`} className="mr-time">{event.time}<span>{details ? `UTC${details.offset}` : "IST"}</span></p>
          </div>
          <div className="mr-venue-row"><h4 data-layout-id={`${event.id}:venue`}>{event.venue}</h4>{event.address!==event.venue&&<p data-layout-id={`${event.id}:address`} className="mr-address">{event.address}</p>}</div>
          <div className="mr-actions"><a data-layout-id={`${event.id}:directions`} className="mr-directions" href={event.map} target="_blank" rel="noreferrer" aria-label={`Directions to ${event.venue}`}>Directions <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ flexShrink: 0 }}><path d="M6 18 18 6M6 6h12v12" /></svg></a><a data-layout-id={`${event.id}:calendar`} className="mr-calendar" onClick={e=>{if(details){e.preventDefault();downloadCalendar({title:event.title,date:event.iso.slice(0,10),time:event.iso.slice(11,16),venue:event.venue,address:event.address,map:event.map},details.offset,couple)}}} href={`${SOURCE}/events/${event.id}/calendar`} target="_blank" rel="noreferrer" aria-label={`Add ${event.title} to calendar`}>Save the date <span>+</span></a></div>
          </div>
        </article>)}</div></InvitationLayoutEditor>
        <div className="mr-celebration-close"><span aria-hidden="true">♡</span><p className="rg-script">Every celebration is sweeter with you.</p></div>
        </div>
      </section>
      {!details && <section className="rg-section mr-gallery"><Divider /><p className="rg-eyebrow">Captured with love</p><h2 className="rg-script">Every moment, held close.</h2><p>Visit the gallery as the celebration unfolds and relive the memories with us.</p><a className="rg-button" href={`${SOURCE}/gallery`} target="_blank" rel="noreferrer">Explore the gallery ↗</a><Divider /></section>}
      <PersonalNotes/>
      <footer className="rg-ending"><p className="rg-eyebrow">Made with love for our family and friends</p><h2 className="rg-script">Forever & ever</h2><Divider /><span className="rg-script">{couple}</span><p className="rg-eyebrow">{details ? formatDate(details.date) : "20 · 12 · 26"}</p></footer>
    </div>}
  </main>
}
