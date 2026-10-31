import { useCallback, useEffect, useId, useRef, useState } from 'react'
import type { CSSProperties, PointerEvent as ReactPointerEvent } from 'react'
import { useInvitationDetails } from '../invitations/context'
import { editableText } from '../invitations/textLayout'
import { EditableText } from '../invitations/components/EditableText'
import { InvitationSection } from '../invitations/components/InvitationSection'

const HEART = 'M50 96 C50 96 6 70 6 36 C6 18 20 6 32 6 C42 6 48 14 50 24 C52 14 58 6 68 6 C80 6 94 18 94 36 C94 70 50 96 50 96 Z'

const COLORS = ['#e8bcb6', '#f5dfcd', '#f3e9d4', '#cfa09a', '#c3cba4', '#d4c9a8', '#b8c4a0']

const confettiParticles = Array.from({ length: 90 }, (_, i) => ({
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

function flowerSVG(color: string) {
  return `<svg viewBox="0 0 40 40" fill="${color}" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><g stroke="#967a5e" stroke-opacity=".15" stroke-width=".5">${[0, 72, 144, 216, 288].map(a => `<ellipse cx="20" cy="11" rx="7" ry="10" transform="rotate(${a} 20 20)"/>`).join('')}</g><circle cx="20" cy="20" r="4" fill="#b79b60"/><circle cx="19" cy="19" r="1.5" fill="#f9e5ad"/></svg>`
}

type Flower = {
  id: number
  x: number
  y: number
  size: number
  rotation: number
  color: string
  scattered: boolean
}

function generateFlowers(count: number): Flower[] {
  const flowers: Flower[] = []
  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2
    const radius = Math.random() * 0.42
    const x = 0.5 + Math.cos(angle) * radius
    const y = 0.48 + Math.sin(angle) * radius * 1.1
    if (x < 0.05 || x > 0.95 || y < 0.02 || y > 0.95) { count++; continue }
    flowers.push({
      id: i,
      x, y,
      size: 16 + Math.random() * 16,
      rotation: Math.random() * 360,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      scattered: false,
    })
  }
  return flowers
}

export default function FlowerDateReveal({ date = '27 September 2026', day = 'Sunday', time = '5:00 in the evening', revealedImage }: { date?: string; day?: string; time?: string; revealedImage?: string }) {
  const clipId = `heart-${useId().replace(/:/g, '')}`
  const details = useInvitationDetails()
  const text = (field: string, label: string) => editableText(details?.template, 'date-reveal', field, label)
  const cardRef = useRef<HTMLDivElement>(null)
  const flowersRef = useRef<Flower[]>([])
  const containerRef = useRef<HTMLDivElement>(null)
  const [revealed, setRevealed] = useState(false)
  const [celebrating, setCelebrating] = useState(false)
  const [, setRemaining] = useState(0)
  const reducedMotion = useRef(false)

  useEffect(() => {
    reducedMotion.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  }, [])

  useEffect(() => {
    const flowers = generateFlowers(55)
    flowersRef.current = flowers
    setRemaining(flowers.length)
    renderFlowers(flowers)
  }, [])

  useEffect(() => {
    if (!celebrating) return
    const timeout = window.setTimeout(() => setCelebrating(false), 6000)
    return () => clearTimeout(timeout)
  }, [celebrating])

  function renderFlowers(flowers: Flower[]) {
    const container = containerRef.current
    if (!container) return
    container.innerHTML = ''
    for (const f of flowers) {
      if (f.scattered) continue
      const el = document.createElement('span')
      el.className = 'rg-overlay-flower'
      el.dataset.flowerId = String(f.id)
      el.style.cssText = `left:${f.x * 100}%;top:${f.y * 100}%;width:${f.size}px;height:${f.size}px;transform:translate(-50%,-50%) rotate(${f.rotation}deg)`
      el.innerHTML = flowerSVG(f.color)
      container.appendChild(el)
    }
  }

  const scatterFlowers = useCallback((ids: number[], allAtOnce: boolean) => {
    const container = containerRef.current
    if (!container) return
    const quick = reducedMotion.current
    for (const id of ids) {
      const flower = flowersRef.current.find(f => f.id === id)
      if (!flower || flower.scattered) continue
      flower.scattered = true
      const el = container.querySelector<HTMLElement>(`[data-flower-id="${id}"]`)
      if (!el) continue
      const dx = (Math.random() - 0.5) * 300
      const dy = (Math.random() - 0.5) * 300
      const spin = (Math.random() - 0.5) * 540
      const delay = allAtOnce ? Math.random() * 400 : 0
      if (quick) {
        el.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 300, delay, fill: 'forwards' }).onfinish = () => el.remove()
      } else {
        el.animate([
          { opacity: 1, transform: el.style.transform },
          { opacity: 0, transform: `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px)) rotate(${flower.rotation + spin}deg) scale(0.3)` },
        ], { duration: 800 + Math.random() * 400, delay, easing: 'ease-out', fill: 'forwards' }).onfinish = () => el.remove()
      }
    }
  }, [])

  function reveal() {
    if (revealed) return
    const unscattered = flowersRef.current.filter(f => !f.scattered)
    scatterFlowers(unscattered.map(f => f.id), true)
    setRemaining(0)
    setRevealed(true)
    setCelebrating(true)
  }

  function handleTap(e: ReactPointerEvent<HTMLDivElement>) {
    if (revealed) return
    const card = cardRef.current
    if (!card) return
    const bounds = card.getBoundingClientRect()
    const tapX = (e.clientX - bounds.left) / bounds.width
    const tapY = (e.clientY - bounds.top) / bounds.height

    const unscattered = flowersRef.current.filter(f => !f.scattered)
    if (unscattered.length === 0) return

    const withDistance = unscattered.map(f => ({
      ...f,
      dist: Math.hypot(f.x - tapX, f.y - tapY),
    })).sort((a, b) => a.dist - b.dist)

    const toScatter = withDistance.slice(0, Math.min(10, Math.ceil(unscattered.length * 0.2)))
    scatterFlowers(toScatter.map(f => f.id), false)

    const newRemaining = unscattered.length - toScatter.length
    setRemaining(newRemaining)

    if (newRemaining <= Math.ceil(flowersRef.current.length * 0.25)) {
      setTimeout(reveal, 300)
    }
  }

  return <InvitationSection as="div" data-invite-section="date-reveal-section" className={`rg-heart-reveal ${revealed ? 'is-revealed' : ''}`}>
    <EditableText as="p" {...text(revealed ? 'revealedHeading' : 'scratchHeading', revealed ? 'Our forever begins' : 'Tap the flowers')} className="rg-heart-title rg-script" aria-live="polite">{revealed ? 'Our forever begins' : 'Tap the flowers'}</EditableText>
    <svg width="0" height="0" aria-hidden="true" style={{ position: 'absolute' }}><defs><clipPath id={clipId} clipPathUnits="objectBoundingBox"><path d={HEART} transform="scale(.01)" /></clipPath></defs></svg>
    <div data-invite-section="date-reveal" className="rg-heart-card" ref={cardRef}>
      <div className="rg-heart-inner" style={revealed && revealedImage ? { maskImage: `url("${revealedImage}")`, maskSize: 'contain', maskPosition: 'center', maskRepeat: 'no-repeat', WebkitMaskImage: `url("${revealedImage}")`, WebkitMaskSize: 'contain', WebkitMaskPosition: 'center', WebkitMaskRepeat: 'no-repeat', background: 'transparent' } : { clipPath: `url(#${clipId})` }}>
        <div className="rg-heart-date" style={revealedImage ? { backgroundImage: `url("${revealedImage}")`, backgroundSize: 'contain', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' } : undefined}>
          <EditableText {...text('invited', "You're invited!")} className="rg-script">You're invited!</EditableText>
          <EditableText as="strong" {...text('date', 'Wedding date')}>{date}</EditableText>
          <EditableText {...text('weekday', 'Wedding date · weekday')}>{day}</EditableText>
          {time && <EditableText as="small" {...text('time', 'Wedding time')}>{time}</EditableText>}
        </div>
        <div
          ref={containerRef}
          className="rg-flower-overlay"
          onPointerDown={handleTap}
          aria-hidden="true"
        />
      </div>
      {!(revealed && revealedImage) && <svg className="rg-heart-outline" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><path d={HEART} fill="none" stroke="#78825b" strokeWidth="1.2" vectorEffect="non-scaling-stroke" /></svg>}
    </div>
    {revealed && <EditableText as="p" {...text('celebrate', 'Let the celebration begin!')} className="rg-reveal-message" role="status">Let the celebration begin! &#9825;</EditableText>}
    {celebrating && <div className="rg-confetti" aria-hidden="true">{confettiParticles.map((style, i) => <span key={i} style={style} />)}</div>}
    {!revealed && <EditableText as="button" {...text('tap', 'Or tap to reveal')} className="rg-text-button" onClick={reveal}>Or tap to reveal &#9825;</EditableText>}
  </InvitationSection>
}
