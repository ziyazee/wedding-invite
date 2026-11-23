import { useCallback, useEffect, useState } from 'react'
import type { RefObject } from 'react'

export function useCinematicGate(rootRef: RefObject<HTMLElement | null>): { opened: boolean; openGate: () => void } {
  const [opened, setOpened] = useState(false)

  // Add .is-gated on mount, remove on unmount
  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    root.classList.add('is-gated')
    return () => { root.classList.remove('is-gated') }
  }, [rootRef])

  const openGate = useCallback(() => {
    const root = rootRef.current
    if (!root) return
    const gate = root.querySelector<HTMLElement>('.gate')
    if (!gate || gate.classList.contains('is-open')) return

    gate.classList.add('is-open')
    root.classList.remove('is-gated')
    setOpened(true)

    // Let the reveal animations measure against the now-scrollable page
    setTimeout(() => {
      try {
        const ST = (window as any).ScrollTrigger
        if (ST && ST.refresh) ST.refresh()
      } catch {}
    }, 1550)

    setTimeout(() => { gate.remove() }, 1600)
  }, [rootRef])

  // Pin to start while gate is closed
  useEffect(() => {
    const root = rootRef.current
    if (!root || opened) return

    const scroller = root.querySelector<HTMLElement>('.scroller')
    const pinToStart = () => {
      if (opened) return
      window.scrollTo(0, 0)
      document.documentElement.scrollTop = 0
      document.body.scrollTop = 0
      if (scroller) scroller.scrollTop = 0
    }

    pinToStart()
    window.addEventListener('pageshow', pinToStart)
    window.addEventListener('load', pinToStart)
    return () => {
      window.removeEventListener('pageshow', pinToStart)
      window.removeEventListener('load', pinToStart)
    }
  }, [rootRef, opened])

  return { opened, openGate }
}
