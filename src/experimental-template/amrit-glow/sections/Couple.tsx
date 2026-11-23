import { useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import type { CoupleInfo } from '../types'
import { GoldCornerOrnament, OrnateRule, NoiseTexture } from '../assets/svg'

gsap.registerPlugin(ScrollTrigger)

interface Props {
  couple: CoupleInfo
}

const REVEAL = { y: 24, opacity: 0, duration: 0.8, ease: 'power2.out' }
const TRIGGER = { start: 'top 85%', once: true, toggleActions: 'play none none none' as const }

export default function Couple({ couple }: Props) {
  const sectionRef = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

      // Names reveal
      gsap.from('.ag-couple-names', {
        ...REVEAL,
        duration: 1.0,
        scrollTrigger: { trigger: '.ag-section-couple', ...TRIGGER },
      })

      // Family info
      gsap.from('.ag-couple-family > *', {
        ...REVEAL,
        stagger: 0.1,
        scrollTrigger: { trigger: '.ag-couple-family', ...TRIGGER, start: 'top 88%' },
      })

      // OrnateRule divider
      gsap.from('.ag-couple-divider', {
        ...REVEAL,
        scrollTrigger: { trigger: '.ag-couple-divider', ...TRIGGER, start: 'top 90%' },
      })

      // Gold corners fade + scale
      gsap.from('.ag-section-couple .ag-gold-corner', {
        opacity: 0,
        scale: 0.85,
        duration: 1.0,
        ease: 'power2.out',
        stagger: 0.05,
        scrollTrigger: { trigger: '.ag-section-couple', ...TRIGGER },
      })
    },
    { scope: sectionRef },
  )

  const brideLabel = couple.brideParentLabel || 'daughter of'
  const groomLabel = couple.groomParentLabel || 'son of'

  return (
    <section ref={sectionRef} className="ag-section-couple">
      <NoiseTexture className="ag-noise-overlay" />

      {/* Gold glow behind names */}
      <div className="ag-couple-glow" />

      {/* Gold corners */}
      <GoldCornerOrnament position="top-left" size={80} className="ag-gold-corner ag-corner-tl" />
      <GoldCornerOrnament position="top-right" size={80} className="ag-gold-corner ag-corner-tr" />
      <GoldCornerOrnament position="bottom-left" size={80} className="ag-gold-corner ag-corner-bl" />
      <GoldCornerOrnament position="bottom-right" size={80} className="ag-gold-corner ag-corner-br" />

      {/* Couple names */}
      <div className="ag-couple-names">
        <span className="ag-couple-name ag-type-names">{couple.brideName}</span>
        <span className="ag-couple-ampersand ag-type-detail">&amp;</span>
        <span className="ag-couple-name ag-type-names">{couple.groomName}</span>
      </div>

      {/* Ornamental divider */}
      <div className="ag-couple-divider">
        <OrnateRule width={200} />
      </div>

      {/* Family details */}
      <div className="ag-couple-family">
        <div className="ag-family-block">
          <span className="ag-family-label ag-type-small">{brideLabel}</span>
          <span className="ag-family-names ag-type-detail">
            {couple.brideMother} &amp; {couple.brideFather}
          </span>
        </div>

        <div className="ag-family-block">
          <span className="ag-family-label ag-type-small">{groomLabel}</span>
          <span className="ag-family-names ag-type-detail">
            {couple.groomMother} &amp; {couple.groomFather}
          </span>
        </div>
      </div>
    </section>
  )
}
