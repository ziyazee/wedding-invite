import { createContext, useContext, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, lazy, Suspense } from 'react'
import type { FormEvent, ReactElement } from 'react'
import { createPortal } from 'react-dom'
import { cardTextLimit, nameTextLimit, designs, slugVariants, inviteUrl, validateDetails } from '../invitations/model'
import type { Celebration, InvitationData } from '../invitations/model'
import type { TextLayout } from '../invitations/textLayout'
import { readTextLayout } from '../invitations/textLayout'
import { invitationExample } from '../invitations/templateData'
import { loadTemplateCatalog } from '../invitations/templateCatalog'
import type { InvitationTemplate } from '../invitations/templateCatalog'
import { TEMPLATE_INTRO_VIDEOS, TEMPLATE_INTRO_IMAGES, TEMPLATE_THUMBNAIL_OVERRIDES } from '../lib/templateCardData'
import { isSupabaseConfigured, supabase } from '../lib/supabase'
import { DashboardAccess, signOutToLogin } from './DashboardAccess'
import './Workspaces.css'
import './ClientDashboard.css'
import InvitationReview, { ReviewActionIcon } from './InvitationReview'
import { templateSellingPrice } from '../lib/orderPricing'

const OrderTextEditor = lazy(() => import('./OrderTextEditor'))

type Order = { id: number; groom_name: string; bride_name: string; status: string; created_at: string; form_data: InvitationData; published_path: string | null; published_url: string | null; management_id: string; published_at: string | null; expires_at: string | null; rejection_reason: string | null; template_code: string; phone_number: string; price?: number | null }
type Template = InvitationTemplate
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
const CATEGORY_ORDER = ['Classic', 'Royal Hindu', 'Hindu', 'Muslim', 'Christian', 'Garden', 'Indian']


export default function ClientDashboard() {
  return <DashboardAccess role="CLIENT"><ClientWorkspace /></DashboardAccess>
}

export function ClientDashboardTesting() {
  return <DashboardAccess role="CLIENT"><ClientWorkspace showHiddenTemplates /></DashboardAccess>
}

function ClientWorkspace({ showHiddenTemplates = false }: { showHiddenTemplates?: boolean }) {
  const draftRestored = useRef(false)
  const [draftKey, setDraftKey] = useState<string | null>(null)
  const [draftStatus, setDraftStatus] = useState('Preparing draft…')
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
  const [review, setReview] = useState(false)
  const [notice, setNotice] = useState('')
  const [error, setError] = useState('')
  const [waPhone, setWaPhone] = useState('')
  const [waSending, setWaSending] = useState(false)
  const [waSent, setWaSent] = useState(false)
  const [waError, setWaError] = useState('')
  const pdfInputRef = useRef<HTMLInputElement>(null)
  const [pdfExtracting, setPdfExtracting] = useState(false)
  type PdfExtracted = { groom?: string; bride?: string; groomFamily?: string; brideFamily?: string; date?: string; time?: string; venue?: string; address?: string; message?: string; dressCode?: string; events?: { title?: string; date?: string; time?: string; venue?: string; address?: string }[] }
  const [pdfResult, setPdfResult] = useState<PdfExtracted | null>(null)
  const [pdfError, setPdfError] = useState('')

  const refresh = useCallback(async () => {
    if (!supabase || !isSupabaseConfigured) { setError('Connect Supabase to load your company dashboard.'); setLoading(false); return }
    const { data, error: authError } = await supabase.auth.getUser()
    if (authError || !data.user) { setLoading(false); return }
    const [templatesResult, ordersResult] = await Promise.all([
      loadTemplateCatalog(!showHiddenTemplates).then(data => ({ data, error: null as { message: string } | null })).catch(error => ({ data: [] as Template[], error: { message: error instanceof Error ? error.message : 'Could not load templates.' } })),
      supabase.from('orders').select('*').order('created_at', { ascending: false }),
    ])
    if (templatesResult.error) setError(templatesResult.error.message)
    if (ordersResult.error) setError(ordersResult.error.message)
    const activeTemplates = templatesResult.data
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
  }, [showHiddenTemplates])

  useEffect(() => { void refresh() }, [refresh])
  useEffect(()=>{
    if(!draftKey)return
    try{
      localStorage.setItem(draftKey,JSON.stringify({tab,details,phoneNumber,weddingEventTitle,extraEvents,selected,previewId,showDetails,formStep,review}))
      setDraftStatus('Draft saved on this device · included when you create the invitation.')
    }catch{ setDraftStatus('Browser storage unavailable · keep this page open until you create the invitation.') }
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
  const priceIsSet = (order: Order) => typeof order.price === 'number' && Number.isFinite(order.price) && order.price >= 0
  const missingPrices = (items: typeof datedOrders) => items.filter(item => !priceIsSet(item.order)).length
  const recordedRevenue = (items: typeof datedOrders) => items.reduce((sum, item) => sum + (priceIsSet(item.order) ? item.order.price! : 0), 0)
  const formatRevenue = (items: typeof datedOrders) => items.length > 0 && missingPrices(items) === items.length ? '—' : new Intl.NumberFormat('en-IN',{style:'currency',currency:'INR',maximumFractionDigits:0}).format(recordedRevenue(items))
  const revenueTrend = (items: typeof datedOrders) => missingPrices(items) === 0 ? recordedRevenue(items) : null
  const revenueCoverage = (items: typeof datedOrders, fallback: string) => {
    const missing = missingPrices(items)
    return missing ? `${missing} order${missing === 1 ? '' : 's'} missing a price · excluded from revenue` : fallback
  }
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
  const categories = useMemo(() => {
    const unique = [...new Set(allTemplates.map(template => template.category).filter(Boolean))]
    return unique.sort((a, b) => {
      const ai = CATEGORY_ORDER.indexOf(a); const bi = CATEGORY_ORDER.indexOf(b)
      if (ai !== -1 && bi !== -1) return ai - bi
      if (ai !== -1) return -1
      if (bi !== -1) return 1
      return a.localeCompare(b)
    })
  }, [allTemplates])
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
    return {
      ...details,
      template: selected ?? previewTemplate?.id ?? details.template,
      events: [{ title: weddingEventTitle, date: details.date, time: details.time, venue: details.venue, address: details.address, map: details.map }, ...extraEvents],
    }
  }, [details, extraEvents, previewTemplate?.id, selected, weddingEventTitle])
  const previewSrc = showDetails ? '/client/live-preview?editor=1' : previewTemplate?.preview_url || '/client/live-preview'
  useLayoutEffect(() => {
    if (tab !== 'Templates' || !showDetails) return
    try { sessionStorage.setItem('shaadi-client-live-preview', JSON.stringify(livePreviewDetails)) } catch { return }
  }, [livePreviewDetails, showDetails, tab])
  useEffect(() => {
    setWaPhone('')
    setWaSent(false)
    setWaError('')
  }, [viewOrder?.id])
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
  async function chooseTemplate(id: number) {
    const example = invitationExample(id)
    setSelected(id)
    setPreviewId(id)
    let textOverrides: TextLayout | undefined
    try {
      const resp = await fetch(`/edits/${id}.json`)
      if (resp.ok) textOverrides = readTextLayout(await resp.json())
    } catch { /* no defaults for this template */ }
    if (example) {
      const [wedding, ...celebrations] = example.events
      setDetails({ ...example, events: [], textOverrides })
      if (wedding) setWeddingEventTitle(wedding.title)
      setExtraEvents(celebrations)
    } else setDetails(previous => ({
      ...previous,
      template: id,
      textOverrides,
      message: ['Hindu', 'Indian'].includes(templates.find(template => template.id === id)?.category || '')
        ? 'With the blessings of Lord Ganesha and our families, we invite you to celebrate the beginning of our forever.'
        : previous.message,
    }))
    setShowDetails(true); setFormStep(0); setTab('Templates'); setNotice(''); setError(''); setReview(false)
  }
  function editTemplateSetting(id: number, patch: Partial<TemplateSettings>) {
    setTemplateSettings(current => ({ ...current, [id]: { ...(current[id] ?? { price: 0, sale_type: 'none', sale_value: 0, is_premium: false }), ...patch } }))
  }
  async function saveAllTemplateSettings() {
    if (!company || !supabase) return
    setError(''); setNotice('')
    for (const template of allTemplates) {
      const s = templateSettings[template.id] || { price: 0, sale_type: 'none' as const, sale_value: 0, is_premium: false }
      if (!Number.isFinite(s.price) || s.price < 0 || !Number.isFinite(s.sale_value) || s.sale_value < 0) { setError('Enter valid, non-negative prices and discounts.'); return }
      if (s.sale_type === 'percentage' && s.sale_value > 100) { setError('A percentage discount cannot exceed 100%.'); return }
      if (s.sale_type === 'fixed' && s.sale_value > s.price) { setError(`${template.name}: fixed discount cannot exceed the template price.`); return }
    }
    const rows = allTemplates.map(template => { const s = templateSettings[template.id] || { price: 0, sale_type: 'none' as const, sale_value: 0, is_premium: false }; return { company_id: company.id, template_id: template.id, price: s.price, sale_type: s.sale_type, sale_value: s.sale_type === 'none' ? 0 : s.sale_value, is_premium: s.is_premium } })
    const { error: saveError } = await supabase.from('company_template_settings').upsert(rows, { onConflict: 'company_id,template_id' })
    if (saveError) setError(saveError.message)
  }
  async function publishClientOrder(order: Order) {
    if (!supabase) return
    setBusy(true); setError(''); setNotice('')
    const candidates = order.published_path ? [order.published_path] : slugVariants(order.groom_name, order.bride_name)
    try {
      const { data, error: publishError } = await supabase.rpc('publish_company_order_with_candidates', { p_order_id: order.id, p_candidate_paths: candidates })
      if (publishError) throw publishError
      const path = data?.published_path || candidates[0]
      const published = { ...order, status: 'READY', published_path: path, published_url: data?.published_url || inviteUrl(path), published_at: data?.published_at || new Date().toISOString() }
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
  async function sendWhatsApp() {
    if (!viewOrder?.published_url || !viewOrder.management_id || !supabase) return
    const phone = waPhone.trim()
    if (!phone) return
    setWaSending(true); setWaError('')
    try {
      const { error: fnError } = await supabase.functions.invoke('send-whatsapp', {
        body: {
          phone,
          groomBride: `${viewOrder.groom_name} & ${viewOrder.bride_name}`,
          inviteUrl: viewOrder.published_url,
          managementUrl: `${window.location.origin}/${viewOrder.management_id}`,
          companyName: company?.company_name ?? 'Shaadi Invites',
        },
      })
      if (fnError) throw fnError
      setWaSent(true)
    } catch (err) {
      setWaError(err instanceof Error ? err.message : 'Failed to send. Please try again.')
    } finally { setWaSending(false) }
  }
  const pdfExtractPrompt = `You are a wedding invitation data extractor. Analyze this PDF and extract structured details. Return ONLY valid JSON, no markdown fences, matching this exact shape:
{"groom":"full name","bride":"full name","groomFamily":"COMPLETE family description","brideFamily":"COMPLETE family description","date":"YYYY-MM-DD","time":"HH:MM","venue":"venue name","address":"full address","message":"any special message or religious text from the invite","dressCode":"if mentioned","events":[{"title":"event name","date":"YYYY-MM-DD","time":"HH:MM","venue":"venue","address":"address"}]}
Rules:
- Use ISO date format (YYYY-MM-DD). Use 24h time (HH:MM).
- If a field is not found, use empty string.
- The events array is for additional ceremonies (mehendi, sangeet, reception) beyond the main wedding — leave empty if only one event.
- Extract groom and bride FULL names as written on the invitation.
- CRITICAL for groomFamily and brideFamily: Include EVERYTHING written about each family — parent names with titles (Mr./Mrs./Marhoom), relation labels (S/o, D/o, Grand D/o), house names, village/town names, grandparent names, and any other family details. Copy the full text as-is from the invitation, preserving all details. Do NOT shorten or summarize — include every word related to each family.`

  async function callOpenAI(base64: string, filename: string): Promise<PdfExtracted> {
    if (!supabase) throw new Error('Supabase client not available.')
    const { data, error: fnError } = await supabase.functions.invoke('openai-extract', {
      body: { pdf: base64, filename, prompt: pdfExtractPrompt },
    })
    if (fnError) throw fnError
    if (data?.error) throw new Error(data.error)
    const raw = (data?.text || '').trim()
    return JSON.parse(raw)
  }

  async function handlePdfUpload(file: File) {
    setPdfExtracting(true); setPdfError(''); setPdfResult(null)
    try {
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => { const result = reader.result as string; resolve(result.split(',')[1]) }
        reader.onerror = () => reject(new Error('Failed to read file.'))
        reader.readAsDataURL(file)
      })
      if (!supabase) throw new Error('No Supabase client available.')
      setPdfResult(await callOpenAI(base64, file.name))
    } catch (err) {
      setPdfError(err instanceof Error ? err.message : 'Failed to extract text from PDF.')
      setPdfResult(null)
    } finally { setPdfExtracting(false) }
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
      const { data: reserved, error: reserveError } = await supabase.rpc('reserve_company_order_path', { p_order_id: createdOrder.id, p_candidate_paths: slugVariants(createdOrder.groom_name, createdOrder.bride_name) })
      const publishedPath: string | null = reserved?.published_path || null
      setViewOrder({ ...createdOrder, published_path: publishedPath, published_url: null })
      setSelected(null); setDetails(initial); setPhoneNumber(defaultPhoneNumber); setWeddingEventTitle(initialWeddingEvent); setExtraEvents(initialExtraEvents); setShowDetails(false); setFormStep(0); setTab('Orders'); setReview(false); await refresh()
      if (reserveError) setError(`Order created, but its URL could not be reserved yet: ${reserveError.message}`)
    } catch (cause) {
      const databaseMessage = cause && typeof cause === 'object' && 'message' in cause && typeof cause.message === 'string' ? cause.message : null
      setError(cause instanceof Error ? cause.message : databaseMessage || 'Unable to submit this order.')
    }
    finally { setBusy(false) }
  }

  const categoryChipIcons: Record<string, ReactElement> = {
    Classic:      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M2 20h20"/><path d="M5 20V10l3.5 4L12 4l3.5 10L19 10v10"/><circle cx="12" cy="4" r="1.2" fill="currentColor"/><circle cx="5.5" cy="10" r="1" fill="currentColor"/><circle cx="18.5" cy="10" r="1" fill="currentColor"/></svg>,
    'Royal Hindu':<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 21c-4-3-7-6.5-7-10a7 7 0 0 1 14 0c0 3.5-3 7-7 10z"/><path d="M12 21V8"/><path d="M8 13c1.5-1 2.5-3 4-5"/><path d="M16 13c-1.5-1-2.5-3-4-5"/></svg>,
    Hindu:        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 21c-4-3-7-6.5-7-10a7 7 0 0 1 14 0c0 3.5-3 7-7 10z"/><path d="M12 21V8"/><path d="M8 13c1.5-1 2.5-3 4-5"/><path d="M16 13c-1.5-1-2.5-3-4-5"/></svg>,
    Muslim:       <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>,
    Christian:    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="3" x2="12" y2="21"/><line x1="6" y1="9" x2="18" y2="9"/></svg>,
    Garden:       <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22V12"/><path d="M5 12a7 7 0 0 1 7-7c0 4-3 7-7 7z"/><path d="M19 12a7 7 0 0 0-7-7c0 4 3 7 7 7z"/><path d="M9 18a5 5 0 0 1 3-4"/><path d="M15 18a5 5 0 0 0-3-4"/></svg>,
    Indian:       <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1"/></svg>,
  }
  const navIcons: Record<string, ReactElement> = {
    Overview: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
    Templates: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/></svg>,
    Orders: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="1"/><line x1="9" y1="12" x2="15" y2="12"/><line x1="9" y1="16" x2="13" y2="16"/></svg>,
    Settings: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="4" y1="21" x2="4" y2="14"/><line x1="4" y1="10" x2="4" y2="3"/><line x1="12" y1="21" x2="12" y2="12"/><line x1="12" y1="8" x2="12" y2="3"/><line x1="20" y1="21" x2="20" y2="16"/><line x1="20" y1="12" x2="20" y2="3"/><line x1="1" y1="14" x2="7" y2="14"/><line x1="9" y1="8" x2="15" y2="8"/><line x1="17" y1="16" x2="23" y2="16"/></svg>,
  }
  if (loading) return <main className="dash-loading">Preparing your invitation studio…</main>
  return <CardTemplateContext.Provider value={{template:selected ?? 0,showCoupleIllustrations:details.showCoupleIllustrations!==false,onIllustrationsChange:show=>setDetails(previous=>({...previous,showCoupleIllustrations:show}))}}><main className={`workspace client-workspace ${tab === 'Templates' ? 'has-client-preview' : ''} ${tab === 'Orders' ? 'has-orders-page' : ''} ${tab === 'Overview' ? 'has-overview-page' : ''} ${showDetails ? 'show-client-details' : ''} ${showDetails && formStepCount > 0 && formStep >= formStepCount - 1 ? 'last-form-step' : ''} ${review ? 'reviewing-client-order' : ''}`}>
    <header className="client-topbar"><label className="client-top-search"><span aria-hidden="true">⌕</span><input value={templateSearch} onChange={event=>{setTemplateSearch(event.target.value);setTab('Templates');setSelected(null)}} placeholder="Search templates by name, category or style…" aria-label="Search invitation designs"/></label>
    <div className="workspace-account"><span className="client-account-name">{company?.company_name || 'Company'}</span><span className="client-account-avatar" aria-hidden="true"><svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4.5 21a7.5 7.5 0 0 1 15 0"/></svg></span></div></header>
    <aside className="workspace-sidebar"><a href="/" className="client-brand"><img src={showHiddenTemplates ? '/logo-landing.png' : companyLogo} alt={company?.company_name || 'Shaadi Invites'} onError={()=>setCompanyLogo('/logo.png')}/></a><nav className="client-section-nav" aria-label="Client dashboard">{(['Overview','Templates','Orders','Settings'] as const).map(item=><button type="button" key={item} className={tab===item?'active':''} onClick={()=>{setTab(item);setSelected(item==='Templates'?(chosen?.id||allTemplates[0]?.id||null):null);setError('')}}><span aria-hidden="true">{navIcons[item]}</span>{item==='Overview'?'Dashboard':item}</button>)}</nav><section className="client-sidebar-note"><span>♕ CLIENT SUPPORT</span><h2>Need a hand?</h2><p>Our team can help you create a beautiful invitation.</p><a href="https://wa.me/917975948093?text=Hey%20I%20need%20an%20invitation%21" target="_blank" rel="noreferrer">Contact support <b>↗</b></a></section><button className="workspace-logout" aria-label="Log out" onClick={() => void signOutToLogin()}><span aria-hidden="true"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg></span><span>Log out</span></button></aside>
    <section className={`workspace-main ${tab==='Orders'?'orders-page':''}`}><header className="workspace-top"><div><span className="workspace-kicker">{tab==='Orders'?'ORDERS':tab==='Templates'?(showDetails?'PERSONALISE YOUR INVITATION':'THE ART OF A BEAUTIFUL BEGINNING'):`${company?.company_name||'Company'} · PRIVATE STUDIO`}</span><h1>{tab==='Templates'?(showDetails?'Create your invitation':'Choose a Template'):tab==='Overview'?'Your invitation studio':tab}</h1></div>{tab==='Orders'&&<button type="button" className="orders-new-order" onClick={()=>{setTab('Templates');setSelected(chosen?.id||allTemplates[0]?.id||null)}}><span aria-hidden="true">＋</span> New Order</button>}{tab==='Templates'&&showDetails&&workflowHost&&createPortal(<div className="client-workflow-controls"><span className="client-workflow-progress" aria-hidden="true"></span><button type="button" className="client-workflow-back" disabled={review?false:formStep===0} onClick={()=>review?setReview(false):setFormStep(step=>Math.max(0,step-1))}>{review?<><ReviewActionIcon edit/>Edit details</>:'← Back'}</button><button type="button" className="client-workflow-next" hidden={review} onClick={advanceFormStep}>Continue →</button></div>,workflowHost)}{tab==='Templates'&&showDetails&&<><input ref={pdfInputRef} type="file" accept=".pdf,application/pdf" hidden onChange={e=>{const f=e.target.files?.[0];if(f)void handlePdfUpload(f);e.target.value=''}}/><button type="button" className={`client-upload-pdf-ai${pdfExtracting?' ai-extracting':''}`} disabled={pdfExtracting} onClick={()=>pdfInputRef.current?.click()}><span className="ai-icon-wrap"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><path d="M9 15l3-3 3 3"/><path d="M12 12v6"/></svg></span><span className="ai-label"><strong>{pdfExtracting?'Extracting…':<>Upload PDF <i>AI</i></>}</strong><small>{pdfExtracting?'Gemini is reading your PDF':'Auto-fill invitation details from any PDF'}</small></span><span className="ai-sparkle" aria-hidden="true">✦</span></button></>}{tab==='Templates'&&showDetails&&<button type="button" className="client-form-back" onClick={()=>{setShowDetails(false);setReview(false)}}>← Back to templates</button>}{tab==='Templates'&&<span className="client-design-count">{allTemplates.length} carefully curated invitations</span>}</header>
      {tab==='Templates'&&<div className="client-catalog-controls"><div className="client-filter-chips"><button type="button" className={categoryFilter==='ALL'?'active':''} onClick={()=>selectCategory('ALL')}>All <span className="category-chip-count">{allTemplates.length}</span></button>{categories.map(category=><button type="button" key={category} className={categoryFilter===category?'active':''} onClick={()=>selectCategory(category)}><span className="category-chip-icon" aria-hidden="true">{categoryChipIcons[category] ?? <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3"/></svg>}</span>{category}</button>)}</div><label className="client-sort-control">Sort by<select value={templateSort} onChange={event=>setTemplateSort(event.target.value as 'CURATED'|'NAME')}><option value="CURATED">Curated</option><option value="NAME">Name</option></select></label></div>}
      {tab==='Templates'&&chosen&&<div className="client-selected-gallery"><div className="client-selected-gallery-title"><span className="workspace-kicker">THE COLLECTION</span><button type="button" onClick={()=>setShowDetails(false)}>{showDetails?'Hide details':'Choose a template'}</button></div><div key={categoryFilter} className={`client-selected-card-grid category-slide-from-${categoryDirection}`}>{templates.map(template=><article key={template.id} className={`client-selected-card ${template.id===previewTemplate?.id?'active':''}`}><button type="button" className="client-card-preview-trigger" onClick={()=>setPreviewId(template.id)} aria-label={`Preview ${template.name} on the mobile screen`}><span className="client-selected-thumb">{TEMPLATE_INTRO_VIDEOS[template.id]?<video src={TEMPLATE_INTRO_VIDEOS[template.id]} poster={TEMPLATE_THUMBNAIL_OVERRIDES[template.id]??template.thumbnail_url} autoPlay muted loop playsInline aria-label={`${template.name} intro preview`}/>:<img src={TEMPLATE_THUMBNAIL_OVERRIDES[template.id]??TEMPLATE_INTRO_IMAGES[template.id]??template.thumbnail_url} alt=""/>}{templateSettings[template.id]?.is_premium&&<span className="client-template-premium-badge">PREMIUM</span>}</span><span className="client-template-card-meta"><span className="client-template-card-copy"><strong>{template.name}</strong><small>{template.category}</small></span><TemplatePrice setting={templateSettings[template.id]}/></span></button><button type="button" className="client-selected-card-order" onClick={()=>chooseTemplate(template.id)}>Get this design <span aria-hidden="true">→</span></button></article>)}</div></div>}
      {tab !== 'Settings' && error && <p className="workspace-alert" role="alert">{error}</p>}{tab === 'Templates' && notice && <p className="workspace-success" role="status">{notice}</p>}
      {viewOrder && <div className="client-order-overlay" role="presentation" onMouseDown={event=>{if(event.target===event.currentTarget)setViewOrder(null)}}><section className="client-order-dialog" role="dialog" aria-modal="true" aria-labelledby="client-order-title"><button className="dialog-close" onClick={()=>setViewOrder(null)} aria-label="Close order details">×</button><span className="workspace-kicker">ORDER #{viewOrder.id}</span><span className={`status-pill status-${viewOrder.status.toLowerCase()}`}>{statusTitle[viewOrder.status]}</span><h2 id="client-order-title">{viewOrder.groom_name} & {viewOrder.bride_name}</h2><p>{designs.find(d=>d.id===viewOrder.form_data.template)?.name} · Submitted {new Date(viewOrder.created_at).toLocaleDateString()}</p><dl><dt>Wedding date</dt><dd>{viewOrder.form_data.date} · {viewOrder.form_data.time}</dd><dt>Venue</dt><dd>{viewOrder.form_data.venue}, {viewOrder.form_data.address}</dd><dt>Celebrations</dt><dd><ul className="publish-celebration-list">{viewOrder.form_data.events?.length ? viewOrder.form_data.events.map((event,index)=><li key={index}>{event.title} · {event.date} · {event.venue}</li>) : <li>Wedding</li>}</ul></dd><dt><span className="publish-whatsapp-label"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M21 11.5a9 9 0 0 1-13.4 7.8L3 21l1.6-4.7A9 9 0 1 1 21 11.5Z"/><path d="m8 7 2 3-1 1a8 8 0 0 0 4 4l1-1 3 1c-1 3-4 2-6 0s-5-5-3-8Z"/></svg>WhatsAppcopy</span></dt><dd>{viewOrder.phone_number?.trim() || '—'}</dd></dl>{viewOrder.rejection_reason&&<p className="workspace-alert"><strong>Studio note:</strong> {viewOrder.rejection_reason}</p>}{viewOrder.management_id&&<div className="published-link"><a href={`${window.location.origin}/${viewOrder.management_id}`} target="_blank" rel="noreferrer">{`${window.location.origin}/${viewOrder.management_id}`} ↗</a><button onClick={()=>void navigator.clipboard.writeText(`${window.location.origin}/${viewOrder.management_id}`)}>Copy management link</button></div>}{viewOrder.status==='CREATED'&&<div className="client-publish-prompt"><label>Your invitation URL<input readOnly value={viewOrder.published_url || (viewOrder.published_path ? inviteUrl(viewOrder.published_path) : 'Will be assigned when published')}/></label><p>Publish this invitation to make the link live.</p><button type="button" className="primary-action" disabled={busy} onClick={()=>void publishClientOrder(viewOrder)}>{busy?'Publishing…':'Publish invitation →'}</button></div>}{viewOrder.status==='READY'&&viewOrder.published_url&&(!viewOrder.expires_at||new Date(viewOrder.expires_at)>new Date())?<div className="published-link"><a href={viewOrder.published_url} target="_blank" rel="noreferrer">{viewOrder.published_url} ↗</a><button onClick={()=>void navigator.clipboard.writeText(viewOrder.published_url!)}>Copy invitation link</button><div className="wa-send-section"><p className="wa-send-label"><svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>Send on WhatsApp</p><div className="wa-send-row"><input type="tel" placeholder="+91 98765 43210" value={waPhone} onChange={e=>{setWaPhone(e.target.value);setWaSent(false);setWaError('')}} disabled={waSending||waSent}/><button type="button" className="wa-send-btn" onClick={()=>void sendWhatsApp()} disabled={waSending||!waPhone.trim()||waSent}>{waSent?'Sent ✓':waSending?'Sending…':'Send'}</button></div>{waError&&<p className="wa-error" role="alert">{waError}</p>}</div></div>:viewOrder.status!=='CREATED'&&viewOrder.status!=='READY'&&viewOrder.expires_at&&new Date(viewOrder.expires_at)<=new Date()?<p className="workspace-alert">This invitation link has expired. Contact Shaadi Invites to renew it.</p>:viewOrder.status!=='CREATED'&&viewOrder.status!=='READY'&&<p className="form-note">Your invitation is being prepared. The public link will appear here after publication.</p>}</section></div>}
      {tab === 'Overview' && <div className="overview-dashboard"><section className="client-overview-welcome"><div><span className="workspace-kicker">WELCOME BACK</span><h2>Your invitation studio</h2><p>Create beautiful digital wedding invitations and manage all your orders in one place.</p></div><button type="button" className="client-overview-primary" onClick={() => { setTab('Templates'); setSelected(chosen?.id || allTemplates[0]?.id || null) }}>＋ Create an invitation</button></section><div className="metric-grid">{[
        {label:'Total orders',value:counts.total,icon:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="3"/><path d="M8 10h8M8 14h5"/></svg>,tone:'blue',change:monthOrderChange},
        {label:'Total revenue',value:formatRevenue(datedOrders),icon:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M6 6h9a3 3 0 0 1 0 6H6M8 12h8a3 3 0 0 1 0 6H6"/></svg>,tone:'green',change:revenueCoverage(datedOrders,revenueChangeLabel(monthRevenue,previousMonthRevenue,'last month'))},
        {label:"Today's orders",value:todayOrders.length,icon:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="3"/><path d="M16 2v4M8 2v4M3 10h18M8 15h2M14 15h2"/></svg>,tone:'purple',change:todayOrderChange},
        {label:"Today's revenue",value:formatRevenue(todayOrders),icon:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 6v12M8 9h6.5a2 2 0 0 1 0 4H8M9 13h6a2 2 0 0 1 0 4H8"/></svg>,tone:'gold',change:revenueCoverage(todayOrders,revenueChangeLabel(todayRevenue,yesterdayRevenue,'yesterday'))},
      ].map(metric=><article className={`metric-card metric-${metric.tone}`} key={metric.label}><span>{metric.label}</span><strong>{metric.value}</strong><i aria-hidden="true">{metric.icon}</i><small className={metric.change.startsWith('↑')?'metric-change-up':metric.change.startsWith('↓')?'metric-change-down':'metric-change-neutral'}>{metric.change.includes(' from ')?<><b>{metric.change.slice(0,metric.change.indexOf(' from '))}</b>{metric.change.slice(metric.change.indexOf(' from '))}</>:metric.change}</small></article>)}</div><div className="client-overview-columns"><section className="client-recent-orders"><div className="section-heading recent-orders-heading"><h2>Recent orders</h2><button className="text-action" onClick={() => setTab('Orders')}>View all →</button></div><OrderTable orders={orders.slice(0,5)} onSelect={setViewOrder} variant="overview"/><div className="recent-orders-footer">Showing {orders.length===0?'0':`1–${Math.min(5,orders.length)}`} of {orders.length} orders<button type="button" onClick={()=>setTab('Orders')}>View all orders →</button></div></section><aside className="client-overview-side-card"><h2>Orders by status</h2><div className="client-status-breakdown"><div className="client-status-donut" style={{ background: `conic-gradient(#557260 0 ${orders.length ? orders.filter(order=>order.status==='READY').length/orders.length*100 : 0}%, #e3a05b 0 ${orders.length ? (orders.filter(order=>order.status==='READY').length+orders.filter(order=>order.status==='IN_PROGRESS').length)/orders.length*100 : 0}%, #a87592 0 ${orders.length ? (orders.filter(order=>order.status==='READY').length+orders.filter(order=>order.status==='IN_PROGRESS').length+orders.filter(order=>order.status==='CREATED').length)/orders.length*100 : 0}%, #db7f8e 0 100%)` }}><span><strong>{orders.length}</strong><small>Orders</small></span></div><ul><li><i className="status-dot status-dot-published"/>Published <b>{orders.filter(order=>order.status==='READY').length}</b></li><li><i className="status-dot status-dot-progress"/>In progress <b>{orders.filter(order=>order.status==='IN_PROGRESS').length}</b></li><li><i className="status-dot status-dot-new"/>New <b>{orders.filter(order=>order.status==='CREATED').length}</b></li><li><i className="status-dot status-dot-changes"/>Needs changes <b>{orders.filter(order=>order.status==='REJECTED').length}</b></li></ul></div></aside></div><section className="client-popular-templates"><div className="section-heading"><h2>Popular templates</h2><button className="text-action" onClick={()=>setTab('Templates')}>View all templates →</button></div><div className="client-popular-grid">{allTemplates.slice(0,7).map(template=><button type="button" className="client-popular-template" key={template.id} onClick={()=>chooseTemplate(template.id)}><img src={template.thumbnail_url} alt=""/><strong>{template.name}</strong><small>{template.category}</small></button>)}</div></section></div>}
      {tab === 'Templates' && <>{chosen ? <div className="order-create"><div className="order-template-rail"><button className="back-action" onClick={() => setSelected(null)}>← All templates</button>{templates.map(template => <button key={template.id} className={`rail-template ${selected === template.id ? 'selected' : ''}`} onClick={() => chooseTemplate(template.id)}><img src={template.thumbnail_url} alt=""/><span>{template.name}<small>{template.category}</small></span></button>)}</div><form className="order-form" onSubmit={submitOrder}><div className="form-heading"><span className="workspace-kicker">NEW INVITATION ORDER</span><h2>{chosen.name}</h2></div><fieldset style={{display:review?'none':undefined}}><legend>01 · The couple</legend><div className="form-grid"><Field label="Groom’s name" required value={details.groom} onChange={v => setField('groom',v)}/><Field label="Bride’s name" required value={details.bride} onChange={v => setField('bride',v)}/><Field label="Groom’s family" value={details.groomFamily} onChange={v => setField('groomFamily',v)}/><Field label="Bride’s family" value={details.brideFamily} onChange={v => setField('brideFamily',v)}/><Field label="Phone number" type="tel" required value={phoneNumber} onChange={setPhoneNumber}/></div></fieldset><fieldset style={{display:review?'none':undefined}}><legend>02 · Wedding details</legend><div className="form-grid"><Field label="Wedding celebration name" required value={weddingEventTitle} onChange={setWeddingEventTitle}/><Field label="Wedding date" type="date" required value={details.date} onChange={v => setField('date',v)}/><Field label="Ceremony time" type="time" required value={details.time} onChange={v => setField('time',v)}/><Field label="Venue" required value={details.venue} onChange={v => setField('venue',v)}/><Field label="Address" required value={details.address} onChange={v => setField('address',v)}/><Field label="Map link" type="url" value={details.map} onChange={v => setField('map',v)}/></div></fieldset><fieldset style={{display:review?'none':undefined}}><legend>03 · Celebrations</legend><p className="form-note">The wedding celebration is included from the details above.</p>{extraEvents.map((item,index)=><div className="celebration-editor" key={index}><div className="section-heading"><h3>Additional celebration {index+1}</h3><button type="button" className="text-action" onClick={()=>setExtraEvents(events=>events.filter((_,i)=>i!==index))}>Remove</button></div><div className="form-grid"><Field label="Event name" required value={item.title} onChange={v=>setExtraEvents(events=>events.map((event,i)=>i===index?{...event,title:v}:event))}/><Field label="Date" type="date" required value={item.date} onChange={v=>setExtraEvents(events=>events.map((event,i)=>i===index?{...event,date:v}:event))}/><Field label="Time" type="time" required value={item.time} onChange={v=>setExtraEvents(events=>events.map((event,i)=>i===index?{...event,time:v}:event))}/><Field label="Venue" required value={item.venue} onChange={v=>setExtraEvents(events=>events.map((event,i)=>i===index?{...event,venue:v}:event))}/><Field label="Address" required value={item.address} onChange={v=>setExtraEvents(events=>events.map((event,i)=>i===index?{...event,address:v}:event))}/><Field label="Map link" type="url" value={item.map} onChange={v=>setExtraEvents(events=>events.map((event,i)=>i===index?{...event,map:v}:event))}/></div></div>)}<button type="button" className="secondary-action" disabled={extraEvents.length>=9} onClick={()=>setExtraEvents(events=>[...events,{title:'',date:details.date,time:'17:00',venue:'',address:'',map:''}])}>+ Add celebration</button></fieldset><fieldset style={{display:review?'none':undefined}}><legend>04 · Personal touches</legend><div className="form-grid"><Field label="Dress code" value={details.dressCode} onChange={v => setField('dressCode',v)}/></div><label>Welcome message<textarea rows={4} value={details.message} onChange={e => setField('message',e.target.value)}/></label><label>Short note<textarea rows={2} value={details.giftNote} onChange={e => setField('giftNote',e.target.value)}/></label></fieldset>{review&&<InvitationReview sellingPrice={templateSellingPrice(templateSettings[chosen.id])} details={details} phone={phoneNumber} title={weddingEventTitle} events={extraEvents} template={chosen.name}/>}<p className="form-note">Your order will be submitted for review before an invitation is created or published.</p><button type="submit" className="primary-action" disabled={busy}>{busy ? 'Submitting order…' : review ? <><ReviewActionIcon/>Create invitation</> : 'Review order →'}</button></form></div> : <><section className="client-collection-intro"><div><span className="workspace-kicker">THE ART OF A BEAUTIFUL BEGINNING</span><h2>Choose a design that tells their story.</h2><p>Preview the collection and prepare a personal invitation order for your couple.</p></div><div className="client-collection-art" aria-hidden="true"><span>Shaadi Invites</span><i>✧</i></div></section><div className="client-collection-heading"><div><span className="workspace-kicker">THE COLLECTION</span><h2>Invitation designs <small>{templates.length} curated styles</small></h2></div><span className="client-collection-note">Select a design to begin an order <b>↓</b></span></div><div className="template-grid">{templates.map((template,index)=><article className="template-tile" key={template.id}><a className="template-image" href={template.preview_url} target="_blank" rel="noreferrer">{TEMPLATE_INTRO_VIDEOS[template.id]?<video src={TEMPLATE_INTRO_VIDEOS[template.id]} poster={TEMPLATE_THUMBNAIL_OVERRIDES[template.id]??template.thumbnail_url} autoPlay muted loop playsInline ref={el=>{if(el){el.muted=true;el.setAttribute('muted','');el.play().catch(()=>{})}}}/>:<img src={TEMPLATE_INTRO_IMAGES[template.id]??template.thumbnail_url} alt={`${template.name} preview`} loading="lazy"/>}<span>PREVIEW ↗</span></a><div><small>{String(index+1).padStart(2,'0')} · {template.category}</small><h2>{template.name}</h2><button className="text-action" onClick={() => chooseTemplate(template.id)}>Choose this design <b>→</b></button></div></article>)}</div></>}</>}
      {tab === 'Orders' && <><p className="workspace-lede orders-description">View and manage all invitation orders submitted by your customers.</p><div className="orders-filters"><label className="orders-search"><span aria-hidden="true">⌕</span><input value={orderSearch} onChange={e => {setOrderSearch(e.target.value);setOrdersPage(0)}} placeholder="Search by order ID, couple name, or phone number…" aria-label="Search orders"/></label><div className="orders-date-filter"><span aria-hidden="true">▦</span><input type="date" value={orderDateFrom} onChange={e=>{setOrderDateFrom(e.target.value);setOrdersPage(0)}} aria-label="Submitted from"/><span className="orders-date-separator">to</span><input type="date" value={orderDateTo} onChange={e=>{setOrderDateTo(e.target.value);setOrdersPage(0)}} aria-label="Submitted to"/></div></div><OrderTable orders={filtered.slice(ordersPage*20,ordersPage*20+20)} onSelect={setViewOrder} onCreate={orders.length===0?()=>{setTab('Templates');setSelected(chosen?.id||allTemplates[0]?.id||null)}:undefined}/>{filtered.length>20&&<div className="pagination"><button disabled={ordersPage===0} onClick={()=>setOrdersPage(p=>p-1)}>← Previous</button><span>Page {ordersPage+1} of {Math.max(1,Math.ceil(filtered.length/20))}</span><button disabled={(ordersPage+1)*20>=filtered.length} onClick={()=>setOrdersPage(p=>p+1)}>Next →</button></div>}</>}
      {tab === 'Settings' && <TemplateSettingsPanel companyName={company?.company_name || 'your company'} templates={allTemplates} settings={templateSettings} error={error} canSave={Boolean(company)} onChange={editTemplateSetting} onSaveAll={saveAllTemplateSettings}/>}
    </section>
    {tab === 'Templates' && <aside className="client-preview-panel"><div className="client-preview-heading"><div><span className="workspace-kicker">LIVE PREVIEW</span><h2>{previewTemplate?.name || 'Invitation preview'}</h2></div><span className="preview-live-dot" aria-label="Live preview"/></div>{previewTemplate ? <><div className="client-device-frame"><div className="client-device-screen" ref={previewScreen}><iframe key={`${previewTemplate.id}-${showDetails}`} title={`${previewTemplate.name} mobile invitation preview`} src={previewSrc} allow="autoplay; fullscreen" allowFullScreen style={{ transform: `scale(${previewScale})` }} onLoad={() => { const screen = previewScreen.current; if (screen) setPreviewScale(Math.min(screen.clientWidth / 402, screen.clientHeight / 874)) }}/></div></div><div className="client-preview-thumbs" aria-label="Choose a design to preview">{templates.map(template=><button type="button" key={template.id} className={previewTemplate.id === template.id ? 'active' : ''} onClick={()=>setPreviewId(template.id)} aria-label={`Preview ${template.name}`}><img src={template.thumbnail_url} alt=""/></button>)}</div><a className="client-preview-open" href={previewTemplate.preview_url} target="_blank" rel="noreferrer">Preview Full Invitation <span>↗</span></a><button type="button" className="client-preview-choose" onClick={()=>chooseTemplate(previewTemplate.id)}>Get this design <span>→</span></button></> : <p className="form-note">Your invitation previews will appear here.</p>}</aside>}
    {tab === 'Templates' && showDetails && chosen && !loading && <Suspense fallback={null}><OrderTextEditor key={chosen.id} template={chosen.id} value={details.textOverrides} onChange={textOverrides => setDetails(previous => ({ ...previous, textOverrides }))} draftStatus={draftStatus}/></Suspense>}
    {(pdfResult !== null || pdfError) && <div className="ai-extract-overlay" role="presentation" onMouseDown={e=>{if(e.target===e.currentTarget){setPdfResult(null);setPdfError('')}}}><section className="ai-extract-dialog" role="dialog" aria-modal="true"><header><span className="ai-extract-badge">AI</span><h2>Extracted Details</h2><button className="dialog-close" onClick={()=>{setPdfResult(null);setPdfError('')}} aria-label="Close">×</button></header>{pdfError?<p className="workspace-alert">{pdfError}</p>:<><div className="ai-extract-fields">{([
      ['Groom', pdfResult?.groom],
      ['Bride', pdfResult?.bride],
      ['Groom\'s family', pdfResult?.groomFamily],
      ['Bride\'s family', pdfResult?.brideFamily],
      ['Date', pdfResult?.date],
      ['Time', pdfResult?.time],
      ['Venue', pdfResult?.venue],
      ['Address', pdfResult?.address],
      ['Message', pdfResult?.message],
      ['Dress code', pdfResult?.dressCode],
    ] as [string, string | undefined][]).filter(([,v]) => v?.trim()).map(([label, value]) => <div key={label} className="ai-field"><span className="ai-field-label">{label}</span><span className="ai-field-value">{value}</span></div>)}
      {pdfResult?.events && pdfResult.events.length > 0 && <><div className="ai-field-divider">Additional Events</div>{pdfResult.events.map((ev, i) => <div key={i} className="ai-event-card">{([['Event', ev.title], ['Date', ev.date], ['Time', ev.time], ['Venue', ev.venue], ['Address', ev.address]] as [string, string | undefined][]).filter(([,v]) => v?.trim()).map(([l, v]) => <div key={l} className="ai-field"><span className="ai-field-label">{l}</span><span className="ai-field-value">{v}</span></div>)}</div>)}</>}
    </div><footer className="ai-extract-footer"><button type="button" className="ai-fill-form-btn" onClick={()=>{if(!pdfResult)return;setDetails(prev=>({...prev,groom:pdfResult.groom||'',bride:pdfResult.bride||'',groomFamily:pdfResult.groomFamily||'',brideFamily:pdfResult.brideFamily||'',date:pdfResult.date||'',time:pdfResult.time||'',venue:pdfResult.venue||'',address:pdfResult.address||'',map:'',message:pdfResult.message||'',dressCode:pdfResult.dressCode||'',giftNote:'',music:'',gallery:'',events:[]}));setWeddingEventTitle('Wedding');setPhoneNumber('');setExtraEvents(pdfResult.events?.length?pdfResult.events.map(ev=>({title:ev.title||'',date:ev.date||'',time:ev.time||'',venue:ev.venue||'',address:ev.address||'',map:''})):[]);setPdfResult(null);setPdfError('')}}><span className="ai-extract-badge">AI</span> Fill form with these details</button></footer></>}</section></div>}
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
    ? Math.floor(setting.price * (1 - setting.sale_value / 100))
    : setting.sale_type === 'fixed' ? setting.price - setting.sale_value : setting.price
  if (setting.sale_type === 'none' || setting.sale_value === 0) return <span className="client-template-price"><strong>{formatPrice(setting.price)}</strong></span>
  return <span className="client-template-price client-template-price-sale"><small className="client-template-sale-badge">{setting.sale_type === 'percentage' ? `${setting.sale_value}% OFF` : `${formatPrice(setting.sale_value)} OFF`}</small><span className="client-template-price-row"><strong>{formatPrice(currentPrice)}</strong><i aria-hidden="true"/><del>{formatPrice(setting.price)}</del></span></span>
}
function TemplateSettingsPanel({companyName,templates,settings,error,canSave,onChange,onSaveAll}:{companyName:string;templates:Template[];settings:Record<number,TemplateSettings>;error:string;canSave:boolean;onChange:(id:number,patch:Partial<TemplateSettings>)=>void;onSaveAll:()=>Promise<void>}) {
  const [saved,setSaved]=useState(false)
  const [saving,setSaving]=useState(false)
  function handleChange(id:number,patch:Partial<TemplateSettings>){setSaved(false);onChange(id,patch)}
  async function handleSaveAll(){setSaving(true);await onSaveAll();setSaving(false);setSaved(true)}
  return <><div className="client-settings-intro"><div><span className="workspace-kicker">YOUR TEMPLATE CATALOG</span><h2>Configure your designs</h2><p>Set your price, optional discount, and premium status for each template. These settings belong to {companyName}.</p></div><button type="button" className={`primary-action client-settings-save${saved?' is-saved':''}`} disabled={!canSave||saving} onClick={handleSaveAll}>{saving?'Saving…':saved?'Saved ✓':'Save changes'}</button></div>{error&&<p className="workspace-alert" role="alert">{error}</p>}<div className="client-template-settings">{templates.map(template=>{const setting=settings[template.id]||{price:0,sale_type:'none' as const,sale_value:0,is_premium:false};return <article className="client-template-setting" key={template.id}><div className="client-template-setting-art"><img src={template.thumbnail_url} alt={`${template.name} invitation cover`}/><TemplatePrice setting={setting}/></div><div className="client-template-setting-content"><h3 style={{fontSize:template.name.length>20?'12px':template.name.length>14?'14px':'17px'}}>{template.name}</h3><div className="client-template-setting-fields"><label>Price (INR)<span className="client-settings-input-wrap"><i aria-hidden="true">₹</i><input type="number" min="0" step="1" value={setting.price||''} onChange={event=>handleChange(template.id,{price:event.target.value===''?0:Number(event.target.value)})}/></span></label><label>Sale type<select value={setting.sale_type} onChange={event=>handleChange(template.id,{sale_type:event.target.value as TemplateSettings['sale_type'],sale_value:event.target.value==='none'?0:setting.sale_value})}><option value="none">No sale</option><option value="percentage">Percentage discount</option><option value="fixed">Fixed discount</option></select></label>{setting.sale_type!=='none'&&<label className="client-discount-setting">{setting.sale_type==='percentage'?'Discount percentage':'Discount amount (INR)'}<span className="client-settings-input-wrap">{setting.sale_type==='fixed'&&<i aria-hidden="true">₹</i>}<input type="number" min="0" max={setting.sale_type==='percentage'?100:setting.price} step={setting.sale_type==='percentage'?'0.1':'1'} value={setting.sale_value||''} onChange={event=>handleChange(template.id,{sale_value:event.target.value===''?0:Number(event.target.value)})}/>{setting.sale_type==='percentage'&&<i aria-hidden="true">%</i>}</span></label>}</div><label className="client-premium-setting"><input type="checkbox" checked={setting.is_premium} onChange={event=>handleChange(template.id,{is_premium:event.target.checked})}/><span className="client-premium-switch" aria-hidden="true"/><span className="client-premium-copy"><b>Premium template <i aria-hidden="true">♛</i></b></span></label></div></article>})}</div></>
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
