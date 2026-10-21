import { readTextLayout, textFonts } from './textLayout'
import type { TextLayout } from './textLayout'

export const textSelector = '[data-invite-text]'
export function textSection(element: Element): HTMLElement | null {
  return element.closest<HTMLElement>('[data-invite-section]')
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
        const observer = new MutationObserver(schedule)
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
  let stopped = false
  let queued = false
  function apply() {
    queued = false
    if (stopped) return
    const layout = readTextLayout(getLayout())
    const nextSections = new Set<Element>()
    const rules: string[] = []
    root.querySelectorAll<HTMLElement>(textSelector).forEach(element => {
      const id = element.dataset.inviteText!
      const value = layout.elements[id]
      if (!value) return
      const section = textSection(element)
      const declarations: string[] = []
      if (value.fontSize !== undefined) declarations.push(`font-size:${value.fontSize}px!important`)
      if (value.fontFamily) declarations.push(`font-family:${textFonts[value.fontFamily]}!important`)
      if (value.color) declarations.push(`color:${value.color}!important`, `-webkit-text-fill-color:${value.color}!important`)
      if (section && (value.x !== undefined || value.y !== undefined)) {
        nextSections.add(section)
        declarations.push(`translate:${(value.x || 0) * section.clientWidth}px ${(value.y || 0) * section.clientHeight}px!important`)
      }
      rules.push(`[data-invite-text="${id}"]{${declarations.join(';')}}`)
    })
    const css = rules.join('\n')
    if (style.textContent !== css) style.textContent = css
    sections.forEach(section => { if (!nextSections.has(section)) { resize.unobserve(section); sections.delete(section) } })
    nextSections.forEach(section => { if (!sections.has(section)) { sections.add(section); resize.observe(section) } })
  }
  function schedule() { if (!queued && !stopped) { queued = true; queueMicrotask(apply) } }
  const resize = new ResizeObserver(schedule)
  const observer = new MutationObserver(schedule)
  observer.observe(root, { childList: true, subtree: true, attributes: true, attributeFilter: ['data-invite-text', 'data-invite-section'] })
  doc.addEventListener('invitation-layout-change', schedule)
  apply()
  return () => { stopped = true; resize.disconnect(); observer.disconnect(); style.remove(); doc.removeEventListener('invitation-layout-change', schedule) }
}
