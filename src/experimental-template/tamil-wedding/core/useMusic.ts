/* Golden — background music state. The renderer owns the <audio>; sections only see MusicApi. */

import { useCallback, useMemo, useRef, useState } from 'react'
import type { MusicApi, MusicConfig } from './contract'

export function useMusic(config?: MusicConfig) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [playing, setPlaying] = useState(false)

  const start = useCallback(() => {
    const audio = audioRef.current
    if (!audio || !audio.paused) return
    if (config?.startAt) audio.currentTime = config.startAt
    audio.volume = config?.volume ?? 0.35
    void audio.play().catch(() => {})
  }, [config?.startAt, config?.volume])

  const toggle = useCallback(() => {
    const audio = audioRef.current
    if (!audio) return
    if (audio.paused) {
      audio.volume = config?.volume ?? 0.35
      void audio.play().catch(() => {})
    } else audio.pause()
  }, [config?.volume])

  const api = useMemo<MusicApi>(
    () => ({ available: Boolean(config?.src), playing, start, toggle }),
    [config?.src, playing, start, toggle],
  )

  const audioProps = {
    ref: audioRef,
    src: config?.src,
    loop: true,
    preload: 'none' as const,
    onPlay: () => setPlaying(true),
    onPause: () => setPlaying(false),
  }

  return { api, audioProps }
}
