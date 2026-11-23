/* Opening — always first and fixed. Takes an image or a video.
   Video: tap to open (starts the film and the music, unlocks scroll), names reveal mid-film.
   Image: no gate; slow Ken Burns push, names reveal once the image has landed.
   Options: gate ('tap' | 'none'), revealAtSec (video, default 3.5). */

import { useEffect, useRef, useState } from 'react'
import { gsap, useGSAP, MediaSlot, EASE } from '../../core'
import type { SectionPlugin, SectionProps } from '../../core'
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
  const isVideo = media?.type === 'video'
  const gate = (ctx.options.gate as 'tap' | 'none' | undefined) ?? (isVideo ? 'tap' : 'none')
  const revealAtSec = (ctx.options.revealAtSec as number | undefined) ?? 3.5
  const needsTap = gate === 'tap' && isVideo && !ctx.reducedMotion

  const sectionRef = useRef<HTMLElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const revealTl = useRef<gsap.core.Timeline | null>(null)
  const revealed = useRef(false)
  const [opened, setOpened] = useState(!needsTap)

  const playReveal = () => {
    if (revealed.current) return
    revealed.current = true
    revealTl.current?.play()
  }

  // Lock scroll until the invitation is opened.
  useEffect(() => {
    if (!needsTap) return
    ctx.scroll.stop()
    return () => ctx.scroll.start()
  }, [needsTap, ctx.scroll])

  const { contextSafe } = useGSAP(
    (_context, safe) => {
      if (ctx.reducedMotion) return

      const tl = gsap.timeline({ paused: true, defaults: { ease: EASE.out } })
      tl.from('.pb-opening__onkar', { opacity: 0, filter: 'blur(10px)', duration: 1.4 }, 0)
        .from('.pb-opening__eyebrow', { opacity: 0, letterSpacing: '0.7em', duration: 1.4 }, 0.2)
        .from('.pb-opening__name--groom', { opacity: 0, filter: 'blur(14px)', scale: 1.06, duration: 1.4 }, 0.15)
        .from('.pb-opening__amp', { opacity: 0, scale: 0.6, duration: 1 }, 0.6)
        .from('.pb-opening__name--bride', { opacity: 0, filter: 'blur(14px)', scale: 1.06, duration: 1.4 }, 0.85)
        .from('.pb-opening__orn .pb-draw', { strokeDashoffset: 1, duration: 1.6, stagger: 0.12, ease: 'power2.inOut' }, 1.4)
        .from('.pb-opening__date', { opacity: 0, duration: 1.2 }, 1.9)
        .from('.pb-opening__hint', { opacity: 0, duration: 1 }, 2.6)
      revealTl.current = tl

      // Hide the pre-reveal state before first paint.
      tl.progress(0)

      if (!isVideo) {
        // Image mode: Ken Burns push + reveal once the image has landed.
        gsap.to('.pb-opening__media .pb-media__inner', {
          scale: 1.1,
          duration: 24,
          ease: 'none',
          yoyo: true,
          repeat: -1,
        })
        const img = sectionRef.current?.querySelector<HTMLImageElement>('.pb-media__el')
        const go = safe!(() => window.setTimeout(playReveal, 350))
        if (img?.complete) go()
        else img?.addEventListener('load', go, { once: true })
        const fallback = window.setTimeout(playReveal, 2500)
        return () => window.clearTimeout(fallback)
      }
    },
    { scope: sectionRef, dependencies: [ctx.reducedMotion, isVideo, media?.src] },
  )

  const handleOpen = contextSafe(() => {
    if (opened) return
    setOpened(true)
    ctx.scroll.start()
    ctx.music.start()
    gsap.to('.pb-opening__cta', { opacity: 0, duration: 0.5, ease: 'power1.out', pointerEvents: 'none' })
    const video = videoRef.current
    if (!video) return playReveal()
    video.play().catch(playReveal)
    window.setTimeout(playReveal, (revealAtSec + 5) * 1000)
  })

  return (
    <section ref={sectionRef} className="pb-section pb-opening" aria-label="Wedding invitation">
      {media ? (
        <MediaSlot
          className="pb-opening__media"
          media={{ ...media, overlay: 'none', slot: 'background' }}
          reducedMotion={ctx.reducedMotion}
          priority
          controlled
          videoRef={videoRef}
          videoProps={{
            onTimeUpdate: (e) => {
              if (e.currentTarget.currentTime >= revealAtSec) playReveal()
            },
            onEnded: playReveal,
            onError: playReveal,
          }}
        />
      ) : null}
      <div className="pb-opening__veil" />

      <div className="pb-opening__content">
        <p className="pb-opening__onkar" lang="pa" aria-label="Ik Onkar">ੴ</p>
        <p className="pb-eyebrow pb-opening__eyebrow">The Anand Karaj of</p>
        <h1 className="pb-opening__names">
          <span className="pb-opening__name--groom">{couple.groomName}</span>
          <span className="pb-opening__amp">&amp;</span>
          <span className="pb-opening__name--bride">{couple.brideName}</span>
        </h1>
        <svg className="pb-opening__orn" width="220" height="26" viewBox="0 0 220 26" aria-hidden="true">
          <path className="pb-draw" pathLength="1" d="M0 13 H88" />
          <path className="pb-draw" pathLength="1" d="M132 13 H220" />
          {/* kalire: a tiny cusped dome with a pearl drop */}
          <path className="pb-draw" pathLength="1" d="M98 13 C98 6 104 3 110 2 C116 3 122 6 122 13 C119 11 115 12 110 13 C105 12 101 11 98 13Z" />
          <path className="pb-draw" pathLength="1" d="M110 13 V20" />
          <circle className="pb-fill-gold" cx="110" cy="23" r="2" />
        </svg>
        <p className="pb-opening__date">{formatDotDate(weddingDate)}</p>
      </div>

      {needsTap && !opened ? (
        <button type="button" className="pb-opening__cta" onClick={handleOpen} aria-label="Open the invitation">
          <span className="pb-opening__cta-ring" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M6 3 L20 12 L6 21 Z" />
            </svg>
          </span>
          <span className="pb-opening__cta-text">Tap to open</span>
        </button>
      ) : null}

      <div className="pb-opening__hint" aria-hidden="true">
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
    { sprite: 'gulab', motion: 'fall', count: 9, size: [12, 20], opacity: [0.5, 0.85], zone: 'full', color: 'dawn' },
    { sprite: 'sparkle', motion: 'twinkle', count: 6, size: [10, 20], opacity: [0.3, 0.8], zone: 'margins', color: 'lamp' },
  ],
}

export default plugin
