import { useRef, useState, useCallback, useEffect } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import type { CoupleInfo } from '../types'
import { LanternSvg, MoroccanTileSvg, ScrollHintSvg } from '../assets/svg'

interface Props {
  couple: CoupleInfo
  weddingDate: string
  hashtag?: string
}

function formatLongDate(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export default function Opening({ couple, weddingDate, hashtag }: Props) {
  const sectionRef = useRef<HTMLElement>(null)
  const [doorsOpen, setDoorsOpen] = useState(false)

  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  useEffect(() => {
    if (prefersReducedMotion) return
    if (!doorsOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [doorsOpen, prefersReducedMotion])

  const handleDoorTap = useCallback(() => {
    if (doorsOpen) return
    setDoorsOpen(true)
  }, [doorsOpen])

  useGSAP(
    () => {
      if (prefersReducedMotion) {
        gsap.set(
          [
            '.nn-hero-names',
            '.nn-hero-subtitle',
            '.nn-hero-date',
            '.nn-hero-hashtag',
            '.nn-scroll-hint',
            '.nn-door-hint',
            '.nn-hero-lantern',
            '.nn-bismillah-hero',
          ],
          { opacity: 1 },
        )
        return
      }

      const tl = gsap.timeline({ defaults: { ease: 'power2.out' } })

      tl.fromTo(
        '.nn-hero-lantern',
        { opacity: 0, y: -24 },
        { opacity: 0.55, y: 0, duration: 1.2, stagger: 0.25 },
        0.4,
      )

      tl.fromTo(
        '.nn-door-hint',
        { opacity: 0, y: 6 },
        { opacity: 1, y: 0, duration: 0.7 },
        1.0,
      )
    },
    { scope: sectionRef },
  )

  useGSAP(
    () => {
      if (!doorsOpen || prefersReducedMotion) return

      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

      tl.to('.nn-door-hint', { opacity: 0, duration: 0.25 }, 0)

      tl.fromTo(
        '.nn-hero-glow',
        { opacity: 0, scale: 0.6 },
        { opacity: 1, scale: 1, duration: 2, ease: 'power2.out' },
        0.3,
      )

      tl.fromTo(
        '.nn-bismillah-hero',
        { opacity: 0, scale: 0.94 },
        { opacity: 1, scale: 1, duration: 1.1 },
        0.5,
      )

      tl.fromTo(
        '.nn-hero-subtitle',
        { opacity: 0, y: 14 },
        { opacity: 1, y: 0, duration: 0.8 },
        1.2,
      )

      tl.fromTo(
        '.nn-hero-names',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 1 },
        1.5,
      )

      tl.fromTo(
        '.nn-hero-date',
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.7 },
        2.0,
      )

      tl.fromTo(
        '.nn-hero-hashtag',
        { opacity: 0 },
        { opacity: 1, duration: 0.6 },
        2.3,
      )

      tl.fromTo(
        '.nn-scroll-hint',
        { opacity: 0, y: 6 },
        { opacity: 1, y: 0, duration: 0.6 },
        2.6,
      )
    },
    { scope: sectionRef, dependencies: [doorsOpen] },
  )

  return (
    <section ref={sectionRef} className="nn-hero">
      <div className="nn-hero-pattern">
        <MoroccanTileSvg width={340} />
      </div>

      <div className="nn-hero-lantern nn-hero-lantern--left">
        <LanternSvg width={26} />
      </div>
      <div className="nn-hero-lantern nn-hero-lantern--right">
        <LanternSvg width={22} />
      </div>

      <div
        className={`nn-door-wrap ${doorsOpen ? 'nn-doors-open' : ''}`}
        onClick={handleDoorTap}
      >
        <div className="nn-door-left" />
        <div className="nn-door-right" />

        <span className="nn-door-hint">Tap to open</span>
      </div>

      <div className="nn-hero-glow" />

      <div className="nn-hero-content">
        <p className="nn-bismillah-hero">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</p>
        <p className="nn-hero-subtitle">We're Getting Married</p>
        <div className="nn-hero-names">
          <span className="nn-hero-name">{couple.brideName}</span>
          <span className="nn-hero-ampersand">&</span>
          <span className="nn-hero-name">{couple.groomName}</span>
        </div>
        <p className="nn-hero-date">{formatLongDate(weddingDate)}</p>
        {hashtag && <p className="nn-hero-hashtag">{hashtag}</p>}
      </div>

      <div className="nn-scroll-hint">
        <span className="nn-scroll-hint__text">Scroll</span>
        <ScrollHintSvg width={16} />
      </div>
    </section>
  )
}
