import { useCallback, useEffect, useRef, useState } from 'react'

interface GateState {
  loaded: boolean
  opened: boolean
  namesVisible: boolean
  contentVisible: boolean
}

export function useMaroonGate() {
  const [state, setState] = useState<GateState>({
    loaded: false,
    opened: false,
    namesVisible: false,
    contentVisible: false,
  })
  const heroRef = useRef<HTMLElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const loadTimerRef = useRef<ReturnType<typeof setTimeout>>()
  const triggeredRef = useRef(false)

  useEffect(() => {
    document.body.style.overflowY = 'hidden'
    window.scrollTo(0, 0)

    const img = new Image()
    function finish() {
      clearTimeout(loadTimerRef.current)
      setState(s => ({ ...s, loaded: true }))
    }
    img.onload = finish
    img.onerror = finish
    img.src = '/templates/maroon-letter/cover.webp'
    loadTimerRef.current = setTimeout(finish, 8000)

    const bg = new Image()
    bg.src = '/templates/maroon-letter/content_bg.webp'
    const lant = new Image()
    lant.src = '/templates/maroon-letter/lantern.webp'

    return () => { clearTimeout(loadTimerRef.current) }
  }, [])

  const triggerNames = useCallback(() => {
    if (triggeredRef.current) return
    triggeredRef.current = true
    setState(s => ({ ...s, namesVisible: true }))
  }, [])

  const showContent = useCallback(() => {
    document.body.style.overflowY = 'auto'
    setState(s => ({ ...s, contentVisible: true }))
  }, [])

  const openGate = useCallback(() => {
    setState(s => {
      if (!s.loaded || s.opened) return s
      return { ...s, opened: true }
    })
  }, [])

  useEffect(() => {
    if (!state.opened) return
    const video = videoRef.current
    if (!video) { triggerNames(); return }

    video.muted = true
    video.currentTime = 0
    const p = video.play()
    if (p) p.catch(() => { triggerNames() })

    function onTime() {
      if (!video!.duration) return
      if (video!.currentTime >= 6 || video!.duration - video!.currentTime <= 1.5) {
        triggerNames()
      }
    }
    function onEnd() { triggerNames() }
    function onErr() { triggerNames() }
    function onPlaying() {
      const poster = heroRef.current?.querySelector<HTMLElement>('.maroon-cover-poster')
      if (poster) poster.style.opacity = '0'
    }

    video.addEventListener('timeupdate', onTime)
    video.addEventListener('ended', onEnd)
    video.addEventListener('error', onErr)
    video.addEventListener('playing', onPlaying)

    return () => {
      video.removeEventListener('timeupdate', onTime)
      video.removeEventListener('ended', onEnd)
      video.removeEventListener('error', onErr)
      video.removeEventListener('playing', onPlaying)
    }
  }, [state.opened, triggerNames])

  return { state, heroRef, videoRef, openGate, showContent }
}
