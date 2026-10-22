import { createContext, useContext, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { createPortal } from 'react-dom'
import { cardTextLimit, nameTextLimit, designs, slugVariants, inviteUrl, validateDetails } from '../invitations/model'
import type { Celebration, InvitationData } from '../invitations/model'
import { invitationExample } from '../invitations/templateData'
import { isSupabaseConfigured, supabase } from '../lib/supabase'
import { DashboardAccess, signOutToLogin } from './DashboardAccess'
import './Workspaces.css'
import './ClientDashboard.css'
import InvitationReview, { ReviewActionIcon } from './InvitationReview'

type Order = { id: number; groom_name: string; bride_name: string; status: string; created_at: string; form_data: InvitationData; published_path: string | null; published_url: string | null; management_id: string; published_at: string | null; expires_at: string | null; rejection_reason: string | null; template_code: string; phone_number: string; price?: number | null }
type Template = { id: number; template_code: string; name: string; category: string; thumbnail_url: string; preview_url: string }
type TemplateSettings = { price: number; sale_type: 'none' | 'percentage' | 'fixed'; sale_value: number; is_premium: boolean }
const initial: InvitationData = { template: 1, groom: 'Mohad', bride: 'Rahma', date: '2026-12-20', time: '11:00', offset: '+05:30', venue: 'TMA Pai Convention Centre', address: 'Mangalore', map: 'https://maps.app.goo.gl/1xf3k59k9QEaoQ717', message: 'With the love and blessings of our families, we invite you to celebrate the beginning of our forever.', groomFamily: '', brideFamily: '', dressCode: '', giftNote: '', music: '', gallery: '', events: [] }
const CardTemplateContext = createContext({template:0,showCoupleIllustrations:true,onIllustrationsChange:(_show:boolean)=>{}})
const initialWeddingEvent = 'Nikah & Wedding'
const defaultPhoneNumber = '7975948093'
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
const templateIntroVideos: Record<number, string> = {
  1: '/images/royal-grace/opening-mobile.mp4',
  6: '/design3/assets/intro-doors-trimmed.mp4',
  5: '/design5/assets/hero-video.mp4',
  2: '/design6/assets/hero-bg-l-slFnvE.mp4',
  7: '/design7/assets/intro-video-2-a-H3NxSy.mp4',
  4: '/design18/entry.mp4',
}

export default function ClientDashboard() {
  return <DashboardAccess role="CLIENT"><ClientWorkspace /></DashboardAccess>
}

function ClientWorkspace() {
  const draftRestored = useRef(false)
  const [draftKey, setDraftKey] = useState<string | null>(null)
  const previewScreen = useRef<HTMLDivElement>(null)
  const [previewScale, setPreviewScale] = useState(0.75)
  const [tab, setTab] = useState<'Overview' | 'Templates' | 'Orders' | 'Settings'>('Overview')
  const [orders, setOrders] = useState<Order[]>([])
  const [viewOrder, setViewOrder] = useState<Order | null>(null)
  const [allTemplates, setAllTemplates] = useState<Template[]>([])
  const [company, setCompany] = useState<{ id: number; company_name: string; contact_name: string | null } | null>(null)
  const [templateSettings, setTemplateSettings] = useState<Record<number, TemplateSettings>>({})
  const [companyLogo, setCompanyLogo] = useState('/logo.png')
  const [details, setDetails] = useState(initial)
  const [phoneNumber, setPhoneNumber] = useState(defaultPhoneNumber)
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
  const [savingSetting, setSavingSetting] = useState<number | null>(null)
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
    if(!draftRestored.current&&!templatesResult.error){
      const key=`shaadi-client-draft-v1:${data.user.id}`
      try{
        const saved=localStorage.getItem(key)
        const draft=saved?JSON.parse(saved):null
        if(draft&&typeof draft==='object'){
          if(['Overview','Templates','Orders','Settings'].includes(draft.tab))setTab(draft.tab)
          const validSelection=activeTemplates.some(template=>template.id===draft.selected)
          if(validSelection){
            setSelected(draft.selected)
            setShowDetails(draft.showDetails===true)
            setReview(draft.review===true)
            if(Number.isInteger(draft.formStep)&&draft.formStep>=0)setFormStep(draft.formStep)
          }
          if(activeTemplates.some(template=>template.id===draft.previewId))setPreviewId(draft.previewId)
          if(draft.details&&typeof draft.details==='object'&&Object.keys(initial).filter(field=>field!=='events'&&field!=='template').every(field=>typeof draft.details[field]==='string')){
            setDetails({...initial,...draft.details,events:[]})
          }
          if(typeof draft.phoneNumber==='string')setPhoneNumber(draft.phoneNumber)
          if(typeof draft.weddingEventTitle==='string')setWeddingEventTitle(draft.weddingEventTitle)
          if(Array.isArray(draft.extraEvents)&&draft.extraEvents.length<=9&&draft.extraEvents.every((item:Celebration)=>item&&['title','date','time','venue','address','map'].every(field=>typeof item[field as keyof Celebration]==='string')))setExtraEvents(draft.extraEvents)
        }
      }catch{ /* Start with the defaults if browser storage is unavailable or invalid. */ }
      draftRestored.current=true
      setDraftKey(key)
    }
    const firstTemplate = activeTemplates[0]
    if (firstTemplate) { setSelected(current => current ?? firstTemplate.id); setPreviewId(current => current ?? firstTemplate.id) }
    setOrders((ordersResult.data || []) as Order[])
    if (data.user.email) {
      const { data: companyData } = await supabase.from('companies').select('id,company_name,contact_name').ilike('email', data.user.email).maybeSingle()
      setCompany(companyData)
      if (companyData?.id) {
        const { data: settingsData, error: settingsError } = await supabase.from('company_template_settings').select('template_id,price,sale_type,sale_value,is_premium').eq('company_id', companyData.id)
        if (settingsError) setError(settingsError.message)
        else setTemplateSettings(Object.fromEntries((settingsData || []).map(setting => [setting.template_id, { price: Number(setting.price), sale_type: setting.sale_type, sale_value: Number(setting.sale_value), is_premium: setting.is_premium }])) as Record<number, TemplateSettings>)
      } else setTemplateSettings({})
      const logoFile = companyData?.company_name
        ? companyLogoFiles[companyData.company_name.trim().replace(/\s+/g, ' ').toLowerCase()]
        : undefined
      setCompanyLogo(logoFile ? `/company-logos/${encodeURIComponent(logoFile)}` : '/logo.png')
    }
    setLoading(false)
  }, [])

  useEffect(() => { void refresh() }, [refresh])
  useEffect(()=>{
    if(!draftKey)return
    try{
      localStorage.setItem(draftKey,JSON.stringify({tab,details,phoneNumber,weddingEventTitle,extraEvents,selected,previewId,showDetails,formStep,review}))
    }catch{ /* Keep the form usable if browser storage is unavailable. */ }
  },[draftKey,tab,details,phoneNumber,weddingEventTitle,extraEvents,selected,previewId,showDetails,formStep,review])
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
  }, [formStep, review, selected, showDetails, tab, loading])
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
  }, [tab, previewTemplate?.id, loading])
  const livePreviewDetails = useMemo<InvitationData>(() => {
    const example = !showDetails && previewTemplate ? invitationExample(previewTemplate.id) : undefined
    const previewData = example || details
    return {
      ...previewData,
      template: showDetails ? selected ?? previewTemplate?.id ?? details.template : previewTemplate?.id ?? details.template,
      events: example
        ? example.events
        : [{ title: weddingEventTitle, date: details.date, time: details.time, venue: details.venue, address: details.address, map: details.map }, ...extraEvents],
    }
  }, [details, extraEvents, previewTemplate?.id, selected, showDetails, weddingEventTitle])
  useEffect(() => {
    if (tab !== 'Templates' || !previewTemplate) return
    try { sessionStorage.setItem('shaadi-client-live-preview', JSON.stringify(livePreviewDetails)) } catch { return }
    const frame = document.querySelector<HTMLIFrameElement>('.client-device-frame iframe')
    if (!frame) return
    const previewUrl = new URL(frame.src, window.location.href)
    if (previewUrl.pathname !== '/client/live-preview' || previewUrl.searchParams.get('editor') !== '1') {
      frame.src = '/client/live-preview?editor=1'
      return
    }
  }, [livePreviewDetails, previewTemplate, showDetails, tab, loading])
  function setField(key: keyof InvitationData, value: string) { setDetails(previous => ({ ...previous, [key]: value })) }
  function advanceFormStep() {
    const form = document.querySelector<HTMLFormElement>('.order-form')
    const sections = form ? Array.from(form.querySelectorAll<HTMLFieldSetElement>(':scope > fieldset')) : []
    const currentSection = sections[formStep]
    const invalidField = currentSection ? Array.from(currentSection.querySelectorAll<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>(':invalid')).find(field => !(field instanceof HTMLInputElement && field.type === 'url' && field.value.startsWith('/'))) : undefined
    if (invalidField) {
      const fieldName = invalidField.labels?.[0]?.textContent?.trim() || invalidField.getAttribute('aria-label') || 'a required field'
      setError(`Please complete “${fieldName}” before continuing.`)
      invalidField.reportValidity()
      invalidField.focus()
      return
    }
    if (formStep < sections.length - 1) setFormStep(step => step + 1)
    else if (form) { setError(''); setReview(true) }
    else setReview(true)
  }
  function selectCategory(category: string) {
    const currentIndex = categoryFilter === 'ALL' ? 0 : categories.indexOf(categoryFilter) + 1
    const nextIndex = category === 'ALL' ? 0 : categories.indexOf(category) + 1
    setCategoryDirection(nextIndex >= currentIndex ? 'right' : 'left')
    setCategoryFilter(category)
    setSelected(category === 'ALL' ? allTemplates[0]?.id || null : allTemplates.find(template => template.category === category)?.id || null)
  }
  function chooseTemplate(id: number) {
    const example = invitationExample(id)
    setSelected(id)
    setPreviewId(id)
    if (example) {
      const [wedding, ...celebrations] = example.events
      setDetails({ ...example, events: [] })
      if (wedding) setWeddingEventTitle(wedding.title)
      setExtraEvents(celebrations)
    } else setDetails(previous => ({
      ...previous,
      template: id,
      message: ['Hindu', 'Indian'].includes(templates.find(template => template.id === id)?.category || '')
        ? 'With the blessings of Lord Ganesha and our families, we invite you to celebrate the beginning of our forever.'
        : previous.message,
    }))
    setShowDetails(true); setFormStep(0); setTab('Templates'); setNotice(''); setError(''); setReview(false)
  }
  function editTemplateSetting(id: number, patch: Partial<TemplateSettings>) {
    setTemplateSettings(current => ({ ...current, [id]: { price: 0, sale_type: 'none', sale_value: 0, is_premium: false, ...current[id], ...patch } }))
  }
  async function saveTemplateSetting(template: Template) {
    if (!company || !supabase) return
    const setting = templateSettings[template.id] || { price: 0, sale_type: 'none' as const, sale_value: 0, is_premium: false }
    if (!Number.isFinite(setting.price) || setting.price < 0 || !Number.isFinite(setting.sale_value) || setting.sale_value < 0) { setError('Enter valid, non-negative prices and discounts.'); return }
    if (setting.sale_type === 'percentage' && setting.sale_value > 100) { setError('A percentage discount cannot exceed 100%.'); return }
    if (setting.sale_type === 'fixed' && setting.sale_value > setting.price) { setError('A fixed discount cannot exceed the template price.'); return }
    setSavingSetting(template.id); setError(''); setNotice('')
    const { error: saveError } = await supabase.from('company_template_settings').upsert({ company_id: company.id, template_id: template.id, price: setting.price, sale_type: setting.sale_type, sale_value: setting.sale_type === 'none' ? 0 : setting.sale_value, is_premium: setting.is_premium }, { onConflict: 'company_id,template_id' })
    if (saveError) setError(saveError.message)
    else { editTemplateSetting(template.id, { sale_value: setting.sale_type === 'none' ? 0 : setting.sale_value }); setNotice(`${template.name} settings saved.`) }
    setSavingSetting(null)
  }
  async function publishClientOrder(order: Order) {
    if (!supabase) return
    setBusy(true); setError(''); setNotice('')
    const path = order.published_path || slugVariants(order.groom_name, order.bride_name)[0]
    const url = order.published_url || inviteUrl(path)
    try {
      const { data, error: publishError } = await supabase.rpc('publish_company_order', { p_order_id: order.id, p_published_path: path, p_published_url: url })
      if (publishError) throw publishError
      const published = { ...order, status: 'READY', published_path: data?.published_path || path, published_url: data?.published_url || url, published_at: data?.published_at || new Date().toISOString() }
      setViewOrder(published)
      setOrders(current => current.map(item => item.id === order.id ? published : item))
      setNotice('Your invitation is live and ready to share.')
      await refresh()
    } catch (cause) {
      setViewOrder(null)
      const msg = cause instanceof Error ? cause.message : (cause && typeof cause === 'object' && 'message' in cause && typeof (cause as {message:unknown}).message === 'string' ? (cause as {message:string}).message : 'Unable to publish this invitation.')
      setError(msg)
    } finally { setBusy(false) }
  }
  async function submitOrder(event: FormEvent) {
    event.preventDefault(); if (!selected || !supabase) return
    if (!review) {
      const form = event.currentTarget
      const sections = Array.from(form.querySelectorAll<HTMLFieldSetElement>(':scope > fieldset'))
      const step = Math.min(formStep, sections.length - 1)
      const invalidField = sections[step] ? Array.from(sections[step].querySelectorAll<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>(':invalid')).find(field => !(field instanceof HTMLInputElement && field.type === 'url' && field.value.startsWith('/'))) : undefined
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
      const { data, error: insertError } = await supabase.from('orders').insert({ company_id: companyId, template_code: templateCode, created_by: user.id, groom_name: formData.groom, bride_name: formData.bride, phone_number: phoneNumber.trim(), form_data: formData }).select('*').single()
      if (insertError) throw insertError
      const createdOrder = data as Order
      const publishedPath = slugVariants(createdOrder.groom_name, createdOrder.bride_name)[0]
      const publishedUrl = inviteUrl(publishedPath)
      setViewOrder({ ...createdOrder, published_path: publishedPath, published_url: publishedUrl })
      setSelected(null); setDetails(initial); setPhoneNumber(defaultPhoneNumber); setWeddingEventTitle(initialWeddingEvent); setExtraEvents(initialExtraEvents); setShowDetails(false); setFormStep(0); setTab('Orders'); setReview(false); await refresh()
    } catch (cause) {
      const databaseMessage = cause && typeof cause === 'object' && 'message' in cause && typeof cause.message === 'string' ? cause.message : null
      setError(cause instanceof Error ? cause.message : databaseMessage || 'Unable to submit this order.')
    }
    finally { setBusy(false) }
  }

  if (loading) return <main className="dash-loading">Preparing your invitation studio…</main>
  return <CardTemplateContext.Provider value={{template:selected ?? 0,showCoupleIllustrations:details.showCoupleIllustrations!==false,onIllustrationsChange:show=>setDetails(previous=>({...previous,showCoupleIllustrations:show}))}}><main className={`workspace client-workspace ${tab === 'Templates' ? 'has-client-preview' : ''} ${tab === 'Orders' ? 'has-orders-page' : ''} ${tab === 'Overview' ? 'has-overview-page' : ''} ${showDetails ? 'show-client-details' : ''} ${showDetails && formStepCount > 0 && formStep >= formStepCount - 1 ? 'last-form-step' : ''} ${review ? 'reviewing-client-order' : ''}`}>
    <header className="client-topbar"><label className="client-top-search"><span aria-hidden="true">⌕</span><input value={templateSearch} onChange={event=>{setTemplateSearch(event.target.value);setTab('Templates');setSelected(null)}} placeholder="Search templates by name, category or style…" aria-label="Search invitation designs"/></label>
    <div className="workspace-account"><span className="client-account-name">{company?.company_name || 'Company'}</span><span className="client-account-avatar" aria-hidden="true"><svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4.5 21a7.5 7.5 0 0 1 15 0"/></svg></span></div></header>
    <aside className="workspace-sidebar"><a href="/" className="client-brand"><img src={companyLogo} alt={company?.company_name || 'Shaadi Invites'} onError={()=>setCompanyLogo('/logo.png')}/></a><nav className="client-section-nav" aria-label="Client dashboard">{(['Overview','Templates','Orders','Settings'] as const).map(item=><button type="button" key={item} className={tab===item?'active':''} onClick={()=>{setTab(item);setSelected(item==='Templates'?(chosen?.id||allTemplates[0]?.id||null):null);setError('')}}><span>{item==='Overview'?'⌂':item==='Templates'?'▦':item==='Orders'?'▤':'⚙'}</span>{item==='Overview'?'Dashboard':item}</button>)}</nav><section className="client-sidebar-note"><span>♕ CLIENT SUPPORT</span><h2>Need a hand?</h2><p>Our team can help you create a beautiful invitation.</p><a href="https://wa.me/917975948093?text=Hey%20I%20need%20an%20invitation%21" target="_blank" rel="noreferrer">Contact support <b>↗</b></a></section><button className="workspace-logout" aria-label="Log out" onClick={() => void signOutToLogin()}><span aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M10 4H5.5A1.5 1.5 0 0 0 4 5.5v13A1.5 1.5 0 0 0 5.5 20H10"/><path d="M13 8l4 4-4 4M8 12h9"/></svg></span><span>Log out</span></button></aside>
    <section className={`workspace-main ${tab==='Orders'?'orders-page':''}`}><header className="workspace-top"><div><span className="workspace-kicker">{tab==='Orders'?'ORDERS':tab==='Templates'?(showDetails?'PERSONALISE YOUR INVITATION':'THE ART OF A BEAUTIFUL BEGINNING'):`${company?.company_name||'Company'} · PRIVATE STUDIO`}</span><h1>{tab==='Templates'?(showDetails?'Create your invitation':'Choose a Template'):tab==='Overview'?'Your invitation studio':tab}</h1></div>{tab==='Orders'&&<button type="button" className="orders-new-order" onClick={()=>{setTab('Templates');setSelected(chosen?.id||allTemplates[0]?.id||null)}}><span aria-hidden="true">＋</span> New Order</button>}{tab==='Templates'&&showDetails&&workflowHost&&createPortal(<div className="client-workflow-controls"><span className="client-workflow-progress" aria-hidden="true"></span><button type="button" className="client-workflow-back" disabled={review?false:formStep===0} onClick={()=>review?setReview(false):setFormStep(step=>Math.max(0,step-1))}>{review?<><ReviewActionIcon edit/>Edit details</>:'← Back'}</button><button type="button" className="client-workflow-next" hidden={review} onClick={advanceFormStep}>Continue →</button></div>,workflowHost)}{tab==='Templates'&&showDetails&&<button type="button" className="client-form-back" onClick={()=>{setShowDetails(false);setReview(false)}}>← Back to templates</button>}{tab==='Templates'&&<span className="client-design-count">{allTemplates.length} carefully curated invitations</span>}</header>
      {tab==='Templates'&&<div className="client-catalog-controls"><div className="client-filter-chips"><button type="button" className={categoryFilter==='ALL'?'active':''} onClick={()=>selectCategory('ALL')}><span className="category-chip-icon" aria-hidden="true">▦</span>All <span className="category-chip-count">{allTemplates.length}</span></button>{categories.map(category=><button type="button" key={category} className={categoryFilter===category?'active':''} onClick={()=>selectCategory(category)}><span className="category-chip-icon" aria-hidden="true">{category==='Muslim'?'☾':category==='Garden'?'✿':category==='Classic'?'♛':category==='Indian'?'❋':category==='Hindu'?'ॐ':'✧'}</span>{category}</button>)}</div><label className="client-sort-control">Sort by<select value={templateSort} onChange={event=>setTemplateSort(event.target.value as 'CURATED'|'NAME')}><option value="CURATED">Curated</option><option value="NAME">Name</option></select></label></div>}
      {tab==='Templates'&&chosen&&<div className="client-selected-gallery"><div className="client-selected-gallery-title"><span className="workspace-kicker">THE COLLECTION</span><button type="button" onClick={()=>setShowDetails(false)}>{showDetails?'Hide details':'Choose a template'}</button></div><div key={categoryFilter} className={`client-selected-card-grid category-slide-from-${categoryDirection}`}>{templates.map(template=><article key={template.id} className={`client-selected-card ${template.id===previewTemplate?.id?'active':''}`}><button type="button" className="client-card-preview-trigger" onClick={()=>setPreviewId(template.id)} aria-label={`Preview ${template.name} on the mobile screen`}><span className="client-selected-thumb">{templateIntroVideos[template.id]?<video src={templateIntroVideos[template.id]} poster={template.thumbnail_url} autoPlay muted loop playsInline aria-label={`${template.name} intro preview`}/>:<img src={template.thumbnail_url} alt=""/>}{templateSettings[template.id]?.is_premium&&<span className="client-template-premium-badge">PREMIUM</span>}</span><span className="client-template-card-meta"><span className="client-template-card-copy"><strong>{template.name}</strong><small>{template.category}</small></span><TemplatePrice setting={templateSettings[template.id]}/></span></button><button type="button" className="client-selected-card-order" onClick={()=>chooseTemplate(template.id)}>Get this design <span aria-hidden="true">→</span></button></article>)}</div></div>}
      {tab !== 'Settings' && error && <p className="workspace-alert" role="alert">{error}</p>}{tab === 'Templates' && notice && <p className="workspace-success" role="status">{notice}</p>}
      {viewOrder && <div className="client-order-overlay" role="presentation" onMouseDown={event=>{if(event.target===event.currentTarget)setViewOrder(null)}}><section className="client-order-dialog" role="dialog" aria-modal="true" aria-labelledby="client-order-title"><button className="dialog-close" onClick={()=>setViewOrder(null)} aria-label="Close order details">×</button><span className="workspace-kicker">ORDER #{viewOrder.id}</span><span className={`status-pill status-${viewOrder.status.toLowerCase()}`}>{statusTitle[viewOrder.status]}</span><h2 id="client-order-title">{viewOrder.groom_name} & {viewOrder.bride_name}</h2><p>{designs.find(d=>d.id===viewOrder.form_data.template)?.name} · Submitted {new Date(viewOrder.created_at).toLocaleDateString()}</p><dl><dt>Wedding date</dt><dd>{viewOrder.form_data.date} · {viewOrder.form_data.time}</dd><dt>Venue</dt><dd>{viewOrder.form_data.venue}, {viewOrder.form_data.address}</dd><dt>Celebrations</dt><dd><ul className="publish-celebration-list">{viewOrder.form_data.events?.length ? viewOrder.form_data.events.map((event,index)=><li key={index}>{event.title} · {event.date} · {event.venue}</li>) : <li>Wedding</li>}</ul></dd><dt><span className="publish-whatsapp-label"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M21 11.5a9 9 0 0 1-13.4 7.8L3 21l1.6-4.7A9 9 0 1 1 21 11.5Z"/><path d="m8 7 2 3-1 1a8 8 0 0 0 4 4l1-1 3 1c-1 3-4 2-6 0s-5-5-3-8Z"/></svg>WhatsAppcopy</span></dt><dd>{viewOrder.phone_number?.trim() || '—'}</dd></dl>{viewOrder.rejection_reason&&<p className="workspace-alert"><strong>Studio note:</strong> {viewOrder.rejection_reason}</p>}{viewOrder.management_id&&<div className="published-link"><a href={`${window.location.origin}/${viewOrder.management_id}`} target="_blank" rel="noreferrer">{`${window.location.origin}/${viewOrder.management_id}`} ↗</a><button onClick={()=>void navigator.clipboard.writeText(`${window.location.origin}/${viewOrder.management_id}`)}>Copy management link</button></div>}{viewOrder.status==='CREATED'&&<div className="client-publish-prompt"><label>Your invitation URL<input readOnly value={viewOrder.published_url || inviteUrl(slugVariants(viewOrder.groom_name,viewOrder.bride_name)[0])}/></label><p>Publish this invitation to make the link live.</p><button type="button" className="primary-action" disabled={busy} onClick={()=>void publishClientOrder(viewOrder)}>{busy?'Publishing…':'Publish invitation →'}</button></div>}{viewOrder.status==='READY'&&viewOrder.published_url&&(!viewOrder.expires_at||new Date(viewOrder.expires_at)>new Date())?<div className="published-link"><a href={viewOrder.published_url} target="_blank" rel="noreferrer">{viewOrder.published_url} ↗</a><button onClick={()=>void navigator.clipboard.writeText(viewOrder.published_url!)}>Copy invitation link</button></div>:viewOrder.status!=='CREATED'&&viewOrder.status!=='READY'&&viewOrder.expires_at&&new Date(viewOrder.expires_at)<=new Date()?<p className="workspace-alert">This invitation link has expired. Contact Shaadi Invites to renew it.</p>:viewOrder.status!=='CREATED'&&viewOrder.status!=='READY'&&<p className="form-note">Your invitation is being prepared. The public link will appear here after publication.</p>}</section></div>}
      {tab === 'Overview' && <div className="overview-dashboard"><section className="client-overview-welcome"><div><span className="workspace-kicker">WELCOME BACK</span><h2>Your invitation studio</h2><p>Create beautiful digital wedding invitations and manage all your orders in one place.</p></div><button type="button" className="client-overview-primary" onClick={() => { setTab('Templates'); setSelected(chosen?.id || allTemplates[0]?.id || null) }}>＋ Create an invitation</button></section><div className="metric-grid">{[
        {label:'Total orders',value:counts.total,icon:'▤',tone:'blue',change:monthOrderChange},
        {label:'Total revenue',value:formatRevenue(datedOrders),icon:'▤',tone:'green',change:revenueChangeLabel(monthRevenue,previousMonthRevenue,'last month')},
        {label:"Today's orders",value:todayOrders.length,icon:'▦',tone:'purple',change:todayOrderChange},
        {label:"Today's revenue",value:formatRevenue(todayOrders),icon:'₹',tone:'gold',change:revenueChangeLabel(todayRevenue,yesterdayRevenue,'yesterday')},
      ].map(metric=><article className={`metric-card metric-${metric.tone}`} key={metric.label}><span>{metric.label}</span><strong>{metric.value}</strong><i aria-hidden="true">{metric.icon}</i><small className={metric.change.startsWith('↑')?'metric-change-up':metric.change.startsWith('↓')?'metric-change-down':'metric-change-neutral'}>{metric.change.includes(' from ')?<><b>{metric.change.slice(0,metric.change.indexOf(' from '))}</b>{metric.change.slice(metric.change.indexOf(' from '))}</>:metric.change}</small></article>)}</div><div className="client-overview-columns"><section className="client-recent-orders"><div className="section-heading recent-orders-heading"><h2>Recent orders</h2><button className="text-action" onClick={() => setTab('Orders')}>View all →</button></div><OrderTable orders={orders.slice(0,5)} onSelect={setViewOrder} variant="overview"/><div className="recent-orders-footer">Showing {orders.length===0?'0':`1–${Math.min(5,orders.length)}`} of {orders.length} orders<button type="button" onClick={()=>setTab('Orders')}>View all orders →</button></div></section><aside className="client-overview-side-card"><h2>Orders by status</h2><div className="client-status-breakdown"><div className="client-status-donut" style={{ background: `conic-gradient(#557260 0 ${orders.length ? orders.filter(order=>order.status==='READY').length/orders.length*100 : 0}%, #e3a05b 0 ${orders.length ? (orders.filter(order=>order.status==='READY').length+orders.filter(order=>order.status==='IN_PROGRESS').length)/orders.length*100 : 0}%, #a87592 0 ${orders.length ? (orders.filter(order=>order.status==='READY').length+orders.filter(order=>order.status==='IN_PROGRESS').length+orders.filter(order=>order.status==='CREATED').length)/orders.length*100 : 0}%, #db7f8e 0 100%)` }}><span><strong>{orders.length}</strong><small>Orders</small></span></div><ul><li><i className="status-dot status-dot-published"/>Published <b>{orders.filter(order=>order.status==='READY').length}</b></li><li><i className="status-dot status-dot-progress"/>In progress <b>{orders.filter(order=>order.status==='IN_PROGRESS').length}</b></li><li><i className="status-dot status-dot-new"/>New <b>{orders.filter(order=>order.status==='CREATED').length}</b></li><li><i className="status-dot status-dot-changes"/>Needs changes <b>{orders.filter(order=>order.status==='REJECTED').length}</b></li></ul></div></aside></div><section className="client-popular-templates"><div className="section-heading"><h2>Popular templates</h2><button className="text-action" onClick={()=>setTab('Templates')}>View all templates →</button></div><div className="client-popular-grid">{allTemplates.slice(0,7).map(template=><button type="button" className="client-popular-template" key={template.id} onClick={()=>chooseTemplate(template.id)}><img src={template.thumbnail_url} alt=""/><strong>{template.name}</strong><small>{template.category}</small></button>)}</div></section></div>}
      {tab === 'Templates' && <>{chosen ? <div className="order-create"><div className="order-template-rail"><button className="back-action" onClick={() => setSelected(null)}>← All templates</button>{templates.map(template => <button key={template.id} className={`rail-template ${selected === template.id ? 'selected' : ''}`} onClick={() => chooseTemplate(template.id)}><img src={template.thumbnail_url} alt=""/><span>{template.name}<small>{template.category}</small></span></button>)}</div><form className="order-form" onSubmit={submitOrder}><div className="form-heading"><span className="workspace-kicker">NEW INVITATION ORDER</span><h2>{chosen.name}</h2></div><fieldset style={{display:review?'none':undefined}}><legend>01 · The couple</legend><div className="form-grid"><Field label="Groom’s name" required value={details.groom} onChange={v => setField('groom',v)}/><Field label="Bride’s name" required value={details.bride} onChange={v => setField('bride',v)}/><Field label="Groom’s family" value={details.groomFamily} onChange={v => setField('groomFamily',v)}/><Field label="Bride’s family" value={details.brideFamily} onChange={v => setField('brideFamily',v)}/><Field label="Phone number" type="tel" required value={phoneNumber} onChange={setPhoneNumber}/></div></fieldset><fieldset style={{display:review?'none':undefined}}><legend>02 · Wedding details</legend><div className="form-grid"><Field label="Wedding celebration name" required value={weddingEventTitle} onChange={setWeddingEventTitle}/><Field label="Wedding date" type="date" required value={details.date} onChange={v => setField('date',v)}/><Field label="Ceremony time" type="time" required value={details.time} onChange={v => setField('time',v)}/><Field label="Venue" required value={details.venue} onChange={v => setField('venue',v)}/><Field label="Address" required value={details.address} onChange={v => setField('address',v)}/><Field label="Map link" type="url" value={details.map} onChange={v => setField('map',v)}/></div></fieldset><fieldset style={{display:review?'none':undefined}}><legend>03 · Celebrations and personal touches</legend><p className="form-note">The wedding celebration is included from the details above.</p>{extraEvents.map((item,index)=><div className="celebration-editor" key={index}><div className="section-heading"><h3>Additional celebration {index+1}</h3><button type="button" className="text-action" onClick={()=>setExtraEvents(events=>events.filter((_,i)=>i!==index))}>Remove</button></div><div className="form-grid"><Field label="Event name" required value={item.title} onChange={v=>setExtraEvents(events=>events.map((event,i)=>i===index?{...event,title:v}:event))}/><Field label="Date" type="date" required value={item.date} onChange={v=>setExtraEvents(events=>events.map((event,i)=>i===index?{...event,date:v}:event))}/><Field label="Time" type="time" required value={item.time} onChange={v=>setExtraEvents(events=>events.map((event,i)=>i===index?{...event,time:v}:event))}/><Field label="Venue" required value={item.venue} onChange={v=>setExtraEvents(events=>events.map((event,i)=>i===index?{...event,venue:v}:event))}/><Field label="Address" required value={item.address} onChange={v=>setExtraEvents(events=>events.map((event,i)=>i===index?{...event,address:v}:event))}/><Field label="Map link" type="url" value={item.map} onChange={v=>setExtraEvents(events=>events.map((event,i)=>i===index?{...event,map:v}:event))}/></div></div>)}<button type="button" className="secondary-action" disabled={extraEvents.length>=9} onClick={()=>setExtraEvents(events=>[...events,{title:'',date:details.date,time:'17:00',venue:'',address:'',map:''}])}>+ Add celebration</button><div className="form-grid"><Field label="Dress code" value={details.dressCode} onChange={v => setField('dressCode',v)}/><Field label="Music link" type="url" value={details.music} onChange={v => setField('music',v)}/><Field label="Photo gallery link" type="url" value={details.gallery} onChange={v => setField('gallery',v)}/></div><label>Welcome message<textarea rows={4} value={details.message} onChange={e => setField('message',e.target.value)}/></label><label>Gift note<textarea rows={2} value={details.giftNote} onChange={e => setField('giftNote',e.target.value)}/></label></fieldset>{review&&<InvitationReview details={details} phone={phoneNumber} title={weddingEventTitle} events={extraEvents} template={chosen.name}/>}<p className="form-note">Your order will be submitted for review before an invitation is created or published.</p><button type="submit" className="primary-action" disabled={busy}>{busy ? 'Submitting order…' : review ? <><ReviewActionIcon/>Create invitation</> : 'Review order →'}</button></form></div> : <><section className="client-collection-intro"><div><span className="workspace-kicker">THE ART OF A BEAUTIFUL BEGINNING</span><h2>Choose a design that tells their story.</h2><p>Preview the collection and prepare a personal invitation order for your couple.</p></div><div className="client-collection-art" aria-hidden="true"><span>Shaadi Invites</span><i>✧</i></div></section><div className="client-collection-heading"><div><span className="workspace-kicker">THE COLLECTION</span><h2>Invitation designs <small>{templates.length} curated styles</small></h2></div><span className="client-collection-note">Select a design to begin an order <b>↓</b></span></div><div className="template-grid">{templates.map((template,index)=><article className="template-tile" key={template.id}><a className="template-image" href={template.preview_url} target="_blank" rel="noreferrer"><img src={template.thumbnail_url} alt={`${template.name} preview`} loading="lazy"/><span>PREVIEW ↗</span></a><div><small>{String(index+1).padStart(2,'0')} · {template.category}</small><h2>{template.name}</h2><button className="text-action" onClick={() => chooseTemplate(template.id)}>Choose this design <b>→</b></button></div></article>)}</div></>}</>}
      {tab === 'Orders' && <><p className="workspace-lede orders-description">View and manage all invitation orders submitted by your customers.</p><div className="orders-filters"><label className="orders-search"><span aria-hidden="true">⌕</span><input value={orderSearch} onChange={e => {setOrderSearch(e.target.value);setOrdersPage(0)}} placeholder="Search by order ID, couple name, or phone number…" aria-label="Search orders"/></label><div className="orders-date-filter"><span aria-hidden="true">▦</span><input type="date" value={orderDateFrom} onChange={e=>{setOrderDateFrom(e.target.value);setOrdersPage(0)}} aria-label="Submitted from"/><span className="orders-date-separator">to</span><input type="date" value={orderDateTo} onChange={e=>{setOrderDateTo(e.target.value);setOrdersPage(0)}} aria-label="Submitted to"/></div></div><OrderTable orders={filtered.slice(ordersPage*20,ordersPage*20+20)} onSelect={setViewOrder} onCreate={orders.length===0?()=>{setTab('Templates');setSelected(chosen?.id||allTemplates[0]?.id||null)}:undefined}/>{filtered.length>20&&<div className="pagination"><button disabled={ordersPage===0} onClick={()=>setOrdersPage(p=>p-1)}>← Previous</button><span>Page {ordersPage+1} of {Math.max(1,Math.ceil(filtered.length/20))}</span><button disabled={(ordersPage+1)*20>=filtered.length} onClick={()=>setOrdersPage(p=>p+1)}>Next →</button></div>}</>}
      {tab === 'Settings' && <TemplateSettingsPanel companyName={company?.company_name || 'your company'} templates={allTemplates} settings={templateSettings} error={error} notice={notice} savingId={savingSetting} canSave={Boolean(company)} onChange={editTemplateSetting} onSave={template=>void saveTemplateSetting(template)}/>}
    </section>
    {tab === 'Templates' && <aside className="client-preview-panel"><div className="client-preview-heading"><div><span className="workspace-kicker">LIVE PREVIEW</span><h2>{previewTemplate?.name || 'Invitation preview'}</h2></div><span className="preview-live-dot" aria-label="Live preview"/></div>{previewTemplate ? <><div className="client-device-frame"><div className="client-device-screen" ref={previewScreen}><iframe key={previewTemplate.id} title={`${previewTemplate.name} mobile invitation preview`} src={previewTemplate.preview_url} loading="lazy" style={{ transform: `scale(${previewScale})` }} onLoad={() => { const screen = previewScreen.current; if (screen) setPreviewScale(Math.min(screen.clientWidth / 402, screen.clientHeight / 874)) }}/></div></div><div className="client-preview-thumbs" aria-label="Choose a design to preview">{templates.map(template=><button type="button" key={template.id} className={previewTemplate.id === template.id ? 'active' : ''} onClick={()=>setPreviewId(template.id)} aria-label={`Preview ${template.name}`}><img src={template.thumbnail_url} alt=""/></button>)}</div><a className="client-preview-open" href={previewTemplate.preview_url} target="_blank" rel="noreferrer">Preview Full Invitation <span>↗</span></a><button type="button" className="client-preview-choose" onClick={()=>chooseTemplate(previewTemplate.id)}>Get this design <span>→</span></button></> : <p className="form-note">Your invitation previews will appear here.</p>}</aside>}
  </main></CardTemplateContext.Provider>
}

function Field({ label, value, onChange, type = 'text', required = false }: { label: string; value: string; onChange: (value: string) => void; type?: string; required?: boolean }) {
  const {template,showCoupleIllustrations,onIllustrationsChange} = useContext(CardTemplateContext)
  const field = ({ 'Groom’s name':'groom', 'Bride’s name':'bride', 'Wedding celebration name': 'title', 'Event name': 'title', Venue: 'venue', Address: 'address' } as Record<string, string>)[label]
  const maxLength = nameTextLimit(template,field) ?? cardTextLimit(template, field) ?? (type === 'url' ? 2000 : 600)
  const multiline = Boolean(field && !['groom', 'bride'].includes(field)) || ['Groom’s family', 'Bride’s family', 'Dress code', 'Gift note', 'Notes'].includes(label)
  return <><label>{label}{required && <i> *</i>}{multiline && type==='text' ? <textarea rows={2} value={value} onChange={event => onChange(event.target.value)} maxLength={maxLength} required={required} style={{resize:'vertical'}}/> : <input type={type} value={value} onChange={event => onChange(event.target.value)} maxLength={maxLength} required={required}/>}</label>{[2,3,5,6,7].includes(template)&&label==='Bride’s family'&&<label style={{display:'flex',alignItems:'center',gap:12,gridColumn:'1 / -1'}}><input type="checkbox" checked={showCoupleIllustrations} onChange={event=>onIllustrationsChange(event.target.checked)} style={{width:20,height:20,minHeight:0,margin:0,padding:0}}/>Show Bride &amp; Groom Illustrations</label>}</>
}
function TemplatePrice({ setting }: { setting?: TemplateSettings }) {
  if (!setting) return <span className="client-template-price client-template-price-unset">Price not set</span>
  const formatPrice = (value: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value)
  const currentPrice = setting.sale_type === 'percentage'
    ? setting.price * (1 - setting.sale_value / 100)
    : setting.sale_type === 'fixed' ? setting.price - setting.sale_value : setting.price
  if (setting.sale_type === 'none' || setting.sale_value === 0) return <span className="client-template-price"><strong>{formatPrice(setting.price)}</strong></span>
  return <span className="client-template-price client-template-price-sale"><small className="client-template-sale-badge">{setting.sale_type === 'percentage' ? `${setting.sale_value}% OFF` : `${formatPrice(setting.sale_value)} OFF`}</small><span className="client-template-price-row"><strong>{formatPrice(currentPrice)}</strong><i aria-hidden="true"/><del>{formatPrice(setting.price)}</del></span></span>
}
function TemplateSettingsPanel({companyName,templates,settings,error,notice,savingId,canSave,onChange,onSave}:{companyName:string;templates:Template[];settings:Record<number,TemplateSettings>;error:string;notice:string;savingId:number|null;canSave:boolean;onChange:(id:number,patch:Partial<TemplateSettings>)=>void;onSave:(template:Template)=>void}) {
  return <><div className="client-settings-intro"><span className="workspace-kicker">YOUR TEMPLATE CATALOG</span><h2>Configure your designs</h2><p>Set your price, optional discount, and premium status for each template. These settings belong to {companyName}.</p></div>{error&&<p className="workspace-alert" role="alert">{error}</p>}{notice&&<p className="workspace-success" role="status">{notice}</p>}<div className="client-template-settings">{templates.map(template=>{const setting=settings[template.id]||{price:0,sale_type:'none' as const,sale_value:0,is_premium:false};return <article className="client-template-setting" key={template.id}><div className="client-template-setting-art"><img src={template.thumbnail_url} alt={`${template.name} invitation cover`}/></div><div className="client-template-setting-content"><h3>{template.name}</h3><div className="client-template-setting-fields"><label>Price (INR)<span className="client-settings-input-wrap"><i aria-hidden="true">₹</i><input type="number" min="0" step="1" value={setting.price} onChange={event=>onChange(template.id,{price:Number(event.target.value)})}/></span></label><label>Sale type<select value={setting.sale_type} onChange={event=>onChange(template.id,{sale_type:event.target.value as TemplateSettings['sale_type'],sale_value:event.target.value==='none'?0:setting.sale_value})}><option value="none">No sale</option><option value="percentage">Percentage discount</option><option value="fixed">Fixed discount</option></select></label>{setting.sale_type!=='none'&&<label className="client-discount-setting">{setting.sale_type==='percentage'?'Discount percentage':'Discount amount (INR)'}<span className="client-settings-input-wrap">{setting.sale_type==='fixed'&&<i aria-hidden="true">₹</i>}<input type="number" min="0" max={setting.sale_type==='percentage'?100:setting.price} step={setting.sale_type==='percentage'?'0.1':'1'} value={setting.sale_value} onChange={event=>onChange(template.id,{sale_value:Number(event.target.value)})}/>{setting.sale_type==='percentage'&&<i aria-hidden="true">%</i>}</span></label>}</div><label className="client-premium-setting"><input type="checkbox" checked={setting.is_premium} onChange={event=>onChange(template.id,{is_premium:event.target.checked})}/><span className="client-premium-switch" aria-hidden="true"/><span className="client-premium-copy"><b>Premium template <i aria-hidden="true">♛</i></b><small>Mark as premium to highlight this template.</small></span></label><div className="client-template-setting-actions"><button type="button" className="primary-action" disabled={!canSave||savingId===template.id} onClick={()=>onSave(template)}>{savingId===template.id?'Saving…':'Save changes'}</button></div></div></article>})}</div></>
}
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
