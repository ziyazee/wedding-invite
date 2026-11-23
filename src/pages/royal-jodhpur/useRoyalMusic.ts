import { useCallback, useEffect, useRef, useState } from 'react'

export function useRoyalMusic(src: string | undefined) {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [playing, setPlaying] = useState(false)
  const awayPaused = useRef(false)

  useEffect(() => {
    if (!src) return
    const audio = new Audio(src)
    audio.loop = true
    audio.preload = 'none'
    audio.volume = 0.55
    audioRef.current = audio

    function tryAutoplay() {
      audio.play().then(() => setPlaying(true)).catch(() => {
        setPlaying(false)
        function onFirst() {
          audio.play().then(() => setPlaying(true)).catch(() => {})
          document.removeEventListener('touchstart', onFirst)
          document.removeEventListener('click', onFirst)
          document.removeEventListener('scroll', onFirst)
        }
        document.addEventListener('touchstart', onFirst, { once: true, passive: true })
        document.addEventListener('click', onFirst, { once: true })
        document.addEventListener('scroll', onFirst, { once: true, passive: true })
      })
    }

    tryAutoplay()
    const retry = setTimeout(tryAutoplay, 400)

    function onVis() {
      if (document.visibilityState === 'hidden') {
        if (!audio.paused) { awayPaused.current = true; audio.pause() }
      } else if (awayPaused.current && audio.paused) {
        awayPaused.current = false
        audio.play().catch(() => {})
      }
    }
    document.addEventListener('visibilitychange', onVis)
    window.addEventListener('pagehide', () => { if (!audio.paused) { awayPaused.current = true; audio.pause() } })

    return () => {
      clearTimeout(retry)
      document.removeEventListener('visibilitychange', onVis)
      audio.pause()
      audio.src = ''
      audioRef.current = null
    }
  }, [src])

  const toggle = useCallback(() => {
    const audio = audioRef.current
    if (!audio) return
    if (playing) { audio.pause(); setPlaying(false) }
    else { audio.play().then(() => setPlaying(true)).catch(() => setPlaying(false)) }
  }, [playing])

  return { playing, toggle }
}
