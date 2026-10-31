import { useLayoutEffect } from 'react'
import type { RefObject } from 'react'
import { wrapCardText } from '../../invitations/cardContentFit'

export function useEmbroideredGardenNames(root: RefObject<HTMLDivElement | null>, key: string, stacked: boolean) {
  useLayoutEffect(() => {
    const element = root.current
    if (!element) return
    let active = true
    const fit = () => {
      if (!active || !element.clientWidth) return
      element.style.removeProperty('--eg-name-size')
      element.style.removeProperty('--eg-name-wrap')
      element.classList.toggle('eg-stacked', stacked)
      const names = [...element.querySelectorAll<HTMLElement>('[data-eg-name]')]
      if (names.length !== 2) return
      const manual = names.some(name => name.hasAttribute('data-invite-custom-size'))
      const base = Math.max(...names.map(name => parseFloat(getComputedStyle(name).fontSize)))
      const combined = names.reduce((n, name) => n + name.getBoundingClientRect().width, 0) + 60
      const shouldStack = stacked || combined > element.clientWidth * .8 || names.some(name => name.textContent?.includes('\n'))
      element.classList.toggle('eg-stacked', shouldStack)
      if (manual) { element.style.setProperty('--eg-name-wrap', 'anywhere'); return }
      for (const name of names) {
        const value = (name.dataset.nameInput ?? name.textContent ?? '').replace(/\r\n?/g, '\n').trim()
        name.textContent = wrapCardText(value, 18)
      }
      for (let factor = 1; factor >= .4; factor -= .025) {
        element.style.setProperty('--eg-name-size', `${Math.max(24, base * factor)}px`)
        if (names.every(name => name.scrollWidth <= name.clientWidth + 1)) break
      }
      if (names.some(name => name.scrollWidth > name.clientWidth + 1)) element.style.setProperty('--eg-name-wrap', 'anywhere')
    }
    const observer = new ResizeObserver(fit)
    observer.observe(element)
    document.fonts.addEventListener('loadingdone', fit)
    void document.fonts.ready.then(fit)
    fit()
    return () => { active = false; observer.disconnect(); document.fonts.removeEventListener('loadingdone', fit) }
  }, [root, key, stacked])
}

export function useEmbroideredGardenCard(root: RefObject<HTMLDivElement | null>, key: string) {
  useLayoutEffect(() => {
    const element = root.current
    const card = element?.parentElement
    if (!element || !card) return
    let active = true
    const fit = () => {
      if (!active || !card.clientWidth) return
      card.style.removeProperty('min-height')
      const required = () => [...element.children].reduce((sum, child) => sum + child.getBoundingClientRect().height, 0) + Math.max(0, element.children.length - 1) * (parseFloat(getComputedStyle(element).rowGap) || 0)
      const fits = (factor: number) => { element.style.setProperty('--eg-fit', String(factor)); return required() <= element.clientHeight - 4 }
      if (fits(1)) return
      if (!fits(0)) {
        const fraction = element.clientHeight / card.clientHeight
        card.style.minHeight = `${Math.ceil((required() + 6) / Math.max(.1, fraction))}px`
        return
      }
      let low = 0, high = 1
      for (let step = 0; step < 9; step++) { const middle = (low + high) / 2; if (fits(middle)) low = middle; else high = middle }
      element.style.setProperty('--eg-fit', String(low))
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

const introDefaults = [
  'With the blessings of God and the love of our families, we invite you to celebrate the beginning of our forever.',
  'Your presence, your prayers, and your love will make our day complete.',
]

export function useIntroFit(root: RefObject<HTMLDivElement | null>, key: string) {
  useLayoutEffect(() => {
    const container = root.current
    if (!container) return
    let active = true
    const fit = () => {
      if (!active) return
      container.querySelectorAll<HTMLElement>('.eg-fit-intro-content').forEach((paragraph, index) => {
        paragraph.style.removeProperty('font-size')
        const defaultSize = parseFloat(getComputedStyle(paragraph).fontSize)
        const referenceLength = Array.from(introDefaults[index] || introDefaults[0]).length
        const length = Array.from(paragraph.textContent?.trim() || '').length
        if (length > referenceLength) {
          const size = Math.max(14, defaultSize * Math.sqrt(referenceLength / length))
          paragraph.style.fontSize = `${Math.floor(size * 10) / 10}px`
        }
      })
    }
    const observer = new ResizeObserver(fit)
    observer.observe(container)
    document.fonts.addEventListener('loadingdone', fit)
    void document.fonts.ready.then(fit)
    fit()
    return () => { active = false; observer.disconnect(); document.fonts.removeEventListener('loadingdone', fit) }
  }, [root, key])
}
