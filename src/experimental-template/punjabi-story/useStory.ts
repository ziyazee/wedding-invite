import { useLayoutEffect, type RefObject } from 'react'

/**
 * One scroll loop for the whole story.
 *
 * Every `[data-scene]` element is a tall track holding one sticky `.ps-stage`.
 * Each stage receives its own smoothed progress as `--p` (0..1). Stepped scenes
 * (`data-steps`) also get `--ps`, where each step dwells before easing on. The root
 * receives a smoothed `--j` for the whole journey.
 *
 * Changes from the first journey engine: `--j` is smoothed like `--p`, the live window
 * is one viewport instead of two, and re-measuring is skipped while a form control has
 * focus (the mobile keyboard changes innerHeight and would make the stage jump).
 */
export function useStory(root: RefObject<HTMLElement | null>) {
  useLayoutEffect(() => {
    const rootEl = root.current
    if (!rootEl) return
    const abort = new AbortController()
    const opts = { passive: true, signal: abort.signal }
    const reduced = matchMedia('(prefers-reduced-motion: reduce)')

    const scenes = Array.from(rootEl.querySelectorAll<HTMLElement>('[data-scene]')).flatMap((track) => {
      const stage = track.querySelector<HTMLElement>('.ps-stage')
      const steps = Number(track.dataset.steps || 0)
      return stage ? [{ track, stage, steps, top: 0, range: 1, current: NaN, written: '', stepped: '', live: '' }] : []
    })

    let viewport = window.innerHeight
    let docRange = 1
    let dirty = true
    let frame = 0
    let previous = 0
    let journey = NaN
    let journeyWritten = ''

    const typing = () => {
      const el = document.activeElement
      return el instanceof HTMLInputElement || el instanceof HTMLSelectElement || el instanceof HTMLTextAreaElement
    }

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
      if (dirty && !typing()) measure()
      const y = Math.min(Math.max(0, window.scrollY), docRange)
      const elapsed = previous ? Math.min(64, time - previous) : 16.67
      previous = time
      const blend = 1 - Math.exp(-elapsed / 65)
      let settling = false

      for (const scene of scenes) {
        const bottom = scene.top + scene.range + viewport
        const near = y + viewport > scene.top && y < bottom + viewport * 0.5
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

      const targetJourney = y / docRange
      if (!Number.isFinite(journey) || reduced.matches) journey = targetJourney
      else journey += (targetJourney - journey) * blend
      if (Math.abs(targetJourney - journey) < 0.0004) journey = targetJourney
      else settling = true
      const journeyValue = journey.toFixed(4)
      if (journeyValue !== journeyWritten) {
        rootEl.style.setProperty('--j', journeyValue)
        journeyWritten = journeyValue
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
    // Re-measure when the keyboard closes.
    document.addEventListener('focusout', invalidate, { signal: abort.signal })
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
