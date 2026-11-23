/* Kerala Dawn — Section 6: Closing
   Dawn warmth, lotus motifs, blessing text, final lamp */

import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { Lotus, Nilavilakku, KasavuBorder } from '../assets'
import type { CoupleInfo } from '../types'

interface ClosingProps {
  couple: CoupleInfo
  weddingDate: string
  blessing?: string
}

export default function Closing({ couple, weddingDate, blessing }: ClosingProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const frameRef = useRef<HTMLDivElement>(null)
  const lotusDivTopRef = useRef<HTMLDivElement>(null)
  const subtitleRef = useRef<HTMLParagraphElement>(null)
  const lotusWatermarkRef = useRef<HTMLDivElement>(null)
  const blessingRef = useRef<HTMLParagraphElement>(null)
  const lotusDivBottomRef = useRef<HTMLDivElement>(null)
  const namesRef = useRef<HTMLParagraphElement>(null)
  const dateRef = useRef<HTMLParagraphElement>(null)
  const lampRef = useRef<HTMLDivElement>(null)
  const lampGlowRef = useRef<HTMLDivElement>(null)
  const attrRef = useRef<HTMLParagraphElement>(null)

  const dateObj = new Date(weddingDate)
  const formattedDate = dateObj.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })

  const blessingText =
    blessing ||
    'May the light that brought us together continue to guide your journey as one.'

  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  useGSAP(
    () => {
      if (prefersReducedMotion) {
        gsap.set(
          [
            frameRef.current,
            lotusDivTopRef.current,
            subtitleRef.current,
            blessingRef.current,
            lotusDivBottomRef.current,
            namesRef.current,
            dateRef.current,
            lampRef.current,
            attrRef.current,
          ],
          { opacity: 1, y: 0, scale: 1, rotation: 0 }
        )
        gsap.set(lotusWatermarkRef.current, { opacity: 0.08, scale: 1, rotation: 0 })
        gsap.set(lampGlowRef.current, { opacity: 1, scale: 1 })
        return
      }

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
          once: true,
        },
        defaults: { ease: 'power3.out' },
      })

      // Kasavu frame — slower than Couple section
      tl.fromTo(frameRef.current, { opacity: 0 }, { opacity: 1, duration: 1.0 }, 0)

      // Lotus divider top — blooms
      tl.fromTo(
        lotusDivTopRef.current,
        { opacity: 0, scale: 0.7 },
        { opacity: 1, scale: 1, duration: 0.7, transformOrigin: 'center center' },
        0
      )

      // Subtitle
      tl.fromTo(
        subtitleRef.current,
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.6 },
        0.12
      )

      // Lotus watermark — ghostly rotation
      tl.fromTo(
        lotusWatermarkRef.current,
        { opacity: 0, scale: 0.8, rotation: -15 },
        { opacity: 0.08, scale: 1, rotation: 0, duration: 1.2 },
        0.24
      )

      // Blessing text
      tl.fromTo(
        blessingRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8 },
        0.3
      )

      // Lotus divider bottom
      tl.fromTo(
        lotusDivBottomRef.current,
        { opacity: 0, scale: 0.7 },
        { opacity: 1, scale: 1, duration: 0.7, transformOrigin: 'center center' },
        0.42
      )

      // Couple names
      tl.fromTo(
        namesRef.current,
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.6 },
        0.54
      )

      // Date — pure opacity
      tl.fromTo(dateRef.current, { opacity: 0 }, { opacity: 0.8, duration: 0.5 }, 0.66)

      // Final nilavilakku — strongest glow
      tl.fromTo(
        lampRef.current,
        { opacity: 0, y: 8 },
        { opacity: 1, y: 0, duration: 1.0, ease: 'power3.out' },
        0.78
      )

      // Lamp glow pool
      tl.fromTo(
        lampGlowRef.current,
        { opacity: 0, scale: 0.5 },
        { opacity: 1, scale: 1, duration: 1.2, ease: 'power1.out' },
        1.0
      )

      // Start final lamp breathing
      tl.call(() => {
        const lampSvg = lampRef.current?.querySelector('svg')
        lampSvg?.classList.add('kd-lamp-final')
      }, [], 1.8)

      // Attribution
      tl.fromTo(attrRef.current, { opacity: 0 }, { opacity: 0.4, duration: 0.5 }, 2.2)
    },
    { scope: sectionRef }
  )

  return (
    <section
      ref={sectionRef}
      className="kd-closing kd-section kd-section--grain"
      aria-label="Closing blessing"
    >
      <div className="kd-section__content">
        <div ref={frameRef} className="kd-kasavu-frame kd-kasavu-frame--warm">
          {/* Lotus divider top */}
          <div ref={lotusDivTopRef} className="kd-lotus-divider">
            <span className="kd-lotus-divider__line" />
            <Lotus size={32} color="var(--kd-lamp-gold)" />
            <span className="kd-lotus-divider__line" />
          </div>

          {/* Subtitle */}
          <p ref={subtitleRef} className="kd-closing__subtitle">
            With Love and Blessings
          </p>

          {/* Blessing with lotus watermark */}
          <div className="kd-closing__blessing-wrap">
            <div ref={lotusWatermarkRef} className="kd-closing__lotus-watermark">
              <Lotus size={80} color="var(--kd-lamp-gold)" />
            </div>
            <p ref={blessingRef} className="kd-closing__blessing">
              {blessingText}
            </p>
          </div>

          {/* Lotus divider bottom */}
          <div ref={lotusDivBottomRef} className="kd-lotus-divider" style={{ marginBottom: 32 }}>
            <span className="kd-lotus-divider__line" />
            <Lotus size={32} color="var(--kd-lamp-gold)" />
            <span className="kd-lotus-divider__line" />
          </div>

          {/* Couple names reprise */}
          <p ref={namesRef} className="kd-closing__names">
            {couple.groomName}{' '}
            <span className="kd-closing__names-amp">&amp;</span>{' '}
            {couple.brideName}
          </p>

          {/* Date reprise */}
          <p ref={dateRef} className="kd-closing__date">{formattedDate}</p>

          {/* Final nilavilakku with glow */}
          <div ref={lampRef} className="kd-closing__lamp-wrap">
            <div ref={lampGlowRef} className="kd-closing__lamp-glow" />
            <Nilavilakku
              size={20}
              color="var(--kd-lamp-gold)"
              style={{ position: 'relative', zIndex: 1 }}
            />
          </div>
        </div>

        {/* Attribution outside frame */}
        <p ref={attrRef} className="kd-closing__attribution">
          Made with love by Shaadi Invites
        </p>
      </div>
    </section>
  )
}
