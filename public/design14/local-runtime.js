(() => {
  const root = document.querySelector('[data-d14-root]')


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
      return (opacity === '0' || opacity === '0.001') && element.dataset.d14Name !== 'Insta Gradient BG'
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

  function connectCelebrationCards() {
    // The exported markup contains only the first slide; restore the original event set.
    const events = [
      ['MEHANDI', 'F2ADq8uKnJWgYF9TX50Ef0rL0U.webp'],
      ['HALDI', 'AiodKv9zJ0BlEmWhyX3vawMBKn4.webp'],
      ['SANGEET', 'zjqtpqy1i6UVkVV7j0yqT92xg.webp'],
      ['ENGAGEMENT', 'Dnhs3xqWl66pAa5cQMqyiJLm6xU.webp'],
      ['VARMALA', '89YF55J2ugFQJf4BGdUezGe9VYo.webp'],
      ['RECEPTION', '3jA5p30m5FlsyntlYoqOaNJk3WM.webp'],
    ]
    const motion = matchMedia('(prefers-reduced-motion: reduce)')
    const cards = [...document.querySelectorAll('.d14-events-section .ssr-variant > div')]
    const images = new Map()
    const preload = (src) => {
      if (!images.has(src)) {
        const image = new Image()
        image.src = src
        images.set(src, image.decode().catch(() => {}))
      }
      return images.get(src)
    }
    let selected = 0
    let revision = 0
    const views = cards.map(card => {
      const title = card.querySelector('h2')
      const image = card.querySelector('img')
      const dots = [...card.querySelectorAll('[aria-label^="Go to slide"]')]
      card.classList.add('d14-celebration-card')
      card.setAttribute('role', 'region')
      card.setAttribute('aria-roledescription', 'carousel')
      card.setAttribute('aria-label', 'Celebration events')
      title.parentElement.setAttribute('aria-live', 'polite')
      image.draggable = false
      return { card, title, image, dots, firstImage: image.getAttribute('src') }
    })
    const show = async (index, direction = 1) => {
      selected = (index + events.length) % events.length
      const current = selected
      const request = ++revision
      await Promise.all(views.map(view => preload(current === 0 ? view.firstImage : `/design14/assets/${events[current][1]}`)))
      if (request !== revision) return
      views.forEach(({ card, title, image, dots, firstImage }) => {
        title.textContent = events[current][0]
        image.src = current === 0 ? firstImage : `/design14/assets/${events[current][1]}`
        image.alt = `${events[current][0]} celebration`
        card.setAttribute('aria-label', `Celebration events, ${current + 1} of ${events.length}`)
        dots.forEach((dot, i) => {
          dot.setAttribute('aria-current', String(i === current))
          dot.style.backgroundColor = i === current ? '#fff' : 'rgba(0,0,0,0.2)'
          dot.style.transform = i === current ? 'scaleX(1.2)' : 'scaleX(1)'
        })
        if (!motion.matches && card.getBoundingClientRect().width > 0) {
          for (const element of [title.parentElement, image.parentElement]) {
            element.getAnimations().forEach(animation => animation.cancel())
            element.animate([
              { opacity: 0.5, transform: `translateX(${direction * 16}px)` },
              { opacity: 1, transform: 'translateX(0)' },
            ], { duration: 300, easing: 'cubic-bezier(.22,.61,.36,1)' })
          }
        }
      })
    }
    views.forEach(({ card, dots }) => {
      dots[0]?.setAttribute('aria-current', 'true')
      dots.forEach((dot, index) => dot.addEventListener('click', () => void show(index, index >= selected ? 1 : -1)))
      card.querySelector('[aria-label="Previous slide"]')?.addEventListener('click', () => void show(selected - 1, -1))
      card.querySelector('[aria-label="Next slide"]')?.addEventListener('click', () => void show(selected + 1))
      card.addEventListener('keydown', event => {
        if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return
        event.preventDefault()
        const index = event.key === 'Home' ? 0 : event.key === 'End' ? events.length - 1 : selected + (event.key === 'ArrowLeft' ? -1 : 1)
        void show(index, event.key === 'ArrowLeft' ? -1 : 1)
      })
      let gesture = null
      card.addEventListener('pointerdown', event => {
        if (!event.isPrimary || event.button !== 0 || event.target.closest('button')) return
        gesture = { id: event.pointerId, x: event.clientX, y: event.clientY }
        card.setPointerCapture(event.pointerId)
        card.classList.add('is-dragging')
      })
      card.addEventListener('pointerup', event => {
        if (!gesture || gesture.id !== event.pointerId) return
        const dx = event.clientX - gesture.x
        const dy = event.clientY - gesture.y
        gesture = null
        card.classList.remove('is-dragging')
        if (card.hasPointerCapture(event.pointerId)) card.releasePointerCapture(event.pointerId)
        if (Math.abs(dx) >= 35 && Math.abs(dx) > Math.abs(dy) * 1.2) {
          void show(selected + (dx < 0 ? 1 : -1), dx < 0 ? 1 : -1)
        }
      })
      const cancel = () => { gesture = null; card.classList.remove('is-dragging') }
      card.addEventListener('pointercancel', cancel)
      card.addEventListener('lostpointercapture', cancel)
      // Horizontal trackpad scrolling changes cards; vertical gestures still scroll the page.
      let wheelDistance = 0
      let lastWheel = 0
      let lastChange = 0
      card.addEventListener('wheel', event => {
        if (Math.abs(event.deltaX) <= Math.abs(event.deltaY)) return
        event.preventDefault()
        const now = performance.now()
        if (now - lastWheel > 180) wheelDistance = 0
        lastWheel = now
        if (now - lastChange < 450) return
        wheelDistance += event.deltaX * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? card.clientWidth : 1)
        if (Math.abs(wheelDistance) < 45) return
        const direction = wheelDistance > 0 ? 1 : -1
        wheelDistance = 0
        lastChange = now
        void show(selected + direction, direction)
      }, { passive: false })
    })
    // Load the other event images when this section approaches the viewport.
    const loadImages = () => events.slice(1).forEach(([, file]) => void preload(`/design14/assets/${file}`))
    if ('IntersectionObserver' in window && cards.length) {
      const observer = new IntersectionObserver(entries => {
        if (!entries.some(entry => entry.isIntersecting)) return
        loadImages()
        observer.disconnect()
      }, { rootMargin: '400px' })
      observer.observe(cards[0].closest('.d14-events-section'))
    } else if (cards.length) loadImages()
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
    const sky = document.querySelector('[data-d14-name="PAGE 1"] [data-d14-name="SKY"]')
    if (!sky || sky.querySelector('.d14-local-cloud')) return
    const cloud = document.createElement('img')
    cloud.className = 'd14-local-cloud'
    cloud.src = '/design14/assets/UeasMBu07jHUk5ch5onj5OD9f4.webp'
    cloud.alt = ''
    cloud.setAttribute('aria-hidden', 'true')
    sky.appendChild(cloud)
  }

  function connectTempleParallax() {
    const temple = document.querySelector('[data-d14-name="PAGE 1"] [data-d14-name="TEMPLE"]')
    const firstPage = document.querySelector('[data-d14-name="PAGE 1"]')
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


  // This scene is fourth in the invitation, following the standalone events card.
  function connectCoupleScene() {
    const scene = document.querySelector('[data-d14-name="PAGE 3"]')
    const couple = scene?.querySelector('[data-d14-name="COUPLE"]')
    const frame = scene?.querySelector('[data-d14-name="GATE 2"]')
    if (!scene || !couple || !frame) return

    const motion = matchMedia('(prefers-reduced-motion: reduce)')
    const crop = document.createElement('div')
    crop.className = 'd14-couple-window'
    couple.before(crop)
    crop.appendChild(couple)

    let referenceOffset = 0
    let scheduled = false
    const update = () => {
      scheduled = false
      const bounds = scene.getBoundingClientRect()
      const progress = motion.matches ? 0 : Math.max(-innerHeight, Math.min(-bounds.top, bounds.height))
      // Compensate for 38% of scrolling: the couple travels at 62% of the scenery's speed.
      const shift = Math.max(0, referenceOffset + progress) * 0.38
      couple.style.setProperty('--d14-couple-shift', `${shift.toFixed(2)}px`)
    }
    const schedule = () => {
      if (scheduled) return
      scheduled = true
      requestAnimationFrame(update)
    }
    const measure = () => {
      // Use the original artwork pages as the anchor, excluding the added events section.
      referenceOffset = 0
      for (const sibling of scene.parentElement.children) {
        if (sibling === scene) break
        if (sibling.getAttribute('data-d14-name')?.startsWith('PAGE ')) {
          referenceOffset += sibling.getBoundingClientRect().height
        }
      }
      // The gold frame's inner bottom edge is at 93.6% of its artwork height.
      const innerBottom = frame.offsetTop + frame.offsetHeight * 0.936
      const cropBottom = Math.max(0, scene.clientHeight - innerBottom)
      crop.style.setProperty('--d14-couple-crop-bottom', `${cropBottom.toFixed(2)}px`)
      schedule()
    }
    measure()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', measure, { passive: true })
    motion.addEventListener('change', measure)
    if ('ResizeObserver' in window) {
      const observer = new ResizeObserver(measure)
      observer.observe(scene)
      observer.observe(frame)
      observer.observe(scene.parentElement)
    }
  }

  document.querySelector('#__d14-badge-container')?.remove()
  createCloudLayer()
  connectTempleParallax()
  connectCoupleScene()
  prepareReveals()
  connectAudio()
  connectCelebrationCards()
})()
