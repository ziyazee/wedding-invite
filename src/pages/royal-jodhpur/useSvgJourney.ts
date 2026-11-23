import { useEffect } from 'react'

export function useSvgJourney(rootRef: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    if (typeof window !== 'undefined' && window.matchMedia('(min-width:681px)').matches) return
    const root = rootRef.current
    if (!root) return
    const section = root.querySelector<HTMLElement>('#events')
    const stage = root.querySelector<HTMLElement>('#evStage')
    const svg = root.querySelector<SVGSVGElement>('#evJourneySvg')
    const track = root.querySelector<SVGPathElement>('#ejTrack')
    const drawn = root.querySelector<SVGPathElement>('#ejDrawn')
    if (!section || !stage || !svg || !track || !drawn) return

    let totalLen = 0

    function getPoints() {
      const nodes = Array.from(stage!.querySelectorAll('.ev-node'))
      const rect = section!.getBoundingClientRect()
      return nodes.map(n => {
        const icon = n.querySelector('.ev-icon-wrap') || n
        const r = icon.getBoundingClientRect()
        return { x: r.left + r.width / 2 - rect.left, y: r.top + r.height / 2 - rect.top }
      })
    }

    function buildPath(pts: { x: number; y: number }[]) {
      if (pts.length < 2) return ''
      let d = `M ${pts[0].x.toFixed(1)} ${pts[0].y.toFixed(1)}`
      for (let i = 0; i < pts.length - 1; i++) {
        const a = pts[i], b = pts[i + 1]
        const mx = ((a.x + b.x) / 2).toFixed(1)
        const dir = (i % 2 === 0 ? 1 : -1) * Math.min(60, Math.abs(b.x - a.x) * 0.28)
        const cy = ((a.y + b.y) / 2 - 28).toFixed(1)
        d += ` Q ${(+mx + dir).toFixed(1)} ${cy}, ${b.x.toFixed(1)} ${b.y.toFixed(1)}`
      }
      return d
    }

    function sizeSvg() {
      const w = section!.offsetWidth, h = section!.offsetHeight
      svg!.setAttribute('width', String(w))
      svg!.setAttribute('height', String(h))
      svg!.setAttribute('viewBox', `0 0 ${w} ${h}`)
    }

    function layout() {
      sizeSvg()
      requestAnimationFrame(() => {
        const pts = getPoints()
        const d = buildPath(pts)
        track!.setAttribute('d', d)
        drawn!.setAttribute('d', d)
        if (drawn!.getTotalLength) {
          totalLen = drawn!.getTotalLength()
          drawn!.style.strokeDasharray = String(totalLen)
          drawn!.style.strokeDashoffset = String(totalLen)
        }
        updateOffset()
      })
    }

    function updateOffset() {
      if (!totalLen) return
      const vh = window.innerHeight
      const rect = section!.getBoundingClientRect()
      const scrolled = vh - rect.top
      const range = section!.offsetHeight + vh
      const p = Math.min(1, Math.max(0, scrolled / range))
      drawn!.style.strokeDashoffset = (totalLen * (1 - p)).toFixed(1)
    }

    const io = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) { requestAnimationFrame(() => requestAnimationFrame(layout)); io.disconnect() }
    }, { threshold: 0.01 })
    io.observe(section)

    window.addEventListener('load', layout)
    window.addEventListener('scroll', updateOffset, { passive: true })
    let rt: ReturnType<typeof setTimeout>
    window.addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(layout, 180) })

    return () => {
      io.disconnect()
      window.removeEventListener('load', layout)
      window.removeEventListener('scroll', updateOffset)
      clearTimeout(rt)
    }
  }, [rootRef])
}
