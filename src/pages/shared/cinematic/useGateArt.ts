import { useCallback, useEffect } from 'react'
import type { RefObject } from 'react'

const MOBILE_Q = '(max-width: 720px)'
const TABLET_PORTRAIT_Q = '(min-width: 721px) and (max-width: 1024px) and (orientation: portrait)'

const DEV_BUST = /^(localhost|127\.0\.0\.1)$/.test(location.hostname)
  ? '?v=' + Date.now()
  : ''

const wantsPortrait = () =>
  window.matchMedia(MOBILE_Q).matches || window.matchMedia(TABLET_PORTRAIT_Q).matches

export function useGateArt(rootRef: RefObject<HTMLElement | null>): () => void {
  const refresh = useCallback(() => {
    const root = rootRef.current
    if (!root) return
    const art = root.querySelector<HTMLElement>('.gate__art')
    if (!art) return
    const base = art.dataset.bg
    if (!base) return
    const want = (wantsPortrait() && art.dataset.bgP) ? art.dataset.bgP : base

    const paint = (url: string) => {
      const img = new Image()
      img.onload = () => {
        art.style.setProperty('--gate-img', `url("${url + DEV_BUST}")`)
        art.classList.add('is-ready')
      }
      img.onerror = () => {
        if (url !== base) paint(base)
      }
      img.src = url + DEV_BUST
    }
    paint(want)
  }, [rootRef])

  useEffect(() => {
    refresh()
  }, [refresh])

  return refresh
}
