import { useEffect, useRef, useState } from 'react'
import { InvitationMedia } from '../../invitations/components/InvitationMedia'

export function PearlClock({ weddingDate }: { weddingDate: string }) {
  const target = useRef(new Date(weddingDate).getTime())
  const sector = useRef<SVGPathElement>(null)
  const hand = useRef<SVGPathElement>(null)
  const root = useRef<HTMLDivElement>(null)
  const [values, setValues] = useState(() => compute(target.current))

  useEffect(() => { target.current = new Date(weddingDate).getTime() }, [weddingDate])

  useEffect(() => {
    const timer = setInterval(() => setValues(compute(target.current)), 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    let frame = 0
    let visible = true
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const draw = () => {
      const remaining = Math.max(0, target.current - Date.now())
      const turn = (remaining % 60000) / 60000
      const angle = turn * Math.PI * 2
      const x = 150 + 120 * Math.sin(angle)
      const y = 150 - 120 * Math.cos(angle)
      sector.current?.setAttribute('d', turn ? `M150 150 L150 30 A120 120 0 ${turn > .5 ? 1 : 0} 1 ${x} ${y} Z` : '')
      hand.current?.setAttribute('transform', `rotate(${turn * 360} 150 150)`)
      if (remaining > 0 && visible && !document.hidden && !motion.matches) frame = requestAnimationFrame(draw)
    }
    const resume = () => { cancelAnimationFrame(frame); frame = 0; if (visible && !document.hidden && !motion.matches) draw() }
    const observer = new IntersectionObserver(entries => { visible = entries[0].isIntersecting; resume() })
    if (root.current) observer.observe(root.current)
    document.addEventListener('visibilitychange', resume)
    motion.addEventListener('change', resume)
    draw()
    return () => { cancelAnimationFrame(frame); observer.disconnect(); document.removeEventListener('visibilitychange', resume); motion.removeEventListener('change', resume) }
  }, [])

  return <div ref={root} className="sg-clock-countdown">
    <p className="sg-clock-heading">Until our forever</p>
    <div className="sg-clock-face">
      <InvitationMedia className="sg-clock-art" src="/templates/secret-garden/assets/pearl-clock.webp" alt="" priority />
      <svg className="sg-clock-dial" viewBox="0 0 300 300" aria-hidden="true">
        <path ref={sector} className="sg-clock-sector" />
        <path ref={hand} className="sg-clock-hand" d="M150 83V30" />
      </svg>
      <div className="sg-clock-value">
        <span className="sg-clock-days">{values.days}</span>
        <span className="sg-clock-unit">{values.days === 1 ? 'Day' : 'Days'}</span>
      </div>
    </div>
    <p className="sg-clock-time" role="timer" aria-live="off">{values.hours} hours, {values.minutes} min and {values.seconds} sec</p>
  </div>
}

function compute(target: number) {
  const total = Math.max(0, Math.ceil((target - Date.now()) / 1000))
  return { days: Math.floor(total / 86400), hours: Math.floor(total / 3600) % 24, minutes: Math.floor(total / 60) % 60, seconds: total % 60 }
}
