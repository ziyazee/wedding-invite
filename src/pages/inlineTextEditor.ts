import { previewScale } from './textEditorGeometry'
import { renderedTextLines } from './renderedTextLines'

// A native textarea overlays the selected text without handing React-owned
// children to contenteditable. It also works over legacy SVG text and iframes.
export function openInlineTextEditor(element: HTMLElement, value: string, onSave: (value: string) => void) {
  const doc = element.ownerDocument
  const win = doc.defaultView!
  const box = element.getBoundingClientRect()
  const computed = win.getComputedStyle(element)
  const scale = previewScale(win)
  const editor = doc.createElement('textarea')
  editor.dataset.inviteInlineEditor = ''
  const initialValue = renderedTextLines(element, value)
  editor.value = initialValue
  editor.rows = 1
  editor.wrap = 'off'
  editor.maxLength = 500
  editor.setAttribute('aria-label', `Edit ${element.dataset.inviteLabel || 'invitation text'}`)
  editor.style.cssText = 'all:initial;position:fixed;z-index:2147483647;box-sizing:border-box;margin:0;padding:0;border:0;border-radius:2px;background:transparent;outline:1px solid #a57b32;resize:none;white-space:pre;overflow-wrap:normal;word-break:normal;overflow:auto;touch-action:auto;user-select:text;-webkit-user-select:text;pointer-events:auto'
  editor.style.fontFamily = computed.fontFamily
  editor.style.fontWeight = computed.fontWeight
  editor.style.fontStyle = computed.fontStyle
  editor.style.letterSpacing = computed.letterSpacing
  editor.style.textAlign = computed.textAlign
  editor.style.direction = computed.direction
  editor.style.color = element.namespaceURI === 'http://www.w3.org/2000/svg' && computed.fill !== 'none' ? computed.fill : computed.color
  editor.style.setProperty('-webkit-text-fill-color', editor.style.color)
  editor.style.padding = computed.padding
  const svg = element.namespaceURI === 'http://www.w3.org/2000/svg' ? element as unknown as SVGGraphicsElement : element.closest('foreignObject')
  const matrix = svg?.getScreenCTM()
  const textScale = matrix ? Math.hypot(matrix.a, matrix.b) : 1
  const fontSize = (parseFloat(computed.fontSize) || 16) * textScale
  editor.style.fontSize = `${fontSize}px`
  // Inline names can inherit the much larger line box of their parent even
  // after their font is resized. Do not turn that leading into a blank row.
  const lineHeight = parseFloat(computed.lineHeight) * textScale
  editor.style.lineHeight = `${Number.isFinite(lineHeight) ? (initialValue.includes('\n') ? lineHeight : Math.min(lineHeight, fontSize * 1.2)) : fontSize * 1.2}px`
  const measure = doc.createElement('span')
  measure.setAttribute('aria-hidden', 'true')
  measure.style.cssText = editor.style.cssText
  measure.style.cssText += ';display:block;left:-100000px;top:0;width:max-content;max-width:none;height:auto;visibility:hidden;pointer-events:none;overflow:visible;outline:none'
  const done = doc.createElement('button')
  done.type = 'button'
  done.dataset.inviteInlineEditor = ''
  done.textContent = 'Done'
  done.style.cssText = `all:initial;position:fixed;z-index:2147483647;box-sizing:border-box;padding:${5 / scale}px ${10 / scale}px;border-radius:5px;background:#354c43;color:white;font:600 ${12 / scale}px/1.3 Arial,sans-serif;cursor:pointer;touch-action:manipulation;pointer-events:auto`
  doc.body.append(measure, editor, done)
  element.setAttribute('data-invite-editing', '')
  let closed = false
  let frame = 0
  const documents: Document[] = []
  const originalVisibility = element.style.getPropertyValue('visibility')
  const visibilityPriority = element.style.getPropertyPriority('visibility')
  element.style.setProperty('visibility', 'hidden', 'important')

  function position() {
    const current = element.isConnected ? element.getBoundingClientRect() : box
    const viewport = win.visualViewport
    const leftEdge = viewport?.offsetLeft ?? 0
    const topEdge = viewport?.offsetTop ?? 0
    const width = viewport?.width ?? win.innerWidth
    const height = viewport?.height ?? win.innerHeight
    const margin = 8 / scale
    // Measure unconstrained lines, including a final empty line after Enter.
    // Unlike scrollWidth, this also shrinks reliably when text is deleted.
    measure.textContent = `${editor.value}\u200b`
    const measured = measure.getBoundingClientRect()
    const editorWidth = Math.max(12 / scale, Math.ceil(measured.width) + 2)
    const alignment = computed.textAlign
    const centered = alignment === 'center'
    const rightAligned = alignment === 'right' || (alignment === 'end' && computed.direction !== 'rtl') || (alignment === 'start' && computed.direction === 'rtl')
    const left = centered ? current.left + (current.width - editorWidth) / 2 : rightAligned ? current.right - editorWidth : current.left
    editor.style.width = `${editorWidth}px`
    const editorHeight = Math.max(1, Math.ceil(measured.height))
    const top = current.top
    editor.style.left = `${left}px`
    editor.style.top = `${top}px`
    editor.style.height = `${editorHeight}px`
    done.style.left = `${Math.max(leftEdge + margin, Math.min(leftEdge + width - done.getBoundingClientRect().width - margin, left + editorWidth - done.getBoundingClientRect().width))}px`
    const doneHeight = done.getBoundingClientRect().height
    const above = top - doneHeight - 6 / scale
    const doneTop = above >= topEdge + margin ? above : top + editorHeight + 6 / scale
    done.style.top = `${Math.max(topEdge + margin, Math.min(topEdge + height - doneHeight - margin, doneTop))}px`
  }
  function finish(save = true) {
    if (closed) return
    closed = true
    win.cancelAnimationFrame(frame)
    documents.forEach(parent => parent.removeEventListener('pointerdown', outside, true))
    win.removeEventListener('scroll', position, true)
    win.removeEventListener('resize', position)
    win.removeEventListener('pagehide', cancel)
    win.visualViewport?.removeEventListener('resize', position)
    win.visualViewport?.removeEventListener('scroll', position)
    editor.removeEventListener('blur', blur)
    editor.removeEventListener('input', position)
    editor.removeEventListener('keydown', keydown)
    done.removeEventListener('click', accept)
    done.removeEventListener('blur', blur)
    done.removeEventListener('keydown', keydown)
    element.style.setProperty('visibility', originalVisibility, visibilityPriority)
    element.removeAttribute('data-invite-editing')
    const content = editor.value.replace(/\r\n?/g, '\n')
    editor.remove(); done.remove(); measure.remove()
    // Merely opening/closing Edit must not persist generated line breaks.
    if (save && content !== initialValue.replace(/\r\n?/g, '\n')) onSave(content.slice(0, 500))
  }
  function outside(event: PointerEvent) {
    if (event.target !== editor && event.target !== done) finish()
  }
  function blur() {
    // Let the Done button receive focus before deciding whether editing ended.
    frame = win.requestAnimationFrame(() => { if (doc.activeElement !== done && doc.activeElement !== editor) finish() })
  }
  function accept() { finish() }
  function cancel() { finish(false) }
  function keydown(event: KeyboardEvent) {
    event.stopPropagation()
    if (event.isComposing) return
    if (event.key === 'Escape') { event.preventDefault(); finish(false) }
    if (event.key === 'Enter' && (event.metaKey || event.ctrlKey)) { event.preventDefault(); finish() }
  }
  let parent: Window | null = win
  while (parent) {
    try {
      documents.push(parent.document)
      parent.document.addEventListener('pointerdown', outside, true)
      parent = parent.parent === parent ? null : parent.parent
    } catch { break }
  }
  editor.addEventListener('blur', blur)
  editor.addEventListener('input', position)
  editor.addEventListener('keydown', keydown)
  done.addEventListener('click', accept)
  done.addEventListener('blur', blur)
  done.addEventListener('keydown', keydown)
  win.addEventListener('scroll', position, true)
  win.addEventListener('resize', position)
  win.addEventListener('pagehide', cancel)
  win.visualViewport?.addEventListener('resize', position)
  win.visualViewport?.addEventListener('scroll', position)
  position()
  editor.focus({ preventScroll: true })
  editor.setSelectionRange(editor.value.length, editor.value.length)
  return { finish }
}
