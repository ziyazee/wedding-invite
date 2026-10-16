(() => {
  const revealStaticContent = () => {
    document.querySelectorAll('#main [style]').forEach((element) => {
      const style = element.style

      if (style.opacity === '0' || style.opacity === '0.001') {
        style.opacity = '1'
      }

      if (style.filter.includes('blur(')) {
        style.filter = 'none'
      }

      if (style.transform) {
        style.transform = style.transform.replace(
          /translateY\((?:10|12|20|40)px\)/g,
          'translateY(0px)',
        )
      }
    })
  }

  const connectAudioControl = () => {
    const audio = document.querySelector('audio')
    const button = audio?.parentElement?.querySelector('button')

    if (!(audio instanceof HTMLAudioElement) || !(button instanceof HTMLButtonElement)) {
      return
    }

    const updateButton = () => {
      button.setAttribute('aria-label', audio.paused ? 'Play music' : 'Pause music')
      button.setAttribute('title', audio.paused ? 'Play music' : 'Pause music')
    }

    button.addEventListener('click', async () => {
      if (audio.paused) {
        try {
          await audio.play()
        } catch {
          return
        }
      } else {
        audio.pause()
      }

      updateButton()
    })

    audio.addEventListener('play', updateButton)
    audio.addEventListener('pause', updateButton)
    updateButton()
  }

  const connectTempleParallax = () => {
    const page = document.querySelector('[data-d13-name="PAGE 1"]')
    const temple = page?.querySelector('[data-d13-name="TEMPLE"]')
    if (!(page instanceof HTMLElement) || !(temple instanceof HTMLElement)) return

    const motion = matchMedia('(prefers-reduced-motion: reduce)')
    let pageTop = 0
    let pageHeight = 0
    let dirty = true
    let frame = 0
    let previousTime = 0
    let current = NaN
    let written = ''
    temple.style.willChange = 'transform, translate'

    const update = time => {
      frame = 0
      if (document.hidden) return
      if (dirty) {
        const bounds = page.getBoundingClientRect()
        pageTop = bounds.top + window.scrollY
        pageHeight = bounds.height
        dirty = false
      }
      const distance = Math.max(0, Math.min(window.scrollY - pageTop, pageHeight))
      // A stronger downward offset than the opening scene's normal scroll motion.
      const target = motion.matches ? 0 : distance * 0.5
      const elapsed = previousTime ? Math.min(64, time - previousTime) : 16.67
      const atEdge = distance === 0 || distance === pageHeight
      if (!Number.isFinite(current) || motion.matches || atEdge) current = target
      else current += (target - current) * (1 - Math.exp(-elapsed / 55))
      if (Math.abs(target - current) < 0.05) current = target
      const value = `0 ${current.toFixed(2)}px`
      if (value !== written) {
        // Keep the original centering transform and responsive positioning intact.
        temple.style.translate = value
        written = value
      }
      if (current !== target) {
        previousTime = time
        frame = requestAnimationFrame(update)
      } else previousTime = 0
    }
    const schedule = () => {
      if (!frame && !document.hidden) frame = requestAnimationFrame(update)
    }
    const invalidate = () => { dirty = true; schedule() }
    const pause = () => {
      cancelAnimationFrame(frame)
      frame = 0
      previousTime = 0
    }
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', invalidate, { passive: true })
    window.addEventListener('pagehide', pause)
    window.addEventListener('pageshow', invalidate)
    document.addEventListener('visibilitychange', () => {
      pause()
      if (!document.hidden) invalidate()
    })
    page.addEventListener('load', invalidate, true)
    motion.addEventListener('change', invalidate)
    if (typeof ResizeObserver !== 'undefined') new ResizeObserver(invalidate).observe(page)
    document.fonts.ready.then(invalidate)
    schedule()
  }

  const initialize = () => {
    revealStaticContent()
    connectAudioControl()
    connectTempleParallax()
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize, { once: true })
  } else {
    initialize()
  }
})()
