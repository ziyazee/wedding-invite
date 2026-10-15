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

  function connectEventGallery() {
    const gallery = document.querySelector('.d14-event-gallery')
    const track = gallery?.querySelector('.d14-event-gallery-track')
    if (!track) return
    const slides = [...track.children]
    const buttons = [...gallery.querySelectorAll('[data-event-index]')]
    const motion = matchMedia('(prefers-reduced-motion: reduce)')
    let selected = 0
    let width = track.clientWidth
    const update = () => {
      if (!track.clientWidth) return
      selected = Math.max(0, Math.min(slides.length - 1, Math.round(track.scrollLeft / track.clientWidth)))
      buttons.forEach((button, index) => button.setAttribute('aria-pressed', String(index === selected)))
    }
    const goTo = (index, animate = true) => {
      selected = Math.max(0, Math.min(slides.length - 1, index))
      track.scrollTo({ left: selected * track.clientWidth, behavior: animate && !motion.matches ? 'smooth' : 'instant' })
    }
    buttons.forEach(button => button.addEventListener('click', () => goTo(Number(button.dataset.eventIndex))))
    track.addEventListener('scroll', update, { passive: true })
    track.addEventListener('keydown', event => {
      if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return
      event.preventDefault()
      goTo(event.key === 'Home' ? 0 : event.key === 'End' ? slides.length - 1 : selected + (event.key === 'ArrowRight' ? 1 : -1))
    })
    // Touch and trackpads use native scrolling; mouse users can also drag the cards.
    let drag = null
    track.querySelectorAll('img').forEach(image => { image.draggable = false })
    track.addEventListener('pointerdown', event => {
      if (event.pointerType !== 'mouse' || event.button !== 0) return
      drag = { id: event.pointerId, x: event.clientX, left: track.scrollLeft, active: false }
    })
    track.addEventListener('pointermove', event => {
      if (!drag || drag.id !== event.pointerId) return
      const distance = event.clientX - drag.x
      if (!drag.active && Math.abs(distance) < 6) return
      if (!drag.active) {
        drag.active = true
        track.classList.add('is-dragging')
        track.setPointerCapture(event.pointerId)
      }
      event.preventDefault()
      track.scrollLeft = drag.left - distance
    })
    const finishDrag = () => {
      if (!drag) return
      const active = drag.active
      const id = drag.id
      drag = null
      const nearest = Math.round(track.scrollLeft / track.clientWidth)
      track.classList.remove('is-dragging')
      if (track.hasPointerCapture(id)) track.releasePointerCapture(id)
      if (active) goTo(nearest)
    }
    track.addEventListener('pointerup', finishDrag)
    track.addEventListener('pointercancel', finishDrag)
    track.addEventListener('lostpointercapture', finishDrag)
    track.addEventListener('pointerleave', () => { if (drag && !drag.active) drag = null })
    const resize = () => {
      if (width === track.clientWidth) return
      width = track.clientWidth
      goTo(selected, false)
    }
    if ('ResizeObserver' in window) new ResizeObserver(resize).observe(track)
    else window.addEventListener('resize', resize, { passive: true })
    update()
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


  // Couple scene following the opening invitation pages.
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
  connectEventGallery()
})()
