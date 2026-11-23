import { useCallback, useEffect, useRef, useState, type RefObject } from 'react'

export function useScratchCard(
  canvasRef: RefObject<HTMLCanvasElement | null>,
  containerRef: RefObject<HTMLDivElement | null>,
  imageSrc: string,
  enabled: boolean
) {
  const [revealed, setRevealed] = useState(false)
  const revealedRef = useRef(false)
  const drawingRef = useRef(false)

  useEffect(() => {
    if (!enabled) return
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    function setSize() {
      canvas!.width = container!.offsetWidth
      canvas!.height = container!.offsetHeight
    }

    const img = new Image()
    img.onload = () => { setSize(); ctx.drawImage(img, 0, 0, canvas.width, canvas.height) }
    img.onerror = () => { setSize(); ctx.fillStyle = '#3d1a2e'; ctx.fillRect(0, 0, canvas.width, canvas.height) }
    img.src = imageSrc

    function getPos(e: MouseEvent | TouchEvent) {
      const rect = canvas!.getBoundingClientRect()
      const src = 'touches' in e ? e.touches[0] : e
      return {
        x: (src.clientX - rect.left) * (canvas!.width / rect.width),
        y: (src.clientY - rect.top) * (canvas!.height / rect.height),
      }
    }

    function scratchAt(x: number, y: number, r = 22) {
      ctx!.globalCompositeOperation = 'destination-out'
      ctx!.beginPath()
      ctx!.arc(x, y, r, 0, Math.PI * 2)
      ctx!.fill()
      checkThreshold()
    }

    function checkThreshold() {
      if (revealedRef.current) return
      const data = ctx!.getImageData(0, 0, canvas!.width, canvas!.height).data
      const total = canvas!.width * canvas!.height
      let transparent = 0
      for (let i = 3; i < data.length; i += 4) { if (data[i] < 128) transparent++ }
      if (transparent / total >= 0.48) doReveal()
    }

    function doReveal() {
      if (revealedRef.current) return
      revealedRef.current = true
      ctx!.clearRect(0, 0, canvas!.width, canvas!.height)
      canvas!.style.pointerEvents = 'none'
      setRevealed(true)
    }

    const onMouseDown = (e: MouseEvent) => { drawingRef.current = true; const p = getPos(e); scratchAt(p.x, p.y) }
    const onMouseMove = (e: MouseEvent) => { if (!drawingRef.current) return; const p = getPos(e); scratchAt(p.x, p.y, 18) }
    const onMouseUp = () => { drawingRef.current = false }
    const onTouchStart = (e: TouchEvent) => { e.preventDefault(); drawingRef.current = true; const p = getPos(e); scratchAt(p.x, p.y) }
    const onTouchMove = (e: TouchEvent) => { e.preventDefault(); if (!drawingRef.current) return; const p = getPos(e); scratchAt(p.x, p.y, 20) }
    const onTouchEnd = () => { drawingRef.current = false }

    canvas.addEventListener('mousedown', onMouseDown)
    canvas.addEventListener('mousemove', onMouseMove)
    canvas.addEventListener('mouseup', onMouseUp)
    canvas.addEventListener('mouseleave', onMouseUp)
    canvas.addEventListener('touchstart', onTouchStart, { passive: false })
    canvas.addEventListener('touchmove', onTouchMove, { passive: false })
    canvas.addEventListener('touchend', onTouchEnd)

    const autoObs = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && !revealedRef.current) {
        autoObs.disconnect()
        setTimeout(() => { if (!revealedRef.current) doReveal() }, 1200)
      }
    }, { threshold: 0.85 })
    autoObs.observe(container)

    return () => {
      canvas.removeEventListener('mousedown', onMouseDown)
      canvas.removeEventListener('mousemove', onMouseMove)
      canvas.removeEventListener('mouseup', onMouseUp)
      canvas.removeEventListener('mouseleave', onMouseUp)
      canvas.removeEventListener('touchstart', onTouchStart)
      canvas.removeEventListener('touchmove', onTouchMove)
      canvas.removeEventListener('touchend', onTouchEnd)
      autoObs.disconnect()
    }
  }, [enabled, canvasRef, containerRef, imageSrc])

  const forceReveal = useCallback(() => {
    if (revealedRef.current) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height)
    canvas.style.pointerEvents = 'none'
    revealedRef.current = true
    setRevealed(true)
  }, [canvasRef])

  return { revealed, forceReveal }
}
