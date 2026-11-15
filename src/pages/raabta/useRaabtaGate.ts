import { useCallback, useEffect, useRef, useState } from 'react'

export function useRaabtaGate() {
  const [opened, setOpened] = useState(false)
  const gateRef = useRef<HTMLDivElement>(null)
  const prevOverflowRef = useRef<{ html: string; body: string } | null>(null)

  useEffect(() => {
    const html = document.documentElement
    if (!prevOverflowRef.current) {
      prevOverflowRef.current = { html: html.style.overflow, body: document.body.style.overflow }
    }
    html.style.overflow = 'hidden'
    document.body.style.overflow = 'hidden'
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual'
    window.scrollTo(0, 0)

    function pinToGate() {
      if (gateRef.current?.classList.contains('gate-revealed')) return
      window.scrollTo(0, 0)
      document.documentElement.scrollTop = 0
      document.body.scrollTop = 0
    }
    window.addEventListener('pageshow', pinToGate)
    window.addEventListener('load', pinToGate)
    return () => {
      window.removeEventListener('pageshow', pinToGate)
      window.removeEventListener('load', pinToGate)
      const prev = prevOverflowRef.current
      if (prev) {
        document.documentElement.style.overflow = prev.html
        document.body.style.overflow = prev.body
      }
    }
  }, [])

  const openGate = useCallback(() => {
    if (opened) return
    setOpened(true)
    const gate = gateRef.current
    if (gate) {
      gate.classList.add('gate-open', 'gate-revealed')
    }
    const prev = prevOverflowRef.current
    if (prev) {
      document.documentElement.style.overflow = prev.html
      document.body.style.overflow = prev.body
    }
  }, [opened])

  return { opened, openGate, gateRef }
}
