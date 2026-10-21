import { readTextLayout, textFonts } from './textLayout'
import type { TextLayout } from './textLayout'

export const textSelector = '[data-invite-text]'
export function textSection(element: Element): HTMLElement | null {
  return element.closest<HTMLElement>('[data-invite-section]')
}

// Saved offsets remain fractions of the section, including SVG/foreignObject
// text. Convert visible pixels to SVG user units instead of treating a viewBox
// unit as a CSS pixel. The editor and guest renderer use the same conversion.
export function textTranslation(element: HTMLElement, section: HTMLElement, x = 0, y = 0) {
  const svg = element.namespaceURI === 'http://www.w3.org/2000/svg' ? element as unknown as SVGGraphicsElement : element.closest('foreignObject')
  if (svg) {
    const matrix = svg.getScreenCTM?.()
    if (matrix) {
      const bounds = section.getBoundingClientRect()
      const determinant = matrix.a * matrix.d - matrix.b * matrix.c
      if (Math.abs(determinant) > 1e-9) {
        const dx = x * bounds.width, dy = y * bounds.height
        return `${(matrix.d * dx - matrix.c * dy) / determinant}px ${(-matrix.b * dx + matrix.a * dy) / determinant}px`
      }
    }
  }
  return `${x * section.clientWidth}px ${y * section.clientHeight}px`
}

// Also supports same-origin nested iframe templates. Dispose documents as frames
// navigate or disappear so changing designs does not leave listeners behind.
export function watchTextDocuments(root: HTMLElement, setup: (root: HTMLElement) => () => void) {
  const documents = new Map<HTMLElement, () => void>()
  const frames = new Map<HTMLIFrameElement, () => void>()
  let stopped = false
  let queued = false
  function scan() {
    queued = false
    if (stopped) return
    const seenRoots = new Set<HTMLElement>()
    const seenFrames = new Set<HTMLIFrameElement>()
    function visit(node: HTMLElement) {
      seenRoots.add(node)
      if (!documents.has(node)) {
        const dispose = setup(node)
        const observer = new MutationObserver(records => {
          if (records.some(record => [...record.addedNodes, ...record.removedNodes].some(node => node.nodeType === 1))) schedule()
        })
        observer.observe(node, { childList: true, subtree: true })
        documents.set(node, () => { observer.disconnect(); dispose() })
      }
      node.querySelectorAll<HTMLIFrameElement>('iframe').forEach(frame => {
        seenFrames.add(frame)
        if (!frames.has(frame)) {
          frame.addEventListener('load', schedule)
          frames.set(frame, () => frame.removeEventListener('load', schedule))
        }
        try { if (frame.contentDocument?.body) visit(frame.contentDocument.body) } catch { /* External embeds are not editable. */ }
      })
    }
    visit(root)
    documents.forEach((dispose, node) => { if (!seenRoots.has(node)) { dispose(); documents.delete(node) } })
    frames.forEach((dispose, frame) => { if (!seenFrames.has(frame)) { dispose(); frames.delete(frame) } })
  }
  function schedule() { if (!queued && !stopped) { queued = true; queueMicrotask(scan) } }
  scan()
  return () => { stopped = true; documents.forEach(dispose => dispose()); frames.forEach(dispose => dispose()) }
}

// Guest-side work: a small stylesheet, applied only when an order has overrides.
// Individual translate leaves the template's existing transform/animation intact.
export function applyTextLayout(root: HTMLElement, getLayout: () => TextLayout) {
  const doc = root.ownerDocument
  const style = doc.createElement('style')
  style.dataset.inviteOverrides = ''
  doc.head.append(style)
  const sections = new Set<Element>()
  const positioned = new Set<HTMLElement>()
  let stopped = false
  let queued = false
  function apply() {
    queued = false
    if (stopped) return
    const layout = readTextLayout(getLayout())
    const nextSections = new Set<Element>()
    const nextPositioned = new Set<HTMLElement>()
    const rules: string[] = []
    root.querySelectorAll<HTMLElement>(textSelector).forEach(element => {
      const id = element.dataset.inviteText!
      const value = layout.elements[id]
      if (!value) return
      const section = textSection(element)
      const declarations: string[] = []
      if (value.fontSize !== undefined) declarations.push(`font-size:${value.fontSize}px!important`)
      if (value.fontFamily) declarations.push(`font-family:${textFonts[value.fontFamily]}!important`)
      if (value.color) {
        declarations.push(`color:${value.color}!important`, `-webkit-text-fill-color:${value.color}!important`)
        if (element.namespaceURI === 'http://www.w3.org/2000/svg') declarations.push(`fill:${value.color}!important`)
      }
      if (section && (value.x !== undefined || value.y !== undefined)) {
        nextSections.add(section)
        nextPositioned.add(element)
        const translation = textTranslation(element, section, value.x, value.y)
        if (element.style.getPropertyValue('--invite-translation') !== translation) element.style.setProperty('--invite-translation', translation)
        declarations.push('translate:var(--invite-translation)!important')
      }
      // Legacy artwork styles contain !important font sizes. Give the saved
      // choice priority over those class selectors without changing originals.
      rules.push(`[data-invite-text="${id}"]:not(#invite-override-specificity){${declarations.join(';')}}`)
    })
    const css = rules.join('\n')
    if (style.textContent !== css) style.textContent = css
    positioned.forEach(element => { if (!nextPositioned.has(element)) { element.style.removeProperty('--invite-translation'); positioned.delete(element) } })
    nextPositioned.forEach(element => positioned.add(element))
    sections.forEach(section => { if (!nextSections.has(section)) { resize.unobserve(section); sections.delete(section) } })
    nextSections.forEach(section => { if (!sections.has(section)) { sections.add(section); resize.observe(section) } })
  }
  function schedule() { if (!queued && !stopped) { queued = true; queueMicrotask(apply) } }
  const resize = new ResizeObserver(schedule)
  const observer = new MutationObserver(schedule)
  observer.observe(root, { childList: true, subtree: true, attributes: true, attributeFilter: ['data-invite-text', 'data-invite-section'] })
  doc.addEventListener('invitation-layout-change', schedule)
  apply()
  return () => { stopped = true; resize.disconnect(); observer.disconnect(); style.remove(); positioned.forEach(element => element.style.removeProperty('--invite-translation')); doc.removeEventListener('invitation-layout-change', schedule) }
}
