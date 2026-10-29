import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { isSupabaseConfigured, supabase } from '../lib/supabase'
import { storeInvitationExample } from '../invitations/templateData'
import { TEMPLATE_INTRO_VIDEOS, TEMPLATE_INTRO_IMAGES } from '../lib/templateCardData'
import './StoreLanding.css'

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
  sale_type: string | null
  sale_value: number | null
  is_premium: boolean
  demo_data: Record<string, unknown> | null
}

interface StoreData {
  company: StoreCompany
  templates: StoreTemplate[]
}

function LineIcon({ name }: { name: string }) {
  const paths: Record<string, string> = {
    grid: 'M3 3h6v6H3zM15 3h6v6h-6zM3 15h6v6H3zM15 15h6v6h-6z',
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

function ButtonArrow() { return <svg className="button-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 12h15M13 5l7 7-7 7"/></svg> }

function categoryIconFor(category: string) {
  if (/hindu/i.test(category)) return 'lotus'
  if (/muslim/i.test(category)) return 'moon'
  if (/christian/i.test(category)) return 'cross'
  return 'ornament'
}

export default function StoreLanding({ slug }: { slug: string }) {
  const [data, setData] = useState<StoreData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selected, setSelected] = useState<number | null>(null)
  const [category, setCategory] = useState('All')
  const [previewLoaded, setPreviewLoaded] = useState(false)
  const phoneScreen = useRef<HTMLDivElement>(null)
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
    const resize = () => setScreenScale(Math.min(screen.clientWidth / 402, screen.clientHeight / 874))
    resize()
    const observer = new ResizeObserver(resize)
    observer.observe(screen)
    return () => observer.disconnect()
  }, [])

  const company = data?.company
  const templates = data?.templates ?? []
  const accent = company?.brand_color || '#a5753c'
  const categories = ['All', ...new Set(templates.map(t => t.category).filter(Boolean))]
  const filtered = templates.filter(t => category === 'All' || t.category === category)
  const currentTemplate = templates.find(t => t.id === selected) ?? templates[0]
  const previewData = currentTemplate ? storeInvitationExample(currentTemplate.id, currentTemplate.demo_data) : undefined

  useLayoutEffect(() => {
    if (!previewData) return
    try { sessionStorage.setItem('shaadi-client-live-preview', JSON.stringify(previewData)) } catch {}
  }, [previewData])

  const whatsappLink = company?.phone ? `https://wa.me/${company.phone.replace(/\D/g, '')}?text=${encodeURIComponent('Hi, I saw your invitation templates and would like to know more!')}` : null

  function chooseTemplate(id: number) {
    if (id !== selected) { setSelected(id); setPreviewLoaded(false) }
    if (window.matchMedia('(max-width: 760px)').matches) document.getElementById('store-preview')?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' })
  }

  if (loading) return <main className="store-page store-loading" role="status"><p>Loading…</p></main>
  if (error || !company) return <main className="store-page store-error"><h1>Store not found</h1><p>{error || 'This store does not exist.'}</p></main>

  return <div className="store-page" style={{ '--store-accent': accent } as React.CSSProperties}>
    <header className="store-header">
      {company.logo_path ? <img className="store-logo" src={company.logo_path} alt={company.company_name}/> : <span className="store-brand-name">{company.company_name}</span>}
      {whatsappLink && <a className="store-cta" href={whatsappLink} target="_blank" rel="noreferrer">Contact Us <ButtonArrow/></a>}
    </header>

    <main className="store-content">
      <div className="store-catalog">
        <section className="store-hero" style={company.hero_image_path ? { backgroundImage: `url(${company.hero_image_path})` } : undefined}>
          <div className="store-hero-overlay"/>
          <div className="store-hero-copy">
            <h1>{company.company_name}</h1>
            {company.tagline && <p className="store-tagline">{company.tagline}</p>}
            <a className="store-cta" href="#store-templates" onClick={e => { e.preventDefault(); document.getElementById('store-templates')?.scrollIntoView({ behavior: 'smooth' }) }}>Browse Templates <ButtonArrow/></a>
          </div>
        </section>

        <section className="store-templates" id="store-templates" aria-labelledby="store-templates-title">
          {categories.length > 2 && <div className="store-filters" role="group" aria-label="Template categories">
            {categories.map(label => <button key={label} className={category === label ? 'active' : ''} aria-pressed={category === label} onClick={() => setCategory(label)}><span aria-hidden="true"><LineIcon name={categoryIconFor(label)}/></span>{label}</button>)}
          </div>}
          <div className="store-templates-heading">
            <h2 id="store-templates-title">Our Invitation Collection</h2>
            <span>{filtered.length} {filtered.length === 1 ? 'Design' : 'Designs'}</span>
          </div>
          <div className="store-template-list">
            {filtered.map(template => <article className={`store-card${selected === template.id ? ' is-selected' : ''}`} key={template.id}>
              <div className="store-card-image">
                {TEMPLATE_INTRO_VIDEOS[template.id]
                  ? <video src={TEMPLATE_INTRO_VIDEOS[template.id]} poster={template.thumbnail_url} autoPlay muted loop playsInline aria-hidden="true" ref={el => { if (el) { el.muted = true; el.setAttribute('muted', ''); el.play().catch(() => {}) } }}/>
                  : <img src={TEMPLATE_INTRO_IMAGES[template.id] ?? template.thumbnail_url} alt={`${template.name} invitation`} loading="lazy"/>}
                <button className="store-card-select" aria-label={`Preview ${template.name}`} aria-pressed={selected === template.id} onClick={() => chooseTemplate(template.id)}/>
                {template.is_private && <span className="store-exclusive-badge">Exclusive</span>}
                {template.price != null && <span className="store-price-badge">{template.sale_value ? <><s>₹{template.price}</s> ₹{template.sale_type === 'flat' ? template.price - template.sale_value : Math.round(template.price * (1 - template.sale_value / 100))}</> : <>₹{template.price}</>}</span>}
              </div>
              <button className="store-card-name" onClick={() => chooseTemplate(template.id)}>{template.name}</button>
              <p className="store-card-category">{template.category}</p>
            </article>)}
          </div>
          {filtered.length === 0 && <div className="store-empty"><p>No templates in this category yet.</p><button onClick={() => setCategory('All')}>View all templates</button></div>}
        </section>
        <footer className="store-footer">
          <span>Powered by <strong>Shaadi Invites</strong></span>
          {whatsappLink && <a href={whatsappLink} target="_blank" rel="noreferrer">Get in touch <ButtonArrow/></a>}
        </footer>
      </div>

      <aside id="store-preview" className="store-preview" aria-label="Live invitation preview">
        <div className="phone-stage"><div className="iphone-frame"><div className="iphone-screen" ref={phoneScreen}>
          {!previewLoaded && currentTemplate && <img className="phone-placeholder" src={currentTemplate.thumbnail_url} alt="Loading preview"/>}
          {currentTemplate && <iframe key={selected} src="/client/live-preview" title={`${currentTemplate.name}: preview`} allow="autoplay; fullscreen" style={{ transform: `scale(${screenScale})`, opacity: previewLoaded ? 1 : 0 }} onLoad={() => setPreviewLoaded(true)} allowFullScreen/>}
          <div className="dynamic-island" aria-hidden="true"><span/></div>
        </div></div></div>
        {currentTemplate && <div className="store-preview-info">
          <h3>{currentTemplate.name}</h3>
          <p>{currentTemplate.category}</p>
          {whatsappLink && <a className="store-cta" href={whatsappLink} target="_blank" rel="noreferrer">Order This Template <ButtonArrow/></a>}
        </div>}
      </aside>
    </main>
  </div>
}
