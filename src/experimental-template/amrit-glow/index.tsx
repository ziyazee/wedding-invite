import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { sampleWedding } from './data/sample'
import AmbientLayer from './animations/AmbientLayer'
import type { ParticleConfig } from './animations/AmbientLayer'
import Opening from './sections/Opening'
import Couple from './sections/Couple'
import Countdown from './sections/Countdown'
import Celebrations from './sections/Celebrations'
import RSVP from './sections/RSVP'
import PersonalNotes from './sections/PersonalNotes'
import Closing from './sections/Closing'
import { ThinGoldRule, MarigoldGarlandSvg } from './assets/svg'
import './styles/main.css'

// Particle asset imports
import sparkle2 from './assets/images/animated/sparkle-2.png'
import sparkle3 from './assets/images/animated/sparkle-3.png'
import sparkle4 from './assets/images/animated/sparkle-4.png'
import sparkle6 from './assets/images/animated/sparkle-6.png'
import leaf1 from './assets/images/animated/leaf-1.png'
import leaf2 from './assets/images/animated/leaf-2.png'
import leaf3 from './assets/images/animated/leaf-3.png'
import marigold1 from './assets/images/animated/marigold-1.png'
import marigold2 from './assets/images/animated/marigold-2.png'
import marigold3 from './assets/images/animated/marigold-3.png'
import marigold4 from './assets/images/animated/marigold-4.png'

gsap.registerPlugin(ScrollTrigger, useGSAP)

/* ── Per-section particle configs (from png-choreography.md) ── */

// Hero: 3-4 sparkles + 2-3 gold leaves = 7 total
const heroParticles: ParticleConfig[] = [
  { src: sparkle6, motionType: 'shimmer-drift', count: 1, sizeRange: [28, 36], opacityRange: [0.15, 0.40], zone: 'full-margin' },
  { src: sparkle2, motionType: 'shimmer-drift', count: 2, sizeRange: [16, 22], opacityRange: [0.15, 0.35], zone: 'full-margin' },
  { src: sparkle4, motionType: 'shimmer-drift', count: 1, sizeRange: [14, 18], opacityRange: [0.12, 0.30], zone: 'upper-field' },
  { src: leaf1, motionType: 'leaf-fall', count: 1, sizeRange: [8, 14], opacityRange: [0.45, 0.80], zone: 'full-margin' },
  { src: leaf2, motionType: 'leaf-fall', count: 1, sizeRange: [8, 12], opacityRange: [0.45, 0.70], zone: 'full-margin' },
]

// Couple: 2 sparkles + 2 gold leaves = 4 total
const coupleParticles: ParticleConfig[] = [
  { src: sparkle3, motionType: 'shimmer-drift', count: 1, sizeRange: [18, 28], opacityRange: [0.15, 0.35], zone: 'left-margin' },
  { src: sparkle4, motionType: 'shimmer-drift', count: 1, sizeRange: [14, 20], opacityRange: [0.12, 0.30], zone: 'right-margin' },
  { src: leaf3, motionType: 'leaf-fall', count: 1, sizeRange: [8, 12], opacityRange: [0.50, 0.75], zone: 'left-margin' },
  { src: leaf1, motionType: 'leaf-fall', count: 1, sizeRange: [8, 12], opacityRange: [0.40, 0.65], zone: 'right-margin' },
]

// Countdown: 2 sparkles (diyas are inline layout elements, not particles)
const countdownParticles: ParticleConfig[] = [
  { src: sparkle4, motionType: 'shimmer-drift', count: 1, sizeRange: [14, 18], opacityRange: [0.12, 0.28], zone: 'left-margin' },
  { src: sparkle3, motionType: 'shimmer-drift', count: 1, sizeRange: [16, 22], opacityRange: [0.12, 0.30], zone: 'right-margin' },
]

// Celebrations: 5-8 marigold petals + 4 sparkles = 14 total
const celebrationsParticles: ParticleConfig[] = [
  { src: marigold1, motionType: 'petal-fall', count: 2, sizeRange: [14, 24], opacityRange: [0.30, 0.55], zone: 'full-margin' },
  { src: marigold2, motionType: 'petal-fall', count: 2, sizeRange: [14, 20], opacityRange: [0.30, 0.50], zone: 'full-margin' },
  { src: marigold3, motionType: 'petal-fall', count: 2, sizeRange: [14, 22], opacityRange: [0.30, 0.50], zone: 'upper-field' },
  { src: marigold4, motionType: 'petal-fall', count: 2, sizeRange: [12, 20], opacityRange: [0.30, 0.45], zone: 'upper-field' },
  { src: sparkle2, motionType: 'shimmer-drift', count: 2, sizeRange: [16, 22], opacityRange: [0.15, 0.35], zone: 'full-margin' },
  { src: sparkle3, motionType: 'shimmer-drift', count: 2, sizeRange: [18, 28], opacityRange: [0.15, 0.35], zone: 'full-margin' },
]

// RSVP: 2 sparkles + 2 gold leaves = 4 (diyas are inline)
const rsvpParticles: ParticleConfig[] = [
  { src: sparkle4, motionType: 'shimmer-drift', count: 2, sizeRange: [14, 20], opacityRange: [0.12, 0.30], zone: 'full-margin' },
  { src: leaf2, motionType: 'leaf-fall', count: 1, sizeRange: [8, 12], opacityRange: [0.40, 0.65], zone: 'left-margin' },
  { src: leaf3, motionType: 'leaf-fall', count: 1, sizeRange: [8, 12], opacityRange: [0.45, 0.70], zone: 'right-margin' },
]

// Personal Notes: 1-2 sparkles
const notesParticles: ParticleConfig[] = [
  { src: sparkle3, motionType: 'shimmer-drift', count: 1, sizeRange: [16, 24], opacityRange: [0.12, 0.30], zone: 'right-margin' },
  { src: sparkle4, motionType: 'shimmer-drift', count: 1, sizeRange: [12, 18], opacityRange: [0.10, 0.25], zone: 'left-margin' },
]

// Closing: 2-3 marigold petals + 2 sparkles + leaf = 6
const closingParticles: ParticleConfig[] = [
  { src: marigold1, motionType: 'petal-fall', count: 1, sizeRange: [14, 20], opacityRange: [0.30, 0.50], zone: 'full-margin' },
  { src: marigold3, motionType: 'petal-fall', count: 1, sizeRange: [14, 22], opacityRange: [0.30, 0.50], zone: 'full-margin' },
  { src: sparkle2, motionType: 'shimmer-drift', count: 1, sizeRange: [16, 22], opacityRange: [0.15, 0.35], zone: 'left-margin' },
  { src: sparkle4, motionType: 'shimmer-drift', count: 1, sizeRange: [14, 18], opacityRange: [0.12, 0.28], zone: 'right-margin' },
  { src: leaf1, motionType: 'leaf-fall', count: 1, sizeRange: [8, 12], opacityRange: [0.45, 0.70], zone: 'full-margin' },
  { src: marigold2, motionType: 'petal-fall', count: 1, sizeRange: [12, 18], opacityRange: [0.25, 0.45], zone: 'upper-field' },
]

export default function AmritGlow() {
  const data = sampleWedding
  const containerRef = useRef<HTMLDivElement>(null)

  // Refresh ScrollTrigger when fonts are ready
  useEffect(() => {
    document.fonts.ready.then(() => {
      ScrollTrigger.refresh()
    })
  }, [])

  return (
    <div ref={containerRef} className="ag-page" style={{ isolation: 'isolate' }}>
      {/* ── Section 1: Hero ── */}
      <div className="ag-section-wrap">
        <AmbientLayer particles={heroParticles} className="ag-particles-hero" />
        <Opening couple={data.couple} weddingDate={data.weddingDate} />
      </div>

      {/* Transition: 64px dark space after arch */}
      <div className="ag-section-spacer ag-spacer-3xl" />

      {/* ── Section 2: Couple & Family ── */}
      <div className="ag-section-wrap">
        <AmbientLayer particles={coupleParticles} className="ag-particles-couple" />
        <Couple couple={data.couple} />
      </div>

      {/* Transition: ThinGoldRule + 48px */}
      <div className="ag-section-divider">
        <ThinGoldRule width={120} />
      </div>

      {/* ── Section 3: Countdown ── */}
      <div className="ag-section-wrap">
        <AmbientLayer particles={countdownParticles} className="ag-particles-countdown" />
        <Countdown weddingDate={data.weddingDate} />
      </div>

      {/* Transition: Marigold garland + 64px */}
      <div className="ag-section-divider ag-divider-garland">
        <MarigoldGarlandSvg width={300} className="ag-garland-transition" />
      </div>

      {/* ── Section 4: Celebrations ── */}
      <div className="ag-section-wrap ag-celebrations-wrap">
        <AmbientLayer particles={celebrationsParticles} className="ag-particles-celebrations" />
        <Celebrations events={data.celebrations} />
      </div>

      {/* Transition: ThinGoldRule + 64px */}
      <div className="ag-section-divider">
        <ThinGoldRule width={120} />
      </div>

      {/* ── Section 5: RSVP ── */}
      <div className="ag-section-wrap">
        <AmbientLayer particles={rsvpParticles} className="ag-particles-rsvp" />
        <RSVP />
      </div>

      {/* Transition: ThinGoldRule + 64px */}
      <div className="ag-section-divider">
        <ThinGoldRule width={120} />
      </div>

      {/* ── Section 6: Personal Notes ── */}
      <div className="ag-section-wrap">
        <AmbientLayer particles={notesParticles} className="ag-particles-notes" />
        <PersonalNotes
          personalNote={data.personalNote}
          blessing={data.blessing}
          couple={data.couple}
        />
      </div>

      {/* No explicit divider — fade gradient handles transition */}

      {/* ── Section 7: Closing ── */}
      <div className="ag-section-wrap">
        <AmbientLayer particles={closingParticles} className="ag-particles-closing" />
        <Closing couple={data.couple} weddingDate={data.weddingDate} />
      </div>
    </div>
  )
}
