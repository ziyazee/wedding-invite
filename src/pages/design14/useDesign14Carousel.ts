import { useCallback, useEffect, useRef, useState } from 'react'

export function useDesign14Carousel(opened: boolean) {
  const galleryRef = useRef<HTMLDivElement>(null)
  const navigate = useRef<(index: number) => void>(() => {})
  const [selected, setSelected] = useState(0)
  const goTo = useCallback((index: number) => navigate.current(index), [])

  useEffect(() => {
    const gallery = galleryRef.current
    const track = gallery?.querySelector<HTMLDivElement>('.d14-event-gallery-track')
    if (!gallery || !track) return
    const abort = new AbortController()
    const passive = { passive: true, signal: abort.signal }
    const events = { signal: abort.signal }
    const slides = Array.from(track.children)
    const motion = matchMedia('(prefers-reduced-motion: reduce)')
    let current = Math.round(track.scrollLeft / (track.clientWidth || 1))
    let width = track.clientWidth
    let autoTimer = 0
    let focusTimer = 0
    let visible = typeof IntersectionObserver === 'undefined'
    let hovering = gallery.matches(':hover') && matchMedia('(hover: hover)').matches
    const pointers = new Set<number>()
    const update = () => {
      if (!track.clientWidth) return
      current = Math.max(0, Math.min(slides.length - 1, Math.round(track.scrollLeft / track.clientWidth)))
      setSelected(current)
    }
    const scrollTo = (index: number, animate = true) => {
      current = Math.max(0, Math.min(slides.length - 1, index))
      track.scrollTo({ left: current * track.clientWidth, behavior: animate && !motion.matches ? 'smooth' : 'instant' })
    }
    const stopAutoScroll = () => {
      window.clearTimeout(autoTimer)
      autoTimer = 0
    }
    const scheduleAutoScroll = () => {
      stopAutoScroll()
      if (slides.length < 2 || !visible || document.hidden || motion.matches || hovering || pointers.size || !opened || gallery.querySelector(':focus-visible')) return
      autoTimer = window.setTimeout(() => {
        const next = (current + 1) % slides.length
        scrollTo(next, next !== 0)
        scheduleAutoScroll()
      }, 2000)
    }
    navigate.current = index => {
      scrollTo(index)
      scheduleAutoScroll()
    }
    track.addEventListener('scroll', () => { update(); scheduleAutoScroll() }, passive)
    track.addEventListener('keydown', event => {
      if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return
      event.preventDefault()
      scrollTo(event.key === 'Home' ? 0 : event.key === 'End' ? slides.length - 1 : current + (event.key === 'ArrowRight' ? 1 : -1))
    }, events)
    let drag: { id: number; x: number; left: number; active: boolean } | null = null
    track.querySelectorAll('img').forEach(image => { image.draggable = false })
    track.addEventListener('pointerdown', event => {
      if (event.pointerType !== 'mouse' || event.button !== 0) return
      drag = { id: event.pointerId, x: event.clientX, left: track.scrollLeft, active: false }
    }, events)
    track.addEventListener('pointermove', event => {
      if (!drag || drag.id !== event.pointerId) return
      const distance = event.clientX - drag.x
      if (!drag.active && Math.abs(distance) < 6) return
      if (!drag.active) {
        drag.active = true
        track.classList.add('is-dragging')
        track.setPointerCapture(event.pointerId)
      }
      event.preventDefault()
      track.scrollLeft = drag.left - distance
    }, events)
    const finishDrag = () => {
      if (!drag) return
      const { active, id } = drag
      drag = null
      const nearest = Math.round(track.scrollLeft / track.clientWidth)
      track.classList.remove('is-dragging')
      if (track.hasPointerCapture(id)) track.releasePointerCapture(id)
      if (active) scrollTo(nearest)
    }
    track.addEventListener('pointerup', finishDrag, events)
    track.addEventListener('pointercancel', finishDrag, events)
    track.addEventListener('lostpointercapture', finishDrag, events)
    track.addEventListener('pointerleave', () => { if (drag && !drag.active) drag = null }, events)
    const resize = () => {
      if (width === track.clientWidth) return
      width = track.clientWidth
      scrollTo(current, false)
    }
    const resizeObserver = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(resize) : null
    resizeObserver?.observe(track)
    if (!resizeObserver) window.addEventListener('resize', resize, passive)
    const visibilityObserver = typeof IntersectionObserver !== 'undefined' ? new IntersectionObserver(entries => {
      visible = entries[0].isIntersecting && entries[0].intersectionRatio >= 0.15
      scheduleAutoScroll()
    }, { threshold: [0, 0.15] }) : null
    visibilityObserver?.observe(track)
    gallery.addEventListener('pointerenter', event => {
      if (event.pointerType !== 'mouse') return
      hovering = true
      stopAutoScroll()
    }, events)
    gallery.addEventListener('pointerleave', event => {
      if (event.pointerType !== 'mouse') return
      hovering = false
      scheduleAutoScroll()
    }, events)
    gallery.addEventListener('pointerdown', event => { pointers.add(event.pointerId); stopAutoScroll() }, passive)
    const releasePointer = (event: PointerEvent) => {
      if (pointers.delete(event.pointerId)) scheduleAutoScroll()
    }
    window.addEventListener('pointerup', releasePointer, passive)
    window.addEventListener('pointercancel', releasePointer, passive)
    track.addEventListener('wheel', scheduleAutoScroll, passive)
    gallery.addEventListener('focusin', scheduleAutoScroll, events)
    gallery.addEventListener('focusout', () => {
      window.clearTimeout(focusTimer)
      focusTimer = window.setTimeout(scheduleAutoScroll, 0)
    }, events)
    document.addEventListener('visibilitychange', () => { if (document.hidden) pointers.clear(); scheduleAutoScroll() }, events)
    motion.addEventListener('change', scheduleAutoScroll, events)
    window.addEventListener('pagehide', stopAutoScroll, events)
    window.addEventListener('pageshow', scheduleAutoScroll, events)
    update()
    scheduleAutoScroll()
    return () => {
      abort.abort()
      stopAutoScroll()
      window.clearTimeout(focusTimer)
      resizeObserver?.disconnect()
      visibilityObserver?.disconnect()
      navigate.current = () => {}
      if (drag && track.hasPointerCapture(drag.id)) track.releasePointerCapture(drag.id)
      track.classList.remove('is-dragging')
    }
  }, [opened])

  return { galleryRef, selected, goTo }
}
