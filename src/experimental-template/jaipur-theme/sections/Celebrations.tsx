import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { FloralCorner, StarIcon } from '../assets'
import type { CelebrationEvent } from '../types'

interface CelebrationsProps {
  events: CelebrationEvent[]
}

const EVENT_ACCENTS: Record<string, string> = {
  mehendi: '#8BAF78',
  sangeet: '#D4A853',
  wedding: '#B76E79',
  reception: '#9B8EC1',
}

export default function Celebrations({ events }: CelebrationsProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])

  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  useGSAP(
    () => {
      if (prefersReducedMotion || !sectionRef.current) return

      cardRefs.current.forEach((card) => {
        if (!card) return

        const revealEls = card.querySelectorAll('.jt-ev-reveal')
        const corners = card.querySelectorAll('.jt-event__corner')
        const borderSvg = card.querySelector('.jt-event__border')

        gsap.set(card, { opacity: 0 })
        gsap.set(revealEls, { opacity: 0 })
        gsap.set(corners, { opacity: 0, scale: 0.4 })
        if (borderSvg) gsap.set(borderSvg, { strokeDashoffset: 1600 })

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: card,
            start: 'top 82%',
            once: true,
          },
          defaults: { ease: 'power2.out' },
        })

        tl.to(card, { opacity: 1, duration: 0.5 }, 0)

        if (borderSvg) {
          tl.to(borderSvg, {
            strokeDashoffset: 0,
            duration: 1.4,
            ease: 'power1.inOut',
          }, 0)
        }

        tl.to(corners, {
          opacity: 0.7,
          scale: 1,
          duration: 0.6,
          stagger: 0.08,
        }, 0.2)

        tl.to(revealEls, {
          opacity: 1,
          duration: 0.5,
          stagger: 0.12,
        }, 0.4)
      })
    },
    { scope: sectionRef }
  )

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr + 'T00:00:00')
    return d.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    })
  }

  return (
    <section ref={sectionRef} className="jt-celebrations" aria-label="Celebrations">
      <h2 className="jt-celebrations__title">Wedding Celebrations</h2>
      <div className="jt-celebrations__list">
        {events.map((event, i) => {
          const accent = EVENT_ACCENTS[event.id] || EVENT_ACCENTS.wedding
          return (
            <div
              key={event.id}
              ref={(el) => { cardRefs.current[i] = el }}
              className="jt-event"
              style={{ '--jt-event-accent': accent } as React.CSSProperties}
            >
              <svg className="jt-event__border-svg" aria-hidden="true">
                <rect className="jt-event__border" x="0.5" y="0.5"
                  width="calc(100% - 1px)" height="calc(100% - 1px)" />
              </svg>

              <div className="jt-event__accent-line" />

              <FloralCorner className="jt-event__corner jt-event__corner--tl" />
              <FloralCorner className="jt-event__corner jt-event__corner--tr" />
              <FloralCorner className="jt-event__corner jt-event__corner--bl" />
              <FloralCorner className="jt-event__corner jt-event__corner--br" />

              <h3 className="jt-event__title jt-ev-reveal">{event.title}</h3>

              <div className="jt-event__separator jt-ev-reveal">
                <span className="jt-event__sep-line" />
                <StarIcon size={10} />
                <span className="jt-event__sep-line" />
              </div>

              <div className="jt-event__when jt-ev-reveal">
                <p className="jt-event__date">{formatDate(event.date)}</p>
                <p className="jt-event__time">{event.time}</p>
              </div>

              <div className="jt-event__where jt-ev-reveal">
                <p className="jt-event__venue">{event.venue}</p>
                <p className="jt-event__address">{event.address}</p>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
