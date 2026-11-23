import { useCallback, useEffect, useRef, useState } from 'react'

interface EmeraldGateState {
  loaded: boolean
  heroPhase: number
  namesVisible: boolean
  heroGone: boolean
}

export function useEmeraldGate() {
  const [state, setState] = useState<EmeraldGateState>({
    loaded: false,
    heroPhase: 0,
    namesVisible: false,
    heroGone: false,
  })
  const heroRef = useRef<HTMLElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const posterRef = useRef<HTMLImageElement>(null)
  const loadTimerRef = useRef<ReturnType<typeof setTimeout>>()
  const midFallbackRef = useRef<ReturnType<typeof setTimeout>>()
  const phaseRef = useRef(0)

  useEffect(() => {
    document.body.style.overflowY = 'hidden'
    window.scrollTo(0, 0)

    function finish() {
      clearTimeout(loadTimerRef.current)
      setState(s => s.loaded ? s : { ...s, loaded: true })
    }

    const img = new Image()
    img.onload = finish
    img.onerror = finish
    img.src = '/templates/emerald-parchment/intro.webp'
    loadTimerRef.current = setTimeout(finish, 8000)

    return () => {
      clearTimeout(loadTimerRef.current)
      clearTimeout(midFallbackRef.current)
    }
  }, [])

  // Keep phaseRef in sync
  useEffect(() => { phaseRef.current = state.heroPhase }, [state.heroPhase])

  // Phase 2: play first half, watch for midpoint
  useEffect(() => {
    if (state.heroPhase !== 2) return
    const video = videoRef.current
    if (!video) {
      setState(s => ({ ...s, heroPhase: 3 }))
      return
    }

    video.muted = true
    video.currentTime = 0
    const p = video.play()
    if (p) p.catch(() => {})

    function onPlaying() {
      const poster = posterRef.current
      if (poster) poster.style.opacity = '0'
    }

    function onMid() {
      if (!video!.duration) return
      if (video!.currentTime >= video!.duration * 0.5) {
        video!.pause()
        video!.removeEventListener('timeupdate', onMid)
        clearTimeout(midFallbackRef.current)
        setState(s => s.heroPhase === 2 ? { ...s, heroPhase: 3 } : s)
      }
    }

    video.addEventListener('playing', onPlaying, { once: true })
    video.addEventListener('timeupdate', onMid)

    midFallbackRef.current = setTimeout(() => {
      if (phaseRef.current === 2) {
        video.pause()
        setState(s => s.heroPhase === 2 ? { ...s, heroPhase: 3 } : s)
      }
    }, 5000)

    return () => {
      video.removeEventListener('playing', onPlaying)
      video.removeEventListener('timeupdate', onMid)
      clearTimeout(midFallbackRef.current)
    }
  }, [state.heroPhase])

  // Phase 4: play second half, watch for end
  useEffect(() => {
    if (state.heroPhase !== 4) return
    const video = videoRef.current
    if (!video) {
      setState(s => ({ ...s, heroPhase: 5, namesVisible: true }))
      return
    }

    const p = video.play()
    if (p) p.catch(() => {})

    function done() {
      video!.removeEventListener('ended', done)
      video!.removeEventListener('timeupdate', onNearEnd)
      setState(s => s.heroPhase === 4 ? { ...s, heroPhase: 5, namesVisible: true } : s)
    }

    function onNearEnd() {
      if (video!.duration && video!.currentTime >= video!.duration - 0.2) {
        video!.pause()
        done()
      }
    }

    video.addEventListener('ended', done)
    video.addEventListener('timeupdate', onNearEnd)

    return () => {
      video.removeEventListener('ended', done)
      video.removeEventListener('timeupdate', onNearEnd)
    }
  }, [state.heroPhase])

  const handleTap = useCallback(() => {
    setState(s => {
      if (!s.loaded || s.heroPhase !== 0) return s
      return { ...s, heroPhase: 1 }
    })
  }, [])

  const heroScrollUp = useCallback(() => {
    setState(s => {
      if (s.heroPhase === 1) return { ...s, heroPhase: 2 }
      if (s.heroPhase === 3) return { ...s, heroPhase: 4 }
      if (s.heroPhase === 5) {
        document.body.style.overflowY = 'auto'
        return { ...s, heroGone: true }
      }
      return s
    })
  }, [])

  return { state, heroRef, videoRef, posterRef, handleTap, heroScrollUp }
}
