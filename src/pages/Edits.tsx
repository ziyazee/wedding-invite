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

type ImageSlot = { file: string; label: string; type: 'image' | 'video' }
const TEMPLATE_IMAGE_SLOTS: Record<number, ImageSlot[]> = {
  1: [
    { file: 'welcome.jpg', label: 'Welcome background', type: 'image' },
    { file: 'general.jpg', label: 'Body background', type: 'image' },
    { file: 'end.png', label: 'Ending background', type: 'image' },
    { file: 'opening-poster.jpg', label: 'Opening poster', type: 'image' },
    { file: 'opening.mp4', label: 'Opening video', type: 'video' },
  ],
}
const TEMPLATE_FOLDERS: Record<number, string> = {
  1: 'royal-grace', 2: 'majestic', 3: 'a-timeless-union', 4: 'mandap-at-dusk',
  5: 'secret-garden', 6: 'embroidered-garden', 7: 'bloom', 8: 'the-artful-love-story',
  9: 'maroon-letter', 10: 'emerald-parchment', 11: 'shaadipath-t02', 12: 'destination-wedding',
  13: 'raabta', 14: 'qubool',
}

const OrderTextEditor = lazy(() => import('./OrderTextEditor'))

type Template = InvitationTemplate

async function loadEditsJson(templateId: number): Promise<TextLayout> {
  try {
    const resp = await fetch(`/edits/${templateId}.json`, { cache: 'no-store' })
    if (!resp.ok) return { version: 1, elements: {} }
    return readTextLayout(await resp.json())
  } catch { return { version: 1, elements: {} } }
}

function ImageEditor({ folder, slots, cacheKey, onUpload }: { folder: string | undefined; slots: ImageSlot[] | undefined; cacheKey: number; onUpload: (file: File, slot: ImageSlot) => Promise<void> }) {
  const fileRefs = useRef<(HTMLInputElement | null)[]>([])
  const [uploading, setUploading] = useState<string | null>(null)

  if (!folder || !slots?.length) {
    return <div className="edits-images-empty"><p>No configurable images for this template yet.</p></div>
  }

  return <div className="edits-images-grid">
    {slots.map((slot, i) => {
      const src = `/templates/${folder}/${slot.file}?v=${cacheKey}`
      return <div key={slot.file} className="edits-image-slot">
        <div className="edits-image-thumb">
          {slot.type === 'video'
            ? <video src={src} muted playsInline preload="metadata" className="edits-image-preview" />
            : <img src={src} alt={slot.label} className="edits-image-preview" loading="lazy" />}
        </div>
        <div className="edits-image-info">
          <strong>{slot.label}</strong>
          <small>{slot.file}</small>
        </div>
        <button type="button" className="edits-image-replace-btn" disabled={uploading === slot.file} onClick={() => fileRefs.current[i]?.click()}>
          {uploading === slot.file ? 'Uploading…' : 'Replace'}
        </button>
        <input
          ref={el => { fileRefs.current[i] = el }}
          type="file"
          accept={slot.type === 'video' ? 'video/mp4' : 'image/jpeg,image/png,image/webp'}
          style={{ display: 'none' }}
          onChange={async e => {
            const file = e.target.files?.[0]
            if (!file) return
            setUploading(slot.file)
            try { await onUpload(file, slot) } finally { setUploading(null); e.target.value = '' }
          }}
        />
      </div>
    })}
  </div>
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
  const [editMode, setEditMode] = useState<'text' | 'images'>('text')
  const [imageCacheKey, setImageCacheKey] = useState(0)
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

  async function uploadImage(file: File, slot: ImageSlot) {
    if (!selected) return
    setSaveStatus('')
    try {
      const resp = await fetch(`/api/edits/image/${selected}/${slot.file}`, {
        method: 'POST',
        headers: { 'Content-Type': file.type },
        body: file,
      })
      const result = await resp.json().catch(() => null)
      if (!resp.ok) throw new Error(result?.error || 'Upload failed.')
      setImageCacheKey(k => k + 1)
      if (previewIframe.current) previewIframe.current.src = previewIframe.current.src
      setSaveStatus(`Replaced ${slot.label}`)
      setTimeout(() => setSaveStatus(s => s.startsWith('Replaced') ? '' : s), 4000)
    } catch (err) {
      setSaveStatus(err instanceof Error ? err.message : 'Upload failed.')
    }
  }

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
        {saveStatus && <span className={`edits-save-status ${saveStatus.startsWith('Saved') || saveStatus.startsWith('Replaced') ? 'is-saved' : 'is-error'}`}>{saveStatus}</span>}
        {editMode === 'text' && <button className="edits-save-btn" type="button" disabled={saving || !selected} onClick={saveDefaults}>{saving ? 'Saving…' : 'Save defaults'}</button>}
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
        <div><span className="workspace-kicker">{editMode === 'images' ? 'IMAGE EDITS' : 'TEXT EDITS'}</span><h1>{chosenTemplate?.name || 'Select a template'}</h1></div>
        <div className="edits-mode-tabs">
          <button type="button" className={`edits-mode-tab${editMode === 'text' ? ' active' : ''}`} onClick={() => setEditMode('text')}>Text</button>
          <button type="button" className={`edits-mode-tab${editMode === 'images' ? ' active' : ''}`} onClick={() => setEditMode('images')}>Images</button>
        </div>
      </header>
      {error && <p className="workspace-alert" role="alert">{error}</p>}
      {editMode === 'images' && selected && <ImageEditor folder={TEMPLATE_FOLDERS[selected]} slots={TEMPLATE_IMAGE_SLOTS[selected]} cacheKey={imageCacheKey} onUpload={uploadImage} />}
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
