import { lazy, Suspense, useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import type { TextLayout } from '../invitations/textLayout'
import { readTextLayout } from '../invitations/textLayout'
import { invitationExample } from '../invitations/templateData'
import { loadTemplateCatalog } from '../invitations/templateCatalog'
import type { InvitationTemplate } from '../invitations/templateCatalog'
import { TEMPLATE_INTRO_VIDEOS, TEMPLATE_INTRO_IMAGES, TEMPLATE_THUMBNAIL_OVERRIDES } from '../lib/templateCardData'
import { DashboardAccess } from './DashboardAccess'
import './Workspaces.css'
import './ClientDashboard.css'
import './Edits.css'

const OrderTextEditor = lazy(() => import('./OrderTextEditor'))

type Template = InvitationTemplate

async function loadEditsJson(templateId: number): Promise<TextLayout> {
  try {
    const resp = await fetch(`/edits/${templateId}.json`, { cache: 'no-store' })
    if (!resp.ok) return { version: 1, elements: {} }
    return readTextLayout(await resp.json())
  } catch { return { version: 1, elements: {} } }
}

export default function Edits() {
  return <DashboardAccess role="CLIENT"><EditsWorkspace /></DashboardAccess>
}

function EditsWorkspace() {
  const [templates, setTemplates] = useState<Template[]>([])
  const [selected, setSelected] = useState<number | null>(null)
  const [textLayout, setTextLayout] = useState<TextLayout>({ version: 1, elements: {} })
  const [saving, setSaving] = useState(false)
  const [saveStatus, setSaveStatus] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const previewScreen = useRef<HTMLDivElement>(null)
  const previewIframe = useRef<HTMLIFrameElement>(null)
  const [previewScale, setPreviewScale] = useState(0.75)

  useEffect(() => {
    let cancelled = false
    loadTemplateCatalog(false).then(data => {
      if (!cancelled) setTemplates(data)
    }).catch(fetchError => {
      if (!cancelled) setError(fetchError instanceof Error ? fetchError.message : 'Could not load templates.')
    }).finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [])

  const selectTemplate = useCallback(async (id: number) => {
    setSelected(id)
    setSaveStatus('')
    setTextLayout(await loadEditsJson(id))
  }, [])

  useEffect(() => {
    if (templates.length && !selected) selectTemplate(templates[0].id)
  }, [templates, selected, selectTemplate])

  const chosenTemplate = templates.find(t => t.id === selected) || templates[0]

  const previewSrc = '/client/live-preview?editor=1'

  useEffect(() => {
    if (!selected) return
    const example = invitationExample(selected)
    if (!example) return
    const data = { ...example, textOverrides: textLayout }
    try { sessionStorage.setItem('shaadi-client-live-preview', JSON.stringify(data)) } catch { /* The message still updates an already loaded preview. */ }
    const sendData = () => previewIframe.current?.contentWindow?.postMessage({ type: 'shaadi-preview-update', data }, window.location.origin)
    const handleReady = (event: MessageEvent) => {
      if (event.data?.type === 'shaadi-preview-ready') sendData()
    }
    window.addEventListener('message', handleReady)
    sendData()
    return () => window.removeEventListener('message', handleReady)
  }, [selected, textLayout])

  useLayoutEffect(() => {
    const screen = previewScreen.current
    if (!screen) return
    const resize = () => setPreviewScale(Math.min(screen.clientWidth / 402, screen.clientHeight / 874))
    resize()
    const observer = new ResizeObserver(resize)
    observer.observe(screen)
    return () => observer.disconnect()
  }, [selected, loading])

  async function saveDefaults() {
    if (!selected) return
    setSaving(true)
    setSaveStatus('')
    try {
      const response = await fetch(`/api/edits/${selected}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(textLayout),
      })
      const result = await response.json().catch(() => null)
      if (!response.ok) throw new Error(result?.error || 'Could not save template edits.')
      const merged = readTextLayout(result?.layout)
      setTextLayout(merged)
      setSaveStatus(`Saved to public/edits/${selected}.json`)
      setTimeout(() => setSaveStatus(status => status.startsWith('Saved') ? '' : status), 5000)
    } catch (error) {
      setSaveStatus(error instanceof Error ? error.message : 'Could not save template edits.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <main className="dash-loading">Loading templates…</main>

  return <main className="workspace client-workspace has-client-preview edits-workspace">
    <header className="client-topbar">
      <div className="edits-topbar-title"><strong>Template Edits</strong><span>Edit default text layout for all templates</span></div>
      <div className="edits-save-bar">
        {saveStatus && <span className={`edits-save-status ${saveStatus.startsWith('Saved') ? 'is-saved' : 'is-error'}`}>{saveStatus}</span>}
        <button className="edits-save-btn" type="button" disabled={saving || !selected} onClick={saveDefaults}>{saving ? 'Saving…' : 'Save defaults'}</button>
      </div>
    </header>

    <aside className="workspace-sidebar">
      <a href="/" className="client-brand"><img src="/logo-landing.png" alt="Shaadi Invites"/></a>
      <nav className="edits-template-list">
        {templates.map(t => (
          <button type="button" key={t.id} className={`edits-template-item${selected === t.id ? ' active' : ''}`} onClick={() => selectTemplate(t.id)}>
            {TEMPLATE_INTRO_VIDEOS[t.id]?<video src={TEMPLATE_INTRO_VIDEOS[t.id]} poster={TEMPLATE_THUMBNAIL_OVERRIDES[t.id]??t.thumbnail_url} autoPlay muted loop playsInline ref={el=>{if(el){el.muted=true;el.setAttribute('muted','');el.play().catch(()=>{})}}}/>:<img src={TEMPLATE_INTRO_IMAGES[t.id]??t.thumbnail_url} alt=""/>}
            <span><strong>{t.name}</strong><small>{t.category}</small></span>
          </button>
        ))}
      </nav>
    </aside>

    <section className="workspace-main">
      <header className="workspace-top">
        <div><span className="workspace-kicker">TEXT EDITS</span><h1>{chosenTemplate?.name || 'Select a template'}</h1></div>
      </header>
      {error && <p className="workspace-alert" role="alert">{error}</p>}
    </section>

    {chosenTemplate && <aside className="client-preview-panel">
      <div className="client-preview-heading">
        <div><span className="workspace-kicker">LIVE PREVIEW</span><h2>{chosenTemplate.name}</h2></div>
        <span className="preview-live-dot" aria-label="Live preview"/>
      </div>
      <div className="client-device-frame">
        <div className="client-device-screen" ref={previewScreen}>
          <iframe ref={previewIframe} key={selected} title={`${chosenTemplate.name} preview`} src={previewSrc} allow="autoplay; fullscreen" allowFullScreen style={{ transform: `scale(${previewScale})` }} onLoad={() => { const screen = previewScreen.current; if (screen) setPreviewScale(Math.min(screen.clientWidth / 402, screen.clientHeight / 874)); const example = selected ? invitationExample(selected) : undefined; if (example) previewIframe.current?.contentWindow?.postMessage({ type: 'shaadi-preview-update', data: { ...example, textOverrides: textLayout } }, window.location.origin) }}/>
        </div>
      </div>
    </aside>}

    {chosenTemplate && <Suspense fallback={null}>
      <OrderTextEditor key={selected!} template={selected!} value={textLayout} onChange={setTextLayout} draftStatus={saveStatus.startsWith('Downloaded') ? 'Defaults saved ✓' : 'Editing template defaults'}/>
    </Suspense>}
  </main>
}
