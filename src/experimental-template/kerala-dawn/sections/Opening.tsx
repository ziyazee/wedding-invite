/* Kerala Dawn — Section 1: Opening
   Full-bleed video background with tap-to-start and name reveal in the sky */

import { useRef, useCallback, useEffect } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { StarIcon } from '../assets'
import type { CoupleInfo } from '../types'

interface OpeningProps {
  couple: CoupleInfo
  weddingDate: string
  videoSrc: string
  videoRef: React.RefObject<HTMLVideoElement | null>
  coupleSectionRef: React.RefObject<HTMLElement | null>
  onBegin: () => void
}

export default function Opening({
  couple,
  weddingDate,
  videoSrc,
  videoRef,
  coupleSectionRef,
  onBegin,
}: OpeningProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)
  const namesRef = useRef<HTMLDivElement>(null)
  const groomRef = useRef<HTMLHeadingElement>(null)
  const ampRef = useRef<HTMLSpanElement>(null)
  const brideRef = useRef<HTMLHeadingElement>(null)
  const dateRef = useRef<HTMLParagraphElement>(null)
  const waterRef = useRef<HTMLDivElement>(null)

  const nameRevealTLRef = useRef<gsap.core.Timeline | null>(null)
  const nameRevealStartedRef = useRef(false)
  const userHasScrolledRef = useRef(false)
  const autoScrollTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const dateObj = new Date(weddingDate)
  const formattedDate = dateObj.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })

  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  // Build the name reveal timeline (paused) and handle reduced motion
  useGSAP(
    () => {
      if (prefersReducedMotion) {
        // Show everything immediately, no interaction required
        gsap.set(namesRef.current, { opacity: 1, visibility: 'visible' })
        gsap.set(
          [groomRef.current, ampRef.current, brideRef.current, dateRef.current],
          { opacity: 1, y: 0, filter: 'blur(0px)' }
        )
        gsap.set(ctaRef.current, { display: 'none' })
        gsap.set(waterRef.current, { opacity: 1 })
        return
      }

      // Set initial hidden states
      gsap.set(namesRef.current, { opacity: 0, visibility: 'hidden' })
      gsap.set(groomRef.current, { opacity: 0, y: 20, filter: 'blur(4px)' })
      gsap.set(ampRef.current, { opacity: 0, y: 16, scale: 0.85 })
      gsap.set(brideRef.current, { opacity: 0, y: 20, filter: 'blur(4px)' })
      gsap.set(dateRef.current, { opacity: 0, y: 12 })
      gsap.set(waterRef.current, { opacity: 0 })

      // Build the name reveal timeline
      const tl = gsap.timeline({ paused: true, defaults: { ease: 'power3.out' } })

      tl.set(namesRef.current, { opacity: 1, visibility: 'visible' })

      tl.fromTo(
        groomRef.current,
        { opacity: 0, y: 20, filter: 'blur(4px)' },
        { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.9 },
        0
      )

      tl.fromTo(
        ampRef.current,
        { opacity: 0, y: 16, scale: 0.85 },
        { opacity: 1, y: 0, scale: 1, duration: 0.7 },
        0.4
      )

      tl.fromTo(
        brideRef.current,
        { opacity: 0, y: 20, filter: 'blur(4px)' },
        { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.9 },
        0.8
      )

      tl.fromTo(
        dateRef.current,
        { opacity: 0, y: 12 },
        { opacity: 0.85, y: 0, duration: 0.7, ease: 'power2.out' },
        1.4
      )

      tl.fromTo(
        waterRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.8, ease: 'power1.inOut' },
        2.0
      )

      // Auto-scroll after reveal completes
      tl.eventCallback('onComplete', () => {
        autoScrollTimerRef.current = setTimeout(() => {
          if (!userHasScrolledRef.current && coupleSectionRef.current) {
            coupleSectionRef.current.scrollIntoView({ behavior: 'smooth' })
          }
        }, 1500)
      })

      nameRevealTLRef.current = tl
    },
    { scope: sectionRef }
  )

  // Track user scroll to cancel auto-scroll
  useEffect(() => {
    const onScroll = () => {
      userHasScrolledRef.current = true
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (autoScrollTimerRef.current) clearTimeout(autoScrollTimerRef.current)
    }
  }, [])

  // Video timeupdate handler for name reveal trigger
  const handleTimeUpdate = useCallback(() => {
    const video = videoRef.current
    if (!video || nameRevealStartedRef.current) return
    if (video.currentTime >= video.duration * 0.75) {
      nameRevealStartedRef.current = true
      nameRevealTLRef.current?.play()
    }
  }, [videoRef])

  // canplay retry handler
  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handleCanPlay = () => {
      // Video can play, but we wait for user tap
    }

    video.addEventListener('canplay', handleCanPlay, { once: true })
    video.addEventListener('timeupdate', handleTimeUpdate)

    return () => {
      video.removeEventListener('canplay', handleCanPlay)
      video.removeEventListener('timeupdate', handleTimeUpdate)
    }
  }, [videoRef, handleTimeUpdate])

  const handleTap = useCallback(() => {
    onBegin()
    const video = videoRef.current
    if (!video || prefersReducedMotion) return

    // Fade out CTA
    gsap.to(ctaRef.current, {
      opacity: 0,
      duration: 0.2,
      ease: 'power1.out',
      onComplete: () => {
        if (ctaRef.current) ctaRef.current.style.display = 'none'
      },
    })

    // Play video
    video.play().catch(() => {
      // Autoplay blocked — show names immediately
      nameRevealStartedRef.current = true
      nameRevealTLRef.current?.play()
    })
  }, [videoRef, prefersReducedMotion, onBegin])

  return (
    <section ref={sectionRef} className="kd-opening" aria-label="Wedding invitation opening">
      {/* Video background */}
      <video
        ref={videoRef}
        className="kd-opening__video"
        preload="metadata"
        playsInline
        muted
        poster=""
      >
        <source src={videoSrc} type="video/mp4" />
      </video>

      {/* Gradient overlay */}
      <div className="kd-opening__overlay" />

      {/* Vignette */}
      <div className="kd-opening__vignette" />

      {/* Touch CTA */}
      <div
        ref={ctaRef}
        className="kd-opening__cta"
        onClick={handleTap}
        role="button"
        aria-label="Play invitation video"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') handleTap()
        }}
      >
        <StarIcon size={24} className="kd-cta-pulse" />
        <span className="kd-opening__cta-text kd-cta-pulse">Touch to begin</span>
      </div>

      {/* Name reveal */}
      <div ref={namesRef} className="kd-opening__names">
        <h1 ref={groomRef} className="kd-opening__groom">{couple.groomName}</h1>
        <span ref={ampRef} className="kd-opening__ampersand">&amp;</span>
        <h1 ref={brideRef} className="kd-opening__bride">{couple.brideName}</h1>
        <p ref={dateRef} className="kd-opening__date">{formattedDate}</p>
      </div>

      {/* Water transition */}
      <div ref={waterRef} className="kd-water-transition" />
    </section>
  )
}
