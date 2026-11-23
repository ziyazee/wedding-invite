import { useEffect, useRef, useState } from 'react'
import type { RefObject } from 'react'

/** IntersectionObserver-based scroll reveal — adds .rh-visible to .rh-rv elements. */
export function useScrollReveal(root: RefObject<HTMLElement | null>, active: boolean) {
  useEffect(() => {
    if (!root.current || !active || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    root.current.classList.add('rh-motion-ready')
    const targets = [...root.current.querySelectorAll<HTMLElement>('.rh-rv')]
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('rh-visible'); observer.unobserve(entry.target) } })
    }, { threshold: 0.08 })
    targets.forEach(el => observer.observe(el))
    return () => { observer.disconnect(); root.current?.classList.remove('rh-motion-ready') }
  }, [root, active])
}

/** Envelope letter rise — translateY driven by scroll position through section. */
export function useEnvelopeRise(sectionRef: RefObject<HTMLElement | null>, active: boolean) {
  const raf = useRef(0)
  useEffect(() => {
    const section = sectionRef.current
    if (!section || !active) return
    const note = section.querySelector<HTMLElement>('.rh-note')
    if (!note) return
    const maxRise = -220
    const update = () => {
      const rect = section.getBoundingClientRect()
      const vh = window.innerHeight
      const progress = Math.max(0, Math.min(1, (vh - rect.top) / (vh + rect.height)))
      const rise = progress * maxRise
      const cut = Math.max(0, (1 - progress) * 100)
      note.style.setProperty('--rh-rise', `${rise}px`)
      note.style.setProperty('--rh-cut', `${cut}px`)
      raf.current = requestAnimationFrame(update)
    }
    raf.current = requestAnimationFrame(update)
    return () => cancelAnimationFrame(raf.current)
  }, [sectionRef, active])
}

/** Calendar flip — scroll through pages with 3D rotateX transforms. */
export function useCalendarFlip(sectionRef: RefObject<HTMLElement | null>, pageCount: number, active: boolean, onLanded?: () => void) {
  const raf = useRef(0)
  const landed = useRef(false)
  useEffect(() => {
    const section = sectionRef.current
    if (!section || !active || pageCount < 1) return
    landed.current = false
    const stage = section.querySelector<HTMLElement>('.rh-dstage')
    const desk = section.querySelector<HTMLElement>('.rh-desk')
    const pages = [...section.querySelectorAll<HTMLElement>('.rh-pg')]
    if (!stage || !desk || pages.length === 0) return
    const update = () => {
      const rect = section.getBoundingClientRect()
      const sectionH = rect.height
      const vh = window.innerHeight
      const scrolled = vh - rect.top
      const scrollRange = sectionH - vh
      const rawProgress = scrollRange > 0 ? Math.max(0, Math.min(1, scrolled / scrollRange)) : 0
      const totalPages = pages.length
      pages.forEach((page, index) => {
        const pageStart = index / totalPages
        const pageEnd = (index + 1) / totalPages
        const pageProgress = Math.max(0, Math.min(1, (rawProgress - pageStart) / (pageEnd - pageStart)))
        const angle = pageProgress * -180
        const shadow = Math.min(pageProgress, 1 - pageProgress) * 0.3
        page.style.transform = `rotateX(${angle}deg)`
        page.style.zIndex = String(totalPages - index)
        page.querySelector<HTMLElement>('.rh-pg-f')?.style.setProperty('--rh-sh', String(shadow))
      })
      const isLanded = rawProgress > 0.95
      if (isLanded && !landed.current) {
        landed.current = true
        desk.classList.add('rh-landed')
        stage.classList.add('rh-landed')
        onLanded?.()
      }
      if (!isLanded && landed.current) {
        landed.current = false
        desk.classList.remove('rh-landed')
        stage.classList.remove('rh-landed')
      }
      raf.current = requestAnimationFrame(update)
    }
    raf.current = requestAnimationFrame(update)
    return () => cancelAnimationFrame(raf.current)
  }, [sectionRef, pageCount, active, onLanded])
}

/** Timeline progress — fills the line and lights up items based on scroll. */
export function useTimelineProgress(timelineRef: RefObject<HTMLElement | null>, active: boolean) {
  const raf = useRef(0)
  useEffect(() => {
    const timeline = timelineRef.current
    if (!timeline || !active) return
    const line = timeline.querySelector<HTMLElement>('.rh-eve-line i')
    const items = [...timeline.querySelectorAll<HTMLElement>('.rh-eve li')]
    if (!line || items.length === 0) return
    const update = () => {
      const rect = timeline.getBoundingClientRect()
      const vh = window.innerHeight
      const progress = Math.max(0, Math.min(1, (vh * 0.65 - rect.top) / rect.height))
      line.style.transform = `scaleY(${progress})`
      items.forEach((item, index) => {
        const threshold = (index + 0.5) / items.length
        item.classList.toggle('rh-lit', progress >= threshold)
      })
      raf.current = requestAnimationFrame(update)
    }
    raf.current = requestAnimationFrame(update)
    return () => cancelAnimationFrame(raf.current)
  }, [timelineRef, active])
}

/** Countdown timer — returns days/hours/minutes until a target ISO date. */
export function useCountdown(targetISO: string) {
  const [state, setState] = useState({ days: 0, hours: 0, minutes: 0, past: false })
  useEffect(() => {
    const tick = () => {
      const diff = new Date(targetISO).getTime() - Date.now()
      if (diff <= 0) { setState({ days: 0, hours: 0, minutes: 0, past: true }); return }
      setState({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        past: false,
      })
    }
    tick()
    const id = setInterval(tick, 60000)
    return () => clearInterval(id)
  }, [targetISO])
  return state
}
