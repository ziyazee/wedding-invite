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
      return (opacity === '0' || opacity === '0.001') && element.dataset.d14Name !== 'Insta Gradient BG' && !element.classList.contains('d14-entry-name')
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
    // Advance only while the invitation is open and the carousel is visible.
    const interval = 2000
    let autoTimer = null
    let visible = !('IntersectionObserver' in window)
    let hovering = false
    const pointers = new Set()
    const stopAutoScroll = () => {
      window.clearTimeout(autoTimer)
      autoTimer = null
    }
    const scheduleAutoScroll = () => {
      stopAutoScroll()
      if (slides.length < 2 || !visible || document.hidden || motion.matches || hovering || pointers.size ||
          !document.documentElement.classList.contains('d14-started') || gallery.querySelector(':focus-visible')) return
      autoTimer = window.setTimeout(() => {
        const next = (selected + 1) % slides.length
        // Reset at the end without sweeping back through all the previous cards.
        goTo(next, next !== 0)
        scheduleAutoScroll()
      }, interval)
    }
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(entries => {
        visible = entries[0].isIntersecting && entries[0].intersectionRatio >= 0.15
        scheduleAutoScroll()
      }, { threshold: [0, 0.15] })
      observer.observe(track)
    }
    gallery.addEventListener('pointerenter', event => {
      if (event.pointerType !== 'mouse') return
      hovering = true
      stopAutoScroll()
    })
    gallery.addEventListener('pointerleave', event => {
      if (event.pointerType !== 'mouse') return
      hovering = false
      scheduleAutoScroll()
    })
    gallery.addEventListener('pointerdown', event => {
      pointers.add(event.pointerId)
      stopAutoScroll()
    }, { passive: true })
    const releasePointer = event => {
      if (!pointers.delete(event.pointerId)) return
      scheduleAutoScroll()
    }
    window.addEventListener('pointerup', releasePointer, { passive: true })
    window.addEventListener('pointercancel', releasePointer, { passive: true })
    track.addEventListener('scroll', scheduleAutoScroll, { passive: true })
    track.addEventListener('wheel', scheduleAutoScroll, { passive: true })
    gallery.addEventListener('click', scheduleAutoScroll)
    gallery.addEventListener('focusin', scheduleAutoScroll)
    gallery.addEventListener('focusout', () => window.setTimeout(scheduleAutoScroll, 0))
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) pointers.clear()
      scheduleAutoScroll()
    })
    document.addEventListener('d14:opened', scheduleAutoScroll)
    motion.addEventListener('change', scheduleAutoScroll)
    window.addEventListener('pagehide', stopAutoScroll)
    window.addEventListener('pageshow', scheduleAutoScroll)
    scheduleAutoScroll()
  }

  function connectInvitationEntry() {
    const audio = document.querySelector('#d14-background-music')
    const entry = document.querySelector('.d14-entry')
    const play = entry?.querySelector('button')
    const main = document.querySelector('#main')
    if (!audio || !play || !main) return
    let starting = false
    let started = false
    const openInvitation = () => {
      if (started) return
      started = true
      // Discard the exported entrance animations; the names now fade in on this tap.
      document.querySelectorAll('.d14-entry-name').forEach(element => {
        element.getAnimations().forEach(animation => animation.cancel())
      })
      document.documentElement.classList.add('d14-started')
      document.documentElement.classList.remove('d14-awaiting-play')
      main.inert = false
      document.dispatchEvent(new Event('d14:opened'))
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
      entry.classList.add('is-opening')
      prepareReveals()
      // Move focus off the disappearing control without moving the page.
      main.setAttribute('tabindex', '-1')
      main.focus({ preventScroll: true })
      const removeEntry = () => entry.remove()
      entry.addEventListener('transitionend', event => {
        if (event.target === entry && event.propertyName === 'opacity') removeEntry()
      })
      window.setTimeout(removeEntry, 600)
    }
    play.addEventListener('click', async () => {
      if (starting || started) return
      starting = true
      play.disabled = true
      try {
        // Call play inside the click handler so mobile browsers allow audible playback.
        audio.muted = false
        await audio.play()
        openInvitation()
      } catch {
        // Leave the single control available if playback needs to be retried.
        starting = false
        play.disabled = false
        play.setAttribute('aria-label', 'Retry music and open invitation')
      }
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
  connectInvitationEntry()
  connectEventGallery()
})()
