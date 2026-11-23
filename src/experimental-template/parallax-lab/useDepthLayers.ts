import { useLayoutEffect, type RefObject } from 'react'

/**
 * Drives a pinned depth scene. Writes one smoothed CSS variable (--p, 0..1) on
 * the stage; every layer derives its own transform from it in CSS, so the
 * per-layer speed lives in the stylesheet, not in JS.
 *
 * Lessons carried over from the a-timeless-union motion hook:
 * - measure layout only when it changes; scroll only reads scrollY
 * - time-based smoothing (same feel at 60Hz and 120Hz)
 * - clamp elastic overscroll
 * - skip work while the scene is off screen or the tab is hidden
 * - reduced motion: no smoothing, no ambient animation (handled in CSS)
 */
export function useDepthLayers(track: RefObject<HTMLElement | null>, stage: RefObject<HTMLElement | null>) {
  useLayoutEffect(() => {
    const trackEl = track.current
    const stageEl = stage.current
    if (!trackEl || !stageEl) return
    const abort = new AbortController()
    const opts = { passive: true, signal: abort.signal }
    const reduced = matchMedia('(prefers-reduced-motion: reduce)')

    let top = 0
    let range = 1
    let dirty = true
    let frame = 0
    let current = NaN
    let written = ''
    let previous = 0

    const measure = () => {
      top = trackEl.getBoundingClientRect().top + window.scrollY
      range = Math.max(1, trackEl.offsetHeight - window.innerHeight)
      dirty = false
    }

    const tick = (time: number) => {
      frame = 0
      if (document.hidden) return
      if (dirty) measure()
      const y = Math.max(0, window.scrollY)
      const target = Math.min(1, Math.max(0, (y - top) / range))
      const elapsed = previous ? Math.min(64, time - previous) : 16.67
      previous = time
      const blend = 1 - Math.exp(-elapsed / 70)
      if (!Number.isFinite(current) || reduced.matches) current = target
      else current += (target - current) * blend
      if (Math.abs(target - current) < 0.0004) current = target
      const value = current.toFixed(4)
      if (value !== written) {
        stageEl.style.setProperty('--p', value)
        written = value
      }
      if (current !== target) frame = requestAnimationFrame(tick)
      else previous = 0
    }

    const schedule = () => {
      if (!frame && !document.hidden) frame = requestAnimationFrame(tick)
    }
    const invalidate = () => {
      dirty = true
      schedule()
    }

    schedule()
    window.addEventListener('scroll', schedule, opts)
    window.addEventListener('resize', invalidate, opts)
    document.addEventListener('visibilitychange', invalidate, { signal: abort.signal })
    const observer = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(invalidate) : null
    observer?.observe(trackEl)
    document.fonts?.ready.then(invalidate)

    return () => {
      abort.abort()
      observer?.disconnect()
      cancelAnimationFrame(frame)
    }
  }, [track, stage])
}
