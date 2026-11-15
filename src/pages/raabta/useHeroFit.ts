import { useEffect } from 'react'

export function useHeroFit(
  rowRef: React.RefObject<HTMLElement | null>,
  groomRef: React.RefObject<HTMLElement | null>,
  brideRef: React.RefObject<HTMLElement | null>,
  joinRef: React.RefObject<HTMLElement | null>,
  groomFirst: string,
  brideFirst: string
) {
  useEffect(() => {
    const row = rowRef.current
    const groomEl = groomRef.current
    const brideEl = brideRef.current
    const joinEl = joinRef.current
    if (!row || !groomEl || !brideEl) return

    const parts = [groomEl, joinEl, brideEl].filter(Boolean) as HTMLElement[]

    function fitText() {
      for (const el of parts) el.style.fontSize = ''

      const maxWidth = window.innerWidth * 0.9
      const natural = row.scrollWidth
      if (natural <= maxWidth) return

      const ratio = maxWidth / natural
      for (const el of parts) {
        const base = parseFloat(getComputedStyle(el).fontSize)
        el.style.fontSize = Math.max(base * ratio, 13) + 'px'
      }
    }

    fitText()
    window.addEventListener('resize', fitText, { passive: true } as AddEventListenerOptions)
    if (document.fonts?.ready) {
      document.fonts.ready.then(fitText).catch(() => {})
    }
    return () => window.removeEventListener('resize', fitText)
  }, [rowRef, groomRef, brideRef, joinRef, groomFirst, brideFirst])
}
