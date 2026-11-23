import { useState, useEffect, useRef } from 'react'
import { FourPointStar, OrnamentalDivider } from '../assets'

interface Props {
  weddingDate: string
}

function getTimeLeft(target: number) {
  const diff = Math.max(0, target - Date.now())
  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff % 86400000) / 3600000),
    minutes: Math.floor((diff % 3600000) / 60000),
    seconds: Math.floor((diff % 60000) / 1000),
  }
}

export default function Countdown({ weddingDate }: Props) {
  const target = new Date(weddingDate).getTime()
  const [time, setTime] = useState(() => getTimeLeft(target))
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const id = setInterval(() => setTime(getTimeLeft(target)), 1000)
    return () => clearInterval(id)
  }, [target])

  const dateObj = new Date(weddingDate)
  const dayMonth = dateObj.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  })
  const yearNum = dateObj.getFullYear()
  const yearWords = yearNum === 2027
    ? 'Two Thousand Twenty Seven'
    : yearNum === 2026
      ? 'Two Thousand Twenty Six'
      : yearNum === 2028
        ? 'Two Thousand Twenty Eight'
        : String(yearNum)

  const units = [
    { label: 'days', value: time.days },
    { label: 'hrs', value: time.hours },
    { label: 'min', value: time.minutes },
    { label: 'sec', value: time.seconds },
  ]

  return (
    <section ref={sectionRef} className="tj-countdown">
      {/* Section heading */}
      <div className="tj-section-heading">
        <h2 className="tj-section-heading__text">Counting the Days</h2>
        <OrnamentalDivider motif="diamond" width="30%" />
      </div>

      {/* Four-unit countdown display */}
      <div className="tj-countdown-grid">
        {units.map((u) => (
          <div key={u.label} className="tj-countdown-unit">
            <span className="tj-countdown-value">
              {String(u.value).padStart(u.label === 'days' ? 1 : 2, '0')}
            </span>
            <span className="tj-countdown-label">{u.label}</span>
          </div>
        ))}
      </div>

      {/* Written date */}
      <div className="tj-countdown-date">
        <span className="tj-countdown-date__main">{dayMonth}</span>
        <span className="tj-countdown-date__year">{yearWords}</span>
      </div>

      {/* Decorative star */}
      <div className="tj-countdown-star">
        <FourPointStar size={20} />
      </div>
    </section>
  )
}
