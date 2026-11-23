import { useEffect } from 'react'

export function useTouchSparkle(enabled: boolean, color = '#e9c877') {
  useEffect(() => {
    if (!enabled) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const style = document.createElement('style')
    style.textContent = `
      @keyframes ml-particle{0%{transform:translate(0,0) scale(.4);opacity:0}25%{transform:translate(calc(var(--dx)*.6),calc(var(--dy)*.6)) scale(1.15);opacity:1}100%{transform:translate(var(--dx),var(--dy)) scale(.3);opacity:0}}
      @keyframes ml-streak{0%{transform:translate(0,0) rotate(var(--ra)) scaleY(.3);opacity:0}25%{transform:translate(calc(var(--sx)*.5),calc(var(--sy)*.5)) rotate(var(--ra)) scaleY(1.2);opacity:1}100%{transform:translate(var(--sx),var(--sy)) rotate(var(--ra)) scaleY(.5);opacity:0}}
      @keyframes ml-glow{0%{transform:translate(-50%,-50%) scale(.5);opacity:.95}100%{transform:translate(-50%,-50%) scale(4);opacity:0}}
    `
    document.head.appendChild(style)

    const overlay = document.createElement('div')
    overlay.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:70;overflow:hidden'
    document.body.appendChild(overlay)

    function spawn(e: PointerEvent) {
      const cx = e.clientX, cy = e.clientY
      const root = document.createElement('div')
      root.style.cssText = `position:absolute;left:${cx}px;top:${cy}px`

      for (let i = 0; i < 8; i++) {
        const angle = Math.random() * Math.PI * 2
        const dist = 44 + 88 * Math.random()
        const size = 3 + 7 * Math.random()
        const delay = 0.1 * Math.random()
        const p = document.createElement('span')
        p.style.cssText = `position:absolute;border-radius:50%;width:${size}px;height:${size}px;left:${-size / 2}px;top:${-size / 2}px;background:${color};box-shadow:0 0 10px 2px ${color};--dx:${Math.cos(angle) * dist}px;--dy:${Math.sin(angle) * dist - 12}px;animation:ml-particle 1.1s ${delay}s ease-out both`
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
        s.style.cssText = `position:absolute;border-radius:999px;width:2px;height:16px;left:-1px;top:-8px;background:linear-gradient(to bottom,${color},transparent);transform-origin:center top;--sx:${sx}px;--sy:${sy}px;--ra:${ra};animation:ml-streak 1.1s ${delay}s ease-out both`
        root.appendChild(s)
      }

      const c = document.createElement('span')
      c.style.cssText = `position:absolute;border-radius:50%;width:9px;height:9px;left:-4.5px;top:-4.5px;background:${color};box-shadow:0 0 16px 4px ${color};animation:ml-glow 1.1s ease-out forwards`
      root.appendChild(c)

      overlay.appendChild(root)
      setTimeout(() => root.remove(), 1200)
    }

    document.addEventListener('pointerdown', spawn, { passive: true })
    return () => {
      document.removeEventListener('pointerdown', spawn)
      overlay.remove()
      style.remove()
    }
  }, [enabled, color])
}
