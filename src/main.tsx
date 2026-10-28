import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './index.css'

window.addEventListener('vite:preloadError', () => { window.location.reload() })

// On desktop, public invitations are displayed inside a portrait-shaped phone
// frame. Detect this before mounting React so the outer window stays
// lightweight — only the iframe shell renders here; the full app bootstraps
// once inside the iframe where window.self !== window.top.
if (
  window.self === window.top &&
  window.matchMedia('(min-width: 768px)').matches &&
  isPublicInvitationRoute()
) {
  const style = document.createElement('style')
  style.textContent =
    '.invitation-portrait-stage{position:fixed;inset:0;display:grid;place-items:center;overflow:hidden;background:#f7f4ee}' +
    '.invitation-portrait-frame{display:block;width:min(100vw,56.25svh);height:min(100svh,177.7778vw);border:0;background:#fffaf2;box-shadow:0 0 32px #40352512}'
  document.head.appendChild(style)

  const stage = document.createElement('main')
  stage.className = 'invitation-portrait-stage'
  const frame = document.createElement('iframe')
  frame.className = 'invitation-portrait-frame'
  frame.title = 'Wedding invitation'
  frame.allow = 'autoplay; fullscreen'
  frame.allowFullscreen = true
  frame.src = location.pathname + location.search + location.hash
  stage.appendChild(frame)
  document.getElementById('root')!.appendChild(stage)
} else {
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
  if (host.endsWith('.shaadiinvites.in') && host !== 'www.shaadiinvites.in') return true
  const path = location.pathname.replace(/\/+$/, '') || '/'
  if (path === '/') return false
  if (/^\/(?:client|admin|login|dashboard|create|newDesign|testing567|edits)(?:\/|$)/.test(path)) return false
  if (/^\/\d+-[A-Za-z0-9_-]{16}$/.test(path)) return false
  if (path === '/design14/celebrations') return false
  return true
}
