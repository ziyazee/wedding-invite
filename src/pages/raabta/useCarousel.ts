import { useCallback, useEffect, useRef, useState } from 'react'

const AUTOPLAY_MS = 4500
const SETTLE_MS = 900

export function useCarousel(count: number) {
  const trackRef = useRef<HTMLDivElement>(null)
  const [index, setIndex] = useState(0)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const reduceMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const stopAuto = useCallback(() => {
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null }
  }, [])

  const goTo = useCallback((i: number) => {
    const real = ((i % count) + count) % count
    setIndex(real)
    const track = trackRef.current
    if (track) {
      track.style.transition = ''
      track.style.transform = `translateX(-${real * 100}%)`
    }
  }, [count])

  const startAuto = useCallback(() => {
    if (reduceMotion || count < 2 || timerRef.current) return
    timerRef.current = setInterval(() => {
      setIndex(prev => {
        const next = prev + 1
        const track = trackRef.current
        if (!track) return prev
        track.style.transition = ''
        track.style.transform = `translateX(-${next * 100}%)`

        if (next >= count) {
          let done = false
          const finish = () => {
            if (done) return
            done = true
            track.removeEventListener('transitionend', onEnd)
            clearTimeout(fallback)
            track.style.transition = 'none'
            track.style.transform = `translateX(0%)`
            void track.offsetWidth
            track.style.transition = ''
            setIndex(0)
          }
          const onEnd = (e: TransitionEvent) => { if (e.propertyName === 'transform') finish() }
          track.addEventListener('transitionend', onEnd)
          const fallback = setTimeout(finish, SETTLE_MS)
          return next
        }
        return next
      })
    }, AUTOPLAY_MS)
  }, [reduceMotion, count])

  const restartAuto = useCallback(() => { stopAuto(); startAuto() }, [stopAuto, startAuto])

  useEffect(() => {
    startAuto()
    const onVis = () => { if (document.hidden) stopAuto(); else startAuto() }
    document.addEventListener('visibilitychange', onVis)
    return () => {
      stopAuto()
      document.removeEventListener('visibilitychange', onVis)
    }
  }, [startAuto, stopAuto])

  const activeIndex = index % count

  return { trackRef, activeIndex, goTo, stopAuto, startAuto, restartAuto }
}
