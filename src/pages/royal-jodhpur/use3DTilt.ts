import { useEffect } from 'react'

export function use3DTilt(rootRef: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const els = root.querySelectorAll<HTMLElement>('.ev-node, .gal-item')
    const cleanups: (() => void)[] = []

    els.forEach(el => {
      function onMouseMove(e: MouseEvent) {
        const r = el.getBoundingClientRect()
        const x = (e.clientX - r.left) / r.width - 0.5
        const y = (e.clientY - r.top) / r.height - 0.5
        el.style.transition = 'transform 0.08s ease'
        el.style.transform = `perspective(900px) rotateX(${(y * -13).toFixed(2)}deg) rotateY(${(x * 16).toFixed(2)}deg) scale(1.035)`
      }
      function onMouseLeave() {
        el.style.transition = 'transform 0.55s cubic-bezier(0.34,1.56,0.64,1)'
        el.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg) scale(1)'
      }
      function onTouchMove(e: TouchEvent) {
        if (e.touches.length !== 1) return
        const r = el.getBoundingClientRect()
        const x = (e.touches[0].clientX - r.left) / r.width - 0.5
        const y = (e.touches[0].clientY - r.top) / r.height - 0.5
        el.style.transition = 'transform 0.05s ease'
        el.style.transform = `perspective(700px) rotateX(${(y * -8).toFixed(2)}deg) rotateY(${(x * 10).toFixed(2)}deg) scale(1.025)`
      }
      function onTouchEnd() {
        el.style.transition = 'transform 0.5s cubic-bezier(0.34,1.56,0.64,1)'
        el.style.transform = 'perspective(700px) rotateX(0deg) rotateY(0deg) scale(1)'
      }
      el.addEventListener('mousemove', onMouseMove)
      el.addEventListener('mouseleave', onMouseLeave)
      el.addEventListener('touchmove', onTouchMove, { passive: true })
      el.addEventListener('touchend', onTouchEnd)
      cleanups.push(() => {
        el.removeEventListener('mousemove', onMouseMove)
        el.removeEventListener('mouseleave', onMouseLeave)
        el.removeEventListener('touchmove', onTouchMove)
        el.removeEventListener('touchend', onTouchEnd)
      })
    })

    return () => cleanups.forEach(fn => fn())
  }, [rootRef])
}
