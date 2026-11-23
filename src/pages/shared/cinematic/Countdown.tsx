import { useEffect, useRef, useState } from 'react'

interface CountdownProps {
  targetDate: string
  targetTime?: string
  offset: string
}

export function Countdown({ targetDate, targetTime, offset }: CountdownProps) {
  const [remaining, setRemaining] = useState<{ days: number; hours: number; mins: number; secs: number } | null>(null)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (!targetDate) return

    const isoString = targetTime
      ? `${targetDate}T${targetTime}:00${offset}`
      : `${targetDate}T12:00:00${offset}`

    const targetMs = new Date(isoString).getTime()
    if (isNaN(targetMs)) return

    const tick = () => {
      const diff = targetMs - Date.now()
      if (diff <= 0) {
        setRemaining(null)
        if (timerRef.current) clearInterval(timerRef.current)
        return
      }
      const s = Math.floor(diff / 1000)
      setRemaining({
        days: Math.floor(s / 86400),
        hours: Math.floor((s % 86400) / 3600),
        mins: Math.floor((s % 3600) / 60),
        secs: s % 60,
      })
    }

    if (targetMs > Date.now()) {
      tick()
      timerRef.current = setInterval(tick, 1000)
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [targetDate, targetTime, offset])

  if (!remaining) return null

  return (
    <div className="countdown">
      <div className="countdown__unit">
        <span className="countdown__n" data-cd="days">{remaining.days}</span>
        <span className="countdown__l">days</span>
      </div>
      <div className="countdown__unit">
        <span className="countdown__n" data-cd="hours">{remaining.hours}</span>
        <span className="countdown__l">hrs</span>
      </div>
      <div className="countdown__unit">
        <span className="countdown__n" data-cd="mins">{remaining.mins}</span>
        <span className="countdown__l">min</span>
      </div>
      <div className="countdown__unit">
        <span className="countdown__n" data-cd="secs">{remaining.secs}</span>
        <span className="countdown__l">sec</span>
      </div>
    </div>
  )
}
