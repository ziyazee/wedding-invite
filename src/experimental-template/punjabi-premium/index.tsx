import { useRef, useState, useCallback } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { sampleWedding } from './data/sample'
import Opening from './sections/Opening'
import Couple from './sections/Couple'
import Countdown from './sections/Countdown'
import Celebrations from './sections/Celebrations'
import RSVP from './sections/RSVP'
import Gallery from './sections/Gallery'
import Closing from './sections/Closing'
import './styles/main.css'

gsap.registerPlugin(useGSAP, ScrollTrigger)

export default function PunjabiPremium() {
  const data = sampleWedding
  const containerRef = useRef<HTMLDivElement>(null)
  const entranceTlRef = useRef<gsap.core.Timeline | null>(null)
  const overlayRef = useRef<HTMLDivElement>(null)
  const [isOpen, setIsOpen] = useState(false)
  const toranRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      // Check for reduced motion — skip all GSAP setup
      const prefersReducedMotion = window.matchMedia(
        '(prefers-reduced-motion: reduce)'
      ).matches

      if (prefersReducedMotion) {
        // Auto-dismiss overlay after a brief pause
        setTimeout(() => setIsOpen(true), 1000)
        return
      }

      const mm = gsap.matchMedia()

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        // ---- Initial states for opening elements ----
        gsap.set('.pp-opening__bg', { autoAlpha: 0 })
        gsap.set('.pp-opening__arch', { autoAlpha: 0, y: 12 })
        gsap.set('.pp-opening__canopy', { autoAlpha: 0, y: -16 })
        gsap.set('.pp-opening__ornament', { autoAlpha: 0, y: -20 })
        gsap.set('.pp-opening__botanicals', { autoAlpha: 0, y: 16 })
        gsap.set('.pp-opening__floral-left', { autoAlpha: 0, x: -20 })
        gsap.set('.pp-opening__floral-right', { autoAlpha: 0, x: 20 })
        gsap.set('.pp-opening__corner', { autoAlpha: 0 })
        gsap.set('.pp-opening__monogram', { autoAlpha: 0, scale: 0.9 })
        gsap.set('.pp-opening__subtitle', { autoAlpha: 0 })
        gsap.set('.pp-opening__names', { autoAlpha: 0, y: 16 })
        gsap.set('.pp-opening__invitation-line', { autoAlpha: 0 })
        gsap.set('.pp-opening__lotus', { autoAlpha: 0 })

        // ---- Entrance timeline (paused) ----
        const tl = gsap.timeline({
          paused: true,
          defaults: { ease: 'power2.out' },
          onComplete: () => {
            if (toranRef.current) {
              toranRef.current.classList.add('pp-toran-sway')
            }
          },
        })

        // Layered reveal sequence
        tl.to('.pp-opening__bg', { autoAlpha: 1, duration: 0.8 }, 0)
        tl.to('.pp-opening__arch', { autoAlpha: 1, y: 0, duration: 0.8 }, 0.15)
        tl.to('.pp-opening__canopy', { autoAlpha: 1, y: 0, duration: 0.9 }, 0.3)
        tl.to('.pp-opening__ornament', {
          autoAlpha: 1, y: 0, duration: 0.6,
          ease: 'back.out(1.4)', stagger: 0.08,
        }, 0.6)
        tl.to('.pp-opening__botanicals', { autoAlpha: 1, y: 0, duration: 0.9 }, 0.5)
        tl.to('.pp-opening__floral-left', { autoAlpha: 1, x: 0, duration: 0.7 }, 0.8)
        tl.to('.pp-opening__floral-right', { autoAlpha: 1, x: 0, duration: 0.7 }, 0.8)
        tl.to('.pp-opening__corner', { autoAlpha: 1, duration: 0.5 }, 1.0)
        tl.to('.pp-opening__monogram', { autoAlpha: 1, scale: 1, duration: 0.6, ease: 'back.out(1.2)' }, 1.1)
        tl.to('.pp-opening__subtitle', { autoAlpha: 1, duration: 0.5 }, 1.4)
        tl.to('.pp-opening__names', { autoAlpha: 1, y: 0, duration: 0.7 }, 1.5)
        tl.to('.pp-opening__invitation-line', { autoAlpha: 1, duration: 0.5 }, 1.9)
        tl.to('.pp-opening__lotus', { autoAlpha: 1, duration: 0.5 }, 2.0)

        entranceTlRef.current = tl

        // ---- ScrollTrigger reveals for S2-S7 ----

        // S2: Family block reveal
        gsap.from('.pp-family__block', {
          autoAlpha: 0,
          y: 24,
          duration: 0.6,
          ease: 'power2.out',
          stagger: 0.3,
          scrollTrigger: {
            trigger: '.pp-family',
            start: 'top 85%',
            once: true,
          },
        })

        // S3: Countdown frame reveal
        gsap.from('.pp-countdown__frame', {
          autoAlpha: 0,
          y: 24,
          scale: 0.95,
          duration: 0.6,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.pp-countdown',
            start: 'top 85%',
            once: true,
          },
        })

        // S4: Event card slide-in
        ScrollTrigger.batch('.pp-event-card', {
          start: 'top 85%',
          once: true,
          onEnter: (batch) => {
            gsap.from(batch, {
              autoAlpha: 0,
              x: 24,
              duration: 0.6,
              ease: 'power2.out',
              stagger: 0.15,
              overwrite: true,
            })
          },
        })

        // S5: RSVP section reveal
        gsap.from('.pp-rsvp__arch-frame', {
          autoAlpha: 0,
          y: 24,
          duration: 0.6,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.pp-rsvp',
            start: 'top 80%',
            once: true,
          },
        })

        // S6: Gallery photo stagger
        ScrollTrigger.batch('.pp-gallery__photo', {
          start: 'top 90%',
          once: true,
          onEnter: (batch) => {
            gsap.from(batch, {
              autoAlpha: 0,
              y: 16,
              duration: 0.6,
              ease: 'power2.out',
              stagger: 0.15,
              overwrite: true,
            })
          },
        })

        // S7: Closing reveal
        gsap.from('.pp-closing__content', {
          autoAlpha: 0,
          y: 24,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.pp-closing',
            start: 'top 80%',
            once: true,
          },
        })
      })
    },
    { scope: containerRef }
  )

  const handleOpen = useCallback(() => {
    if (!overlayRef.current) return

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches

    if (prefersReducedMotion) {
      setIsOpen(true)
      return
    }

    gsap.to(overlayRef.current, {
      autoAlpha: 0,
      duration: 0.3,
      ease: 'power2.out',
      onComplete: () => {
        setIsOpen(true)
        entranceTlRef.current?.play()
      },
    })
  }, [])

  const groomFirst = data.couple.groomName.charAt(0)
  const brideFirst = data.couple.brideName.charAt(0)
  const monogram = `${groomFirst}${brideFirst}`

  return (
    <div ref={containerRef} className="pp-page">
      <Opening
        couple={data.couple}
        monogram={monogram}
        isOpen={isOpen}
        overlayRef={overlayRef}
        toranRef={toranRef}
        onOpen={handleOpen}
      />
      <Couple couple={data.couple} />
      <Countdown weddingDate={data.weddingDate} />
      <Celebrations events={data.celebrations} />
      <RSVP />
      <Gallery images={data.gallery} />
      <Closing couple={data.couple} />
    </div>
  )
}
