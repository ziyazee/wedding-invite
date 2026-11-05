import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './index.css'
import './invitations/InvitationViewport.css'
import { applyInvitationViewportTheme, invitationTemplateFromPath } from './invitations/invitationViewportTheme'

window.addEventListener('vite:preloadError', () => { window.location.reload() })

// On every viewport, public invitations are displayed inside a 9:16 portrait
// frame. Detect this before mounting React so the outer window stays
// lightweight — only the iframe shell renders here; the full app bootstraps
// once inside the iframe where window.self !== window.top.
if (
  window.self === window.top &&
  isPublicInvitationRoute()
) {
  const stage = document.createElement('main')
  stage.className = 'invitation-portrait-stage'
  const frame = document.createElement('iframe')
  frame.className = 'invitation-portrait-frame'
  frame.title = 'Wedding invitation'
  frame.allow = 'autoplay; fullscreen'
  frame.allowFullscreen = true
  let restoreTheme = () => {}
  const setTemplateTheme = (template?: number) => {
    restoreTheme()
    restoreTheme = applyInvitationViewportTheme(document, template)
  }
  setTemplateTheme(invitationTemplateFromPath(location.pathname))
  // Published invitations resolve their template inside the portrait frame.
  window.addEventListener('message', event => {
    if (event.origin !== location.origin || event.source !== frame.contentWindow) return
    if (event.data?.type !== 'invitation-viewport-theme' || !Number.isInteger(event.data.template)) return
    setTemplateTheme(event.data.template)
  })
  frame.src = location.pathname + location.search + location.hash
  stage.appendChild(frame)
  document.getElementById('root')!.replaceChildren(stage)
} else {
  // The named Tajmahal route renders directly, without InvitationRenderer.
  // Theme its iframe document before React mounts the shared loading screen.
  if (invitationTemplateFromPath(location.pathname) === 17) {
    applyInvitationViewportTheme(document, 17)
  }
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </StrictMode>,
  )
}

function isPublicInvitationRoute(): boolean {
  const host = location.hostname
  // Subdomains are ambiguous (store vs invitation) — resolve inside React.
  if (host.endsWith('.shaadiinvites.in') && host !== 'www.shaadiinvites.in') return false
  const path = location.pathname.replace(/\/+$/, '') || '/'
  if (path === '/') return false
  if (/^\/(?:client|admin|login|account|dashboard|create|newDesign|testing567|edits|privacy)(?:\/|$)/.test(path)) return false
  if (/^\/\d+-[A-Za-z0-9_-]{16}$/.test(path)) return false
  if (path === '/templates/a-timeless-union/celebrations') return false
  return true
}
