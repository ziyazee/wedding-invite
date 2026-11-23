import { useRef, useCallback } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import type { CoupleInfo } from '../types'
import { ArchBorderSvg, CrescentMoonSvg } from '../assets/svg'

import videoSrc from '../assets/images/Golden_Temple_lights_up_night_4f2df0ca.mp4'

interface Props {
  couple: CoupleInfo
  weddingDate: string
}

function formatDotDate(iso: string): string {
  const d = new Date(iso)
  const day = String(d.getDate()).padStart(2, '0')
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const year = d.getFullYear()
  return `${day} . ${month} . ${year}`
}

export default function Opening({ couple, weddingDate }: Props) {
  const sectionRef = useRef<HTMLElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const hasPlayed = useRef(false)
  const heroTriggered = useRef(false)

  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  useGSAP(
    (context, contextSafe) => {
      if (prefersReducedMotion) {
        // Show all content immediately
        gsap.set('.ag-hero-names', { opacity: 1 })
        gsap.set('.ag-hero-ampersand', { opacity: 1 })
        gsap.set('.ag-hero-date', { opacity: 1 })
        gsap.set('.ag-scroll-hint', { opacity: 1 })
        return
      }

      // Build the hero entrance timeline (paused)
      const heroTl = gsap.timeline({
        paused: true,
        defaults: { ease: 'power2.out' },
        onComplete: () => {
          // Hand off to CSS glow sustain animation
          const names = sectionRef.current?.querySelector('.ag-hero-names')
          names?.classList.add('is-revealed')
        },
      })

      // Step 1: Names fade in with gold shimmer
      heroTl.fromTo(
        '.ag-hero-names',
        {
          opacity: 0,
          y: 30,
          textShadow: '0 0 0px rgba(212, 168, 67, 0)',
        },
        {
          opacity: 1,
          y: 0,
          textShadow: '0 0 24px rgba(212, 168, 67, 0.35), 0 0 48px rgba(232, 198, 90, 0.15)',
          duration: 1.2,
          ease: 'expo.out',
        },
        'names',
      )

      // Step 2: Ampersand
      heroTl.fromTo(
        '.ag-hero-ampersand',
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'expo.out' },
        'names+=0.15',
      )

      // Step 3: Date text
      heroTl.fromTo(
        '.ag-hero-date',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8 },
        'names+=0.3',
      )

      // Step 4: Scroll hint
      heroTl.fromTo(
        '.ag-scroll-hint',
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.6 },
        'names+=1.2',
      )

      // Video canplay retry logic
      const video = videoRef.current
      if (video) {
        const tryPlay = contextSafe!(() => {
          if (!hasPlayed.current && video.paused) {
            video.play().then(() => {
              hasPlayed.current = true
            }).catch(() => {
              // Play blocked — rely on fallback timeout
            })
          }
        })

        video.addEventListener('canplay', tryPlay)
        // Attempt play immediately
        video.play().then(() => {
          hasPlayed.current = true
        }).catch(() => {})

        // Trigger hero timeline at ~4s of video
        const onTimeUpdate = contextSafe!(() => {
          if (video.currentTime >= 4 && !heroTriggered.current) {
            heroTriggered.current = true
            video.removeEventListener('timeupdate', onTimeUpdate)
            heroTl.play()
          }
        })
        video.addEventListener('timeupdate', onTimeUpdate)

        // 6s fallback: if video doesn't reach 4s, trigger anyway
        const fallbackTimeout = setTimeout(() => {
          if (!heroTriggered.current) {
            heroTriggered.current = true
            heroTl.play()
          }
        }, 6000)

        return () => {
          clearTimeout(fallbackTimeout)
          video.removeEventListener('canplay', tryPlay)
          video.removeEventListener('timeupdate', onTimeUpdate)
        }
      } else {
        // No video — trigger immediately
        heroTl.play()
      }
    },
    { scope: sectionRef },
  )

  return (
    <section ref={sectionRef} className="ag-section-hero">
      {/* Video background */}
      <div className="ag-hero-video-wrap">
        {!prefersReducedMotion && (
          <video
            ref={videoRef}
            className="ag-hero-video"
            src={videoSrc}
            muted
            playsInline
            preload="auto"
          />
        )}
        <div className="ag-hero-overlay" />
      </div>

      {/* Crescent moon */}
      <CrescentMoonSvg size={100} className="ag-hero-moon" />

      {/* Content */}
      <div className="ag-hero-content">
        <h1 className="ag-hero-names ag-type-hero">
          <span className="ag-hero-name">{couple.brideName}</span>
          <span className="ag-hero-ampersand">&</span>
          <span className="ag-hero-name">{couple.groomName}</span>
        </h1>
        <p className="ag-hero-date ag-type-label">
          {formatDotDate(weddingDate)}
        </p>
      </div>

      {/* Scroll hint */}
      <div className="ag-scroll-hint">
        <span className="ag-scroll-hint__label">Scroll</span>
        <div className="ag-scroll-hint-arrow" />
      </div>

      {/* Arch border at bottom */}
      <div className="ag-hero-arch">
        <ArchBorderSvg width={500} />
      </div>
    </section>
  )
}
