import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { isSupabaseConfigured, supabase } from '../lib/supabase'
import { storeInvitationExample } from '../invitations/templateData'
import { TEMPLATE_INTRO_VIDEOS, TEMPLATE_INTRO_IMAGES } from '../lib/templateCardData'
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

function StoreTemplatePrice({ template }: { template: StoreTemplate }) {
  if (template.price == null) return null
  const price = Number(template.price)
  if (!Number.isFinite(price) || price < 0) return null
  const discount = Math.max(0, Number(template.sale_value) || 0)
  const sellingPrice = template.sale_type === 'fixed'
    ? Math.max(0, price - discount)
    : template.sale_type === 'percentage'
      ? Math.floor(price * (1 - Math.min(100, discount) / 100))
      : price
  return <span className="store-price-badge">
    {sellingPrice < price && <><s>{storePriceFormat.format(price)}</s>{' '}</>}
    {storePriceFormat.format(sellingPrice)}
  </span>
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
  const categoryBar = useRef<HTMLDivElement>(null)
  const templateGrid = useRef<HTMLDivElement>(null)
  const categoryTransition = useRef(false)
  const [categoryHighlight, setCategoryHighlight] = useState<{ left: number; width: number } | null>(null)
  const [previewLoaded, setPreviewLoaded] = useState(false)
  const phoneScreen = useRef<HTMLDivElement>(null)
  const previewFrame = useRef<HTMLIFrameElement>(null)
  const [screenScale, setScreenScale] = useState(0.42)

  useEffect(() => {
    if (!supabase || !isSupabaseConfigured) { setError('Store not configured.'); setLoading(false); return }
    let cancelled = false
    supabase.rpc('get_store_landing', { p_slug: slug }).then(({ data: result, error: rpcError }) => {
      if (cancelled) return
      if (rpcError || !result?.company) { setError('Store not found.'); setLoading(false); return }
      setData(result as StoreData)
      setSelected(result.templates?.[0]?.id ?? null)
      setLoading(false)
    })
    return () => { cancelled = true }
  }, [slug])

  useLayoutEffect(() => {
    const screen = phoneScreen.current
    if (!screen) return
    const resize = () => setScreenScale(screen.getBoundingClientRect().width / 402)
    resize()
    const observer = new ResizeObserver(resize)
    observer.observe(screen)
    return () => observer.disconnect()
  }, [loading, error])

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
  const companyAsset = company ? encodeURIComponent(company.slug) : undefined
  const companyLogo = companyAsset ? `/company-logos/${companyAsset}.png` : undefined
  const heroBanner = companyAsset ? `/landing/${companyAsset}.png` : undefined
  const templates = data?.templates ?? []
  const accent = company?.brand_color || '#754522'
  const categories = ['All', ...new Set(templates.map(t => t.category).filter(Boolean))]
  const filtered = templates.filter(t => category === 'All' || t.category === category)
  const currentTemplate = templates.find(t => t.id === selected) ?? templates[0]
  const previewData = useMemo(() => currentTemplate ? storeInvitationExample(currentTemplate.id, currentTemplate.demo_data) : undefined, [currentTemplate])

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
    if (window.matchMedia('(max-width: 760px)').matches) document.getElementById('store-preview')?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' })
  }

  if (loading) return <main className="store-page store-loading" role="status"><p>Loading…</p></main>
  if (error || !company) return <main className="store-page store-error"><h1>Store not found</h1><p>{error || 'This store does not exist.'}</p></main>

  return <div className="store-page" style={{ '--store-accent': accent } as React.CSSProperties}>
    <SiteFonts/>
    <header className="store-header">
      <a className="store-brand" href="#store-top" aria-label={`${company.company_name} home`}>
        {companyLogo && failedLogoSlug !== company.slug ? <img key={company.slug} className="store-logo" src={companyLogo} alt="" onError={() => setFailedLogoSlug(company.slug)}/> : <svg className="store-brand-mark" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden="true"><path d="m5 10 5 5 6-9 6 9 5-5-3 14H8L5 10Zm4 18h14"/></svg>}
        <span className="store-brand-name">{company.company_name}</span>
      </a>
    </header>

    <main className="store-content">
      <div className="store-catalog">
        <section id="store-top" className="store-hero" style={heroBanner ? { backgroundImage: `url(${JSON.stringify(heroBanner)})` } : undefined}>
          <div className="store-hero-overlay"/>
          <div className="store-hero-copy">
            <h1>{company.company_name}</h1>
            <p className="store-tagline">{company.tagline?.trim() || 'Beautiful invitations for your special day'}</p>
          </div>
        </section>

        <section className="store-templates" id="store-templates" aria-labelledby="store-templates-title">
          <div className="store-templates-heading">
            <h2 id="store-templates-title">Our Invitation Collection</h2>
            <span>{filtered.length} {filtered.length === 1 ? 'Design' : 'Designs'}</span>
          </div>
          {categories.length > 2 && <div ref={categoryBar} className="store-filters" role="group" aria-label="Template categories">
            {categoryHighlight && <span className="store-filter-highlight" aria-hidden="true" style={{ width: categoryHighlight.width, transform: `translateX(${categoryHighlight.left}px)` }}/>}
            {categories.map(label => <button key={label} className={category === label ? 'active' : ''} aria-pressed={category === label} onClick={() => chooseCategory(label)}><span aria-hidden="true"><LineIcon name={categoryIconFor(label)}/></span>{label}</button>)}
          </div>}
          <div ref={templateGrid} className="store-template-list">
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
                {template.is_private && <div className="store-card-badges"><span className="store-exclusive-badge">Exclusive</span></div>}
                <StoreTemplatePrice template={template}/>
              </div>
              <button className="store-card-name" onClick={() => chooseTemplate(template.id)}>{template.name}</button>
              <p className="store-card-category">{template.category}</p>
            </article>)}
          </div>
          {filtered.length === 0 && <div className="store-empty"><p>No templates in this category yet.</p><button onClick={() => chooseCategory('All')}>View all templates</button></div>}
        </section>
        <footer className="store-footer" id="store-vendors">
          <span>Powered by <strong>Shaadi Invites</strong></span>
        </footer>
      </div>

      <aside id="store-preview" className="store-preview" aria-label="Live invitation preview">
        <div className="phone-stage"><div className="iphone-frame"><div className="iphone-screen" ref={phoneScreen}>
          {!previewLoaded && currentTemplate && <img className="phone-placeholder" src={currentTemplate.thumbnail_url} alt="Loading preview"/>}
          {currentTemplate && <iframe ref={previewFrame} src="/client/live-preview?store=1" title={`${currentTemplate.name}: preview`} allow="autoplay; fullscreen" style={{ transform: `scale(${screenScale})`, opacity: previewLoaded ? 1 : 0 }} onLoad={() => {
            if (previewData) previewFrame.current?.contentWindow?.postMessage({ type: 'shaadi-preview-update', data: previewData }, window.location.origin)
            setPreviewLoaded(true)
          }} allowFullScreen/>}
          <div className="dynamic-island" aria-hidden="true"><span/></div>
        </div></div></div>
        {currentTemplate && <div className="store-preview-info">
          <h3>{currentTemplate.name}</h3>
          <p>{currentTemplate.category}</p>
        </div>}
      </aside>
    </main>
  </div>
}
