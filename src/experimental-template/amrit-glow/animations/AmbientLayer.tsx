import { useRef, useEffect, useMemo } from 'react'
import gsap from 'gsap'
import FloatingElement from './FloatingElement'
import type { MotionType } from './FloatingElement'

export interface ParticleConfig {
  src: string
  motionType: MotionType
  count: number
  sizeRange: [number, number]
  opacityRange: [number, number]
  /** Position zone: 'left-margin' | 'right-margin' | 'full-margin' | 'upper-field' | 'lower-field' */
  zone: 'left-margin' | 'right-margin' | 'full-margin' | 'upper-field' | 'lower-field'
}

interface Props {
  /** Particle configs for this section */
  particles: ParticleConfig[]
  /** Extra className for the container */
  className?: string
}

interface ParticleInstance {
  key: string
  src: string
  motionType: MotionType
  size: number
  left: string
  top: string
  opacityRange: [number, number]
  delay: number
}

/** Zone definitions as percentage ranges */
const ZONES: Record<string, { xMin: number; xMax: number; yMin: number; yMax: number }> = {
  'left-margin': { xMin: 0, xMax: 12, yMin: 10, yMax: 90 },
  'right-margin': { xMin: 88, xMax: 100, yMin: 10, yMax: 90 },
  'full-margin': { xMin: 0, xMax: 15, yMin: 0, yMax: 100 }, // alternates with 85-100
  'upper-field': { xMin: 10, xMax: 90, yMin: 0, yMax: 20 },
  'lower-field': { xMin: 10, xMax: 90, yMin: 80, yMax: 100 },
}

function getRandomPosition(zone: string): { left: string; top: string } {
  if (zone === 'full-margin') {
    // Randomly pick left or right margin
    const side = Math.random() > 0.5 ? 'left-margin' : 'right-margin'
    const z = ZONES[side]
    return {
      left: gsap.utils.random(z.xMin, z.xMax) + '%',
      top: gsap.utils.random(z.yMin, z.yMax) + '%',
    }
  }
  const z = ZONES[zone] || ZONES['full-margin']
  return {
    left: gsap.utils.random(z.xMin, z.xMax) + '%',
    top: gsap.utils.random(z.yMin, z.yMax) + '%',
  }
}

/**
 * AmbientLayer manages multiple FloatingElements for a section.
 * - Spawns N instances per element type
 * - Distributes across defined spawn zones
 * - IntersectionObserver to pause/resume off-screen (will-change management)
 * - Cleanup on unmount handled by useGSAP in children
 */
export default function AmbientLayer({ particles, className = '' }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)

  // Generate instances once on mount
  const instances = useMemo<ParticleInstance[]>(() => {
    const result: ParticleInstance[] = []
    let idx = 0

    for (const config of particles) {
      for (let i = 0; i < config.count; i++) {
        const pos = getRandomPosition(config.zone)
        result.push({
          key: `particle-${idx++}`,
          src: config.src,
          motionType: config.motionType,
          size: Math.round(gsap.utils.random(config.sizeRange[0], config.sizeRange[1])),
          left: pos.left,
          top: pos.top,
          opacityRange: config.opacityRange,
          delay: i * 0.8,
        })
      }
    }
    return result
  }, [particles])

  // IntersectionObserver to pause/resume animations when section is off-screen
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        const particleEls = container.querySelectorAll<HTMLElement>('.ag-particle')
        if (entry.isIntersecting) {
          particleEls.forEach((el) => {
            el.style.willChange = 'transform, opacity'
          })
          // Resume all GSAP tweens on particles in this layer
          gsap.globalTimeline.getChildren(false, true, true).forEach((tween) => {
            const targets = (tween as gsap.core.Tween).targets?.()
            if (targets && Array.from(particleEls).some((el) => targets.includes(el))) {
              (tween as gsap.core.Tween).resume()
            }
          })
        } else {
          particleEls.forEach((el) => {
            el.style.willChange = 'auto'
          })
        }
      },
      { rootMargin: '200px 0px 200px 0px', threshold: 0 },
    )

    observer.observe(container)
    return () => observer.disconnect()
  }, [])

  if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return null
  }

  return (
    <div ref={containerRef} className={`ag-ambient-layer ${className}`}>
      {instances.map((inst) => (
        <FloatingElement
          key={inst.key}
          src={inst.src}
          size={inst.size}
          left={inst.left}
          top={inst.top}
          motionType={inst.motionType}
          opacityRange={inst.opacityRange}
          delay={inst.delay}
        />
      ))}
    </div>
  )
}
