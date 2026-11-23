import { useState, useEffect } from 'react'

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

export default function Countdown({ weddingDate }: Props) {
  const [timeLeft, setTimeLeft] = useState(() => calcTimeLeft(weddingDate))

  useEffect(() => {
    const id = setInterval(() => setTimeLeft(calcTimeLeft(weddingDate)), 1000)
    return () => clearInterval(id)
  }, [weddingDate])

  const units: { key: keyof TimeLeft; label: string }[] = [
    { key: 'days', label: 'Days' },
    { key: 'hours', label: 'Hours' },
    { key: 'minutes', label: 'Min' },
    { key: 'seconds', label: 'Sec' },
  ]

  return (
    <section className="nn-section nn-section-countdown">
      <div className="nn-section-inner">
        <p className="nn-countdown-arabic">إِنْ شَاءَ اللَّه</p>
        <p className="nn-countdown-sub">Counting the days</p>

        <div className="nn-countdown-grid">
          {units.map(({ key, label }) => (
            <div key={key} className="nn-countdown-unit">
              <span className="nn-countdown-num">
                {String(timeLeft[key]).padStart(2, '0')}
              </span>
              <span className="nn-countdown-label">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
