/* Opening — the marble iwan at dusk. Image mode: no gate, slow push, then the Bismillah and names settle
   into the clear night-sky band between the mogra garlands and the cornice (about 14–31% of the painting).
   The scroll hint sits on the marble floor at the foot of the painting. */

import { useEffect, useRef, useState } from 'react'
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

  const needsTap = !ctx.reducedMotion
  const [opened, setOpened] = useState(!needsTap)
  const revealTl = useRef<gsap.core.Timeline | null>(null)

  // Lock scroll until the curtains are drawn.
  useEffect(() => {
    if (!needsTap) return
    ctx.scroll.stop()
    return () => ctx.scroll.start()
  }, [needsTap, ctx.scroll])

  const { contextSafe } = useGSAP(
    () => {
      if (ctx.reducedMotion) return

      const tl = gsap.timeline({ paused: true, defaults: { ease: EASE.out } })
      tl.from('.mr-opening__bismillah', { opacity: 0, y: 12, filter: 'blur(6px)', duration: 1.8 }, 0)
        .from('.mr-opening__name--groom', { opacity: 0, y: 18, duration: 1.3 }, 0.3)
        .from('.mr-opening__amp', { opacity: 0, rotate: -12, scale: 0.7, duration: 1 }, 0.7)
        .from('.mr-opening__name--bride', { opacity: 0, y: 18, duration: 1.3 }, 0.95)
        .from('.mr-opening__date', { opacity: 0, y: 8, duration: 1.1 }, 2.2)
        .from('.mr-opening__hint', { opacity: 0, duration: 1 }, 2.7)
      tl.progress(0)
      revealTl.current = tl

      // Slow push toward the garden, the Taj Mahal drawing closer behind the arch.
      gsap.to('.mr-opening__stage', { scale: 1.06, duration: 26, ease: 'none', yoyo: true, repeat: -1 })
    },
    { scope: sectionRef, dependencies: [ctx.reducedMotion, media?.src] },
  )

  const handleOpen = contextSafe(() => {
    if (opened) return
    setOpened(true)
    ctx.scroll.start()
    ctx.music.start()
    gsap.to('.mr-curtain__cta', { opacity: 0, scale: 0.9, duration: 0.5, ease: 'power1.out', pointerEvents: 'none' })
    const open = gsap.timeline({ onComplete: () => gsap.set('.mr-curtain', { display: 'none' }) })
    open
      .to('.mr-curtain__panel--l', { xPercent: -104, duration: 2.6, ease: 'power2.inOut' }, 0.35)
      .to('.mr-curtain__panel--r', { xPercent: 104, duration: 2.6, ease: 'power2.inOut' }, 0.35)
      .add(() => revealTl.current?.play(), 1.5)
  })

  return (
    <section ref={sectionRef} className="mr-section mr-opening" aria-label="Wedding invitation" data-depth-origin="top" data-depth-clamp="1200">
      {/* Two painted planes: the far plate (twilight sky, Taj Mahal, garden seen through the arch) lags the
          page more than the near plate (iwan, garlands, steps), so the arch opens up as you scroll. */}
      <div className="mr-opening__stage" role="img" aria-label={media?.alt}>
        <img className="mr-opening__far mr-depth" data-depth="0.36" src={farSrc} alt="" width={1080} height={1920} decoding="async" />
        {media ? (
          <img className="mr-opening__near mr-depth" data-depth="0.28" src={media.src} alt="" width={1080} height={1920} decoding="async" fetchPriority="high" />
        ) : null}
      </div>

      {/* Lettering sits in the painting's clear night sky between the two garlands. */}
      <div className="mr-opening__content">
        <p className="mr-opening__bismillah mr-arabic" lang="ar" dir="rtl" aria-label="Bismillah ir-Rahman ir-Rahim">
          بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
        </p>
        <h1 className="mr-opening__names">
          <span className="mr-opening__name--groom">{couple.groomName}</span>
          <span className="mr-opening__amp">&amp;</span>
          <span className="mr-opening__name--bride">{couple.brideName}</span>
        </h1>
        <p className="mr-opening__date">{formatDotDate(weddingDate)}</p>
      </div>

      {needsTap && !opened ? (
        <button type="button" className="mr-curtain__cta" onClick={handleOpen} aria-label="Open the invitation">
          <span className="mr-curtain__seal" aria-hidden="true">
            <svg viewBox="0 0 160 160" className="mr-curtain__seal-art">
              <defs>
                <linearGradient id="mr-seal-gold" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0" stopColor="#f1d58e" />
                  <stop offset="0.5" stopColor="#c99a3c" />
                  <stop offset="1" stopColor="#8a6420" />
                </linearGradient>
              </defs>
              <circle cx="80" cy="80" r="77" fill="none" stroke="url(#mr-seal-gold)" strokeWidth="1.4" />
              <g className="mr-curtain__seal-spin">
                <circle cx="80" cy="80" r="70" fill="none" stroke="#dcbe7a" strokeWidth="2" strokeDasharray="0.5 6.2" strokeLinecap="round" />
              </g>
              <g className="mr-curtain__seal-spin mr-curtain__seal-spin--rev" fill="none" stroke="#c99a3c" strokeWidth="0.8" opacity="0.75">
                <rect x="38" y="38" width="84" height="84" />
                <rect x="38" y="38" width="84" height="84" transform="rotate(45 80 80)" />
              </g>
              <circle cx="80" cy="80" r="45" fill="#04180f" stroke="url(#mr-seal-gold)" strokeWidth="1.2" />
              <circle cx="80" cy="80" r="40" fill="none" stroke="#c99a3c" strokeWidth="0.5" opacity="0.7" />
            </svg>
            <span className="mr-curtain__mono">
              <b>{couple.groomName.charAt(0)}</b>
              <i>&amp;</i>
              <b>{couple.brideName.charAt(0)}</b>
            </span>
          </span>
          <span className="mr-curtain__text">Tap to open</span>
        </button>
      ) : null}
      {needsTap ? (
        <div className="mr-curtain" aria-hidden="true">
          <div className="mr-curtain__panel mr-curtain__panel--l" />
          <div className="mr-curtain__panel mr-curtain__panel--r" />
          <div className="mr-curtain__pelmet" />
        </div>
      ) : null}

      <div className="mr-opening__hint" aria-hidden="true">
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
    { sprite: 'zarr', motion: 'twinkle', count: 16, size: [8, 14], opacity: [0.35, 0.9], zone: 'upper', color: 'goldBright' },
    { sprite: 'mogra', motion: 'fall', count: 8, size: [12, 18], opacity: [0.4, 0.8], zone: 'margins', color: 'ivory' },
  ],
  Divider: OpeningDivider,
}

export default plugin
