import { useLayoutEffect } from 'react'
import type { RefObject } from 'react'

/** Saved sizes supply the base; paired names share the longer name's reduction.
 * Measurements stay local and rerun on copy/font/width changes. */
export function useMajesticNames(root: RefObject<HTMLDivElement | null>, key: string, stacked: boolean, threshold = 8, reduction = .01, scaleSeparator = false) {
  useLayoutEffect(() => {
    const element = root.current
    if (!element) return
    let active = true
    const fit = () => {
      if (!active || !element.clientWidth) return
      element.style.removeProperty('--mj-name-size')
      element.style.removeProperty('--mj-separator-size')
      element.style.removeProperty('--mj-name-wrap')
      element.style.removeProperty('--mj-name-white-space')
      element.classList.toggle('mj-stacked', stacked)
      const names = [...element.querySelectorAll<HTMLElement>('[data-mj-name]')]
      if (names.length !== 2) return
      // Use the smaller base so equalizing the pair never enlarges either name.
      const base = Math.min(...names.map(name => parseFloat(getComputedStyle(name).fontSize)))
      const minimum = Math.min(24, base)
      const extraCharacters = names.map(name => Math.max(0, Array.from(name.textContent || '').length - threshold))
      const excess = Math.max(...extraCharacters)
      const target = Math.max(minimum, base * (1 - reduction * excess))
      const setSize = (size: number) => element.style.setProperty('--mj-name-size', `${size}px`)
      element.style.setProperty('--mj-name-white-space', 'pre')
      setSize(target)
      const fits = () => names.every(name => name.scrollWidth <= name.clientWidth + 1)
      if (!fits()) {
        setSize(minimum)
        if (fits()) {
          let low = minimum, high = target
          for (let step = 0; step < 10; step++) {
            const middle = (low + high) / 2
            setSize(middle)
            if (fits()) low = middle
            else high = middle
          }
          setSize(low)
        } else {
          element.style.setProperty('--mj-name-wrap', 'anywhere')
        }
      }
      element.style.removeProperty('--mj-name-white-space')
      const combined = names.reduce((n, name) => n + name.getBoundingClientRect().width, 0) + 60
      const shouldStack = stacked || combined > element.clientWidth * .8 || names.some(name => name.textContent?.includes('\n'))
      element.classList.toggle('mj-stacked', shouldStack)
      if (scaleSeparator) {
        const separator = element.querySelector<HTMLElement>('.mj-ampersand')
        if (separator) {
          const separatorBase = parseFloat(getComputedStyle(separator).fontSize)
          const fittedSize = parseFloat(getComputedStyle(names[0]).fontSize)
          element.style.setProperty('--mj-separator-size', `${separatorBase * fittedSize / base}px`)
        }
      }
    }
    let width = -1
    const observer = new ResizeObserver(entries => {
      const next = entries[0]?.contentRect.width
      if (next !== undefined && next !== width) { width = next; fit() }
    })
    observer.observe(element)
    document.fonts.addEventListener('loadingdone', fit)
    void document.fonts.ready.then(fit)
    fit()
    return () => { active = false; observer.disconnect(); document.fonts.removeEventListener('loadingdone', fit) }
  }, [root, key, stacked, threshold, reduction, scaleSeparator])
}

export function useMajesticCard(root: RefObject<HTMLDivElement | null>, key: string) {
  useLayoutEffect(() => {
    const element = root.current
    const card = element?.parentElement
    if (!element || !card) return
    let active = true
    const fit = () => {
      if (!active || !card.clientWidth) return
      card.style.removeProperty('min-height')
      const required = () => [...element.children].reduce((sum, child) => sum + child.getBoundingClientRect().height, 0) + Math.max(0, element.children.length - 1) * (parseFloat(getComputedStyle(element).rowGap) || 0)
      const fits = (factor: number) => { element.style.setProperty('--mj-fit', String(factor)); return required() <= element.clientHeight - 4 }
      if (fits(1)) return
      if (!fits(0)) { card.style.minHeight = `${Math.ceil((required() + 8) / .49)}px`; return }
      let low = 0, high = 1
      for (let step = 0; step < 9; step++) { const middle = (low + high) / 2; if (fits(middle)) low = middle; else high = middle }
      element.style.setProperty('--mj-fit', String(low))
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
