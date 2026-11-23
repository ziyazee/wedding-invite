/* Kerala Dawn -- Section 4: Celebrations
   Banana leaf event cards with elephant walk-in dividers,
   coconut palm watermarks, leaf sway on reveal */

import { useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import {
  KasavuBorder,
  BananaLeaf,
  ElephantMotif,
  Lotus,
  CoconutPalm,
} from '../assets'
import type { CelebrationEvent } from '../types'

interface CelebrationsProps {
  events: CelebrationEvent[]
}

function formatEventDate(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00')
  return d.toLocaleDateString('en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export default function Celebrations({ events }: CelebrationsProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const stripTopRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const subtitleRef = useRef<HTMLParagraphElement>(null)
  const stripBottomRef = useRef<HTMLDivElement>(null)

  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  useGSAP(
    () => {
      if (prefersReducedMotion) {
        gsap.set('.kd-event-card', { opacity: 1, y: 0, scaleY: 1 })
        gsap.set('.kd-elephant-divider', { opacity: 1 })
        gsap.set('.kd-elephant-divider__elephant-left', { opacity: 0.25, x: 0 })
        gsap.set('.kd-elephant-divider__elephant-right', { opacity: 0.25, x: 0 })
        gsap.set('.kd-elephant-divider__diamond', { opacity: 0.2, scale: 1 })
        gsap.set(
          [stripTopRef.current, titleRef.current, subtitleRef.current, stripBottomRef.current],
          { opacity: 1, y: 0, scaleX: 1 }
        )
        return
      }

      // Header timeline
      const headerTl = gsap.timeline({
        scrollTrigger: {
          trigger: headerRef.current,
          start: 'top 80%',
          once: true,
        },
        defaults: { ease: 'power2.out' },
      })

      headerTl.fromTo(
        stripTopRef.current,
        { opacity: 0, scaleX: 0 },
        { opacity: 1, scaleX: 1, duration: 0.7, ease: 'power3.out', transformOrigin: 'center center' },
        0
      )

      // Activate kasavu shimmer on top strip
      headerTl.call(() => {
        stripTopRef.current?.querySelector('.kd-kasavu-strip')?.classList.add('kd-kasavu-shimmer-trigger')
      }, [], 0.7)

      headerTl.fromTo(
        titleRef.current,
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.6 },
        0.12
      )

      headerTl.fromTo(
        subtitleRef.current,
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.6 },
        0.24
      )

      // Event cards -- ScrollTrigger.batch with enhanced reveal
      ScrollTrigger.batch('.kd-event-card', {
        start: 'top 85%',
        once: true,
        interval: 0.15,
        batchMax: 2,
        onEnter: (cards) => {
          gsap.fromTo(
            cards,
            { opacity: 0, y: 24, scaleY: 0.96 },
            {
              opacity: 1,
              y: 0,
              scaleY: 1,
              duration: 0.7,
              ease: 'power2.out',
              stagger: 0.2,
              transformOrigin: 'top center',
              onComplete: function () {
                // Add sway class to revealed cards
                (cards as Element[]).forEach(card => {
                  card.classList.add('kd-leaf--sway')
                })
              },
            }
          )
        },
      })

      // Elephant dividers -- walk in from sides
      ScrollTrigger.batch('.kd-elephant-divider', {
        start: 'top 88%',
        once: true,
        interval: 0.15,
        onEnter: (dividers) => {
          dividers.forEach((divider) => {
            const leftEl = divider.querySelector('.kd-elephant-divider__elephant-left')
            const rightEl = divider.querySelector('.kd-elephant-divider__elephant-right')
            const diamond = divider.querySelector('.kd-elephant-divider__diamond')

            // Left elephant walks in from left
            if (leftEl) {
              gsap.fromTo(leftEl,
                { opacity: 0, x: -12 },
                { opacity: 0.25, x: 0, duration: 0.6, ease: 'power2.out' }
              )
            }

            // Right elephant walks in from right
            if (rightEl) {
              gsap.fromTo(rightEl,
                { opacity: 0, x: 12 },
                { opacity: 0.25, x: 0, duration: 0.6, ease: 'power2.out', delay: 0.1 }
              )
            }

            // Diamond center blooms
            if (diamond) {
              gsap.fromTo(diamond,
                { opacity: 0, scale: 0 },
                { opacity: 0.2, scale: 1, duration: 0.3, ease: 'back.out(1.4)', delay: 0.2 }
              )
            }
          })
        },
      })

      // Bottom strip
      gsap.fromTo(
        stripBottomRef.current,
        { opacity: 0, scaleX: 0 },
        {
          opacity: 1,
          scaleX: 1,
          duration: 0.7,
          ease: 'power3.out',
          transformOrigin: 'center center',
          scrollTrigger: {
            trigger: stripBottomRef.current,
            start: 'top 90%',
            once: true,
          },
        }
      )
    },
    { scope: sectionRef }
  )

  return (
    <section
      ref={sectionRef}
      className="kd-celebrations kd-section kd-section--grain"
      aria-label="Celebrations"
    >
      {/* Threshold line */}
      <div className="kd-celebrations__threshold" />

      {/* Palm watermarks */}
      <CoconutPalm
        className="kd-celebrations__palm kd-celebrations__palm--left"
        height={140}
      />
      <CoconutPalm
        className="kd-celebrations__palm kd-celebrations__palm--right"
        height={120}
      />

      <div className="kd-section__content">
        {/* Header */}
        <div ref={headerRef}>
          <div ref={stripTopRef} className="kd-kasavu-strip" style={{ marginBottom: 32 }}>
            <KasavuBorder width={240} height={12} />
          </div>

          <h2 ref={titleRef} className="kd-celebrations__title">Celebrations</h2>
          <p ref={subtitleRef} className="kd-celebrations__subtitle">
            Join us for the festivities
          </p>
        </div>

        {/* Event cards */}
        <div className="kd-celebrations__list">
          {events.map((event, i) => (
            <div key={event.id}>
              {/* Elephant divider (between cards, not before the first) */}
              {i > 0 && (
                <div className="kd-elephant-divider">
                  <span className="kd-elephant-divider__elephant-left">
                    <ElephantMotif size={20} color="var(--kd-lamp-gold)" />
                  </span>
                  <div className="kd-elephant-divider__diamond" />
                  <span className="kd-elephant-divider__elephant-right">
                    <ElephantMotif size={20} flip color="var(--kd-lamp-gold)" />
                  </span>
                </div>
              )}

              <BananaLeaf className="kd-event-card">
                {/* Lotus corners */}
                <Lotus size={16} className="kd-event__lotus-tl" />
                <Lotus size={16} className="kd-event__lotus-br" />

                {/* Event content */}
                <p className="kd-event__date">{formatEventDate(event.date)}</p>
                <h3 className="kd-event__title">{event.title}</h3>
                <div className="kd-event__line" />
                <p className="kd-event__time">{event.time}</p>
                <p className="kd-event__venue">{event.venue}</p>
                <p className="kd-event__address">{event.address}</p>
              </BananaLeaf>
            </div>
          ))}
        </div>

        {/* Bottom kasavu strip */}
        <div ref={stripBottomRef} className="kd-kasavu-strip" style={{ marginTop: 32 }}>
          <KasavuBorder width={240} height={12} />
        </div>
      </div>
    </section>
  )
}
