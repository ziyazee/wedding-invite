import { useEffect, useRef } from 'react'

export function useScrollReveal(enabled: boolean) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!enabled) return
    const container = containerRef.current
    if (!container) return
    const els = container.querySelectorAll('.reveal')
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in')
          observer.unobserve(entry.target)
        }
      })
    }, { threshold: 0.2 })
    els.forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [enabled])

  return containerRef
}
