import { useLayoutEffect, useRef } from 'react'
import type { ReactNode } from 'react'
import type { TextLayout } from './textLayout'
import { emptyTextLayout } from './textLayout'
import { applyTextLayout, watchTextDocuments } from './textLayoutDom'
import type { InvitationData } from './model'
import { installLegacyTextAdapter } from './legacyTextAdapters'

export default function TextLayoutLayer({ layout, details, children }: { layout?: TextLayout; details?: InvitationData; children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null)
  const current = useRef(layout)
  current.current = layout
  const latestDetails = useRef(details)
  latestDetails.current = details
  const template = details?.template
  const editor = new URLSearchParams(window.location.search).get('editor') === '1'
  const active = !!layout && Object.keys(layout.elements).length > 0
  useLayoutEffect(() => {
    if (!root.current || (!active && !editor)) return
    return watchTextDocuments(root.current, node => {
      const removeAdapter = template ? installLegacyTextAdapter(node, () => latestDetails.current!) : undefined
      const removeStyles = active ? applyTextLayout(node, () => current.current || emptyTextLayout()) : undefined
      return () => { removeAdapter?.(); removeStyles?.() }
    })
  }, [active, template, editor])
  useLayoutEffect(() => {
    const notify = (doc: Document) => {
      doc.dispatchEvent(new Event('invitation-layout-change'))
      doc.querySelectorAll('iframe').forEach(frame => { try { if (frame.contentDocument) notify(frame.contentDocument) } catch { /* External embed. */ } })
    }
    if (root.current) notify(root.current.ownerDocument)
  }, [layout, details])
  return <div ref={root} style={{ display: 'contents' }}>{children}</div>
}
