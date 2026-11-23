import { useEffect } from 'react'

export function useEventsAutoOpen(rootRef: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const nodes = Array.from(root.querySelectorAll<HTMLElement>('.ev-node'))
    if (!nodes.length) return
    const opened = new Set<HTMLElement>()

    function check() {
      const threshold = window.innerHeight * 0.6
      nodes.forEach(n => {
        if (opened.has(n)) return
        const r = n.getBoundingClientRect()
        if (r.top + r.height / 2 < threshold) {
          opened.add(n)
          requestAnimationFrame(() => n.classList.add('ev-active'))
        }
      })
    }

    window.addEventListener('scroll', check, { passive: true })
    check()
    return () => window.removeEventListener('scroll', check)
  }, [rootRef])
}
