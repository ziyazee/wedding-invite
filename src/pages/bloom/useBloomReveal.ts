import { useEffect } from 'react'

export function useBloomReveal(rootRef: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (motion.matches) {
      root.querySelectorAll('[data-reveal]').forEach(el => el.classList.add('visible'))
      return
    }
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible')
          observer.unobserve(entry.target)
        }
      })
    }, { threshold: 0.08 })
    root.querySelectorAll('[data-reveal]').forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [rootRef])
}
