import { createContext, createElement, useCallback, useContext, useLayoutEffect, useMemo, useRef, useState } from 'react'
import type { HTMLAttributes } from 'react'

const initialBounds = { width: 0, height: 0, borderWidth: 0, borderHeight: 0 }
const SectionContext = createContext({ ...initialBounds, register: (): (() => void) => () => {} })

/** One section owns its geometry. No observers are installed unless text needs
 * a relative position (or the template explicitly requests a base placement). */
export function InvitationSection({ as = 'section', children, ...props }: HTMLAttributes<HTMLElement> & {
  as?: 'section' | 'div' | 'footer' | 'article'
  'data-invite-section': string
}) {
  const root = useRef<HTMLElement>(null)
  const [users, setUsers] = useState(0)
  const [bounds, setBounds] = useState(initialBounds)
  const register = useCallback(() => {
    setUsers(count => count + 1)
    return () => setUsers(count => count - 1)
  }, [])
  const needed = users > 0
  useLayoutEffect(() => {
    const element = root.current
    if (!element || !needed) return
    const measure = () => {
      const rect = element.getBoundingClientRect()
      const next = { width: element.clientWidth, height: element.clientHeight, borderWidth: rect.width, borderHeight: rect.height }
      setBounds(previous => Object.keys(next).every(key => previous[key as keyof typeof next] === next[key as keyof typeof next]) ? previous : next)
    }
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(element)
    return () => observer.disconnect()
  }, [needed])
  const context = useMemo(() => ({ ...bounds, register }), [bounds, register])
  return <SectionContext.Provider value={context}>{createElement(as, { ...props, ref: root }, children)}</SectionContext.Provider>
}

export function useSectionGeometry(needed: boolean) {
  const section = useContext(SectionContext)
  const { register } = section
  useLayoutEffect(() => needed ? register() : undefined, [needed, register])
  return section
}
