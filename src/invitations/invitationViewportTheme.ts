/** Apply Bloom's surrounding color and mobile browser tint to its host page. */
export function applyInvitationViewportTheme(doc: Document, template?: number): () => void {
  if (template !== 7) return () => {}

  const root = doc.documentElement
  const previousTheme = root.getAttribute('data-invitation-theme')
  root.setAttribute('data-invitation-theme', 'bloom')

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

  const restoreColor = setMeta('theme-color', '#F8F1E8')
  const viewport = doc.querySelector<HTMLMetaElement>('meta[name="viewport"]')?.content || 'width=device-width, initial-scale=1.0'
  const viewportWithSafeAreas = /viewport-fit\s*=/i.test(viewport)
    ? viewport.replace(/viewport-fit\s*=\s*[^,]+/i, 'viewport-fit=cover')
    : `${viewport}, viewport-fit=cover`
  const restoreViewport = setMeta('viewport', viewportWithSafeAreas)

  return () => {
    if (previousTheme === null) root.removeAttribute('data-invitation-theme')
    else root.setAttribute('data-invitation-theme', previousTheme)
    restoreColor()
    restoreViewport()
  }
}
