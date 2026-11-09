import { useEffect, useRef, useState, type RefObject } from 'react'
import type { InvitationData } from '../invitations/model'
import { supabase, isSupabaseConfigured } from '../lib/supabase'
import MusicPicker from './MusicPicker'
import MusicPlaybackControls from './MusicPlaybackControls'
import './OrderPreviewStep.css'

type PersonalField = 'dressCode' | 'message' | 'giftNote' | 'map' | 'music' | 'musicStart' | 'musicEnd'
type Props = {
  details: InvitationData
  previewFrame: RefObject<HTMLIFrameElement | null>
  designCategory: string
  busy: boolean
  editing: boolean
  draftStatus: string
  templateId: number
  companyId: number
  onChange: (field: PersonalField, value: string | number | undefined) => void
  onFooterIllustrationChange: (value: string) => void
  onBack: () => void
  onNavigateStep: (step: number) => void
}

type VenueImage = { id: number; name: string; storage_path: string; signedUrl: string }
const MAX_UPLOAD_SIZE = 10 * 1024 * 1024

const VENUE_ILLUSTRATION_PROMPT = `Use the uploaded photograph as the source image. Create and return exactly ONE finished image: a high-resolution PNG watercolor illustration with genuine transparency. Do not return the original photograph, a first draft, multiple options, or any text, caption, explanation, or other response.

Transform the photograph into a refined, richly detailed, semi-realistic traditional architectural watercolor for a premium wedding invitation. Preserve the venue's identity, exact architecture, perspective, proportions, asymmetry, composition and visible details. Keep the complete building uncropped, including its roof peaks, connected wings, columns, windows, entrance and attached venue elements. Preserve existing lettering as part of the architecture where visible; add no text and invent no architectural features.

Remove neighboring buildings, sky, distant scenery, people, vehicles, poles, wires, roads and unrelated vegetation. Retain only the venue and its naturally connected features, with a small amount of immediate painted foreground where needed to ground it.

Match this finish: carefully hand-painted watercolor with layered translucent washes, subtle pigment granulation, natural pigment variation, controlled wet-on-wet transitions, fine wet-on-dry architectural detail, restrained dry-brush texture and softly irregular painted edges. Keep stone joints, mouldings, capitals, window frames, relief and foliage detailed and legible. Use gentle dimensional shadows and selective cool highlights.

Use only a cool, muted sage-grey palette: pale sage ivory #E0E3D8, cool stone grey #CDD3C6, soft sage #B3BEAF, dusty sage #99A895, grey olive #7D8D7D and forest grey #586B5E. Keep the artwork luminous, naturally varied and low-to-medium contrast. Use cool ivory-grey highlights and layered grey-green shadows. Avoid yellow, beige, warm cream, gold, brown, orange, magenta, purple, vivid green, saturated blue and warm color grading.

TRANSPARENCY AND EDGE REQUIREMENTS:
The final image must have a real transparent alpha channel. Outside the painted venue and its small connected foreground, pixels must be transparent. Preserve transparent openings between columns and other architectural elements. Keep any watercolor fade narrow and directly against the painted silhouette, fading to full transparency.

Do not place the building on a background. Do not add paper texture outside the painted subject, canvas color, sky, scenery, background wash, gray haze, smoky halo, glow, vignette, shadow, rectangular field, border or frame. In particular, do not produce a dark or gray gradient around or behind the building. The area surrounding the watercolor must remain genuinely transparent, not merely appear transparent.

Before returning the result, ensure it is one complete isolated watercolor PNG with a clean transparent surround and no accompanying text.`

function UploadIllustrationModal({ companyId, onClose, onUse }: { companyId: number; onClose: () => void; onUse: (img: VenueImage) => void }) {
  const [name, setName] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState('')
  const [error, setError] = useState('')
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (!f) return
    if (f.size > MAX_UPLOAD_SIZE) { setError('File must be under 10 MB.'); return }
    if (!['image/png', 'image/webp', 'image/jpeg'].includes(f.type)) { setError('Choose a PNG, WebP or JPEG image.'); return }
    setFile(f)
    setError('')
    setPreview(URL.createObjectURL(f))
  }

  const handleUse = async () => {
    if (!file || !name.trim() || !supabase) return
    setUploading(true)
    setError('')
    try {
      const webpBlob = await new Promise<Blob>((resolve, reject) => {
        const img = new Image()
        const url = URL.createObjectURL(file)
        img.onload = () => {
          URL.revokeObjectURL(url)
          const MAX_WIDTH = 804 // 2× retina for 402px mobile display
          const scale = img.naturalWidth > MAX_WIDTH ? MAX_WIDTH / img.naturalWidth : 1
          const canvas = document.createElement('canvas')
          canvas.width = Math.round(img.naturalWidth * scale)
          canvas.height = Math.round(img.naturalHeight * scale)
          const ctx = canvas.getContext('2d')!
          ctx.fillStyle = '#ffffff'
          ctx.fillRect(0, 0, canvas.width, canvas.height)
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
          canvas.toBlob(b => b ? resolve(b) : reject(new Error('Conversion failed')), 'image/webp', 0.85)
        }
        img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('Could not load image')) }
        img.src = url
      })
      const storagePath = `${companyId}/${Date.now()}-${name.trim().toLowerCase().replace(/\s+/g, '-')}.webp`
      const { error: uploadError } = await supabase.storage.from('venue-images').upload(storagePath, webpBlob, { contentType: 'image/webp', upsert: false })
      if (uploadError) { setError(uploadError.message); return }
      const { data: insertData, error: insertError } = await supabase.from('venue_images').insert({ company_id: companyId, name: name.trim(), storage_path: storagePath }).select('id,name,storage_path').single()
      if (insertError || !insertData) { setError(insertError?.message ?? 'Failed to save record.'); return }
      const { data: urlData } = await supabase.storage.from('venue-images').createSignedUrl(storagePath, 31536000)
      if (!urlData?.signedUrl) { setError('Uploaded but could not generate URL.'); return }
      onUse({ ...insertData, signedUrl: urlData.signedUrl })
    } finally {
      setUploading(false)
    }
  }

  return <div className="illustration-modal-overlay" onClick={e => { if (e.target === e.currentTarget) onClose() }}>
    <div className="illustration-modal-dialog">
      <button type="button" className="illustration-modal-close" onClick={onClose} aria-label="Close">&times;</button>
      <h3>Upload venue illustration</h3>
      <label className="illustration-modal-field">Venue name <i>*</i><input value={name} onChange={e => setName(e.target.value)} maxLength={100} placeholder="e.g. Milagres Hall Complex" /></label>
      <div className="illustration-modal-upload" onClick={() => fileRef.current?.click()}>
        {preview ? <img src={preview} alt="Preview" /> : <span>Click to select image<br/><small>PNG, WebP or JPEG — max 10 MB</small></span>}
        <input ref={fileRef} type="file" accept="image/png,image/webp,image/jpeg" onChange={handleFile} hidden />
      </div>
      {error && <p className="illustration-modal-error">{error}</p>}
      <div className="illustration-modal-actions">
        <button type="button" className="back-action" onClick={onClose}>Cancel</button>
        <button type="button" className="primary-action" disabled={!file || !name.trim() || uploading} onClick={() => void handleUse()}>{uploading ? 'Uploading…' : 'Use this illustration'}</button>
      </div>
    </div>
  </div>
}

// This is the extra form page; the dashboard shell and phone stay mounted.
export default function OrderPreviewStep({ details, previewFrame, designCategory, busy, editing, draftStatus, templateId, companyId, onChange, onFooterIllustrationChange, onBack, onNavigateStep }: Props) {
  const heading = useRef<HTMLHeadingElement>(null)
  const [promptCopied, setPromptCopied] = useState(false)
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [venueImages, setVenueImages] = useState<VenueImage[]>([])

  useEffect(() => { heading.current?.focus() }, [])

  useEffect(() => {
    if (templateId !== 6 || !companyId || !isSupabaseConfigured || !supabase) return
    void (async () => {
      const { data, error } = await supabase.from('venue_images').select('id,name,storage_path').eq('company_id', companyId)
      if (error || !data) return
      const withUrls = await Promise.all(data.map(async row => {
        const { data: urlData } = await supabase!.storage.from('venue-images').createSignedUrl(row.storage_path, 31536000)
        return { ...row, signedUrl: urlData?.signedUrl ?? '' }
      }))
      setVenueImages(withUrls.filter(v => v.signedUrl))
    })()
  }, [companyId, templateId])

  return <div className="order-personal-step">
    <fieldset disabled={busy}>
      <legend>Music</legend>
      <MusicPicker value={details.music} designCategory={designCategory} companyId={companyId} previewInPhone onChange={value => onChange('music', value)}/>
      <MusicPlaybackControls value={details.music} start={details.musicStart} end={details.musicEnd} previewFrame={previewFrame} onRangeChange={(start, end) => { onChange('musicStart', start); onChange('musicEnd', end) }} onPlay={() => onChange('music', details.music)}/>
    </fieldset>
    <fieldset disabled={busy}>
      <legend>Personal touches</legend>
      <div className="form-grid"><label>Dress code<input value={details.dressCode} maxLength={600} onChange={event => onChange('dressCode', event.target.value)}/></label></div>
      <label>Short note<textarea rows={2} value={details.giftNote} maxLength={600} onChange={event => onChange('giftNote', event.target.value)}/></label>
    </fieldset>
    {templateId === 6 && <>
      <fieldset disabled={busy}>
        <legend>Footer illustration</legend>
        <p className="form-note">Choose the illustration shown at the bottom of the invitation.</p>
        <div className="footer-illustration-picker">
          <button type="button" className={`footer-illustration-option${!details.footerIllustration ? ' selected' : ''}`} onClick={() => onFooterIllustrationChange('')}><img src="/templates/embroidered-garden/assets/footer-chateau-opt.webp" alt="Default"/><span>Default</span></button>
          {venueImages.map(img => <button type="button" key={img.id} className={`footer-illustration-option${details.footerIllustration === img.signedUrl ? ' selected' : ''}`} onClick={() => onFooterIllustrationChange(img.signedUrl)}><img src={img.signedUrl} alt={img.name}/><span>{img.name}</span></button>)}
          {details.footerIllustration?.startsWith('data:') && <button type="button" className="footer-illustration-option selected"><img src={details.footerIllustration} alt="Custom illustration"/><span>Custom</span></button>}
        </div>
      </fieldset>
      <div className="custom-illustration-section">
        <div className="custom-illustration-row">
          <div className="custom-illustration-prompt-area">
            <p className="illustration-prompt-preview">Upload your venue photo with this prompt in <a href="https://chatgpt.com" target="_blank" rel="noopener noreferrer">ChatGPT</a> to generate a watercolor illustration.</p>
            <pre className="illustration-prompt-text">{VENUE_ILLUSTRATION_PROMPT}</pre>
            <span className="illustration-copy-link" role="button" tabIndex={0} onClick={() => { navigator.clipboard.writeText(VENUE_ILLUSTRATION_PROMPT); setPromptCopied(true); setTimeout(() => setPromptCopied(false), 2000) }}>{promptCopied ? <><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg> Copied</> : <><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg> Copy prompt</>}</span>
          </div>
          <button type="button" className="illustration-upload-btn" onClick={() => setShowUploadModal(true)}>Upload image</button>
        </div>
      </div>
    </>}
    {showUploadModal && <UploadIllustrationModal companyId={companyId} onClose={() => setShowUploadModal(false)} onUse={img => { setVenueImages(prev => [...prev, img]); onFooterIllustrationChange(img.signedUrl); setShowUploadModal(false) }} />}
    <div className="form-submit-row">
      <button type="button" className="back-action" disabled={busy} onClick={() => onNavigateStep(3)}>← Back</button>
      <button type="submit" className="primary-action" disabled={busy}>Place order →</button>
    </div>
    <p className="form-note" role="status">{draftStatus}</p>
  </div>
}
