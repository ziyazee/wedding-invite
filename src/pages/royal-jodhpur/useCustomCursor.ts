import { useEffect, useRef } from 'react'

export function useCustomCursor(rootRef: React.RefObject<HTMLElement | null>) {
  const ringRef = useRef<HTMLDivElement | null>(null)
  const dotRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (window.matchMedia('(pointer:coarse)').matches) return
    const root = rootRef.current
    const ring = ringRef.current
    const dot = dotRef.current
    if (!root || !ring || !dot) return

    let ax = 0, ay = 0, ex = -200, ey = -200
    let active = false
    let raf: number

    function onMove(e: MouseEvent) {
      ex = e.clientX; ey = e.clientY
      dot.style.left = ex + 'px'
      dot.style.top = ey + 'px'
      if (!active) { active = true; root.classList.add('cursor-active') }
    }

    function loop() {
      ax += (ex - ax) * 0.082
      ay += (ey - ay) * 0.082
      ring.style.left = ax + 'px'
      ring.style.top = ay + 'px'
      ring.style.boxShadow = root.classList.contains('ch')
        ? '0 0 44px 16px rgba(200,134,10,.55)'
        : '0 0 20px 4px rgba(160,24,48,.25)'
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)

    document.addEventListener('mousemove', onMove)

    const hoverables = root.querySelectorAll('a, button, .ev-node, .tt, .gal-item')
    const enter = () => root.classList.add('ch')
    const leave = () => root.classList.remove('ch')
    hoverables.forEach(el => {
      el.addEventListener('mouseenter', enter)
      el.addEventListener('mouseleave', leave)
    })

    return () => {
      cancelAnimationFrame(raf)
      document.removeEventListener('mousemove', onMove)
      hoverables.forEach(el => {
        el.removeEventListener('mouseenter', enter)
        el.removeEventListener('mouseleave', leave)
      })
    }
  }, [rootRef])

  return { ringRef, dotRef }
}
