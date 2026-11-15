import { useCallback, useEffect, useRef, useState } from 'react'

declare global {
  interface Window {
    __bgMusicControl?: {
      pauseForExternal: () => void
      resumeAfterExternal: () => void
    } | null
  }
}

export function useRaabtaMusic(src: string | undefined) {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const btnRef = useRef<HTMLButtonElement>(null)
  const [playing, setPlaying] = useState(false)
  const userPausedRef = useRef(false)
  const pausedByExternalRef = useRef(false)

  const start = useCallback(() => {
    const audio = audioRef.current
    if (!audio || userPausedRef.current) return
    void audio.play().catch(() => {
      // Keep the play button available if the browser rejects playback.
      if (audioRef.current === audio) setPlaying(false)
    })
  }, [])

  useEffect(() => {
    setPlaying(false)
    userPausedRef.current = false
    pausedByExternalRef.current = false
    if (!src) return

    const audio = new Audio(src)
    audio.loop = true
    audio.preload = 'auto'
    audioRef.current = audio
    const onPlay = () => setPlaying(true)
    const onPause = () => setPlaying(false)
    audio.addEventListener('play', onPlay)
    audio.addEventListener('pause', onPause)

    const control = {
      pauseForExternal() {
        if (audio.paused) return
        pausedByExternalRef.current = true
        audio.pause()
      },
      resumeAfterExternal() {
        if (!pausedByExternalRef.current) return
        pausedByExternalRef.current = false
        start()
      },
    }
    const onVisibilityChange = () => {
      if (document.hidden) control.pauseForExternal()
      else control.resumeAfterExternal()
    }
    document.addEventListener('visibilitychange', onVisibilityChange)
    window.__bgMusicControl = control

    return () => {
      audio.removeEventListener('play', onPlay)
      audio.removeEventListener('pause', onPause)
      audio.pause()
      audioRef.current = null
      document.removeEventListener('visibilitychange', onVisibilityChange)
      if (window.__bgMusicControl === control) window.__bgMusicControl = null
    }
  }, [src, start])

  const toggle = useCallback(() => {
    const audio = audioRef.current
    if (!audio) return
    pausedByExternalRef.current = false
    if (audio.paused) {
      userPausedRef.current = false
      start()
    } else {
      userPausedRef.current = true
      audio.pause()
    }
  }, [start])

  return { playing, start, toggle, btnRef }
}
