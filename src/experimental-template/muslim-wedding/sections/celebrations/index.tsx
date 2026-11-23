/* Celebrations — one flexible card per event: a CSS panel under a jasmine-and-bell toran, with
   mirrored rose corners, a carved-star date plaque and an event still-life. Cards grow with their text.
   Map and calendar links per event. Animation: toran unrolls, plaque settles, text focus-pulls. */

import { useRef } from "react"
import type { ReactElement } from "react"
import { gsap, useGSAP, reveal, formatDayMonth, formatEventDate, EASE } from '../../core'
import type { CelebrationEvent, SectionPlugin, SectionProps } from '../../core'
import CelebrationsDivider from './Divider'
import toranSrc from '../../assets/generated/celebration-toran.webp'
import cornerSrc from '../../assets/generated/celebration-corner.webp'
import plaqueSrc from '../../assets/generated/date-plaque.webp'
import motifNikah from '../../assets/generated/motif-nikah.webp'
import motifMehndi from '../../assets/generated/motif-mehndi.webp'
import motifWalima from '../../assets/generated/motif-walima.webp'
import { downloadIcs, getGoogleCalendarUrl, getMapLinks } from './links'
import './celebrations.css'

const Icon = {
  pin: <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 15 C3 10 3 7 3 6 a5 5 0 0 1 10 0 c0 1 0 4 -5 9Z" /><circle cx="8" cy="6" r="1.6" /></svg>,
  cal: <svg viewBox="0 0 16 16" aria-hidden="true"><rect x="2" y="3" width="12" height="11" rx="1" /><path d="M2 7 H14 M5 1.5 V4.5 M11 1.5 V4.5" /></svg>,
  down: <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 2 V10 M4.5 7 L8 10.5 L11.5 7 M3 14 H13" /></svg>,
}

/* One generated still-life per event kind: brass fanoos with a rose (nikah), henna cone and bowl (mehndi),
   covered dish with dates (walima). Unknown kinds cycle through the three. */
const MOTIFS = [
  { key: 'nikah', src: motifNikah },
  { key: 'mehndi', src: motifMehndi },
  { key: 'walima', src: motifWalima },
] as const

function motifFor(event: CelebrationEvent, index: number) {
  const id = `${event.id} ${event.title}`.toLowerCase()
  if (/mehend|henna|mehndi|dholak|manjha|sanchaq/.test(id)) return MOTIFS[1]
  if (/nikah|nikaah|akd|ceremony|vows/.test(id)) return MOTIFS[0]
  if (/walima|reception|dinner|feast/.test(id)) return MOTIFS[2]
  return MOTIFS[index % MOTIFS.length]
}

function EventPanel({ event, index, actions }: { event: CelebrationEvent; index: number; actions: ReactElement }) {
  const { day, month } = formatDayMonth(event.date)
  const motif = motifFor(event, index)
  return (
    <article className="mw-event" data-event-id={event.id}>
      <img className="mw-event__toran" src={toranSrc} alt="" loading="lazy" decoding="async" />
      <img className="mw-event__corner mw-event__corner--l" src={cornerSrc} alt="" loading="lazy" decoding="async" />
      <img className="mw-event__corner mw-event__corner--r" src={cornerSrc} alt="" loading="lazy" decoding="async" />
      <img className={`mw-event__motif mw-event__motif--${motif.key}`} src={motif.src} alt="" loading="lazy" decoding="async" />

      <div className="mw-event__plaque" aria-hidden="true">
        <img className="mw-event__plaque-art" src={plaqueSrc} alt="" loading="lazy" decoding="async" />
        <span className="mw-event__day">{day}</span>
        <span className="mw-event__month">{month}</span>
      </div>

      <div className="mw-event__body">
        <h3 className="mw-event__title">{event.title}</h3>
        <p className="mw-event__when">
          {formatEventDate(event.date)}
          <span className="mw-event__sep" aria-hidden="true">·</span>
          {event.time}
        </p>
        <p className="mw-event__venue">{event.venue}</p>
        <p className="mw-event__address">{event.address}</p>
        {event.description ? <p className="mw-event__desc">{event.description}</p> : null}
        {actions}
      </div>
    </article>
  )
}

function Actions({ event, hosts }: { event: CelebrationEvent; hosts: string }) {
  const maps = getMapLinks(event)
  return (
    <div className="mw-actions">
      <a className="mw-pill" href={maps.google} target="_blank" rel="noopener noreferrer">
        {Icon.pin} Map
      </a>
      <a className="mw-pill" href={maps.apple} target="_blank" rel="noopener noreferrer">
        {Icon.pin} Apple Maps
      </a>
      <a className="mw-pill" href={getGoogleCalendarUrl(event, hosts)} target="_blank" rel="noopener noreferrer">
        {Icon.cal} Calendar
      </a>
      <button type="button" className="mw-pill" onClick={() => downloadIcs(event, hosts)}>
        {Icon.down} .ics
      </button>
    </div>
  )
}

function Celebrations({ data, ctx }: SectionProps) {
  const ref = useRef<HTMLElement>(null)
  const hosts = `${data.couple.groomName} & ${data.couple.brideName}`

  useGSAP(
    () => {
      if (ctx.reducedMotion) return
      reveal('.mw-celebrations__head > *', { trigger: '.mw-celebrations__head', stagger: 0.12 })

      gsap.utils.toArray<HTMLElement>('.mw-event').forEach((card) => {
        const st = { trigger: card, start: 'top 82%', once: true }
        gsap.from(card, { opacity: 0, scale: 0.97, duration: 1.1, ease: EASE.expo, scrollTrigger: st })
        gsap.from(card.querySelector('.mw-event__toran'), {
          clipPath: 'inset(0 50% 0 50%)',
          opacity: 0,
          duration: 1.4,
          delay: 0.15,
          ease: EASE.expo,
          clearProps: 'clipPath',
          scrollTrigger: st,
        })
        gsap.from(card.querySelectorAll('.mw-event__corner'), {
          opacity: 0,
          filter: 'blur(8px)',
          duration: 1.2,
          delay: 0.5,
          stagger: 0.15,
          ease: EASE.out,
          clearProps: 'filter',
          scrollTrigger: st,
        })
        gsap.from(card.querySelector('.mw-event__plaque'), { opacity: 0, scale: 0.8, filter: 'blur(8px)', duration: 1.3, delay: 0.4, ease: EASE.expo, clearProps: 'filter', scrollTrigger: st })
        gsap.from(card.querySelector('.mw-event__motif'), { opacity: 0, filter: 'blur(8px)', scale: 0.92, duration: 1.4, delay: 0.9, ease: EASE.out, clearProps: 'filter', scrollTrigger: st })
        gsap.from(card.querySelector('.mw-event__body')!.children, {
          opacity: 0,
          filter: 'blur(6px)',
          duration: 0.9,
          stagger: 0.08,
          delay: 0.55,
          ease: EASE.out,
          clearProps: 'filter',
          scrollTrigger: st,
        })
      })
    },
    { scope: ref, dependencies: [ctx.reducedMotion, data.celebrations.length] },
  )

  return (
    <section ref={ref} className="mw-section mw-celebrations" aria-label="Celebrations">
      <div className="mw-celebrations__head">
        <p className="mw-eyebrow">The celebrations</p>
        <h2 className="mw-title">Join us for every moment</h2>
      </div>
      <div className="mw-events">
        {data.celebrations.map((event, i) => (
          <EventPanel key={event.id} event={event} index={i} actions={<Actions event={event} hosts={hosts} />} />
        ))}
      </div>
    </section>
  )
}

const plugin: SectionPlugin = {
  id: 'celebrations',
  Component: Celebrations,
  particles: [
    { sprite: 'rosepetal', motion: 'fall', count: 6, size: [12, 18], opacity: [0.45, 0.8], zone: 'margins', color: 'blush' },
    { sprite: 'mogra', motion: 'fall', count: 4, size: [9, 14], opacity: [0.5, 0.85], zone: 'margins', color: 'goldBright' },
    { sprite: 'attar', motion: 'rise', count: 3, size: [7, 10], opacity: [0.25, 0.5], zone: 'margins', color: 'rose' },
  ],
  Divider: CelebrationsDivider,
}

export default plugin
