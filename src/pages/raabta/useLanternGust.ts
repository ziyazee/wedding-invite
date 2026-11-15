import { useEffect } from 'react'

export function useLanternGust(rootRef: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const root = rootRef.current
    if (!root) return
    const hangs = root.querySelectorAll<HTMLElement>('.lantern-divider .hang')
    if (!hangs.length) return

    let lastY = window.pageYOffset || 0
    let vel = 0
    let ticking = false
    let settleRaf: number | null = null

    function apply() {
      ticking = false
      const boost = 1 + Math.min(Math.abs(vel) / 55, 1.9)
      hangs.forEach(h => h.style.setProperty('--gust', boost.toFixed(3)))
    }

    function decay() {
      vel *= 0.88
      if (Math.abs(vel) > 0.4) {
        apply()
        settleRaf = requestAnimationFrame(decay)
      } else {
        vel = 0
        apply()
        settleRaf = null
      }
    }

    function onScroll() {
      const y = window.pageYOffset || 0
      vel = y - lastY
      lastY = y
      if (!ticking) { ticking = true; requestAnimationFrame(apply) }
      if (settleRaf) cancelAnimationFrame(settleRaf)
      settleRaf = requestAnimationFrame(decay)
    }

    window.addEventListener('scroll', onScroll, { passive: true } as AddEventListenerOptions)
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (settleRaf) cancelAnimationFrame(settleRaf)
    }
  }, [rootRef])
}
