import { useEffect, useRef } from 'react'

const SEED: [number, number, number, number, number][] = [
  [-6, 104, 0.95, 0.62, 5.2],
  [90, 110, 0.95, 0.70, 6.0],
  [-3, 82, 0.88, 0.50, 4.6],
  [86, 88, 0.90, 0.56, 6.6],
  [4, 64, 0.78, 0.38, 5.4],
  [82, 68, 0.80, 0.42, 7.0],
  [-8, 72, 0.82, 0.46, 6.2],
  [93, 76, 0.85, 0.52, 5.0],
  [12, 44, 0.52, 0.28, 7.8],
  [76, 46, 0.54, 0.32, 6.8],
  [19, 34, 0.40, 0.22, 8.4],
  [71, 36, 0.42, 0.25, 7.2],
  [24, 28, 0.32, 0.17, 9.0],
  [67, 30, 0.34, 0.20, 8.0],
]

const LIGHT = '.scene-invite, .scene-couple, .scene-insta, .lantern-divider'

export function useFloatingLanterns(rootRef: React.RefObject<HTMLElement | null>) {
  const layerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const layer = document.createElement('div')
    layer.className = 'lantern-layer'
    layer.setAttribute('aria-hidden', 'true')
    layerRef.current = layer

    const items = SEED.map(([left, size, op, depth, sway], i) => {
      const el = document.createElement('div')
      el.className = 'float-lantern'
      el.style.setProperty('--size', size + 'px')
      el.style.setProperty('--op', String(op))
      el.style.setProperty('--sway', sway + 's')
      el.style.left = left + '%'
      const img = document.createElement('div')
      img.className = 'fl-img'
      el.appendChild(img)
      layer.appendChild(el)
      return { el, depth, phase: i * 1.7, base: -220 - (i * 90) % 420 }
    })

    document.body.appendChild(layer)

    let ticking = false
    function update() {
      ticking = false
      const y = window.pageYOffset || document.documentElement.scrollTop || 0
      const vh = window.innerHeight
      for (const it of items) {
        const span = vh + 620
        let ty = (it.base + y * it.depth) % span
        if (ty < 0) ty += span
        const t = y * 0.006 + it.phase
        const dx = Math.sin(t) * (8 + it.depth * 16)
        const rot = Math.sin(t * 0.85) * (2 + it.depth * 5)
        it.el.style.setProperty('--y', (ty - 300) + 'px')
        it.el.style.setProperty('--x', dx.toFixed(2) + 'px')
        it.el.style.setProperty('--rot', rot.toFixed(2) + 'deg')
      }
      let light = false
      document.querySelectorAll(LIGHT).forEach(sc => {
        const r = sc.getBoundingClientRect()
        if (r.top < vh * 0.55 && r.bottom > vh * 0.45) light = true
      })
      layer.classList.toggle('over-light', light)
    }

    function onScroll() {
      if (!ticking) { ticking = true; requestAnimationFrame(update) }
    }

    window.addEventListener('scroll', onScroll, { passive: true } as AddEventListenerOptions)
    window.addEventListener('resize', onScroll, { passive: true } as AddEventListenerOptions)
    update()

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      layer.remove()
      layerRef.current = null
    }
  }, [rootRef])
}
