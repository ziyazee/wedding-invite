import { useState } from 'react'
import type { ComponentPropsWithRef } from 'react'
import './InvitationLoading.css'

export default function InvitationLoading({ visible = true }: { visible?: boolean }) {
  return <div className="invitation-loading" data-visible={visible} role={visible ? 'status' : undefined} aria-hidden={!visible}>
    <span className="invitation-loading-indicator" aria-hidden="true" />
    <p>Preparing your invitation…</p>
  </div>
}

export function InvitationLoadingFrame({ onLoad, className, style, ref, ...props }: ComponentPropsWithRef<'iframe'>) {
  const [readySource, setReadySource] = useState<string | null>(null)
  const source = props.srcDoc || ''
  const ready = readySource === source

  return <>
    <InvitationLoading visible={!ready} />
    <iframe {...props} ref={ref} className={['invitation-loading-frame', className].filter(Boolean).join(' ')}
      aria-hidden={!ready} tabIndex={ready ? props.tabIndex : -1}
      style={{ ...style, opacity: ready ? 1 : 0, pointerEvents: ready ? style?.pointerEvents : 'none' }}
      onLoad={event => {
        onLoad?.(event)
        const frame = event.currentTarget
        const doc = frame.contentDocument
        const cover = doc?.querySelector<HTMLImageElement>('#opening > img')
        const reveal = () => {
          if (frame.isConnected && frame.contentDocument === doc) setReadySource(source)
        }
        if (!cover) { reveal(); return }
        const decodeCover = () => { void cover.decode().catch(() => {}).then(reveal) }
        if (cover.complete) decodeCover()
        else {
          cover.addEventListener('load', decodeCover, { once: true })
          cover.addEventListener('error', reveal, { once: true })
        }
      }} />
  </>
}
