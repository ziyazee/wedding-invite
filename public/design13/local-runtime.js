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

  const initialize = () => {
    revealStaticContent()
    connectAudioControl()
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize, { once: true })
  } else {
    initialize()
  }
})()
