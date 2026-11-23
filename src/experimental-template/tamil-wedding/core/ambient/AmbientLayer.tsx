/* Golden — a section's particle layer. Seeded placement, paused off-screen,
   removed entirely under reduced motion. */

import { useEffect, useMemo, useRef, useState } from 'react'
import type { ParticleSpec, ParticleZone } from '../contract'
import { colorVar, theme as defaultTheme } from '../theme'
import type { Theme } from '../theme'
import { createRng } from '../seed'
import FloatingElement from './FloatingElement'
import type { ParticleInstance } from './FloatingElement'

interface Props {
  particles: ParticleSpec[]
  /** Already mixed with the section id/index by the host. */
  seed: number
  reducedMotion: boolean
  theme?: Theme
  className?: string
}

const ZONES: Record<ParticleZone, { x: [number, number]; y: [number, number] }> = {
  full: { x: [2, 98], y: [2, 98] },
  left: { x: [0, 12], y: [4, 96] },
  right: { x: [88, 100], y: [4, 96] },
  margins: { x: [0, 12], y: [4, 96] }, // right side chosen per particle below
  upper: { x: [6, 94], y: [0, 24] },
  lower: { x: [6, 94], y: [76, 100] },
}

export function buildInstances(particles: ParticleSpec[], seed: number, theme: Theme): ParticleInstance[] {
  const rng = createRng(seed)
  const out: ParticleInstance[] = []
  let idx = 0
  for (const spec of particles) {
    for (let i = 0; i < spec.count; i++) {
      const zoneName = spec.zone ?? 'full'
      const zone = ZONES[zoneName]
      const onRight = zoneName === 'margins' && rng.next() > 0.5
      const x: [number, number] = onRight ? [88, 100] : zone.x
      const falling = spec.motion === 'fall' || spec.motion === 'rise'
      out.push({
        key: `p${idx++}`,
        sprite: spec.sprite,
        motion: spec.motion,
        size: Math.round(rng.range(spec.size[0], spec.size[1])),
        left: rng.range(x[0], x[1]),
        top: falling ? (spec.motion === 'fall' ? 0 : 100) : rng.range(zone.y[0], zone.y[1]),
        opacity: spec.opacity,
        color: colorVar(theme, spec.color),
        duration: falling ? rng.range(11, 19) : rng.range(3, 7),
        delay: rng.range(0, 3),
        phase: rng.next(),
        amplitude: rng.range(10, 28) * (rng.next() > 0.5 ? 1 : -1),
        sway: rng.range(14, 40) * (rng.next() > 0.5 ? 1 : -1),
        rotate: rng.range(-40, 40),
      })
    }
  }
  return out
}

export default function AmbientLayer({
  particles,
  seed,
  reducedMotion,
  theme = defaultTheme,
  className = '',
}: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(false)
  const instances = useMemo(() => buildInstances(particles, seed, theme), [particles, seed, theme])

  useEffect(() => {
    const el = ref.current
    if (!el || reducedMotion) return
    const io = new IntersectionObserver(([entry]) => setActive(entry.isIntersecting), {
      rootMargin: '160px 0px',
    })
    io.observe(el)
    return () => io.disconnect()
  }, [reducedMotion])

  if (reducedMotion || instances.length === 0) return null

  return (
    <div ref={ref} className={`tm-ambient ${className}`} aria-hidden="true">
      {instances.map((inst) => (
        <FloatingElement key={inst.key} instance={inst} active={active} />
      ))}
    </div>
  )
}
