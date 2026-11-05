// Only wait for artwork in the opening viewport. Music and below-fold media
// must never delay the invitation's tap-to-open screen.
export async function waitForInvitationMedia(root: HTMLElement, signal?: AbortSignal): Promise<void> {
  if (signal?.aborted) return
  const controller = new AbortController()
  const cancel = () => controller.abort()
  signal?.addEventListener('abort', cancel, { once: true })
  const timeout = setTimeout(cancel, 12000)
  const stopped = new Promise<void>(resolve => controller.signal.addEventListener('abort', () => resolve(), { once: true }))
  try {
    await Promise.race([collectMedia(root, controller.signal, 0), stopped])
  } finally {
    clearTimeout(timeout)
    signal?.removeEventListener('abort', cancel)
    controller.abort()
  }
}

function waitForEvent(element: Element, type: string, signal: AbortSignal): Promise<void> {
  return new Promise(resolve => {
    const finish = () => {
      element.removeEventListener(type, finish)
      element.removeEventListener('error', finish)
      signal.removeEventListener('abort', finish)
      resolve()
    }
    if (signal.aborted) { finish(); return }
    element.addEventListener(type, finish, { once: true })
    element.addEventListener('error', finish, { once: true })
    signal.addEventListener('abort', finish, { once: true })
  })
}

async function waitForImage(image: HTMLImageElement, signal: AbortSignal) {
  if (!image.complete) await waitForEvent(image, 'load', signal)
  if (!signal.aborted && image.naturalWidth) await image.decode().catch(() => {})
}

async function waitForFrame(frame: HTMLIFrameElement, signal: AbortSignal, depth: number) {
  try {
    await new Promise<void>(resolve => {
      const finish = () => {
        clearInterval(timer)
        signal.removeEventListener('abort', finish)
        resolve()
      }
      const check = () => {
        const doc = frame.contentDocument
        const hasSource = !!(frame.srcdoc || frame.getAttribute('src'))
        if (signal.aborted || (doc?.body && doc.readyState !== 'loading' && !(hasSource && doc.URL === 'about:blank'))) finish()
      }
      const timer = setInterval(check, 50)
      signal.addEventListener('abort', finish, { once: true })
      check()
    })
    if (!signal.aborted && frame.contentDocument?.body && depth < 3) {
      await collectMedia(frame.contentDocument.body, signal, depth + 1)
    }
  } catch {
    // Cross-origin embeds cannot expose their artwork to the parent page.
  }
}

async function collectMedia(root: HTMLElement, signal: AbortSignal, depth: number): Promise<void> {
  if (signal.aborted) return
  const doc = root.ownerDocument
  const win = doc.defaultView
  if (!win) return
  const cover = root.querySelector<HTMLImageElement>('#opening > img')
  const opening = cover?.parentElement
  if (cover && opening && !opening.hidden && win.getComputedStyle(opening).display !== 'none' && win.getComputedStyle(cover).opacity !== '0') {
    await Promise.all([waitForImage(cover, signal), doc.fonts.ready])
    return
  }
  const pending: Promise<unknown>[] = []
  const backgrounds = new Set<string>()
  for (const element of [root, ...Array.from(root.querySelectorAll<HTMLElement>('*'))]) {
    const rect = element.getBoundingClientRect()
    if (!rect.width || !rect.height || rect.bottom <= 0 || rect.right <= 0 || rect.top >= win.innerHeight || rect.left >= win.innerWidth) continue
    const style = win.getComputedStyle(element)
    if (style.display === 'none' || style.visibility === 'hidden') continue
    if (element.tagName === 'IFRAME') {
      pending.push(waitForFrame(element as HTMLIFrameElement, signal, depth))
      continue
    }
    if (element.tagName === 'IMG') pending.push(waitForImage(element as HTMLImageElement, signal))
    if (element.tagName === 'VIDEO') {
      const video = element as HTMLVideoElement
      if (video.poster) backgrounds.add(video.poster)
      else if (video.readyState < 2 && video.preload !== 'none' && (video.autoplay || video.preload === 'auto')) {
        pending.push(waitForEvent(video, 'loadeddata', signal))
      }
    }
    for (const background of [style.backgroundImage, win.getComputedStyle(element, '::before').backgroundImage, win.getComputedStyle(element, '::after').backgroundImage]) {
      for (const match of background.matchAll(/url\(["']?([^"')]+)["']?\)/g)) backgrounds.add(match[1])
    }
  }
  for (const source of backgrounds) {
    const image = doc.createElement('img')
    image.src = source
    pending.push(waitForImage(image, signal))
  }
  pending.push(doc.fonts.ready)
  await Promise.all(pending)
}
