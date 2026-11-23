/* Opening — always first and fixed. Takes an image or a video.
   Video: tap to open (starts the film and the music, unlocks scroll), names reveal mid-film.
   Image: no gate; slow Ken Burns push, names reveal once the image has landed.
   Options: gate ('tap' | 'none'), revealAtSec (video, default 3.5). */

import { useEffect, useRef, useState } from 'react'
import { gsap, useGSAP, MediaSlot, EASE } from '../../core'
import type { SectionPlugin, SectionProps } from '../../core'
import OpeningDivider from './Divider'
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
      tl.from('.tm-opening__eyebrow', { opacity: 0, letterSpacing: '0.7em', duration: 1.4 }, 0)
        .from('.tm-opening__name--groom', { opacity: 0, filter: 'blur(14px)', scale: 1.06, duration: 1.4 }, 0.15)
        .from('.tm-opening__amp', { opacity: 0, scale: 0.6, duration: 1 }, 0.6)
        .from('.tm-opening__name--bride', { opacity: 0, filter: 'blur(14px)', scale: 1.06, duration: 1.4 }, 0.85)
        .from('.tm-opening__orn .tm-draw', { strokeDashoffset: 1, duration: 1.6, stagger: 0.12, ease: 'power2.inOut' }, 1.4)
        .from('.tm-opening__date', { opacity: 0, duration: 1.2 }, 1.9)
        .from('.tm-opening__hint', { opacity: 0, duration: 1 }, 2.6)
      revealTl.current = tl

      // Hide the pre-reveal state before first paint.
      tl.progress(0)

      if (!isVideo) {
        // Image mode: Ken Burns push + reveal once the image has landed.
        gsap.to('.tm-opening__media .tm-media__inner', {
          scale: 1.1,
          duration: 24,
          ease: 'none',
          yoyo: true,
          repeat: -1,
        })
        const img = sectionRef.current?.querySelector<HTMLImageElement>('.tm-media__el')
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
    gsap.to('.tm-opening__cta', { opacity: 0, duration: 0.5, ease: 'power1.out', pointerEvents: 'none' })
    const video = videoRef.current
    if (!video) return playReveal()
    video.play().catch(playReveal)
    window.setTimeout(playReveal, (revealAtSec + 5) * 1000)
  })

  return (
    <section ref={sectionRef} className="tm-section tm-opening" aria-label="Wedding invitation">
      {media ? (
        <MediaSlot
          className="tm-opening__media"
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
      <div className="tm-opening__veil" />

      <div className="tm-opening__content">
        <p className="tm-eyebrow tm-opening__eyebrow" lang="ta">திருமண அழைப்பிதழ்</p>
        <h1 className="tm-opening__names">
          <span className="tm-opening__name--groom">{couple.groomName}</span>
          <span className="tm-opening__amp">&amp;</span>
          <span className="tm-opening__name--bride">{couple.brideName}</span>
        </h1>
        <svg className="tm-opening__orn" width="200" height="14" viewBox="0 0 200 14" aria-hidden="true">
          <path className="tm-draw" pathLength="1" d="M0 7 H84" />
          <path className="tm-draw" pathLength="1" d="M100 1 L106 7 L100 13 L94 7 Z" />
          <path className="tm-draw" pathLength="1" d="M116 7 H200" />
        </svg>
        <p className="tm-opening__date">{formatDotDate(weddingDate)}</p>
      </div>

      {needsTap && !opened ? (
        <button type="button" className="tm-opening__cta" onClick={handleOpen} aria-label="Open the invitation">
          <span className="tm-opening__cta-ring" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M6 3 L20 12 L6 21 Z" />
            </svg>
          </span>
          <span className="tm-opening__cta-text">Tap to open</span>
        </button>
      ) : null}

      <div className="tm-opening__hint" aria-hidden="true">
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
    { sprite: 'kanakambaram', motion: 'fall', count: 4, size: [14, 22], opacity: [0.55, 0.85], zone: 'margins', color: 'dawn' },
    { sprite: 'malli', motion: 'fall', count: 5, size: [10, 16], opacity: [0.55, 0.9], zone: 'margins', color: 'goldDim' },
  ],
  Divider: OpeningDivider,
}

export default plugin
