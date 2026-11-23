import { useEffect, useRef } from 'react'
import type { RefObject } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const SPEED = 'lively'

const PRESETS: Record<string, { parallax: number; idle: number; dur: number }> = {
  calm:    { parallax: 0.8, idle: 1.0, dur: 6 },
  smooth:  { parallax: 1.2, idle: 1.8, dur: 5 },
  lively:  { parallax: 2.2, idle: 3.4, dur: 4 },
  intense: { parallax: 3.0, idle: 5.0, dur: 3.2 },
}

const MOBILE_SCALE = { parallax: 1.05, idle: 1.35 }
const TABLET_SCALE = { parallax: 0.95, idle: 1.1 }

const MOBILE_Q = '(max-width: 720px)'
const TABLET_Q = '(min-width: 721px) and (max-width: 1024px)'
const TABLET_PORTRAIT_Q = '(min-width: 721px) and (max-width: 1024px) and (orientation: portrait)'

const isMobile = () => window.matchMedia(MOBILE_Q).matches
const isTablet = () => window.matchMedia(TABLET_Q).matches
const motionScale = () =>
  isMobile() ? MOBILE_SCALE : isTablet() ? TABLET_SCALE : { parallax: 1, idle: 1 }

const cfg = PRESETS[SPEED] || PRESETS.smooth

function buildMotion(scroller: HTMLElement, reduceMotion: boolean) {
  ScrollTrigger.defaults({ scroller })

  const panels = Array.from(scroller.parentElement!.querySelectorAll<HTMLElement>('.panel'))

  panels.forEach(panel => {
    const layers = Array.from(panel.querySelectorAll<HTMLElement>('.layer'))
    const inner = panel.querySelector<HTMLElement>('.panel__inner')

    layers.forEach((layer, li) => {
      const depth = parseFloat(layer.dataset.depth || '0') || 0
      const isFigure = /\b(fig-|hands)/.test(layer.className)
      const isBranch = /\bbranch\b/.test(layer.className)
      const isToplights = /\btoplights\b/.test(layer.className)
      const topAnchored = isToplights || isBranch
      const isFloating = layer.classList.contains('hands')
      const isGroundedFigure = isFigure && !topAnchored && !isFloating

      const px = cfg.parallax * motionScale().parallax
      const mob = isMobile()

      const startY = ((isToplights || isGroundedFigure) && mob)
        ? 0
        : isBranch
          ? (-depth * px * (mob ? 0.4 : 0.35))
          : (-depth * px * 0.5)

      const endY = (isToplights && mob)
        ? (depth * px * 0.3)
        : (isGroundedFigure && mob)
          ? (depth * px * 0.35)
          : isBranch
            ? (depth * px * (mob ? 0.35 : 0.3))
            : (depth * px * 0.5)

      const dropIn = mob ? parseFloat(layer.dataset.mobileDropIn || '') : NaN
      const hasDropIn = Number.isFinite(dropIn)

      const travel = (mob && parseFloat(layer.dataset.mobileParallax || '')) || 1

      gsap.fromTo(
        layer,
        { yPercent: hasDropIn ? -dropIn : startY * travel },
        {
          yPercent: hasDropIn ? 0 : endY * travel,
          ease: 'none',
          scrollTrigger: {
            trigger: panel,
            start: 'top bottom',
            end: hasDropIn ? 'top -20%' : 'bottom top',
            scrub: 1,
          },
        }
      )

      if (!reduceMotion && depth > 0) {
        const floatScale = (mob && parseFloat(layer.dataset.mobileFloat || '')) || 1
        const amp = depth * cfg.idle * motionScale().idle * floatScale
        const dir = li % 2 ? -1 : 1
        const ySign = topAnchored ? 1 : -1

        if (isGroundedFigure) {
          gsap.set(layer, { transformOrigin: '50% 100%' })
        }

        gsap.to(layer, {
          x: isBranch ? 0 : (amp * dir * (mob ? 0.55 : 1)),
          y: isGroundedFigure ? 0
            : isBranch ? (ySign * amp * 0.35)
            : isFloating ? (ySign * amp * (mob ? 0.45 : 0.4))
            : (ySign * amp * (mob ? 1.0 : 0.55)),
          scale: 1 + depth * (mob ? 0.003 : 0.005),
          rotation: (isFigure || isBranch) ? 0 : depth * 0.05 * dir,
          duration: (isBranch ? (cfg.dur * 1.5) : cfg.dur) + li * 0.4,
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true,
        })

        if (topAnchored || /\bglow\b/.test(layer.className)) {
          const startTwinkle = () => {
            const rest = parseFloat(getComputedStyle(layer).opacity) || 1
            if (rest < 0.05) return
            gsap.fromTo(layer,
              { opacity: rest },
              {
                opacity: Math.max(0.12, rest - (topAnchored ? 0.3 : 0.2)),
                duration: (cfg.dur * 0.45) + li * 0.25,
                ease: 'sine.inOut',
                repeat: -1,
                yoyo: true,
                delay: li * 0.3,
                overwrite: false,
              })
          }
          if (layer.classList.contains('is-ready')) {
            startTwinkle()
          } else {
            const obs = new MutationObserver(() => {
              if (layer.classList.contains('is-ready')) {
                obs.disconnect()
                setTimeout(startTwinkle, 700)
              }
            })
            obs.observe(layer, { attributes: true, attributeFilter: ['class'] })
          }
        }
      }
    })

    if (inner) {
      gsap.from(inner, {
        autoAlpha: 0,
        y: reduceMotion ? 0 : 60,
        scale: reduceMotion ? 1 : 0.97,
        duration: reduceMotion ? 0.01 : 1.15,
        ease: 'power3.out',
        scrollTrigger: { trigger: panel, start: 'top 72%' },
      })

      if (!reduceMotion) {
        const bits = inner.querySelectorAll(
          '.eyebrow, .names, .scene-title, .date-big, .lede, .hashtag, .fn, .card, .know__row, .family'
        )
        if (bits.length > 1) {
          gsap.from(bits, {
            autoAlpha: 0,
            y: 26,
            duration: 0.8,
            ease: 'power2.out',
            stagger: 0.09,
            scrollTrigger: { trigger: panel, start: 'top 66%' },
          })
        }
      }
    }
  })

  ScrollTrigger.refresh()
}

function teardownMotion(container: HTMLElement) {
  ScrollTrigger.getAll().forEach(t => t.kill())
  container.querySelectorAll<HTMLElement>('.layer').forEach(l => {
    gsap.killTweensOf(l)
    gsap.set(l, { clearProps: 'transform' })
  })
  container.querySelectorAll<HTMLElement>('.panel__inner').forEach(el => {
    gsap.killTweensOf(el)
    gsap.set(el, { clearProps: 'transform,opacity,visibility' })
  })
}

export function useParallaxScenes(
  scrollerRef: RefObject<HTMLElement | null>,
  opened: boolean,
  reduceMotion: boolean
): void {
  const builtRef = useRef(false)

  useEffect(() => {
    const scroller = scrollerRef.current
    if (!scroller || !opened) return

    buildMotion(scroller, reduceMotion)
    builtRef.current = true

    const rebuildMotion = () => {
      if (!builtRef.current) return
      teardownMotion(scroller.parentElement!)
      buildMotion(scroller, reduceMotion)
    }

    const mediaQueries = [MOBILE_Q, TABLET_Q, TABLET_PORTRAIT_Q, '(orientation: portrait)'].map(q => {
      const mq = window.matchMedia(q)
      const handler = () => rebuildMotion()
      if (mq.addEventListener) mq.addEventListener('change', handler)
      else if ((mq as any).addListener) (mq as any).addListener(handler)
      return { mq, handler }
    })

    return () => {
      builtRef.current = false
      teardownMotion(scroller.parentElement!)
      mediaQueries.forEach(({ mq, handler }) => {
        if (mq.removeEventListener) mq.removeEventListener('change', handler)
        else if ((mq as any).removeListener) (mq as any).removeListener(handler)
      })
    }
  }, [scrollerRef, opened, reduceMotion])
}
