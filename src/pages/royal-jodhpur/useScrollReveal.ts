import { useEffect } from 'react'

export function useScrollReveal(rootRef: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const io = new IntersectionObserver((entries) => {
      entries.forEach(({ target, isIntersecting }) => {
        if (isIntersecting) { target.classList.add('vis'); io.unobserve(target) }
      })
    }, { threshold: 0.1 })
    root.querySelectorAll('.scroll-in').forEach(el => io.observe(el))
    const card = root.querySelector('.invite-card')
    if (card) io.observe(card)
    return () => io.disconnect()
  }, [rootRef])
}
