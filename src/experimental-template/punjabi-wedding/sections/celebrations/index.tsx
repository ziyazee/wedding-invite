/* Celebrations — a pearl-string timeline of Punjabi rasams. Each event gets a faceted
   octagonal date plaque and a small motif drawn for that rasam, plus map and calendar actions.
   Works for any number of events. Animation: the pearl line grows with the scroll,
   each plaque and its text focus-pull in. */

import { useRef } from 'react'
import { gsap, useGSAP, reveal, formatDayMonth, formatEventDate, EASE } from '../../core'
import type { CelebrationEvent, SectionPlugin, SectionProps } from '../../core'
import CelebrationsDivider from './Divider'
import { downloadIcs, getGoogleCalendarUrl, getMapLinks } from './links'
import rose from '../../assets/generated/rose-corner.png'
import toran from '../../assets/generated/event-toran.webp'
import bloom from '../../assets/generated/event-corner.webp'
import './celebrations.css'

const Icon = {
  pin: <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 15 C3 10 3 7 3 6 a5 5 0 0 1 10 0 c0 1 0 4 -5 9Z" /><circle cx="8" cy="6" r="1.6" /></svg>,
  cal: <svg viewBox="0 0 16 16" aria-hidden="true"><rect x="2" y="3" width="12" height="11" rx="1" /><path d="M2 7 H14 M5 1.5 V4.5 M11 1.5 V4.5" /></svg>,
  down: <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 2 V10 M4.5 7 L8 10.5 L11.5 7 M3 14 H13" /></svg>,
}

type MotifKind = 'parat' | 'chooda' | 'gaggar' | 'palki' | 'jhoomar' | 'rose'

/** Pick a motif from the event's id/title so renamed or added events still get a sensible one. */
function motifFor(event: CelebrationEvent): MotifKind {
  const key = `${event.id} ${event.title}`.toLowerCase()
  if (/(maiyan|vatna|haldi|mehndi|mehendi)/.test(key)) return 'parat'
  if (/(chooda|kalire|bangle)/.test(key)) return 'chooda'
  if (/(jaggo|sangeet|ladies)/.test(key)) return 'gaggar'
  if (/(karaj|milni|wedding|phere|ceremony)/.test(key)) return 'palki'
  if (/(doli|reception|dinner|cocktail)/.test(key)) return 'jhoomar'
  return 'rose'
}

/** Small hand-drawn motifs, one per rasam. 32x32, stroke only. */
function Motif({ kind }: { kind: MotifKind }) {
  switch (kind) {
    case 'parat': // shallow brass parat holding vatna, with a leaf
      return (
        <svg viewBox="0 0 32 32" aria-hidden="true">
          <path d="M3 17 H29 C28 24 22 28 16 28 C10 28 4 24 3 17Z" />
          <path d="M8 17 C9 11 13 9 16 9 C19 9 23 11 24 17" />
          <path d="M16 9 C16 5 18 3 21 3 C21 6 19 8 16 9Z" />
          <path d="M11 22 H21" />
        </svg>
      )
    case 'chooda': // stack of bangles
      return (
        <svg viewBox="0 0 32 32" aria-hidden="true">
          <ellipse cx="16" cy="9" rx="11" ry="4" />
          <ellipse cx="16" cy="16" rx="11" ry="4" />
          <ellipse cx="16" cy="23" rx="11" ry="4" />
          <path d="M8 16 V16.1 M13 19.8 V19.9 M19 19.8 V19.9 M24 16 V16.1" strokeWidth="2" />
        </svg>
      )
    case 'gaggar': // jaggo: lit decorated pot
      return (
        <svg viewBox="0 0 32 32" aria-hidden="true">
          <path d="M16 2 C19 5 19 8 16 10 C13 8 13 5 16 2Z" />
          <path d="M11 13 H21 M12 13 C8 16 8 24 12 28 H20 C24 24 24 16 20 13" />
          <path d="M10 20 H22 M16 16 V16.1 M13 24 V24.1 M19 24 V24.1" strokeWidth="1.6" />
        </svg>
      )
    case 'palki': // dome pavilion with finial
      return (
        <svg viewBox="0 0 32 32" aria-hidden="true">
          <path d="M16 2 V5" />
          <path d="M6 14 C6 9 11 6 16 5 C21 6 26 9 26 14 Z" />
          <path d="M8 14 V28 M24 14 V28 M8 28 H24 M12 14 C12 19 14 21 16 21 C18 21 20 19 20 14" />
        </svg>
      )
    case 'jhoomar': // chandelier
      return (
        <svg viewBox="0 0 32 32" aria-hidden="true">
          <path d="M16 1 V8" />
          <path d="M8 14 C8 10 12 8 16 8 C20 8 24 10 24 14 Z" />
          <path d="M10 14 V19 M16 14 V24 M22 14 V19" />
          <circle cx="10" cy="21" r="1.6" />
          <circle cx="16" cy="26.4" r="1.9" />
          <circle cx="22" cy="21" r="1.6" />
        </svg>
      )
    default: // rose
      return (
        <svg viewBox="0 0 32 32" aria-hidden="true">
          <circle cx="16" cy="14" r="3" />
          <path d="M16 14 C9 12 9 4 16 4 C23 4 23 12 16 14 C20 20 26 14 24 10 M16 14 C10 18 12 24 18 22" />
          <path d="M16 22 V30 M16 27 C12 27 10 25 10 23 C13 23 15 24 16 27Z" />
        </svg>
      )
  }
}

/** Faceted octagonal plaque: double outline, stitched inner diamond, day over month. */
function DatePlaque({ date }: { date: string }) {
  const { day, month } = formatDayMonth(date)
  return (
    <div className="pb-plaque" aria-hidden="true">
      <svg viewBox="0 0 72 72">
        <path className="pb-plaque__outer" d="M22 2 H50 L70 22 V50 L50 70 H22 L2 50 V22 Z" />
        <path className="pb-plaque__inner" d="M25 8 H47 L64 25 V47 L47 64 H25 L8 47 V25 Z" />
        <path className="pb-plaque__stitch" d="M36 12 L60 36 L36 60 L12 36 Z" />
      </svg>
      <span className="pb-plaque__day">{day}</span>
      <span className="pb-plaque__month">{month}</span>
    </div>
  )
}

function Actions({ event, hosts }: { event: CelebrationEvent; hosts: string }) {
  const maps = getMapLinks(event)
  return (
    <div className="pb-actions">
      <a className="pb-pill" href={maps.google} target="_blank" rel="noopener noreferrer">
        {Icon.pin} Map
      </a>
      <a className="pb-pill" href={maps.apple} target="_blank" rel="noopener noreferrer">
        {Icon.pin} Apple Maps
      </a>
      <a className="pb-pill" href={getGoogleCalendarUrl(event, hosts)} target="_blank" rel="noopener noreferrer">
        {Icon.cal} Calendar
      </a>
      <button type="button" className="pb-pill" onClick={() => downloadIcs(event, hosts)}>
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
      reveal('.pb-celebrations__head > *', { trigger: '.pb-celebrations__head', stagger: 0.12 })
      gsap.from('.pb-celebrations__rose', { opacity: 0, scale: 0.9, duration: 1.8, ease: EASE.out, stagger: 0.15 })

      gsap.from('.pb-timeline__line', {
        scaleY: 0,
        ease: 'none',
        scrollTrigger: { trigger: '.pb-timeline', start: 'top 70%', end: 'bottom 70%', scrub: 0.8 },
      })

      gsap.utils.toArray<HTMLElement>('.pb-event').forEach((card) => {
        const st = { trigger: card, start: 'top 82%', once: true }
        gsap.from(card.querySelector('.pb-event__card'), { opacity: 0, scale: 0.97, duration: 1, ease: EASE.out, scrollTrigger: st })
        gsap.from(card.querySelector('.pb-event__toran'), {
          clipPath: 'inset(0 0 100% 0)',
          opacity: 0,
          duration: 1.5,
          ease: EASE.expo,
          clearProps: 'clipPath',
          scrollTrigger: st,
        })
        gsap.from(card.querySelectorAll('.pb-event__bloom'), {
          opacity: 0,
          filter: 'blur(8px)',
          duration: 1.4,
          delay: 0.3,
          stagger: 0.15,
          clearProps: 'filter',
          scrollTrigger: st,
        })
        gsap.from(card.querySelector('.pb-plaque'), { scale: 0.6, opacity: 0, duration: 0.9, ease: EASE.expo, scrollTrigger: st })
        gsap.from(card.querySelector('.pb-event__body')!.children, {
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
    <section ref={ref} className="pb-section pb-celebrations" aria-label="Celebrations">
      <img className="pb-celebrations__rose pb-celebrations__rose--l" src={rose} alt="" loading="lazy" decoding="async" />
      <img className="pb-celebrations__rose pb-celebrations__rose--r" src={rose} alt="" loading="lazy" decoding="async" />
      <div className="pb-celebrations__head">
        <p className="pb-eyebrow">The celebrations</p>
        <h2 className="pb-title">Join us for every rasam</h2>
      </div>
      <div className="pb-timeline">
        <span className="pb-timeline__line" aria-hidden="true" />
        <div className="pb-events">
          {data.celebrations.map((event) => (
            <article key={event.id} className="pb-event" data-event-id={event.id}>
              <DatePlaque date={event.date} />
              <div className="pb-event__card">
                <img className="pb-event__toran" src={toran} alt="" loading="lazy" decoding="async" />
                <img className="pb-event__bloom pb-event__bloom--r" src={bloom} alt="" loading="lazy" decoding="async" />
                <img className="pb-event__bloom pb-event__bloom--l" src={bloom} alt="" loading="lazy" decoding="async" />
              <div className="pb-event__body">
                <div className="pb-event__top">
                  <h3 className="pb-event__title">{event.title}</h3>
                  <span className="pb-event__motif" aria-hidden="true">
                    <Motif kind={motifFor(event)} />
                  </span>
                </div>
                <p className="pb-event__when">
                  <span className="pb-event__date">{formatEventDate(event.date)}</span>
                  <span className="pb-event__time">{event.time}</span>
                </p>
                <p className="pb-event__venue">{event.venue}</p>
                <p className="pb-event__address">{event.address}</p>
                {event.description ? <p className="pb-event__desc">{event.description}</p> : null}
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
    { sprite: 'sparkle', motion: 'twinkle', count: 6, size: [10, 18], opacity: [0.25, 0.65], zone: 'margins', color: 'goldBright' },
    { sprite: 'daisy', motion: 'fall', count: 5, size: [12, 18], opacity: [0.5, 0.9], zone: 'margins', color: '#ffffff' },
  ],
  Divider: CelebrationsDivider,
}

export default plugin
