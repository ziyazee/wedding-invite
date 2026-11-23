/* Depth parallax. Layers inside a section carry `data-depth="<speed>"`; each one is shifted
   by (scroll offset x speed) through the `--mr-depth` CSS var and rendered with
   `transform: translate3d(0, var(--mr-depth), 0)`. A positive speed lags behind the page (far away),
   a negative speed runs ahead of it (near the viewer). Moving layers at different speeds is what
   separates the painted planes — same approach the Timeless Union scenes use for temple and couple.
   The shift is eased in time (not per frame) so 60Hz and 120Hz feel the same, and it only runs while
   the section is on screen. `data-depth-origin="top"` measures from the section top (hero), the default
   "center" measures from the viewport centre. `data-depth-clamp` caps the offset in px. */

import { useEffect } from 'react'
import type { RefObject } from 'react'

interface Layer {
  el: HTMLElement
  speed: number
  current: number
  written: string
}

export function useDepthParallax(ref: RefObject<HTMLElement | null>, reducedMotion: boolean, revision = '') {
  useEffect(() => {
    const section = ref.current
    if (!section) return
    const layers: Layer[] = Array.from(section.querySelectorAll<HTMLElement>('[data-depth]')).map((el) => ({
      el,
      speed: Number(el.dataset.depth) || 0,
      current: NaN,
      written: '',
    }))
    if (!layers.length) return

    const origin = section.dataset.depthOrigin === 'top' ? 'top' : 'center'
    const clamp = Number(section.dataset.depthClamp) || 480
    let visible = true
    let frame = 0
    let prev = 0

    const offset = () => {
      const r = section.getBoundingClientRect()
      const raw = origin === 'top' ? -r.top : window.innerHeight / 2 - (r.top + r.height / 2)
      return Math.max(origin === 'top' ? 0 : -clamp, Math.min(clamp, raw))
    }

    const update = (time: number) => {
      frame = 0
      if (!visible || document.hidden) return
      const off = reducedMotion ? 0 : offset()
      const dt = prev ? Math.min(64, time - prev) : 16.67
      const blend = 1 - Math.exp(-dt / 70)
      prev = time
      let settling = false
      for (const layer of layers) {
        const target = off * layer.speed
        if (!Number.isFinite(layer.current) || reducedMotion) layer.current = target
        else layer.current += (target - layer.current) * blend
        if (Math.abs(target - layer.current) < 0.05) layer.current = target
        else settling = true
        const value = `${layer.current.toFixed(2)}px`
        if (value !== layer.written) {
          layer.el.style.setProperty('--mr-depth', value)
          layer.written = value
        }
      }
      if (settling) frame = requestAnimationFrame(update)
      else prev = 0
    }
    const schedule = () => {
      if (!frame && visible && !document.hidden) frame = requestAnimationFrame(update)
    }

    const io = new IntersectionObserver(
      (entries) => {
        visible = entries.some((e) => e.isIntersecting)
        if (visible) schedule()
      },
      { rootMargin: '120px 0px' },
    )
    io.observe(section)
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule, { passive: true })
    schedule()
    return () => {
      io.disconnect()
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      cancelAnimationFrame(frame)
    }
  }, [ref, reducedMotion, revision])
}
