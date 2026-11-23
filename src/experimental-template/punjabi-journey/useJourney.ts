import { useLayoutEffect, type RefObject } from 'react'

/**
 * One scroll loop for the whole journey.
 *
 * Every `[data-scene]` element is a tall track that contains one sticky
 * `.pj-stage`. Each stage receives its own smoothed progress as `--p` (0..1);
 * layers and copy derive transforms and opacity from it in CSS, so the depth
 * plan lives in the stylesheet. The root receives `--j`, the progress of the
 * whole journey.
 *
 * Rules carried over from the a-timeless-union hook: measure only when layout
 * changes, time-based smoothing, skip work for scenes that are off screen, pause
 * when the tab is hidden, and clamp elastic overscroll.
 */
export function useJourney(root: RefObject<HTMLElement | null>) {
  useLayoutEffect(() => {
    const rootEl = root.current
    if (!rootEl) return
    const abort = new AbortController()
    const opts = { passive: true, signal: abort.signal }
    const reduced = matchMedia('(prefers-reduced-motion: reduce)')

    const scenes = Array.from(rootEl.querySelectorAll<HTMLElement>('[data-scene]')).flatMap((track) => {
      const stage = track.querySelector<HTMLElement>('.pj-stage')
      const steps = Number(track.dataset.steps || 0)
      return stage ? [{ track, stage, steps, top: 0, range: 1, current: NaN, written: '', stepped: '', live: '' }] : []
    })

    let viewport = window.innerHeight
    let docRange = 1
    let dirty = true
    let frame = 0
    let previous = 0
    let journeyWritten = ''

    const measure = () => {
      viewport = window.innerHeight
      const y = window.scrollY
      for (const scene of scenes) {
        scene.top = scene.track.getBoundingClientRect().top + y
        scene.range = Math.max(1, scene.track.offsetHeight - viewport)
      }
      docRange = Math.max(1, document.documentElement.scrollHeight - viewport)
      dirty = false
    }

    const tick = (time: number) => {
      frame = 0
      if (document.hidden) return
      if (dirty) measure()
      const y = Math.min(Math.max(0, window.scrollY), docRange)
      const elapsed = previous ? Math.min(64, time - previous) : 16.67
      previous = time
      const blend = 1 - Math.exp(-elapsed / 65)
      let settling = false

      for (const scene of scenes) {
        const bottom = scene.top + scene.range + viewport
        const near = y + viewport * 2 > scene.top && y < bottom + viewport
        const live = near ? 'true' : 'false'
        if (live !== scene.live) {
          scene.stage.dataset.live = live
          scene.live = live
        }
        if (!near) continue
        const target = Math.min(1, Math.max(0, (y - scene.top) / scene.range))
        if (!Number.isFinite(scene.current) || reduced.matches) scene.current = target
        else scene.current += (target - scene.current) * blend
        if (Math.abs(target - scene.current) < 0.0004) scene.current = target
        else settling = true
        const value = scene.current.toFixed(4)
        if (value !== scene.written) {
          scene.stage.style.setProperty('--p', value)
          scene.written = value
        }
        if (scene.steps > 1) {
          // Stepped progress: each step dwells, then eases to the next, so a scrubbed
          // carousel lets the guest actually read a card before it leaves.
          const span = scene.current * (scene.steps - 1)
          const index = Math.min(scene.steps - 2, Math.floor(span))
          const local = Math.min(1, Math.max(0, (span - index - 0.3) / 0.4))
          const eased = local * local * (3 - 2 * local)
          const stepped = ((index + eased) / (scene.steps - 1)).toFixed(4)
          if (stepped !== scene.stepped) {
            scene.stage.style.setProperty('--ps', stepped)
            scene.stepped = stepped
          }
        }
      }

      const journey = (y / docRange).toFixed(4)
      if (journey !== journeyWritten) {
        rootEl.style.setProperty('--j', journey)
        journeyWritten = journey
      }
      if (settling) frame = requestAnimationFrame(tick)
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
    reduced.addEventListener('change', invalidate, { signal: abort.signal })
    const observer = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(invalidate) : null
    observer?.observe(rootEl)
    document.fonts?.ready.then(invalidate)

    return () => {
      abort.abort()
      observer?.disconnect()
      cancelAnimationFrame(frame)
    }
  }, [root])
}
