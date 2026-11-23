/* Closing — "Aseesan" (blessings). The painted sarhon field at dusk is the room: the blessing and
   sign-off sit in the clear sky inside the arch (x 15–85%, y 14–70% of the painting), the field
   and the diya sill stay free. Last section, so no divider.
   Animation: a stitched rule draws, the blessing lands word by word, the names glow in. */

import { useRef } from 'react'
import { gsap, useGSAP, useDepthParallax, reveal, drawOn, Words, EASE } from '../../core'
import type { SectionPlugin, SectionProps } from '../../core'
import farSrc from '../../assets/generated/closing-far.jpg'
import nearSrc from '../../assets/generated/closing-near.webp'
import './closing.css'

function formatLong(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
}

function Closing({ data, ctx }: SectionProps) {
  const ref = useRef<HTMLElement>(null)
  useDepthParallax(ref, ctx.reducedMotion)
  const { couple } = data
  const blessing = data.blessing ?? 'Jug jug jeeo. May your home be full and your hearts always together.'

  useGSAP(
    () => {
      if (ctx.reducedMotion) return
      reveal('.ph-closing__eyebrow', { trigger: ref.current, start: 'top 60%' })
      drawOn('.ph-closing__rule .ph-draw', { trigger: ref.current, start: 'top 55%', stagger: 0.1, duration: 1.4 })
      reveal('.ph-closing__blessing .ph-word', { trigger: '.ph-closing__blessing', stagger: 0.05, duration: 0.9 })
      gsap.from('.ph-closing__sign', {
        opacity: 0, y: 14, duration: 1.6, ease: EASE.expo,
        scrollTrigger: { trigger: '.ph-closing__sign', start: 'top 85%', once: true },
      })
      reveal('.ph-closing__date', { trigger: '.ph-closing__date', delay: 0.3 })
    },
    { scope: ref, dependencies: [ctx.reducedMotion] },
  )

  return (
    <section ref={ref} className="ph-section ph-closing" aria-label="Closing">
      {/* Far plate (sky, field) drifts slower than the arch frame; the blessing floats ahead of both. */}
      <img className="ph-closing__layer ph-depth" data-depth="0.13" src={farSrc} alt="" width={1080} height={1920} loading="lazy" decoding="async" />
      <img className="ph-closing__layer ph-depth" data-depth="0.07" src={nearSrc} alt="" width={1080} height={1920} loading="lazy" decoding="async" />
      <div className="ph-closing__inner ph-depth" data-depth="-0.03">
        <p className="ph-closing__eyebrow">Aseesan</p>
        <svg className="ph-closing__rule" viewBox="0 0 120 10" width="120" height="10" aria-hidden="true">
          <path className="ph-draw" pathLength="1" d="M0 5 H46 M74 5 H120" />
          <path className="ph-draw" pathLength="1" d="M60 0 L65 5 L60 10 L55 5 Z" />
        </svg>
        <p className="ph-closing__blessing">
          <Words text={blessing} />
        </p>
        <p className="ph-closing__sign">
          {couple.groomName} &amp; {couple.brideName}
        </p>
        <p className="ph-closing__date">{formatLong(data.weddingDate)}</p>
      </div>
    </section>
  )
}

const plugin: SectionPlugin = {
  id: 'closing',
  Component: Closing,
  particles: [
    { sprite: 'sarhon', motion: 'float', count: 7, size: [10, 18], opacity: [0.3, 0.65], zone: 'lower', color: 'mustard' },
    { sprite: 'flame', motion: 'rise', count: 7, size: [9, 15], opacity: [0.4, 0.8], zone: 'lower', color: 'lamp' },
    { sprite: 'bagh', motion: 'twinkle', count: 4, size: [10, 14], opacity: [0.2, 0.5], zone: 'upper', color: 'goldBright' },
  ],
}

export default plugin
