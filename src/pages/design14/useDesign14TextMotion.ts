import { useLayoutEffect, type RefObject } from 'react'

type TextNode = HTMLElement | SVGElement
type TextGroup = { key: string; anchor: Element; nodes: TextNode[]; repeat: boolean }

export function useDesign14TextMotion(host: RefObject<HTMLDivElement | null>, opened: boolean) {
  useLayoutEffect(() => {
    const container = host.current
    if (!container) return
    const groups: TextGroup[] = []
    const addGroup = (key: string, anchor: Element | null, selector: string, repeat = false) => {
      if (!anchor) return
      const nodes = Array.from(anchor.querySelectorAll<TextNode>(selector))
      if (nodes.length) groups.push({ key, anchor, nodes, repeat })
    }
    addGroup('welcome', container.querySelector('.d14-page-two-content'),
      '.d14-page-two-invocation, .d14-page-two-intro, .d14-page-two-names, .d14-page-two-family, .d14-page-two-family-amp, .d14-page-two-celebrate > p')
    const coupleText = Array.from(container.querySelectorAll<TextNode>('[data-d14-name="PAGE 3"] svg[data-d14-component-type="RichTextContainer"]'))
    coupleText.forEach((node, index) => groups.push({ key: `couple-${index}`, anchor: node, nodes: [node], repeat: false }))
    addGroup('event-navigation', container.querySelector('.d14-event-gallery-nav'), '.d14-event-label')
    container.querySelectorAll('.d14-event-gallery-track > section').forEach(card => {
      // Real cards and edge copies share a reveal state, preserving the seamless loop.
      addGroup(`event-${card.getAttribute('data-d14-name')}`, card.querySelector('.d14-engagement-content'),
        '.d14-engagement-heading, .d14-event-month, .d14-engagement-date-row, .d14-engagement-time, .d14-engagement-venue-name, .d14-engagement-venue-city', true)
    })
    addGroup('closing', container.querySelector('.d14-end-gratitude'), ':scope > p, :scope > h2')

    const previousTransforms = new Map<TextNode, string>()
    groups.forEach(group => group.nodes.forEach((node, index) => {
      previousTransforms.set(node, node.style.transform)
      node.style.transform = node.style.transform.replace(' translateY(40px)', '').replace('translateY(40px)', '')
      node.setAttribute('data-d14-text-motion', '')
      node.style.setProperty('--d14-text-delay', `${index * 110}ms`)
    }))
    const motion = matchMedia('(prefers-reduced-motion: reduce)')
    const visible = new Map<Element, number>()
    const revealed = new Set<string>()
    const resetTimers = new Map<string, number>()
    const reveal = (key: string) => {
      window.clearTimeout(resetTimers.get(key))
      resetTimers.delete(key)
      revealed.add(key)
      groups.filter(group => group.key === key).forEach(group => group.nodes.forEach(node => node.classList.add('d14-text-visible')))
    }
    const observer = typeof IntersectionObserver !== 'undefined' ? new IntersectionObserver(entries => {
      entries.forEach(entry => visible.set(entry.target, entry.isIntersecting ? entry.intersectionRatio : 0))
      const keys = new Set(entries.flatMap(entry => groups.filter(group => group.anchor === entry.target).map(group => group.key)))
      keys.forEach(key => {
        const matching = groups.filter(group => group.key === key)
        if (matching.some(group => (visible.get(group.anchor) || 0) >= 0.15)) {
          if (!revealed.has(key)) reveal(key)
          else { window.clearTimeout(resetTimers.get(key)); resetTimers.delete(key) }
        } else if (matching[0]?.repeat && matching.every(group => !visible.get(group.anchor)) && !resetTimers.has(key)) {
          // Give a loop reset time to replace the visible duplicate with its real card.
          resetTimers.set(key, window.setTimeout(() => {
            resetTimers.delete(key)
            if (matching.some(group => visible.get(group.anchor))) return
            revealed.delete(key)
            matching.forEach(group => group.nodes.forEach(node => node.classList.remove('d14-text-visible')))
          }, 180))
        }
      })
    }, { threshold: [0, 0.15], rootMargin: '0px 0px -3% 0px' }) : null
    const start = () => {
      observer?.disconnect()
      resetTimers.forEach(timer => window.clearTimeout(timer))
      resetTimers.clear()
      if (!opened) return
      if (motion.matches || !observer) groups.forEach(group => reveal(group.key))
      else groups.forEach(group => observer.observe(group.anchor))
    }
    start()
    motion.addEventListener('change', start)
    return () => {
      observer?.disconnect()
      motion.removeEventListener('change', start)
      resetTimers.forEach(timer => window.clearTimeout(timer))
      previousTransforms.forEach((transform, node) => {
        node.style.transform = transform
        node.removeAttribute('data-d14-text-motion')
        node.style.removeProperty('--d14-text-delay')
        node.classList.remove('d14-text-visible')
      })
    }
  }, [host, opened])
}
