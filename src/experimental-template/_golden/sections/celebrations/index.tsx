/* Celebrations — shared EventList rendering plus this section's own extras:
   map links (Google, Apple) and calendar links (Google, .ics) per event.
   Animation: a timeline line draws with the scroll, each event focus-pulls in. */

import { useRef } from 'react'
import { gsap, useGSAP, reveal, EventList, EASE } from '../../core'
import type { CelebrationEvent, SectionPlugin, SectionProps } from '../../core'
import CelebrationsDivider from './Divider'
import { downloadIcs, getGoogleCalendarUrl, getMapLinks } from './links'
import './celebrations.css'

const Icon = {
  pin: <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 15 C3 10 3 7 3 6 a5 5 0 0 1 10 0 c0 1 0 4 -5 9Z" /><circle cx="8" cy="6" r="1.6" /></svg>,
  cal: <svg viewBox="0 0 16 16" aria-hidden="true"><rect x="2" y="3" width="12" height="11" rx="1" /><path d="M2 7 H14 M5 1.5 V4.5 M11 1.5 V4.5" /></svg>,
  down: <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 2 V10 M4.5 7 L8 10.5 L11.5 7 M3 14 H13" /></svg>,
}

function Actions({ event, hosts }: { event: CelebrationEvent; hosts: string }) {
  const maps = getMapLinks(event)
  return (
    <div className="gd-actions">
      <a className="gd-pill" href={maps.google} target="_blank" rel="noopener noreferrer">
        {Icon.pin} Map
      </a>
      <a className="gd-pill" href={maps.apple} target="_blank" rel="noopener noreferrer">
        {Icon.pin} Apple Maps
      </a>
      <a className="gd-pill" href={getGoogleCalendarUrl(event, hosts)} target="_blank" rel="noopener noreferrer">
        {Icon.cal} Calendar
      </a>
      <button type="button" className="gd-pill" onClick={() => downloadIcs(event, hosts)}>
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
      reveal('.gd-celebrations__head > *', { trigger: '.gd-celebrations__head', stagger: 0.12 })

      gsap.from('.gd-timeline__line', {
        scaleY: 0,
        ease: 'none',
        scrollTrigger: { trigger: '.gd-timeline', start: 'top 70%', end: 'bottom 70%', scrub: 0.8 },
      })

      gsap.utils.toArray<HTMLElement>('.gd-event').forEach((card) => {
        const st = { trigger: card, start: 'top 82%', once: true }
        gsap.from(card.querySelector('.gd-event__badge'), { scale: 0.6, opacity: 0, duration: 0.9, ease: EASE.expo, scrollTrigger: st })
        gsap.from(card.querySelector('.gd-event__body')!.children, {
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
    <section ref={ref} className="gd-section gd-celebrations" aria-label="Celebrations">
      <div className="gd-celebrations__head">
        <p className="gd-eyebrow">The celebrations</p>
        <h2 className="gd-title">Join us for every moment</h2>
      </div>
      <div className="gd-timeline">
        <span className="gd-timeline__line" aria-hidden="true" />
        <EventList events={data.celebrations} renderActions={(event) => <Actions event={event} hosts={hosts} />} />
      </div>
    </section>
  )
}

const plugin: SectionPlugin = {
  id: 'celebrations',
  Component: Celebrations,
  particles: [
    { sprite: 'sparkle', motion: 'twinkle', count: 8, size: [10, 20], opacity: [0.2, 0.6], zone: 'margins', color: 'goldBright' },
    { sprite: 'petal', motion: 'fall', count: 7, size: [12, 22], opacity: [0.3, 0.55], zone: 'full', color: 'ember' },
  ],
  Divider: CelebrationsDivider,
}

export default plugin
