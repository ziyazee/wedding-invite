/* Kerala Dawn — Section 2: Couple & Family
   Kasavu-framed section with family details, nilavilakku divider,
   elephant corners, jasmine garlands, gopuram watermark */

import { useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import {
  KasavuBorder,
  ElephantMotif,
  Nilavilakku,
  JasmineGarland,
  GopuramSilhouette,
} from '../assets'
import type { CoupleInfo } from '../types'

interface CoupleProps {
  couple: CoupleInfo
  heading?: string
}

export default function Couple({ couple, heading }: CoupleProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const frameRef = useRef<HTMLDivElement>(null)
  const garlandTopRef = useRef<HTMLDivElement>(null)
  const headingRef = useRef<HTMLDivElement>(null)
  const groomBlockRef = useRef<HTMLDivElement>(null)
  const dividerRef = useRef<HTMLDivElement>(null)
  const brideBlockRef = useRef<HTMLDivElement>(null)
  const garlandBottomRef = useRef<HTMLDivElement>(null)
  const elephantsRef = useRef<HTMLDivElement[]>([])

  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  useGSAP(
    () => {
      if (prefersReducedMotion) {
        // Everything at final state
        gsap.set(
          [
            frameRef.current,
            garlandTopRef.current,
            headingRef.current,
            groomBlockRef.current,
            dividerRef.current,
            brideBlockRef.current,
            garlandBottomRef.current,
          ],
          { opacity: 1, y: 0, scaleX: 1 }
        )
        gsap.set('.kd-kasavu-frame__elephant', { opacity: 0.15 })
        return
      }

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
          once: true,
        },
        defaults: { ease: 'power2.out' },
      })

      // Kasavu frame border
      tl.fromTo(frameRef.current, { opacity: 0 }, { opacity: 1, duration: 0.8 }, 0)

      // Jasmine garland top
      tl.fromTo(
        garlandTopRef.current,
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.6 },
        0
      )

      // Section heading
      tl.fromTo(
        headingRef.current,
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.6 },
        0.12
      )

      // Groom's family block
      tl.fromTo(
        groomBlockRef.current,
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.6 },
        0.24
      )

      // Nilavilakku divider — grows outward
      tl.fromTo(
        dividerRef.current,
        { opacity: 0, scaleX: 0 },
        { opacity: 1, scaleX: 1, duration: 0.7, ease: 'power3.out', transformOrigin: 'center center' },
        0.36
      )

      // Bride's family block
      tl.fromTo(
        brideBlockRef.current,
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.6 },
        0.48
      )

      // Jasmine garland bottom (rises from above)
      tl.fromTo(
        garlandBottomRef.current,
        { opacity: 0, y: -10 },
        { opacity: 1, y: 0, duration: 0.6 },
        0.6
      )

      // Elephant corners — animate in from their respective corners
      tl.fromTo(
        '.kd-kasavu-frame__elephant--tl',
        { opacity: 0, x: -8, y: -8 },
        { opacity: 0.15, x: 0, y: 0, duration: 0.8, ease: 'power2.out' },
        0.72
      )
      tl.fromTo(
        '.kd-kasavu-frame__elephant--tr',
        { opacity: 0, x: 8, y: -8 },
        { opacity: 0.15, x: 0, y: 0, duration: 0.8, ease: 'power2.out' },
        0.72
      )
      tl.fromTo(
        '.kd-kasavu-frame__elephant--bl',
        { opacity: 0, x: -8, y: 8 },
        { opacity: 0.15, x: 0, y: 0, duration: 0.8, ease: 'power2.out' },
        0.78
      )
      tl.fromTo(
        '.kd-kasavu-frame__elephant--br',
        { opacity: 0, x: 8, y: 8 },
        { opacity: 0.15, x: 0, y: 0, duration: 0.8, ease: 'power2.out' },
        0.78
      )

      // Activate kasavu shimmer after reveal
      tl.call(() => {
        frameRef.current?.classList.add('kd-kasavu-active')
      }, [], 0.9)
    },
    { scope: sectionRef }
  )

  const displayHeading =
    heading || 'The Families Invite You to the Wedding Celebration of'

  return (
    <section
      ref={sectionRef}
      className="kd-couple kd-section kd-section--grain"
      aria-label="Couple and family"
    >
      <div className="kd-section__content">
        <div ref={frameRef} className="kd-kasavu-frame">
          {/* Corner elephants */}
          <ElephantMotif
            className="kd-kasavu-frame__elephant kd-kasavu-frame__elephant--tl"
            size={40}
            color="var(--kd-lamp-gold)"
          />
          <ElephantMotif
            className="kd-kasavu-frame__elephant kd-kasavu-frame__elephant--tr"
            size={40}
            flip
            color="var(--kd-lamp-gold)"
          />
          <ElephantMotif
            className="kd-kasavu-frame__elephant kd-kasavu-frame__elephant--bl"
            size={40}
            color="var(--kd-lamp-gold)"
          />
          <ElephantMotif
            className="kd-kasavu-frame__elephant kd-kasavu-frame__elephant--br"
            size={40}
            flip
            color="var(--kd-lamp-gold)"
          />

          {/* Gopuram watermark */}
          <GopuramSilhouette className="kd-couple__gopuram" width={48} />

          {/* Jasmine garland top */}
          <div ref={garlandTopRef} style={{ marginBottom: 24 }}>
            <JasmineGarland className="kd-couple__garland" width={200} />
          </div>

          {/* Section heading */}
          <div ref={headingRef} className="kd-couple__heading">
            {displayHeading}
          </div>

          {/* Groom's family */}
          <div ref={groomBlockRef} className="kd-family">
            <p className="kd-family__label">
              {couple.groomParentLabel || 'Son of'}
            </p>
            <p className="kd-family__parent">{couple.groomFather}</p>
            <p className="kd-family__amp">&amp;</p>
            <p className="kd-family__parent">{couple.groomMother}</p>
            <h3 className="kd-family__name">{couple.groomFullName}</h3>
          </div>

          {/* Nilavilakku divider */}
          <div ref={dividerRef} className="kd-lamp-divider">
            <span className="kd-lamp-divider__line" />
            <Nilavilakku size={10} color="var(--kd-lamp-gold)" />
            <span className="kd-lamp-divider__line" />
          </div>

          {/* Bride's family */}
          <div ref={brideBlockRef} className="kd-family">
            <p className="kd-family__label">
              {couple.brideParentLabel || 'Daughter of'}
            </p>
            <p className="kd-family__parent">{couple.brideFather}</p>
            <p className="kd-family__amp">&amp;</p>
            <p className="kd-family__parent">{couple.brideMother}</p>
            <h3 className="kd-family__name">{couple.brideFullName}</h3>
          </div>

          {/* Jasmine garland bottom */}
          <div ref={garlandBottomRef} style={{ marginTop: 24 }}>
            <JasmineGarland className="kd-couple__garland" width={200} />
          </div>
        </div>
      </div>
    </section>
  )
}
