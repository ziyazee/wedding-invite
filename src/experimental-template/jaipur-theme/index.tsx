/* Jaipur Theme — Main Template Component
   Royal Rajasthani wedding invitation with Hawa Mahal video opening,
   warm rosewood + blush palette, jali lattice motifs, Sanskrit shloka. */

import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { sampleWedding } from './data/sample'
import { ArchDivider } from './assets'
import Opening from './sections/Opening'
import Couple from './sections/Couple'
import Shloka from './sections/Shloka'
import Countdown from './sections/Countdown'
import Celebrations from './sections/Celebrations'
import RSVP from './sections/RSVP'
import Gallery from './sections/Gallery'
import Closing from './sections/Closing'
import Lanterns from './sections/Lanterns'
import './styles/main.css'

gsap.registerPlugin(ScrollTrigger, useGSAP)

const VIDEO_SRC = '/experimental-template/public/Hawa Mahal.mp4'

export default function JaipurTheme() {
  const data = sampleWedding
  const containerRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const coupleSectionRef = useRef<HTMLElement>(null)

  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  useEffect(() => {
    document.fonts.ready.then(() => {
      ScrollTrigger.refresh()
    })
  }, [])

  useGSAP(
    () => {
      if (prefersReducedMotion || !containerRef.current) return

      const archDividers = containerRef.current.querySelectorAll('.jt-divider svg')
      gsap.set(archDividers, { opacity: 0, scaleX: 0.3 })

      ScrollTrigger.batch(archDividers, {
        start: 'top 85%',
        once: true,
        onEnter: (batch) => {
          gsap.to(batch, {
            opacity: 1,
            scaleX: 1,
            duration: 0.8,
            ease: 'power2.out',
            overwrite: true,
          })
        },
      })

      const glowDividers = containerRef.current.querySelectorAll('.jt-divider--glow')
      gsap.set(glowDividers, { scaleX: 0, opacity: 0 })

      ScrollTrigger.batch(glowDividers, {
        start: 'top 85%',
        once: true,
        onEnter: (batch) => {
          gsap.to(batch, {
            scaleX: 1,
            opacity: 1,
            duration: 1.0,
            ease: 'power2.out',
            overwrite: true,
          })
        },
      })
    },
    { scope: containerRef }
  )

  return (
    <div ref={containerRef} className="jt-page">
      <Lanterns />
      <Opening
        couple={data.couple}
        weddingDate={data.weddingDate}
        videoSrc={VIDEO_SRC}
        videoRef={videoRef}
        nextSectionRef={coupleSectionRef}
      />

      {/* Arch divider: Opening → Couple */}
      <div className="jt-divider" style={{ background: 'var(--jt-navy)' }}>
        <ArchDivider />
      </div>

      <div ref={coupleSectionRef as React.RefObject<HTMLDivElement>}>
        <Couple couple={data.couple} heading={data.heading} />
      </div>

      {/* Glow divider: Couple → Shloka */}
      <div className="jt-divider">
        <div className="jt-divider--glow" />
      </div>

      {data.shloka && (
        <Shloka
          shloka={data.shloka}
          translation={data.shlokaTranslation}
        />
      )}

      {/* Arch divider: Shloka → Countdown */}
      <div className="jt-divider" style={{ background: 'var(--jt-navy-deep)' }}>
        <ArchDivider />
      </div>

      <Countdown weddingDate={data.weddingDate} />

      {/* Glow divider: Countdown → Celebrations */}
      <div className="jt-divider" style={{ background: 'var(--jt-navy)' }}>
        <div className="jt-divider--glow" />
      </div>

      <Celebrations events={data.celebrations} />

      {/* Arch divider: Celebrations → RSVP */}
      <div className="jt-divider" style={{ background: 'var(--jt-navy-deep)' }}>
        <ArchDivider />
      </div>

      <RSVP />

      {/* Glow divider: RSVP → Gallery */}
      <div className="jt-divider" style={{ background: 'var(--jt-navy)' }}>
        <div className="jt-divider--glow" />
      </div>

      <Gallery />

      {/* Glow divider: Gallery → Closing */}
      <div className="jt-divider" style={{ background: 'var(--jt-navy-deep)' }}>
        <div className="jt-divider--glow" />
      </div>

      <Closing
        couple={data.couple}
        weddingDate={data.weddingDate}
        blessing={data.blessing}
      />
    </div>
  )
}
