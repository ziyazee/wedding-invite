/* Golden — draw an SVG divider's strokes on when it scrolls into view.
   Mark paths with className="mw-draw" and pathLength="1". Reduced motion: fully drawn. */

import { useRef } from 'react'
import { useGSAP } from './gsap'
import { drawOn } from './motion'
import type { SectionCtx } from './contract'

export function useDrawOnScroll<T extends HTMLElement>(ctx: SectionCtx) {
  const ref = useRef<T>(null)
  useGSAP(
    () => {
      if (ctx.reducedMotion || !ref.current) return
      drawOn(ref.current.querySelectorAll('.mw-draw'), { trigger: ref.current })
    },
    { scope: ref, dependencies: [ctx.reducedMotion] },
  )
  return ref
}
