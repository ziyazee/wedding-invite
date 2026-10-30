(() => {
  const revealStaticContent = () => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const textMotion = typeof IntersectionObserver === 'undefined' || reduced ? null : new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return
        const element = entry.target
        element.style.opacity = '1'
        element.style.translate = '0 0'
        observer.unobserve(element)
      })
    }, { threshold: 0.12 })
    document.querySelectorAll('#main [style]').forEach((element) => {
      const style = element.style
      const text = element.matches('[data-d13-component-type="RichTextContainer"]')

      if (style.opacity === '0' || style.opacity === '0.001') {
        if (text && textMotion) {
          style.translate = '0 25px'
          style.transition = 'opacity 800ms cubic-bezier(.22,.61,.36,1), translate 800ms cubic-bezier(.22,.61,.36,1)'
          textMotion.observe(element)
        } else {
          style.opacity = '1'
          if (text) style.translate = 'none'
        }
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

  const connectSectionParallax = (pageName, elementName, reachSectionBottom = false) => {
    const page = document.querySelector(`[data-d13-name="${pageName}"]`)
    const subject = page?.querySelector(`[data-d13-name="${elementName}"]`)
    if (!(page instanceof HTMLElement) || !(subject instanceof HTMLElement)) return

    const motion = matchMedia('(prefers-reduced-motion: reduce)')
    let pageTop = 0
    let pageHeight = 0
    let subjectStartBottom = 0
    let travelDistance = 0
    let dirty = true
    let frame = 0
    let previousTime = 0
    let current = NaN
    let written = ''
    subject.style.willChange = 'transform, translate'

    const updateSubjectPosition = () => {
      if (reachSectionBottom) {
        // Begin at the top of the section, with the couple fitting inside the viewport.
        subject.style.top = '0'
        subject.style.bottom = 'auto'
        subject.style.maxWidth = 'calc(80vh * 0.666667)'
        subject.style.transform = 'translateX(-50%)'
      }
    }
    updateSubjectPosition()

    if (reachSectionBottom) {
      const image = subject.querySelector('img')
      if (image instanceof HTMLImageElement) {
        if (!document.getElementById('d13-green-screen-filter')) {
          const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
          svg.id = 'd13-green-screen-filter'
          svg.setAttribute('aria-hidden', 'true')
          svg.style.position = 'absolute'
          svg.style.width = '0'
          svg.style.height = '0'
          // Preserve the source alpha so the key cannot make transparent areas black.
          svg.innerHTML = '<defs><filter id="d13-green-screen-key" x="0%" y="0%" width="100%" height="100%" color-interpolation-filters="sRGB"><feColorMatrix in="SourceGraphic" type="matrix" values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0.5 -1 0.5 0 1" result="keyed"/><feComposite in="keyed" in2="SourceGraphic" operator="in"/></filter></defs>'
          document.body.prepend(svg)
        }
        image.style.filter = 'url(#d13-green-screen-key)'
      }
    }

    const update = time => {
      frame = 0
      if (document.hidden) return
      if (dirty) {
        const bounds = page.getBoundingClientRect()
        pageTop = bounds.top + window.scrollY
        pageHeight = bounds.height
        if (reachSectionBottom) {
          const subjectBounds = subject.getBoundingClientRect()
          const existingOffset = Number.isFinite(current) ? current : 0
          // Measure the resting edge, excluding the current parallax translation.
          subjectStartBottom = subjectBounds.bottom + window.scrollY - existingOffset
          travelDistance = Math.max(0, pageTop + pageHeight - subjectStartBottom)
        }
        dirty = false
      }
      const parallaxStart = reachSectionBottom
        ? subjectStartBottom - window.innerHeight
        : pageTop
      const coupleSpeed = 0.5
      const parallaxRange = reachSectionBottom ? travelDistance / coupleSpeed : pageHeight
      const distance = Math.max(0, Math.min(window.scrollY - parallaxStart, parallaxRange))
      // Move at 50% of scroll speed after the trigger; stop at the section bottom.
      const target = motion.matches
        ? 0
        : reachSectionBottom
          ? Math.min(travelDistance, distance * coupleSpeed)
          : distance * 0.5
      const elapsed = previousTime ? Math.min(64, time - previousTime) : 16.67
      const atEdge = distance === 0 || distance === parallaxRange
      if (!Number.isFinite(current) || motion.matches || atEdge) current = target
      else current += (target - current) * (1 - Math.exp(-elapsed / 55))
      if (Math.abs(target - current) < 0.05) current = target
      const value = `0 ${current.toFixed(2)}px`
      if (value !== written) {
        // Apply vertical motion separately from horizontal centering.
        subject.style.translate = value
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
    const invalidate = () => { updateSubjectPosition(); dirty = true; schedule() }
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

  const replaceCelebrations = (original) => {
    if (!(original instanceof HTMLElement)) return
    const section = document.createElement('section')
    section.setAttribute('data-d13-name', 'PAGE 4')
    section.setAttribute('aria-label', 'Wedding celebrations')
    section.style.cssText = 'width:100%;flex:none;min-width:0;background:#f5e2bc;'

    const frame = document.createElement('iframe')
    frame.src = '/templates/a-timeless-union/celebrations'
    frame.title = 'Wedding celebrations — Engagement, Sangeeth, Marriage and Reception'
    frame.loading = 'lazy'
    // Reserve the card's natural proportions until the shared component reports
    // its exact height, including the event navigation.
    frame.style.cssText = 'display:block;width:100%;height:calc(100vw * 1635 / 962 + 64px);border:0;background:#f5e2bc;'
    section.append(frame)
    const mainFrame = original.parentElement
    original.replaceWith(section)
    if (mainFrame) {
      // The imported template used a fixed aspect ratio for the entire stack.
      // Let the replacement's natural height determine the document length.
      mainFrame.style.height = 'auto'
      mainFrame.style.aspectRatio = 'auto'
    }
  }

  const initialize = () => {
    const coupleScene = document.querySelector('.d13-6k3h5w')
    const celebrationsScene = document.querySelector('.d13-1q8leab')
    if (coupleScene && celebrationsScene && coupleScene.parentElement === celebrationsScene.parentElement) {
      celebrationsScene.before(coupleScene)
      coupleScene.setAttribute('data-d13-name', 'PAGE 3')
      celebrationsScene.setAttribute('data-d13-name', 'PAGE 4')
    }
    replaceCelebrations(celebrationsScene)
    document.querySelectorAll('[data-d13-name="PAGE 5"] [data-d13-name="GOLDEN FRAME PNG"], [data-d13-name="PAGE 5"] [data-d13-name="GOLDEN FRAME SKIDE"]')
      .forEach((element) => element.remove())
    const welcome = document.querySelector('[data-d13-name="PAGE 2"]')
    welcome?.querySelectorAll('[data-d13-name="INVITE TAG LINE"], [data-d13-name="INVITE"]')
      .forEach((element) => element.remove())
    // Close the space left by the removed invitation heading and tagline.
    const welcomePositions = [
      ['.d13-qq17fj, .d13-o31tru', '31%'],
      ['.d13-kjvwux', '41%'],
      ['.d13-f0n6ls', '46%'],
      ['.d13-wuej87', '52%'],
      ['.d13-1jawtcx, .d13-19me4mh', '60%'],
      ['.d13-1jsww7o', '67%'],
    ]
    welcomePositions.forEach(([selector, top]) => {
      welcome?.querySelectorAll(selector).forEach((element) => { element.style.top = top })
    })
    revealStaticContent()
    connectAudioControl()
    connectSectionParallax('PAGE 1', 'TEMPLE')
    connectSectionParallax('PAGE 3', 'COUPLE CUT OUT', true)
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize, { once: true })
  } else {
    initialize()
  }
})()
