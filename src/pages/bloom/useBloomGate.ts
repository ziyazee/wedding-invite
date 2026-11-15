import { useCallback, useEffect, useRef, useState } from 'react'

type GateState = 'idle' | 'stage-one' | 'finished' | 'started'

export function useBloomGate() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [state, setState] = useState<GateState>('idle')
  const onOpen = useRef<(() => void) | null>(null)

  const open = useCallback(() => {
    const video = videoRef.current
    if (!video || state !== 'idle') return
    video.style.opacity = '1'
    setState('stage-one')
    void video.play().catch(() => {})
  }, [state])

  useEffect(() => {
    const video = videoRef.current
    if (!video || state !== 'stage-one') return
    const finish = () => {
      setState('finished')
      onOpen.current?.()
      setTimeout(() => setState('started'), 1000)
    }
    const revealBeforeEnd = () => {
      if (Number.isFinite(video.duration) && video.duration > 0 && video.duration - video.currentTime <= 1) {
        finish()
      }
    }
    video.addEventListener('timeupdate', revealBeforeEnd)
    video.addEventListener('ended', finish, { once: true })
    video.addEventListener('error', finish, { once: true })
    const fallback = setTimeout(finish, 25000)
    return () => {
      video.removeEventListener('timeupdate', revealBeforeEnd)
      video.removeEventListener('ended', finish)
      video.removeEventListener('error', finish)
      clearTimeout(fallback)
    }
  }, [state])

  return { videoRef, state, open, onOpen }
}
