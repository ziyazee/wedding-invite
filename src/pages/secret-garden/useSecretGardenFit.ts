import { useLayoutEffect } from 'react'
import type { RefObject } from 'react'

export function useSecretGardenNames(root: RefObject<HTMLDivElement | null>, key: string, stacked: boolean) {
  useLayoutEffect(() => {
    const element = root.current
    if (!element) return
    let active = true
    const fit = () => {
      if (!active || !element.clientWidth) return
      element.style.removeProperty('--sg-name-size')
      element.style.removeProperty('--sg-name-wrap')
      element.classList.toggle('sg-stacked', stacked)
      const names = [...element.querySelectorAll<HTMLElement>('[data-sg-name]')]
      if (names.length !== 2) return
      const manual = names.some(name => name.hasAttribute('data-invite-custom-size'))
      const base = Math.max(...names.map(name => parseFloat(getComputedStyle(name).fontSize)))
      const combined = names.reduce((n, name) => n + name.getBoundingClientRect().width, 0) + 60
      const shouldStack = stacked || combined > element.clientWidth * .8 || names.some(name => name.textContent?.includes('\n'))
      element.classList.toggle('sg-stacked', shouldStack)
      if (manual) { element.style.setProperty('--sg-name-wrap', 'anywhere'); return }
      for (let factor = 1; factor >= .4; factor -= .025) {
        element.style.setProperty('--sg-name-size', `${Math.max(24, base * factor)}px`)
        if (names.every(name => name.scrollWidth <= name.clientWidth + 1)) break
      }
      if (names.some(name => name.scrollWidth > name.clientWidth + 1)) element.style.setProperty('--sg-name-wrap', 'anywhere')
    }
    const observer = new ResizeObserver(fit)
    observer.observe(element)
    document.fonts.addEventListener('loadingdone', fit)
    void document.fonts.ready.then(fit)
    fit()
    return () => { active = false; observer.disconnect(); document.fonts.removeEventListener('loadingdone', fit) }
  }, [root, key, stacked])
}

export function useSecretGardenCard(root: RefObject<HTMLDivElement | null>, key: string) {
  useLayoutEffect(() => {
    const element = root.current
    const card = element?.parentElement
    if (!element || !card) return
    let active = true
    const fit = () => {
      if (!active || !card.clientWidth) return
      card.style.removeProperty('min-height')
      const required = () => [...element.children].reduce((sum, child) => sum + child.getBoundingClientRect().height, 0) + Math.max(0, element.children.length - 1) * (parseFloat(getComputedStyle(element).rowGap) || 0)
      const fits = (factor: number) => { element.style.setProperty('--sg-fit', String(factor)); return required() <= element.clientHeight - 4 }
      if (fits(1)) return
      if (!fits(0)) { card.style.minHeight = `${Math.ceil((required() + 8) / .49)}px`; return }
      let low = 0, high = 1
      for (let step = 0; step < 9; step++) { const middle = (low + high) / 2; if (fits(middle)) low = middle; else high = middle }
      element.style.setProperty('--sg-fit', String(low))
    }
    let width = -1
    const observer = new ResizeObserver(entries => {
      const next = entries[0]?.contentRect.width
      if (next !== undefined && next !== width) { width = next; fit() }
    })
    observer.observe(card)
    document.fonts.addEventListener('loadingdone', fit)
    void document.fonts.ready.then(fit)
    fit()
    return () => { active = false; observer.disconnect(); document.fonts.removeEventListener('loadingdone', fit) }
  }, [root, key])
}
