import { useEffect, useState } from 'react'

export function useBloomCountdown(isoDate: string) {
  const [now, setNow] = useState(Date.now)
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(timer)
  }, [])
  const target = new Date(isoDate).getTime()
  let remaining = Math.max(0, Math.floor((target - now) / 1000))
  const days = Math.floor(remaining / 86400); remaining %= 86400
  const hours = Math.floor(remaining / 3600); remaining %= 3600
  const minutes = Math.floor(remaining / 60)
  const seconds = remaining % 60
  return { days, hours, minutes, seconds }
}
