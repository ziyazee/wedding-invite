import { useEffect, useRef, useState } from 'react'

export function useDestinationScratch() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [revealed, setRevealed] = useState(false)
  const drawing = useRef(false)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || revealed) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.src = '/templates/destination-wedding/wedding/scratch_cover_champagne.svg'
    img.onload = () => {
      canvas.width = canvas.offsetWidth * 2
      canvas.height = canvas.offsetHeight * 2
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
      ctx.globalCompositeOperation = 'destination-out'
    }

    const getPos = (e: MouseEvent | Touch) => {
      const rect = canvas.getBoundingClientRect()
      return { x: (e.clientX - rect.left) * 2, y: (e.clientY - rect.top) * 2 }
    }

    const scratch = (x: number, y: number) => {
      ctx.beginPath()
      ctx.arc(x, y, 36, 0, Math.PI * 2)
      ctx.fill()
    }

    const checkReveal = () => {
      const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data
      let transparent = 0
      for (let i = 3; i < data.length; i += 16) if (data[i] === 0) transparent++
      if (transparent / (data.length / 16) > 0.45) {
        setRevealed(true)
        canvas.style.transition = 'opacity .6s'
        canvas.style.opacity = '0'
      }
    }

    const onDown = (e: MouseEvent) => { drawing.current = true; const p = getPos(e); scratch(p.x, p.y) }
    const onMove = (e: MouseEvent) => { if (!drawing.current) return; const p = getPos(e); scratch(p.x, p.y) }
    const onUp = () => { drawing.current = false; checkReveal() }
    const onTouchStart = (e: TouchEvent) => { e.preventDefault(); drawing.current = true; const p = getPos(e.touches[0]); scratch(p.x, p.y) }
    const onTouchMove = (e: TouchEvent) => { e.preventDefault(); if (!drawing.current) return; const p = getPos(e.touches[0]); scratch(p.x, p.y) }
    const onTouchEnd = () => { drawing.current = false; checkReveal() }

    canvas.addEventListener('mousedown', onDown)
    canvas.addEventListener('mousemove', onMove)
    canvas.addEventListener('mouseup', onUp)
    canvas.addEventListener('mouseleave', onUp)
    canvas.addEventListener('touchstart', onTouchStart, { passive: false })
    canvas.addEventListener('touchmove', onTouchMove, { passive: false })
    canvas.addEventListener('touchend', onTouchEnd)
    return () => {
      canvas.removeEventListener('mousedown', onDown)
      canvas.removeEventListener('mousemove', onMove)
      canvas.removeEventListener('mouseup', onUp)
      canvas.removeEventListener('mouseleave', onUp)
      canvas.removeEventListener('touchstart', onTouchStart)
      canvas.removeEventListener('touchmove', onTouchMove)
      canvas.removeEventListener('touchend', onTouchEnd)
    }
  }, [revealed])

  return { canvasRef, revealed }
}
