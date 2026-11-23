/* Countdown — "Udeekan" (the waiting). The painted vehra at dusk is the whole room: text and four
   aala-niche plaques sit in the clear plaster band between the pillars (x 16–84%, y 11–80%).
   Animation: plaques light up one by one, a phulkari stitch rail draws on beneath, digits roll. */

import { useEffect, useRef } from 'react'
import { gsap, useGSAP, useDepthParallax, reveal, drawOn, useCountdown, pad2, EASE } from '../../core'
import type { SectionPlugin, SectionProps } from '../../core'
import CountdownDivider from './Divider'
import sceneSrc from '../../assets/generated/countdown-vehra-dusk.jpg'
import plaqueSrc from '../../assets/generated/countdown-aala-plaque.webp'
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
    <span className="ph-unit__num">
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
      reveal('.ph-countdown__title, .ph-countdown__line', { trigger: ref.current, start: 'top 70%', stagger: 0.12 })
      gsap.from('.ph-unit', {
        opacity: 0, y: 24, scale: 0.92, duration: 1, stagger: 0.14, ease: EASE.out,
        scrollTrigger: { trigger: '.ph-countdown__grid', start: 'top 85%', once: true },
      })
      drawOn('.ph-countdown__rail .ph-draw', { trigger: '.ph-countdown__rail', duration: 1.6, stagger: 0.1 })
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
    <section ref={ref} className="ph-section ph-countdown" aria-label="Countdown">
      <img className="ph-countdown__scene ph-depth" data-depth="0.1" src={sceneSrc} alt="" width={1080} height={1920} loading="lazy" decoding="async" />
      <div className="ph-countdown__inner ph-depth" data-depth="-0.04">
        <h2 className="ph-countdown__title">Udeekan</h2>
        <p className="ph-countdown__line">The gaagar is being lit. The jaago is coming.</p>

        {t.ended ? (
          <p className="ph-countdown__ended">The celebration has begun</p>
        ) : (
          <div className="ph-countdown__grid" role="timer" aria-live="off">
            {units.map((u) => (
              <div key={u.key} className="ph-unit">
                <img className="ph-unit__plaque" src={plaqueSrc} alt="" width={240} height={367} loading="lazy" decoding="async" />
                <div className="ph-unit__body">
                  <Roll value={pad2(u.value)} animate={Boolean(u.live) && !ctx.reducedMotion} />
                  <span className="ph-unit__stitch" aria-hidden="true">
                    <i style={{ transform: `scaleX(${u.frac})` }} />
                  </span>
                  <span className="ph-unit__label">{u.label}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        <svg className="ph-countdown__rail" viewBox="0 0 220 20" width="220" height="20" aria-hidden="true">
          <path className="ph-draw" pathLength="1" d="M0 10 H78" />
          <path className="ph-draw" pathLength="1" d="M142 10 H220" />
          <path className="ph-draw" pathLength="1" d="M110 2 L118 10 L110 18 L102 10 Z" />
          <path className="ph-draw" pathLength="1" d="M90 10 L94 6 L98 10 L94 14 Z M122 10 L126 6 L130 10 L126 14 Z" />
        </svg>
      </div>
    </section>
  )
}

const plugin: SectionPlugin = {
  id: 'countdown',
  Component: Countdown,
  particles: [
    { sprite: 'kalire', motion: 'float', count: 4, size: [14, 22], opacity: [0.3, 0.55], zone: 'upper', color: 'goldBright' },
    { sprite: 'flame', motion: 'rise', count: 7, size: [9, 15], opacity: [0.4, 0.75], zone: 'lower', color: 'lamp' },
  ],
  Divider: CountdownDivider,
}

export default plugin
