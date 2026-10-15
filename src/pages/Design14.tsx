import { useEffect, useState } from 'react'
import { useInvitationDetails } from '../invitations/context'
import { formatDate, formatTime, mapURL, type InvitationData } from '../invitations/model'
import './Design14.css'

const demo: InvitationData = { template: 14, groom: 'Krishna', bride: 'Radha', date: '2026-12-20', time: '11:00', offset: '+05:30', venue: 'TMA Pai Convention Centre', address: 'Mangalore, Karnataka', map: 'https://maps.app.goo.gl/1xf3k59k9QEaoQ717', message: 'With the blessings of our families, we invite you to celebrate the beginning of our forever.', groomFamily: '', brideFamily: '', dressCode: '', giftNote: '', music: '', gallery: '', events: [{ title: 'Wedding Ceremony', date: '2026-12-20', time: '11:00', venue: 'TMA Pai Convention Centre', address: 'Mangalore, Karnataka', map: 'https://maps.app.goo.gl/1xf3k59k9QEaoQ717' }] }
const asset = (name: string) => `/design14/assets/${name}`

export default function Design14() {
  const details = useInvitationDetails() || demo
  const [opened, setOpened] = useState(false)
  useEffect(() => { const previousTitle = document.title; document.title = `${details.groom} & ${details.bride} — Wedding Invitation`; return () => { document.title = previousTitle } }, [details.groom, details.bride])
  return <main className="d14-page">
    <section className="d14-hero">
      <img className="d14-sky" src={asset('1Zg49ggjH1NeMsuurkKzD6m20vo.webp')} alt="" />
      <img className="d14-temple" src={asset('nMi6QUEDQLWoopKcsbxHe7tv3w.webp')} alt="" />
      <img className="d14-gate" src={asset('ELOlTg3x5fKABGtAydCmkvEWw.webp')} alt="" />
      <div className="d14-hero-shade" />
      <div className="d14-hero-copy"><p>WITH THE BLESSINGS OF OUR FAMILIES</p><span className="d14-symbol">ॐ</span><h1><span>{details.groom}</span><i>weds</i><span>{details.bride}</span></h1><p className="d14-date">{formatDate(details.date, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p></div>
      {!opened && <button className="d14-open" onClick={() => setOpened(true)}><small>YOU ARE INVITED TO</small><strong>OPEN</strong><span>✦</span></button>}
      {opened && <button className="d14-scroll" onClick={() => document.getElementById('d14-details')?.scrollIntoView({ behavior: 'smooth' })}>Explore <span>↓</span></button>}
    </section>
    {opened && <div id="d14-details" className="d14-details">
      <section className="d14-intro"><p className="d14-eyebrow">THE CELEBRATION OF LOVE</p><h2>A sacred beginning<br /><em>made together.</em></h2><div className="d14-rule">✦</div><p>{details.message}</p><p>We would be honoured by your presence and blessings as we begin our journey together.</p></section>
      <section className="d14-date-card"><p className="d14-eyebrow">SAVE THE DATE</p><div className="d14-calendar"><span>{formatDate(details.date, { month: 'short' })}</span><strong>{formatDate(details.date, { day: '2-digit' })}</strong><span>{formatDate(details.date, { year: 'numeric' })}</span></div><p>{formatDate(details.date, { weekday: 'long' })} · {formatTime(details.time)}</p></section>
      <section className="d14-events"><p className="d14-eyebrow">JOIN US</p><h2>Wedding celebrations</h2>{details.events.map((event, index) => <article className="d14-event" key={`${event.title}-${index}`}><span className="d14-event-number">0{index + 1}</span><h3>{event.title}</h3><p>{formatDate(event.date, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}<br />{formatTime(event.time)}</p><p className="d14-venue">{event.venue}<br /><small>{event.address}</small></p><a href={mapURL(event.venue, event.address, event.map)} target="_blank" rel="noreferrer">Get directions ↗</a></article>)}</section>
      <footer className="d14-footer"><span>✦</span><h2>{details.groom} <i>&</i> {details.bride}</h2><p>We look forward to celebrating with you.</p></footer>
    </div>}
  </main>
}
