import { useCallback, useEffect, useRef, useState } from 'react'

export function usePageSwipe(
  totalPages: number,
  heroScrollUp: () => void,
  heroGone: boolean,
) {
  const [currentPage, setCurrentPage] = useState(-1)
  const pageRef = useRef(-1)
  const animatingRef = useRef(false)
  const touchStartY = useRef<number | null>(null)
  const lastWheelTime = useRef(0)
  const heroScrollUpRef = useRef(heroScrollUp)
  heroScrollUpRef.current = heroScrollUp

  const goToPage = useCallback((idx: number) => {
    if (idx < 0 || idx >= totalPages || animatingRef.current) return
    if (idx === pageRef.current) return
    animatingRef.current = true
    pageRef.current = idx
    setCurrentPage(idx)
    setTimeout(() => { animatingRef.current = false }, 700)
  }, [totalPages])

  const nextPage = useCallback(() => {
    goToPage(pageRef.current + 1)
  }, [goToPage])

  useEffect(() => {
    if (heroGone && pageRef.current === -1) {
      goToPage(0)
    }
  }, [heroGone, goToPage])

  useEffect(() => {
    function handleTouchStart(e: TouchEvent) {
      if ((e.target as Element)?.closest?.('[data-no-nav]')) return
      touchStartY.current = e.touches[0].clientY
    }

    function handleTouchMove(e: TouchEvent) {
      if ((e.target as Element)?.closest?.('[data-no-nav]')) return
      if (touchStartY.current === null) return
      const dy = touchStartY.current - e.touches[0].clientY
      if (Math.abs(dy) > 40) {
        e.preventDefault()
        if (!animatingRef.current) {
          if (pageRef.current < 0) {
            if (dy > 0) { touchStartY.current = null; heroScrollUpRef.current() }
          } else {
            if (dy > 0) goToPage(pageRef.current + 1)
            else goToPage(pageRef.current - 1)
            touchStartY.current = null
          }
        }
      }
    }

    function handleWheel(e: WheelEvent) {
      const now = Date.now()
      if (now - lastWheelTime.current < 700) return
      if (Math.abs(e.deltaY) < 30) return
      lastWheelTime.current = now
      if (pageRef.current < 0) {
        if (e.deltaY > 0) heroScrollUpRef.current()
      } else {
        if (e.deltaY > 0) goToPage(pageRef.current + 1)
        else goToPage(pageRef.current - 1)
      }
    }

    function handleKeydown(e: KeyboardEvent) {
      const isNext = ['ArrowDown', 'PageDown'].includes(e.key) || (e.key === ' ' && !e.shiftKey)
      const isPrev = ['ArrowUp', 'PageUp'].includes(e.key) || (e.key === ' ' && e.shiftKey)
      if (!isNext && !isPrev) return
      e.preventDefault()
      if (pageRef.current < 0) {
        if (isNext) heroScrollUpRef.current()
        return
      }
      if (isNext) goToPage(pageRef.current + 1)
      else goToPage(pageRef.current - 1)
    }

    document.addEventListener('touchstart', handleTouchStart, { passive: true })
    document.addEventListener('touchmove', handleTouchMove, { passive: false })
    document.addEventListener('wheel', handleWheel, { passive: false })
    document.addEventListener('keydown', handleKeydown)
    return () => {
      document.removeEventListener('touchstart', handleTouchStart)
      document.removeEventListener('touchmove', handleTouchMove)
      document.removeEventListener('wheel', handleWheel)
      document.removeEventListener('keydown', handleKeydown)
    }
  }, [goToPage])

  return { currentPage, goToPage, nextPage }
}
