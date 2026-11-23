/* Countdown — "Counting Down". The painted night courtyard is the whole room: the title, a
   Insha'Allah calligraphy line and four niche plaques sit on the pale back wall (about 28–62% of the
   painting). Animation: plaques light up one by one, a girih rail draws on beneath, digits roll. */

import { useEffect, useRef } from 'react'
import { gsap, useGSAP, useDepthParallax, reveal, drawOn, useCountdown, pad2, EASE } from '../../core'
import type { SectionPlugin, SectionProps } from '../../core'
import CountdownDivider from './Divider'
import sceneSrc from '../../assets/generated/countdown-courtyard-night.jpg'
import plaqueSrc from '../../assets/generated/countdown-niche-plaque.webp'
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
    <span className="mr-unit__num">
      <span ref={ref} style={{ display: 'block' }}>
        {value}
      </span>
    </span>
  )
}

function Countdown({ data, ctx }: SectionProps) {
  const ref = useRef<HTMLElement>(null)
  const t = useCountdown(data.weddingDate)
  useDepthParallax(ref, ctx.reducedMotion)

  useGSAP(
    () => {
      if (ctx.reducedMotion) return
      reveal('.mr-countdown__title, .mr-countdown__line', { trigger: ref.current, start: 'top 70%', stagger: 0.12 })
      gsap.from('.mr-unit', {
        opacity: 0, y: 24, scale: 0.92, duration: 1, stagger: 0.14, ease: EASE.out,
        scrollTrigger: { trigger: '.mr-countdown__grid', start: 'top 85%', once: true },
      })
      drawOn('.mr-countdown__rail .mr-draw', { trigger: '.mr-countdown__rail', duration: 1.6, stagger: 0.1 })
    },
    { scope: ref, dependencies: [ctx.reducedMotion] },
  )

  const units = [
    { key: 'days', label: 'Days', value: t.days, frac: Math.min(t.days / 100, 1) },
    { key: 'hours', label: 'Hours', value: t.hours, frac: t.hours / 24 },
    { key: 'mins', label: 'Minutes', value: t.minutes, frac: t.minutes / 60 },
    { key: 'secs', label: 'Seconds', value: t.seconds, frac: t.seconds / 60, live: true },
  ]

  return (
    <section ref={ref} className="mr-section mr-countdown" aria-label="Countdown">
      <img className="mr-countdown__scene mr-depth" data-depth="0.1" src={sceneSrc} alt="" width={1080} height={1920} loading="lazy" decoding="async" />
      <div className="mr-countdown__inner mr-depth" data-depth="-0.04">
        <h2 className="mr-countdown__title">Counting Down</h2>
        <p className="mr-countdown__line mr-arabic" lang="ar" dir="rtl">إن شاء الله</p>

        {t.ended ? (
          <p className="mr-countdown__ended">The celebration has begun</p>
        ) : (
          <div className="mr-countdown__grid" role="timer" aria-live="off">
            {units.map((u) => (
              <div key={u.key} className="mr-unit">
                <img className="mr-unit__plaque" src={plaqueSrc} alt="" width={260} height={457} loading="lazy" decoding="async" />
                <div className="mr-unit__body">
                  <Roll value={pad2(u.value)} animate={Boolean(u.live) && !ctx.reducedMotion} />
                  <span className="mr-unit__stitch" aria-hidden="true">
                    <i style={{ transform: `scaleX(${u.frac})` }} />
                  </span>
                  <span className="mr-unit__label">{u.label}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        <svg className="mr-countdown__rail" viewBox="0 0 220 16" width="220" height="16" aria-hidden="true">
          <path className="mr-draw" pathLength="1" d="M0 8 H82" />
          <path className="mr-draw" pathLength="1" d="M138 8 H220" />
          <path className="mr-draw" pathLength="1" d="M110 1 L117 8 L110 15 L103 8 Z" />
          <path className="mr-draw" pathLength="1" d="M105.5 3.5 H114.5 V12.5 H105.5 Z" />
          <path className="mr-draw" pathLength="1" d="M92 8 L96 4 L100 8 L96 12 Z M120 8 L124 4 L128 8 L124 12 Z" />
        </svg>
      </div>
    </section>
  )
}

const plugin: SectionPlugin = {
  id: 'countdown',
  Component: Countdown,
  particles: [
    { sprite: 'hilal', motion: 'float', count: 4, size: [14, 20], opacity: [0.3, 0.55], zone: 'upper', color: 'goldBright' },
    { sprite: 'girih', motion: 'twinkle', count: 6, size: [10, 16], opacity: [0.2, 0.5], zone: 'margins', color: 'sapphire' },
    { sprite: 'rose', motion: 'fall', count: 6, size: [11, 17], opacity: [0.35, 0.65], zone: 'lower', color: 'rose' },
  ],
  Divider: CountdownDivider,
}

export default plugin
