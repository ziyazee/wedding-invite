import { useEffect, useState } from 'react'

export function useCountdown(date: string, time?: string, offset?: string) {
  const [values, setValues] = useState({ days: '00', hours: '00', mins: '00', secs: '00' })

  useEffect(() => {
    const iso = `${date}T${time || '00:00'}:00${offset || ''}`
    const target = new Date(iso)
    function update() {
      const diff = target.getTime() - Date.now()
      if (diff <= 0) { setValues({ days: '00', hours: '00', mins: '00', secs: '00' }); return }
      setValues({
        days: String(Math.floor(diff / 86400000)).padStart(2, '0'),
        hours: String(Math.floor((diff % 86400000) / 3600000)).padStart(2, '0'),
        mins: String(Math.floor((diff % 3600000) / 60000)).padStart(2, '0'),
        secs: String(Math.floor((diff % 60000) / 1000)).padStart(2, '0'),
      })
    }
    update()
    const id = setInterval(update, 1000)
    return () => clearInterval(id)
  }, [date, time, offset])

  return values
}
