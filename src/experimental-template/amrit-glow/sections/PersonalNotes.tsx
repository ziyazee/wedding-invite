import { useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { GoldCornerOrnament, NoiseTexture } from '../assets/svg'
import type { CoupleInfo } from '../types'

gsap.registerPlugin(ScrollTrigger)

interface Props {
  personalNote?: string
  blessing?: string
  couple: CoupleInfo
}

export default function PersonalNotes({ personalNote, blessing, couple }: Props) {
  const sectionRef = useRef<HTMLElement>(null)
  const text = personalNote || blessing

  useGSAP(
    () => {
      if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

      gsap.from('.ag-personal-note-text', {
        y: 20,
        opacity: 0,
        duration: 1.0,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.ag-section-notes',
          start: 'top 80%',
          once: true,
          toggleActions: 'play none none none',
        },
      })

      gsap.from('.ag-personal-note-attribution', {
        y: 24,
        opacity: 0,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.ag-personal-note-text',
          start: 'bottom 85%',
          once: true,
          toggleActions: 'play none none none',
        },
      })

      // Diagonal gold corners
      gsap.from('.ag-section-notes .ag-gold-corner', {
        opacity: 0,
        scale: 0.85,
        duration: 1.0,
        ease: 'power2.out',
        stagger: 0.15,
        scrollTrigger: {
          trigger: '.ag-section-notes',
          start: 'top 85%',
          once: true,
          toggleActions: 'play none none none',
        },
      })
    },
    { scope: sectionRef },
  )

  if (!text) return null

  return (
    <section ref={sectionRef} className="ag-section-notes">
      <NoiseTexture className="ag-noise-overlay" />

      {/* Subtle gold glow behind text */}
      <div className="ag-notes-glow" />

      {/* Diagonal corners: TL and BR only */}
      <GoldCornerOrnament position="top-left" size={70} className="ag-gold-corner ag-corner-tl" />
      <GoldCornerOrnament position="bottom-right" size={70} className="ag-gold-corner ag-corner-br" />

      {/* Left-aligned content block */}
      <div className="ag-notes-content">
        <p className="ag-personal-note-text ag-type-detail">
          {text}
        </p>
        <p className="ag-personal-note-attribution ag-type-small">
          — {couple.brideName} &amp; {couple.groomName}
        </p>
      </div>
    </section>
  )
}
