import { useRef, useState, useCallback, useEffect } from 'react'

export function useDestinationMusic(src: string | undefined) {
  const audio = useRef<HTMLAudioElement>(null)
  const [playing, setPlaying] = useState(false)

  const start = useCallback(() => {
    const el = audio.current
    if (!el) return
    el.volume = 0.3
    void el.play().catch(() => {})
  }, [])

  const toggle = useCallback(() => {
    const el = audio.current
    if (!el) return
    if (el.paused) void el.play().catch(() => {})
    else el.pause()
  }, [])

  useEffect(() => {
    const onVis = () => {
      const el = audio.current
      if (!el) return
      if (document.hidden) el.pause()
      else if (playing) void el.play().catch(() => {})
    }
    document.addEventListener('visibilitychange', onVis)
    return () => document.removeEventListener('visibilitychange', onVis)
  }, [playing])

  return { audio, playing, setPlaying, start, toggle, src }
}
