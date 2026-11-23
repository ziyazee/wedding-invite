import { useRef, useCallback, useEffect } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import type { CoupleInfo } from '../types'

interface OpeningProps {
  couple: CoupleInfo
  weddingDate: string
  videoSrc: string
  videoRef: React.RefObject<HTMLVideoElement | null>
  nextSectionRef: React.RefObject<HTMLElement | null>
}

export default function Opening({
  couple,
  weddingDate,
  videoSrc,
  videoRef,
  nextSectionRef,
}: OpeningProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)
  const namesRef = useRef<HTMLDivElement>(null)
  const groomRef = useRef<HTMLHeadingElement>(null)
  const ampRef = useRef<HTMLSpanElement>(null)
  const brideRef = useRef<HTMLHeadingElement>(null)
  const dateRef = useRef<HTMLParagraphElement>(null)

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

  const { contextSafe } = useGSAP(
    () => {
      if (prefersReducedMotion) {
        gsap.set(namesRef.current, { opacity: 1, visibility: 'visible' })
        gsap.set(
          [groomRef.current, ampRef.current, brideRef.current, dateRef.current],
          { opacity: 1, y: 0, filter: 'blur(0px)' }
        )
        gsap.set(ctaRef.current, { display: 'none' })
        return
      }

      gsap.set(namesRef.current, { opacity: 0, visibility: 'hidden' })
      gsap.set(groomRef.current, { opacity: 0, y: 18, filter: 'blur(3px)' })
      gsap.set(ampRef.current, { opacity: 0, y: 14, scale: 0.9 })
      gsap.set(brideRef.current, { opacity: 0, y: 18, filter: 'blur(3px)' })
      gsap.set(dateRef.current, { opacity: 0, y: 10 })

      const tl = gsap.timeline({ paused: true, defaults: { ease: 'power3.out' } })

      tl.set(namesRef.current, { opacity: 1, visibility: 'visible' })

      tl.fromTo(
        groomRef.current,
        { opacity: 0, y: 18, filter: 'blur(3px)' },
        { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1 },
        0
      )

      tl.fromTo(
        ampRef.current,
        { opacity: 0, y: 14, scale: 0.9 },
        { opacity: 1, y: 0, scale: 1, duration: 0.7 },
        0.5
      )

      tl.fromTo(
        brideRef.current,
        { opacity: 0, y: 18, filter: 'blur(3px)' },
        { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1 },
        0.9
      )

      tl.fromTo(
        dateRef.current,
        { opacity: 0, y: 10 },
        { opacity: 0.85, y: 0, duration: 0.7, ease: 'power2.out' },
        1.5
      )

      tl.eventCallback('onComplete', () => {
        autoScrollTimerRef.current = setTimeout(() => {
          if (!userHasScrolledRef.current && nextSectionRef.current) {
            nextSectionRef.current.scrollIntoView({ behavior: 'smooth' })
          }
        }, 1800)
      })

      nameRevealTLRef.current = tl
    },
    { scope: sectionRef }
  )

  useEffect(() => {
    const onScroll = () => { userHasScrolledRef.current = true }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (autoScrollTimerRef.current) clearTimeout(autoScrollTimerRef.current)
    }
  }, [])

  const handleTimeUpdate = useCallback(() => {
    const video = videoRef.current
    if (!video || nameRevealStartedRef.current) return
    if (video.currentTime >= video.duration * 0.7) {
      nameRevealStartedRef.current = true
      nameRevealTLRef.current?.play()
    }
  }, [videoRef])

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const tryPlay = () => {
      video.play().catch(() => {})
    }

    video.addEventListener('canplay', tryPlay, { once: true })
    video.addEventListener('timeupdate', handleTimeUpdate)

    return () => {
      video.removeEventListener('canplay', tryPlay)
      video.removeEventListener('timeupdate', handleTimeUpdate)
    }
  }, [videoRef, handleTimeUpdate])

  const handleTap = contextSafe(() => {
    const video = videoRef.current
    if (!video || prefersReducedMotion) return

    gsap.to(ctaRef.current, {
      opacity: 0,
      duration: 0.2,
      ease: 'power1.out',
      onComplete: () => {
        if (ctaRef.current) ctaRef.current.style.display = 'none'
      },
    })

    video.play().catch(() => {
      nameRevealStartedRef.current = true
      nameRevealTLRef.current?.play()
    })
  })

  return (
    <section ref={sectionRef} className="jt-opening" aria-label="Wedding invitation opening">
      <video
        ref={videoRef}
        className="jt-opening__video"
        preload="auto"
        playsInline
        muted
      >
        <source src={videoSrc} type="video/mp4" />
      </video>

      <div className="jt-opening__overlay" />

      <div
        ref={ctaRef}
        className="jt-opening__cta"
        onClick={handleTap}
        role="button"
        aria-label="Play invitation video"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') handleTap()
        }}
      >
        <span className="jt-opening__cta-text jt-cta-pulse">Touch to begin</span>
      </div>

      <div ref={namesRef} className="jt-opening__names">
        <h1 ref={groomRef} className="jt-opening__groom">{couple.groomName}</h1>
        <span ref={ampRef} className="jt-opening__ampersand">&amp;</span>
        <h1 ref={brideRef} className="jt-opening__bride">{couple.brideName}</h1>
        <p ref={dateRef} className="jt-opening__date">{formattedDate}</p>
      </div>
    </section>
  )
}
