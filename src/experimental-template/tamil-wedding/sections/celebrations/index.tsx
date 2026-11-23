/* Celebrations — a pulli-kolam timeline of Tamil wedding events. Each event gets a gopuram-tier date
   plaque, a Kanchi-korvai card under a mavilai toran, and a small motif drawn for that event, plus map
   and calendar actions. Works for any number of events. Animation: the dotted line grows with the
   scroll; each plaque, toran and bloom settles in on its own. */

import { useRef } from 'react'
import { gsap, useGSAP, reveal, formatDayMonth, formatEventDate, EASE } from '../../core'
import type { CelebrationEvent, SectionPlugin, SectionProps } from '../../core'
import CelebrationsDivider from './Divider'
import { downloadIcs, getGoogleCalendarUrl, getMapLinks } from './links'
import toran from '../../assets/generated/event-toran.webp'
import bloom from '../../assets/generated/event-corner.webp'
import './celebrations.css'

const Icon = {
  pin: <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 15 C3 10 3 7 3 6 a5 5 0 0 1 10 0 c0 1 0 4 -5 9Z" /><circle cx="8" cy="6" r="1.6" /></svg>,
  cal: <svg viewBox="0 0 16 16" aria-hidden="true"><rect x="2" y="3" width="12" height="11" rx="1" /><path d="M2 7 H14 M5 1.5 V4.5 M11 1.5 V4.5" /></svg>,
  down: <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 2 V10 M4.5 7 L8 10.5 L11.5 7 M3 14 H13" /></svg>,
}

type MotifKind = 'thamboolam' | 'nadaswaram' | 'vilakku' | 'kumbham' | 'lotus'

/** Pick a motif from the event's id/title so renamed or added events still get a sensible one. */
function motifFor(event: CelebrationEvent): MotifKind {
  const key = `${event.id} ${event.title}`.toLowerCase()
  if (/(nichaya|nishchay|engagement|betrothal|thamboolam|betel)/.test(key)) return 'thamboolam'
  if (/(muhurtham|muhurtam|wedding|thirumanam|kalyanam|thaali|mangalya|vivah)/.test(key)) return 'nadaswaram'
  if (/(mappillai|azhaippu|reception|varaverpu|welcome|dinner|vratham)/.test(key)) return 'vilakku'
  if (/(nalangu|pandhakaal|sumangali|puja|pooja|prayer|ganapathi)/.test(key)) return 'kumbham'
  return 'lotus'
}

/** Small hand-drawn motifs, one per event. 32x32, stroke only. */
function Motif({ kind }: { kind: MotifKind }) {
  switch (kind) {
    case 'thamboolam': // tray with a coconut and a betel leaf
      return (
        <svg viewBox="0 0 32 32" aria-hidden="true">
          <path d="M3 21 H29 C28 27 22 30 16 30 C10 30 4 27 3 21Z" />
          <circle cx="11" cy="15" r="5" />
          <path d="M8.5 13.5 V13.6 M12.5 12.8 V12.9 M10.5 16.8 V16.9" strokeWidth="1.6" />
          <path d="M19 20 C19 13 23 9 28 9 C28 15 24 19 19 20Z" />
          <path d="M28 9 L21 18" />
        </svg>
      )
    case 'nadaswaram': // long double-reed pipe with a flared bell
      return (
        <svg viewBox="0 0 32 32" aria-hidden="true">
          <path d="M6 3 L10 2 L26 22" />
          <path d="M4 6 L8 6.5 L24 26" />
          <path d="M24 26 C21 31 30 32 30 25 L26 22" />
          <path d="M5 4.5 L9 4.2" />
          <path d="M13 9.5 V9.6 M16 13.2 V13.3 M19 17 V17.1" strokeWidth="1.8" />
        </svg>
      )
    case 'vilakku': // kuthuvilakku: flame, oil bowl, shaft, base
      return (
        <svg viewBox="0 0 32 32" aria-hidden="true">
          <path d="M16 1 C19 5 19 8 16 10 C13 8 13 5 16 1Z" />
          <path d="M7 14 H25 C24 18 20 19 16 19 C12 19 8 18 7 14Z" />
          <path d="M16 19 V25 M12 25 H20" />
          <path d="M9 30 H23 C23 27 20 25 20 25 H12 C12 25 9 27 9 30Z" />
        </svg>
      )
    case 'kumbham': // purna kumbham: pot, mango leaves, coconut
      return (
        <svg viewBox="0 0 32 32" aria-hidden="true">
          <path d="M10 16 C7 20 9 27 14 29 H18 C23 27 25 20 22 16Z" />
          <path d="M11.5 16 C12 14.5 20 14.5 20.5 16" />
          <circle cx="16" cy="9" r="3.2" />
          <path d="M16 12 C11 11 8 8 7 4 M16 12 C21 11 24 8 25 4" />
          <path d="M11 22 H21" />
        </svg>
      )
    default: // thamarai, the pink lotus
      return (
        <svg viewBox="0 0 32 32" aria-hidden="true">
          <path d="M16 4 C11 10 11 18 16 24 C21 18 21 10 16 4Z" />
          <path d="M16 24 C9 23 4 18 3 11 C10 11 15 16 16 24Z" />
          <path d="M16 24 C23 23 28 18 29 11 C22 11 17 16 16 24Z" />
          <path d="M5 28 H27" />
        </svg>
      )
  }
}

/** Gopuram-tier plaque: stepped crown over a lacquer face, zari double rule, day over month. */
function DatePlaque({ date }: { date: string }) {
  const { day, month } = formatDayMonth(date)
  return (
    <div className="tm-plaque" aria-hidden="true">
      <svg viewBox="0 0 64 76">
        <path className="tm-plaque__outer" d="M27 4 H37 V8 H45 V14 H51 V22 H58 V74 H6 V22 H13 V14 H19 V8 H27Z" />
        <path className="tm-plaque__inner" d="M29 8 H35 V11 H42 V17 H48 V25 H54 V70 H10 V25 H16 V17 H22 V11 H29Z" />
        <circle className="tm-plaque__kalasam" cx="32" cy="2" r="1.8" />
      </svg>
      <span className="tm-plaque__day">{day}</span>
      <span className="tm-plaque__month">{month}</span>
    </div>
  )
}

function Actions({ event, hosts }: { event: CelebrationEvent; hosts: string }) {
  const maps = getMapLinks(event)
  return (
    <div className="tm-actions">
      <a className="tm-pill" href={maps.google} target="_blank" rel="noopener noreferrer">
        {Icon.pin} Map
      </a>
      <a className="tm-pill" href={maps.apple} target="_blank" rel="noopener noreferrer">
        {Icon.pin} Apple Maps
      </a>
      <a className="tm-pill" href={getGoogleCalendarUrl(event, hosts)} target="_blank" rel="noopener noreferrer">
        {Icon.cal} Calendar
      </a>
      <button type="button" className="tm-pill" onClick={() => downloadIcs(event, hosts)}>
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
      reveal('.tm-celebrations__head > *', { trigger: '.tm-celebrations__head', stagger: 0.12 })

      gsap.from('.tm-timeline__line', {
        scaleY: 0,
        ease: 'none',
        scrollTrigger: { trigger: '.tm-timeline', start: 'top 70%', end: 'bottom 70%', scrub: 0.8 },
      })

      gsap.utils.toArray<HTMLElement>('.tm-event').forEach((card) => {
        const st = { trigger: card, start: 'top 82%', once: true }
        gsap.from(card.querySelector('.tm-event__card'), { opacity: 0, scale: 0.97, duration: 1, ease: EASE.out, scrollTrigger: st })
        gsap.from(card.querySelector('.tm-event__toran'), {
          clipPath: 'inset(0 0 100% 0)',
          opacity: 0,
          duration: 1.5,
          ease: EASE.expo,
          clearProps: 'clipPath',
          scrollTrigger: st,
        })
        gsap.from(card.querySelectorAll('.tm-event__bloom'), {
          opacity: 0,
          filter: 'blur(8px)',
          duration: 1.4,
          delay: 0.3,
          stagger: 0.15,
          clearProps: 'filter',
          scrollTrigger: st,
        })
        gsap.from(card.querySelector('.tm-plaque'), { scale: 0.6, opacity: 0, duration: 0.9, ease: EASE.expo, scrollTrigger: st })
        gsap.from(card.querySelector('.tm-event__body')!.children, {
          opacity: 0,
          filter: 'blur(6px)',
          duration: 0.9,
          stagger: 0.08,
          delay: 0.15,
          ease: EASE.out,
          clearProps: 'filter',
          scrollTrigger: st,
        })
      })
    },
    { scope: ref, dependencies: [ctx.reducedMotion, data.celebrations.length] },
  )

  return (
    <section ref={ref} className="tm-section tm-celebrations" aria-label="Celebrations">
      <div className="tm-celebrations__head">
        <p className="tm-eyebrow">The celebrations</p>
        <h2 className="tm-title">Join us for every ceremony</h2>
      </div>
      <div className="tm-timeline">
        <span className="tm-timeline__line" aria-hidden="true" />
        <div className="tm-events">
          {data.celebrations.map((event) => (
            <article key={event.id} className="tm-event" data-event-id={event.id}>
              <DatePlaque date={event.date} />
              <div className="tm-event__card">
                <img className="tm-event__toran" src={toran} alt="" loading="lazy" decoding="async" />
                <img className="tm-event__bloom tm-event__bloom--r" src={bloom} alt="" loading="lazy" decoding="async" />
                <img className="tm-event__bloom tm-event__bloom--l" src={bloom} alt="" loading="lazy" decoding="async" />
                <div className="tm-event__body">
                  <div className="tm-event__top">
                    <h3 className="tm-event__title">{event.title}</h3>
                    <span className="tm-event__motif" aria-hidden="true">
                      <Motif kind={motifFor(event)} />
                    </span>
                  </div>
                  <p className="tm-event__when">
                    <span className="tm-event__date">{formatEventDate(event.date)}</span>
                    <span className="tm-event__time">{event.time}</span>
                  </p>
                  <p className="tm-event__venue">{event.venue}</p>
                  <p className="tm-event__address">{event.address}</p>
                  {event.description ? <p className="tm-event__desc">{event.description}</p> : null}
                  <Actions event={event} hosts={hosts} />
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

const plugin: SectionPlugin = {
  id: 'celebrations',
  Component: Celebrations,
  particles: [
    { sprite: 'shenbagam', motion: 'fall', count: 4, size: [12, 18], opacity: [0.5, 0.85], zone: 'margins', color: 'lamp' },
    { sprite: 'malli', motion: 'fall', count: 5, size: [10, 16], opacity: [0.5, 0.85], zone: 'margins', color: 'goldDim' },
  ],
  Divider: CelebrationsDivider,
}

export default plugin
