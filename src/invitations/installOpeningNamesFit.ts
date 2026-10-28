import { fitBloomNames } from './bloomRules'

export function installOpeningNamesFit(doc: Document): void {
 doc.querySelectorAll<HTMLElement>('.atelier-opening-names').forEach(openingNames => {
  const previewWindow = doc.defaultView
  const fitNames = () => {
   if (openingNames.classList.contains('atelier-bloom-names')) {
    fitBloomNames(openingNames)
    return
   }
   openingNames.classList.remove('atelier-names-stacked')
   const spans = Array.from(openingNames.children) as HTMLElement[]
   if (spans.length !== 3) return
   const nameSpans = [spans[0].querySelector<HTMLElement>('h2,h3') || spans[0], spans[2].querySelector<HTMLElement>('h2,h3') || spans[2]]
   nameSpans.forEach(span => span.style.removeProperty('font-size'))
   const availableWidth = openingNames.clientWidth
   if (!availableWidth) return
   const maximumSize = parseFloat(getComputedStyle(nameSpans[0]).fontSize)
   const widths = [nameSpans[0].getBoundingClientRect().width, spans[1].getBoundingClientRect().width, nameSpans[1].getBoundingClientRect().width]
   const gap = parseFloat(getComputedStyle(openingNames).columnGap) || 0
   const requiredWidth = widths.reduce((total, width) => total + width, 0) + gap * (spans.length - 1)
   const openingLayout = openingNames.classList.contains('atelier-family-names')
    ? doc.querySelector('.atelier-opening-names:not(.atelier-family-names)')
    : null
   openingNames.classList.toggle('atelier-names-stacked', openingNames.dataset.namesLayout === 'stacked' || Boolean(openingLayout?.classList.contains('atelier-names-stacked')) || requiredWidth > availableWidth * .8)
   const probe = doc.createElement('span')
   probe.style.cssText = 'position:fixed;visibility:hidden;pointer-events:none;white-space:nowrap;width:max-content'
   doc.body.append(probe)
   let widestName = 0
   nameSpans.forEach(name => {
    const style = getComputedStyle(name)
    probe.style.font = style.font
    probe.style.letterSpacing = style.letterSpacing
    probe.style.textTransform = style.textTransform
    const shrinkBeforeWrapping = openingNames.classList.contains('atelier-bloom-names')
    const measuredParts = shrinkBeforeWrapping ? [name.textContent || ''] : (name.textContent || '').split(/\s+/)
    for (const word of measuredParts) {
     probe.textContent = word
     widestName = Math.max(widestName, probe.getBoundingClientRect().width)
    }
   })
   probe.remove()
   if (widestName > availableWidth) {
    const minimumSize = openingNames.classList.contains('atelier-bloom-names')
     ? Math.min(maximumSize, Math.max(24, maximumSize * .75))
     : Math.min(24, maximumSize)
    const fittedSize = Math.max(minimumSize, Math.floor(maximumSize * availableWidth / widestName * 10) / 10)
    nameSpans.forEach(span => { span.style.fontSize = `${fittedSize}px` })
   }
  }
  let previousWidth = -1
  const resize = new ResizeObserver(entries => {
   const width = entries[0]?.contentRect.width
   if (width === undefined || width === previousWidth) return
   previousWidth = width
   fitNames()
  })
  resize.observe(openingNames)
  previewWindow?.addEventListener('invitation-preview-updated', fitNames)
  previewWindow?.addEventListener('resize', fitNames)
  doc.fonts.addEventListener('loadingdone', fitNames)
  void doc.fonts.ready.then(fitNames)
  fitNames()
  previewWindow?.addEventListener('unload', () => {
   resize.disconnect()
   previewWindow.removeEventListener('invitation-preview-updated', fitNames)
   previewWindow.removeEventListener('resize', fitNames)
   doc.fonts.removeEventListener('loadingdone', fitNames)
  }, { once: true })
 })
}
