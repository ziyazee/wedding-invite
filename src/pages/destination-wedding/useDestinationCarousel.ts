import { useState, useEffect, useCallback } from 'react'

export function useDestinationCarousel(length: number, interval = 4000) {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (length <= 1) return
    const id = setInterval(() => setIndex(i => (i + 1) % length), interval)
    return () => clearInterval(id)
  }, [length, interval])

  const prev = useCallback(() => setIndex(i => (i - 1 + length) % length), [length])
  const next = useCallback(() => setIndex(i => (i + 1) % length), [length])
  const goTo = useCallback((i: number) => setIndex(i), [])

  return { index, prev, next, goTo }
}
