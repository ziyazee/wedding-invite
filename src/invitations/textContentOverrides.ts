// Keep legacy textPath/tspan, decorative children and their listeners intact.
// Remember individual text nodes so clearing an override restores template copy.
export function textContentOverrides(root: HTMLElement) {
  type SavedNode = { node: Text; original: string; applied: string; added?: boolean }
  type SavedText = { nodes: SavedNode[]; primary: Text; nameInput: string | null; applied: string }
  const saved = new Map<HTMLElement, SavedText>()
  function restore(element: HTMLElement, state: SavedText) {
    state.nodes.forEach(({ node, original, applied, added }) => {
      if (!element.contains(node) || node.data !== applied) return
      if (added) node.remove()
      else node.data = original
    })
    if (element.getAttribute('data-name-input') === state.applied) {
      if (state.nameInput === null) element.removeAttribute('data-name-input')
      else element.setAttribute('data-name-input', state.nameInput)
    }
  }
  function apply(element: HTMLElement, content?: string) {
    const before = saved.get(element)
    if (content === undefined) {
      if (before) restore(element, before)
      saved.delete(element)
      return
    }
    const nodes: Text[] = []
    const walker = element.ownerDocument.createTreeWalker(element, 4)
    while (walker.nextNode()) {
      const node = walker.currentNode as Text
      if (!node.parentElement?.closest('script,style,title') && node.parentElement?.closest('[data-invite-text]') === element) nodes.push(node)
    }
    let added: Text | undefined
    if (!nodes.length) {
      added = element.ownerDocument.createTextNode('')
      element.append(added)
      nodes.push(added)
    }
    const previous = new Map(before?.nodes.map(node => [node.node, node]))
    const firstText = before && nodes.includes(before.primary) ? nodes.indexOf(before.primary) : Math.max(0, nodes.findIndex(node => node.data.trim().length > 0))
    const nameInput = element.getAttribute('data-name-input')
    const state: SavedText = {
      nodes: nodes.map((node, index) => {
        const old = previous.get(node)
        return { node, original: old && node.data === old.applied ? old.original : node.data, applied: index === firstText ? content : '', added: node === added || old?.added }
      }),
      primary: nodes[firstText],
      nameInput: before && nameInput === before.applied ? before.nameInput : nameInput,
      applied: content,
    }
    saved.set(element, state)
    state.nodes.forEach(({ node, applied }) => { if (node.data !== applied) node.data = applied })
    // Existing name fitters must measure the edited name, not the form's copy.
    if (nameInput !== null && nameInput !== content) element.setAttribute('data-name-input', content)
  }
  return {
    apply,
    prune: () => saved.forEach((_, element) => { if (!root.contains(element)) saved.delete(element) }),
    dispose: () => { saved.forEach((state, element) => restore(element, state)); saved.clear() },
  }
}
