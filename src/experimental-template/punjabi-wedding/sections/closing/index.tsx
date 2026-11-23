/* Closing — last section, so no divider. Animation: a diamond ornament draws itself, the blessing
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
      drawOn('.pb-closing__orn .pb-draw', { trigger: '.pb-closing__orn', stagger: 0.12, duration: 1.6 })
      reveal('.pb-closing__blessing .pb-word', { trigger: '.pb-closing__blessing', stagger: 0.06, duration: 1 })
      reveal('.pb-closing__note', { trigger: '.pb-closing__note' })
      gsap.from('.pb-closing__sign', {
        opacity: 0,
        letterSpacing: '0.2em',
        filter: 'blur(10px)',
        duration: 2,
        ease: EASE.expo,
        clearProps: 'filter',
        scrollTrigger: { trigger: '.pb-closing__sign', start: 'top 88%', once: true },
      })
      reveal('.pb-closing__date', { trigger: '.pb-closing__date', delay: 0.4 })
    },
    { scope: ref, dependencies: [ctx.reducedMotion] },
  )

  return (
    <section ref={ref} className="pb-section pb-closing" aria-label="Closing">
      <div className="pb-section__inner">
        <svg className="pb-closing__orn" viewBox="0 0 120 44" aria-hidden="true">
          <path className="pb-draw" pathLength="1" d="M0 22 H44 M76 22 H120" />
          <path className="pb-draw" pathLength="1" d="M60 4 L74 22 L60 40 L46 22 Z" />
          <path className="pb-draw" pathLength="1" d="M60 12 L68 22 L60 32 L52 22 Z" />
          <circle className="pb-fill-gold" cx="60" cy="22" r="2" />
        </svg>

        <p className="pb-closing__blessing">
          <Words text={blessing} />
        </p>
        <p className="pb-body pb-closing__note">{note}</p>

        <p className="pb-closing__sign">
          {couple.groomName} &amp; {couple.brideName}
        </p>
        <p className="pb-closing__date">{formatLong(data.weddingDate)}</p>
      </div>
    </section>
  )
}

const plugin: SectionPlugin = {
  id: 'closing',
  Component: Closing,
  particles: [
    { sprite: 'gulab', motion: 'fall', count: 10, size: [12, 20], opacity: [0.5, 0.85], zone: 'full', color: 'dawn' },
    { sprite: 'sparkle', motion: 'twinkle', count: 6, size: [10, 18], opacity: [0.3, 0.75], zone: 'upper', color: 'lamp' },
  ],
}

export default plugin
