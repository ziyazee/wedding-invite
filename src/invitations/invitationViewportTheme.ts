import { INVITATION_VIEWPORT_THEMES, type InvitationViewportTheme } from './invitationViewportThemes'
export { INVITATION_VIEWPORT_THEMES, type InvitationViewportTheme } from './invitationViewportThemes'

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
