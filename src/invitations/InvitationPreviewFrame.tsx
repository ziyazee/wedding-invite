import { forwardRef, useLayoutEffect, useRef, useState, type IframeHTMLAttributes } from 'react'
import { INVITATION_VIEWPORT_THEMES } from './invitationViewportThemes'
import './InvitationPreviewFrame.css'

// Match the public invitation's 9:16 canvas inside the taller phone surround.
const WIDTH = 402
const HEIGHT = WIDTH * 16 / 9
// Reserved chrome keeps the full invitation visible below the Dynamic Island.
const TOP_CLEARANCE = 62
const SAFARI_PANEL_HEIGHT = 74
type Props = IframeHTMLAttributes<HTMLIFrameElement> & { templateId?: number }

function SafariIcon({ name }: { name: 'back' | 'more' | 'reload' | 'menu' }) {
  const paths = {
    back: 'M15 4 7 12l8 8',
    more: 'M5 12h.01M12 12h.01M19 12h.01',
    reload: 'M19 7a8 8 0 1 0 1 8M19 2v6h-6',
    menu: 'M4 4h16v10H4zM4 18h16M4 22h10',
  }
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d={paths[name]} /></svg>
}

const InvitationPreviewFrame = forwardRef<HTMLIFrameElement, Props>(function InvitationPreviewFrame(
  { templateId, style, ...props }, ref,
) {
  const stage = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1)
  const theme = templateId === undefined ? undefined : INVITATION_VIEWPORT_THEMES[templateId]
  const tint = theme?.backgroundColor ?? '#F7F4EE'
  const rgb = parseInt(tint.slice(1), 16)
  const darkTint = ((rgb >> 16) * .299 + ((rgb >> 8) & 255) * .587 + (rgb & 255) * .114) < 145

  useLayoutEffect(() => {
    const element = stage.current
    if (!element) return
    const resize = () => setScale(Math.min(element.clientWidth / WIDTH, element.clientHeight / (HEIGHT + TOP_CLEARANCE + SAFARI_PANEL_HEIGHT)))
    resize()
    const observer = new ResizeObserver(resize)
    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  return <div ref={stage} data-invitation-preview={templateId ?? 'default'} style={{ position: 'absolute', inset: 0, overflow: 'hidden', backgroundColor: tint }}>
    {theme?.artwork && <div aria-hidden="true" style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: `url(${JSON.stringify(theme.artwork.src)}) center / cover no-repeat`, opacity: theme.artwork.opacity ?? .1 }} />}
    <div className="invitation-phone-status" aria-hidden="true" style={{ width: WIDTH, height: TOP_CLEARANCE, color: darkTint ? '#fff' : '#111', transform: `translateX(-50%) scale(${scale})` }}>
      <span className="invitation-phone-time">9:41</span>
      <span className="invitation-phone-island" />
      <span className="invitation-phone-signals">
        <svg viewBox="0 0 20 16" fill="currentColor"><rect x="0" y="10" width="3" height="6" rx="1" /><rect x="5" y="7" width="3" height="9" rx="1" /><rect x="10" y="4" width="3" height="12" rx="1" /><rect x="15" width="3" height="16" rx="1" /></svg>
        <svg viewBox="0 0 20 16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M2 4a13 13 0 0 1 16 0M5 8a8 8 0 0 1 10 0M8 12a3 3 0 0 1 4 0" /><circle cx="10" cy="15" r="1" fill="currentColor" stroke="none" /></svg>
        <span className="invitation-phone-battery"><span /></span>
      </span>
    </div>
    <iframe {...props} ref={ref} style={{ ...style, position: 'absolute', top: TOP_CLEARANCE * scale, left: '50%', width: WIDTH, height: HEIGHT, maxWidth: 'none', border: 0, borderRadius: 0, boxShadow: 'none', background: tint, transformOrigin: 'top center', transform: `translateX(-50%) scale(${scale})` }} />
    <div className="invitation-safari-panel" aria-hidden="true" style={{ width: WIDTH, height: SAFARI_PANEL_HEIGHT, backgroundColor: tint, color: darkTint ? '#f5f5f7' : '#242426', transform: `translateX(-50%) scale(${scale})` }}>
      <div className="invitation-safari-compact">
        <span className="invitation-safari-circle"><SafariIcon name="back" /></span>
        <div className="invitation-safari-address"><SafariIcon name="menu" /><span>shaadiinvites.in</span><SafariIcon name="reload" /></div>
        <span className="invitation-safari-circle invitation-safari-more"><SafariIcon name="more" /></span>
      </div>
      <div className="invitation-safari-home" />
    </div>
  </div>
})

export default InvitationPreviewFrame
