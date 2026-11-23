import { useEffect, useRef } from 'react'
import type { RefObject, CSSProperties } from 'react'

// [ left%, size px, opacity, depth (px per px scrolled), sway secs ]
const SEED = [
  [-4, 104, 0.58, 0.62, 5.2],
  [89, 110, 0.58, 0.70, 6.0],
  [-2,  82, 0.52, 0.50, 4.6],
  [85,  88, 0.54, 0.56, 6.6],
  [ 3,  64, 0.48, 0.38, 5.4],
  [82,  68, 0.48, 0.42, 7.0],
  [-6,  72, 0.50, 0.46, 6.2],
  [92,  76, 0.52, 0.52, 5.0],
  [10,  44, 0.38, 0.28, 7.8],
  [77,  46, 0.40, 0.32, 6.8],
  [16,  34, 0.32, 0.22, 8.4],
  [73,  36, 0.34, 0.25, 7.2],
  [22,  28, 0.26, 0.17, 9.0],
  [68,  30, 0.28, 0.20, 8.0],
] as const

interface FloatingLanternsProps {
  src: string
  scrollerRef: RefObject<HTMLElement | null>
  sceneRef: RefObject<HTMLElement | null>
}

export function FloatingLanterns({ src, scrollerRef, sceneRef }: FloatingLanternsProps) {
  const itemRefs = useRef<(HTMLDivElement | null)[]>([])
  const rafRef = useRef(0)

  useEffect(() => {
    const scroller = scrollerRef.current
    const scene = sceneRef.current
    if (!scroller || !scene) return

    const items = SEED.map(([, size, , depth, ], i) => ({
      el: itemRefs.current[i],
      depth,
      phase: i * 1.7,
      base: (i * 95) % 650,
    }))

    let ticking = false
    function update() {
      ticking = false
      const scrollPos = scroller!.scrollTop
      const sceneTop = scene!.offsetTop
      const y = scrollPos - sceneTop
      const totalH = scene!.offsetHeight || 1200
      const span = totalH + 400

      for (const it of items) {
        if (!it.el) continue
        let ty = (it.base + y * it.depth) % span
        if (ty < 0) ty += span
        const t = scrollPos * 0.006 + it.phase
        const dx = Math.sin(t) * (8 + it.depth * 16)
        const rot = Math.sin(t * 0.85) * (2 + it.depth * 5)
        it.el.style.setProperty('--y', (ty - 120) + 'px')
        it.el.style.setProperty('--x', dx.toFixed(2) + 'px')
        it.el.style.setProperty('--rot', rot.toFixed(2) + 'deg')
      }
    }

    function onScroll() {
      if (!ticking) { ticking = true; rafRef.current = requestAnimationFrame(update) }
    }

    scroller.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    update()

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      scroller.removeEventListener('scroll', onScroll)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [scrollerRef, sceneRef])

  return (
    <div className="lantern-layer" aria-hidden="true">
      {SEED.map(([left, size, op, , sway], i) => (
        <div
          key={i}
          ref={el => { itemRefs.current[i] = el }}
          className="float-lantern"
          style={{ '--size': size + 'px', '--op': op, '--sway': sway + 's', left: left + '%' } as CSSProperties}
        >
          <img className="fl-img" src={src} alt="" loading="lazy" />
        </div>
      ))}
    </div>
  )
}
