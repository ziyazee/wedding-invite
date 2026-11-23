import { useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import type { CelebrationEvent } from '../types'
import {
  SectionHeadingOrnament,
  OrnateRule,
  GoldCornerOrnament,
  ThinGoldRule,
  NoiseTexture,
  EventCardFrameSvg,
  FireworkBurstSvg,
  MarigoldGarlandSvg,
} from '../assets/svg'

gsap.registerPlugin(ScrollTrigger)

interface Props {
  events: CelebrationEvent[]
}

/**
 * Determine layout type for each event index.
 * B-A-C-A-B palindrome for 5 events.
 * Generalised: B,A,C,A,B for 5; B,A,B,A,B for 5 w/o middle;
 * Layout C goes to the middle-most event with the most celebratory character.
 */
type LayoutType = 'A' | 'B' | 'C'

function getLayoutPattern(count: number): LayoutType[] {
  if (count === 1) return ['A']
  if (count === 2) return ['A', 'B']
  if (count === 3) return ['B', 'A', 'B']
  if (count === 4) return ['B', 'A', 'A', 'B']

  // 5 events: B-A-C-A-B
  if (count === 5) return ['B', 'A', 'C', 'A', 'B']

  // 6+: alternate B,A with C at midpoint
  const pattern: LayoutType[] = []
  const mid = Math.floor(count / 2)
  for (let i = 0; i < count; i++) {
    if (i === mid) pattern.push('C')
    else if (i % 2 === 0) pattern.push('B')
    else pattern.push('A')
  }
  return pattern
}

/**
 * Determine divider type between events.
 * Marigold garland for transitions flanking layout C (the feature event).
 * ThinGoldRule for other transitions.
 */
type DividerType = 'garland' | 'rule'

function getDividerType(layouts: LayoutType[], idx: number): DividerType {
  // Divider between event[idx] and event[idx+1]
  const before = layouts[idx]
  const after = layouts[idx + 1]
  if (before === 'C' || after === 'C') return 'garland'
  if (before === 'A' && after === 'C') return 'garland'
  if (before === 'C' && after === 'A') return 'garland'
  return 'rule'
}

function formatEventDate(dateStr: string): string {
  // dateStr might be ISO or 'YYYY-MM-DD'
  const d = new Date(dateStr.includes('T') ? dateStr : dateStr + 'T00:00:00')
  return d.toLocaleDateString('en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })
}

export default function Celebrations({ events }: Props) {
  const sectionRef = useRef<HTMLElement>(null)
  const layouts = getLayoutPattern(events.length)

  useGSAP(
    () => {
      if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

      // Section heading
      gsap.from('.ag-celebrations-heading', {
        y: 24,
        opacity: 0,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.ag-section-celebrations',
          start: 'top 85%',
          once: true,
          toggleActions: 'play none none none',
        },
      })

      // Each event block — batch for efficiency
      ScrollTrigger.batch('.ag-event-block', {
        onEnter: (elements) => {
          gsap.from(elements, {
            y: 24,
            opacity: 0,
            duration: 0.8,
            ease: 'power2.out',
            stagger: 0.1,
            overwrite: true,
          })
        },
        start: 'top 85%',
        once: true,
      })

      // Garland dividers
      ScrollTrigger.batch('.ag-garland-divider', {
        onEnter: (elements) => {
          gsap.from(elements, {
            opacity: 0,
            scale: 0.92,
            duration: 1.0,
            ease: 'power2.out',
            overwrite: true,
          })
        },
        start: 'top 88%',
        once: true,
      })

      // Firework burst (Layout C)
      gsap.from('.ag-firework-burst', {
        opacity: 0,
        scale: 0.7,
        duration: 1.2,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.ag-event-feature',
          start: 'top 80%',
          once: true,
          toggleActions: 'play none none none',
        },
      })
    },
    { scope: sectionRef },
  )

  return (
    <section ref={sectionRef} className="ag-section-celebrations">
      <NoiseTexture className="ag-noise-overlay" />

      {/* Section heading */}
      <div className="ag-celebrations-heading">
        <h2 className="ag-type-section">Celebrations</h2>
        <SectionHeadingOrnament width={160} />
      </div>

      {/* Events */}
      <div className="ag-celebrations-list">
        {events.map((event, idx) => {
          const layout = layouts[idx]
          const isLast = idx === events.length - 1

          return (
            <div key={event.id}>
              {/* Event block */}
              {layout === 'A' && (
                <LayoutA event={event} />
              )}
              {layout === 'B' && (
                <LayoutB event={event} />
              )}
              {layout === 'C' && (
                <LayoutC event={event} />
              )}

              {/* Divider between events */}
              {!isLast && (
                getDividerType(layouts, idx) === 'garland' ? (
                  <div className="ag-garland-divider">
                    <MarigoldGarlandSvg width={300} className="ag-garland-img" />
                  </div>
                ) : (
                  <div className="ag-event-divider">
                    <ThinGoldRule width={120} />
                  </div>
                )
              )}
            </div>
          )
        })}
      </div>
    </section>
  )
}

/* ── Layout A: Ornamental Card with SVG frame ── */
function LayoutA({ event }: { event: CelebrationEvent }) {
  return (
    <div className="ag-event-block ag-event-card-layout">
      <EventCardFrameSvg width={340} height={280} className="ag-event-card-frame" />
      <div className="ag-event-card">
        <h3 className="ag-event-title ag-type-event">{event.title}</h3>
        <p className="ag-event-datetime ag-type-body">
          {formatEventDate(event.date)}
          <br />
          {event.time}
        </p>
        <p className="ag-event-venue ag-type-detail">{event.venue}</p>
        <p className="ag-event-address ag-type-small">{event.address}</p>
      </div>
    </div>
  )
}

/* ── Layout B: Open Frame with Gold Corners ── */
function LayoutB({ event }: { event: CelebrationEvent }) {
  return (
    <div className="ag-event-block ag-event-open-frame">
      <GoldCornerOrnament position="top-left" size={60} className="ag-gold-corner ag-corner-tl" />
      <GoldCornerOrnament position="top-right" size={60} className="ag-gold-corner ag-corner-tr" />
      <GoldCornerOrnament position="bottom-left" size={60} className="ag-gold-corner ag-corner-bl" />
      <GoldCornerOrnament position="bottom-right" size={60} className="ag-gold-corner ag-corner-br" />

      <div className="ag-event-content">
        <h3 className="ag-event-title ag-type-event">{event.title}</h3>
        <p className="ag-event-datetime ag-type-body">
          {formatEventDate(event.date)}
          <br />
          {event.time}
        </p>
        <p className="ag-event-venue ag-type-detail">{event.venue}</p>
        <p className="ag-event-address ag-type-small">{event.address}</p>
      </div>
    </div>
  )
}

/* ── Layout C: Feature Event with Firework Burst ── */
function LayoutC({ event }: { event: CelebrationEvent }) {
  return (
    <div className="ag-event-block ag-event-feature ag-event-open-frame">
      {/* Firework burst behind */}
      <FireworkBurstSvg size={280} className="ag-firework-burst" />

      <GoldCornerOrnament position="top-left" size={60} className="ag-gold-corner ag-corner-tl" />
      <GoldCornerOrnament position="top-right" size={60} className="ag-gold-corner ag-corner-tr" />
      <GoldCornerOrnament position="bottom-left" size={60} className="ag-gold-corner ag-corner-bl" />
      <GoldCornerOrnament position="bottom-right" size={60} className="ag-gold-corner ag-corner-br" />

      <div className="ag-event-content">
        <h3 className="ag-event-title ag-type-event">{event.title}</h3>
        <p className="ag-event-datetime ag-type-body">
          {formatEventDate(event.date)}
          <br />
          {event.time}
        </p>
        <p className="ag-event-venue ag-type-detail">{event.venue}</p>
        <p className="ag-event-address ag-type-small">{event.address}</p>
      </div>
    </div>
  )
}
