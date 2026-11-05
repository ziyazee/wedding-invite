import { createContext, useContext, useLayoutEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import InvitationLoading from './InvitationLoading'
import { waitForInvitationMedia } from './invitationMediaReady'

const LoadingBoundaryContext = createContext(false)

export default function InvitationLoadingBoundary({ children, enabled = true }: { children: ReactNode; enabled?: boolean }) {
  const covered = useContext(LoadingBoundaryContext)
  if (!enabled || covered) return children
  return <ManagedInvitationLoading>{children}</ManagedInvitationLoading>
}

function ManagedInvitationLoading({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null)
  const [ready, setReady] = useState(false)

  useLayoutEffect(() => {
    const content = root.current
    if (!content) return
    let disposed = false
    let check: AbortController | undefined
    let scheduled = 0
    let childLoading = false
    const prepare = () => {
      check?.abort()
      const hasLoader = !!content.querySelector('.invitation-loading[data-visible="true"]')
      childLoading = hasLoader
      if (hasLoader) return
      const pending = new AbortController()
      check = pending
      void waitForInvitationMedia(content, pending.signal).then(() => {
        if (disposed || pending.signal.aborted) return
        observer.disconnect()
        setReady(true)
      })
    }
    const observer = new MutationObserver(() => {
      // Countdown ticks and reveal animations must not restart asset loading.
      if (!!content.querySelector('.invitation-loading[data-visible="true"]') === childLoading) return
      check?.abort()
      cancelAnimationFrame(scheduled)
      scheduled = requestAnimationFrame(prepare)
    })
    observer.observe(content, { childList: true, subtree: true, attributes: true, attributeFilter: ['data-visible'] })
    prepare()
    return () => {
      disposed = true
      check?.abort()
      observer.disconnect()
      cancelAnimationFrame(scheduled)
    }
  }, [])

  return <LoadingBoundaryContext.Provider value={true}>
    <div ref={root} style={{ display: 'contents' }} inert={!ready}>{children}</div>
    <InvitationLoading visible={!ready} />
  </LoadingBoundaryContext.Provider>
}
