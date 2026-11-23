/* Countdown — four stepped padi-kolam plaques in arakku lacquer and zari stand in the open
   sky of a Chettinad valavu. Shared countdown logic, own markup.
   Animation: the zari thread draws, plaques focus-pull in, seconds digits roll when they change. */

import { useEffect, useRef } from 'react'
import { gsap, useGSAP, reveal, drawOn, useCountdown, pad2, EASE } from '../../core'
import type { SectionPlugin, SectionProps } from '../../core'
import CountdownDivider from './Divider'
import './countdown.css'

function Roll({ value, animate }: { value: string; animate: boolean }) {
  const ref = useRef<HTMLSpanElement>(null)
  const prev = useRef(value)
  useEffect(() => {
    if (prev.current === value) return
    prev.current = value
    if (!animate || !ref.current) return
    const tween = gsap.fromTo(ref.current, { yPercent: 70, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.5, ease: EASE.out })
    return () => {
      tween.kill()
    }
  }, [value, animate])
  return (
    <span className="tm-unit__num">
      <span ref={ref} style={{ display: 'block' }}>
        {value}
      </span>
    </span>
  )
}

/** The padi plaque: a square whose corners step in like a padi kolam, lacquer face, zari double rule. */
function Plaque() {
  return (
    <svg className="tm-unit__plaque" viewBox="0 0 80 92" aria-hidden="true">
      <path
        d="M14 0 H66 V8 H74 V16 H80 V76 H74 V84 H66 V92 H14 V84 H6 V76 H0 V16 H6 V8 H14Z"
        fill="url(#tm-plaque-lacquer)"
        stroke="#c9a24b"
        strokeWidth="1.4"
        strokeLinejoin="miter"
      />
      <path
        d="M17 5 H63 V12 H70 V19 H75 V73 H70 V80 H63 V87 H17 V80 H10 V73 H5 V19 H10 V12 H17Z"
        fill="none"
        stroke="#e4cfa3"
        strokeWidth="0.7"
        opacity="0.8"
      />
      <path d="M32 9 H48" stroke="#e4cfa3" strokeWidth="1" strokeLinecap="round" opacity="0.75" />
      <path d="M32 83 H48" stroke="#e4cfa3" strokeWidth="1" strokeLinecap="round" opacity="0.75" />
    </svg>
  )
}

function Countdown({ data, ctx }: SectionProps) {
  const ref = useRef<HTMLElement>(null)
  const t = useCountdown(data.weddingDate)

  useGSAP(
    () => {
      if (ctx.reducedMotion) return
      reveal('.tm-countdown .tm-eyebrow, .tm-countdown .tm-title', { trigger: ref.current, start: 'top 75%' })
      drawOn('.tm-countdown__thread .tm-draw', { trigger: '.tm-countdown__thread', stagger: 0.2, duration: 1.6 })
      reveal('.tm-unit', { trigger: '.tm-countdown__grid', stagger: 0.14, duration: 1.1 })
    },
    { scope: ref, dependencies: [ctx.reducedMotion] },
  )

  const units = [
    { key: 'days', label: 'Days', value: t.days, live: false },
    { key: 'hours', label: 'Hours', value: t.hours, live: false },
    { key: 'mins', label: 'Minutes', value: t.minutes, live: false },
    { key: 'secs', label: 'Seconds', value: t.seconds, live: true },
  ]

  return (
    <section ref={ref} className="tm-section tm-countdown" aria-label="Countdown">
      <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true" focusable="false">
        <defs>
          <linearGradient id="tm-plaque-lacquer" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#b8202e" />
            <stop offset="0.55" stopColor="#8e1b1b" />
            <stop offset="1" stopColor="#6a1313" />
          </linearGradient>
        </defs>
      </svg>
      <div className="tm-section__inner">
        <p className="tm-eyebrow" lang="ta">சுப முகூர்த்தம்</p>
        <h2 className="tm-title">Until the muhurtham</h2>

        {t.ended ? (
          <p className="tm-countdown__ended">The celebration has begun</p>
        ) : (
          <div className="tm-countdown__rack" role="timer" aria-live="off">
            <svg className="tm-countdown__thread" viewBox="0 0 342 12" preserveAspectRatio="none" aria-hidden="true">
              <path className="tm-draw" pathLength="1" d="M0 6 H342" />
            </svg>
            <div className="tm-countdown__grid">
              {units.map((u) => (
                <div key={u.key} className="tm-unit">
                  <div className="tm-unit__body">
                    <Plaque />
                    <div className="tm-unit__face">
                      <Roll value={pad2(u.value)} animate={u.live && !ctx.reducedMotion} />
                      <span className="tm-unit__label">{u.label}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

const plugin: SectionPlugin = {
  id: 'countdown',
  Component: Countdown,
  particles: [
    { sprite: 'shenbagam', motion: 'fall', count: 4, size: [12, 18], opacity: [0.5, 0.85], zone: 'margins', color: 'lamp' },
    { sprite: 'sparkle', motion: 'twinkle', count: 4, size: [10, 16], opacity: [0.3, 0.7], zone: 'upper', color: 'lamp' },
  ],
  Divider: CountdownDivider,
}

export default plugin
