import { useCallback, useEffect, useRef, useState } from 'react'

interface MusicToggleProps {
  src: string
  volume?: number
  startTime?: number
  opened: boolean
}

export function MusicToggle({ src, volume = 0.55, startTime = 5, opened }: MusicToggleProps) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [playing, setPlaying] = useState(false)
  const startedRef = useRef(false)

  const reflectMusic = useCallback((on: boolean) => {
    setPlaying(on)
  }, [])

  // Start music on gate open
  useEffect(() => {
    if (!opened || startedRef.current) return
    startedRef.current = true

    const audio = audioRef.current
    if (!audio) return

    audio.muted = false
    audio.volume = volume
    audio.currentTime = startTime
    audio.play().then(() => {
      reflectMusic(true)
    }).catch(() => {
      reflectMusic(false)
    })
  }, [opened, volume, startTime, reflectMusic])

  const toggle = useCallback(() => {
    const audio = audioRef.current
    if (!audio) return

    if (playing) {
      audio.pause()
      reflectMusic(false)
    } else {
      audio.muted = false
      if (audio.currentTime < startTime) audio.currentTime = startTime
      audio.play().then(() => reflectMusic(true)).catch(() => {})
    }
  }, [playing, startTime, reflectMusic])

  return (
    <>
      <button
        className={`music${playing ? ' is-playing' : ''}`}
        type="button"
        aria-label="Toggle background music"
        aria-pressed={String(playing)}
        onClick={toggle}
      >
        <svg className="music__on" viewBox="0 0 24 24" aria-hidden="true" focusable={false}>
          <path d="M9 18V6l10-2v12" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="6.5" cy="18" r="2.5" fill="none" stroke="currentColor" strokeWidth="1.7" />
          <circle cx="16.5" cy="16" r="2.5" fill="none" stroke="currentColor" strokeWidth="1.7" />
        </svg>
        <span className="music__bars" aria-hidden="true"><i /><i /><i /></span>
      </button>
      <audio ref={audioRef} src={src} loop preload="none" muted playsInline />
    </>
  )
}
