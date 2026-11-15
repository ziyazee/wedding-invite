import { useEffect, useRef } from 'react'
import { fireConfetti } from './Confetti'

const REVEAL_THRESHOLD = 0.5
const BRUSH_RADIUS = 16

export function useScratchCard(
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  wrapRef: React.RefObject<HTMLElement | null>,
  confettiRef: React.RefObject<HTMLElement | null>
) {
  const revealedRef = useRef(false)

  useEffect(() => {
    const canvas = canvasRef.current
    const wrap = wrapRef.current
    if (!canvas || !wrap) return

    const ctx = canvas.getContext('2d', { willReadFrequently: true })
    if (!ctx) {
      wrap.classList.add('date-revealed')
      return
    }

    let cssW = 0, cssH = 0
    let scratchedEnough = false
    let dragging = false
    let lastX: number | null = null, lastY: number | null = null

    function reveal() {
      if (revealedRef.current) return
      revealedRef.current = true
      wrap!.classList.add('date-revealed')
      fireConfetti(confettiRef.current)
    }

    function drawFoil() {
      const dpr = window.devicePixelRatio || 1
      const rect = canvas!.getBoundingClientRect()
      cssW = rect.width || 1
      cssH = rect.height || 1
      canvas!.width = cssW * dpr
      canvas!.height = cssH * dpr
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0)

      ctx!.globalCompositeOperation = 'source-over'
      ctx!.clearRect(0, 0, cssW, cssH)
      const step = Math.max(4, cssW * 0.045)
      for (let x = -cssH; x < cssW + cssH; x += step) {
        ctx!.fillStyle = (Math.round(x / step) % 2 === 0) ? '#cfd6db' : '#e9edf0'
        ctx!.beginPath()
        ctx!.moveTo(x, 0)
        ctx!.lineTo(x + step, 0)
        ctx!.lineTo(x + step + cssH, cssH)
        ctx!.lineTo(x + cssH, cssH)
        ctx!.closePath()
        ctx!.fill()
      }

      ctx!.fillStyle = 'rgba(90, 60, 30, 0.5)'
      ctx!.font = `${Math.round(cssH * 0.3)}px sans-serif`
      ctx!.textAlign = 'center'
      ctx!.textBaseline = 'middle'
      ctx!.fillText('✎ scratch here', cssW / 2, cssH / 2)

      scratchedEnough = false
      canvas!.style.opacity = ''
      canvas!.style.pointerEvents = ''
    }

    function posFromEvent(e: PointerEvent) {
      const rect = canvas!.getBoundingClientRect()
      return { x: e.clientX - rect.left, y: e.clientY - rect.top }
    }

    function eraseAt(x: number, y: number) {
      ctx!.globalCompositeOperation = 'destination-out'
      ctx!.beginPath()
      ctx!.arc(x, y, BRUSH_RADIUS, 0, Math.PI * 2)
      ctx!.fill()
    }

    function eraseLine(x0: number, y0: number, x1: number, y1: number) {
      const dist = Math.hypot(x1 - x0, y1 - y0)
      const steps = Math.max(1, Math.ceil(dist / (BRUSH_RADIUS / 2)))
      for (let i = 0; i <= steps; i++) {
        eraseAt(x0 + (x1 - x0) * (i / steps), y0 + (y1 - y0) * (i / steps))
      }
    }

    function checkScratchedEnough() {
      if (scratchedEnough) return
      const data = ctx!.getImageData(0, 0, canvas!.width, canvas!.height).data
      let transparent = 0, sampled = 0
      for (let i = 3; i < data.length; i += 4 * 6) {
        sampled++
        if (data[i] < 40) transparent++
      }
      if (sampled && transparent / sampled > REVEAL_THRESHOLD) {
        scratchedEnough = true
        canvas!.style.transition = 'opacity 0.4s ease'
        canvas!.style.opacity = '0'
        canvas!.style.pointerEvents = 'none'
        reveal()
      }
    }

    function start(e: PointerEvent) {
      dragging = true
      canvas!.setPointerCapture?.(e.pointerId)
      const p = posFromEvent(e)
      lastX = p.x; lastY = p.y
      eraseAt(p.x, p.y)
    }
    function move(e: PointerEvent) {
      if (!dragging) return
      const p = posFromEvent(e)
      eraseLine(lastX!, lastY!, p.x, p.y)
      lastX = p.x; lastY = p.y
      checkScratchedEnough()
    }
    function end() { dragging = false }

    canvas.addEventListener('pointerdown', start)
    canvas.addEventListener('pointermove', move)
    canvas.addEventListener('pointerup', end)
    canvas.addEventListener('pointercancel', end)

    drawFoil()
    window.addEventListener('resize', drawFoil, { passive: true } as AddEventListenerOptions)

    return () => {
      canvas.removeEventListener('pointerdown', start)
      canvas.removeEventListener('pointermove', move)
      canvas.removeEventListener('pointerup', end)
      canvas.removeEventListener('pointercancel', end)
      window.removeEventListener('resize', drawFoil)
    }
  }, [canvasRef, wrapRef, confettiRef])

  const fallbackReveal = () => {
    if (revealedRef.current) return
    revealedRef.current = true
    wrapRef.current?.classList.add('date-revealed')
    fireConfetti(confettiRef.current)
  }

  return { fallbackReveal }
}
