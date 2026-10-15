import { useEffect, useLayoutEffect, type RefObject } from 'react'

export function useDesign14Motion(host: RefObject<HTMLDivElement | null>, opened: boolean) {
  useLayoutEffect(() => {
    const container = host.current
    if (!container) return
    const abort = new AbortController()
    const options = { passive: true, signal: abort.signal }
    const motion = matchMedia('(prefers-reduced-motion: reduce)')
    const temple = container.querySelector<HTMLElement>('[data-d14-name="PAGE 1"] [data-d14-name="TEMPLE"]')
    const firstPage = container.querySelector<HTMLElement>('[data-d14-name="PAGE 1"]')
    const scene = container.querySelector<HTMLElement>('[data-d14-name="PAGE 3"]')
    const couple = scene?.querySelector<HTMLElement>('[data-d14-name="COUPLE"]')
    const frame = scene?.querySelector<HTMLElement>('[data-d14-name="GATE 2"]')
    const crop = scene?.querySelector<HTMLElement>('.d14-couple-window')
    let referenceOffset = 0
    let animationFrame = 0
    const update = () => {
      animationFrame = 0
      if (temple && firstPage) {
        const distance = motion.matches ? 0 : Math.min(window.scrollY, firstPage.getBoundingClientRect().height)
        temple.style.setProperty('--d14-temple-shift', `${Math.round(distance * 0.28)}px`)
      }
      if (scene && couple) {
        const bounds = scene.getBoundingClientRect()
        const progress = Math.max(-innerHeight, Math.min(-bounds.top, bounds.height))
        const shift = motion.matches ? 0 : Math.max(0, referenceOffset + progress) * 0.38
        couple.style.setProperty('--d14-couple-shift', `${shift.toFixed(2)}px`)
      }
    }
    const schedule = () => {
      if (!animationFrame) animationFrame = requestAnimationFrame(update)
    }
    const measure = () => {
      if (scene && frame && crop) {
        referenceOffset = 0
        for (const sibling of Array.from(scene.parentElement?.children || [])) {
          if (sibling === scene) break
          if (sibling.getAttribute('data-d14-name')?.startsWith('PAGE ')) referenceOffset += sibling.getBoundingClientRect().height
        }
        const innerBottom = frame.offsetTop + frame.offsetHeight * 0.936
        crop.style.setProperty('--d14-couple-crop-bottom', `${Math.max(0, scene.clientHeight - innerBottom).toFixed(2)}px`)
      }
      schedule()
    }
    measure()
    window.addEventListener('scroll', schedule, options)
    window.addEventListener('resize', measure, options)
    motion.addEventListener('change', measure, { signal: abort.signal })
    const observer = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(measure) : null
    if (scene && frame && scene.parentElement) {
      observer?.observe(scene)
      observer?.observe(frame)
      observer?.observe(scene.parentElement)
    }
    return () => {
      abort.abort()
      observer?.disconnect()
      cancelAnimationFrame(animationFrame)
    }
  }, [host])

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
  }, [host, opened])
}
