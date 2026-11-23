import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'

/**
 * Motion type determines the animation pattern for a floating PNG element.
 * Matches the motion plan specifications exactly.
 */
export type MotionType = 'float' | 'shimmer-drift' | 'petal-fall' | 'leaf-fall'

export interface FloatingElementProps {
  /** Image source path */
  src: string
  /** Rendered size in px */
  size: number
  /** CSS left position (e.g. '12%') */
  left: string
  /** CSS top position (e.g. '20%') */
  top: string
  /** Motion type from the motion plan */
  motionType: MotionType
  /** Opacity range [min, max] */
  opacityRange: [number, number]
  /** Initial delay in seconds before animation starts */
  delay?: number
  /** Extra className */
  className?: string
}

/**
 * FloatingElement wraps one PNG with GSAP-driven ambient motion.
 * - Uses useGSAP for lifecycle management and auto-cleanup
 * - mix-blend-mode: screen applied via CSS class .ag-particle
 * - Respects prefers-reduced-motion (hidden via CSS)
 * - will-change managed by parent AmbientLayer via IntersectionObserver
 */
export default function FloatingElement({
  src,
  size,
  left,
  top,
  motionType,
  opacityRange,
  delay = 0,
  className = '',
}: FloatingElementProps) {
  const ref = useRef<HTMLImageElement>(null)

  useGSAP(() => {
    const el = ref.current
    if (!el) return
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    switch (motionType) {
      case 'float':
        createFloatAnimation(el, opacityRange, delay)
        break
      case 'shimmer-drift':
        createShimmerDrift(el, opacityRange, delay)
        break
      case 'petal-fall':
        createPetalFall(el, opacityRange, delay)
        break
      case 'leaf-fall':
        createLeafFall(el, opacityRange, delay)
        break
    }
  }, { scope: ref })

  return (
    <img
      ref={ref}
      src={src}
      alt=""
      role="presentation"
      className={`ag-particle ${className}`}
      style={{
        width: size,
        height: 'auto',
        left,
        top,
        opacity: 0,
      }}
      loading="lazy"
      decoding="async"
    />
  )
}

/** Diya float — gentle vertical bob in place */
function createFloatAnimation(
  el: HTMLElement,
  opacityRange: [number, number],
  delay: number,
) {
  const amplitude = gsap.utils.random(4, 8)
  const tiltDeg = gsap.utils.random(1, 3)

  gsap.set(el, { opacity: gsap.utils.random(opacityRange[0], opacityRange[1]) })

  gsap.to(el, {
    y: -amplitude,
    rotation: tiltDeg,
    duration: gsap.utils.random(6, 10),
    ease: 'sine.inOut',
    repeat: -1,
    yoyo: true,
    delay: delay + gsap.utils.random(0, 5),
  })
}

/** Sparkle shimmer + slow drift */
function createShimmerDrift(
  el: HTMLElement,
  opacityRange: [number, number],
  delay: number,
) {
  const shimmerMin = gsap.utils.random(opacityRange[0], opacityRange[0] + 0.05)
  const shimmerMax = gsap.utils.random(opacityRange[1] - 0.05, opacityRange[1])

  // Shimmer: opacity oscillation
  gsap.fromTo(el,
    { opacity: shimmerMin },
    {
      opacity: shimmerMax,
      duration: gsap.utils.random(3, 5),
      ease: 'sine.inOut',
      repeat: -1,
      yoyo: true,
      delay: delay + gsap.utils.random(0, 4),
    },
  )

  // Drift: slow positional wander with rotation
  const segDur = gsap.utils.random(12, 16) / 4
  const tl = gsap.timeline({
    repeat: -1,
    delay: delay + gsap.utils.random(0, 6),
    defaults: { ease: 'sine.inOut' },
  })

  tl.to(el, {
    x: `+=${gsap.utils.random(-30, 30)}`,
    y: `+=${gsap.utils.random(-25, 25)}`,
    rotation: gsap.utils.random(-12, 12),
    duration: segDur,
  })
  .to(el, {
    x: `+=${gsap.utils.random(-30, 30)}`,
    y: `+=${gsap.utils.random(-25, 25)}`,
    rotation: gsap.utils.random(-12, 12),
    duration: segDur,
  })
  .to(el, {
    x: `+=${gsap.utils.random(-30, 30)}`,
    y: `+=${gsap.utils.random(-25, 25)}`,
    rotation: gsap.utils.random(-12, 12),
    duration: segDur,
  })
  .to(el, {
    x: 0,
    y: 0,
    rotation: 0,
    duration: segDur,
  })
}

/** Marigold petal — fall with sway, fade-out, respawn */
function createPetalFall(
  el: HTMLElement,
  opacityRange: [number, number],
  delay: number,
) {
  const petalOpacity = gsap.utils.random(opacityRange[0], opacityRange[1])
  const fallDist = gsap.utils.random(300, 500)
  const fallDuration = gsap.utils.random(10, 16)
  const respawnDelay = gsap.utils.random(2, 6)

  function randomSpawnX() {
    return gsap.utils.random(5, 95) + '%'
  }

  function runCycle() {
    gsap.set(el, {
      x: 0,
      y: 0,
      rotation: 0,
      opacity: 0,
      left: randomSpawnX(),
      top: gsap.utils.random(0, 10) + '%',
    })

    const swayA = gsap.utils.random(-30, 30)
    const swayB = gsap.utils.random(-30, 30)
    const swayEnd = gsap.utils.random(-15, 15)
    const rotEnd = gsap.utils.random(-45, 45)
    const segDur = fallDuration / 6

    const tl = gsap.timeline({
      onComplete: () => {
        gsap.delayedCall(respawnDelay, runCycle)
      },
    })

    tl.to(el, { opacity: petalOpacity, duration: 0.5, ease: 'power1.in' })
      .to(el, {
        y: `+=${fallDist * 0.2}`,
        x: `+=${swayA}`,
        rotation: 12,
        duration: segDur,
        ease: 'none',
      })
      .to(el, {
        y: `+=${fallDist * 0.2}`,
        x: `+=${swayA * -0.6}`,
        rotation: -8,
        duration: segDur,
        ease: 'none',
      })
      .to(el, {
        y: `+=${fallDist * 0.2}`,
        x: `+=${swayB}`,
        rotation: 18,
        duration: segDur,
        ease: 'none',
      })
      .to(el, {
        y: `+=${fallDist * 0.2}`,
        x: `+=${swayB * -0.4}`,
        rotation: -5,
        duration: segDur,
        ease: 'none',
      })
      .to(el, {
        y: `+=${fallDist * 0.2}`,
        x: `+=${swayEnd}`,
        rotation: rotEnd,
        opacity: 0,
        duration: segDur,
        ease: 'none',
      })
  }

  gsap.delayedCall(delay + gsap.utils.random(0, fallDuration), runCycle)
}

/** Gold leaf — very slow fall with continuous rotation tumble */
function createLeafFall(
  el: HTMLElement,
  opacityRange: [number, number],
  delay: number,
) {
  const leafOpacity = gsap.utils.random(opacityRange[0], opacityRange[1])
  const fallDist = gsap.utils.random(200, 400)
  const fallDuration = gsap.utils.random(12, 18)
  const rotDirection = Math.random() > 0.5 ? 360 : -360
  const respawnDelay = gsap.utils.random(3, 8)

  function randomSpawnPos() {
    const zones = [
      { xMin: 0, xMax: 12 },
      { xMin: 88, xMax: 100 },
      { xMin: 10, xMax: 90 },
    ]
    const zone = zones[Math.floor(Math.random() * zones.length)]
    return gsap.utils.random(zone.xMin, zone.xMax) + '%'
  }

  function runCycle() {
    gsap.set(el, {
      x: 0,
      y: 0,
      rotation: 0,
      opacity: 0,
      left: randomSpawnPos(),
      top: gsap.utils.random(0, 15) + '%',
    })

    const lateralDx = gsap.utils.random(-15, 15)
    const lateralDx2 = gsap.utils.random(-15, 15)
    const segDur = fallDuration / 4

    const tl = gsap.timeline({
      onComplete: () => {
        gsap.delayedCall(respawnDelay, runCycle)
      },
    })

    tl.to(el, { opacity: leafOpacity, duration: 0.8, ease: 'power1.in' })
      .to(el, {
        y: `+=${fallDist * 0.25}`,
        x: `+=${lateralDx}`,
        rotation: rotDirection * 0.25,
        duration: segDur,
        ease: 'none',
      })
      .to(el, {
        y: `+=${fallDist * 0.25}`,
        x: `+=${lateralDx * -0.5}`,
        rotation: rotDirection * 0.5,
        duration: segDur,
        ease: 'none',
      })
      .to(el, {
        y: `+=${fallDist * 0.25}`,
        x: `+=${lateralDx2}`,
        rotation: rotDirection * 0.75,
        duration: segDur,
        ease: 'none',
      })
      .to(el, {
        y: `+=${fallDist * 0.25}`,
        x: 0,
        rotation: rotDirection,
        opacity: 0,
        duration: segDur,
        ease: 'none',
      })
  }

  gsap.delayedCall(delay + gsap.utils.random(0, fallDuration), runCycle)
}
