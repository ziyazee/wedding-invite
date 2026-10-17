import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { createPortal } from 'react-dom'
import { designs, validateDetails } from '../invitations/model'
import type { Celebration, InvitationData } from '../invitations/model'
import { isSupabaseConfigured, supabase } from '../lib/supabase'
import { DashboardAccess, signOutToLogin } from './DashboardAccess'
import './Workspaces.css'
import './ClientDashboard.css'

type Order = { id: number; groom_name: string; bride_name: string; status: string; created_at: string; form_data: InvitationData; published_path: string | null; published_url: string | null; published_at: string | null; expires_at: string | null; rejection_reason: string | null; template_code: string; phone_number: string; price?: number | null }
type Template = { id: number; template_code: string; name: string; category: string; thumbnail_url: string; preview_url: string }
const initial: InvitationData = { template: 2, groom: 'Mohad', bride: 'Rahma', date: '2026-12-20', time: '11:00', offset: '+05:30', venue: 'TMA Pai Convention Centre', address: 'Mangalore', map: 'https://maps.app.goo.gl/1xf3k59k9QEaoQ717', message: 'With the blessings of Allah and the love of our families, we invite you to celebrate the beginning of our forever.', groomFamily: '', brideFamily: '', dressCode: '', giftNote: '', music: '/bisara.mp3', gallery: '', events: [] }
const initialWeddingEvent = 'Nikah & Wedding'
const initialExtraEvents: Celebration[] = [
  { title: 'Mehendi Programme', date: '2026-12-17', time: '11:00', venue: 'Silvergate Homestay', address: 'Chikmagaluru', map: 'https://maps.app.goo.gl/uaSHaAyVXCriCCrw5' },
  { title: 'Mehendi Mehfil', date: '2026-12-19', time: '17:00', venue: 'Royal Garden Beach Resort', address: 'Ullal, Mangalore', map: 'https://maps.app.goo.gl/43ui6W3Hn6N2cbui8' },
  { title: 'Wedding Reception', date: '2026-12-21', time: '19:00', venue: 'Shoolin Palace', address: 'Airport Road, Mangalore', map: 'https://maps.app.goo.gl/ARcdN5shsLC5og2f8' },
  { title: 'Bride’s Reception — Chikmagaluru', date: '2026-12-24', time: '11:00', venue: 'Heritage Convention Hall', address: 'Chikmagaluru', map: 'https://maps.app.goo.gl/NbvAqoYtcacD5Xas6' },
]
const companyLogoFiles: Record<string, string> = {
  'city mart': 'city mart.png',
  'king of cards': 'King of cards.png',
}
const statusTitle: Record<string, string> = { CREATED: 'New', IN_PROGRESS: 'In progress', READY: 'Published', REJECTED: 'Needs changes' }

export default function ClientDashboard() {
  return <DashboardAccess role="CLIENT"><ClientWorkspace /></DashboardAccess>
}

function ClientWorkspace() {
  const previewScreen = useRef<HTMLDivElement>(null)
  const [previewScale, setPreviewScale] = useState(0.75)
  const [tab, setTab] = useState<'Overview' | 'Templates' | 'Orders' | 'Settings'>('Templates')
  const [orders, setOrders] = useState<Order[]>([])
  const [viewOrder, setViewOrder] = useState<Order | null>(null)
  const [allTemplates, setAllTemplates] = useState<Template[]>([])
  const [company, setCompany] = useState<{ company_name: string; contact_name: string | null } | null>(null)
  const [companyLogo, setCompanyLogo] = useState('/logo.png')
  const [details, setDetails] = useState(initial)
  const [phoneNumber, setPhoneNumber] = useState('')
  const [weddingEventTitle, setWeddingEventTitle] = useState(initialWeddingEvent)
  const [extraEvents, setExtraEvents] = useState<Celebration[]>(initialExtraEvents)
  const [selected, setSelected] = useState<number | null>(null)
  const [showDetails, setShowDetails] = useState(false)
  const [formStep, setFormStep] = useState(0)
  const [formStepCount, setFormStepCount] = useState(0)
  const [workflowHost, setWorkflowHost] = useState<HTMLFormElement | null>(null)
  const [previewId, setPreviewId] = useState<number | null>(null)
  const [templateSearch, setTemplateSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('ALL')
  const [categoryDirection, setCategoryDirection] = useState<'left' | 'right'>('right')
  const [templateSort, setTemplateSort] = useState<'CURATED' | 'NAME'>('CURATED')
  const [orderSearch, setOrderSearch] = useState('')
  const [orderDateFrom, setOrderDateFrom] = useState('')
  const [orderDateTo, setOrderDateTo] = useState('')
  const [ordersPage, setOrdersPage] = useState(0)
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)
  const [review, setReview] = useState(false)
  const [notice, setNotice] = useState('')
  const [error, setError] = useState('')

  const refresh = useCallback(async () => {
    if (!supabase || !isSupabaseConfigured) { setError('Connect Supabase to load your company dashboard.'); setLoading(false); return }
    const { data, error: authError } = await supabase.auth.getUser()
    if (authError || !data.user) { setLoading(false); return }
    const [templatesResult, ordersResult] = await Promise.all([
      supabase.from('invitation_templates').select('id,template_code,name,category,thumbnail_url,preview_url').eq('is_active', true).order('id'),
      supabase.from('orders').select('*').order('created_at', { ascending: false }),
    ])
    if (templatesResult.error) setError(templatesResult.error.message)
    if (ordersResult.error) setError(ordersResult.error.message)
    const activeTemplates = (templatesResult.data || []) as Template[]
    setAllTemplates(activeTemplates)
    const firstTemplate = activeTemplates[0]
    if (firstTemplate) { setSelected(current => current ?? firstTemplate.id); setPreviewId(current => current ?? firstTemplate.id) }
    setOrders((ordersResult.data || []) as Order[])
    if (data.user.email) {
      const { data: companyData } = await supabase.from('companies').select('id,company_name,contact_name').ilike('email', data.user.email).maybeSingle()
      setCompany(companyData)
      const logoFile = companyData?.company_name
        ? companyLogoFiles[companyData.company_name.trim().replace(/\s+/g, ' ').toLowerCase()]
        : undefined
      setCompanyLogo(logoFile ? `/company-logos/${encodeURIComponent(logoFile)}` : '/logo.png')
    }
    setLoading(false)
  }, [])

  useEffect(() => { void refresh() }, [refresh])
  useEffect(() => {
    if (tab !== 'Templates' || !showDetails) { setFormStepCount(0); setWorkflowHost(null); return }
    const form = document.querySelector<HTMLFormElement>('.order-form')
    if (!form) { setFormStepCount(0); setWorkflowHost(null); return }
    form.noValidate = true
    setWorkflowHost(form)
    let progress = form.querySelector<HTMLDivElement>('.client-order-progress')
    if (!progress) {
      progress = document.createElement('div')
      progress.className = 'client-order-progress'
      progress.setAttribute('role', 'progressbar')
      progress.setAttribute('aria-label', 'Order form progress')
      const fill = document.createElement('span')
      progress.append(fill)
      form.insertBefore(progress, form.firstChild)
    }
    const progressValue = review ? form.querySelectorAll<HTMLFieldSetElement>(':scope > fieldset').length : formStep + 1
    const progressMax = Math.max(1, form.querySelectorAll<HTMLFieldSetElement>(':scope > fieldset').length)
    progress.setAttribute('aria-valuemin', '0')
    progress.setAttribute('aria-valuemax', String(progressMax))
    progress.setAttribute('aria-valuenow', String(progressValue))
    const progressFill = progress.firstElementChild as HTMLElement | null
    if (progressFill) progressFill.style.width = `${Math.min(100, progressValue / progressMax * 100)}%`
    const sections = Array.from(form.querySelectorAll<HTMLFieldSetElement>(':scope > fieldset'))
    setFormStepCount(sections.length)
    const step = Math.min(formStep, Math.max(0, sections.length - 1))
    sections.forEach((section, index) => { section.style.display = review ? 'none' : index === step ? 'block' : 'none' })
  }, [formStep, review, selected, showDetails, tab])
  useEffect(() => {
    if (!supabase) return
    let channel: ReturnType<NonNullable<typeof supabase>['channel']> | undefined
    let active = true
    void (async () => {
      const { data: { user } } = await supabase!.auth.getUser()
      if (!user || !active) return
      if (!user.email || !active) return
      const { data: company } = await supabase!.from('companies').select('id').ilike('email', user.email).maybeSingle()
      const companyId = Number(company?.id)
      if (!Number.isSafeInteger(companyId) || companyId <= 0 || !active) return
      channel = supabase!.channel(`client-orders-${companyId}`).on('postgres_changes', { event: '*', schema: 'public', table: 'orders', filter: `company_id=eq.${companyId}` }, () => { void refresh() }).subscribe()
    })()
    return () => { active = false; if (channel) void supabase!.removeChannel(channel) }
  }, [refresh])
  const counts = useMemo(() => ({ total: orders.length }), [orders])
  const now = new Date()
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const yesterdayStart = new Date(todayStart); yesterdayStart.setDate(yesterdayStart.getDate()-1)
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
  const previousMonthStart = new Date(now.getFullYear(), now.getMonth()-1, 1)
  const datedOrders = orders.map(order => ({ order, date: new Date(order.created_at) }))
  const todayOrders = datedOrders.filter(item => item.date >= todayStart && item.date < new Date(todayStart.getTime()+86400000))
  const yesterdayOrders = datedOrders.filter(item => item.date >= yesterdayStart && item.date < todayStart)
  const thisMonthOrders = datedOrders.filter(item => item.date >= monthStart && item.date <= now)
  const previousMonthOrders = datedOrders.filter(item => item.date >= previousMonthStart && item.date < monthStart)
  const priceIsSet = (order: Order) => typeof order.price === 'number'
  const formatRevenue = (items: typeof datedOrders) => items.length > 0 && items.every(item=>priceIsSet(item.order)) ? new Intl.NumberFormat('en-IN',{style:'currency',currency:'INR',maximumFractionDigits:0}).format(items.reduce((sum,item)=>sum+(item.order.price||0),0)) : '—'
  const revenueTrend = (items: typeof datedOrders) => items.length > 0 && items.every(item=>priceIsSet(item.order)) ? items.reduce((sum,item)=>sum+(item.order.price||0),0) : null
  const changeLabel = (current: number, previous: number, period: string) => previous > 0 ? `${current>=previous?'↑':'↓'} ${Math.round(Math.abs((current-previous)/previous)*100)}% from ${period}` : `No ${period} comparison`
  const monthOrderChange = changeLabel(thisMonthOrders.length, previousMonthOrders.length, 'last month')
  const todayOrderChange = changeLabel(todayOrders.length, yesterdayOrders.length, 'yesterday')
  const monthRevenue = revenueTrend(thisMonthOrders)
  const previousMonthRevenue = revenueTrend(previousMonthOrders)
  const todayRevenue = revenueTrend(todayOrders)
  const yesterdayRevenue = revenueTrend(yesterdayOrders)
  const revenueChangeLabel = (current: number | null, previous: number | null, period: string) => current !== null && previous !== null ? changeLabel(current, previous, period) : 'Price tracking unavailable'
  const filtered = orders.filter(order => {
    const submitted = order.created_at.slice(0, 10)
    return `${order.id} ${order.groom_name} ${order.bride_name} ${order.phone_number}`.toLowerCase().includes(orderSearch.toLowerCase()) && (!orderDateFrom || submitted >= orderDateFrom) && (!orderDateTo || submitted <= orderDateTo)
  })
  const categories = useMemo(() => [...new Set(allTemplates.map(template => template.category).filter(Boolean))], [allTemplates])
  const templates = allTemplates.filter(template => (categoryFilter === 'ALL' || template.category === categoryFilter) && `${template.name} ${template.category}`.toLowerCase().includes(templateSearch.trim().toLowerCase())).sort((a,b)=>templateSort==='NAME'?a.name.localeCompare(b.name):a.id-b.id)
  const chosen = allTemplates.find(template => template.id === selected)
  const previewTemplate = allTemplates.find(template => template.id === previewId) || chosen || allTemplates[0]
  useLayoutEffect(() => {
    if (tab !== 'Templates') return
    const screen = previewScreen.current
    if (!screen) return
    const resize = () => setPreviewScale(Math.min(screen.clientWidth / 402, screen.clientHeight / 874))
    resize()
    const observer = new ResizeObserver(resize)
    observer.observe(screen)
    return () => observer.disconnect()
  }, [tab, previewTemplate?.id])
  const livePreviewDetails = useMemo<InvitationData>(() => ({
    ...details,
    template: showDetails ? selected ?? previewTemplate?.id ?? details.template : previewTemplate?.id ?? details.template,
    events: [{ title: weddingEventTitle, date: details.date, time: details.time, venue: details.venue, address: details.address, map: details.map }, ...extraEvents],
  }), [details, extraEvents, previewTemplate?.id, selected, showDetails, weddingEventTitle])
  useEffect(() => {
    if (tab !== 'Templates' || !previewTemplate) return
    try { sessionStorage.setItem('shaadi-client-live-preview', JSON.stringify(livePreviewDetails)) } catch { return }
    const frame = document.querySelector<HTMLIFrameElement>('.client-device-frame iframe')
    if (frame && new URL(frame.src, window.location.href).pathname !== '/client/live-preview') frame.src = '/client/live-preview'
  }, [livePreviewDetails, previewTemplate, showDetails, tab])
  function setField(key: keyof InvitationData, value: string) { setDetails(previous => ({ ...previous, [key]: value })) }
  function advanceFormStep() {
    const form = document.querySelector<HTMLFormElement>('.order-form')
    const sections = form ? Array.from(form.querySelectorAll<HTMLFieldSetElement>(':scope > fieldset')) : []
    const currentSection = sections[formStep]
    const invalidField = currentSection?.querySelector<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>(':invalid')
    if (invalidField) { invalidField.reportValidity(); return }
    if (formStep < sections.length - 1) setFormStep(step => step + 1)
    else setReview(true)
  }
  function selectCategory(category: string) {
    const currentIndex = categoryFilter === 'ALL' ? 0 : categories.indexOf(categoryFilter) + 1
    const nextIndex = category === 'ALL' ? 0 : categories.indexOf(category) + 1
    setCategoryDirection(nextIndex >= currentIndex ? 'right' : 'left')
    setCategoryFilter(category)
    setSelected(category === 'ALL' ? allTemplates[0]?.id || null : allTemplates.find(template => template.category === category)?.id || null)
  }
  function chooseTemplate(id: number) { setSelected(id); setPreviewId(id); setDetails(previous => ({ ...previous, template: id })); setShowDetails(true); setFormStep(0); setTab('Templates'); setNotice(''); setError(''); setReview(false) }
  async function submitOrder(event: FormEvent) {
    event.preventDefault(); if (!selected || !supabase) return
    if (!review) {
      const form = event.currentTarget
      const sections = Array.from(form.querySelectorAll<HTMLFieldSetElement>(':scope > fieldset'))
      const step = Math.min(formStep, sections.length - 1)
      const invalidField = sections[step]?.querySelector<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>(':invalid')
      if (invalidField) { invalidField.reportValidity(); return }
      if (step < sections.length - 1) { setFormStep(step + 1); return }
      setReview(true); return
    }
    setBusy(true); setNotice(''); setError('')
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Your session expired. Please sign in again.')
      const { data: company, error: companyError } = await supabase.from('companies').select('id').ilike('email', user.email || '').maybeSingle()
      if (companyError || !company) throw new Error('Your account is not linked to a company yet.')
      const companyId = company.id
      if (!phoneNumber.trim()) throw new Error('Please enter a phone number for this order.')
      const formData = validateDetails({ ...details, template: selected, events: [{ title: weddingEventTitle, date: details.date, time: details.time, venue: details.venue, address: details.address, map: details.map }, ...extraEvents] })
      const templateCode = templates.find(template => template.id === selected)?.template_code
      if (!templateCode) throw new Error('That design is no longer available. Choose another template.')
      const { data, error: insertError } = await supabase.from('orders').insert({ company_id: companyId, template_code: templateCode, created_by: user.id, groom_name: formData.groom, bride_name: formData.bride, phone_number: phoneNumber.trim(), form_data: formData }).select('id').single()
      if (insertError) throw insertError
      setNotice(`Order #${data.id} was submitted. Our studio will review it shortly.`)
      setSelected(null); setDetails(initial); setPhoneNumber(''); setWeddingEventTitle(initialWeddingEvent); setExtraEvents(initialExtraEvents); setTab('Orders'); setReview(false); await refresh()
    } catch (cause) {
      const databaseMessage = cause && typeof cause === 'object' && 'message' in cause && typeof cause.message === 'string' ? cause.message : null
      setError(cause instanceof Error ? cause.message : databaseMessage || 'Unable to submit this order.')
    }
    finally { setBusy(false) }
  }

  if (loading) return <main className="dash-loading">Preparing your invitation studio…</main>
  return <main className={`workspace client-workspace ${tab === 'Templates' ? 'has-client-preview' : ''} ${tab === 'Orders' ? 'has-orders-page' : ''} ${tab === 'Overview' ? 'has-overview-page' : ''} ${showDetails ? 'show-client-details' : ''} ${showDetails && formStepCount > 0 && formStep >= formStepCount - 1 ? 'last-form-step' : ''} ${review ? 'reviewing-client-order' : ''}`}>
    <header className="client-topbar"><label className="client-top-search"><span aria-hidden="true">⌕</span><input value={templateSearch} onChange={event=>{setTemplateSearch(event.target.value);setTab('Templates');setSelected(null)}} placeholder="Search templates by name, category or style…" aria-label="Search invitation designs"/></label>
    <div className="workspace-account"><span className="client-account-name">{company?.company_name || 'Company'}</span><span className="client-account-avatar" aria-hidden="true"><svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4.5 21a7.5 7.5 0 0 1 15 0"/></svg></span></div></header>
    <aside className="workspace-sidebar"><a href="/" className="client-brand"><img src={companyLogo} alt={company?.company_name || 'Shaadi Invites'} onError={()=>setCompanyLogo('/logo.png')}/></a><nav className="client-section-nav" aria-label="Client dashboard">{(['Overview','Templates','Orders','Settings'] as const).map(item=><button type="button" key={item} className={tab===item?'active':''} onClick={()=>{setTab(item);setSelected(item==='Templates'?(chosen?.id||allTemplates[0]?.id||null):null);setError('')}}><span>{item==='Overview'?'⌂':item==='Templates'?'▦':item==='Orders'?'▤':'⚙'}</span>{item==='Overview'?'Dashboard':item}</button>)}</nav><section className="client-sidebar-note"><span>♕ CLIENT SUPPORT</span><h2>Need a hand?</h2><p>Our team can help you create a beautiful invitation.</p><a href="https://wa.me/917975948093?text=Hey%20I%20need%20an%20invitation%21" target="_blank" rel="noreferrer">Contact support <b>↗</b></a></section><button className="workspace-logout" onClick={() => void signOutToLogin()}>↗ <span>Log out</span></button></aside>
    <section className={`workspace-main ${tab==='Orders'?'orders-page':''}`}><header className="workspace-top"><div><span className="workspace-kicker">{tab==='Orders'?'ORDERS':tab==='Templates'?(showDetails?'PERSONALISE YOUR INVITATION':'THE ART OF A BEAUTIFUL BEGINNING'):`${company?.company_name||'Company'} · PRIVATE STUDIO`}</span><h1>{tab==='Templates'?(showDetails?'Create your invitation':'Choose a Template'):tab==='Overview'?'Your invitation studio':tab}</h1></div>{tab==='Orders'&&<button type="button" className="orders-new-order" onClick={()=>{setTab('Templates');setSelected(chosen?.id||allTemplates[0]?.id||null)}}><span aria-hidden="true">＋</span> New Order</button>}{tab==='Templates'&&showDetails&&workflowHost&&createPortal(<div className="client-workflow-controls"><span className="client-workflow-progress" aria-hidden="true"></span><button type="button" className="client-workflow-back" disabled={review?false:formStep===0} onClick={()=>review?setReview(false):setFormStep(step=>Math.max(0,step-1))}>{review?'Edit details':'← Back'}</button><button type="button" className="client-workflow-next" hidden={review} onClick={advanceFormStep}>Continue →</button></div>,workflowHost)}{tab==='Templates'&&showDetails&&<button type="button" className="client-form-back" onClick={()=>{setShowDetails(false);setReview(false)}}>← Back to templates</button>}{tab==='Templates'&&<span className="client-design-count">{allTemplates.length} carefully curated invitations</span>}</header>
      {tab==='Templates'&&<div className="client-catalog-controls"><div className="client-filter-chips"><button type="button" className={categoryFilter==='ALL'?'active':''} onClick={()=>selectCategory('ALL')}><span className="category-chip-icon" aria-hidden="true">▦</span>All <span className="category-chip-count">{allTemplates.length}</span></button>{categories.map(category=><button type="button" key={category} className={categoryFilter===category?'active':''} onClick={()=>selectCategory(category)}><span className="category-chip-icon" aria-hidden="true">{category==='Muslim'?'☾':category==='Garden'?'✿':category==='Classic'?'♛':category==='Indian'?'❋':category==='Hindu'?'ॐ':'✧'}</span>{category}</button>)}</div><label className="client-sort-control">Sort by<select value={templateSort} onChange={event=>setTemplateSort(event.target.value as 'CURATED'|'NAME')}><option value="CURATED">Curated</option><option value="NAME">Name</option></select></label></div>}
      {tab==='Templates'&&chosen&&<div className="client-selected-gallery"><div className="client-selected-gallery-title"><span className="workspace-kicker">THE COLLECTION</span><button type="button" onClick={()=>setShowDetails(false)}>{showDetails?'Hide details':'Choose a template'}</button></div><div key={categoryFilter} className={`client-selected-card-grid category-slide-from-${categoryDirection}`}>{templates.map(template=><article key={template.id} className={`client-selected-card ${template.id===previewTemplate?.id?'active':''}`}><button type="button" className="client-card-preview-trigger" onClick={()=>setPreviewId(template.id)} aria-label={`Preview ${template.name} on the mobile screen`}><span className="client-selected-thumb"><img src={template.thumbnail_url} alt=""/></span><strong>{template.name}</strong><small>{template.category}</small></button><button type="button" className="client-selected-card-order" onClick={()=>chooseTemplate(template.id)}>Get this design <span aria-hidden="true">→</span></button></article>)}</div></div>}
      {error && <p className="workspace-alert" role="alert">{error}</p>}{notice && <p className="workspace-success" role="status">{notice}</p>}
      {viewOrder && <div className="client-order-overlay" role="presentation" onMouseDown={event=>{if(event.target===event.currentTarget)setViewOrder(null)}}><section className="client-order-dialog" role="dialog" aria-modal="true" aria-labelledby="client-order-title"><button className="dialog-close" onClick={()=>setViewOrder(null)} aria-label="Close order details">×</button><span className="workspace-kicker">ORDER #{viewOrder.id}</span><span className={`status-pill status-${viewOrder.status.toLowerCase()}`}>{statusTitle[viewOrder.status]}</span><h2 id="client-order-title">{viewOrder.groom_name} & {viewOrder.bride_name}</h2><p>{designs.find(d=>d.id===viewOrder.form_data.template)?.name} · Submitted {new Date(viewOrder.created_at).toLocaleDateString()}</p><dl><dt>Wedding date</dt><dd>{viewOrder.form_data.date} · {viewOrder.form_data.time}</dd><dt>Venue</dt><dd>{viewOrder.form_data.venue}, {viewOrder.form_data.address}</dd><dt>Celebrations</dt><dd>{viewOrder.form_data.events?.map(event=>`${event.title} · ${event.date} · ${event.venue}`).join(' / ')||'Wedding'}</dd></dl>{viewOrder.rejection_reason&&<p className="workspace-alert"><strong>Studio note:</strong> {viewOrder.rejection_reason}</p>}{viewOrder.published_url&&(!viewOrder.expires_at||new Date(viewOrder.expires_at)>new Date())?<div className="published-link"><a href={viewOrder.published_url} target="_blank" rel="noreferrer">{viewOrder.published_url} ↗</a><button onClick={()=>void navigator.clipboard.writeText(viewOrder.published_url!)}>Copy invitation link</button></div>:viewOrder.expires_at&&new Date(viewOrder.expires_at)<=new Date()?<p className="workspace-alert">This invitation link has expired. Contact Shaadi Invites to renew it.</p>:<p className="form-note">Your invitation is being prepared. The public link will appear here after publication.</p>}</section></div>}
      {tab === 'Overview' && <div className="overview-dashboard"><p className="workspace-lede">A complete collection for your couples, with every order gathered in one place.</p><div className="metric-grid">{[
        {label:'Total orders',value:counts.total,icon:'▤',tone:'blue',change:monthOrderChange},
        {label:'Total revenue',value:formatRevenue(datedOrders),icon:'▤',tone:'green',change:revenueChangeLabel(monthRevenue,previousMonthRevenue,'last month')},
        {label:"Today's orders",value:todayOrders.length,icon:'▦',tone:'purple',change:todayOrderChange},
        {label:"Today's revenue",value:formatRevenue(todayOrders),icon:'₹',tone:'gold',change:revenueChangeLabel(todayRevenue,yesterdayRevenue,'yesterday')},
      ].map(metric=><article className={`metric-card metric-${metric.tone}`} key={metric.label}><span>{metric.label}</span><strong>{metric.value}</strong><i aria-hidden="true">{metric.icon}</i><small className={metric.change.startsWith('↑')?'metric-change-up':metric.change.startsWith('↓')?'metric-change-down':'metric-change-neutral'}>{metric.change.includes(' from ')?<><b>{metric.change.slice(0,metric.change.indexOf(' from '))}</b>{metric.change.slice(metric.change.indexOf(' from '))}</>:metric.change}</small></article>)}</div><section className="client-recent-orders"><div className="section-heading recent-orders-heading"><h2>Recent orders</h2><button className="text-action" onClick={() => setTab('Orders')}>View all →</button></div><OrderTable orders={orders.slice(0,5)} onSelect={setViewOrder} variant="overview"/><div className="recent-orders-footer">Showing {orders.length===0?'0':`1–${Math.min(5,orders.length)}`} of {orders.length} orders<button type="button" onClick={()=>setTab('Orders')}>View all orders →</button></div></section></div>}
      {tab === 'Templates' && <>{chosen ? <div className="order-create"><div className="order-template-rail"><button className="back-action" onClick={() => setSelected(null)}>← All templates</button>{templates.map(template => <button key={template.id} className={`rail-template ${selected === template.id ? 'selected' : ''}`} onClick={() => chooseTemplate(template.id)}><img src={template.thumbnail_url} alt=""/><span>{template.name}<small>{template.category}</small></span></button>)}</div><form className="order-form" onSubmit={submitOrder}><div className="form-heading"><span className="workspace-kicker">NEW INVITATION ORDER</span><h2>{chosen.name}</h2><a href={chosen.preview_url} target="_blank" rel="noreferrer">Preview design ↗</a></div><fieldset style={{display:review?'none':undefined}}><legend>01 · The couple</legend><div className="form-grid"><Field label="Groom’s name" required value={details.groom} onChange={v => setField('groom',v)}/><Field label="Bride’s name" required value={details.bride} onChange={v => setField('bride',v)}/><Field label="Groom’s family" value={details.groomFamily} onChange={v => setField('groomFamily',v)}/><Field label="Bride’s family" value={details.brideFamily} onChange={v => setField('brideFamily',v)}/><Field label="Phone number" type="tel" required value={phoneNumber} onChange={setPhoneNumber}/></div></fieldset><fieldset style={{display:review?'none':undefined}}><legend>02 · Wedding details</legend><div className="form-grid"><Field label="Wedding date" type="date" required value={details.date} onChange={v => setField('date',v)}/><Field label="Ceremony time" type="time" required value={details.time} onChange={v => setField('time',v)}/><Field label="Venue" required value={details.venue} onChange={v => setField('venue',v)}/><Field label="Address" required value={details.address} onChange={v => setField('address',v)}/><Field label="Map link" type="url" value={details.map} onChange={v => setField('map',v)}/><label>Time zone<select value={details.offset} onChange={e => setField('offset',e.target.value)}><option value="+05:30">India · UTC+05:30</option><option value="+04:00">UAE · UTC+04:00</option><option value="+00:00">UTC</option><option value="-04:00">UTC−04:00</option><option value="-05:00">UTC−05:00</option></select></label></div></fieldset><fieldset style={{display:review?'none':undefined}}><legend>03 · Celebrations and personal touches</legend><div className="form-grid"><Field label="Wedding celebration name" required value={weddingEventTitle} onChange={setWeddingEventTitle}/></div><p className="form-note">The wedding celebration is included from the details above.</p>{extraEvents.map((item,index)=><div className="celebration-editor" key={index}><div className="section-heading"><h3>Additional celebration {index+1}</h3><button type="button" className="text-action" onClick={()=>setExtraEvents(events=>events.filter((_,i)=>i!==index))}>Remove</button></div><div className="form-grid"><Field label="Event name" required value={item.title} onChange={v=>setExtraEvents(events=>events.map((event,i)=>i===index?{...event,title:v}:event))}/><Field label="Date" type="date" required value={item.date} onChange={v=>setExtraEvents(events=>events.map((event,i)=>i===index?{...event,date:v}:event))}/><Field label="Time" type="time" required value={item.time} onChange={v=>setExtraEvents(events=>events.map((event,i)=>i===index?{...event,time:v}:event))}/><Field label="Venue" required value={item.venue} onChange={v=>setExtraEvents(events=>events.map((event,i)=>i===index?{...event,venue:v}:event))}/><Field label="Address" required value={item.address} onChange={v=>setExtraEvents(events=>events.map((event,i)=>i===index?{...event,address:v}:event))}/><Field label="Map link" type="url" value={item.map} onChange={v=>setExtraEvents(events=>events.map((event,i)=>i===index?{...event,map:v}:event))}/></div></div>)}<button type="button" className="secondary-action" disabled={extraEvents.length>=9} onClick={()=>setExtraEvents(events=>[...events,{title:'',date:details.date,time:'17:00',venue:'',address:'',map:''}])}>+ Add celebration</button><div className="form-grid"><Field label="Dress code" value={details.dressCode} onChange={v => setField('dressCode',v)}/><Field label="Music link" type="url" value={details.music} onChange={v => setField('music',v)}/><Field label="Photo gallery link" type="url" value={details.gallery} onChange={v => setField('gallery',v)}/></div><label>Welcome message<textarea rows={4} value={details.message} onChange={e => setField('message',e.target.value)}/></label><label>Gift note<textarea rows={2} value={details.giftNote} onChange={e => setField('giftNote',e.target.value)}/></label></fieldset>{review&&<section className="review-card"><span className="workspace-kicker">REVIEW ORDER DETAILS</span><h3>{details.groom||'Groom'} & {details.bride||'Bride'}</h3><p>{details.date||'Wedding date'} · {details.time} · {details.venue||'Venue'} · {details.address||'Address'}</p><p>Template: {chosen.name} · Additional celebrations: {extraEvents.length}</p><button type="button" className="back-action" onClick={()=>setReview(false)}>← Edit details</button></section>}<p className="form-note">Your order will be submitted for review before an invitation is created or published.</p><button className="primary-action" disabled={busy}>{busy ? 'Submitting order…' : review ? 'Submit order →' : 'Review order →'}</button></form></div> : <><section className="client-collection-intro"><div><span className="workspace-kicker">THE ART OF A BEAUTIFUL BEGINNING</span><h2>Choose a design that tells their story.</h2><p>Preview the collection and prepare a personal invitation order for your couple.</p></div><div className="client-collection-art" aria-hidden="true"><span>Shaadi Invites</span><i>✧</i></div></section><div className="client-collection-heading"><div><span className="workspace-kicker">THE COLLECTION</span><h2>Invitation designs <small>{templates.length} curated styles</small></h2></div><span className="client-collection-note">Select a design to begin an order <b>↓</b></span></div><div className="template-grid">{templates.map((template,index)=><article className="template-tile" key={template.id}><a className="template-image" href={template.preview_url} target="_blank" rel="noreferrer"><img src={template.thumbnail_url} alt={`${template.name} preview`} loading="lazy"/><span>PREVIEW ↗</span></a><div><small>{String(index+1).padStart(2,'0')} · {template.category}</small><h2>{template.name}</h2><button className="text-action" onClick={() => chooseTemplate(template.id)}>Choose this design <b>→</b></button></div></article>)}</div></>}</>}
      {tab === 'Orders' && <><p className="workspace-lede orders-description">View and manage all invitation orders submitted by your customers.</p><div className="orders-filters"><label className="orders-search"><span aria-hidden="true">⌕</span><input value={orderSearch} onChange={e => {setOrderSearch(e.target.value);setOrdersPage(0)}} placeholder="Search by order ID, couple name, or phone number…" aria-label="Search orders"/></label><div className="orders-date-filter"><span aria-hidden="true">▦</span><input type="date" value={orderDateFrom} onChange={e=>{setOrderDateFrom(e.target.value);setOrdersPage(0)}} aria-label="Submitted from"/><span className="orders-date-separator">to</span><input type="date" value={orderDateTo} onChange={e=>{setOrderDateTo(e.target.value);setOrdersPage(0)}} aria-label="Submitted to"/></div></div><OrderTable orders={filtered.slice(ordersPage*20,ordersPage*20+20)} onSelect={setViewOrder} onCreate={orders.length===0?()=>{setTab('Templates');setSelected(chosen?.id||allTemplates[0]?.id||null)}:undefined}/>{filtered.length>20&&<div className="pagination"><button disabled={ordersPage===0} onClick={()=>setOrdersPage(p=>p-1)}>← Previous</button><span>Page {ordersPage+1} of {Math.max(1,Math.ceil(filtered.length/20))}</span><button disabled={(ordersPage+1)*20>=filtered.length} onClick={()=>setOrdersPage(p=>p+1)}>Next →</button></div>}</>}
      {tab === 'Settings' && <div className="settings-card"><span className="workspace-kicker">COMPANY PROFILE</span><h2>{company?.company_name || 'Company profile'}</h2><p>{company?.contact_name || 'Account contact details are managed by Shaadi Invites.'}</p><p>To change your company information, contact your Shaadi Invites account administrator.</p></div>}
    </section>
    {tab === 'Templates' && <aside className="client-preview-panel"><div className="client-preview-heading"><div><span className="workspace-kicker">LIVE PREVIEW</span><h2>{previewTemplate?.name || 'Invitation preview'}</h2></div><span className="preview-live-dot" aria-label="Live preview"/></div>{previewTemplate ? <><div className="client-device-frame"><div className="client-device-screen" ref={previewScreen}><iframe key={previewTemplate.id} title={`${previewTemplate.name} mobile invitation preview`} src={previewTemplate.preview_url} loading="lazy" style={{ transform: `scale(${previewScale})` }} onLoad={() => { const screen = previewScreen.current; if (screen) setPreviewScale(Math.min(screen.clientWidth / 402, screen.clientHeight / 874)) }}/></div></div><div className="client-preview-thumbs" aria-label="Choose a design to preview">{templates.map(template=><button type="button" key={template.id} className={previewTemplate.id === template.id ? 'active' : ''} onClick={()=>setPreviewId(template.id)} aria-label={`Preview ${template.name}`}><img src={template.thumbnail_url} alt=""/></button>)}</div><a className="client-preview-open" href={previewTemplate.preview_url} target="_blank" rel="noreferrer">Preview Full Invitation <span>↗</span></a><button type="button" className="client-preview-choose" onClick={()=>chooseTemplate(previewTemplate.id)}>Get this design <span>→</span></button></> : <p className="form-note">Your invitation previews will appear here.</p>}</aside>}
  </main>
}

function Field({ label, value, onChange, type = 'text', required = false }: { label: string; value: string; onChange: (value: string) => void; type?: string; required?: boolean }) { return <label>{label}{required && <i> *</i>}<input type={type} value={value} onChange={event => onChange(event.target.value)} maxLength={type === 'url' ? 2000 : 600} required={required}/></label> }
function OrderTable({ orders, onSelect, onCreate, variant = 'orders' }: { orders: Order[]; onSelect?: (order:Order)=>void; onCreate?:()=>void; variant?: 'orders'|'overview' }) {
  return <div className={`table-wrap ${orders.length===0?'orders-empty-table':''}`}>
    <table className="orders-table"><thead><tr><th>Order</th><th>Couple</th><th>Template</th><th>Contact</th><th>Status</th><th>Price</th>{variant==='overview'?<><th>Date</th><th>Actions</th></>:<th>Link</th>}</tr></thead>
      <tbody>{orders.map(order => {
        const expired=Boolean(order.expires_at&&new Date(order.expires_at)<=new Date())
        const active=Boolean(order.published_url&&!expired)
        return <tr key={order.id}>
          <td>#{variant==='overview'?`ORD-${String(order.id).padStart(4,'0')}`:order.id}</td>
          <td>{order.groom_name} & {order.bride_name}</td>
          <td>{designs.find(d => d.id === order.form_data.template)?.name || 'Invitation design'}</td>
          <td>{order.phone_number||'—'}</td>
          <td><span className={`status-pill status-${order.status.toLowerCase()}`}>{variant==='overview'?({CREATED:'Pending',IN_PROGRESS:'In Progress',READY:'Completed',REJECTED:'Needs changes'}[order.status]||order.status):(statusTitle[order.status] || order.status)}</span>{order.rejection_reason && <small className="rejection-note">{order.rejection_reason}</small>}</td>
          <td>{typeof order.price==='number'?new Intl.NumberFormat('en-IN',{style:'currency',currency:'INR',maximumFractionDigits:0}).format(order.price):'—'}</td>
          {variant==='overview'&&<td>{new Date(order.created_at).toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'numeric'})}</td>}
          <td className="order-actions">{variant==='overview'?<>{active?<a className="overview-view-link" href={order.published_url!} target="_blank" rel="noreferrer">↗ View</a>:onSelect&&<button className="overview-view-link" onClick={()=>onSelect(order)}>▷ Preview</button>}{active&&<button className="overview-more-action" aria-label="Copy invitation link" onClick={()=>void navigator.clipboard.writeText(order.published_url!)}>⋮</button>}</>:<>{active&&<a href={order.published_url!} target="_blank" rel="noreferrer">Open invitation ↗</a>}{onSelect&&<button className="row-action" onClick={()=>onSelect(order)}>Details →</button>}{active&&<button className="row-action" onClick={()=>void navigator.clipboard.writeText(order.published_url!)}>Copy link</button>}{!active&&expired&&<span className="quiet">Expired</span>}{!active&&!expired&&<span className="quiet">Not published</span>}</>}</td>
        </tr>
      })}</tbody>
    </table>
    {orders.length === 0 && <div className="empty-state"><svg viewBox="0 0 240 150" role="img" aria-label="Wedding invitation illustration"><path d="M73 41 160 25l27 91-99 14z" fill="#faf7f1" stroke="#e8dfd2" strokeWidth="3"/><path d="m65 50 88-17 28 85-98 13z" fill="#fffdf9" stroke="#e9e1d5" strokeWidth="3"/><path d="M111 80c-14-13-29 7 0 24 29-17 14-37 0-24Z" fill="none" stroke="#b48a4c" strokeWidth="4"/><path d="M110 66v-9m-14 17-6-5m34 5 6-5" stroke="#c29b60" strokeWidth="3" strokeLinecap="round"/><path d="M55 124c-20-7-29-22-33-39m164 39c20-7 29-22 33-39M40 104l-13-3m26-3-1-13m150 19 13-3m-26-3 1-13" fill="none" stroke="#e9e1d5" strokeWidth="3" strokeLinecap="round"/></svg><h2>{onCreate?'No orders yet':'No matching orders'}</h2><p>{onCreate?'Your submitted invitation orders will appear here.':'Try changing your search or filters.'}</p>{onCreate&&<button type="button" className="orders-create-first" onClick={onCreate}><span aria-hidden="true">＋</span> Create Your First Order</button>}</div>}
  </div>
}
