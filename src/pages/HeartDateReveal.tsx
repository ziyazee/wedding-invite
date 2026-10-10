import { useEffect, useId, useRef, useState } from 'react'
import type { CSSProperties, PointerEvent } from 'react'

const HEART = 'M50 96 C50 96 6 70 6 36 C6 18 20 6 32 6 C42 6 48 14 50 24 C52 14 58 6 68 6 C80 6 94 18 94 36 C94 70 50 96 50 96 Z'
const particles = Array.from({ length: 90 }, (_, i) => ({
  left: `${(i * 37.7) % 100}%`,
  background: ['#a4b28f', '#526342', '#dec58a', '#faf1db', '#b58b79'][i % 5],
  '--drift': `${((i * 53) % 280) - 140}px`,
  '--spin': `${i % 2 ? 720 : -540}deg`,
  animationDelay: `${(i % 13) * 0.06}s`,
  animationDuration: `${3.4 + (i % 7) * 0.22}s`,
  width: `${i % 9 === 0 ? 5 : 7 + i % 5}px`,
  height: `${i % 9 === 0 ? 25 : 7 + i % 7}px`,
  borderRadius: i % 3 ? '2px' : '50%',
}) as CSSProperties)

export default function HeartDateReveal() {
  const id = `heart-${useId().replace(/:/g, '')}`
  const canvas = useRef<HTMLCanvasElement>(null)
  const previous = useRef<{ x: number; y: number } | null>(null)
  const samples = useRef<number[]>([])
  const lastCheck = useRef(0)
  const done = useRef(false)
  const [revealed, setRevealed] = useState(false)
  const [celebrating, setCelebrating] = useState(false)

  useEffect(() => {
    const el = canvas.current, ctx = el?.getContext('2d', { willReadFrequently: true })
    if (!el || !ctx) return
    const width = 600, height = 560
    el.width = width; el.height = height
    ctx.clearRect(0, 0, width, height)
    ctx.save(); ctx.scale(width / 100, height / 100); ctx.clip(new Path2D(HEART)); ctx.scale(100 / width, 100 / height)
    const gradient = ctx.createRadialGradient(210, 150, 15, 300, 280, 420)
    gradient.addColorStop(0, '#eee6d2'); gradient.addColorStop(.45, '#9aa584'); gradient.addColorStop(1, '#4a5540')
    ctx.fillStyle = gradient; ctx.fillRect(0, 0, width, height)
    for (let i = 0; i < 24000; i++) {
      ctx.fillStyle = ['#eee6d280', '#9aa584a0', '#4a554080', '#fff8eab0'][i % 4]
      ctx.fillRect(Math.random() * width, Math.random() * height, 1.5, 1.5)
    }
    for (let i = 0; i < 65; i++) {
      const x = Math.random() * width, y = Math.random() * height
      ctx.fillStyle = '#fff9eab0'; ctx.fillRect(x - 3, y, 7, 1); ctx.fillRect(x, y - 3, 1, 7)
    }
    ctx.fillStyle = '#35422d'; ctx.textAlign = 'center'; ctx.font = 'italic 32px Georgia'
    ctx.fillText('A date with forever', 300, 260)
    ctx.font = '18px Georgia'; ctx.fillText('Scratch gently to discover', 300, 302)
    ctx.restore()
    const pixels = ctx.getImageData(0, 0, width, height).data
    samples.current = []
    for (let y = 0; y < height; y += 7) for (let x = 0; x < width; x += 7) {
      const index = (y * width + x) * 4 + 3
      if (pixels[index] > 200) samples.current.push(index)
    }
  }, [])

  useEffect(() => {
    if (!celebrating) return
    const timeout = window.setTimeout(() => setCelebrating(false), 6000)
    return () => clearTimeout(timeout)
  }, [celebrating])

  function reveal() {
    if (done.current) return
    done.current = true; setRevealed(true); setCelebrating(true)
  }

  function scratch(e: PointerEvent<HTMLCanvasElement>) {
    if (done.current || !e.currentTarget.hasPointerCapture(e.pointerId)) return
    const el = e.currentTarget, ctx = el.getContext('2d')
    if (!ctx) return
    const bounds = el.getBoundingClientRect()
    const point = { x: (e.clientX - bounds.left) * el.width / bounds.width, y: (e.clientY - bounds.top) * el.height / bounds.height }
    ctx.globalCompositeOperation = 'destination-out'
    ctx.lineWidth = 74; ctx.lineCap = 'round'; ctx.lineJoin = 'round'
    ctx.beginPath()
    if (previous.current) { ctx.moveTo(previous.current.x, previous.current.y); ctx.lineTo(point.x, point.y); ctx.stroke() }
    else { ctx.arc(point.x, point.y, 37, 0, Math.PI * 2); ctx.fill() }
    previous.current = point
    if (performance.now() - lastCheck.current < 80) return
    lastCheck.current = performance.now()
    const pixels = ctx.getImageData(0, 0, el.width, el.height).data
    const cleared = samples.current.reduce((total, index) => total + (pixels[index] < 128 ? 1 : 0), 0)
    if (samples.current.length && cleared / samples.current.length >= .4) reveal()
  }

  return <div className={`rg-heart-reveal ${revealed ? 'is-revealed' : ''}`}>
    <p className="rg-heart-title rg-script" aria-live="polite">{revealed ? 'Our forever begins' : 'Scratch to reveal'}</p>
    <svg width="0" height="0" aria-hidden="true" style={{ position: 'absolute' }}><defs><clipPath id={id} clipPathUnits="objectBoundingBox"><path d={HEART} transform="scale(.01)" /></clipPath></defs></svg>
    <div className="rg-heart-card">
      <div className="rg-heart-inner" style={{ clipPath: `url(#${id})` }}>
        <div className="rg-heart-date"><span className="rg-script">You’re invited!</span><strong>27 September 2026</strong><span>Sunday</span><small>5:00 in the evening</small></div>
        <canvas ref={canvas} className="rg-heart-coating" aria-hidden="true"
          onPointerDown={e => { e.currentTarget.setPointerCapture(e.pointerId); previous.current = null; scratch(e) }}
          onPointerMove={scratch} onPointerUp={() => { previous.current = null }}
          onPointerCancel={() => { previous.current = null }} onLostPointerCapture={() => { previous.current = null }} />
      </div>
      <svg className="rg-heart-outline" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><path d={HEART} fill="none" stroke="#78825b" strokeWidth="1.2" vectorEffect="non-scaling-stroke" /></svg>
    </div>
    {revealed && <p className="rg-reveal-message" role="status">Let the celebration begin! ♡</p>}
    {celebrating && <div className="rg-confetti" aria-hidden="true">{particles.map((style, i) => <span key={i} style={style} />)}</div>}
    {!revealed && <button className="rg-text-button" onClick={reveal}>Or tap to reveal ♡</button>}
  </div>
}
