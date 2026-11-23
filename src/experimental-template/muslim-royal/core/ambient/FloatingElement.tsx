/* Golden — one animated particle. All motion parameters arrive precomputed from the seeded
   AmbientLayer, so this file never rolls dice. Only transform + opacity are animated. */

import { useEffect, useRef } from 'react'
import { gsap, useGSAP } from '../gsap'
import type { MotionKind, SpriteKind } from '../contract'
import { Sprite } from './Sprites'

export interface ParticleInstance {
  key: string
  sprite: SpriteKind
  motion: MotionKind
  size: number
  /** Percent. */
  left: number
  top: number
  opacity: [number, number]
  color: string
  /** Seeded animation parameters. */
  duration: number
  delay: number
  /** 0–1 starting phase so particles are spread out on first paint. */
  phase: number
  amplitude: number
  sway: number
  rotate: number
}

interface Props {
  instance: ParticleInstance
  /** Driven by the layer's IntersectionObserver. Off-screen layers pause. */
  active: boolean
}

export default function FloatingElement({ instance: p, active }: Props) {
  const ref = useRef<HTMLSpanElement>(null)
  const tlRef = useRef<gsap.core.Timeline | null>(null)

  useGSAP(
    () => {
      const el = ref.current
      if (!el) return
      const parent = el.parentElement
      const lo = p.opacity[0]
      const hi = p.opacity[1]
      let tl: gsap.core.Timeline

      switch (p.motion) {
        case 'twinkle': {
          gsap.set(el, { opacity: lo, scale: 0.8 })
          tl = gsap.timeline({ repeat: -1, yoyo: true, defaults: { ease: 'sine.inOut' } })
          tl.to(el, { opacity: hi, scale: 1.1, rotation: p.rotate, duration: p.duration })
          break
        }
        case 'float': {
          gsap.set(el, { opacity: (lo + hi) / 2 })
          tl = gsap.timeline({ repeat: -1, yoyo: true, defaults: { ease: 'sine.inOut' } })
          tl.to(el, { y: -p.amplitude, x: p.sway, opacity: hi, duration: p.duration })
          break
        }
        case 'drift': {
          gsap.set(el, { opacity: hi })
          tl = gsap.timeline({ repeat: -1, yoyo: true, defaults: { ease: 'sine.inOut' } })
          tl.to(el, { x: p.sway, y: p.amplitude, rotation: p.rotate, opacity: lo, duration: p.duration })
          break
        }
        case 'fall':
        case 'rise': {
          const dir = p.motion === 'fall' ? 1 : -1
          const travel = () => (parent?.clientHeight ?? 600) + p.size * 2
          const startY = p.motion === 'fall' ? -p.size : p.size
          tl = gsap.timeline({ repeat: -1, repeatRefresh: true })
          tl.fromTo(el, { y: startY, opacity: 0 }, { y: () => startY + dir * travel(), duration: p.duration, ease: 'none' }, 0)
          tl.to(el, { opacity: hi, duration: p.duration * 0.12, ease: 'power1.out' }, 0)
          tl.to(el, { opacity: 0, duration: p.duration * 0.2, ease: 'power1.in' }, p.duration * 0.8)
          tl.to(el, { x: p.sway, rotation: p.rotate, duration: p.duration / 2, ease: 'sine.inOut', repeat: 1, yoyo: true }, 0)
          break
        }
      }

      tl.progress(p.phase)
      tl.timeScale(1)
      tlRef.current = tl
      return () => {
        tlRef.current = null
      }
    },
    { dependencies: [p], scope: ref },
  )

  useEffect(() => {
    const tl = tlRef.current
    if (tl) tl.paused(!active)
    if (ref.current) ref.current.style.willChange = active ? 'transform, opacity' : 'auto'
  }, [active])

  return (
    <span
      ref={ref}
      className="mr-particle"
      aria-hidden="true"
      style={{
        left: `${p.left}%`,
        top: `${p.top}%`,
        width: p.size,
        height: p.size,
        color: p.color,
        opacity: 0,
      }}
    >
      <Sprite kind={p.sprite} />
    </span>
  )
}
