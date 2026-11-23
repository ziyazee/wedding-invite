/* Kerala Dawn -- Section 3: Countdown
   Minimal contemplative section with nilavilakku, live countdown timer,
   number roll-in on scroll reveal */

import { useRef, useState, useEffect } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { Nilavilakku, KasavuBorder } from '../assets'

interface CountdownProps {
  weddingDate: string
}

function getTimeLeft(dateStr: string) {
  const diff = Math.max(0, new Date(dateStr).getTime() - Date.now())
  return {
    days: String(Math.floor(diff / (1000 * 60 * 60 * 24))).padStart(2, '0'),
    hours: String(Math.floor((diff / (1000 * 60 * 60)) % 24)).padStart(2, '0'),
    minutes: String(Math.floor((diff / (1000 * 60)) % 60)).padStart(2, '0'),
    seconds: String(Math.floor((diff / 1000) % 60)).padStart(2, '0'),
    total: diff,
  }
}

const CELLS: { key: 'days' | 'hours' | 'minutes' | 'seconds'; label: string }[] = [
  { key: 'days', label: 'Days' },
  { key: 'hours', label: 'Hours' },
  { key: 'minutes', label: 'Mins' },
  { key: 'seconds', label: 'Secs' },
]

export default function Countdown({ weddingDate }: CountdownProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const stripTopRef = useRef<HTMLDivElement>(null)
  const stripBottomRef = useRef<HTMLDivElement>(null)
  const lampRef = useRef<HTMLDivElement>(null)
  const subtitleRef = useRef<HTMLParagraphElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)
  const numberRefs = useRef<(HTMLDivElement | null)[]>([])

  const [timeLeft, setTimeLeft] = useState(() => getTimeLeft(weddingDate))

  // Live countdown tick
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(getTimeLeft(weddingDate))
    }, 1000)
    return () => clearInterval(timer)
  }, [weddingDate])

  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  useGSAP(
    () => {
      if (prefersReducedMotion) {
        gsap.set(
          [
            stripTopRef.current,
            stripBottomRef.current,
            lampRef.current,
            subtitleRef.current,
            gridRef.current,
          ],
          { opacity: 1, y: 0, scaleX: 1 }
        )
        numberRefs.current.forEach(ref => {
          if (ref) gsap.set(ref, { opacity: 1, y: 0 })
        })
        return
      }

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
          once: true,
        },
        defaults: { ease: 'power2.out' },
      })

      // Kasavu strips -- grow from center
      tl.fromTo(
        [stripTopRef.current, stripBottomRef.current],
        { opacity: 0, scaleX: 0 },
        { opacity: 1, scaleX: 1, duration: 0.7, ease: 'power3.out', transformOrigin: 'center center' },
        0
      )

      // Activate kasavu shimmer on strips
      tl.call(() => {
        stripTopRef.current?.classList.add('kd-kasavu-shimmer-trigger')
        stripBottomRef.current?.classList.add('kd-kasavu-shimmer-trigger')
      }, [], 0.7)

      // Nilavilakku hero -- appears with intensifying glow
      tl.fromTo(
        lampRef.current,
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' },
        0
      )

      // Subtitle
      tl.fromTo(
        subtitleRef.current,
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.6 },
        0.12
      )

      // Countdown grid container
      tl.fromTo(
        gridRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.3 },
        0.24
      )

      // Number roll-in -- each number rolls up from below with stagger
      numberRefs.current.forEach((ref, i) => {
        if (!ref) return
        tl.fromTo(
          ref,
          { opacity: 0, y: '100%' },
          {
            opacity: 1,
            y: '0%',
            duration: 0.6,
            ease: 'power3.out',
          },
          0.3 + i * 0.08
        )
      })

      // Start lamp breathing after reveal
      tl.call(() => {
        const lampSvg = lampRef.current?.querySelector('svg')
        lampSvg?.classList.add('kd-lamp-breathing')
      }, [], 0.8)
    },
    { scope: sectionRef }
  )

  const hasEnded = timeLeft.total === 0

  return (
    <section
      ref={sectionRef}
      className="kd-countdown kd-section kd-section--grain"
      aria-label="Countdown"
    >
      <div className="kd-countdown__vignette" />

      <div className="kd-section__content" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {/* Kasavu strip top */}
        <div ref={stripTopRef} className="kd-kasavu-strip" style={{ marginBottom: 48 }}>
          <KasavuBorder width={240} height={12} />
        </div>

        {/* Nilavilakku hero lamp */}
        <div ref={lampRef} className="kd-countdown__lamp-wrap">
          <Nilavilakku
            size={20}
            color="var(--kd-lamp-gold)"
            style={{ filter: 'drop-shadow(0 0 16px rgba(212,162,54,0.3))' }}
          />
          {/* Shadow behind lamp */}
          <Nilavilakku
            size={26}
            color="var(--kd-lamp-gold)"
            className="kd-countdown__lamp-shadow"
          />
        </div>

        {/* Subtitle */}
        <p ref={subtitleRef} className="kd-countdown__subtitle">
          Counting the Moments
        </p>

        {/* Countdown grid or ended message */}
        {hasEnded ? (
          <p className="kd-countdown__ended">The Celebration Has Begun</p>
        ) : (
          <div ref={gridRef} className="kd-countdown__grid">
            {CELLS.map((cell, i) => (
              <div key={cell.key} className="kd-countdown__cell">
                <div className="kd-countdown__number-wrap">
                  <div
                    ref={(el) => { numberRefs.current[i] = el }}
                    className="kd-countdown__number"
                  >
                    {timeLeft[cell.key]}
                  </div>
                </div>
                <div className="kd-countdown__label">{cell.label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Kasavu strip bottom */}
        <div ref={stripBottomRef} className="kd-kasavu-strip" style={{ marginTop: 48 }}>
          <KasavuBorder width={240} height={12} />
        </div>
      </div>
    </section>
  )
}
