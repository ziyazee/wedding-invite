/* Closing — "Duas" (prayers). The painted night garden is the room: the dua in Arabic, its English
   meaning and the sign-off sit in the clear night sky inside the arch (x 20–80%, y 24–60% of the
   painting), the skyline, water and rose-strewn sill stay free. Last section, so no divider.
   Animation: a girih rule draws, the dua fades in, the English lands word by word, the names glow in. */

import { useRef } from 'react'
import { gsap, useGSAP, useDepthParallax, reveal, drawOn, Words, EASE } from '../../core'
import type { SectionPlugin, SectionProps } from '../../core'
import nearSrc from '../../assets/generated/closing-near.webp'
import './closing.css'

function formatLong(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
}

function Closing({ data, ctx }: SectionProps) {
  const ref = useRef<HTMLElement>(null)
  useDepthParallax(ref, ctx.reducedMotion)
  const { couple } = data
  const blessing = data.blessing ?? 'May Allah bless you both, shower His blessings upon you, and unite you in goodness.'

  useGSAP(
    () => {
      if (ctx.reducedMotion) return
      gsap.from('.mr-closing__dua', { opacity: 0, y: 10, filter: 'blur(6px)', duration: 2, ease: EASE.out, scrollTrigger: { trigger: ref.current, start: 'top 60%', once: true } })
      drawOn('.mr-closing__rule .mr-draw', { trigger: ref.current, start: 'top 55%', stagger: 0.1, duration: 1.4 })
      reveal('.mr-closing__blessing .mr-word', { trigger: '.mr-closing__blessing', stagger: 0.05, duration: 0.9 })
      gsap.from('.mr-closing__sign', {
        opacity: 0, y: 14, duration: 1.6, ease: EASE.expo,
        scrollTrigger: { trigger: '.mr-closing__sign', start: 'top 85%', once: true },
      })
      reveal('.mr-closing__date', { trigger: '.mr-closing__date', delay: 0.3 })
    },
    { scope: ref, dependencies: [ctx.reducedMotion] },
  )

  return (
    <section ref={ref} className="mr-section mr-closing" aria-label="Closing">
      {/* One painted plate: moving a split sky/garden plate tore the horizon, so it drifts as a single piece. */}
      <img className="mr-closing__layer mr-depth" data-depth="0.07" src={nearSrc} alt="" width={1080} height={1920} loading="lazy" decoding="async" />
      <div className="mr-closing__inner mr-depth" data-depth="-0.03">
        <p className="mr-closing__dua mr-arabic" lang="ar" dir="rtl">
          <span>بَارَكَ اللَّهُ لَكُمَا</span>
          <span>وَبَارَكَ عَلَيْكُمَا</span>
          <span>وَجَمَعَ بَيْنَكُمَا فِي خَيْرٍ</span>
        </p>
        <svg className="mr-closing__rule" viewBox="0 0 140 14" width="140" height="14" aria-hidden="true">
          <path className="mr-draw" pathLength="1" d="M0 7 H52 M88 7 H140" />
          <path className="mr-draw" pathLength="1" d="M70 0 L77 7 L70 14 L63 7 Z" />
          <path className="mr-draw" pathLength="1" d="M66.5 3.5 H73.5 V10.5 H66.5 Z" />
        </svg>
        <p className="mr-closing__blessing">
          <Words text={blessing} />
        </p>
        <p className="mr-closing__sign">
          {couple.groomName} &amp; {couple.brideName}
        </p>
        <p className="mr-closing__date">{formatLong(data.weddingDate)}</p>
      </div>
    </section>
  )
}

const plugin: SectionPlugin = {
  id: 'closing',
  Component: Closing,
  particles: [
    { sprite: 'zarr', motion: 'twinkle', count: 8, size: [8, 12], opacity: [0.35, 0.9], zone: 'upper', color: 'goldBright' },
    { sprite: 'flame', motion: 'rise', count: 6, size: [9, 15], opacity: [0.4, 0.8], zone: 'lower', color: 'lamp' },
  ],
}

export default plugin
