// Read visual lines once, before opening the editor. CSS wrapping does not
// appear in textContent, so use the rendered character positions to retain it.
export function renderedTextLines(element: HTMLElement, fallback: string): string {
  const doc = element.ownerDocument
  const walker = doc.createTreeWalker(element, 4)
  const nodes: Text[] = []
  while (walker.nextNode()) nodes.push(walker.currentNode as Text)
  const source = nodes.map(node => node.data).join('')
  const normalized = (text: string) => text.replace(/\s+/g, ' ').trim()
  // A preview update may still be in flight. Never replace newer saved copy
  // with old DOM text just to recover its wrapping.
  if (normalized(source) !== normalized(fallback)) return fallback

  const range = doc.createRange()
  const lines: string[] = []
  let lineStart = 0
  let previousEnd = 0
  let previousBox: DOMRect | null = null
  let offset = 0
  for (const node of nodes) {
    let index = 0
    for (const character of node.data) {
      const end = index + character.length
      if (!/\s/.test(character)) {
        range.setStart(node, index)
        range.setEnd(node, end)
        const box = range.getBoundingClientRect()
        if (box.width > 0 && box.height > 0) {
          if (previousBox && Math.abs(box.top - previousBox.top) > Math.max(2, Math.min(box.height, previousBox.height) / 2)) {
            lines.push(normalized(source.slice(lineStart, previousEnd)))
            // Retain intentional empty lines as well as visually wrapped ones.
            const breaks = source.slice(previousEnd, offset + index).match(/\n/g)?.length || 0
            for (let blank = 1; blank < breaks; blank++) lines.push('')
            lineStart = offset + index
          }
          previousBox = box
          previousEnd = offset + end
        }
      }
      index = end
    }
    offset += node.data.length
  }
  if (!lines.length) return fallback
  lines.push(normalized(source.slice(lineStart)))
  return lines.join('\n')
}
