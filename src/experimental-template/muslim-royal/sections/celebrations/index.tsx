/* Celebrations — "The Celebrations". A sehra toran of mogra and rose strands hangs over the list;
   each card is its own flexible ivory slip with a khatam date plaque, a hand-painted motif matched to
   the event, and mirrored rose corners. Map and calendar actions come from ./links.
   Animation: toran drops and sways, cards unroll downward, plaques turn into place, the inlay rule draws on. */

import { useRef } from 'react'
import { gsap, useGSAP, reveal, formatDayMonth, formatEventDate, EASE } from '../../core'
import type { CelebrationEvent, SectionPlugin, SectionProps } from '../../core'
import CelebrationsDivider from './Divider'
import { downloadIcs, getGoogleCalendarUrl, getMapLinks } from './links'
import toranSrc from '../../assets/generated/celebration-sehra-toran.webp'
import cornerSrc from '../../assets/generated/celebration-corner.webp'
import plaqueSrc from '../../assets/generated/date-plaque.webp'
import mangniSrc from '../../assets/generated/motif-mangni.webp'
import mehndiSrc from '../../assets/generated/motif-mehndi.webp'
import dholkiSrc from '../../assets/generated/motif-dholki.webp'
import nikahSrc from '../../assets/generated/motif-nikah.webp'
import walimaSrc from '../../assets/generated/motif-walima.webp'
import './celebrations.css'

/** Pick the painted motif by words in the title or id; anything else gets the walima dawat tray. */
function motifFor(event: CelebrationEvent): string {
  const key = `${event.id} ${event.title}`.toLowerCase()
  if (/engage|mangni|sagai|ring|betroth|proposal/.test(key)) return mangniSrc
  if (/mehndi|mehendi|henna|haldi|ubtan|bridal shower/.test(key)) return mehndiSrc
  if (/music|sangeet|dholki|qawwali|dance|cocktail|song/.test(key)) return dholkiSrc
  if (/nikah|akad|ceremony|wedding|nuptial|rukhsati/.test(key)) return nikahSrc
  return walimaSrc
}

const Icon = {
  pin: <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 15 C3 10 3 7 3 6 a5 5 0 0 1 10 0 c0 1 0 4 -5 9Z" /><circle cx="8" cy="6" r="1.6" /></svg>,
  cal: <svg viewBox="0 0 16 16" aria-hidden="true"><rect x="2" y="3" width="12" height="11" rx="1" /><path d="M2 7 H14 M5 1.5 V4.5 M11 1.5 V4.5" /></svg>,
  down: <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 2 V10 M4.5 7 L8 10.5 L11.5 7 M3 14 H13" /></svg>,
}

function Actions({ event, hosts }: { event: CelebrationEvent; hosts: string }) {
  const maps = getMapLinks(event)
  return (
    <div className="mr-actions">
      <a className="mr-pill" href={maps.google} target="_blank" rel="noopener noreferrer">
        {Icon.pin} Map
      </a>
      <a className="mr-pill" href={maps.apple} target="_blank" rel="noopener noreferrer">
        {Icon.pin} Apple Maps
      </a>
      <a className="mr-pill" href={getGoogleCalendarUrl(event, hosts)} target="_blank" rel="noopener noreferrer">
        {Icon.cal} Calendar
      </a>
      <button type="button" className="mr-pill" onClick={() => downloadIcs(event, hosts)}>
        {Icon.down} .ics
      </button>
    </div>
  )
}


function Card({ event, hosts }: { event: CelebrationEvent; hosts: string }) {
  const { day, month } = formatDayMonth(event.date)
  return (
    <article className="mr-slip" data-event-id={event.id}>
      <img className="mr-slip__corner mr-slip__corner--l" src={cornerSrc} alt="" width={340} height={346} loading="lazy" decoding="async" />
      <img className="mr-slip__corner mr-slip__corner--r" src={cornerSrc} alt="" width={340} height={346} loading="lazy" decoding="async" />
      <header className="mr-slip__head">
        <div className="mr-slip__plaque">
          <img src={plaqueSrc} alt="" width={240} height={240} loading="lazy" decoding="async" />
          <span className="mr-slip__day">{day}</span>
          <span className="mr-slip__month">{month}</span>
        </div>
        <div className="mr-slip__titles">
          <h3 className="mr-slip__title">{event.title}</h3>
          <p className="mr-slip__when">{formatEventDate(event.date)}</p>
          {event.time ? <p className="mr-slip__time">{event.time}</p> : null}
        </div>
      </header>
      <img className="mr-slip__motif" src={motifFor(event)} alt="" width={300} height={240} loading="lazy" decoding="async" />
      <p className="mr-slip__venue">{event.venue}</p>
      <p className="mr-slip__address">{event.address}</p>
      {event.description ? <p className="mr-slip__desc">{event.description}</p> : null}
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
      gsap.from('.mr-celebrations__toran', { yPercent: -25, opacity: 0, duration: 1.4, ease: EASE.expo })
      gsap.to('.mr-celebrations__toran', { rotate: -0.7, transformOrigin: '50% 0%', duration: 3.6, ease: 'sine.inOut', yoyo: true, repeat: -1 })
      reveal('.mr-celebrations__head > *', { trigger: '.mr-celebrations__head', stagger: 0.12 })

      gsap.utils.toArray<HTMLElement>('.mr-slip').forEach((card) => {
        const st = { trigger: card, start: 'top 84%', once: true }
        gsap.from(card, { opacity: 0, clipPath: 'inset(0 0 100% 0)', y: 16, duration: 1.2, ease: EASE.expo, scrollTrigger: st })
        gsap.from(card.querySelector('.mr-slip__plaque'), { scale: 0.5, rotate: 45, opacity: 0, duration: 1.1, delay: 0.2, ease: EASE.expo, scrollTrigger: st })
        gsap.from(card.querySelector('.mr-slip__motif'), { opacity: 0, scale: 0.85, duration: 1, delay: 0.35, ease: EASE.out, scrollTrigger: st })
        gsap.from(card.querySelectorAll('.mr-slip__corner'), { opacity: 0, scale: 0.6, duration: 0.9, delay: 0.5, stagger: 0.1, ease: EASE.out, scrollTrigger: st })
      })
      gsap.utils.toArray<HTMLElement>('.mr-celebrations__rule').forEach((rule) => {
        gsap.from(rule.querySelectorAll('.mr-draw'), {
          strokeDashoffset: 1, duration: 1.2, ease: EASE.inOut,
          scrollTrigger: { trigger: rule, start: 'top 90%', once: true },
        })
      })
    },
    { scope: ref, dependencies: [ctx.reducedMotion, data.celebrations.length] },
  )

  return (
    <section ref={ref} className="mr-section mr-celebrations" aria-label="Celebrations">
      <img className="mr-celebrations__toran" src={toranSrc} alt="" width={960} height={444} decoding="async" />
      <div className="mr-celebrations__head">
        <p className="mr-eyebrow">Join us</p>
        <h2 className="mr-title">The Celebrations</h2>
        <p className="mr-celebrations__ar mr-arabic" lang="ar" dir="rtl">الحمد لله</p>
        <p className="mr-celebrations__sub">Days of joy and gratitude. Come for every one of them.</p>
      </div>
      <div className="mr-slips">
        {data.celebrations.map((event, i) => (
          <div key={event.id} className="mr-slips__item">
            {i > 0 ? (
              <svg className="mr-celebrations__rule" viewBox="0 0 140 14" width="140" height="14" aria-hidden="true">
                <path className="mr-draw" pathLength="1" d="M0 7 H52 M88 7 H140" />
                <path className="mr-draw" pathLength="1" d="M70 0 L77 7 L70 14 L63 7 Z" />
                <path className="mr-draw" pathLength="1" d="M66.5 3.5 H73.5 V10.5 H66.5 Z" />
                <path className="mr-draw" pathLength="1" d="M56 7 L59 4 L62 7 L59 10 Z M78 7 L81 4 L84 7 L81 10 Z" />
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
    { sprite: 'mogra', motion: 'fall', count: 9, size: [12, 18], opacity: [0.45, 0.85], zone: 'full', color: 'ivory' },
    { sprite: 'rose', motion: 'fall', count: 6, size: [12, 20], opacity: [0.35, 0.65], zone: 'margins', color: 'rose' },
    { sprite: 'zarr', motion: 'twinkle', count: 8, size: [8, 14], opacity: [0.3, 0.7], zone: 'margins', color: 'goldBright' },
  ],
  Divider: CelebrationsDivider,
}

export default plugin
