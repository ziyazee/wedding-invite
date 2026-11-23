/* Closing — last section, so no divider. Animation: a mandap draws itself, the blessing
   lands word by word, the sign-off glows in. */

import { useRef } from 'react'
import { gsap, useGSAP, reveal, drawOn, Words, EASE } from '../../core'
import type { SectionPlugin, SectionProps } from '../../core'
import './closing.css'

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
      drawOn('.gw-closing__lotus .gw-draw', { trigger: '.gw-closing__lotus', stagger: 0.12, duration: 1.6 })
      reveal('.gw-closing__blessing .gw-word', { trigger: '.gw-closing__blessing', stagger: 0.06, duration: 1 })
      reveal('.gw-closing__note', { trigger: '.gw-closing__note' })
      gsap.from('.gw-closing__sign', {
        opacity: 0,
        letterSpacing: '0.2em',
        filter: 'blur(10px)',
        duration: 2,
        ease: EASE.expo,
        clearProps: 'filter',
        scrollTrigger: { trigger: '.gw-closing__sign', start: 'top 88%', once: true },
      })
      reveal('.gw-closing__date, .gw-closing__foot', { trigger: '.gw-closing__date', delay: 0.4 })
    },
    { scope: ref, dependencies: [ctx.reducedMotion] },
  )

  return (
    <section ref={ref} className="gw-section gw-closing" aria-label="Closing">
      <div className="gw-section__inner">
        <svg className="gw-closing__lotus" viewBox="0 0 120 88" aria-hidden="true">
          {/* mandap: kalash finial, pyramid roof, scalloped valance, pillars, sacred fire */}
          <circle className="gw-draw" pathLength="1" cx="60" cy="6" r="3" />
          <path className="gw-draw" pathLength="1" d="M60 9 V14" />
          <path className="gw-draw" pathLength="1" d="M12 38 L60 14 L108 38" />
          <path className="gw-draw" pathLength="1" d="M8 38 H112" />
          <path className="gw-draw" pathLength="1" d="M16 38 q6 9 12 0 t12 0 t12 0 t12 0 t12 0 t12 0 t12 0 t12 0" />
          <path className="gw-draw" pathLength="1" d="M18 47 V80 M102 47 V80" />
          <path className="gw-draw" pathLength="1" d="M60 80 C52 72 58 66 60 58 C62 66 68 72 60 80Z" />
          <path className="gw-draw" pathLength="1" d="M6 82 H114" />
        </svg>

        <p className="gw-closing__blessing">
          <Words text={blessing} />
        </p>
        <p className="gw-body gw-closing__note">{note}</p>

        <p className="gw-closing__sign">
          {couple.groomName} &amp; {couple.brideName}
        </p>
        <p className="gw-closing__date">{formatLong(data.weddingDate)}</p>
        <p className="gw-closing__foot">With love &amp; gratitude</p>
      </div>
    </section>
  )
}

const plugin: SectionPlugin = {
  id: 'closing',
  Component: Closing,
  particles: [
    { sprite: 'rosepetal', motion: 'fall', count: 9, size: [10, 20], opacity: [0.35, 0.75], zone: 'margins', color: 'rose' },
    { sprite: 'marigold', motion: 'fall', count: 5, size: [16, 26], opacity: [0.4, 0.75], zone: 'margins', color: 'dawn' },
    { sprite: 'firefly', motion: 'float', count: 6, size: [10, 18], opacity: [0.3, 0.7], zone: 'upper', color: 'gold' },
  ],
}

export default plugin
