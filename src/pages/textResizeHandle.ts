import { previewScale } from './textEditorGeometry'

// Dashboard-only affordance. The saved value is a regular font-size override;
// published invitations never create this handle or its listeners.
export function attachTextResizeHandle(element: HTMLElement, onResize: (size: number) => void, onStart: () => void, onEdit: () => void) {
  const doc = element.ownerDocument
  const win = doc.defaultView!
  const handle = doc.createElement('button')
  handle.type = 'button'
  handle.dataset.inviteTextResize = ''
  handle.textContent = '↘'
  handle.setAttribute('aria-label', 'Resize selected text. Drag outward to enlarge or inward to shrink. Arrow keys adjust the size.')
  handle.title = 'Drag to resize text'
  handle.style.cssText = 'all:initial;position:fixed;z-index:2147483647;box-sizing:border-box;width:32px;height:32px;display:grid;place-items:center;border:2px solid #fff;border-radius:8px;background:#a57b32;color:#fff;box-shadow:0 2px 8px #0003;font:22px/1 Arial,sans-serif;cursor:nwse-resize;touch-action:none;user-select:none;pointer-events:auto'
  const edit = doc.createElement('button')
  edit.type = 'button'
  edit.dataset.inviteTextEdit = ''
  edit.textContent = 'Edit'
  edit.setAttribute('aria-label', 'Edit selected text')
  edit.style.cssText = handle.style.cssText
  edit.style.cursor = 'pointer'
  edit.style.touchAction = 'manipulation'
  doc.body.append(handle, edit)
  let drag: { pointer: number; x: number; y: number; size: number; next: number; scale: number; original: string; priority: string; moved: boolean } | null = null
  let frame = 0
  let stopped = false
  let lastPosition = ''
  const clampSize = (size: number) => Math.max(8, Math.min(160, Math.round(size)))
  const fontSize = () => parseFloat(win.getComputedStyle(element).fontSize) || 16

  function position() {
    if (stopped) return
    const box = element.getBoundingClientRect()
    const scale = previewScale(win)
    const handleSize = 36 / scale
    const editWidth = 52 / scale
    const gap = 6 / scale
    const visible = element.isConnected && !element.hasAttribute('data-invite-editing') && box.width > 0 && box.height > 0 && box.bottom > 0 && box.top < win.innerHeight && box.right > 0 && box.left < win.innerWidth
    const next = visible ? `${Math.max(editWidth + gap + 2, Math.min(win.innerWidth - handleSize - 2, box.right - handleSize / 3))},${Math.max(2, Math.min(win.innerHeight - handleSize - 2, box.bottom - handleSize / 3))},${scale}` : ''
    if (next !== lastPosition) {
      handle.style.display = visible ? 'grid' : 'none'
      edit.style.display = visible ? 'grid' : 'none'
      if (visible) {
        const [left, top] = next.split(',')
        handle.style.left = `${left}px`
        handle.style.top = `${top}px`
        handle.style.width = `${handleSize}px`
        handle.style.height = `${handleSize}px`
        handle.style.fontSize = `${22 / scale}px`
        handle.style.borderWidth = `${2 / scale}px`
        handle.style.borderRadius = `${8 / scale}px`
        edit.style.left = `${Number(left) - editWidth - gap}px`
        edit.style.top = `${top}px`
        edit.style.width = `${editWidth}px`
        edit.style.height = `${handleSize}px`
        edit.style.fontSize = `${13 / scale}px`
        edit.style.borderWidth = `${2 / scale}px`
        edit.style.borderRadius = `${8 / scale}px`
      }
      lastPosition = next
    }
    // Track the selected element while it is moved, resized, scrolled or animated.
    frame = win.requestAnimationFrame(position)
  }
  function restore() {
    const ended = drag
    drag = null
    if (!ended) return
    element.style.setProperty('font-size', ended.original, ended.priority)
    if (handle.hasPointerCapture(ended.pointer)) handle.releasePointerCapture(ended.pointer)
    handle.title = 'Drag to resize text'
  }
  function down(event: PointerEvent) {
    if (!event.isPrimary || event.button !== 0) return
    event.preventDefault(); event.stopPropagation()
    onStart()
    const size = fontSize()
    drag = { pointer: event.pointerId, x: event.clientX, y: event.clientY, size, next: size, scale: previewScale(win), original: element.style.getPropertyValue('font-size'), priority: element.style.getPropertyPriority('font-size'), moved: false }
    handle.setPointerCapture(event.pointerId)
  }
  function move(event: PointerEvent) {
    if (!drag || event.pointerId !== drag.pointer) return
    event.preventDefault(); event.stopPropagation()
    const dx = (event.clientX - drag.x) * drag.scale, dy = (event.clientY - drag.y) * drag.scale
    if (!drag.moved && Math.hypot(dx, dy) < 3) return
    drag.moved = true
    drag.next = clampSize(drag.size + (dx + dy) / 6)
    element.style.setProperty('font-size', `${drag.next}px`, 'important')
    handle.title = `${drag.next}px · drag to resize text`
  }
  function finish(event: PointerEvent) {
    if (!drag || event.pointerId !== drag.pointer) return
    event.preventDefault(); event.stopPropagation()
    if (event.type === 'pointerup') move(event)
    const ended = drag
    restore()
    if (event.type === 'pointerup' && ended.moved && element.isConnected && ended.next !== ended.size) onResize(ended.next)
  }
  function keydown(event: KeyboardEvent) {
    if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key)) return
    event.preventDefault(); event.stopPropagation()
    const direction = ['ArrowRight', 'ArrowUp'].includes(event.key) ? 1 : -1
    onStart()
    onResize(clampSize(fontSize() + direction * (event.shiftKey ? 5 : 1)))
  }
  function click(event: MouseEvent) { event.preventDefault(); event.stopPropagation() }
  function editClick(event: MouseEvent) { event.preventDefault(); event.stopPropagation(); onEdit() }
  edit.addEventListener('click', editClick)
  handle.addEventListener('pointerdown', down)
  handle.addEventListener('pointermove', move)
  handle.addEventListener('pointerup', finish)
  handle.addEventListener('pointercancel', finish)
  handle.addEventListener('lostpointercapture', finish)
  handle.addEventListener('keydown', keydown)
  handle.addEventListener('click', click)
  handle.style.display = 'none'
  edit.style.display = 'none'
  position()
  return () => {
    stopped = true
    win.cancelAnimationFrame(frame)
    restore()
    handle.removeEventListener('pointerdown', down)
    handle.removeEventListener('pointermove', move)
    handle.removeEventListener('pointerup', finish)
    handle.removeEventListener('pointercancel', finish)
    handle.removeEventListener('lostpointercapture', finish)
    handle.removeEventListener('keydown', keydown)
    handle.removeEventListener('click', click)
    handle.remove()
    edit.removeEventListener('click', editClick)
    edit.remove()
  }
}

