import { useEffect, useLayoutEffect, type RefObject } from 'react'

export function useDesign14Motion(host: RefObject<HTMLDivElement | null>, opened: boolean, revision = '') {
  useLayoutEffect(() => {
    const container = host.current
    if (!container) return
    const abort = new AbortController()
    const options = { passive: true, signal: abort.signal }
    const motion = matchMedia('(prefers-reduced-motion: reduce)')
    const firstPage = container.querySelector<HTMLElement>('[data-d14-name="PAGE 1"]')
    const scene = container.querySelector<HTMLElement>('[data-d14-name="PAGE 3"]')
    const ending = container.querySelector<HTMLElement>('.d14-end-scene')
    const frame = scene?.querySelector<HTMLElement>('[data-d14-name="GATE 2"]')
    const crop = scene?.querySelector<HTMLElement>('.d14-couple-window')
    const layers = [
      { element: firstPage?.querySelector<HTMLElement>('[data-d14-name="TEMPLE"]'), key: '--d14-temple-shift', current: NaN, written: '' },
      { element: scene?.querySelector<HTMLElement>('[data-d14-name="COUPLE"]'), key: '--d14-couple-shift', current: NaN, written: '' },
      { element: ending?.querySelector<HTMLElement>('.d14-end-couple'), key: '--d14-end-couple-shift', current: NaN, written: '' },
    ]
    let metrics = { viewport: 0, maxScroll: 0, firstTop: 0, firstHeight: 0, sceneTop: 0, sceneHeight: 0, endTop: 0, endHeight: 0, referenceOffset: 0 }
    let dirty = true
    let animationFrame = 0
    let previousTime = 0
    let disposed = false
    // Read layout only when it changes, before any transform writes in the frame.
    const measure = () => {
      const y = window.scrollY
      const firstBounds = firstPage?.getBoundingClientRect()
      const sceneBounds = scene?.getBoundingClientRect()
      const endBounds = ending?.getBoundingClientRect()
      let referenceOffset = 0
      if (scene) {
        for (const sibling of Array.from(scene.parentElement?.children || [])) {
          if (sibling === scene) break
          if (sibling.getAttribute('data-d14-name')?.startsWith('PAGE ')) referenceOffset += sibling.getBoundingClientRect().height
        }
      }
      const cropBottom = scene && frame ? Math.max(0, scene.clientHeight - frame.offsetTop - frame.offsetHeight * 0.936) : 0
      metrics = {
        viewport: window.innerHeight,
        maxScroll: Math.max(0, document.documentElement.scrollHeight - window.innerHeight),
        firstTop: (firstBounds?.top || 0) + y, firstHeight: firstBounds?.height || 0,
        sceneTop: (sceneBounds?.top || 0) + y, sceneHeight: sceneBounds?.height || 0,
        endTop: (endBounds?.top || 0) + y, endHeight: endBounds?.height || 0,
        referenceOffset,
      }
      crop?.style.setProperty('--d14-couple-crop-bottom', `${cropBottom.toFixed(2)}px`)
      dirty = false
    }
    const update = (time: number) => {
      animationFrame = 0
      if (document.hidden) return
      if (dirty) measure()
      const m = metrics
      // Clamp elastic overscroll on mobile so reversing direction cannot jump layers.
      const y = Math.max(0, Math.min(window.scrollY, m.maxScroll))
      // The contact footer follows the artwork; finish the descent at the scene edge.
      const endScroll = Math.max(0, m.endTop + m.endHeight - m.viewport)
      const progress = 1 - Math.min(1, Math.max(0, endScroll - y) / Math.max(1, m.endHeight))
      const targets = [
        motion.matches ? 0 : Math.min(y, m.firstHeight) * 0.28,
        motion.matches ? 0 : Math.max(0, m.referenceOffset + Math.max(-m.viewport, Math.min(y - m.sceneTop, m.sceneHeight))) * 0.38,
        motion.matches ? 0 : -Math.min(m.endHeight * 0.13, m.viewport * 0.15) * (1 - Math.pow(progress, 1.8)),
      ]
      const positions = [[m.firstTop, m.firstHeight], [m.sceneTop, m.sceneHeight], [m.endTop, m.endHeight]]
      const elapsed = previousTime ? Math.min(64, time - previousTime) : 16.67
      // Time-based easing behaves consistently at 60Hz and 120Hz, in both directions.
      const blend = 1 - Math.exp(-elapsed / 55)
      previousTime = time
      let settling = false
      layers.forEach((layer, index) => {
        if (!layer.element) return
        const [top, height] = positions[index]
        const visible = y + m.viewport > top - 100 && y < top + height + 100
        const target = targets[index]
        const atEndpoint = (index === 0 && y === 0) || (index === 2 && y >= endScroll - 0.5)
        if (!Number.isFinite(layer.current) || motion.matches || !visible || atEndpoint) layer.current = target
        else layer.current += (target - layer.current) * blend
        if (Math.abs(target - layer.current) < 0.05) layer.current = target
        else if (visible) settling = true
        const value = `${layer.current.toFixed(2)}px`
        if (value !== layer.written) {
          layer.element.style.setProperty(layer.key, value)
          layer.written = value
        }
      })
      if (settling) animationFrame = requestAnimationFrame(update)
      else previousTime = 0
    }
    const schedule = () => {
      if (!disposed && !document.hidden && !animationFrame) animationFrame = requestAnimationFrame(update)
    }
    const invalidate = () => { dirty = true; schedule() }
    const cloudGroups = [firstPage, scene, ending].filter((element): element is HTMLElement => !!element).map(section => ({
      section,
      visible: false,
      clouds: Array.from(section.querySelectorAll<HTMLElement>('.d14-1edylky, .d14-1l515fq, .d14-lm7ks0, .d14-local-cloud, [data-d14-name^="CLOUD"], .d14-end-cloud')).map(element => ({ element, previous: element.style.animationPlayState })),
    }))
    const updateClouds = () => cloudGroups.forEach(group => group.clouds.forEach(({ element }) => {
      element.style.animationPlayState = opened && group.visible && !document.hidden && !motion.matches ? 'running' : 'paused'
    }))
    const visibility = typeof IntersectionObserver !== 'undefined' ? new IntersectionObserver(entries => {
      entries.forEach(entry => {
        const group = cloudGroups.find(item => item.section === entry.target)
        if (group) group.visible = entry.isIntersecting
      })
      updateClouds()
    }, { rootMargin: '150px 0px' }) : null
    cloudGroups.forEach(group => {
      if (visibility) visibility.observe(group.section)
      else group.visible = true
    })
    updateClouds()
    schedule()
    window.addEventListener('scroll', schedule, options)
    window.addEventListener('resize', invalidate, options)
    // Lazy image decoding or font swaps can change section geometry.
    container.addEventListener('load', invalidate, { capture: true, signal: abort.signal })
    document.fonts.ready.then(() => { if (!disposed) invalidate() })
    motion.addEventListener('change', () => { updateClouds(); invalidate() }, { signal: abort.signal })
    document.addEventListener('visibilitychange', () => {
      cancelAnimationFrame(animationFrame)
      animationFrame = 0
      previousTime = 0
      updateClouds()
      invalidate()
    }, { signal: abort.signal })
    const observer = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(invalidate) : null
    ;[container, firstPage, scene, frame, ending, scene?.parentElement].forEach(element => { if (element) observer?.observe(element) })
    return () => {
      disposed = true
      abort.abort()
      observer?.disconnect()
      visibility?.disconnect()
      cancelAnimationFrame(animationFrame)
      cloudGroups.forEach(group => group.clouds.forEach(({ element, previous }) => { element.style.animationPlayState = previous }))
    }
  }, [host, opened, revision])

  useEffect(() => {
    if (!opened || !host.current) return
    const frames = new Set<number>()
    const reveal = (element: HTMLElement | SVGElement) => {
      const transform = element.style.transform
      element.style.transition = 'opacity 900ms ease, transform 900ms cubic-bezier(.22,.61,.36,1)'
      const frame = requestAnimationFrame(() => {
        frames.delete(frame)
        element.style.opacity = '1'
        if (transform.includes('translateY(40px)')) element.style.transform = transform.replace(' translateY(40px)', '').replace('translateY(40px)', 'translateY(0px)')
      })
      frames.add(frame)
    }
    const elements = Array.from(host.current.querySelectorAll<HTMLElement | SVGElement>('#main [style]')).filter(element => {
      return ['0', '0.001'].includes(element.style.opacity) && element.dataset.d14Name !== 'Insta Gradient BG' && !element.classList.contains('d14-entry-name') && !element.hasAttribute('data-d14-text-motion')
    })
    const motion = matchMedia('(prefers-reduced-motion: reduce)')
    const observer = typeof IntersectionObserver !== 'undefined' && !motion.matches
      ? new IntersectionObserver(entries => entries.forEach(entry => {
          if (!entry.isIntersecting) return
          reveal(entry.target as HTMLElement | SVGElement)
          observer?.unobserve(entry.target)
        }), { rootMargin: '0px 0px 10% 0px', threshold: 0.08 })
      : null
    elements.forEach(element => observer ? observer.observe(element) : reveal(element))
    return () => {
      observer?.disconnect()
      frames.forEach(cancelAnimationFrame)
    }
  }, [host, opened, revision])
}
