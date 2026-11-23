/* Golden — Lenis smooth scroll wired to the GSAP ticker and ScrollTrigger.
   Disabled under reduced motion (native scroll, same ScrollApi). */

import { useEffect, useMemo, useRef } from 'react'
import Lenis from 'lenis'
import 'lenis/dist/lenis.css'
import { gsap, ScrollTrigger } from './gsap'
import type { ScrollApi } from './contract'

export function useScroll(reducedMotion: boolean): ScrollApi {
  const lenisRef = useRef<Lenis | null>(null)
  /** stop() can be called by a child before Lenis exists (child effects run first). */
  const lockedRef = useRef(false)

  useEffect(() => {
    if (reducedMotion) return
    const lenis = new Lenis({ lerp: 0.09, smoothWheel: true, anchors: false })
    lenisRef.current = lenis
    if (lockedRef.current) lenis.stop()
    lenis.on('scroll', ScrollTrigger.update)
    const tick = (time: number) => lenis.raf(time * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)
    return () => {
      gsap.ticker.remove(tick)
      lenis.destroy()
      lenisRef.current = null
    }
  }, [reducedMotion])

  return useMemo<ScrollApi>(
    () => ({
      stop: () => {
        lockedRef.current = true
        lenisRef.current?.stop()
      },
      start: () => {
        lockedRef.current = false
        lenisRef.current?.start()
      },
      scrollTo: (target) => {
        if (lenisRef.current) lenisRef.current.scrollTo(target as never, { duration: 1.4 })
        else if (typeof target === 'number') window.scrollTo({ top: target, behavior: 'smooth' })
        else {
          const el = typeof target === 'string' ? document.querySelector(target) : target
          el?.scrollIntoView({ behavior: 'smooth' })
        }
      },
    }),
    [],
  )
}
