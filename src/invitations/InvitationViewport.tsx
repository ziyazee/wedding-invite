import { useSyncExternalStore, type ReactNode } from 'react'
import { useLocation } from 'react-router-dom'
import './InvitationViewport.css'

const query = '(min-width: 768px)'
function subscribe(listener: () => void) {
  const media = window.matchMedia(query)
  media.addEventListener('change', listener)
  return () => media.removeEventListener('change', listener)
}
function isLargeScreen() { return window.matchMedia(query).matches }

/** Give every public design a real portrait viewport, including legacy frames. */
export default function InvitationViewport({ children }: { children: ReactNode }) {
  const location = useLocation()
  const largeScreen = useSyncExternalStore(subscribe, isLargeScreen, () => false)
  const path = location.pathname.replace(/\/+$/, '') || '/'
  const applicationRoute = /^\/(?:client|admin|login|dashboard|create|newDesign)(?:\/|$)/.test(path)
  const managementRoute = /^\/\d+-[A-Za-z0-9_-]{16}$/.test(path)
  const embeddedSection = path === '/design14/celebrations'
  const publicRoute = path !== '/' && !applicationRoute && !managementRoute && !embeddedSection

  // Existing dashboard/landing previews already supply their own viewport.
  // This also prevents recursively framing the invitation inside itself.
  if (!largeScreen || window.self !== window.top || !publicRoute) return children

  return <main className="invitation-portrait-stage">
    <iframe
      className="invitation-portrait-frame"
      title="Wedding invitation"
      src={`${location.pathname}${location.search}${location.hash}`}
      allow="autoplay; fullscreen"
      allowFullScreen
    />
  </main>
}
