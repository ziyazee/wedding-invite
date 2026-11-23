/* Opening — the haveli deorhi at winter dusk. Image mode: no gate, slow push, then the greeting settles
   into the clear sky band between the toran and the cornice (about 27–44% of the painting).
   The scroll hint sits on the plain threshold slab at the foot of the painting. */

import { useRef } from 'react'
import { gsap, useGSAP, useDepthParallax, EASE } from '../../core'
import type { SectionPlugin, SectionProps } from '../../core'
import OpeningDivider from './Divider'
import farSrc from '../../assets/generated/opening-far.jpg'
import './opening.css'

function formatDotDate(iso: string): string {
  const d = new Date(iso)
  const dd = String(d.getDate()).padStart(2, '0')
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  return `${dd} · ${mm} · ${d.getFullYear()}`
}

function Opening({ data, ctx }: SectionProps) {
  const { couple, weddingDate } = data
  const media = ctx.media
  const sectionRef = useRef<HTMLElement>(null)
  useDepthParallax(sectionRef, ctx.reducedMotion)

  useGSAP(
    (_context, safe) => {
      if (ctx.reducedMotion) return

      const tl = gsap.timeline({ paused: true, defaults: { ease: EASE.out } })
      tl.from('.ph-opening__eyebrow', { opacity: 0, y: 10, letterSpacing: '0.5em', duration: 1.5 }, 0)
        .from('.ph-opening__name--groom', { opacity: 0, y: 18, duration: 1.3 }, 0.3)
        .from('.ph-opening__amp', { opacity: 0, rotate: -12, scale: 0.7, duration: 1 }, 0.7)
        .from('.ph-opening__name--bride', { opacity: 0, y: 18, duration: 1.3 }, 0.95)
        .from('.ph-opening__orn .ph-draw', { strokeDashoffset: 1, duration: 1.4, stagger: 0.1, ease: 'power2.inOut' }, 1.5)
        .from('.ph-opening__date', { opacity: 0, duration: 1.1 }, 2)
        .from('.ph-opening__hint', { opacity: 0, duration: 1 }, 2.7)
      tl.progress(0)

      // Slow push toward the doors, ending with the lamps on the steps.
      gsap.to('.ph-opening__stage', { scale: 1.06, duration: 26, ease: 'none', yoyo: true, repeat: -1 })
      // A faint breathing glow behind the greeting, like lamplight on lime-wash.
      gsap.to('.ph-opening__glow', { opacity: 0.55, duration: 4.5, ease: 'sine.inOut', yoyo: true, repeat: -1 })

      let started = false
      const play = () => {
        if (started) return
        started = true
        tl.play()
      }
      const img = sectionRef.current?.querySelector<HTMLImageElement>('.ph-opening__near')
      const go = safe!(() => window.setTimeout(play, 350))
      if (img?.complete) go()
      else img?.addEventListener('load', go, { once: true })
      const fallback = window.setTimeout(play, 2500)
      return () => window.clearTimeout(fallback)
    },
    { scope: sectionRef, dependencies: [ctx.reducedMotion, media?.src] },
  )

  return (
    <section ref={sectionRef} className="ph-section ph-opening" aria-label="Wedding invitation" data-depth-origin="top" data-depth-clamp="1200">
      {/* Two painted planes: the far plate (sky, field, tree seen through the doorway) lags the page
          more than the near plate (gateway, toran, steps), so the doorway opens up as you scroll. */}
      <div className="ph-opening__stage" role="img" aria-label={media?.alt}>
        <img className="ph-opening__far ph-depth" data-depth="0.36" src={farSrc} alt="" width={1080} height={1920} decoding="async" />
        {media ? (
          <img className="ph-opening__near ph-depth" data-depth="0.28" src={media.src} alt="" width={1080} height={1920} decoding="async" fetchPriority="high" />
        ) : null}
      </div>
      <div className="ph-opening__veil" />
      <div className="ph-opening__glow" aria-hidden="true" />

      <div className="ph-opening__content">
        <p className="ph-opening__eyebrow">Jee Aayan Nu</p>
        <h1 className="ph-opening__names">
          <span className="ph-opening__name--groom">{couple.groomName}</span>
          <span className="ph-opening__amp">&amp;</span>
          <span className="ph-opening__name--bride">{couple.brideName}</span>
        </h1>
        <svg className="ph-opening__orn" width="180" height="12" viewBox="0 0 180 12" aria-hidden="true">
          <path className="ph-draw" pathLength="1" d="M0 6 H70" />
          <path className="ph-draw" pathLength="1" d="M90 1 L95 6 L90 11 L85 6 Z" />
          <path className="ph-draw" pathLength="1" d="M110 6 H180" />
        </svg>
        <p className="ph-opening__date">{formatDotDate(weddingDate)}</p>
      </div>

      <div className="ph-opening__hint" aria-hidden="true">
        Scroll
        <i />
      </div>
    </section>
  )
}

const plugin: SectionPlugin = {
  id: 'opening',
  Component: Opening,
  media: 'self',
  particles: [
    { sprite: 'flame', motion: 'rise', count: 9, size: [10, 18], opacity: [0.4, 0.8], zone: 'lower', color: 'lamp' },
    { sprite: 'sarhon', motion: 'float', count: 6, size: [12, 20], opacity: [0.35, 0.7], zone: 'margins', color: 'mustard' },
  ],
  Divider: OpeningDivider,
}

export default plugin
