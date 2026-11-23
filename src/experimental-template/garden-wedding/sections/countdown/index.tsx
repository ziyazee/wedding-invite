/* Countdown — a miniature garden pavilion with four cusped niches. The live unit
   traces its gold arch while the digits roll when they change. */

import { useEffect, useRef } from 'react'
import { drawOn, gsap, useGSAP, reveal, useCountdown, pad2, EASE } from '../../core'
import type { SectionPlugin, SectionProps } from '../../core'
import CountdownDivider from './Divider'
import './countdown.css'

/** Cusped Mughal niche, drawn from the base-left up and over to the base-right. */
const ARCH =
  'M4 150 V70 C4 56 13 46 26 41 C25 31 33 23 44 24 C51 14 58 7 62 3 C66 7 73 14 80 24 C91 23 99 31 98 41 C111 46 120 56 120 70 V150'

function PavilionCanopy() {
  const drops = [54, 104, 216, 266]
  return (
    <svg className="gw-countdown__canopy" viewBox="0 0 320 84" aria-hidden="true">
      <path className="gw-draw" pathLength="1" d="M12 24 Q80 -2 160 20 Q240 -2 308 24" />
      <path className="gw-draw" pathLength="1" d="M12 24 H308 M18 32 H302" />
      <path
        className="gw-draw"
        pathLength="1"
        d="M18 32 q9 12 18 0 t18 0 t18 0 t18 0 t18 0 t18 0 t18 0 t18 0 t18 0 t18 0 t18 0 t18 0 t18 0 t18 0 t18 0"
      />
      <path className="gw-draw" pathLength="1" d="M160 20 C153 13 155 7 160 2 C165 7 167 13 160 20Z" />
      {drops.map((x) => (
        <g key={x}>
          <path className="gw-draw" pathLength="1" d={`M${x} 36 V61`} />
          <circle className="gw-countdown__jasmine" cx={x} cy="44" r="2.5" />
          <circle className="gw-countdown__jasmine" cx={x} cy="52" r="2.5" />
          <path className="gw-countdown__bud" d={`M${x} 59 C${x - 6} 65 ${x - 5} 74 ${x} 80 C${x + 5} 74 ${x + 6} 65 ${x} 59Z`} />
        </g>
      ))}
    </svg>
  )
}

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
    <span className="gw-unit__num">
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
      reveal('.gw-countdown .gw-eyebrow, .gw-countdown .gw-title', { trigger: ref.current, start: 'top 75%' })
      drawOn('.gw-countdown__canopy .gw-draw', { trigger: '.gw-countdown__canopy', stagger: 0.05, duration: 1.25 })
      reveal('.gw-countdown__canopy .gw-countdown__jasmine, .gw-countdown__canopy .gw-countdown__bud', {
        trigger: '.gw-countdown__canopy',
        stagger: 0.06,
        duration: 0.8,
      })
      reveal('.gw-unit', { trigger: '.gw-countdown__grid', stagger: 0.12, duration: 1.1 })
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
    <section ref={ref} className="gw-section gw-countdown" aria-label="Countdown">
      <div className="gw-section__inner">
        <p className="gw-eyebrow">Save the date</p>
        <h2 className="gw-title">Until we say I do</h2>
        <PavilionCanopy />

        {t.ended ? (
          <p className="gw-countdown__ended">The celebration has begun</p>
        ) : (
          <div className="gw-countdown__grid" role="timer" aria-live="off">
            {units.map((u, index) => (
              <div key={u.key} className={`gw-unit gw-unit--${index % 2 === 0 ? 'sage' : 'blush'}`}>
                <div className="gw-unit__ring">
                  <svg viewBox="0 0 124 164" aria-hidden="true">
                    <path className="gw-unit__track" d={`${ARCH} Z`} />
                    <path
                      className="gw-unit__track gw-unit__track--inner"
                      d="M12 146 V73 C12 62 20 54 33 50 C32 42 39 36 48 37 C54 28 59 23 62 20 C65 23 70 28 76 37 C85 36 92 42 91 50 C104 54 112 62 112 73 V146"
                    />
                    <path className="gw-unit__carving" d="M9 71 H18 M106 71 H115 M9 81 H18 M106 81 H115" />
                    <path className="gw-unit__carving" d="M4 150 H120 M9 156 H115" />
                    <path className="gw-unit__carving" d="M62 145 C68 149 68 155 62 159 C56 155 56 149 62 145Z" />
                    <path
                      className={`gw-unit__bar${u.live && u.value !== 0 && !ctx.reducedMotion ? ' is-sweeping' : ''}`}
                      d={ARCH}
                      pathLength="1"
                      style={{ strokeDashoffset: u.live && u.value === 0 ? 1 : 1 - u.frac }}
                    />
                  </svg>
                  <Roll value={pad2(u.value)} animate={u.live && !ctx.reducedMotion} />
                  <span className="gw-unit__label">{u.label}</span>
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
    { sprite: 'firefly', motion: 'float', count: 9, size: [10, 20], opacity: [0.25, 0.7], zone: 'full', color: 'gold' },
    { sprite: 'jasmine', motion: 'drift', count: 4, size: [14, 20], opacity: [0.6, 0.95], zone: 'margins', color: 'goldDim' },
  ],
  Divider: CountdownDivider,
}

export default plugin
