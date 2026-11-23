/* Closing — last section, no divider. A golden-hour carved arch (generated) whose plain interior
   holds the names and date; the dua sits above it. Animation: a khatam rosette draws itself, the blessing lands word by word,
   the sign-off glows in. */

import { useRef } from 'react'
import { gsap, useGSAP, reveal, drawOn, Words, EASE } from '../../core'
import type { SectionPlugin, SectionProps } from '../../core'
import { khatam } from '../khatam'
import './closing.css'

const ROSETTE = khatam(40, 40, 30)

function formatLong(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
}

function Closing({ data, ctx }: SectionProps) {
  const ref = useRef<HTMLElement>(null)
  const { couple } = data
  const blessing = data.blessing ?? 'May this union be blessed with love, joy and togetherness.'
  const note =
    data.personalNote ?? 'Your presence is the greatest gift we could ask for. We look forward to celebrating with you.'

  useGSAP(
    () => {
      if (ctx.reducedMotion) return
      drawOn('.mw-closing__lotus .mw-draw', { trigger: '.mw-closing__lotus', stagger: 0.12, duration: 1.6 })
      reveal('.mw-closing__blessing .mw-word', { trigger: '.mw-closing__blessing', stagger: 0.06, duration: 1 })
      reveal('.mw-closing__note', { trigger: '.mw-closing__note' })
      gsap.from('.mw-closing__sign', {
        opacity: 0,
        letterSpacing: '0.2em',
        filter: 'blur(10px)',
        duration: 2,
        ease: EASE.expo,
        clearProps: 'filter',
        scrollTrigger: { trigger: '.mw-closing__sign', start: 'top 88%', once: true },
      })
      reveal('.mw-closing__date, .mw-closing__foot', { trigger: '.mw-closing__date', delay: 0.4 })
    },
    { scope: ref, dependencies: [ctx.reducedMotion] },
  )

  return (
    <section ref={ref} className="mw-section mw-closing" aria-label="Closing">
      <div className="mw-section__inner">
        <svg className="mw-closing__lotus" viewBox="0 0 80 80" aria-hidden="true">
          <path className="mw-draw" pathLength="1" d={ROSETTE.star} />
          <path className="mw-draw" pathLength="1" d={ROSETTE.upright} />
          <path className="mw-draw" pathLength="1" d={ROSETTE.turned} />
          <circle className="mw-draw" pathLength="1" cx="40" cy="40" r="9" />
        </svg>

        <p className="mw-closing__blessing">
          <Words text={blessing} />
        </p>
        <p className="mw-body mw-closing__note">{note}</p>

        <p className="mw-closing__sign">
          {couple.groomName} &amp; {couple.brideName}
        </p>
        <p className="mw-closing__date">{formatLong(data.weddingDate)}</p>
        <p className="mw-closing__foot">With love &amp; gratitude</p>
      </div>
    </section>
  )
}

const plugin: SectionPlugin = {
  id: 'closing',
  Component: Closing,
  particles: [
    { sprite: 'rosepetal', motion: 'fall', count: 8, size: [12, 18], opacity: [0.5, 0.85], zone: 'upper', color: 'blush' },
    { sprite: 'zari', motion: 'twinkle', count: 5, size: [5, 8], opacity: [0.4, 0.8], zone: 'upper', color: 'goldBright' },
    { sprite: 'khatam', motion: 'twinkle', count: 1, size: [10, 14], opacity: [0.3, 0.55], zone: 'upper', color: 'goldBright' },
  ],
}

export default plugin
