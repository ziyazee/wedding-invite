import { useEffect } from 'react'
import type { RefObject } from 'react'

const MOBILE_Q = '(max-width: 720px)'
const TABLET_PORTRAIT_Q = '(min-width: 721px) and (max-width: 1024px) and (orientation: portrait)'
const TABLET_Q = '(min-width: 721px) and (max-width: 1024px)'

const wantsPortrait = () =>
  window.matchMedia(MOBILE_Q).matches || window.matchMedia(TABLET_PORTRAIT_Q).matches

const DEV_BUST = /^(localhost|127\.0\.0\.1)$/.test(location.hostname)
  ? '?v=' + Date.now()
  : ''

function applyImage(layer: HTMLElement, url: string) {
  url += DEV_BUST
  const img = new Image()
  img.onload = () => {
    layer.style.backgroundImage = `url("${url}")`
    layer.classList.add('is-ready')
  }
  img.onerror = () => {
    layer.classList.add('is-ready', 'is-missing')
  }
  img.src = url
}

function loadLayer(layer: HTMLElement) {
  if (layer.dataset.loaded === '1') return
  layer.dataset.loaded = '1'

  if (layer.classList.contains('bg')) {
    const base = layer.dataset.bg
    if (!base) return
    const portrait = wantsPortrait()
    const url = (portrait && layer.dataset.bgP) ? layer.dataset.bgP : base

    if (portrait) {
      const probe = new Image()
      probe.onload = () => applyImage(layer, url!)
      probe.onerror = () => applyImage(layer, base)
      probe.src = url! + DEV_BUST
    } else {
      applyImage(layer, base)
    }
    layer.dataset.currentSet = portrait ? 'portrait' : 'landscape'
    return
  }

  const src = layer.dataset.src
  if (src) applyImage(layer, src)
}

export function useLayerLoading(containerRef: RefObject<HTMLElement | null>, refreshGateArt?: () => void): void {
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const scroller = container.querySelector<HTMLElement>('.scroller')
    const panels = Array.from(container.querySelectorAll<HTMLElement>('.panel'))

    // Scene 1 is already on screen behind the gate — load immediately
    container.querySelectorAll<HTMLElement>('.panel[data-scene="1"] .layer').forEach(loadLayer)

    let io: IntersectionObserver | null = null
    if (window.IntersectionObserver) {
      io = new IntersectionObserver((entries, obs) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          ;(entry.target as HTMLElement).querySelectorAll<HTMLElement>('.layer').forEach(loadLayer)
          obs.unobserve(entry.target)
        }
      }, { root: scroller, rootMargin: '100% 0px' })
      panels.forEach(panel => io!.observe(panel))
    } else {
      container.querySelectorAll<HTMLElement>('.layer').forEach(loadLayer)
    }

    const onBreakpoint = () => {
      const want = wantsPortrait() ? 'portrait' : 'landscape'
      container.querySelectorAll<HTMLElement>('.layer.bg').forEach(layer => {
        if (layer.dataset.loaded !== '1') return
        if (layer.dataset.currentSet === want) return
        layer.dataset.loaded = '0'
        loadLayer(layer)
      })
      if (refreshGateArt) refreshGateArt()
    }

    const mediaQueries = [MOBILE_Q, TABLET_Q, TABLET_PORTRAIT_Q, '(orientation: portrait)'].map(q => {
      const mq = window.matchMedia(q)
      const handler = () => onBreakpoint()
      if (mq.addEventListener) mq.addEventListener('change', handler)
      else if ((mq as any).addListener) (mq as any).addListener(handler)
      return { mq, handler }
    })

    return () => {
      if (io) io.disconnect()
      mediaQueries.forEach(({ mq, handler }) => {
        if (mq.removeEventListener) mq.removeEventListener('change', handler)
        else if ((mq as any).removeListener) (mq as any).removeListener(handler)
      })
    }
  }, [containerRef, refreshGateArt])
}
