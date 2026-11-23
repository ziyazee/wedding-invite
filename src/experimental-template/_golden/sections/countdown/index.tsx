/* Countdown — shared countdown logic, own markup. Animation: units focus-pull in,
   the seconds ring sweeps, digits roll when they change. */

import { useEffect, useRef } from 'react'
import { gsap, useGSAP, reveal, useCountdown, pad2, EASE } from '../../core'
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
    <span className="gd-unit__num">
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
      reveal('.gd-countdown .gd-eyebrow, .gd-countdown .gd-title', { trigger: ref.current, start: 'top 75%' })
      reveal('.gd-unit', { trigger: '.gd-countdown__grid', stagger: 0.12, duration: 1.1 })
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
    <section ref={ref} className="gd-section gd-countdown" aria-label="Countdown">
      <div className="gd-section__inner">
        <p className="gd-eyebrow">Save the date</p>
        <h2 className="gd-title">Until we say I do</h2>

        {t.ended ? (
          <p className="gd-countdown__ended">The celebration has begun</p>
        ) : (
          <div className="gd-countdown__grid" role="timer" aria-live="off">
            {units.map((u) => (
              <div key={u.key} className="gd-unit">
                <div className="gd-unit__ring">
                  <svg viewBox="0 0 84 84" aria-hidden="true">
                    <circle className="gd-unit__track" cx="42" cy="42" r="40" />
                    <circle
                      className={`gd-unit__bar${u.live && u.value !== 0 && !ctx.reducedMotion ? ' is-sweeping' : ''}`}
                      cx="42"
                      cy="42"
                      r="40"
                      pathLength="1"
                      style={{ strokeDashoffset: u.live && u.value === 0 ? 1 : 1 - u.frac }}
                    />
                  </svg>
                  <Roll value={pad2(u.value)} animate={u.live && !ctx.reducedMotion} />
                </div>
                <span className="gd-unit__label">{u.label}</span>
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
    { sprite: 'ember', motion: 'rise', count: 9, size: [8, 16], opacity: [0.3, 0.65], zone: 'full', color: 'lamp' },
    { sprite: 'mote', motion: 'float', count: 5, size: [3, 5], opacity: [0.25, 0.6], zone: 'full', color: 'goldBright' },
  ],
  Divider: CountdownDivider,
}

export default plugin
