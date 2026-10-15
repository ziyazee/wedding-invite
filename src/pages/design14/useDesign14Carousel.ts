import { useCallback, useLayoutEffect, useRef, useState } from 'react'

export function useDesign14Carousel(opened: boolean) {
  const galleryRef = useRef<HTMLDivElement>(null)
  const navigate = useRef<(index: number) => void>(() => {})
  const [selected, setSelected] = useState(0)
  const goTo = useCallback((index: number) => navigate.current(index), [])

  useLayoutEffect(() => {
    const gallery = galleryRef.current
    const track = gallery?.querySelector<HTMLDivElement>('.d14-event-gallery-track')
    if (!gallery || !track) return
    const abort = new AbortController()
    const passive = { passive: true, signal: abort.signal }
    const events = { signal: abort.signal }
    // A duplicate last card precedes the real cards; a duplicate first card follows them.
    const count = track.querySelectorAll(':scope > section:not([data-carousel-clone])').length
    if (!count) return
    const motion = matchMedia('(prefers-reduced-motion: reduce)')
    const logicalIndex = (position: number) => ((position - 1) % count + count) % count
    let width = track.clientWidth
    let current = logicalIndex(Math.round(track.scrollLeft / (width || 1)) || 1)
    let autoTimer = 0
    let focusTimer = 0
    let settleTimer = 0
    let animationFrame = 0
    let animating = false
    let visible = typeof IntersectionObserver === 'undefined'
    let hovering = gallery.matches(':hover') && matchMedia('(hover: hover)').matches
    let drag: { id: number; x: number; left: number; active: boolean } | null = null
    const pointers = new Set<number>()

    const stopAutoScroll = () => {
      window.clearTimeout(autoTimer)
      autoTimer = 0
    }
    const updateSelection = () => {
      if (!track.clientWidth) return
      current = logicalIndex(Math.round(track.scrollLeft / track.clientWidth))
      setSelected(current)
    }
    const reposition = (position: number) => {
      track.classList.add('is-repositioning')
      track.scrollTo({ left: position * track.clientWidth, behavior: 'instant' })
      track.classList.remove('is-repositioning')
    }
    const normalizeLoop = () => {
      const position = track.scrollLeft / (track.clientWidth || 1)
      // Reset only after the duplicate is fully in view. The matching real card
      // looks identical, so the next forward/backward movement remains seamless.
      if (Math.abs(position) < 0.01) reposition(count)
      else if (Math.abs(position - count - 1) < 0.01) reposition(1)
    }
    const cancelAnimation = () => {
      cancelAnimationFrame(animationFrame)
      animationFrame = 0
      animating = false
      track.classList.remove('is-animating')
    }
    const scheduleAutoScroll = () => {
      stopAutoScroll()
      if (count < 2 || animating || !visible || document.hidden || motion.matches || hovering || pointers.size || !opened || gallery.querySelector(':focus-visible')) return
      autoTimer = window.setTimeout(() => moveTo((current + 1) % count), 2000)
    }
    const settle = () => {
      window.clearTimeout(settleTimer)
      if (animating || pointers.size || drag?.active) return
      normalizeLoop()
      updateSelection()
      scheduleAutoScroll()
    }
    const scheduleSettle = () => {
      window.clearTimeout(settleTimer)
      settleTimer = window.setTimeout(settle, 140)
    }
    const animateTo = (position: number, animate = true) => {
      stopAutoScroll()
      window.clearTimeout(settleTimer)
      track.classList.add('is-repositioning')
      cancelAnimation()
      const start = track.scrollLeft
      const target = position * track.clientWidth
      const distance = target - start
      current = logicalIndex(position)
      setSelected(current)
      if (!animate || motion.matches || Math.abs(distance) < 1) {
        reposition(position)
        settle()
        return
      }
      animating = true
      track.classList.add('is-animating')
      track.classList.remove('is-repositioning')
      const duration = Math.min(1100, 680 + Math.max(0, Math.abs(distance) / track.clientWidth - 1) * 120)
      const startedAt = performance.now()
      const step = (now: number) => {
        const progress = Math.min(1, (now - startedAt) / duration)
        const eased = progress < 0.5 ? 4 * progress ** 3 : 1 - (-2 * progress + 2) ** 3 / 2
        track.scrollTo({ left: start + distance * eased, behavior: 'instant' })
        if (progress < 1) animationFrame = requestAnimationFrame(step)
        else {
          // Keep snapping disabled for the invisible duplicate-to-real reset.
          normalizeLoop()
          cancelAnimation()
          settle()
        }
      }
      animationFrame = requestAnimationFrame(step)
    }
    const moveTo = (index: number) => {
      const next = (index % count + count) % count
      const candidates = [next + 1]
      if (next === 0) candidates.push(count + 1)
      if (next === count - 1) candidates.push(0)
      const position = track.scrollLeft / (track.clientWidth || 1)
      const closest = candidates.reduce((best, candidate) => Math.abs(candidate - position) < Math.abs(best - position) ? candidate : best)
      animateTo(closest)
    }
    navigate.current = moveTo
    reposition(current + 1)
    setSelected(current)
    // The parent activates the scoped page CSS in its own layout effect.
    const initialFrame = requestAnimationFrame(() => {
      if (!animating && !pointers.size) {
        reposition(current + 1)
        updateSelection()
      }
    })

    track.addEventListener('scroll', () => {
      if (animating) return
      stopAutoScroll()
      updateSelection()
      scheduleSettle()
    }, passive)
    track.addEventListener('keydown', event => {
      if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return
      event.preventDefault()
      moveTo(event.key === 'Home' ? 0 : event.key === 'End' ? count - 1 : current + (event.key === 'ArrowRight' ? 1 : -1))
    }, events)
    track.querySelectorAll('img').forEach(image => { image.draggable = false })
    track.addEventListener('pointerdown', event => {
      cancelAnimation()
      updateSelection()
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
      const nearest = Math.round(track.scrollLeft / (track.clientWidth || 1))
      // Disable snapping before releasing the dragged position to the animation.
      if (active) animateTo(nearest)
      track.classList.remove('is-dragging')
      if (track.hasPointerCapture(id)) track.releasePointerCapture(id)
      if (!active) scheduleSettle()
    }
    track.addEventListener('pointerup', finishDrag, events)
    track.addEventListener('pointercancel', finishDrag, events)
    track.addEventListener('lostpointercapture', finishDrag, events)
    track.addEventListener('pointerleave', () => { if (drag && !drag.active) drag = null }, events)
    const resize = () => {
      if (width === track.clientWidth) return
      width = track.clientWidth
      animateTo(current + 1, false)
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
      if (pointers.delete(event.pointerId)) scheduleSettle()
    }
    window.addEventListener('pointerup', releasePointer, passive)
    window.addEventListener('pointercancel', releasePointer, passive)
    track.addEventListener('wheel', () => { cancelAnimation(); stopAutoScroll(); scheduleSettle() }, passive)
    gallery.addEventListener('focusin', scheduleAutoScroll, events)
    gallery.addEventListener('focusout', () => {
      window.clearTimeout(focusTimer)
      focusTimer = window.setTimeout(scheduleAutoScroll, 0)
    }, events)
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) { pointers.clear(); animateTo(current + 1, false) }
      scheduleAutoScroll()
    }, events)
    motion.addEventListener('change', () => {
      if (motion.matches) animateTo(current + 1, false)
      scheduleAutoScroll()
    }, events)
    window.addEventListener('pagehide', stopAutoScroll, events)
    window.addEventListener('pageshow', scheduleAutoScroll, events)
    scheduleAutoScroll()
    return () => {
      abort.abort()
      stopAutoScroll()
      cancelAnimation()
      cancelAnimationFrame(initialFrame)
      window.clearTimeout(focusTimer)
      window.clearTimeout(settleTimer)
      resizeObserver?.disconnect()
      visibilityObserver?.disconnect()
      navigate.current = () => {}
      if (drag && track.hasPointerCapture(drag.id)) track.releasePointerCapture(drag.id)
      track.classList.remove('is-dragging', 'is-repositioning')
    }
  }, [opened])

  return { galleryRef, selected, goTo }
}
