import { useEffect } from 'react'

export function useBloomNameFit(
  rootRef: React.RefObject<HTMLElement | null>,
  deps: string,
) {
  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const blocks = Array.from(root.querySelectorAll<HTMLElement>('.bloom-welcome-names, .bloom-footer-names'))
    if (!blocks.length) return

    const fitBlock = (block: HTMLElement) => {
      const children = Array.from(block.children) as HTMLElement[]
      if (children.length !== 3) return
      const nameEls = [children[0], children[2]].map(child =>
        child.querySelector<HTMLElement>('.bloom-welcome-name') ?? child,
      )
      const values = nameEls.map(el => (el.textContent ?? '').trim())
      nameEls.forEach(el => { el.style.removeProperty('font-size') })
      const max = parseFloat(getComputedStyle(nameEls[0]).fontSize)
      const min = Math.min(24, max)
      const width = block.clientWidth * .94
      if (!width) return
      const probe = document.createElement('span')
      probe.style.cssText = 'position:absolute;visibility:hidden;pointer-events:none;white-space:pre;width:max-content'
      const style = getComputedStyle(nameEls[0])
      probe.style.fontFamily = style.fontFamily
      probe.style.fontWeight = style.fontWeight
      probe.style.fontStyle = style.fontStyle
      probe.style.letterSpacing = style.letterSpacing
      document.body.append(probe)
      const measure = (text: string, size: number) => {
        probe.style.fontSize = `${size}px`
        probe.textContent = text
        return probe.getBoundingClientRect().width
      }
      const fullWidth = Math.max(...values.map(v => measure(v, max)))
      let size = Math.min(max, Math.max(min, max * width / Math.max(1, fullWidth)))
      const widestWord = Math.max(1, ...values.flatMap(v => v.split(/ +/).map(w => measure(w, size))))
      size = Math.min(size, size * width / widestWord)
      nameEls.forEach(el => { el.style.fontSize = `${size}px` })
      probe.remove()
    }

    const run = () => blocks.forEach(fitBlock)
    window.addEventListener('resize', run)
    window.addEventListener('invitation-preview-updated', run)
    document.fonts.addEventListener('loadingdone', run)
    void document.fonts.ready.then(run)
    run()
    return () => {
      window.removeEventListener('resize', run)
      window.removeEventListener('invitation-preview-updated', run)
      document.fonts.removeEventListener('loadingdone', run)
    }
  }, [rootRef, deps])
}
