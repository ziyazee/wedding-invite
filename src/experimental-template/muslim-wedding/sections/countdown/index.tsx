/* Countdown — shared countdown logic, own markup. Four carved-alabaster mihrab plaques (generated art)
   sit in the quiet arch of a marble hall, joined by a gold zari thread with a khatam knot. A rose-coloured
   line traces each plaque's inner arch: the seconds sweep, the rest show their fraction.
   Animation: heading focus-pulls, the thread draws on, plaques settle one by one, digits roll. */

import { useEffect, useRef } from 'react'
import { gsap, useGSAP, reveal, useCountdown, pad2, EASE } from '../../core'
import type { SectionPlugin, SectionProps } from '../../core'
import CountdownDivider from './Divider'
import { khatam } from '../khatam'
import unitSrc from '../../assets/generated/countdown-unit.webp'
import './countdown.css'

/* The inner cusped arch of the plaque art (viewBox matches the art's 220 x 355 ratio). */
const ARCH = 'M40 26 C42 35 48 40 56 46 C64 52 68 59 68 71 V122 H12 V71 C12 59 16 52 24 46 C32 40 38 35 40 26 Z'
const KNOT = khatam(20, 20, 14)

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
    <span className="mw-unit__num">
      <span ref={ref} style={{ display: 'block' }}>
        {value}
      </span>
    </span>
  )
}

function Countdown({ data, ctx }: SectionProps) {
  const ref = useRef<HTMLElement>(null)
  const t = useCountdown(data.weddingDate)

  useGSAP(
    () => {
      if (ctx.reducedMotion) return
      reveal('.mw-countdown .mw-eyebrow, .mw-countdown .mw-title', { trigger: ref.current, start: 'top 75%' })
      const st = { trigger: '.mw-countdown__grid', start: 'top 82%', once: true }
      gsap.from('.mw-countdown__thread i', { scaleX: 0, scaleY: 0, duration: 1.4, ease: EASE.inOut, scrollTrigger: st })
      gsap.from('.mw-countdown__knot .mw-draw', { strokeDashoffset: 1, duration: 1.4, delay: 0.5, stagger: 0.2, ease: 'power2.inOut', scrollTrigger: st })
      gsap.from('.mw-unit', { opacity: 0, filter: 'blur(8px)', scale: 0.94, duration: 1.1, stagger: 0.14, ease: EASE.expo, clearProps: 'filter', scrollTrigger: st })
    },
    { scope: ref, dependencies: [ctx.reducedMotion] },
  )

  const units = [
    { key: 'days', label: 'Days', value: t.days, frac: Math.min(t.days / 100, 1), live: false },
    { key: 'hours', label: 'Hours', value: t.hours, frac: t.hours / 24, live: false },
    { key: 'mins', label: 'Minutes', value: t.minutes, frac: t.minutes / 60, live: false },
    { key: 'secs', label: 'Seconds', value: t.seconds, frac: (t.seconds + 1) / 60, live: true },
  ]

  return (
    <section ref={ref} className="mw-section mw-countdown" aria-label="Countdown">
      <div className="mw-section__inner">
        <p className="mw-eyebrow">Save the date</p>
        <h2 className="mw-title">The appointed hour</h2>

        {t.ended ? (
          <p className="mw-countdown__ended">The celebration has begun</p>
        ) : (
          <div className="mw-countdown__grid" role="timer" aria-live="off">
            <div className="mw-countdown__thread" aria-hidden="true">
              <i className="mw-countdown__thread-h" />
              <i className="mw-countdown__thread-v" />
              <svg className="mw-countdown__knot" viewBox="0 0 40 40">
                <path className="mw-draw" pathLength="1" d={KNOT.star} />
                <path className="mw-draw" pathLength="1" d={KNOT.upright} style={{ opacity: 0.5 }} />
              </svg>
            </div>
            {units.map((u) => (
              <div key={u.key} className="mw-unit">
                <div className="mw-unit__plaque">
                  <img className="mw-unit__art" src={unitSrc} alt="" loading="lazy" decoding="async" />
                  <svg className="mw-unit__ring" viewBox="0 0 80 129" aria-hidden="true">
                    <path className="mw-unit__track" d={ARCH} />
                    <path
                      className={`mw-unit__bar${u.live && u.value !== 0 && !ctx.reducedMotion ? ' is-sweeping' : ''}`}
                      d={ARCH}
                      pathLength="1"
                      style={{ strokeDashoffset: u.live && u.value === 0 ? 1 : 1 - u.frac }}
                    />
                  </svg>
                  <Roll value={pad2(u.value)} animate={u.live && !ctx.reducedMotion} />
                  <span className="mw-unit__label">{u.label}</span>
                </div>
              </div>
            ))}
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
    { sprite: 'zari', motion: 'rise', count: 7, size: [5, 9], opacity: [0.4, 0.8], zone: 'lower', color: 'goldBright' },
    { sprite: 'pearl', motion: 'float', count: 5, size: [6, 10], opacity: [0.5, 0.85], zone: 'margins', color: 'pearl' },
    { sprite: 'attar', motion: 'rise', count: 3, size: [7, 10], opacity: [0.3, 0.6], zone: 'lower', color: 'rose' },
  ],
  Divider: CountdownDivider,
}

export default plugin
