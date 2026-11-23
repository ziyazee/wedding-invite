/* Countdown — four gilded kalire plaques hang from a pavilion rail on pearl strings,
   staggered in height and swaying a little. Shared countdown logic, own markup.
   Animation: the rail draws, plaques focus-pull in, seconds digits roll when they change. */

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
    <span className="pb-unit__num">
      <span ref={ref} style={{ display: 'block' }}>
        {value}
      </span>
    </span>
  )
}

/** The brass plaque: scalloped bell outline, ivory inset, pearl cap. Gradients live in <PlaqueDefs>. */
function Plaque() {
  return (
    <svg className="pb-unit__plaque" viewBox="0 0 80 100" aria-hidden="true">
      <path
        d="M8 38 C8 22 22 12 40 12 C58 12 72 22 72 38 V76 C72 81 69 83 65 83 C63 92 54 94 50 89 C46 96 34 96 30 89 C26 94 17 92 15 83 C11 83 8 81 8 76 Z"
        fill="url(#pb-plaque-gold)"
        stroke="#9a6a14"
        strokeWidth="0.8"
      />
      <path
        d="M15 39 C15 26 26 19 40 19 C54 19 65 26 65 39 V73 C65 75 64 76 62 76 C60 84 53 85 50 81 C46 87 34 87 30 81 C27 85 20 84 18 76 C16 76 15 75 15 73 Z"
        fill="#fffbfa"
        fillOpacity="0.94"
        stroke="#d49b35"
        strokeWidth="0.6"
      />
      <circle cx="40" cy="9" r="3" fill="#fffbfa" stroke="#b58024" strokeWidth="0.8" />
    </svg>
  )
}

function Countdown({ data, ctx }: SectionProps) {
  const ref = useRef<HTMLElement>(null)
  const t = useCountdown(data.weddingDate)

  useGSAP(
    () => {
      if (ctx.reducedMotion) return
      reveal('.pb-countdown .pb-eyebrow, .pb-countdown .pb-title', { trigger: ref.current, start: 'top 75%' })
      drawOn('.pb-countdown__rail .pb-draw', { trigger: '.pb-countdown__rail', stagger: 0.2, duration: 1.6 })
      reveal('.pb-unit', { trigger: '.pb-countdown__grid', stagger: 0.14, duration: 1.1 })
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
    <section ref={ref} className="pb-section pb-countdown" aria-label="Countdown">
      <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true" focusable="false">
        <defs>
          <linearGradient id="pb-plaque-gold" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#f3c969" />
            <stop offset="0.5" stopColor="#d49b35" />
            <stop offset="1" stopColor="#b58024" />
          </linearGradient>
        </defs>
      </svg>
      <div className="pb-section__inner">
        <p className="pb-eyebrow">Save the date</p>
        <h2 className="pb-title">Until we say I do</h2>

        {t.ended ? (
          <p className="pb-countdown__ended">The celebration has begun</p>
        ) : (
          <div className="pb-countdown__rack" role="timer" aria-live="off">
            <svg className="pb-countdown__rail" viewBox="0 0 342 24" preserveAspectRatio="none" aria-hidden="true">
              <path className="pb-draw" pathLength="1" d="M4 12 C60 2 282 2 338 12" />
              <path className="pb-draw" pathLength="1" d="M4 16 C60 6 282 6 338 16" />
              <circle className="pb-fill-gold" cx="4" cy="14" r="3" />
              <circle className="pb-fill-gold" cx="338" cy="14" r="3" />
            </svg>
            <div className="pb-countdown__grid">
              {units.map((u, i) => (
                <div key={u.key} className={`pb-unit pb-unit--${i % 2 === 0 ? 'high' : 'low'}`}>
                  <div className="pb-unit__swing" style={{ animationDelay: `${-i * 1.3}s` }}>
                    <span className="pb-unit__string" aria-hidden="true" />
                    <div className="pb-unit__body">
                      <Plaque />
                      <div className="pb-unit__face">
                        <Roll value={pad2(u.value)} animate={u.live && !ctx.reducedMotion} />
                        <span className="pb-unit__label">{u.label}</span>
                      </div>
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
    { sprite: 'gulab', motion: 'fall', count: 5, size: [12, 18], opacity: [0.45, 0.8], zone: 'margins', color: 'dawn' },
    { sprite: 'sparkle', motion: 'twinkle', count: 5, size: [10, 18], opacity: [0.3, 0.75], zone: 'upper', color: 'lamp' },
  ],
  Divider: CountdownDivider,
}

export default plugin
