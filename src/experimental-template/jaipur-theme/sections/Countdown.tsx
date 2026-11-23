import { useState, useEffect, useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'

interface CountdownProps {
  weddingDate: string
}

function getTimeLeft(target: string) {
  const diff = new Date(target).getTime() - Date.now()
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 }
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  }
}

export default function Countdown({ weddingDate }: CountdownProps) {
  const [time, setTime] = useState(() => getTimeLeft(weddingDate))
  const sectionRef = useRef<HTMLElement>(null)

  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  useEffect(() => {
    const id = setInterval(() => setTime(getTimeLeft(weddingDate)), 1000)
    return () => clearInterval(id)
  }, [weddingDate])

  useGSAP(
    () => {
      if (prefersReducedMotion || !sectionRef.current) return

      const els = sectionRef.current.querySelectorAll(
        '.jt-countdown__label, .jt-countdown__unit'
      )

      gsap.set(els, { opacity: 0 })

      gsap.to(els, {
        opacity: 1,
        duration: 0.7,
        stagger: 0.1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
          once: true,
        },
      })
    },
    { scope: sectionRef }
  )

  const units = [
    { value: time.days, label: 'Days' },
    { value: time.hours, label: 'Hours' },
    { value: time.minutes, label: 'Minutes' },
    { value: time.seconds, label: 'Seconds' },
  ]

  return (
    <section ref={sectionRef} className="jt-countdown" aria-label="Countdown">
      <p className="jt-countdown__label">Counting Down To</p>
      <div className="jt-countdown__timer">
        {units.map((u) => (
          <div key={u.label} className="jt-countdown__unit">
            <span className="jt-countdown__number">
              {String(u.value).padStart(2, '0')}
            </span>
            <span className="jt-countdown__unit-label">{u.label}</span>
          </div>
        ))}
      </div>
    </section>
  )
}
