// Update generated template markup in place in the editor. Navigating srcDoc
// would replay the opening animation and discard the reader's scroll position.
const marker = 'data-editor-node'

export function markEditorDocument(doc: Document) {
  const style = doc.createElement('style')
  style.textContent = 'html, body, * { overflow-anchor: none !important; }'
  doc.head.append(style)
  function visit(element: Element, path: string) {
    element.setAttribute(marker, path)
    const counts = new Map<string, number>()
    for (const child of Array.from(element.children)) {
      const count = counts.get(child.tagName) || 0
      counts.set(child.tagName, count + 1)
      visit(child, `${path}/${child.id ? `#${child.id}` : `${child.tagName}:${count}`}`)
    }
  }
  visit(doc.body, 'body')
}

export function updateEditorDocument(live: Document, previous: Document, next: Document) {
  const win = live.defaultView
  if (!win) return
  const top = win.scrollY
  const left = win.scrollX
  const elements = new Map(Array.from(live.querySelectorAll(`[${marker}]`)).map(element => [element.getAttribute(marker), element]))
  const scrolls = Array.from(elements.values()).filter(element => element.scrollTop || element.scrollLeft)
    .map(element => ({ element, top: element.scrollTop, left: element.scrollLeft }))

  function patch(before: Element, after: Element) {
    if (after.tagName === 'SCRIPT' || before.isEqualNode(after)) return
    const target = elements.get(before.getAttribute(marker))
    if (!target) return
    const attributes = new Set([...Array.from(before.attributes), ...Array.from(after.attributes)].map(attribute => attribute.name))
    for (const name of attributes) {
      const oldValue = before.getAttribute(name)
      const newValue = after.getAttribute(name)
      if (name === marker || oldValue === newValue) continue
      if (name === 'class') {
        const oldClasses = new Set((oldValue || '').split(/\s+/).filter(Boolean))
        const newClasses = new Set((newValue || '').split(/\s+/).filter(Boolean))
        oldClasses.forEach(value => { if (!newClasses.has(value)) target.classList.remove(value) })
        newClasses.forEach(value => { if (!oldClasses.has(value)) target.classList.add(value) })
      } else if (name === 'style') {
        const oldStyle = (before as HTMLElement).style
        const newStyle = (after as HTMLElement).style
        const style = (target as HTMLElement).style
        for (const property of new Set([...Array.from(oldStyle), ...Array.from(newStyle)])) {
          if (oldStyle.getPropertyValue(property) !== newStyle.getPropertyValue(property)) {
            style.setProperty(property, newStyle.getPropertyValue(property), newStyle.getPropertyPriority(property))
          }
        }
      } else if (newValue === null) target.removeAttribute(name)
      else target.setAttribute(name, newValue)
    }
    const oldChildren = Array.from(before.childNodes)
    const newChildren = Array.from(after.childNodes)
    const signature = (node: Node) => node.nodeType === 1 ? (node as Element).getAttribute(marker) : String(node.nodeType)
    if (oldChildren.length !== newChildren.length || oldChildren.some((node, index) => signature(node) !== signature(newChildren[index]))) {
      target.replaceChildren(...newChildren.map(node => live.importNode(node, true)))
      // Imported sections were not registered with the initial reveal observer.
      // Show their content immediately in the editor; hidden sections stay hidden.
      target.querySelectorAll('[data-reveal]').forEach(element=>element.classList.add('visible'))
      return
    }
    const liveText = Array.from(target.childNodes).filter(node => node.nodeType === 3)
    let textIndex = 0
    oldChildren.forEach((node, index) => {
      const replacement = newChildren[index]
      if (node.nodeType === 1) patch(node as Element, replacement as Element)
      else if (node.nodeType === 3) {
        if (node.nodeValue !== replacement.nodeValue && liveText[textIndex]) liveText[textIndex].nodeValue = replacement.nodeValue
        textIndex += 1
      }
    })
  }
  patch(previous.body, next.body)
  live.title = next.title
  scrolls.forEach(({ element, top: y, left: x }) => {
    if (element.scrollTop !== y || element.scrollLeft !== x) element.scrollTo({ top: y, left: x, behavior: 'instant' })
  })
  if (win.scrollY !== top || win.scrollX !== left) win.scrollTo({ top, left, behavior: 'instant' })
  win.dispatchEvent(new Event('invitation-preview-updated'))
}
