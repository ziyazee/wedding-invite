import { useLayoutEffect, useRef } from 'react'
import type { ReactNode } from 'react'
import type { TextLayout } from './textLayout'
import { emptyTextLayout } from './textLayout'
import { applyTextLayout, watchTextDocuments } from './textLayoutDom'

export default function TextLayoutLayer({ layout, children }: { layout?: TextLayout; children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null)
  const current = useRef(layout)
  current.current = layout
  const active = !!layout && Object.keys(layout.elements).length > 0
  useLayoutEffect(() => {
    if (!root.current || !active) return
    return watchTextDocuments(root.current, node => applyTextLayout(node, () => current.current || emptyTextLayout()))
  }, [active])
  useLayoutEffect(() => {
    const notify = (doc: Document) => {
      doc.dispatchEvent(new Event('invitation-layout-change'))
      doc.querySelectorAll('iframe').forEach(frame => { try { if (frame.contentDocument) notify(frame.contentDocument) } catch { /* External embed. */ } })
    }
    if (root.current) notify(root.current.ownerDocument)
  }, [layout])
  return <div ref={root} style={{ display: 'contents' }}>{children}</div>
}
