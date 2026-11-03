import { useEffect, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { supabase } from '../lib/supabase'
import type { InvitationTemplate } from '../invitations/templateCatalog'
import { slugProblem, validateStoreDetails, validateStoreTemplates } from '../../supabase/functions/_shared/storeOnboarding'
import type { StoreDetails, StoreTemplateSetting } from '../../supabase/functions/_shared/storeOnboarding'
import './StoreOnboarding.css'

type SetupRecord = {
  id: string
  company_id: number
  details: StoreDetails
  templates: StoreTemplateSetting[]
  logo_uploaded: boolean
  banner_uploaded: boolean
  completed_at: string | null
  companies: { storefront_enabled: boolean; branding_base_url: string | null }
}
type SetupResult = { request_id: string; company_id: number; company_name: string; slug: string; email: string; storefront_enabled: boolean; setup_url: string; store_url: string; login_url: string }
type SetupResponse = SetupResult & { error?: string; request_reserved?: boolean }
const blank: StoreDetails = { company_name: '', slug: '', contact_name: '', email: '', phone: '+91', tagline: '', brand_color: '#754522', activate: false }
const steps = ['Store details', 'Branding', 'Collection & pricing', 'Review']
const money = (value: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 }).format(value)
const salePrice = (item: StoreTemplateSetting) => item.sale_type === 'percentage' ? Math.floor(item.price * (1 - item.sale_value / 100)) : item.sale_type === 'fixed' ? item.price - item.sale_value : item.price

function useImageURL(file: File | null) {
  const [url, setURL] = useState<string>()
  useEffect(() => {
    if (!file) { setURL(undefined); return }
    const next = URL.createObjectURL(file)
    setURL(next)
    return () => URL.revokeObjectURL(next)
  }, [file])
  return url
}

async function prepareImage(file: File, kind: 'logo' | 'banner'): Promise<File> {
  if (!['image/png', 'image/jpeg', 'image/webp'].includes(file.type) || file.size > 12 * 1024 * 1024) throw new Error('Choose a PNG, JPG or WebP image smaller than 12 MB.')
  const bitmap = await createImageBitmap(file)
  try {
    const max = kind === 'logo' ? 640 : 1600
    const scale = Math.min(1, max / Math.max(bitmap.width, bitmap.height))
    const canvas = document.createElement('canvas')
    canvas.width = Math.max(1, Math.round(bitmap.width * scale)); canvas.height = Math.max(1, Math.round(bitmap.height * scale))
    const context = canvas.getContext('2d')
    if (!context) throw new Error('Image preparation is unavailable in this browser.')
    context.drawImage(bitmap, 0, 0, canvas.width, canvas.height)
    const blob = await new Promise<Blob>((resolve, reject) => canvas.toBlob(value => value ? resolve(value) : reject(new Error('Unable to prepare this image.')), 'image/png'))
    if (blob.size > 5 * 1024 * 1024) throw new Error('This image is too detailed. Choose a smaller image (prepared uploads must be under 5 MB).')
    return new File([blob], `${kind}.png`, { type: 'image/png' })
  } finally { bitmap.close() }
}

async function callOnboarding(payload: unknown, logo?: File | null, banner?: File | null): Promise<SetupResponse> {
  if (!supabase) throw new Error('Supabase is not configured.')
  const body = new FormData()
  body.set('payload', JSON.stringify(payload))
  if (logo) body.set('logo', logo)
  if (banner) body.set('banner', banner)
  const { data, error } = await supabase.functions.invoke('onboard-store', { body })
  if (error) {
    if (error.context instanceof Response) {
      const response = await error.context.json().catch(() => null)
      if (response?.error) return response as SetupResponse
    }
    throw new Error(error.message || 'Could not reach store setup. Retry to continue the same setup.')
  }
  if (!data) throw new Error('Store setup returned no result. Retry to continue.')
  return data as SetupResponse
}

export default function StoreOnboarding({ onChange }: { onChange: () => void }) {
  const [records, setRecords] = useState<SetupRecord[]>([])
  const [opening, setOpening] = useState(false)
  const [resume, setResume] = useState<SetupRecord>()
  const [revision, setRevision] = useState(0)
  const [error, setError] = useState('')
  const [busyId, setBusyId] = useState('')
  const [access, setAccess] = useState<SetupResult>()
  const [copied, setCopied] = useState(false)
  useEffect(() => {
    let cancelled = false
    if (supabase) void supabase.from('store_onboarding_requests').select('id,company_id,details,templates,logo_uploaded,banner_uploaded,completed_at,companies(storefront_enabled,branding_base_url)').order('created_at', { ascending: false }).limit(50).then(({ data, error }) => {
      if (cancelled) return
      if (error) setError('Store onboarding is unavailable. Apply the store onboarding migration first.')
      else { setRecords((data || []) as unknown as SetupRecord[]); setError('') }
    })
    return () => { cancelled = true }
  }, [revision])

  async function visibility(record: SetupRecord) {
    if (!supabase || busyId) return
    setBusyId(record.id); setError('')
    try {
      const { error } = await supabase.rpc('admin_set_storefront_enabled', { p_company_id: record.company_id, p_enabled: !record.companies.storefront_enabled })
      if (error) throw error
      setRevision(value => value + 1); onChange()
    } catch (cause) { setError(cause instanceof Error ? cause.message : 'Unable to change storefront visibility.') }
    finally { setBusyId('') }
  }
  async function ownerLink(record: SetupRecord) {
    if (busyId) return
    setBusyId(record.id); setError(''); setAccess(undefined); setCopied(false)
    try {
      const result = await callOnboarding({ action: 'access', request_id: record.id })
      if (result.error) throw new Error(result.error)
      setAccess(result)
    } catch (cause) { setError(cause instanceof Error ? cause.message : 'Unable to create the owner setup link.') }
    finally { setBusyId('') }
  }

  if (opening) return <OnboardingForm key={resume?.id || 'new'} resume={resume} onComplete={() => { setRevision(value => value + 1); onChange() }} onClose={() => { setOpening(false); setResume(undefined); setRevision(value => value + 1); onChange() }} />
  return <section className="store-onboarding-manager">
    <header><div><span className="workspace-kicker">GROW YOUR STORE NETWORK</span><h2>Onboard a store</h2><p>Set up its storefront, branding, collection and owner access.</p></div><button className="primary-action" onClick={() => { setResume(undefined); setAccess(undefined); setOpening(true) }}>+ New store</button></header>
    {error && <p className="workspace-alert" role="alert">{error}</p>}
    {records.length > 0 && <details><summary>Recent store setups ({records.length})</summary><div className="store-setup-list">{records.map(record => <article key={record.id}>
      <div><strong>{record.details.company_name}</strong><small>{record.details.slug}.shaadiinvites.in · {record.completed_at ? record.companies?.storefront_enabled ? 'Public' : 'Private draft' : 'Setup incomplete'}</small></div>
      {!record.completed_at ? <button className="secondary-action" onClick={() => { setResume(record); setOpening(true) }}>Resume setup</button> : <div className="store-setup-actions">
        <button className="secondary-action" disabled={!!busyId} onClick={() => void ownerLink(record)}>New owner setup link</button>
        <button className="secondary-action" disabled={!!busyId} onClick={() => void visibility(record)}>{record.companies?.storefront_enabled ? 'Make private' : 'Publish storefront'}</button>
        {record.companies?.storefront_enabled && <a href={`https://${record.details.slug}.shaadiinvites.in`} target="_blank" rel="noreferrer">Open store ↗</a>}
      </div>}
    </article>)}</div></details>}
    {access && <div className="store-setup-access" role="status"><strong>Owner access for {access.company_name}</strong><p>Share this single-use password setup link with {access.email}. It replaces any previous setup link. No email has been sent.</p><button className="secondary-action" onClick={() => { void navigator.clipboard.writeText(access.setup_url).then(() => setCopied(true)).catch(() => setError('Could not copy. Select and copy the link below.')) }}>{copied ? 'Copied' : 'Copy owner setup link'}</button><input aria-label="Owner setup link" readOnly value={access.setup_url} onFocus={event => event.currentTarget.select()} /></div>}
  </section>
}

function OnboardingForm({ resume, onClose, onComplete }: { resume?: SetupRecord; onClose: () => void; onComplete: () => void }) {
  const [requestId] = useState(() => resume?.id || crypto.randomUUID())
  const [details, setDetails] = useState<StoreDetails>(() => resume?.details || { ...blank })
  const [catalog, setCatalog] = useState<InvitationTemplate[]>([])
  const [settings, setSettings] = useState<StoreTemplateSetting[]>(() => resume?.templates || [])
  const [catalogLoading, setCatalogLoading] = useState(true)
  const [catalogError, setCatalogError] = useState('')
  const [step, setStep] = useState(resume ? 3 : 0)
  const [logo, setLogo] = useState<File | null>(null)
  const [banner, setBanner] = useState<File | null>(null)
  const [preparing, setPreparing] = useState(false)
  const [started, setStarted] = useState(!!resume)
  const [busy, setBusy] = useState(false)
  const [slugStatus, setSlugStatus] = useState('')
  const [error, setError] = useState('')
  const [result, setResult] = useState<SetupResult>()
  const [copyStatus, setCopyStatus] = useState('')
  const slugEdited = useRef(!!resume)
  const submitting = useRef(false)
  const heading = useRef<HTMLHeadingElement>(null)
  const logoPreview = useImageURL(logo)
  const bannerPreview = useImageURL(banner)
  const storedBase = resume?.companies.branding_base_url
  const shownLogo = logoPreview || (resume?.logo_uploaded && storedBase ? `${storedBase}/company-logos/${details.slug}.png` : undefined)
  const shownBanner = bannerPreview || (resume?.banner_uploaded && storedBase ? `${storedBase}/landing/${details.slug}.png` : undefined)

  useEffect(() => {
    let cancelled = false
    if (!supabase) { setCatalogError('Supabase is not configured.'); setCatalogLoading(false); return }
    void supabase.from('invitation_templates').select('id,template_code,name,category,thumbnail_url,preview_url,is_active').eq('is_active', true).is('company_id', null).order('id').then(({ data, error }) => {
      if (cancelled) return
      if (error) setCatalogError(error.message)
      else {
        setCatalog((data || []) as InvitationTemplate[])
        if (!resume) setSettings((data || []).map(template => ({ template_id: template.id, price: 499, sale_type: 'none', sale_value: 0, is_premium: false })))
      }
      setCatalogLoading(false)
    })
    return () => { cancelled = true }
  }, [resume])
  useEffect(() => { heading.current?.focus() }, [step])
  useEffect(() => {
    if (started || !details.slug) { setSlugStatus(''); return }
    const problem = slugProblem(details.slug)
    if (problem) { setSlugStatus(problem); return }
    let cancelled = false
    setSlugStatus('Checking address…')
    const timer = window.setTimeout(() => {
      if (supabase) void supabase.rpc('admin_store_slug_available', { p_slug: details.slug }).then(({ data, error }) => {
        if (!cancelled) setSlugStatus(error ? 'Could not check the address. Try again before continuing.' : data ? 'Available' : 'This address is already in use.')
      })
    }, 350)
    return () => { cancelled = true; window.clearTimeout(timer) }
  }, [details.slug, started])
  useEffect(() => {
    const warn = (event: BeforeUnloadEvent) => { event.preventDefault(); event.returnValue = '' }
    if (!result && (details.company_name || started)) window.addEventListener('beforeunload', warn)
    return () => window.removeEventListener('beforeunload', warn)
  }, [details.company_name, started, result])

  function change<K extends keyof StoreDetails>(key: K, value: StoreDetails[K]) { setDetails(previous => ({ ...previous, [key]: value })) }
  function changePrice(id: number, patch: Partial<StoreTemplateSetting>) { setSettings(previous => previous.map(item => item.template_id === id ? { ...item, ...patch } : item)) }
  async function chooseImage(file: File | undefined, kind: 'logo' | 'banner') {
    if (!file) return
    setPreparing(true); setError('')
    try { const prepared = await prepareImage(file, kind); if (kind === 'logo') setLogo(prepared); else setBanner(prepared) }
    catch (cause) { setError(cause instanceof Error ? cause.message : 'This image could not be opened.') }
    finally { setPreparing(false) }
  }
  async function submit(event: FormEvent) {
    event.preventDefault()
    if (submitting.current || preparing) return
    submitting.current = true; setBusy(true); setError('')
    try {
      if (step === 0) {
        validateStoreDetails(details)
        if (!supabase) throw new Error('Supabase is not configured.')
        const { data, error } = await supabase.rpc('admin_store_slug_available', { p_slug: details.slug })
        if (error) throw error
        if (!data) throw new Error('This store address is unavailable. Choose another.')
      }
      if (step === 1 && !logo) throw new Error('Choose a store logo.')
      if (step === 2) validateStoreTemplates(settings)
      if (step < 3) { setStep(value => value + 1); return }
      const validatedDetails = validateStoreDetails(details), validatedTemplates = validateStoreTemplates(settings)
      if (!logo && !resume?.logo_uploaded) throw new Error('Choose a store logo before creating the store.')
      setStarted(true)
      const response = await callOnboarding({ action: resume ? 'resume' : 'create', request_id: requestId, details: validatedDetails, templates: validatedTemplates }, logo, banner)
      if (response.error) {
        if (response.request_reserved === false && !resume) setStarted(false)
        throw new Error(response.error)
      }
      setResult(response); onComplete()
    } catch (cause) {
      setError(cause && typeof cause === 'object' && 'message' in cause ? String(cause.message) : 'Unable to create this store. Retry to continue.')
    } finally { submitting.current = false; setBusy(false) }
  }

  if (result) return <section className="store-onboarding store-onboarding-success">
    <span className="workspace-kicker">STORE ONBOARDED</span><h2>{result.company_name} is ready.</h2>
    <p>{result.storefront_enabled ? 'The storefront is public.' : 'The storefront is a private draft. Publish it from Recent store setups when you are ready.'}</p>
    <dl><dt>Store address</dt><dd>{result.storefront_enabled ? <a href={result.store_url} target="_blank" rel="noreferrer">{result.store_url} ↗</a> : result.store_url}</dd><dt>Owner login</dt><dd>{result.email}</dd><dt>Dashboard sign-in</dt><dd>{result.login_url}</dd></dl>
    <div className="store-setup-access"><strong>Give the owner access</strong><p>Copy this single-use link and share it with {result.email}. They can choose their password and open the dashboard. No email has been sent.</p><button className="primary-action" onClick={() => { void navigator.clipboard.writeText(result.setup_url).then(() => setCopyStatus('Setup link copied.')).catch(() => setCopyStatus('Select and copy the link below.')) }}>Copy owner setup link</button><input readOnly aria-label="Owner setup link" value={result.setup_url} onFocus={event => event.currentTarget.select()} /><p role="status">{copyStatus}</p></div>
    <button className="secondary-action" onClick={onClose}>Back to companies</button>
  </section>

  return <section className="store-onboarding">
    <header className="store-onboarding-heading"><div><span className="workspace-kicker">NEW STORE</span><h2 ref={heading} tabIndex={-1}>{started ? 'Finish store setup' : steps[step]}</h2><p>Build a storefront that feels like your client’s own.</p></div><button type="button" className="back-action" disabled={busy} onClick={onClose}>{started ? 'Close & resume later' : 'Cancel'}</button></header>
    <ol className="store-onboarding-steps">{steps.map((label, index) => <li key={label} aria-current={index === step ? 'step' : undefined}><span>{index + 1}</span>{label}</li>)}</ol>
    {catalogError && <p className="workspace-alert" role="alert">{catalogError}</p>}
    {error && <p className="workspace-alert" role="alert">{error}</p>}
    <form onSubmit={submit}>
      <fieldset disabled={busy || started || preparing}>
        {step === 0 && <div className="store-onboarding-grid">
          <label>Store name<input autoFocus required maxLength={120} autoComplete="organization" value={details.company_name} onChange={event => { const name = event.target.value; change('company_name', name); if (!slugEdited.current) change('slug', name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0,61)) }} placeholder="City Mart" /></label>
          <label>Store address<input required maxLength={61} autoCapitalize="none" spellCheck={false} value={details.slug} onChange={event => { slugEdited.current = true; change('slug', event.target.value.toLowerCase().trim()) }} placeholder="citymart" /><small>{details.slug || 'yourstore'}.shaadiinvites.in</small><small role="status">{slugStatus}</small></label>
          <label>Contact person<input required maxLength={100} autoComplete="name" value={details.contact_name} onChange={event => change('contact_name', event.target.value)} /></label>
          <label>Owner’s login email<input required type="email" maxLength={254} autoComplete="email" value={details.email} onChange={event => change('email', event.target.value)} /><small>The owner will use this email to sign in.</small></label>
          <label>WhatsApp number<input required type="tel" maxLength={24} autoComplete="tel" value={details.phone} onChange={event => change('phone', event.target.value)} /><small>Include the country code, for example +91.</small></label>
        </div>}
        {step === 1 && <div className="store-onboarding-grid">
          <label>Store logo<input type="file" accept="image/png,image/jpeg,image/webp" onChange={event => void chooseImage(event.target.files?.[0], 'logo')} /><small>Required. PNG, JPG or WebP; up to 12 MB.</small>{shownLogo && <img className="store-upload-logo" src={shownLogo} alt="Selected store logo" />}</label>
          <label>Store banner <span>(optional)</span><input type="file" accept="image/png,image/jpeg,image/webp" onChange={event => void chooseImage(event.target.files?.[0], 'banner')} /><small>A wide image works best.</small>{shownBanner && <><img className="store-upload-banner" src={shownBanner} alt="Selected store banner" /><button type="button" className="back-action" onClick={() => setBanner(null)}>Remove banner</button></>}</label>
          <label>Tagline <span>(optional)</span><input maxLength={180} value={details.tagline} onChange={event => change('tagline', event.target.value)} placeholder="Beautiful invitations for your special day" /></label>
          <label>Brand colour<input type="color" value={details.brand_color} onChange={event => change('brand_color', event.target.value)} /><small>{details.brand_color}</small></label>
        </div>}
        {step === 2 && <><p className="store-step-note">Choose the collection this store can sell. Set its price and any discount; ₹0 means complimentary.</p>{catalogLoading ? <p role="status">Loading templates…</p> : <div className="store-template-options">{catalog.map(template => {
          const item = settings.find(setting => setting.template_id === template.id)
          return <article key={template.id} className={item ? 'selected' : ''}>
            <label className="store-template-select"><input type="checkbox" checked={!!item} onChange={event => setSettings(previous => event.target.checked ? [...previous, { template_id: template.id, price: 499, sale_type: 'none', sale_value: 0, is_premium: false }] : previous.filter(setting => setting.template_id !== template.id))} /><span><strong>{template.name}</strong><small>{template.category}</small></span></label>
            {item && <div className="store-template-pricing"><label>Price (₹)<input required type="number" min={0} max={1000000} step="0.01" value={item.price} onChange={event => changePrice(template.id, { price: Number(event.target.value) })} /></label><label>Discount<select value={item.sale_type} onChange={event => changePrice(template.id, { sale_type: event.target.value as StoreTemplateSetting['sale_type'], sale_value: 0 })}><option value="none">None</option><option value="percentage">Percentage</option><option value="fixed">Amount (₹)</option></select></label>{item.sale_type !== 'none' && <label>{item.sale_type === 'percentage' ? 'Discount (%)' : 'Discount (₹)'}<input required type="number" min={0} max={item.sale_type === 'percentage' ? 100 : item.price} step="0.01" value={item.sale_value} onChange={event => changePrice(template.id, { sale_value: Number(event.target.value) })} /></label>}<label className="store-checkbox"><input type="checkbox" checked={item.is_premium} onChange={event => changePrice(template.id, { is_premium: event.target.checked })} />Premium badge</label><p>Selling price <strong>{money(salePrice(item))}</strong></p></div>}
          </article>
        })}</div>}</>}
        {step === 3 && <><div className="store-review-brand" style={{ borderColor: details.brand_color, backgroundImage: shownBanner ? `linear-gradient(90deg,#fffffff0,#ffffffb0),url("${shownBanner}")` : undefined }}>{shownLogo && <img src={shownLogo} alt={`${details.company_name} logo`} />}<div><span style={{ color: details.brand_color }}>YOUR STOREFRONT</span><h3>{details.company_name}</h3><p>{details.tagline || 'Beautiful invitations for your special day'}</p><small>{details.slug}.shaadiinvites.in</small></div></div>
          <dl className="store-review-details"><dt>Contact person</dt><dd>{details.contact_name}</dd><dt>Owner login</dt><dd>{details.email}</dd><dt>WhatsApp</dt><dd>{details.phone}</dd><dt>Branding</dt><dd>Logo{shownBanner ? ' and banner' : ''} · {details.brand_color}</dd></dl>
          <div className="store-review-collection"><h3>Collection · {settings.length} templates</h3>{settings.map(item => <div key={item.template_id}><span>{catalog.find(template => template.id === item.template_id)?.name || `Template ${item.template_id}`}{item.is_premium ? ' · Premium' : ''}</span><strong>{money(salePrice(item))}</strong></div>)}</div>
          <label className="store-checkbox store-publish-option"><input type="checkbox" checked={details.activate} onChange={event => change('activate', event.target.checked)} />Publish the storefront when setup finishes</label><p className="store-step-note">{details.activate ? 'Guests will be able to open the store address after setup.' : 'Keep the storefront private. You can publish it later from Recent store setups.'} The owner receives a setup link you can copy and share.</p>
        </>}
      </fieldset>
      {preparing && <p role="status">Preparing image…</p>}
      {started && <div className="store-resume-assets"><p>The store details are reserved. Retry to finish this setup; uploaded images are reused when resuming.</p>{(!resume?.logo_uploaded && !logo) && <label>Store logo<input disabled={busy || preparing} type="file" accept="image/png,image/jpeg,image/webp" onChange={event => void chooseImage(event.target.files?.[0], 'logo')} /></label>}{resume && !resume.banner_uploaded && <label>Banner (optional)<input disabled={busy || preparing} type="file" accept="image/png,image/jpeg,image/webp" onChange={event => void chooseImage(event.target.files?.[0], 'banner')} /></label>}</div>}
      <footer className="store-onboarding-controls"><span>{started ? 'Resume the same store setup' : `Step ${step + 1} of ${steps.length}`}</span><div>{step > 0 && !started && <button type="button" className="secondary-action" disabled={busy || preparing} onClick={() => { setError(''); setStep(value => value - 1) }}>Back</button>}<button className="primary-action" disabled={busy || preparing || (!resume && (catalogLoading || !!catalogError))}>{busy ? step === 3 ? 'Setting up store…' : 'Checking…' : step === 3 ? started ? 'Retry setup' : 'Create store' : 'Continue'} →</button></div></footer>
    </form>
  </section>
}
