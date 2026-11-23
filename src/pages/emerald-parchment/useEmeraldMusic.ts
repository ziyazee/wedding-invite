import { useCallback, useEffect, useRef, useState } from 'react'

export function useEmeraldMusic() {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [muted, setMuted] = useState(false)
  const fadeRef = useRef<ReturnType<typeof setInterval>>()
  const startedRef = useRef(false)

  const startMusic = useCallback(() => {
    const audio = audioRef.current
    if (!audio || startedRef.current) return
    startedRef.current = true
    audio.volume = 0
    audio.play().catch(() => {})
    clearInterval(fadeRef.current)
    fadeRef.current = setInterval(() => {
      if (!audioRef.current) return
      const next = Math.min(1, audioRef.current.volume + 0.05)
      audioRef.current.volume = next
      if (next >= 1) clearInterval(fadeRef.current)
    }, 100)
  }, [])

  const toggleMute = useCallback(() => {
    setMuted(prev => {
      const next = !prev
      if (audioRef.current) audioRef.current.muted = next
      return next
    })
  }, [])

  useEffect(() => {
    function onVisibility() {
      const audio = audioRef.current
      if (!audio || !startedRef.current) return
      if (document.hidden) {
        audio.pause()
      } else if (!audio.muted) {
        audio.play().catch(() => {})
      }
    }
    document.addEventListener('visibilitychange', onVisibility)
    return () => {
      document.removeEventListener('visibilitychange', onVisibility)
      clearInterval(fadeRef.current)
    }
  }, [])

  return { audioRef, startMusic, muted, toggleMute }
}
