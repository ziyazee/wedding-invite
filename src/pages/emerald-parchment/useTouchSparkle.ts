import { useEffect, useRef } from 'react'

const COLOR = '#c9a15a'

export function useTouchSparkle() {
  const overlayRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) return

    function spawnBurst(cx: number, cy: number) {
      const overlay = overlayRef.current
      if (!overlay) return

      const root = document.createElement('div')
      root.style.cssText = `position:absolute;left:${cx}px;top:${cy}px;`

      for (let i = 0; i < 8; i++) {
        const angle = Math.random() * Math.PI * 2
        const dist = 44 + 88 * Math.random()
        const size = 3 + 7 * Math.random()
        const delay = 0.1 * Math.random()
        const dx = Math.cos(angle) * dist
        const dy = Math.sin(angle) * dist - 12
        const p = document.createElement('span')
        p.style.cssText = [
          'position:absolute', 'border-radius:50%',
          `width:${size}px`, `height:${size}px`,
          `left:${-size / 2}px`, `top:${-size / 2}px`,
          `background:${COLOR}`, `box-shadow:0 0 10px 2px ${COLOR}`,
          `--dx:${dx}px`, `--dy:${dy}px`,
          `animation:ep-particle 1.1s ${delay}s ease-out both`,
        ].join(';')
        root.appendChild(p)
      }

      for (let i = 0; i < 3; i++) {
        const angle = (i / 3) * Math.PI * 2 + 0.6 * Math.random()
        const length = 26 + 26 * Math.random()
        const delay = 0.06 * Math.random()
        const sx = Math.cos(angle) * length
        const sy = Math.sin(angle) * length - 8
        const ra = (180 * angle / Math.PI + 90) + 'deg'
        const s = document.createElement('span')
        s.style.cssText = [
          'position:absolute', 'border-radius:999px',
          'width:2px', 'height:16px', 'left:-1px', 'top:-8px',
          `background:linear-gradient(to bottom, ${COLOR}, transparent)`,
          'transform-origin:center top',
          `--sx:${sx}px`, `--sy:${sy}px`, `--ra:${ra}`,
          `animation:ep-streak-out 1.1s ${delay}s ease-out both`,
        ].join(';')
        root.appendChild(s)
      }

      const center = document.createElement('span')
      center.style.cssText = [
        'position:absolute', 'border-radius:50%',
        'width:9px', 'height:9px', 'left:-4.5px', 'top:-4.5px',
        `background:${COLOR}`, `box-shadow:0 0 16px 4px ${COLOR}`,
        'animation:ep-center-glow 1.1s ease-out forwards',
      ].join(';')
      root.appendChild(center)

      overlay.appendChild(root)
      setTimeout(() => root.remove(), 1200)
    }

    function onPointer(e: PointerEvent) {
      spawnBurst(e.clientX, e.clientY)
    }

    document.addEventListener('pointerdown', onPointer, { passive: true })
    return () => {
      document.removeEventListener('pointerdown', onPointer)
    }
  }, [])

  return overlayRef
}
