import { useState, useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { TimerUnitFrame, DiyaRuleComposition, NoiseTexture } from '../assets/svg'

gsap.registerPlugin(ScrollTrigger)

interface Props {
  weddingDate: string
}

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

function calcTimeLeft(target: string): TimeLeft {
  const diff = Math.max(0, new Date(target).getTime() - Date.now())
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  }
}

function pad(n: number): string {
  return String(n).padStart(2, '0')
}

const REVEAL = { y: 24, opacity: 0, duration: 0.8, ease: 'power2.out' }
const TRIGGER = { start: 'top 85%', once: true, toggleActions: 'play none none none' as const }

export default function Countdown({ weddingDate }: Props) {
  const [time, setTime] = useState(() => calcTimeLeft(weddingDate))
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const id = setInterval(() => setTime(calcTimeLeft(weddingDate)), 1000)
    return () => clearInterval(id)
  }, [weddingDate])

  useGSAP(
    () => {
      if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

      gsap.from('.ag-countdown-text', {
        ...REVEAL,
        scrollTrigger: { trigger: '.ag-section-countdown', ...TRIGGER },
      })

      gsap.from('.ag-timer-unit', {
        ...REVEAL,
        stagger: 0.08,
        scrollTrigger: { trigger: '.ag-timer-row', ...TRIGGER, start: 'top 88%' },
      })

      gsap.from('.ag-countdown-close', {
        opacity: 0,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: { trigger: '.ag-countdown-close', ...TRIGGER, start: 'top 90%' },
      })
    },
    { scope: sectionRef },
  )

  const units: Array<{ value: number; label: string }> = [
    { value: time.days, label: 'Days' },
    { value: time.hours, label: 'Hours' },
    { value: time.minutes, label: 'Min' },
    { value: time.seconds, label: 'Sec' },
  ]

  return (
    <section ref={sectionRef} className="ag-section-countdown">
      <NoiseTexture className="ag-noise-overlay" />

      {/* Lamp glow behind timer */}
      <div className="ag-countdown-lamp-glow" />

      <p className="ag-countdown-text ag-type-detail">Together, we begin</p>

      <div className="ag-timer-row">
        {units.map((u) => (
          <div key={u.label} className="ag-timer-unit">
            <TimerUnitFrame size={72} className="ag-timer-frame" />
            <span className="ag-timer-number ag-type-timer-num">{pad(u.value)}</span>
            <span className="ag-timer-label ag-type-timer-label">{u.label}</span>
          </div>
        ))}
      </div>

      <div className="ag-countdown-close">
        <DiyaRuleComposition width={200} />
      </div>
    </section>
  )
}
