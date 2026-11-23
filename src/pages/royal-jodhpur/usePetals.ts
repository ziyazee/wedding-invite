import { useEffect, useRef } from 'react'

const isTouch = typeof window !== 'undefined' && window.matchMedia('(pointer:coarse)').matches
const PETAL_SRC = '/templates/shaadipath-t02/assets/elements/Element 2.webp'

interface PetalConfig { max: number; rate: number }

const SECTIONS: Record<string, { touch: PetalConfig; desktop: PetalConfig }> = {
  hero:    { touch: { max: 4, rate: 2000 },  desktop: { max: 8, rate: 1000 } },
  invite:  { touch: { max: 3, rate: 3500 },  desktop: { max: 5, rate: 2000 } },
  events:  { touch: { max: 5, rate: 1800 },  desktop: { max: 12, rate: 800 } },
  story:   { touch: { max: 2, rate: 4500 },  desktop: { max: 4, rate: 2800 } },
  gallery: { touch: { max: 2, rate: 4500 },  desktop: { max: 4, rate: 2800 } },
  things:  { touch: { max: 2, rate: 5000 },  desktop: { max: 4, rate: 3000 } },
  rsvp:    { touch: { max: 2, rate: 3500 },  desktop: { max: 4, rate: 2000 } },
}

class PetalEmitter {
  el: HTMLElement
  max: number
  rate: number
  active = false
  pool = new Set<HTMLElement>()
  iv: ReturnType<typeof setInterval> | null = null

  constructor(el: HTMLElement, cfg: PetalConfig) {
    this.el = el; this.max = cfg.max; this.rate = cfg.rate
  }

  spawn() {
    if (this.pool.size >= this.max) {
      const first = this.pool.values().next().value
      first?.remove(); this.pool.delete(first!)
    }
    if (this.pool.size >= this.max) return

    const sz = 50 + Math.random() * 55
    const left = 4 + Math.random() * 90
    const dur = 10 + Math.random() * 8
    const driftX = (Math.random() - 0.5) * 80
    const spin = (Math.random() - 0.5) * 20

    const wrap = document.createElement('div')
    wrap.style.cssText = `position:absolute;width:${sz}px;height:${sz}px;left:${left}%;bottom:-${sz}px;pointer-events:none`
    const img = document.createElement('img')
    img.src = PETAL_SRC; img.loading = 'lazy'
    img.style.cssText = 'width:100%;height:100%;object-fit:contain;mix-blend-mode:screen;filter:drop-shadow(0 0 12px rgba(200,134,10,.70)) drop-shadow(0 0 30px rgba(200,134,10,.35))'
    wrap.appendChild(img)

    const anim = wrap.animate([
      { transform: 'translateY(0) translateX(0) rotate(0deg)', opacity: 0 },
      { transform: `translateY(-8vh) translateX(${driftX * 0.15}px) rotate(${spin * 0.3}deg)`, opacity: 0.8, offset: 0.06 },
      { transform: `translateY(-55vh) translateX(${driftX * 0.7}px) rotate(${spin * 0.8}deg)`, opacity: 0.65, offset: 0.55 },
      { transform: `translateY(-95vh) translateX(${driftX}px) rotate(${spin}deg)`, opacity: 0.3, offset: 0.9 },
      { transform: `translateY(-115vh) translateX(${driftX}px) rotate(${spin}deg)`, opacity: 0 },
    ], { duration: dur * 1000, easing: 'ease-in', fill: 'forwards' })

    anim.onfinish = () => { wrap.remove(); this.pool.delete(wrap) }
    this.el.appendChild(wrap)
    this.pool.add(wrap)
  }

  start() {
    if (this.active) return; this.active = true
    const rate = isTouch ? this.rate * 2 : this.rate
    this.iv = setInterval(() => { if (this.active) this.spawn() }, rate)
    this.spawn()
  }

  stop() {
    this.active = false
    if (this.iv) clearInterval(this.iv)
  }

  destroy() {
    this.stop()
    this.pool.forEach(el => el.remove())
    this.pool.clear()
  }
}

export function usePetals(rootRef: React.RefObject<HTMLElement | null>) {
  const emitters = useRef<Map<string, PetalEmitter>>(new Map())

  useEffect(() => {
    const root = rootRef.current
    if (!root) return

    const map = new Map<string, PetalEmitter>()
    const sectionIds = ['hero', 'invite', 'events', 'story', 'gallery', 'things', 'rsvp']

    for (const id of sectionIds) {
      const canvasId = id === 'hero' ? 'petalHero' : `petal${id.charAt(0).toUpperCase() + id.slice(1)}`
      const el = root.querySelector<HTMLElement>(`#${canvasId}`)
      if (!el) continue
      const cfg = SECTIONS[id]
      const c = isTouch ? cfg.touch : cfg.desktop
      map.set(id, new PetalEmitter(el, c))
    }

    const targets = new Map<Element, string>()
    for (const id of sectionIds) {
      const sectionEl = id === 'hero'
        ? root.querySelector('#heroWrap')
        : root.querySelector(`#${id}`)
      if (sectionEl) targets.set(sectionEl, id)
    }

    const io = new IntersectionObserver((entries) => {
      entries.forEach(({ target, isIntersecting }) => {
        const key = targets.get(target)
        if (!key) return
        const emitter = map.get(key)
        if (emitter) isIntersecting ? emitter.start() : emitter.stop()
      })
    }, { threshold: 0.08 })

    targets.forEach((_, el) => io.observe(el))
    emitters.current = map

    return () => {
      io.disconnect()
      map.forEach(e => e.destroy())
      map.clear()
    }
  }, [rootRef])
}
