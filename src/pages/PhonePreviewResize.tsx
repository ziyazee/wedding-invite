import { useLayoutEffect, useRef, useState } from 'react'
import type { PointerEvent, RefObject } from 'react'
import { createPortal } from 'react-dom'
import './PhonePreviewResize.css'

const ratio = 874 / 402

export default function PhonePreviewResize({ screen }: { screen: RefObject<HTMLDivElement | null> }) {
  const [phone, setPhone] = useState<HTMLElement | null>(null)
  const [width, setWidth] = useState<number | null>(null)
  const drag = useRef<{ pointer: number; x: number; y: number; width: number } | null>(null)
  const resize = useRef<(width: number | null) => void>(() => {})

  useLayoutEffect(() => {
    const element = screen.current?.parentElement
    const panel = element?.parentElement
    if (!element || !panel) return
    setPhone(element)
    const previousWidth = element.style.width
    const previousHeight = element.style.height
    let preferred: number | null = null
    function apply() {
      if (preferred === null) {
        element!.style.width = previousWidth
        element!.style.height = previousHeight
        return
      }
      const style = getComputedStyle(panel!)
      const available = Math.max(1, panel!.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight))
      const nextWidth = Math.min(available, Math.max(220, Math.min(560, preferred)))
      element!.style.width = `${nextWidth}px`
      // 2px outer border + 9px screen inset on each side. The screen has its
      // own 1px border, so preserve the inner 402:874 viewport exactly.
      element!.style.height = `${(nextWidth - 24) * ratio + 24}px`
    }
    resize.current = next => { preferred = next; apply() }
    const observer = new ResizeObserver(apply)
    observer.observe(panel)
    return () => {
      observer.disconnect()
      resize.current = () => {}
      element.style.width = previousWidth
      element.style.height = previousHeight
      element.classList.remove('is-phone-resizing')
    }
  }, [screen])

  useLayoutEffect(() => { resize.current(width) }, [width])

  function move(event: PointerEvent<HTMLButtonElement>) {
    const active = drag.current
    if (!active || active.pointer !== event.pointerId || !phone) return
    const horizontal = (event.clientX - active.x) * 2
    const vertical = (event.clientY - active.y) / ratio
    const delta = Math.abs(horizontal) > Math.abs(vertical) ? horizontal : vertical
    setWidth(Math.max(220, Math.min(560, active.width + delta)))
  }
  function finish(event: PointerEvent<HTMLButtonElement>) {
    if (drag.current?.pointer !== event.pointerId) return
    if (event.type === 'pointerup') move(event)
    drag.current = null
    phone?.classList.remove('is-phone-resizing')
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId)
  }

  if (!phone) return null
  return createPortal(<button type="button" className="phone-preview-resize" aria-label="Resize phone preview. Use arrow keys to adjust, or double-click to reset." title="Drag to resize · double-click to reset" onPointerDown={event => {
    if (!event.isPrimary || event.button !== 0) return
    event.preventDefault()
    drag.current = { pointer: event.pointerId, x: event.clientX, y: event.clientY, width: phone.offsetWidth }
    phone.classList.add('is-phone-resizing')
    event.currentTarget.setPointerCapture(event.pointerId)
  }} onPointerMove={move} onPointerUp={finish} onPointerCancel={finish} onLostPointerCapture={finish} onDoubleClick={() => setWidth(null)} onKeyDown={event => {
    if (event.key === 'Home') { event.preventDefault(); setWidth(null); return }
    if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key)) return
    event.preventDefault()
    const direction = ['ArrowRight', 'ArrowDown'].includes(event.key) ? 1 : -1
    setWidth(Math.max(220, Math.min(560, phone.offsetWidth + direction * (event.shiftKey ? 40 : 10))))
  }}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true"><path d="m7 17 10-10m-5 10 5-5m0 5h.01"/></svg></button>, phone)
}
