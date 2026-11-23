import { useEffect } from 'react'

export function useDestinationReveal(rootRef: React.RefObject<HTMLElement | null>, active: boolean) {
  useEffect(() => {
    if (!active) return
    const root = rootRef.current
    if (!root || matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('dest-visible')
          observer.unobserve(entry.target)
        }
      })
    }, { threshold: 0.08 })
    root.querySelectorAll('.dest-anim').forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [rootRef, active])
}
