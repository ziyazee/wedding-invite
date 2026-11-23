import { useCallback, useEffect, useRef, useState } from 'react'

export function useMaroonMusic(musicSrc: string, gateOpened: boolean) {
  const [muted, setMuted] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const startedRef = useRef(false)

  useEffect(() => {
    const audio = new Audio()
    audio.src = musicSrc
    audio.preload = 'metadata'
    audio.loop = true
    audioRef.current = audio
    return () => { audio.pause(); audio.src = ''; audioRef.current = null }
  }, [musicSrc])

  useEffect(() => {
    if (!gateOpened || startedRef.current) return
    const audio = audioRef.current
    if (!audio) return
    audio.volume = 0
    audio.muted = false
    const p = audio.play()
    if (p) p.then(() => {
      startedRef.current = true
      const target = 0.65
      const step = 0.02
      function tick() {
        if (audio.volume < target) {
          audio.volume = Math.min(target, audio.volume + step)
          setTimeout(tick, 100)
        }
      }
      tick()
    }).catch(() => {})
  }, [gateOpened])

  useEffect(() => {
    function onVis() {
      const audio = audioRef.current
      if (!audio || !startedRef.current) return
      if (document.hidden) audio.pause()
      else if (!audio.muted) audio.play().catch(() => {})
    }
    document.addEventListener('visibilitychange', onVis)
    return () => document.removeEventListener('visibilitychange', onVis)
  }, [])

  const toggleMute = useCallback(() => {
    setMuted(prev => {
      const next = !prev
      if (audioRef.current) audioRef.current.muted = next
      return next
    })
  }, [])

  return { muted, toggleMute, audioRef }
}
