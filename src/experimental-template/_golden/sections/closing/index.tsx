/* Closing — last section, so no divider. Animation: a lotus draws itself, the blessing
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
      drawOn('.gd-closing__lotus .gd-draw', { trigger: '.gd-closing__lotus', stagger: 0.12, duration: 1.6 })
      reveal('.gd-closing__blessing .gd-word', { trigger: '.gd-closing__blessing', stagger: 0.06, duration: 1 })
      reveal('.gd-closing__note', { trigger: '.gd-closing__note' })
      gsap.from('.gd-closing__sign', {
        opacity: 0,
        letterSpacing: '0.2em',
        filter: 'blur(10px)',
        duration: 2,
        ease: EASE.expo,
        clearProps: 'filter',
        scrollTrigger: { trigger: '.gd-closing__sign', start: 'top 88%', once: true },
      })
      reveal('.gd-closing__date, .gd-closing__foot', { trigger: '.gd-closing__date', delay: 0.4 })
    },
    { scope: ref, dependencies: [ctx.reducedMotion] },
  )

  return (
    <section ref={ref} className="gd-section gd-closing" aria-label="Closing">
      <div className="gd-section__inner">
        <svg className="gd-closing__lotus" viewBox="0 0 96 64" aria-hidden="true">
          <path className="gd-draw" pathLength="1" d="M48 6 C60 18 60 40 48 56 C36 40 36 18 48 6Z" />
          <path className="gd-draw" pathLength="1" d="M48 56 C34 52 20 42 18 24 C30 26 42 36 48 56" />
          <path className="gd-draw" pathLength="1" d="M48 56 C62 52 76 42 78 24 C66 26 54 36 48 56" />
          <path className="gd-draw" pathLength="1" d="M48 56 C26 58 10 52 2 42 C16 40 34 46 48 56" />
          <path className="gd-draw" pathLength="1" d="M48 56 C70 58 86 52 94 42 C80 40 62 46 48 56" />
        </svg>

        <p className="gd-closing__blessing">
          <Words text={blessing} />
        </p>
        <p className="gd-body gd-closing__note">{note}</p>

        <p className="gd-closing__sign">
          {couple.groomName} &amp; {couple.brideName}
        </p>
        <p className="gd-closing__date">{formatLong(data.weddingDate)}</p>
        <p className="gd-closing__foot">With love &amp; gratitude</p>
      </div>
    </section>
  )
}

const plugin: SectionPlugin = {
  id: 'closing',
  Component: Closing,
  particles: [
    { sprite: 'ember', motion: 'rise', count: 12, size: [8, 18], opacity: [0.35, 0.8], zone: 'full', color: 'dawn' },
    { sprite: 'sparkle', motion: 'twinkle', count: 6, size: [10, 18], opacity: [0.25, 0.65], zone: 'upper', color: 'goldBright' },
  ],
}

export default plugin
