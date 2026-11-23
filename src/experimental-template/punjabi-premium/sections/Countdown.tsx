import { useState, useEffect, useMemo } from 'react'
import { ScallopedBorder, LotusFlower, VineBorder } from '../assets'

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
  const diff = new Date(target).getTime() - Date.now()
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 }
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  }
}

function formatWeddingDate(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

function padTwo(n: number): string {
  return n.toString().padStart(2, '0')
}

const units = [
  { key: 'days', label: 'Days' },
  { key: 'hours', label: 'Hours' },
  { key: 'minutes', label: 'Min' },
  { key: 'seconds', label: 'Sec' },
] as const

export default function Countdown({ weddingDate }: Props) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(() => calcTimeLeft(weddingDate))

  useEffect(() => {
    const id = setInterval(() => setTimeLeft(calcTimeLeft(weddingDate)), 1000)
    return () => clearInterval(id)
  }, [weddingDate])

  const formattedDate = useMemo(() => formatWeddingDate(weddingDate), [weddingDate])

  return (
    <section className="pp-countdown" aria-label="Countdown to the wedding">
      <h2 className="pp-countdown__heading">Counting the Days</h2>

      <div className="pp-countdown__frame">
        {/* Scalloped top edge */}
        <ScallopedBorder cusps={5} color="#D5C4A8" className="pp-countdown__frame-scallop" />

        {/* Vine borders */}
        <div className="pp-countdown__frame-vines pp-countdown__frame-vines--left" aria-hidden="true">
          <VineBorder height={200} opacity={0.15} />
        </div>
        <div className="pp-countdown__frame-vines pp-countdown__frame-vines--right" aria-hidden="true">
          <VineBorder height={200} opacity={0.15} />
        </div>

        {/* Countdown grid */}
        <div className="pp-countdown__grid" role="timer" aria-label="Time remaining until wedding">
          {units.map(({ key, label }) => (
            <div key={key} className="pp-countdown__unit">
              <span className="pp-countdown__digit" aria-label={`${timeLeft[key]} ${label}`}>
                {padTwo(timeLeft[key])}
              </span>
              <span className="pp-countdown__label" aria-hidden="true">
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Full date */}
      <p className="pp-countdown__date pp-script">{formattedDate}</p>

      {/* Lotus */}
      <div className="pp-countdown__lotus" aria-hidden="true">
        <LotusFlower size={36} />
      </div>
    </section>
  )
}
