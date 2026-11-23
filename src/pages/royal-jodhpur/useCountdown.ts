import { useEffect, useState } from 'react'

export function useCountdown(isoTarget: string) {
  const [diff, setDiff] = useState(() => Math.max(0, new Date(isoTarget).getTime() - Date.now()))

  useEffect(() => {
    const t = new Date(isoTarget).getTime()
    const id = setInterval(() => setDiff(Math.max(0, t - Date.now())), 1000)
    return () => clearInterval(id)
  }, [isoTarget])

  if (diff <= 0) return null
  const days = Math.floor(diff / 86400000)
  const hours = Math.floor((diff % 86400000) / 3600000)
  const mins = Math.floor((diff % 3600000) / 60000)
  const secs = Math.floor((diff % 60000) / 1000)
  const pad = (n: number) => String(n).padStart(2, '0')
  return { days: String(days), hours: pad(hours), mins: pad(mins), secs: pad(secs) }
}
