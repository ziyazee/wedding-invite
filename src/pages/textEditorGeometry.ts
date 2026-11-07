import type { TextLayout, TextOverride } from '../invitations/textLayout'
import { textSection, textSelector } from '../invitations/textLayoutDom'

export function textPosition(element: HTMLElement, entry?: TextOverride) {
  const coordinate = (value: string | undefined) => {
    const number = Number(value)
    return Number.isFinite(number) ? number : 0
  }
  return {
    x: entry?.x ?? coordinate(element.dataset.inviteLayoutX),
    y: entry?.y ?? coordinate(element.dataset.inviteLayoutY),
  }
}

// Capture before an edit: paired names and card text share automatic fitting.
// Keep their visible sizes when the user takes control of an individual block.
// Position-only edits do not need this snapshot.
export function captureTextSizes(element: HTMLElement): Record<string, number> {
  const section = textSection(element)
  const win = element.ownerDocument.defaultView
  const sizes: Record<string, number> = {}
  if (!section || !win) return sizes
  section.querySelectorAll<HTMLElement>(textSelector).forEach(text => {
    if (textSection(text) !== section || !text.getClientRects().length) return
    const id = text.dataset.inviteText
    const size = parseFloat(win.getComputedStyle(text).fontSize)
    if (id && Number.isFinite(size) && size >= 8 && size <= 160) sizes[id] = size
  })
  return sizes
}

export function withTextSizes(layout: TextLayout, sizes: Record<string, number>): TextLayout {
  const elements = { ...layout.elements }
  for (const [id, fontSize] of Object.entries(sizes)) {
    if (elements[id]?.fontSize === undefined) elements[id] = { ...elements[id], fontSize }
  }
  return { version: 1, elements }
}

// Pointer events inside an iframe use its unscaled viewport coordinates.
export function previewScale(win: Window): number {
  let scale = 1
  try {
    let frame = win.frameElement as HTMLElement | null
    while (frame) {
      if (frame.offsetWidth) scale *= frame.getBoundingClientRect().width / frame.offsetWidth
      frame = frame.ownerDocument.defaultView?.frameElement as HTMLElement | null
    }
  } catch { /* Only same-origin previews are editable. */ }
  return Number.isFinite(scale) && scale > 0 ? scale : 1
}
