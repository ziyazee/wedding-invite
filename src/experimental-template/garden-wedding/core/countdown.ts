/* Golden — shared countdown logic. Sections bring their own markup. */

import { useEffect, useState } from 'react'

export interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
  /** Milliseconds remaining, never negative. */
  total: number
  ended: boolean
}

export function getTimeLeft(target: string, now: number = Date.now()): TimeLeft {
  const total = Math.max(0, new Date(target).getTime() - now)
  return {
    days: Math.floor(total / 86_400_000),
    hours: Math.floor((total / 3_600_000) % 24),
    minutes: Math.floor((total / 60_000) % 60),
    seconds: Math.floor((total / 1000) % 60),
    total,
    ended: total === 0,
  }
}

export const pad2 = (n: number) => String(n).padStart(2, '0')

/** Ticks once a second. Pass `enabled=false` to freeze (e.g. screenshots). */
export function useCountdown(target: string, enabled = true): TimeLeft {
  const [time, setTime] = useState(() => getTimeLeft(target))
  useEffect(() => {
    setTime(getTimeLeft(target))
    if (!enabled) return
    const id = window.setInterval(() => setTime(getTimeLeft(target)), 1000)
    return () => window.clearInterval(id)
  }, [target, enabled])
  return time
}
