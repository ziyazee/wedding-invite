import { useEffect } from 'react'

const isTouch = typeof window !== 'undefined' && window.matchMedia('(pointer:coarse)').matches
const COLORS = ['#A01830', '#F0E0B0', '#C8860A', '#6B8E7A', '#1A2C5B', '#E8C060', '#FAF4E4', '#C8380A']
const SHAPES = ['rect', 'circle', 'petal'] as const
const OVERFLOW = 200

interface Origin { x: number; y: number }

class Particle {
  x: number; y: number; vx: number; vy: number; vr: number; rot: number
  sz: number; colour: string; shape: typeof SHAPES[number]; alpha: number; decay: number
  side: 'left' | 'right'
  ox: number; oy: number

  constructor(side: 'left' | 'right', origins: { left: Origin; right: Origin }, h: number) {
    this.side = side
    const o = side === 'left' ? origins.left : origins.right
    this.ox = o.x; this.oy = o.y
    this.x = 0; this.y = 0; this.vx = 0; this.vy = 0; this.vr = 0
    this.rot = 0; this.sz = 0; this.colour = ''; this.shape = 'rect'
    this.alpha = 0; this.decay = 0
    this.initRandom()
    this.y = Math.random() * (h + OVERFLOW)
  }

  initRandom() {
    const dir = this.side === 'left' ? 1 : -1
    this.x = this.ox + (Math.random() - 0.5) * 20
    this.y = this.oy + Math.random() * 10
    this.vx = dir * (0.4 + Math.random() * 1.4) + (Math.random() - 0.5) * 0.6
    this.vy = 0.6 + Math.random() * 1.8
    this.vr = (Math.random() - 0.5) * 5
    this.rot = Math.random() * 360
    this.sz = 5 + Math.random() * 9
    this.colour = COLORS[Math.floor(Math.random() * COLORS.length)]
    this.shape = SHAPES[Math.floor(Math.random() * SHAPES.length)]
    this.alpha = 0.7 + Math.random() * 0.3
    this.decay = 0.001 + Math.random() * 0.001
  }

  update(maxH: number, origins: { left: Origin; right: Origin }) {
    this.x += this.vx; this.vy += 0.035; this.y += this.vy
    this.rot += this.vr; this.alpha -= this.decay
    if (this.y > maxH + 10 || this.alpha <= 0) {
      const o = this.side === 'left' ? origins.left : origins.right
      this.ox = o.x; this.oy = o.y; this.initRandom()
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.save()
    ctx.globalAlpha = Math.max(0, this.alpha)
    ctx.fillStyle = this.colour
    ctx.translate(this.x, this.y)
    ctx.rotate(this.rot * Math.PI / 180)
    const h = this.sz
    if (this.shape === 'rect') { ctx.fillRect(-h / 2, -h / 4, h, h / 2) }
    else if (this.shape === 'circle') { ctx.beginPath(); ctx.arc(0, 0, h / 2, 0, Math.PI * 2); ctx.fill() }
    else { ctx.beginPath(); ctx.moveTo(0, -h / 2); ctx.quadraticCurveTo(h / 2, 0, 0, h / 2); ctx.quadraticCurveTo(-h / 2, 0, 0, -h / 2); ctx.fill() }
    ctx.restore()
  }
}

function getTrunkOrigins(bridge: HTMLElement) {
  const rect = bridge.getBoundingClientRect()
  const lImg = bridge.querySelector('#elephL img, #elephL .eleph-svg') as HTMLElement | null
  const rImg = bridge.querySelector('#elephR img, #elephR .eleph-svg') as HTMLElement | null
  let left: Origin, right: Origin
  if (lImg) { const r = lImg.getBoundingClientRect(); left = { x: r.left - rect.left + r.width * 0.85, y: r.top - rect.top + r.height * 0.1 } }
  else left = { x: bridge.offsetWidth * 0.28, y: bridge.offsetHeight * 0.12 }
  if (rImg) { const r = rImg.getBoundingClientRect(); right = { x: r.left - rect.left + r.width * 0.15, y: r.top - rect.top + r.height * 0.1 } }
  else right = { x: bridge.offsetWidth * 0.72, y: bridge.offsetHeight * 0.12 }
  return { left, right }
}

export function useCanvasConfetti(rootRef: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const canvas = root.querySelector<HTMLCanvasElement>('#confettiRain')
    const bridge = root.querySelector<HTMLElement>('#elephBridge')
    if (!canvas || !bridge) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let origins = { left: { x: 0, y: 0 }, right: { x: 0, y: 0 } }
    let particles: Particle[] = []
    let raf: number

    function resize() {
      canvas!.width = bridge!.offsetWidth
      canvas!.height = bridge!.offsetHeight + OVERFLOW
      canvas!.style.height = bridge!.offsetHeight + OVERFLOW + 'px'
      origins = getTrunkOrigins(bridge!)
      particles.forEach(p => { const o = p.side === 'left' ? origins.left : origins.right; p.ox = o.x; p.oy = o.y })
    }

    function init() {
      resize()
      const count = isTouch ? 60 : 110
      particles = []
      for (let i = 0; i < count; i++) particles.push(new Particle(i < count / 2 ? 'left' : 'right', origins, canvas!.height))
    }

    function loop() {
      ctx!.clearRect(0, 0, canvas!.width, canvas!.height)
      particles.forEach(p => { p.update(canvas!.height, origins); p.draw(ctx!) })
      raf = requestAnimationFrame(loop)
    }

    const io = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return
      io.disconnect()
      requestAnimationFrame(() => { init(); loop() })
    }, { threshold: 0.1 })
    io.observe(bridge)

    let resizeTimer: ReturnType<typeof setTimeout>
    const onResize = () => { clearTimeout(resizeTimer); resizeTimer = setTimeout(resize, 120) }
    window.addEventListener('resize', onResize)

    return () => {
      io.disconnect()
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', onResize)
      clearTimeout(resizeTimer)
    }
  }, [rootRef])
}
