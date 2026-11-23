/* Golden — shared motion helpers. Reveals are opacity/blur/scale/clip, never translateY
   (translateY reveals fight the text editor's drag handles). */

import { gsap, ScrollTrigger } from './gsap'

export const EASE = {
  out: 'power3.out',
  expo: 'expo.out',
  inOut: 'power2.inOut',
} as const

type Targets = gsap.TweenTarget

interface RevealOpts {
  trigger: Element | string | null
  start?: string
  delay?: number
  stagger?: number
  duration?: number
  /** Extra from-vars, merged over the defaults. */
  from?: gsap.TweenVars
}

/** Soft focus-pull reveal tied to scroll entry. Call inside useGSAP. */
export function reveal(targets: Targets, opts: RevealOpts): gsap.core.Tween {
  const { trigger, start = 'top 84%', delay = 0, stagger = 0.1, duration = 1, from } = opts
  return gsap.from(targets, {
    opacity: 0,
    scale: 0.97,
    filter: 'blur(8px)',
    duration,
    delay,
    stagger,
    ease: EASE.out,
    clearProps: 'filter,scale',
    ...from,
    scrollTrigger: trigger ? { trigger, start, once: true } : undefined,
  })
}

/** Stroke draw-on for SVG shapes carrying pathLength="1" and the .mr-draw class. */
export function drawOn(targets: Targets, opts: Omit<RevealOpts, 'from'> & { duration?: number }): gsap.core.Tween {
  const { trigger, start = 'top 88%', delay = 0, stagger = 0.15, duration = 1.6 } = opts
  return gsap.from(targets, {
    strokeDashoffset: 1,
    duration,
    delay,
    stagger,
    ease: 'power2.inOut',
    scrollTrigger: trigger ? { trigger, start, once: true } : undefined,
  })
}

export function refreshScroll(): void {
  ScrollTrigger.refresh()
}
