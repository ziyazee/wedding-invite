import { useEffect, useRef } from 'react'

export function useCurtainReveal(rootRef: React.RefObject<HTMLElement | null>) {
  const state = useRef({ pullDone: false, curtainReady: false, revealed: false, lastP: 0 })

  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const section = root.querySelector<HTMLElement>('#story')
    const stage = root.querySelector<HTMLElement>('#stStage')
    const bride = root.querySelector<HTMLElement>('#stBride')
    const groom = root.querySelector<HTMLElement>('#stGroom')
    const curtL = root.querySelector<HTMLElement>('#stCurtL')
    const curtR = root.querySelector<HTMLElement>('#stCurtR')
    const reveal = root.querySelector<HTMLElement>('#stReveal')
    const petalsEl = root.querySelector<HTMLElement>('#stPetals')
    if (!section || !stage || !bride || !groom || !curtL || !curtR) return
    const st = state.current

    function spawnStoryPetal() {
      if (!petalsEl) return
      const sz = 5 + Math.random() * 10
      const left = 10 + Math.random() * 80
      const dur = 5000 + Math.random() * 4000
      const drift = (Math.random() - 0.5) * 90
      const colors = ['rgba(160,24,48,.25)', 'rgba(200,134,10,.20)', 'rgba(107,142,122,.22)', 'rgba(240,224,176,.35)']
      const color = colors[Math.floor(Math.random() * colors.length)]
      const el = document.createElement('div')
      el.style.cssText = `position:absolute;width:${sz}px;height:${sz}px;left:${left}%;top:-${sz}px;pointer-events:none;border-radius:50% 10% 50% 10%;background:${color};mix-blend-mode:multiply`
      petalsEl.appendChild(el)
      el.animate([
        { transform: 'translateY(0) translateX(0) rotate(0deg)', opacity: 0 },
        { transform: `translateY(4vh) translateX(${drift * 0.1}px) rotate(40deg)`, opacity: 0.9, offset: 0.05 },
        { transform: `translateY(60vh) translateX(${drift * 0.85}px) rotate(230deg)`, opacity: 0.4, offset: 0.85 },
        { transform: `translateY(90vh) translateX(${drift}px) rotate(360deg)`, opacity: 0 },
      ], { duration: dur, easing: 'linear', fill: 'forwards' }).onfinish = () => el.remove()
    }

    function triggerPull() {
      if (st.pullDone) return; st.pullDone = true
      bride.classList.add('st-pull'); groom.classList.add('st-pull')
      setTimeout(() => {
        bride.classList.remove('st-pull'); groom.classList.remove('st-pull')
        bride.classList.add('st-tension'); groom.classList.add('st-tension')
      }, 715)
      setTimeout(() => {
        bride.classList.remove('st-tension'); groom.classList.remove('st-tension')
        st.curtainReady = true; applyCurtain(getProgress())
      }, 1235)
    }

    function getProgress() {
      if (!st.curtainReady) return 0
      const r = section!.getBoundingClientRect()
      const start = window.innerHeight * 0.55
      const range = window.innerHeight * 0.91
      return Math.min(1, Math.max(0, (start - r.top) / range))
    }

    function applyCurtain(p: number) {
      if (Math.abs(p - st.lastP) < 0.002) return; st.lastP = p
      const eased = p < 1 ? 1 - Math.pow(1 - p, 3.2) : 1
      curtL.style.transform = `translateX(-${(eased * 100).toFixed(2)}%)`
      curtR.style.transform = `translateX(${(eased * 100).toFixed(2)}%)`
      curtL.style.filter = `drop-shadow(${(eased * 30).toFixed(1)}px 0 36px rgba(0,0,0,${(eased * 0.65).toFixed(2)}))`
      curtR.style.filter = `drop-shadow(-${(eased * 30).toFixed(1)}px 0 36px rgba(0,0,0,${(eased * 0.65).toFixed(2)}))`
      const push = eased * 28, scale = 1 - eased * 0.04
      bride.style.transform = `translateX(-${push.toFixed(1)}px) scale(${scale.toFixed(3)})`
      groom.style.transform = `translateX(${push.toFixed(1)}px) scale(${scale.toFixed(3)})`

      if (eased >= 0.7 && !st.revealed) {
        st.revealed = true
        reveal?.classList.add('revealed')
        let count = 0
        const iv = setInterval(() => { spawnStoryPetal(); if (++count >= 28) clearInterval(iv) }, 160)
      }
    }

    function onScroll() { applyCurtain(getProgress()) }
    window.addEventListener('scroll', onScroll, { passive: true })

    const pullIO = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && entries[0].intersectionRatio >= 0.22) {
        triggerPull(); pullIO.disconnect()
      }
    }, { threshold: [0.22] })
    pullIO.observe(section)

    let resizeTimer: ReturnType<typeof setTimeout>
    window.addEventListener('resize', () => { clearTimeout(resizeTimer); resizeTimer = setTimeout(() => applyCurtain(getProgress()), 150) })

    return () => {
      window.removeEventListener('scroll', onScroll)
      pullIO.disconnect()
      clearTimeout(resizeTimer)
    }
  }, [rootRef])
}
