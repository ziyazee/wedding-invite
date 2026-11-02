const installed = new WeakSet<Document>()

/** Keep company branding readable when an iframe's logo file is unavailable. */
export function installFooterLogoFallback(doc: Document) {
  const replace = (img: HTMLImageElement) => {
    if (!img.isConnected || !img.matches('.designed-by-logo')) return
    const name = doc.createElement('span')
    name.className = 'designed-by-name'
    name.textContent = img.alt || 'Company'
    img.replaceWith(name)
  }
  if (!installed.has(doc)) {
    doc.addEventListener('error', event => {
      const target = event.target as HTMLImageElement | null
      if (target?.tagName === 'IMG') replace(target)
    }, true)
    installed.add(doc)
  }
  // srcDoc images may have failed before the iframe's load handler runs.
  doc.querySelectorAll<HTMLImageElement>('img.designed-by-logo').forEach(img => {
    if (img.complete && img.naturalWidth === 0) replace(img)
  })
}
