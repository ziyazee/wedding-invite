import { useEffect } from 'react'

const STEP = 90
const CAP = 540

export function useScrollReveal(rootRef: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    const root = rootRef.current
    if (!root) return

    const pending = new Set<HTMLElement>()

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target as HTMLElement
          const d = Number(el.dataset.revealDelay || 0)
          if (d) {
            el.style.transitionDelay = d + 'ms'
            el.addEventListener('transitionend', function clear() {
              el.style.transitionDelay = ''
              el.removeEventListener('transitionend', clear)
            })
          }
          el.classList.add('is-visible')
          observer.unobserve(el)
          pending.delete(el)
        }
      })
    }, { threshold: 0.2 })

    const syncTargets = () => {
      pending.forEach(element => {
        if (!root.contains(element) || !element.matches('.reveal:not(.is-visible)')) {
          observer.unobserve(element)
          pending.delete(element)
        }
      })

      root.querySelectorAll('.scene, .lantern-divider').forEach(scene => {
        scene.querySelectorAll<HTMLElement>('.reveal').forEach((element, index) => {
          element.dataset.revealDelay = String(Math.min(index * STEP, CAP))
        })
      })
      root.querySelectorAll<HTMLElement>('.reveal:not(.is-visible)').forEach(element => {
        if (pending.has(element)) return
        pending.add(element)
        observer.observe(element)
      })
    }

    syncTargets()
    // Edits can replace nodes or reset their classes after the initial render.
    const mutations = new MutationObserver(syncTargets)
    mutations.observe(root, { childList: true, subtree: true, attributes: true, attributeFilter: ['class'] })
    return () => {
      mutations.disconnect()
      observer.disconnect()
      pending.clear()
    }
  }, [rootRef])
}
