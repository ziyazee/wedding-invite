import { useEffect, useImperativeHandle, useRef, useState } from 'react'
import type { ComponentPropsWithRef } from 'react'
import { waitForInvitationMedia } from './invitationMediaReady'
import './InvitationLoading.css'

export default function InvitationLoading({ visible = true }: { visible?: boolean }) {
  return <div className="invitation-loading" data-visible={visible} role={visible ? 'status' : undefined} aria-hidden={!visible}>
    <span className="invitation-loading-indicator" aria-hidden="true" />
    <p>Preparing your invitation…</p>
  </div>
}

type InvitationLoadingFrameProps = ComponentPropsWithRef<'iframe'> & {
  onDocumentReady?: (doc: Document) => void
}

export function InvitationLoadingFrame({ onDocumentReady, className, style, ref, ...props }: InvitationLoadingFrameProps) {
  const [readySource, setReadySource] = useState<string | null>(null)
  const frame = useRef<HTMLIFrameElement>(null)
  const initialized = useRef<{ source: string; doc: Document } | null>(null)
  const initialize = useRef(onDocumentReady)
  initialize.current = onDocumentReady
  useImperativeHandle(ref, () => frame.current!, [])
  const source = props.srcDoc ?? props.src ?? ''
  const ready = readySource === source

  useEffect(() => {
    const controller = new AbortController()
    let preparing = false
    const prepare = () => {
      const element = frame.current
      const doc = element?.contentDocument
      if (preparing || !element || !doc?.body || doc.readyState === 'loading') return
      if (source && doc.URL === 'about:blank') return
      if (initialized.current?.doc === doc && initialized.current.source !== source) return
      preparing = true
      clearInterval(timer)
      if (initialized.current?.doc !== doc) {
        initialized.current = { source, doc }
        initialize.current?.(doc)
      }
      void waitForInvitationMedia(doc.body, controller.signal).then(() => {
        if (!controller.signal.aborted && element.isConnected && element.contentDocument === doc) setReadySource(source)
      })
    }
    // The iframe load event waits for all eager images. Observe DOM readiness
    // independently so a slow image below the cover cannot trap the splash.
    const timer = window.setInterval(prepare, 50)
    prepare()
    return () => { controller.abort(); clearInterval(timer) }
  }, [source])

  return <>
    <InvitationLoading visible={!ready} />
    <iframe {...props} ref={frame} className={['invitation-loading-frame', className].filter(Boolean).join(' ')}
      aria-hidden={!ready} tabIndex={ready ? props.tabIndex : -1}
      style={{ ...style, opacity: ready ? 1 : 0, pointerEvents: ready ? style?.pointerEvents : 'none' }} />
  </>
}
