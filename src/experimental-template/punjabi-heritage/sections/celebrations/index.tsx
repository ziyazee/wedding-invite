/* Celebrations — "Shagnan De Din" (the days of good omen). A painted toran hangs over the list;
   each card is its own flexible parchment slip with a date plaque, a hand-painted motif matched to
   the event, and mirrored corner sprays. Map and calendar actions come from ./links.
   Animation: toran drops in, cards rise one by one, plaques stamp, stitched rule draws on. */

import { useRef } from 'react'
import { gsap, useGSAP, reveal, formatDayMonth, formatEventDate, EASE } from '../../core'
import type { CelebrationEvent, SectionPlugin, SectionProps } from '../../core'
import CelebrationsDivider from './Divider'
import { downloadIcs, getGoogleCalendarUrl, getMapLinks } from './links'
import toranSrc from '../../assets/generated/celebration-toran.webp'
import cornerSrc from '../../assets/generated/celebration-corner.webp'
import plaqueSrc from '../../assets/generated/date-plaque.webp'
import rokaSrc from '../../assets/generated/motif-roka.webp'
import vatnaSrc from '../../assets/generated/motif-vatna.webp'
import jaagoSrc from '../../assets/generated/motif-jaago.webp'
import milniSrc from '../../assets/generated/motif-milni.webp'
import './celebrations.css'

/** Pick the painted motif by words in the title or id; anything else gets the milni shawls. */
function motifFor(event: CelebrationEvent): string {
  const key = `${event.id} ${event.title}`.toLowerCase()
  if (/roka|shagun|engage|sagai|ring|chunni/.test(key)) return rokaSrc
  if (/maiyan|vatna|haldi|mehndi|mehendi|chooda|henna/.test(key)) return vatnaSrc
  if (/jaago|sangeet|giddha|bhangra|dhol|music|dance|cocktail/.test(key)) return jaagoSrc
  return milniSrc
}

const Icon = {
  pin: <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 15 C3 10 3 7 3 6 a5 5 0 0 1 10 0 c0 1 0 4 -5 9Z" /><circle cx="8" cy="6" r="1.6" /></svg>,
  cal: <svg viewBox="0 0 16 16" aria-hidden="true"><rect x="2" y="3" width="12" height="11" rx="1" /><path d="M2 7 H14 M5 1.5 V4.5 M11 1.5 V4.5" /></svg>,
  down: <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 2 V10 M4.5 7 L8 10.5 L11.5 7 M3 14 H13" /></svg>,
}

function Actions({ event, hosts }: { event: CelebrationEvent; hosts: string }) {
  const maps = getMapLinks(event)
  return (
    <div className="ph-actions">
      <a className="ph-pill" href={maps.google} target="_blank" rel="noopener noreferrer">
        {Icon.pin} Map
      </a>
      <a className="ph-pill" href={maps.apple} target="_blank" rel="noopener noreferrer">
        {Icon.pin} Apple Maps
      </a>
      <a className="ph-pill" href={getGoogleCalendarUrl(event, hosts)} target="_blank" rel="noopener noreferrer">
        {Icon.cal} Calendar
      </a>
      <button type="button" className="ph-pill" onClick={() => downloadIcs(event, hosts)}>
        {Icon.down} .ics
      </button>
    </div>
  )
}


function Card({ event, hosts }: { event: CelebrationEvent; hosts: string }) {
  const { day, month } = formatDayMonth(event.date)
  return (
    <article className="ph-slip" data-event-id={event.id}>
      <img className="ph-slip__corner ph-slip__corner--l" src={cornerSrc} alt="" width={340} height={386} loading="lazy" decoding="async" />
      <img className="ph-slip__corner ph-slip__corner--r" src={cornerSrc} alt="" width={340} height={386} loading="lazy" decoding="async" />
      <header className="ph-slip__head">
        <div className="ph-slip__plaque">
          <img src={plaqueSrc} alt="" width={240} height={236} loading="lazy" decoding="async" />
          <span className="ph-slip__day">{day}</span>
          <span className="ph-slip__month">{month}</span>
        </div>
        <div className="ph-slip__titles">
          <h3 className="ph-slip__title">{event.title}</h3>
          <p className="ph-slip__when">{formatEventDate(event.date)}</p>
          {event.time ? <p className="ph-slip__time">{event.time}</p> : null}
        </div>
      </header>
      <img className="ph-slip__motif" src={motifFor(event)} alt="" width={300} height={240} loading="lazy" decoding="async" />
      <p className="ph-slip__venue">{event.venue}</p>
      <p className="ph-slip__address">{event.address}</p>
      {event.description ? <p className="ph-slip__desc">{event.description}</p> : null}
      <Actions event={event} hosts={hosts} />
    </article>
  )
}

function Celebrations({ data, ctx }: SectionProps) {
  const ref = useRef<HTMLElement>(null)
  const hosts = `${data.couple.groomName} & ${data.couple.brideName}`

  useGSAP(
    () => {
      if (ctx.reducedMotion) return
      gsap.from('.ph-celebrations__toran', { yPercent: -25, opacity: 0, duration: 1.4, ease: EASE.expo })
      reveal('.ph-celebrations__head > *', { trigger: '.ph-celebrations__head', stagger: 0.12 })

      gsap.utils.toArray<HTMLElement>('.ph-slip').forEach((card) => {
        const st = { trigger: card, start: 'top 84%', once: true }
        gsap.from(card, { opacity: 0, y: 40, duration: 1, ease: EASE.expo, scrollTrigger: st })
        gsap.from(card.querySelector('.ph-slip__plaque'), { scale: 0.7, rotate: -8, opacity: 0, duration: 0.9, delay: 0.2, ease: EASE.expo, scrollTrigger: st })
        gsap.from(card.querySelector('.ph-slip__motif'), { opacity: 0, scale: 0.85, duration: 1, delay: 0.35, ease: EASE.out, scrollTrigger: st })
        gsap.from(card.querySelectorAll('.ph-slip__corner'), { opacity: 0, scale: 0.6, duration: 0.9, delay: 0.5, stagger: 0.1, ease: EASE.out, scrollTrigger: st })
      })
      gsap.utils.toArray<HTMLElement>('.ph-celebrations__rule').forEach((rule) => {
        gsap.from(rule.querySelectorAll('.ph-draw'), {
          strokeDashoffset: 1, duration: 1.2, ease: EASE.inOut,
          scrollTrigger: { trigger: rule, start: 'top 90%', once: true },
        })
      })
    },
    { scope: ref, dependencies: [ctx.reducedMotion, data.celebrations.length] },
  )

  return (
    <section ref={ref} className="ph-section ph-celebrations" aria-label="Celebrations">
      <img className="ph-celebrations__toran" src={toranSrc} alt="" width={960} height={410} decoding="async" />
      <div className="ph-celebrations__head">
        <p className="ph-eyebrow">The celebrations</p>
        <h2 className="ph-title">Shagnan De Din</h2>
        <p className="ph-celebrations__sub">Days of good omen. Come for every one of them.</p>
      </div>
      <div className="ph-slips">
        {data.celebrations.map((event, i) => (
          <div key={event.id} className="ph-slips__item">
            {i > 0 ? (
              <svg className="ph-celebrations__rule" viewBox="0 0 120 8" width="120" height="8" aria-hidden="true">
                <path className="ph-draw" pathLength="1" d="M0 4 H44 M76 4 H120" />
                <path className="ph-draw" pathLength="1" d="M60 0 L64 4 L60 8 L56 4 Z" />
              </svg>
            ) : null}
            <Card event={event} hosts={hosts} />
          </div>
        ))}
      </div>
    </section>
  )
}

const plugin: SectionPlugin = {
  id: 'celebrations',
  Component: Celebrations,
  particles: [
    { sprite: 'kanak', motion: 'drift', count: 5, size: [14, 24], opacity: [0.25, 0.5], zone: 'margins', color: 'goldBright' },
    { sprite: 'genda', motion: 'fall', count: 7, size: [12, 20], opacity: [0.35, 0.65], zone: 'full', color: 'dawn' },
    { sprite: 'sarhon', motion: 'twinkle', count: 4, size: [10, 16], opacity: [0.3, 0.6], zone: 'margins', color: 'mustard' },
  ],
  Divider: CelebrationsDivider,
}

export default plugin
