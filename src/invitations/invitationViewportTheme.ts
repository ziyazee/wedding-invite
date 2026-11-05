export type InvitationViewportTheme = {
  backgroundColor: string
  routes: readonly string[]
  artwork?: { src: string; opacity?: number }
}

// Edit a template's backgroundColor here to change its entire surround and
// browser tint. Artwork is optional; the shared 9:16 layout needs no changes.
export const INVITATION_VIEWPORT_THEMES: Readonly<Record<number, InvitationViewportTheme>> = {
  1: { backgroundColor: '#D6C5AC', routes: ['/royal-grace'] },
  2: { backgroundColor: '#ECE8D9', routes: ['/majestic'] },
  3: { backgroundColor: '#F8F2E9', routes: ['/a-timeless-union', '/arjunbhavana'] },
  4: { backgroundColor: '#D19B72', routes: ['/mandap-at-dusk'] },
  5: { backgroundColor: '#EFE8DA', routes: ['/secret-garden'] },
  6: { backgroundColor: '#F5F0E8', routes: ['/embroidered-garden'] },
  7: {
    backgroundColor: '#F8F1E8', routes: ['/bloom'],
    artwork: { src: '/templates/bloom/assets/intro-video-2-poster.jpg', opacity: .1 },
  },
  8: { backgroundColor: '#FBF5ED', routes: ['/the-artful-love-story'] },
  9: { backgroundColor: '#31090E', routes: ['/maroon-letter'] },
  10: { backgroundColor: '#0F1E16', routes: ['/emerald-parchment'] },
  11: { backgroundColor: '#0D1B3E', routes: ['/royal-jodhpur'] },
  12: { backgroundColor: '#1A3A2A', routes: ['/destination-wedding'] },
  13: { backgroundColor: '#1B2838', routes: ['/raabta'] },
  14: { backgroundColor: '#0E1F1D', routes: ['/qubool'] },
  15: { backgroundColor: '#1A0A0A', routes: ['/mangal'] },
  16: { backgroundColor: '#1A0510', routes: ['/viah'] },
  17: { backgroundColor: '#101A30', routes: ['/tajmahal'] },
}

const defaultTheme: InvitationViewportTheme = { backgroundColor: '#F7F4EE', routes: [] }

export function invitationTemplateFromPath(pathname: string): number | undefined {
  const path = pathname.replace(/\/+$/, '') || '/'
  const entry = Object.entries(INVITATION_VIEWPORT_THEMES).find(([, theme]) => theme.routes.includes(path))
  return entry ? Number(entry[0]) : undefined
}

/** Apply the same theme to the surrounding frame, safe areas and browser UI. */
export function applyInvitationViewportTheme(doc: Document, template?: number): () => void {
  if (template === undefined) return () => {}
  const theme = INVITATION_VIEWPORT_THEMES[template] ?? defaultTheme

  const root = doc.documentElement
  const previousTheme = root.getAttribute('data-invitation-theme')
  root.setAttribute('data-invitation-theme', String(template))
  const properties = {
    '--invitation-surround-color': theme.backgroundColor,
    '--invitation-surround-image': theme.artwork ? `url(${JSON.stringify(theme.artwork.src)})` : 'none',
    '--invitation-surround-opacity': String(theme.artwork ? Math.min(1, Math.max(0, theme.artwork.opacity ?? .1)) : 0),
  }
  const previousProperties = Object.keys(properties).map(name => ({
    name, value: root.style.getPropertyValue(name), priority: root.style.getPropertyPriority(name),
  }))
  for (const [name, value] of Object.entries(properties)) root.style.setProperty(name, value)

  const setMeta = (name: string, content: string) => {
    const existing = doc.querySelector<HTMLMetaElement>(`meta[name="${name}"]`)
    const meta = existing || doc.createElement('meta')
    const previousContent = meta.getAttribute('content')
    meta.name = name
    meta.content = content
    if (!existing) doc.head.append(meta)
    return () => {
      if (!existing) meta.remove()
      else if (previousContent === null) meta.removeAttribute('content')
      else meta.content = previousContent
    }
  }

  const restoreColor = setMeta('theme-color', theme.backgroundColor)
  const viewport = doc.querySelector<HTMLMetaElement>('meta[name="viewport"]')?.content || 'width=device-width, initial-scale=1.0'
  const viewportWithSafeAreas = /viewport-fit\s*=/i.test(viewport)
    ? viewport.replace(/viewport-fit\s*=\s*[^,]+/i, 'viewport-fit=cover')
    : `${viewport}, viewport-fit=cover`
  const restoreViewport = setMeta('viewport', viewportWithSafeAreas)

  return () => {
    if (previousTheme === null) root.removeAttribute('data-invitation-theme')
    else root.setAttribute('data-invitation-theme', previousTheme)
    for (const { name, value, priority } of previousProperties) {
      if (value) root.style.setProperty(name, value, priority)
      else root.style.removeProperty(name)
    }
    restoreColor()
    restoreViewport()
  }
}
