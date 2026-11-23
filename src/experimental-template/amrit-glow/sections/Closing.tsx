import { useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import type { CoupleInfo } from '../types'
import { DiyaRuleComposition, OrnateRule, NoiseTexture, DiyaLampSvg } from '../assets/svg'

gsap.registerPlugin(ScrollTrigger)

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

export default function Closing({ couple, weddingDate }: Props) {
  const sectionRef = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

      gsap.from('.ag-closing-names', {
        y: 24,
        opacity: 0,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.ag-section-closing',
          start: 'top 85%',
          once: true,
          toggleActions: 'play none none none',
        },
      })

      gsap.from('.ag-closing-date, .ag-closing-hashtag', {
        y: 24,
        opacity: 0,
        duration: 0.8,
        ease: 'power2.out',
        stagger: 0.1,
        scrollTrigger: {
          trigger: '.ag-closing-names',
          start: 'bottom 90%',
          once: true,
          toggleActions: 'play none none none',
        },
      })

      gsap.from('.ag-closing-diya-row > *', {
        opacity: 0,
        y: 12,
        duration: 0.8,
        ease: 'power2.out',
        stagger: 0.12,
        scrollTrigger: {
          trigger: '.ag-closing-diya-row',
          start: 'top 90%',
          once: true,
          toggleActions: 'play none none none',
        },
      })
    },
    { scope: sectionRef },
  )

  const hashtag = `#${couple.brideName}Weds${couple.groomName}`

  return (
    <section ref={sectionRef} className="ag-section-closing">
      <NoiseTexture className="ag-noise-overlay" />

      {/* Water shimmer effect (CSS-only) */}
      <div className="ag-closing-water-bg ag-water-shimmer" />

      {/* Fade-up gradient from Personal Notes darkness */}
      <div className="ag-closing-fade-up" />

      {/* Couple names */}
      <div className="ag-closing-names">
        <span className="ag-closing-name ag-type-names">{couple.brideName}</span>
        <span className="ag-closing-ampersand ag-type-detail">&amp;</span>
        <span className="ag-closing-name ag-type-names">{couple.groomName}</span>
      </div>

      {/* Date */}
      <p className="ag-closing-date ag-type-label">
        {formatDotDate(weddingDate)}
      </p>

      {/* Hashtag */}
      <p className="ag-closing-hashtag ag-type-body">
        {hashtag}
      </p>

      {/* Diya row — 3 SVG diyas */}
      <div className="ag-closing-diya-row">
        <DiyaLampSvg size={36} className="ag-closing-diya" />
        <DiyaLampSvg size={40} className="ag-closing-diya" />
        <DiyaLampSvg size={36} className="ag-closing-diya" />
      </div>

      {/* DiyaRuleComposition */}
      <div className="ag-closing-rule">
        <DiyaRuleComposition width={200} />
      </div>

      {/* OrnateRule */}
      <div className="ag-closing-ornate">
        <OrnateRule width={200} />
      </div>

      {/* Footer */}
      <footer className="ag-closing-footer ag-type-footer">
        <span className="ag-footer-label">Designed by</span>
        <span className="ag-footer-brand">Shaadi Invites</span>
      </footer>
    </section>
  )
}
