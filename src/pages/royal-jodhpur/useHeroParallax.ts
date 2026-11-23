import { useEffect, useRef } from 'react'

const isTouch = typeof window !== 'undefined' && window.matchMedia('(pointer:coarse)').matches

function lerp(a: number, b: number, t: number) { return a + (b - a) * t }

export function useHeroParallax(
  heroWrapRef: React.RefObject<HTMLElement | null>,
  heroPinRef: React.RefObject<HTMLElement | null>,
  heroReady: boolean,
) {
  const refs = useRef({
    raw: 0, lerped: 0, mouseX: 0, mouseY: 0, raf: null as number | null,
    snFired: false, snTimer: null as ReturnType<typeof setTimeout> | null,
  })

  useEffect(() => {
    const wrap = heroWrapRef.current
    const pin = heroPinRef.current
    if (!wrap || !pin) return

    const palace = wrap.querySelector<HTMLElement>('.hl-palace')
    const moon = wrap.querySelector<HTMLElement>('.hero-moon')
    const copy = wrap.querySelector<HTMLElement>('.hero-copy')
    const nudge = wrap.querySelector<HTMLElement>('.scroll-nudge')
    const st = refs.current

    function getProgress() {
      const top = wrap!.getBoundingClientRect().top + window.scrollY
      const range = wrap!.offsetHeight - window.innerHeight
      return Math.min(1, Math.max(0, (window.scrollY - top) / range))
    }

    function drive() {
      st.lerped = lerp(st.lerped, st.raw, 0.06)
      const n = st.lerped
      const mx = isTouch ? 0 : st.mouseX
      const my = isTouch ? 0 : st.mouseY

      if (moon) moon.style.transform = `translateY(${n * -28 + my * -5}px) translateX(${mx * -3}px)`
      if (palace) {
        const s = 1 + n * 0.45
        const ry = mx * -14
        const rx = my * -9
        palace.style.transform = `perspective(1400px) rotateX(${rx}deg) rotateY(${ry}deg) translateX(calc(-50% + ${(ry * 0.5).toFixed(1)}px)) scale(${s})`
        palace.style.filter = `drop-shadow(0 ${(20 + n * 30).toFixed(0)}px ${(50 + n * 40).toFixed(0)}px rgba(0,0,0,${(0.28 + n * 0.22).toFixed(2)})) drop-shadow(0 4px 16px rgba(200,134,10,${(0.1 + n * 0.08).toFixed(2)}))`
      }
      if (copy) {
        const fadeStart = 0.55, fadeEnd = 0.88
        const fade = Math.max(0, Math.min(1, (n - fadeStart) / (fadeEnd - fadeStart)))
        copy.style.opacity = (1 - fade).toFixed(3)
        copy.style.transform = `translateY(${n * -32}px)`
        copy.style.filter = fade > 0 ? `blur(${(fade * 16).toFixed(1)}px)` : ''
        copy.style.letterSpacing = fade > 0 ? (fade * 0.1).toFixed(3) + 'em' : ''
      }
      if (nudge) nudge.style.opacity = String(Math.max(0, 1 - n / 0.18))

      if (window.scrollY < wrap!.offsetHeight) st.raf = requestAnimationFrame(drive)
      else st.raf = null
    }

    function onScroll() {
      st.raw = getProgress()
      if (!st.raf && window.scrollY < wrap!.offsetHeight) st.raf = requestAnimationFrame(drive)
      if (!st.snFired) { st.snFired = true; if (st.snTimer) clearTimeout(st.snTimer) }
    }

    function onMouseMove(e: MouseEvent) {
      st.mouseX = e.clientX / window.innerWidth - 0.5
      st.mouseY = e.clientY / window.innerHeight - 0.5
      if (!st.raf) st.raf = requestAnimationFrame(drive)
    }
    function onMouseLeave() {
      st.mouseX = 0; st.mouseY = 0
      if (!st.raf) st.raf = requestAnimationFrame(drive)
    }

    st.snTimer = setTimeout(() => {
      if (nudge && !st.snFired) {
        st.snFired = true
        nudge.style.animation = 'royal-snAttention 0.9s ease-in-out forwards'
        setTimeout(() => { if (nudge) nudge.style.animation = 'royal-snPulse 2.5s ease-in-out infinite' }, 900)
      }
    }, 4000)

    window.addEventListener('scroll', onScroll, { passive: true })
    if (!isTouch) {
      pin.addEventListener('mousemove', onMouseMove)
      pin.addEventListener('mouseleave', onMouseLeave)
    }

    return () => {
      window.removeEventListener('scroll', onScroll)
      if (!isTouch) {
        pin.removeEventListener('mousemove', onMouseMove)
        pin.removeEventListener('mouseleave', onMouseLeave)
      }
      if (st.raf) cancelAnimationFrame(st.raf)
      if (st.snTimer) clearTimeout(st.snTimer)
    }
  }, [heroWrapRef, heroPinRef, heroReady])
}
