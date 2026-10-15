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

  document.querySelector('#__framer-badge-container')?.remove()
  selectBreakpoint()
  prepareReveals()
  connectAudio()
  window.addEventListener('resize', selectBreakpoint, { passive: true })
})()
