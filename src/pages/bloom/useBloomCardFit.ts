import { useEffect } from 'react'

export function useBloomCardFit(rootRef: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    let active = true
    const fit = () => {
      if (!active) return
      root.querySelectorAll<HTMLElement>('[data-bloom-card]').forEach(card => {
        const copy = card.querySelector<HTMLElement>('[data-bloom-copy]')
        if (!copy || !card.clientWidth) return
        card.classList.remove('bloom-event-expanded')
        card.style.removeProperty('min-height')
        const height = () => {
          const children = Array.from(copy.children).filter(child => getComputedStyle(child).display !== 'none') as HTMLElement[]
          const gap = parseFloat(getComputedStyle(copy).rowGap) || 0
          return children.reduce((sum, child) => sum + child.getBoundingClientRect().height, 0) + Math.max(0, children.length - 1) * gap
        }
        const fits = (factor: number) => {
          card.style.setProperty('--bloom-fit', String(factor))
          return height() <= copy.clientHeight - 4
        }
        if (fits(1)) return
        if (!fits(0)) {
          if (card.dataset.bloomCard === 'image') {
            card.style.minHeight = `${Math.ceil((height() + 8) / .42)}px`
          } else {
            const required = Math.ceil((height() + 8) / .64)
            card.style.minHeight = `${Math.max(card.clientHeight, required)}px`
            card.classList.add('bloom-event-expanded')
          }
          return
        }
        let low = 0, high = 1
        for (let step = 0; step < 9; step++) {
          const middle = (low + high) / 2
          if (fits(middle)) low = middle
          else high = middle
        }
        card.style.setProperty('--bloom-fit', String(low))
      })
    }
    const widths = new WeakMap<Element, number>()
    const observer = new ResizeObserver(entries => {
      let changed = false
      for (const entry of entries) {
        if (widths.get(entry.target) !== entry.contentRect.width) {
          widths.set(entry.target, entry.contentRect.width)
          changed = true
        }
      }
      if (changed) fit()
    })
    root.querySelectorAll('[data-bloom-card]').forEach(card => observer.observe(card))
    window.addEventListener('resize', fit)
    window.addEventListener('invitation-preview-updated', fit)
    document.addEventListener('loadedmetadata', fit, true)
    document.fonts.addEventListener('loadingdone', fit)
    void document.fonts.ready.then(fit)
    fit()
    return () => {
      active = false
      observer.disconnect()
      window.removeEventListener('resize', fit)
      window.removeEventListener('invitation-preview-updated', fit)
      document.removeEventListener('loadedmetadata', fit, true)
      document.fonts.removeEventListener('loadingdone', fit)
    }
  }, [rootRef])
}
