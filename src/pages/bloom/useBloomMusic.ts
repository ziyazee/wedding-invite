import { useCallback, useEffect, useRef, useState } from 'react'

export function useBloomMusic(src: string) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [muted, setMuted] = useState(true)
  const [visible, setVisible] = useState(false)

  const start = useCallback(() => {
    const audio = audioRef.current
    if (!audio) return
    audio.volume = 0.4
    setVisible(true)
    setMuted(false)
    void audio.play().catch(() => {})
  }, [])

  useEffect(() => {
    const startOnFirstTouch = () => start()
    document.addEventListener('pointerdown', startOnFirstTouch, { once: true, capture: true })
    return () => document.removeEventListener('pointerdown', startOnFirstTouch, true)
  }, [start])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio || muted) return
    const sync = () => {
      if (document.hidden) audio.pause()
      else void audio.play().catch(() => {})
    }
    document.addEventListener('visibilitychange', sync)
    return () => document.removeEventListener('visibilitychange', sync)
  }, [muted])

  const toggle = useCallback(() => {
    const audio = audioRef.current
    if (!audio) return
    setVisible(true)
    if (audio.paused) {
      audio.volume = 0.4
      setMuted(false)
      void audio.play().catch(() => {})
    } else {
      audio.pause()
      setMuted(true)
    }
  }, [])

  return { audioRef, muted, visible, start, toggle, src }
}
