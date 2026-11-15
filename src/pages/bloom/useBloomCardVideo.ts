import { useEffect } from 'react'

export function useBloomCardVideo(rootRef: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const videos = Array.from(root.querySelectorAll<HTMLVideoElement>('.bloom-event-video'))
    if (!videos.length) return
    const tryPlay = (video: HTMLVideoElement) => {
      video.muted = true
      const attempt = () => void video.play().catch(() => {})
      if (video.readyState >= 3) attempt()
      else video.addEventListener('canplay', attempt, { once: true })
    }
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        const video = entry.target as HTMLVideoElement
        if (entry.isIntersecting) tryPlay(video)
        else video.pause()
      })
    }, { threshold: 0.1 })
    videos.forEach(v => observer.observe(v))
    return () => observer.disconnect()
  }, [rootRef])
}
