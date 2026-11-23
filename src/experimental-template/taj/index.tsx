import { useRef, useEffect, useCallback } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { sampleWedding } from './data/sample'
import { OrnamentalDivider } from './assets'
import Opening from './sections/Opening'
import Couple from './sections/Couple'
import Dua from './sections/Dua'
import Countdown from './sections/Countdown'
import Celebrations from './sections/Celebrations'
import RSVP from './sections/RSVP'
import Gallery from './sections/Gallery'
import Closing from './sections/Closing'
import './styles/main.css'

gsap.registerPlugin(ScrollTrigger, useGSAP)

const VIDEO_SRC = '/templates/tajmahal/assets/opening.mp4'

export default function Taj() {
  const data = sampleWedding
  const containerRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  // Refresh ScrollTrigger after fonts load
  useEffect(() => {
    document.fonts.ready.then(() => {
      ScrollTrigger.refresh()
    })
  }, [])

  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  // GSAP animations — opening timeline + scroll reveals
  useGSAP(
    () => {
      if (prefersReducedMotion) {
        // Set all opening elements to final state
        gsap.set('.tj-opening-overlay', { opacity: 0.85 })
        gsap.set(
          [
            '.tj-bismillah',
            '.tj-name-1',
            '.tj-name-2',
            '.tj-name-connector',
            '.tj-opening-tagline',
          ],
          { opacity: 1, scale: 1 }
        )
        gsap.set('.tj-opening-divider', { opacity: 1, scaleX: 1 })
        return
      }

      // --- Opening entrance timeline (paused until video ends) ---
      const openingTl = gsap.timeline({ paused: true })

      openingTl
        // Overlay fade-in
        .to('.tj-opening-overlay', {
          opacity: 0.85,
          duration: 0.8,
          ease: 'power2.inOut',
        })
        // Bismillah
        .to(
          '.tj-bismillah',
          {
            opacity: 1,
            duration: 0.4,
            ease: 'power2.out',
          },
          '<0.4'
        )
        // First name — opacity + subtle scale (NO translateY)
        .to(
          '.tj-name-1',
          {
            opacity: 1,
            scale: 1,
            duration: 0.6,
            ease: 'power2.out',
          },
          '<0.4'
        )
        // Connector (&)
        .to(
          '.tj-name-connector',
          {
            opacity: 1,
            duration: 0.6,
            ease: 'power2.out',
          },
          '<0.1'
        )
        // Second name
        .to(
          '.tj-name-2',
          {
            opacity: 1,
            scale: 1,
            duration: 0.6,
            ease: 'power2.out',
          },
          '<0.1'
        )
        // Divider — scaleX from center
        .to(
          '.tj-opening-divider',
          {
            opacity: 1,
            scaleX: 1,
            duration: 0.6,
            ease: 'power3.out',
          },
          '-=0.2'
        )
        // Invitation tagline
        .to(
          '.tj-opening-tagline',
          {
            opacity: 1,
            duration: 0.6,
            ease: 'power2.out',
          },
          '-=0.4'
        )
        // Scroll indicator
        .to(
          '.tj-scroll-indicator',
          {
            opacity: 0.7,
            duration: 0.6,
            ease: 'power1.out',
          },
          '-=0.2'
        )

      // Store timeline on the container so the video end handler can trigger it
      const container = containerRef.current
      if (container) {
        ;(container as any).__openingTl = openingTl
      }

      // --- Scroll reveals for sections 2-8 ---
      // Couple section
      gsap.from('.tj-couple .tj-section-heading', {
        opacity: 0,
        duration: 0.6,
        ease: 'power2.out',
        scrollTrigger: { trigger: '.tj-couple', start: 'top 85%', once: true },
      })
      gsap.from('.tj-couple-arch', {
        opacity: 0,
        scale: 0.95,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: { trigger: '.tj-couple-arch', start: 'top 80%', once: true },
      })

      // Dua section
      gsap.from('.tj-dua .tj-section-heading', {
        opacity: 0,
        duration: 0.6,
        ease: 'power2.out',
        scrollTrigger: { trigger: '.tj-dua', start: 'top 85%', once: true },
      })
      gsap.from('.tj-dua-arabic', {
        opacity: 0,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: { trigger: '.tj-dua-arabic', start: 'top 85%', once: true },
      })
      gsap.from('.tj-dua-rule', {
        opacity: 0,
        scaleX: 0,
        transformOrigin: 'center',
        duration: 0.6,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.tj-dua-rule', start: 'top 85%', once: true },
      })

      // Countdown section
      gsap.from('.tj-countdown .tj-section-heading', {
        opacity: 0,
        duration: 0.6,
        ease: 'power2.out',
        scrollTrigger: { trigger: '.tj-countdown', start: 'top 85%', once: true },
      })
      gsap.from('.tj-countdown-unit', {
        opacity: 0,
        scale: 0.9,
        duration: 0.5,
        stagger: 0.1,
        ease: 'power2.out',
        scrollTrigger: { trigger: '.tj-countdown-grid', start: 'top 80%', once: true },
      })

      // Celebrations — batch reveal cards
      gsap.from('.tj-celebrations .tj-section-heading', {
        opacity: 0,
        duration: 0.6,
        ease: 'power2.out',
        scrollTrigger: { trigger: '.tj-celebrations', start: 'top 85%', once: true },
      })
      ScrollTrigger.batch('.tj-event-card', {
        onEnter: (elements) => {
          gsap.from(elements, {
            opacity: 0,
            scale: 0.97,
            duration: 0.6,
            stagger: 0.2,
            ease: 'power2.out',
          })
        },
        start: 'top 85%',
        once: true,
      })

      // RSVP
      gsap.from('.tj-rsvp .tj-section-heading', {
        opacity: 0,
        duration: 0.6,
        ease: 'power2.out',
        scrollTrigger: { trigger: '.tj-rsvp', start: 'top 85%', once: true },
      })
      gsap.from('.tj-rsvp-panel', {
        opacity: 0,
        scale: 0.98,
        duration: 0.7,
        ease: 'power2.out',
        scrollTrigger: { trigger: '.tj-rsvp-panel', start: 'top 80%', once: true },
      })

      // Gallery — batch reveal items
      gsap.from('.tj-gallery .tj-section-heading', {
        opacity: 0,
        duration: 0.6,
        ease: 'power2.out',
        scrollTrigger: { trigger: '.tj-gallery', start: 'top 85%', once: true },
      })
      ScrollTrigger.batch('.tj-gallery-item', {
        onEnter: (elements) => {
          gsap.from(elements, {
            opacity: 0,
            duration: 0.5,
            stagger: 0.1,
            ease: 'power2.out',
          })
        },
        start: 'top 85%',
        once: true,
      })

      // Closing
      gsap.from('.tj-closing__dome', {
        opacity: 0,
        duration: 1,
        ease: 'power2.out',
        scrollTrigger: { trigger: '.tj-closing', start: 'top 90%', once: true },
      })
      gsap.from('.tj-closing .tj-section-heading', {
        opacity: 0,
        duration: 0.6,
        ease: 'power2.out',
        scrollTrigger: { trigger: '.tj-closing', start: 'top 85%', once: true },
      })
      gsap.from('.tj-closing-crescent', {
        opacity: 0,
        scale: 0.8,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: { trigger: '.tj-closing-crescent', start: 'top 80%', once: true },
      })

      // Ornamental divider reveals between sections
      ScrollTrigger.batch('.tj-section-divider', {
        onEnter: (elements) => {
          gsap.from(elements, {
            opacity: 0,
            scaleX: 0,
            transformOrigin: 'center',
            duration: 0.6,
            stagger: 0.1,
            ease: 'power3.out',
          })
        },
        start: 'top 85%',
        once: true,
      })
    },
    { scope: containerRef }
  )

  // Video end handler — plays the opening timeline
  const handleVideoEnd = useCallback(() => {
    const container = containerRef.current
    if (container && (container as any).__openingTl) {
      ;(container as any).__openingTl.play()
    }
  }, [])

  return (
    <div ref={containerRef} className="tj-page">
      <Opening
        couple={data.couple}
        videoSrc={VIDEO_SRC}
        videoRef={videoRef}
        onVideoEnd={handleVideoEnd}
      />

      <Couple couple={data.couple} heading={data.heading} />

      {/* Divider: Couple / Dua — star, 50% */}
      <div className="tj-section-divider" style={{ padding: '48px 24px' }}>
        <OrnamentalDivider motif="star" width="50%" />
      </div>

      <Dua dua={data.dua} blessing={data.blessing} />

      {/* Divider: Dua / Countdown — crescent, 40% */}
      <div className="tj-section-divider" style={{ padding: '48px 24px' }}>
        <OrnamentalDivider motif="crescent" width="40%" />
      </div>

      <Countdown weddingDate={data.weddingDate} />

      {/* Divider: Countdown / Celebrations — dome, 60% */}
      <div className="tj-section-divider" style={{ padding: '56px 24px' }}>
        <OrnamentalDivider motif="dome" width="60%" />
      </div>

      <Celebrations events={data.celebrations} />

      {/* Divider: Celebrations / RSVP — diamond, 40% */}
      <div className="tj-section-divider" style={{ padding: '48px 24px' }}>
        <OrnamentalDivider motif="diamond" width="40%" />
      </div>

      <RSVP />

      {/* Divider: RSVP / Gallery — rose, 40% */}
      <div className="tj-section-divider" style={{ padding: '48px 24px' }}>
        <OrnamentalDivider motif="rose" width="40%" />
      </div>

      <Gallery />

      <Closing couple={data.couple} />
    </div>
  )
}
