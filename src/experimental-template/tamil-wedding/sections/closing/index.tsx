/* Closing — last section, so no divider. The manavarai scene is the backdrop; the blessing sits in the
   quiet parchment above it. Animation: a lotus ornament draws itself, the blessing lands word by word,
   the sign-off glows in. */

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
      drawOn('.tm-closing__orn .tm-draw', { trigger: '.tm-closing__orn', stagger: 0.12, duration: 1.6 })
      reveal('.tm-closing__blessing .tm-word', { trigger: '.tm-closing__blessing', stagger: 0.06, duration: 1 })
      reveal('.tm-closing__note', { trigger: '.tm-closing__note' })
      gsap.from('.tm-closing__sign', {
        opacity: 0,
        letterSpacing: '0.2em',
        filter: 'blur(10px)',
        duration: 2,
        ease: EASE.expo,
        clearProps: 'filter',
        scrollTrigger: { trigger: '.tm-closing__sign', start: 'top 88%', once: true },
      })
      reveal('.tm-closing__date', { trigger: '.tm-closing__date', delay: 0.4 })
    },
    { scope: ref, dependencies: [ctx.reducedMotion] },
  )

  return (
    <section ref={ref} className="tm-section tm-closing" aria-label="Closing">
      <div className="tm-section__inner">
        <svg className="tm-closing__orn" viewBox="0 0 120 44" aria-hidden="true">
          <path className="tm-draw" pathLength="1" d="M0 38 H46 M74 38 H120" />
          <path className="tm-draw" pathLength="1" d="M60 6 C52 16 52 28 60 38 C68 28 68 16 60 6Z" />
          <path className="tm-draw" pathLength="1" d="M60 38 C45 37 37 28 35 19 C47 19 56 27 60 38Z" />
          <path className="tm-draw" pathLength="1" d="M60 38 C75 37 83 28 85 19 C73 19 64 27 60 38Z" />
          <circle className="tm-fill-gold" cx="60" cy="3" r="1.8" />
        </svg>

        <p className="tm-closing__blessing">
          <Words text={blessing} />
        </p>
        <p className="tm-body tm-closing__note">{note}</p>

        <p className="tm-closing__sign">
          {couple.groomName} &amp; {couple.brideName}
        </p>
        <p className="tm-closing__date">{formatLong(data.weddingDate)}</p>
      </div>
    </section>
  )
}

const plugin: SectionPlugin = {
  id: 'closing',
  Component: Closing,
  particles: [
    { sprite: 'kanakambaram', motion: 'fall', count: 4, size: [14, 20], opacity: [0.5, 0.85], zone: 'upper', color: 'dawn' },
    { sprite: 'sparkle', motion: 'twinkle', count: 4, size: [10, 16], opacity: [0.3, 0.7], zone: 'upper', color: 'lamp' },
  ],
}

export default plugin
