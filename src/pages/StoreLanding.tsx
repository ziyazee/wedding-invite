import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { isSupabaseConfigured, supabase } from '../lib/supabase'
import { companyAssetURL } from '../lib/companyAssets'
import { storeInvitationExample } from '../invitations/templateData'
import InvitationPreviewFrame from '../invitations/InvitationPreviewFrame'
import { TEMPLATE_DISPLAY_ORDER } from '../invitations/model'
import { TEMPLATE_INTRO_VIDEOS, TEMPLATE_INTRO_IMAGES, TEMPLATE_THUMBNAIL_OVERRIDES } from '../lib/templateCardData'
import './StoreLanding.css'
import SiteFonts from '../SiteFonts'

interface StoreCompany {
  id: number
  company_name: string
  slug: string
  tagline: string | null
  brand_color: string | null
  hero_image_path: string | null
  logo_path: string | null
  branding_base_url?: string | null
  phone: string | null
}

interface StoreTemplate {
  id: number
  template_code: string
  name: string
  category: string
  thumbnail_url: string
  preview_url: string
  is_active: boolean
  is_private: boolean
  display_order: number
  price: number | null
  sale_type: 'none' | 'percentage' | 'fixed' | null
  sale_value: number | null
  is_premium: boolean
  demo_data: Record<string, unknown> | null
}

interface StoreData {
  company: StoreCompany
  templates: StoreTemplate[]
}

const storePriceFormat = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 })

function storeTemplatePricing(template: StoreTemplate) {
  if (template.price == null) return null
  const price = Number(template.price)
  if (!Number.isFinite(price) || price < 0) return null
  const discount = Math.max(0, Number(template.sale_value) || 0)
  const sellingPrice = template.sale_type === 'fixed'
    ? Math.max(0, price - discount)
    : template.sale_type === 'percentage'
      ? Math.floor(price * (1 - Math.min(100, discount) / 100))
      : price
  const discountLabel = sellingPrice < price
    ? template.sale_type === 'percentage'
      ? `${Math.min(100, discount)}% OFF`
      : `${storePriceFormat.format(price - sellingPrice)} OFF`
    : null
  return { price, sellingPrice, discountLabel }
}

function StoreTemplatePrice({ template }: { template: StoreTemplate }) {
  const pricing = storeTemplatePricing(template)
  if (!pricing) return null
  const { price, sellingPrice } = pricing
  return <span className="store-price-badge">
    {sellingPrice < price && <><s>{storePriceFormat.format(price)}</s>{' '}</>}
    {storePriceFormat.format(sellingPrice)}
  </span>
}

function StoreTemplateBadges({ template }: { template: StoreTemplate }) {
  const discountLabel = storeTemplatePricing(template)?.discountLabel
  if (!discountLabel && !template.is_private && !template.is_premium) return null
  return <div className="store-card-badges">
    {discountLabel && <span className="store-discount-badge">{discountLabel}</span>}
    {(template.is_private || template.is_premium) && <span className="store-exclusive-badge">{template.is_private ? 'Exclusive' : 'Premium'}</span>}
  </div>
}

function LineIcon({ name }: { name: string }) {
  const paths: Record<string, string> = {
    grid: 'M3 3h6v6H3zM15 3h6v6h-6zM3 15h6v6H3zM15 15h6v6h-6z',
    classic: 'M3 9 12 3l9 6H3Zm2 2v9m5-9v9m4-9v9m5-9v9M3 21h18',
    lotus: 'M12 21C5 17 6 9 12 3c6 6 7 14 0 18ZM12 21C4 21 1 15 2 10c6 0 9 5 10 11Zm0 0c8 0 11-6 10-11-6 0-9 5-10 11Z',
    moon: 'M20 16A9 9 0 0 1 9 3a9 9 0 1 0 11 13Z',
    cross: 'M10 3h4v6h5v4h-5v9h-4v-9H5V9h5Z',
    ornament: 'M12 2 16 6 12 10 8 6ZM12 14l4 4-4 4-4-4ZM2 12l4-4 4 4-4 4ZM14 12l4-4 4 4-4 4Z',
    heart: 'M12 21 3 12C-3 4 7-1 12 6 17-1 27 4 21 12Z',
    phone: 'M7 2h10a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1ZM11 19h2',
    play: 'm7 3 14 9-14 9Z',
  }
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={paths[name] || paths.ornament}/></svg>
}

function categoryIconFor(category: string) {
  if (/classic/i.test(category)) return 'classic'
  if (/hindu/i.test(category)) return 'lotus'
  if (/muslim/i.test(category)) return 'moon'
  if (/christian/i.test(category)) return 'cross'
  return 'ornament'
}

export default function StoreLanding({ slug }: { slug: string }) {
  const [data, setData] = useState<StoreData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [failedLogoSlug, setFailedLogoSlug] = useState<string | null>(null)
  const [selected, setSelected] = useState<number | null>(null)
  const [category, setCategory] = useState('All')
  const [mobileTab, setMobileTab] = useState<'designs' | 'preview'>('designs')
  const [showNamePrompt, setShowNamePrompt] = useState(false)
  const [customerName, setCustomerName] = useState('')
  const categoryBar = useRef<HTMLDivElement>(null)
  const templateGrid = useRef<HTMLDivElement>(null)
  const categoryTransition = useRef(false)
  const [categoryHighlight, setCategoryHighlight] = useState<{ left: number; width: number } | null>(null)
  const [previewLoaded, setPreviewLoaded] = useState(false)
  const previewFrame = useRef<HTMLIFrameElement>(null)

  useEffect(() => {
    if (!supabase || !isSupabaseConfigured) { setError('Store not configured.'); setLoading(false); return }
    let cancelled = false
    supabase.rpc('get_store_landing', { p_slug: slug }).then(({ data: result, error: rpcError }) => {
      if (cancelled) return
      if (rpcError || !result?.company) { setError('Store not found.'); setLoading(false); return }
      const store = result as StoreData
      setData({ ...store, templates: (store.templates ?? []).map(template => ({
        ...template,
        thumbnail_url: TEMPLATE_THUMBNAIL_OVERRIDES[template.id] ?? template.thumbnail_url,
      })) })
      setSelected(result.templates?.[0]?.id ?? null)
      setLoading(false)
    })
    return () => { cancelled = true }
  }, [slug])


  useLayoutEffect(() => {
    const bar = categoryBar.current
    const active = bar?.querySelector<HTMLButtonElement>('button[aria-pressed="true"]')
    if (!bar || !active) return
    const measure = () => setCategoryHighlight({ left: active.offsetLeft, width: active.offsetWidth })
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(bar)
    observer.observe(active)
    return () => observer.disconnect()
  }, [category, data, loading, error])

  useLayoutEffect(() => {
    const grid = templateGrid.current
    if (!categoryTransition.current) return
    if (!grid || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const animation = grid.animate(
      [{ opacity: 0.9 }, { opacity: 1 }],
      { duration: 280, easing: 'ease-out' },
    )
    return () => {
      animation.cancel()
    }
  }, [category])

  const company = data?.company
  const companyLogo = companyAssetURL(company, 'logo')
  const heroBanner = companyAssetURL(company, 'banner')
  const templates = [...(data?.templates ?? [])].sort((a, b) => (TEMPLATE_DISPLAY_ORDER[a.id] ?? 999) - (TEMPLATE_DISPLAY_ORDER[b.id] ?? 999))
  const accent = company?.brand_color || '#754522'
  const categories = ['All', ...new Set(templates.map(t => t.category).filter(Boolean))]
  const filtered = templates.filter(t => category === 'All' || t.category === category)
  const currentTemplate = templates.find(t => t.id === selected) ?? templates[0]
  const previewData = useMemo(() => {
    const example = currentTemplate ? storeInvitationExample(currentTemplate.id, currentTemplate.demo_data) : undefined
    if (!example || !company) return undefined
    return { ...example, companyLogo, companyName: company.company_name, companyPhone: company.phone || undefined }
  }, [currentTemplate, company, companyLogo])

  useLayoutEffect(() => {
    const syncPreview = () => {
      if (previewData) previewFrame.current?.contentWindow?.postMessage({ type: 'shaadi-preview-update', data: previewData }, window.location.origin)
    }
    const onPreviewReady = (event: MessageEvent) => {
      if (event.origin !== window.location.origin || event.source !== previewFrame.current?.contentWindow) return
      if (event.data?.type !== 'shaadi-preview-ready') return
      syncPreview()
      setPreviewLoaded(true)
    }
    window.addEventListener('message', onPreviewReady)
    syncPreview()
    return () => window.removeEventListener('message', onPreviewReady)
  }, [previewData])

  useLayoutEffect(() => {
    if (!previewData) return
    try { sessionStorage.setItem('shaadi-client-live-preview', JSON.stringify(previewData)) } catch {}
  }, [previewData])

  function chooseCategory(next: string) {
    if (next === category) return
    categoryTransition.current = true
    setCategory(next)
  }

  function chooseTemplate(id: number) {
    if (id !== selected) setSelected(id)
    if (window.matchMedia('(max-width: 760px)').matches) {
      setMobileTab('preview')
      setTimeout(() => document.getElementById('store-view-toggle')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 60)
    }
  }

  if (loading) return <main className="store-page store-loading" role="status"><p>Loading…</p></main>
  if (error || !company) return <main className="store-page store-error"><h1>Store not found</h1><p>{error || 'This store does not exist.'}</p></main>

  return <div className="store-page" style={{ '--store-accent': accent } as React.CSSProperties}>
    <SiteFonts/>

    <header className="store-header"/>

    <main className="store-content">
      <div className="store-catalog">
        <section id="store-top" className="store-hero" style={heroBanner ? { backgroundImage: `url(${JSON.stringify(heroBanner)})` } : undefined}>
          <div className="store-hero-overlay"/>
          <div className="store-hero-copy">
            {companyLogo && failedLogoSlug !== company.slug
              ? <img key={company.slug} className="store-hero-logo" src={companyLogo} alt={company.company_name} onError={() => setFailedLogoSlug(company.slug)}/>
              : <h1>{company.company_name}</h1>}
            <p className="store-tagline">{company.tagline?.trim() || 'Beautiful invitations for your special day'}</p>
          </div>
        </section>

        <section className="store-templates" id="store-templates" aria-labelledby="store-templates-title">
          <div className="store-templates-heading">
            <h2 id="store-templates-title">Our Invitation Collections</h2>
            <span>{filtered.length} {filtered.length === 1 ? 'Design' : 'Designs'}</span>
          </div>
          {categories.length > 2 && <div ref={categoryBar} className="store-filters" role="group" aria-label="Template categories">
            {categoryHighlight && <span className="store-filter-highlight" aria-hidden="true" style={{ width: categoryHighlight.width, transform: `translateX(${categoryHighlight.left}px)` }}/>}
            {categories.map(label => <button key={label} className={category === label ? 'active' : ''} aria-pressed={category === label} onClick={() => chooseCategory(label)}><span aria-hidden="true"><LineIcon name={categoryIconFor(label)}/></span>{label}</button>)}
          </div>}
          <div id="store-view-toggle" className="store-mobile-toggle" role="group" aria-label="View mode">
            <span className="store-toggle-highlight" aria-hidden="true" style={{ transform: mobileTab === 'preview' ? 'translateX(100%)' : 'translateX(0)' }}/>
            <button aria-pressed={mobileTab === 'designs'} className={mobileTab === 'designs' ? 'active' : ''} onClick={() => setMobileTab('designs')}>Designs</button>
            <button aria-pressed={mobileTab === 'preview'} className={mobileTab === 'preview' ? 'active' : ''} onClick={() => setMobileTab('preview')}>Preview</button>
          </div>
          <div ref={templateGrid} className={`store-template-list${mobileTab !== 'designs' ? ' store-mobile-hidden' : ''}`}>
            {filtered.map(template => <article className={`store-card${selected === template.id ? ' is-selected' : ''}${template.is_premium ? ' has-premium' : ''}`} key={template.id}>
              <div className="store-card-image">
                {TEMPLATE_INTRO_VIDEOS[template.id]
                  ? <video src={TEMPLATE_INTRO_VIDEOS[template.id]} poster={template.thumbnail_url} autoPlay muted loop playsInline aria-hidden="true" ref={el => { if (el) { el.muted = true; el.setAttribute('muted', ''); el.play().catch(() => {}) } }}/>
                  : <img src={TEMPLATE_INTRO_IMAGES[template.id] ?? template.thumbnail_url} alt={`${template.name} invitation`} loading="lazy"/>}
                <button className="store-card-select" aria-label={`Preview ${template.name}`} aria-pressed={selected === template.id} onClick={() => chooseTemplate(template.id)}/>
                {template.is_premium && <span className="store-premium-ribbon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m3 6 5 4 4-7 4 7 5-4-2 12H5L3 6Zm3 15h12"/></svg>
                  <span>✦ PREMIUM</span>
                </span>}
                <StoreTemplateBadges template={template}/>
                <StoreTemplatePrice template={template}/>
              </div>
              <button className="store-card-name" onClick={() => chooseTemplate(template.id)}>{template.name}</button>
              <p className="store-card-category">{template.category}</p>
            </article>)}
          </div>
          {filtered.length === 0 && <div className={`store-empty${mobileTab !== 'designs' ? ' store-mobile-hidden' : ''}`}><p>No templates in this category yet.</p><button onClick={() => chooseCategory('All')}>View all templates</button></div>}
        </section>
      </div>

      <aside id="store-preview" className={`store-preview${mobileTab !== 'preview' ? ' store-mobile-hidden' : ''}`} aria-label="Live invitation preview">
        <div className="phone-stage"><div className="iphone-frame"><div className="iphone-screen">
          {!previewLoaded && currentTemplate && <img className="phone-placeholder" style={{ zIndex: 2, pointerEvents: 'none' }} src={currentTemplate.thumbnail_url} alt="Loading preview"/>}
          {currentTemplate && <InvitationPreviewFrame templateId={currentTemplate.id} addressText={company.company_name} ref={previewFrame} src="/client/live-preview?store=1" title={`${currentTemplate.name}: preview`} allow="autoplay; fullscreen" style={{ opacity: previewLoaded ? 1 : 0 }} onLoad={() => {
            if (previewData) previewFrame.current?.contentWindow?.postMessage({ type: 'shaadi-preview-update', data: previewData }, window.location.origin)
            setPreviewLoaded(true)
          }} allowFullScreen/>}
          <div className="dynamic-island" aria-hidden="true"><span/></div>
        </div></div></div>
        {currentTemplate && <div className="store-preview-info">
          <h3>{currentTemplate.name}</h3>
          <p>{currentTemplate.category}</p>
        </div>}
        {currentTemplate && company.phone && <div className="store-preview-info store-preview-action">
          <a className="store-whatsapp-btn" role="button" onClick={e => { e.preventDefault(); setCustomerName(''); setShowNamePrompt(true) }} href="#">
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            Order on WhatsApp
          </a>
        </div>}
      </aside>

      {showNamePrompt && <div className="store-name-overlay" onClick={() => setShowNamePrompt(false)}>
        <form className="store-name-prompt" onClick={e => e.stopPropagation()} onSubmit={e => {
          e.preventDefault()
          const name = customerName.trim()
          if (!name || !company.phone || !currentTemplate) return
          window.open(`https://wa.me/${company.phone.replace(/\D/g, '')}?text=${encodeURIComponent(`Hey!\nThis is ${name}.\nI'm looking to get a wedding invitation designed using the ${currentTemplate.name} design.`)}`, '_blank')
          setShowNamePrompt(false)
        }}>
          <h3>What's your name?</h3>
          <input type="text" placeholder="Enter your name" value={customerName} onChange={e => setCustomerName(e.target.value)} autoFocus maxLength={60}/>
          <button type="submit" disabled={!customerName.trim()}>
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            Order on WhatsApp
          </button>
        </form>
      </div>}
    </main>
  </div>
}
