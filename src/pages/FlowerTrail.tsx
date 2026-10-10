import { useEffect, useRef } from 'react'

// A separate, non-interactive layer keeps the invitation's touch controls usable.
export default function FlowerTrail() {
  const layer = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const host = layer.current
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (!host) return
    let lastScroll = 0
    let lastTouch = { x: window.innerWidth / 2, y: window.innerHeight * .65 }
    const active = new Set<Animation>()
    const colors = ['#e8bcb6', '#f5dfcd', '#f3e9d4', '#cfa09a', '#c3cba4']

    function scatter(x: number, y: number, count: number) {
      if (reducedMotion.matches || document.hidden) return
      for (let i = 0; i < count && host!.childElementCount < 36; i++) {
        const flower = document.createElement('span')
        const size = 15 + Math.random() * 13
        const color = colors[Math.floor(Math.random() * colors.length)]
        flower.className = 'rg-touch-flower'
        flower.style.cssText = `left:${x}px;top:${y}px;width:${size}px;height:${size}px;color:${color}`
        // Five rounded petals with a gold center, matching the invitation florals.
        flower.innerHTML = '<svg viewBox="0 0 40 40" fill="currentColor" aria-hidden="true"><g stroke="#967a5e" stroke-opacity=".2" stroke-width=".7">' +
          [0, 72, 144, 216, 288].map(angle => `<ellipse cx="20" cy="11" rx="7" ry="10" transform="rotate(${angle} 20 20)"/>`).join('') +
          '</g><circle cx="20" cy="20" r="4" fill="#b79b60"/><circle cx="19" cy="19" r="1.5" fill="#f9e5ad"/></svg>'
        host!.appendChild(flower)
        const dx = (Math.random() - .5) * 170
        const rise = 30 + Math.random() * 65
        const rotation = (Math.random() - .5) * 280
        const animation = flower.animate([
          { opacity: 0, transform: 'translate(-50%, -50%) scale(.3) rotate(0deg)', offset: 0 },
          { opacity: .95, transform: `translate(calc(-50% + ${dx * .45}px), calc(-50% - ${rise}px)) scale(1) rotate(${rotation * .4}deg)`, offset: .3 },
          { opacity: 0, transform: `translate(calc(-50% + ${dx}px), calc(-50% + ${70 + Math.random() * 70}px)) scale(.7) rotate(${rotation}deg)`, offset: 1 },
        ], { duration: 3200 + Math.random() * 1200, easing: 'ease-out' })
        active.add(animation)
        animation.onfinish = () => { active.delete(animation); flower.remove() }
      }
    }

    function onPointer(e: PointerEvent) {
      lastTouch = { x: e.clientX, y: e.clientY }
      scatter(e.clientX, e.clientY, 7)
    }
    function onScroll() {
      const now = performance.now()
      if (now - lastScroll < 180) return
      lastScroll = now
      const x = Math.max(24, Math.min(window.innerWidth - 24, lastTouch.x + (Math.random() - .5) * 120))
      const y = Math.max(40, Math.min(window.innerHeight - 60, lastTouch.y))
      scatter(x, y, 2)
    }
    function clearFlowers() {
      for (const animation of active) animation.cancel()
      active.clear(); host!.replaceChildren()
    }
    function onPreference() { if (reducedMotion.matches) clearFlowers() }
    window.addEventListener('pointerdown', onPointer, { passive: true })
    window.addEventListener('scroll', onScroll, { passive: true })
    reducedMotion.addEventListener('change', onPreference)
    return () => {
      window.removeEventListener('pointerdown', onPointer)
      window.removeEventListener('scroll', onScroll)
      reducedMotion.removeEventListener('change', onPreference)
      clearFlowers()
    }
  }, [])

  return <div ref={layer} className="rg-flower-trail" aria-hidden="true" />
}
