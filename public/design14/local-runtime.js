(() => {
  const root = document.querySelector('[data-framer-root]')

  function selectBreakpoint() {
    if (!root) return
    const width = window.innerWidth
    const variant = width >= 1440 ? 'framer-1cng0pt' : width >= 1201 ? 'framer-72rtr7' : width >= 810 ? 'framer-x93lnp' : 'framer-xjl96b'
    root.classList.remove('framer-1cng0pt', 'framer-72rtr7', 'framer-x93lnp', 'framer-xjl96b')
    root.classList.add(variant)
  }

  function reveal(element) {
    const transform = element.style.transform
    element.style.transition = 'opacity 900ms ease, transform 900ms cubic-bezier(.22,.61,.36,1)'
    requestAnimationFrame(() => {
      element.style.opacity = '1'
      if (transform.includes('translateY(40px)')) element.style.transform = transform.replace(' translateY(40px)', '').replace('translateY(40px)', 'translateY(0px)')
    })
  }

  function prepareReveals() {
    const elements = [...document.querySelectorAll('#main [style*="opacity:0"]')].filter(element => {
      const opacity = element.style.opacity
      return (opacity === '0' || opacity === '0.001') && element.dataset.framerName !== 'Insta Gradient BG'
    })
    if (!('IntersectionObserver' in window) || matchMedia('(prefers-reduced-motion: reduce)').matches) {
      elements.forEach(reveal)
      return
    }
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (!entry.isIntersecting) return
      reveal(entry.target)
      observer.unobserve(entry.target)
    }), { rootMargin: '0px 0px 10% 0px', threshold: 0.08 })
    elements.forEach(element => observer.observe(element))
  }

  function connectAudio() {
    const audio = document.querySelector('audio')
    const play = document.querySelector('button[aria-label="Play"]')
    if (!audio || !play) return
    play.addEventListener('click', () => {
      if (audio.paused) void audio.play().catch(() => {})
      else audio.pause()
      play.setAttribute('aria-label', audio.paused ? 'Play' : 'Pause')
    })
  }

  function createCloudLayer() {
    const sky = document.querySelector('[data-framer-name="PAGE 1"] [data-framer-name="SKY"]')
    if (!sky || sky.querySelector('.d14-local-cloud')) return
    const cloud = document.createElement('img')
    cloud.className = 'd14-local-cloud'
    cloud.src = './assets/UeasMBu07jHUk5ch5onj5OD9f4.webp'
    cloud.alt = ''
    cloud.setAttribute('aria-hidden', 'true')
    sky.appendChild(cloud)
  }

  function connectTempleParallax() {
    const temple = document.querySelector('[data-framer-name="PAGE 1"] [data-framer-name="TEMPLE"]')
    const firstPage = document.querySelector('[data-framer-name="PAGE 1"]')
    if (!temple || !firstPage || matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let scheduled = false
    const update = () => {
      const distance = Math.min(window.scrollY, firstPage.getBoundingClientRect().height)
      temple.style.setProperty('--d14-temple-shift', `${Math.round(distance * 0.28)}px`)
      scheduled = false
    }
    const schedule = () => {
      if (scheduled) return
      scheduled = true
      requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule, { passive: true })
  }

  function connectSecondGateParallax() {
    const gate = document.querySelector('[data-framer-name="GATE 2"]')
    const page = gate?.closest('[data-framer-name^="PAGE"]')
    if (!gate || !page || matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let scheduled = false
    const update = () => {
      const pageTop = window.scrollY + page.getBoundingClientRect().top
      const distance = Math.max(0, Math.min(window.scrollY - pageTop, page.getBoundingClientRect().height))
      gate.style.setProperty('--d14-gate-two-shift', `${Math.round(distance * 0.28)}px`)
      scheduled = false
    }
    const schedule = () => {
      if (scheduled) return
      scheduled = true
      requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule, { passive: true })
  }

  document.querySelector('#__framer-badge-container')?.remove()
  createCloudLayer()
  connectTempleParallax()
  connectSecondGateParallax()
  selectBreakpoint()
  prepareReveals()
  connectAudio()
  window.addEventListener('resize', selectBreakpoint, { passive: true })
})()
