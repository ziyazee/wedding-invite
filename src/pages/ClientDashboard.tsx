import { createContext, useContext, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, lazy, Suspense } from 'react'
import type { FormEvent, ReactElement } from 'react'
import { createPortal } from 'react-dom'
import { cardTextLimit, nameTextLimit, designs, TEMPLATE_DISPLAY_ORDER, slugVariants, inviteUrl, withCurrentInviteUrl, companyPreviewUrl, validateDetails } from '../invitations/model'
import type { Celebration, InvitationData } from '../invitations/model'
import type { TextLayout } from '../invitations/textLayout'
import { readTextLayout } from '../invitations/textLayout'
import { invitationExample } from '../invitations/templateData'
import InvitationPreviewFrame from '../invitations/InvitationPreviewFrame'
import { loadTemplateCatalog } from '../invitations/templateCatalog'
import type { InvitationTemplate } from '../invitations/templateCatalog'
import { TEMPLATE_INTRO_VIDEOS, TEMPLATE_INTRO_IMAGES, TEMPLATE_THUMBNAIL_OVERRIDES } from '../lib/templateCardData'
import { isSupabaseConfigured, supabase } from '../lib/supabase'
import { companyAssetURL } from '../lib/companyAssets'
import { companyPreviewError } from '../lib/companyPreview'
import { invitationUploadAccept, invitationUploadMimeType } from '../lib/invitationUpload'
import { DashboardAccess, signOutToLogin } from './DashboardAccess'
import './Workspaces.css'
import './ClientDashboard.css'
import { ReviewActionIcon } from './InvitationReview'
import EventLocationPicker from './EventLocationPicker'
import OrderPreviewStep from './OrderPreviewStep'
import OrderProgressBar from './OrderProgressBar'

const OrderTextEditor = lazy(() => import('./OrderTextEditor'))

type Order = { id: number; groom_name: string; bride_name: string; status: string; created_at: string; form_data: InvitationData; published_path: string | null; published_url: string | null; management_id: string; published_at: string | null; expires_at: string | null; rejection_reason: string | null; template_code: string; phone_number: string; price?: number | null }
type Template = InvitationTemplate
type TemplateSettings = { price: number; sale_type: 'none' | 'percentage' | 'fixed'; sale_value: number; is_premium: boolean }
const initial: InvitationData = { template: 1, groom: 'Groom', bride: 'Bride', date: '2026-12-20', time: '11:00', offset: '+05:30', venue: 'Royal Convention Centre', address: 'Downtown', map: '', message: 'With the love and blessings of our families, we invite you to celebrate the beginning of our forever.', groomFamily: '', brideFamily: '', dressCode: '', giftNote: '', music: '', gallery: '', events: [] }
const CardTemplateContext = createContext({template:0,showCoupleIllustrations:true,pdfBrideFirst:false,onIllustrationsChange:(_show:boolean)=>{}})
const initialWeddingEvent = 'Nikah & Wedding'
const defaultPhoneNumber = '7975948093'
const initialExtraEvents: Celebration[] = [
  { title: 'Mehendi Programme', date: '2026-12-17', time: '11:00', venue: 'Silvergate Homestay', address: 'Chikmagaluru', map: 'https://maps.app.goo.gl/uaSHaAyVXCriCCrw5' },
  { title: 'Mehendi Mehfil', date: '2026-12-19', time: '17:00', venue: 'Royal Garden Beach Resort', address: 'Ullal, Mangalore', map: 'https://maps.app.goo.gl/43ui6W3Hn6N2cbui8' },
  { title: 'Wedding Reception', date: '2026-12-21', time: '19:00', venue: 'Shoolin Palace', address: 'Airport Road, Mangalore', map: 'https://maps.app.goo.gl/ARcdN5shsLC5og2f8' },
  { title: "Bride's Reception — Chikmagaluru", date: '2026-12-24', time: '11:00', venue: 'Heritage Convention Hall', address: 'Chikmagaluru', map: 'https://maps.app.goo.gl/NbvAqoYtcacD5Xas6' },
]
const statusTitle: Record<string, string> = { CREATED: 'New', IN_PROGRESS: 'In progress', READY: 'Published', REJECTED: 'Needs changes' }
const CATEGORY_ORDER = ['Classic', 'Royal Hindu', 'Hindu', 'Muslim', 'Christian', 'Garden', 'Indian']
const CEL_PALETTE = [
  { headerBg: '#E9F0E4', border: '#C5D5BC', icon: '#526D45' },
  { headerBg: '#F8E9E6', border: '#EBC5BE', icon: '#A65F57' },
  { headerBg: '#EEEAF4', border: '#D6CBE6', icon: '#77658E' },
  { headerBg: '#F5EFE4', border: '#E4D6BF', icon: '#94794D' },
  { headerBg: '#E8EFF4', border: '#C8D8E4', icon: '#54758B' },
  { headerBg: '#F8EDE3', border: '#EBD5C2', icon: '#A97856' },
  { headerBg: '#E6F1ED', border: '#C6DED3', icon: '#527D6B' },
]

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
  const previewFrame = useRef<HTMLIFrameElement>(null)
  const [tab, setTab] = useState<'Overview' | 'Templates' | 'Orders' | 'Settings'>('Overview')
  const [orders, setOrders] = useState<Order[]>([])
  const [viewOrder, setViewOrder] = useState<Order | null>(null)
  const [allTemplates, setAllTemplates] = useState<Template[]>([])
  const [company, setCompany] = useState<{ id: number; company_name: string; contact_name: string | null; slug: string | null; phone: string | null; branding_base_url: string | null; catalog_restricted: boolean; is_test_account?: boolean } | null>(null)
  const [templateSettings, setTemplateSettings] = useState<Record<number, TemplateSettings>>({})
  const [companyLogo, setCompanyLogo] = useState('/logo.png')
  const [details, setDetails] = useState(initial)
  const [phoneNumber, setPhoneNumber] = useState(defaultPhoneNumber)
  const [weddingEventTitle, setWeddingEventTitle] = useState(initialWeddingEvent)
  const [extraEvents, setExtraEvents] = useState<Celebration[]>(initialExtraEvents)
  const [pendingLocationCount, setPendingLocationCount] = useState(0)
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
  const [showOrderPreview, setShowOrderPreview] = useState(false)
  const [editingOrderId, setEditingOrderId] = useState<number | null>(null)
  const [copyingOrderId, setCopyingOrderId] = useState<number | null>(null)
  const [notice, setNotice] = useState('')
  const [error, setError] = useState('')
  const [waPhone, setWaPhone] = useState('')
  const [waSending, setWaSending] = useState(false)
  const [waSent, setWaSent] = useState(false)
  const [waError, setWaError] = useState('')
  useEffect(() => {
    if (!viewOrder) return
    setWaPhone(viewOrder.phone_number || '')
    setWaSent(false)
    setWaError('')
  }, [viewOrder?.id])
  const pdfInputRef = useRef<HTMLInputElement>(null)
  const [pdfExtracting, setPdfExtracting] = useState(false)
  type PdfExtracted = { brideFirst?: boolean; groom?: string; groomFullName?: string; bride?: string; brideFullName?: string; groomFamily?: string; groomFamilyFull?: string; brideFamily?: string; brideFamilyFull?: string; date?: string; time?: string; venue?: string; address?: string; message?: string; messageFull?: string; dressCode?: string; events?: { title?: string; date?: string; time?: string; venue?: string; address?: string }[] }
  const [pdfResult, setPdfResult] = useState<PdfExtracted | null>(null)
  const [pdfError, setPdfError] = useState('')
  const [pdfUseFull, setPdfUseFull] = useState<Set<string>>(new Set())
  const [pdfPrefilled, setPdfPrefilled] = useState(false)
  const [pdfBrideFirst, setPdfBrideFirst] = useState(false)
  const [templateDefaults, setTemplateDefaults] = useState<Record<number, Record<string, unknown>>>({})
  const [editingDemo, setEditingDemo] = useState<number | null>(null)
  const [demoSaving, setDemoSaving] = useState(false)

  const refresh = useCallback(async () => {
    if (!supabase || !isSupabaseConfigured) { setError('Connect Supabase to load your company dashboard.'); setLoading(false); return }
    const { data, error: authError } = await supabase.auth.getUser()
    if (authError || !data.user) { setLoading(false); return }
    const [templatesResult, companyResult] = await Promise.all([
      loadTemplateCatalog(!showHiddenTemplates).then(data => ({ data, error: null as { message: string } | null })).catch(error => ({ data: [] as Template[], error: { message: error instanceof Error ? error.message : 'Could not load templates.' } })),
      // Select existing columns so normal accounts also work before the test-account migration.
      supabase.from('companies').select('*').ilike('email', data.user.email || '').maybeSingle(),
    ])
    if (templatesResult.error) setError(templatesResult.error.message)
    const companyData = companyResult.data
    if (companyResult.error || !companyData) {
      setError(companyResult.error?.message || 'Your account is not linked to a company yet.')
      setCompany(null); setOrders([]); setLoading(false); return
    }
    const ordersResult = await supabase.from(companyData.is_test_account ? 'test_order' : 'orders').select('*').eq('company_id', companyData.id).order('created_at', { ascending: false })
    if (ordersResult.error) setError(ordersResult.error.message)
    let activeTemplates = templatesResult.data
    if (companyData?.catalog_restricted) {
      const { data: access, error: accessError } = await supabase.from('company_template_access').select('template_id').eq('company_id', companyData.id)
      if (accessError) { setError(accessError.message); activeTemplates = [] }
      else { const allowed = new Set((access || []).map(item => item.template_id)); activeTemplates = activeTemplates.filter(template => allowed.has(template.id)) }
    }
    setAllTemplates(activeTemplates)
    if(!draftRestored.current&&!templatesResult.error){
      const key=`shaadi-client-draft-v1:${data.user.id}${companyData.is_test_account ? ':test' : ''}`
      try{
        const saved=localStorage.getItem(key)
        const draft=saved?JSON.parse(saved):null
        if(draft&&typeof draft==='object'){
          if(['Overview','Templates','Orders','Settings'].includes(draft.tab))setTab(draft.tab)
          const validSelection=activeTemplates.some(template=>template.id===draft.selected)
          if(validSelection){
            setSelected(draft.selected)
            setShowDetails(draft.showDetails===true)
            setReview(draft.review===true||draft.showOrderPreview===true)
            setShowOrderPreview(draft.showOrderPreview===true)
            if(Number.isInteger(draft.formStep)&&draft.formStep>=0)setFormStep(draft.formStep)
          }
          if(activeTemplates.some(template=>template.id===draft.previewId))setPreviewId(draft.previewId)
          if(draft.details&&typeof draft.details==='object'&&Object.keys(initial).filter(field=>field!=='events'&&field!=='template').every(field=>typeof draft.details[field]==='string')){
            setDetails({...initial,...draft.details,events:typeof draft.copyingOrderId==='number'&&Array.isArray(draft.details.events)?draft.details.events:[]})
          }
          if(typeof draft.phoneNumber==='string')setPhoneNumber(draft.phoneNumber)
          if(typeof draft.weddingEventTitle==='string')setWeddingEventTitle(draft.weddingEventTitle)
          if(Array.isArray(draft.extraEvents)&&draft.extraEvents.length<=9&&draft.extraEvents.every((item:Celebration)=>item&&['title','date','time','venue','address','map'].every(field=>typeof item[field as keyof Celebration]==='string')))setExtraEvents(draft.extraEvents)
          if(typeof draft.editingOrderId==='number')setEditingOrderId(draft.editingOrderId)
          if(typeof draft.copyingOrderId==='number'&&typeof draft.editingOrderId!=='number')setCopyingOrderId(draft.copyingOrderId)
        }
      }catch{ /* Start with the defaults if browser storage is unavailable or invalid. */ }
      draftRestored.current=true
      setDraftKey(key)
    }
    const firstTemplate = activeTemplates[0]
    if (firstTemplate) { setSelected(current => current ?? firstTemplate.id); setPreviewId(current => current ?? firstTemplate.id) }
    setOrders(((ordersResult.data || []) as Order[]).map(withCurrentInviteUrl))
    if (data.user.email) {
      setCompany(companyData)
      if (companyData?.id) {
        const [{ data: settingsData, error: settingsError }, { data: defaultsData, error: defaultsError }] = await Promise.all([
          supabase.from('company_template_settings').select('template_id,price,sale_type,sale_value,is_premium').eq('company_id', companyData.id),
          supabase.from('company_template_defaults').select('template_id,demo_data').eq('company_id', companyData.id),
        ])
        if (settingsError) setError(settingsError.message)
        else setTemplateSettings(Object.fromEntries((settingsData || []).map(setting => [setting.template_id, { price: Number(setting.price), sale_type: setting.sale_type, sale_value: Number(setting.sale_value), is_premium: setting.is_premium }])) as Record<number, TemplateSettings>)
        if (defaultsError) setError(defaultsError.message)
        else setTemplateDefaults(Object.fromEntries((defaultsData || []).map(row => [row.template_id, row.demo_data as Record<string, unknown>])))
      } else { setTemplateSettings({}); setTemplateDefaults({}) }
      setCompanyLogo(companyAssetURL(companyData, 'logo') || '/logo.png')
    }
    setLoading(false)
  }, [showHiddenTemplates])

  useEffect(() => { void refresh() }, [refresh])
  useEffect(()=>{
    if(!draftKey)return
    try{
      localStorage.setItem(draftKey,JSON.stringify({tab,details,phoneNumber,weddingEventTitle,extraEvents,selected,previewId,showDetails,formStep,review,showOrderPreview,editingOrderId,copyingOrderId}))
      setDraftStatus('Draft saved on this device · included when you create the invitation.')
    }catch{ setDraftStatus('Browser storage unavailable · keep this page open until you create the invitation.') }
  },[draftKey,tab,details,phoneNumber,weddingEventTitle,extraEvents,selected,previewId,showDetails,formStep,review,showOrderPreview,editingOrderId,copyingOrderId])
  useEffect(() => {
    if (showDetails) requestAnimationFrame(() => { window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior }) })
  }, [formStep, showOrderPreview, review, showDetails])

  useEffect(() => {
    if (tab !== 'Templates' || !showDetails || showOrderPreview) { setFormStepCount(0); setWorkflowHost(null); return }
    const form = document.querySelector<HTMLFormElement>('.order-form')
    if (!form) { setFormStepCount(0); setWorkflowHost(null); return }
    form.noValidate = true
    setWorkflowHost(form)
    const sections = Array.from(form.querySelectorAll<HTMLFieldSetElement>(':scope > fieldset'))
    setFormStepCount(sections.length)
    const step = Math.min(formStep, Math.max(0, sections.length - 1))
    const showAll = review || !!editingOrderId
    sections.forEach((section, index) => { section.style.display = showAll ? 'block' : index === step ? 'block' : 'none' })
  }, [formStep, review, selected, showDetails, tab, loading, editingOrderId, showOrderPreview])
  useEffect(() => {
    if (!supabase) return
    let channel: ReturnType<NonNullable<typeof supabase>['channel']> | undefined
    let active = true
    void (async () => {
      const { data: { user } } = await supabase!.auth.getUser()
      if (!user || !active) return
      if (!user.email || !active) return
      const { data: company } = await supabase!.from('companies').select('*').ilike('email', user.email).maybeSingle()
      const companyId = Number(company?.id)
      if (!Number.isSafeInteger(companyId) || companyId <= 0 || !active) return
      channel = supabase!.channel(`client-orders-${companyId}`).on('postgres_changes', { event: '*', schema: 'public', table: company?.is_test_account ? 'test_order' : 'orders', filter: `company_id=eq.${companyId}` }, () => { void refresh() }).subscribe()
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
  const templates = allTemplates.filter(template => (categoryFilter === 'ALL' || template.category === categoryFilter) && `${template.name} ${template.category}`.toLowerCase().includes(templateSearch.trim().toLowerCase())).sort((a,b)=>templateSort==='NAME'?a.name.localeCompare(b.name):(TEMPLATE_DISPLAY_ORDER[a.id]??999)-(TEMPLATE_DISPLAY_ORDER[b.id]??999))
  const chosen = allTemplates.find(template => template.id === selected)
  const previewTemplate = allTemplates.find(template => template.id === previewId) || chosen || allTemplates[0]
  const companyBranding = useMemo(() => ({
    companyLogo: companyAssetURL(company, 'logo'),
    ...(company?.company_name ? { companyName: company.company_name } : {}),
    ...(company?.phone ? { companyPhone: company.phone } : {}),
  }), [company])
  const livePreviewDetails = useMemo<InvitationData>(() => {
    return {
      ...details,
      ...companyBranding,
      template: selected ?? previewTemplate?.id ?? details.template,
      events: [{ ...(copyingOrderId !== null ? details.events?.[0] : undefined), title: weddingEventTitle, date: details.date, time: details.time, venue: details.venue, address: details.address, map: details.map }, ...extraEvents],
    }
  }, [details, companyBranding, extraEvents, previewTemplate?.id, selected, weddingEventTitle, copyingOrderId])
  const hasUserDetails = details.groom !== initial.groom || details.bride !== initial.bride || details.date !== initial.date
  const browsePreviewData = useMemo(() => {
    if (showDetails || !previewTemplate) return undefined
    if (hasUserDetails) return { ...livePreviewDetails, template: previewTemplate.id }
    const example = invitationExample(previewTemplate.id)
    if (!example) return undefined
    return { ...example, ...templateDefaults[previewTemplate.id], ...companyBranding, template: previewTemplate.id }
  }, [showDetails, previewTemplate, hasUserDetails, livePreviewDetails, templateDefaults, companyBranding])
  const previewSrc = showDetails ? '/client/live-preview?editor=1' : browsePreviewData ? '/client/live-preview?browse=1' : previewTemplate?.preview_url || '/client/live-preview'
  useLayoutEffect(() => {
    if (tab !== 'Templates') return
    const data = showDetails ? livePreviewDetails : browsePreviewData
    if (!data) return
    const syncPreview = () => previewFrame.current?.contentWindow?.postMessage({ type: 'shaadi-preview-update', data }, window.location.origin)
    const onPreviewReady = (event: MessageEvent) => {
      if (event.origin === window.location.origin && event.source === previewFrame.current?.contentWindow && event.data?.type === 'shaadi-preview-ready') syncPreview()
    }
    window.addEventListener('message', onPreviewReady)
    try { sessionStorage.setItem('shaadi-client-live-preview', JSON.stringify(data)) } catch { /* The ready handshake also supplies the preview data. */ }
    syncPreview()
    return () => window.removeEventListener('message', onPreviewReady)
  }, [livePreviewDetails, browsePreviewData, showDetails, tab])
  useEffect(() => {
    setWaPhone('')
    setWaSent(false)
    setWaError('')
  }, [viewOrder?.id])
  function setField(key: keyof InvitationData, value: string | number | undefined) {
    const changedSong = key === 'music' && value !== details.music
    setDetails(previous => ({ ...previous, [key]: value, ...(changedSong ? { musicStart: 0, musicEnd: undefined } : {}) }))
    if (key === 'music' && typeof value === 'string') {
      // Same-origin, synchronous dispatch retains the song click's user gesture.
      previewFrame.current?.contentDocument?.dispatchEvent(new CustomEvent('shaadi-preview-song', { detail: { music: value, musicStart: changedSong ? 0 : (details.musicStart ?? 0), musicEnd: changedSong ? undefined : details.musicEnd } }))
    }
  }
  const updatePendingLocationCount = useCallback((pending: boolean) => {
    setPendingLocationCount(count => Math.max(0, count + (pending ? 1 : -1)))
  }, [])
  function setCoupleOrder(brideFirst: boolean) {
    setPdfBrideFirst(brideFirst)
    setDetails(previous => ({ ...previous, brideFirst }))
  }
  function advanceFormStep() {
    if (pendingLocationCount > 0) {
      setError('Please wait for the map location to finish loading.')
      return
    }
    const form = document.querySelector<HTMLFormElement>('.order-form')
    const sections = form ? Array.from(form.querySelectorAll<HTMLFieldSetElement>(':scope > fieldset')) : []
    const currentSection = sections[formStep]
    const invalidField = currentSection ? Array.from(currentSection.querySelectorAll<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>(':invalid')).find(field => !(field instanceof HTMLInputElement && field.type === 'url' && field.value.startsWith('/'))) : undefined
    if (invalidField) {
      const fieldName = invalidField.labels?.[0]?.textContent?.trim() || invalidField.getAttribute('aria-label') || 'a required field'
      setError(`Please complete "${fieldName}" before continuing.`)
      invalidField.reportValidity()
      invalidField.focus()
      return
    }
    if (formStep < sections.length - 1) setFormStep(step => step + 1)
    else { setError(''); setShowOrderPreview(false); setReview(true) }
  }
  function selectCategory(category: string) {
    const currentIndex = categoryFilter === 'ALL' ? 0 : categories.indexOf(categoryFilter) + 1
    const nextIndex = category === 'ALL' ? 0 : categories.indexOf(category) + 1
    setCategoryDirection(nextIndex >= currentIndex ? 'right' : 'left')
    setCategoryFilter(category)
    setSelected(category === 'ALL' ? allTemplates[0]?.id || null : allTemplates.find(template => template.category === category)?.id || null)
  }
  async function chooseTemplate(id: number) {
    setShowOrderPreview(false)
    const base = invitationExample(id)
    const demo = templateDefaults[id]
    const example = base && demo ? { ...base, ...demo, template: id } : base
    setSelected(id)
    setPreviewId(id)
    let textOverrides: TextLayout | undefined
    try {
      const resp = await fetch(`/edits/${id}.json`)
      if (resp.ok) textOverrides = readTextLayout(await resp.json())
    } catch { /* no defaults for this template */ }
    if (pdfPrefilled || copyingOrderId !== null) {
      // Preserve copied/extracted details and celebrations when choosing a design.
      setDetails(previous => ({ ...previous, template: id, textOverrides: copyingOrderId !== null && previous.template === id ? previous.textOverrides : textOverrides }))
    } else if (example) {
      const demoEvents = (demo?.events as { title: string; date: string; time: string; venue: string; address: string }[] | undefined) || []
      const baseEvents = example.events || []
      const allEvents = demoEvents.length ? demoEvents.map(ev => ({ ...ev, map: '' })) : baseEvents
      const [wedding, ...celebrations] = allEvents
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
    setShowDetails(true); setTab('Templates'); setNotice(''); setError('')
    if (pdfPrefilled || copyingOrderId !== null) { setReview(true) } else { setFormStep(0); setReview(false) }
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
  async function previewOrder(order: Order) {
    if (busy) return
    if (!supabase || !company?.slug) { setError('Your company preview address is unavailable. Refresh the dashboard and try again.'); return }
    setBusy(true); setError('')
    let previewWindow: Window | null = null
    try {
      // Open while the click still has user activation; awaiting the RPC first
      // can cause browsers to block the new tab.
      previewWindow = window.open('about:blank', '_blank')
      if (!previewWindow) throw new Error('Allow pop-ups for this site, then click Preview invitation again.')
      previewWindow.opener = null
      previewWindow.document.title = 'Preparing invitation preview…'
      previewWindow.document.body.textContent = 'Preparing invitation preview…'
      const { error: previewError } = await supabase.rpc('set_company_preview', { p_form_data: order.form_data, p_template_code: order.template_code })
      if (previewError) throw previewError
      if (!previewWindow.closed) previewWindow.location.replace(companyPreviewUrl(company.slug))
    } catch (cause) {
      previewWindow?.close()
      setError(companyPreviewError(cause))
    } finally { setBusy(false) }
  }
  function startEditOrder(order: Order) {
    setCopyingOrderId(null)
    setShowOrderPreview(false)
    const fd = order.form_data
    setDetails(fd)
    setWeddingEventTitle(fd.events?.[0]?.title || initialWeddingEvent)
    setExtraEvents(fd.events?.slice(1) || [])
    setPhoneNumber((order.phone_number || '').replace(/^\+91\s*/, ''))
    setSelected(fd.template)
    setEditingOrderId(order.id)
    setShowDetails(true)
    setFormStep(0)
    setReview(false)
    setViewOrder(null)
    setTab('Templates')
    setError('')
    setNotice('')
  }
  function startCopyOrder(order: Order) {
    if (busy || pdfExtracting) return
    if (!allTemplates.some(template => template.id === order.form_data.template)) {
      setError('This order’s design is no longer available in your catalogue.')
      return
    }
    // Copy invitation content only; new-order submission creates fresh identity,
    // publishing/management links and status without touching the original row.
    const fd = structuredClone(order.form_data)
    setDetails({ ...initial, ...fd })
    setWeddingEventTitle(fd.events?.[0]?.title || initialWeddingEvent)
    setExtraEvents((fd.events?.slice(1) || []).map(event => ({ ...event, time: event.time ?? '', map: event.map ?? '' })))
    setPhoneNumber((order.phone_number || '').replace(/^\+91\s*/, ''))
    setSelected(fd.template)
    setPreviewId(fd.template)
    setEditingOrderId(null)
    setCopyingOrderId(order.id)
    setCategoryFilter('ALL')
    setTemplateSearch('')
    setShowOrderPreview(false)
    setShowDetails(true)
    setFormStep(0)
    setReview(true)
    setViewOrder(null)
    setPdfPrefilled(false)
    setPdfBrideFirst(fd.brideFirst === true)
    setPdfResult(null)
    setPdfError('')
    setTab('Templates')
    setError('')
    setNotice(`Copied order #${order.id}. Edit the details, then preview and create a new invitation.`)
  }
  async function publishClientOrder(order: Order) {
    if (!supabase) return
    setBusy(true); setError(''); setNotice('')
    const candidates = order.published_path ? [order.published_path] : slugVariants(order.groom_name, order.bride_name, order.form_data.brideFirst)
    try {
      const { data, error: publishError } = company?.is_test_account
        ? await supabase.rpc('publish_test_order', { p_order_id: order.id })
        : await supabase.rpc('publish_company_order_with_candidates', { p_order_id: order.id, p_candidate_paths: candidates })
      if (publishError) throw publishError
      const path = data?.published_path
      if (!path) throw new Error('Publishing did not return an invitation URL. Please refresh the order and try again.')
      const published = { ...order, status: 'READY', published_path: path, published_url: inviteUrl(path), published_at: data?.published_at || new Date().toISOString() }
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
    const phone = waPhone.trim() || viewOrder.phone_number?.trim() || ''
    if (!phone) return
    setWaSending(true); setWaError('')
    try {
      const { data, error: sendError } = await supabase.functions.invoke('send-whatsapp', {
        body: {
          phone,
          groomBride: `${viewOrder.groom_name} & ${viewOrder.bride_name}`,
          inviteUrl: viewOrder.published_url,
          managementUrl: `${window.location.origin}/${viewOrder.management_id}`,
          companyName: company?.company_name ?? 'Shaadi Invites',
        },
      })
      if (sendError) {
        const details = sendError.context instanceof Response
          ? await sendError.context.json().catch(() => null)
          : null
        throw new Error(details?.error || sendError.message)
      }
      if (!data?.success) throw new Error(data?.error || 'Failed to send WhatsApp message.')
      setWaSent(true)
    } catch (err) {
      setWaError(err instanceof Error ? err.message : 'Failed to send. Please try again.')
    } finally { setWaSending(false) }
  }
  const pdfExtractPrompt = `You are analyzing a wedding invitation PDF or image. Follow these steps carefully, then output JSON.

STEP 1 — Find the couple getting married:
Look for two names displayed prominently, connected by "weds", "with", "&", or similar. These are the BRIDE and GROOM. They are usually styled in large or decorative text.
WARNING: The names at the very top of the invitation (before phrases like "request the pleasure of your presence" or "cordially invite you") are the HOSTS — usually parents. Do NOT put hosts in the groom/bride fields. Hosts go in the family fields.

STEP 2 — Determine which host belongs to which side:
Look for clues: "their beloved daughter" means hosts are bride's parents. "their beloved son" means groom's parents. "S/o" (son of) links to groom. "D/o" (daughter of) links to bride. If no explicit clue, the host name that appears closest to the bride's name is likely bride's family.

STEP 3 — Pick calling names:
For each person in the couple, pick the one distinctive name people would use to call them — not a common prefix, not a surname. If unsure, use the last word of the given name (not surname).
IMPORTANT: If a name includes any professional or honorific title (Dr., Prof., Eng., Ar., CA., Adv., Er., Mr., Mrs., etc.), KEEP the title as part of the calling name with NO space after the dot (e.g. "Dr.Ayesha", not "Dr. Ayesha" or "Ayesha"). Format: Title.{{Name}} — no space between the dot and the name.

STEP 4 — Separate the MAIN WEDDING from other celebrations:
The main wedding/nikah details go into the top-level date, time, venue, address fields — NOT into the events array.
The events array is ONLY for additional celebrations (reception, mehendi, sangeet, walima, etc.).
Do NOT repeat the wedding in the events array.
Do NOT include meal descriptions (lunch, dinner, breakfast, buffet) as event titles — these are part of the wedding, not separate celebrations.
Do NOT include "groom side", "bride side", or similar qualifiers in event titles. Keep titles clean: just the ceremony name (e.g. "Reception", "Mehendi", "Sangeet").

STEP 5 — Preserve the couple's displayed order:
Set "brideFirst" to true only when the bride's name appears before the groom's name in the couple display (for example, "Bride weds Groom"). Otherwise set it to false. This controls the review field order; it does not change who is the bride or groom. Use the visual reading order of the names on the invitation.

STEP 6 — Curate a welcome message, not a text fragment:
A wedding welcome message warmly invites guests to share the couple's joy and explains why their presence, love, or blessings matter. Read the invitation as a whole before composing this message: decorative line breaks, host names, couple names, and ceremony details may split one invitation sentence across the page.
Use the invitation's actual welcome, invitation, or blessing text as the source of meaning. Reconstruct its intent into polished, natural, standalone sentences suitable for a wedding invitation. Preserve its level of formality, cultural or religious tone, and supported sentiments. Do not simply copy a disconnected line or truncate the source to meet a character limit.
Preservation takes priority over brevity in BOTH "message" and "messageFull": retain every informative detail contained in the welcome text, including meals, timing or sequence, attendance instructions, and other arrangements. For example, "Lunch will follow the ceremony" must remain in both versions; do not discard it or create a separate celebration for it. Keep religious invocations, references to God, prayers, blessings, and their meaning explicit. Do not replace them with a generic secular invitation. Preserve sacred quotations and religious opening formulas as written, fixing only obvious transcription or spacing errors.
For "message", make the surrounding invitation wording concise. For "messageFull", allow fuller phrasing supported by the source. Both must contain the same religious meaning and practical information; they may be identical when further shortening would lose meaning. There is no word or sentence limit that justifies dropping information. Optimize only repetition, grammar, flow, and non-informative embellishment.
Use the COUPLE'S first-person plural voice inviting the guests ("we", "our", "you"), not the parents' voice: convert "our son's wedding", "our daughter's wedding", or "the wedding of our children" into "our wedding". Preserve the religious opening and informative details while making this change. Do not start with "And", "With", "Together with", or a dangling clause unless it forms a complete sentence with a clear subject and invitation. Never leave an opening conjunction, unfinished phrase, or a reference that depends on nearby names to make sense.
For example, a source split as "request the pleasure of your presence / at the wedding / [couple names] / and bless the couple" can become "We warmly invite you to celebrate our wedding with us. Your presence and blessings would make this occasion even more special."
For example, "In the name of Allah, the Most Gracious and the Most Merciful, we cordially invite you and your family to join us on the auspicious occasion of our son's wedding ceremony. Your presence and blessings would make this joyous occasion even more special. Lunch will follow the ceremony." should become "In the name of Allah, the Most Gracious and the Most Merciful, we cordially invite you and your family to celebrate our wedding. Your presence and blessings would make this joyous occasion even more special. Lunch will follow the ceremony." This version may be used for both fields.
Do not invent engagement stories, gratitude for past support, family relationships, religious beliefs, quotations, or promises absent from the source. Do not pull unrelated names or logistical blocks elsewhere on the design into welcome copy; extract those into their appropriate fields. However, retain informative details already part of the welcome message even when they also belong in a structured field. Do not fabricate or rewrite a sacred quotation as if it were an exact quote. If no welcome, invitation, or blessing sentiment is present, return empty strings for both message fields.
Before returning JSON, compare BOTH messages against the source: verify that every religious opening or meaning and every informative detail in the welcome text survives in each version, then correct fragments, awkward joins, repetition, grammar, and punctuation.

Now return ONLY valid JSON (no markdown, no explanation) in this shape:
{"brideFirst":false,"groom":"calling name","groomFullName":"full name as written","bride":"calling name","brideFullName":"full name as written","groomFamily":"condensed: relation labels + names only","groomFamilyFull":"full family text exactly as written on the invitation","brideFamily":"condensed: relation labels + names only","brideFamilyFull":"full family text exactly as written on the invitation","date":"YYYY-MM-DD","time":"HH:MM (24h)","venue":"venue name","address":"full address","message":"concise curated welcome message in complete sentences","messageFull":"fuller curated welcome message preserving the source meaning","dressCode":"if mentioned","events":[{"title":"event name","date":"YYYY-MM-DD","time":"HH:MM","venue":"venue","address":"address"}]}

Additional rules:
- Family fields: "groomFamily"/"brideFamily" are CONDENSED — relation labels (S/o, D/o, Grand D/o, etc.) and names only, no addresses, house names, or location details. "groomFamilyFull"/"brideFamilyFull" are the FULL original text as it appears on the invitation, preserving all details.
- events: additional ceremonies beyond the main wedding (reception, mehendi, sangeet). Empty array if only one event. Never duplicate the wedding here.
- message and messageFull: follow STEP 6. Curate both versions for meaning and readability; neither is a verbatim transcription. Prefer a complete sentence over an arbitrary character or line limit.
- Empty string for any field not found.`

  async function callExtract(base64: string, filename: string, mimeType: string): Promise<PdfExtracted> {
    if (!supabase) throw new Error('Supabase client not available.')
    const { data, error: fnError } = await supabase.functions.invoke('openai-extract', {
      body: { ...(mimeType === 'application/pdf' ? { pdf: base64 } : { image: base64 }), mimeType, filename, prompt: pdfExtractPrompt },
    })
    if (fnError) {
      const context = fnError.context
      if (context instanceof Response) {
        let message = ''
        try {
          const payload = await context.clone().json()
          if (typeof payload?.error === 'string') message = payload.error
        } catch { /* Keep the original Supabase error if the response isn't JSON. */ }
        if (message) throw new Error(message)
      }
      throw fnError
    }
    if (data?.error) throw new Error(data.error)
    const raw = (data?.text || '').trim()
    return JSON.parse(raw)
  }

  async function handlePdfUpload(file: File) {
    if (pdfExtracting) return
    setPdfExtracting(true); setPdfError(''); setPdfResult(null)
    try {
      const mimeType = invitationUploadMimeType(file)
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => { const result = reader.result as string; resolve(result.split(',')[1]) }
        reader.onerror = () => reject(new Error('Failed to read file.'))
        reader.readAsDataURL(file)
      })
      if (!supabase) throw new Error('No Supabase client available.')
      const { data: authData, error: authError } = await supabase.auth.getUser()
      if (authError || !authData.user || !company?.id) throw new Error('Unable to confirm your company account for this invitation upload.')
      const { error: activityError } = await supabase.from('company_pdf_uploads').insert({ company_id: company.id, uploaded_by: authData.user.id, filename: file.name })
      if (activityError) throw new Error(`Could not record this invitation upload: ${activityError.message}`)
      const extracted = await callExtract(base64, file.name, mimeType)
      setPdfUseFull(new Set())
      setPdfResult(extracted)
    } catch (err) {
      setPdfError(err instanceof Error ? err.message : 'Failed to extract text from the invitation.')
      setPdfResult(null)
    } finally { setPdfExtracting(false) }
  }
  async function submitOrder(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); if (!selected || !supabase || busy) return
    if (pendingLocationCount > 0) { setError('Please wait for the map location to finish loading.'); return }
    if (!showOrderPreview && !review && !editingOrderId) {
      const form = event.currentTarget
      const sections = Array.from(form.querySelectorAll<HTMLFieldSetElement>(':scope > fieldset'))
      const step = Math.min(formStep, sections.length - 1)
      const invalidField = sections[step] ? Array.from(sections[step].querySelectorAll<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>(':invalid')).find(field => !(field instanceof HTMLInputElement && field.type === 'url' && field.value.startsWith('/'))) : undefined
      if (invalidField) { invalidField.reportValidity(); return }
      if (step < sections.length - 1) { setFormStep(step + 1); return }
      setReview(true); return
    }
    if (!event.currentTarget.reportValidity()) return
    if (!showOrderPreview) {
      setError(''); setShowOrderPreview(true); return
    }
    setBusy(true); setNotice(''); setError('')
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Your session expired. Please sign in again.')
      const { data: companyRow, error: companyError } = await supabase.from('companies').select('*').ilike('email', user.email || '').maybeSingle()
      if (companyError || !companyRow) throw new Error('Your account is not linked to a company yet.')
      const phone = '+91' + phoneNumber.trim().replace(/[^\d]/g,'')
      const formData = validateDetails({ ...details, musicStart: details.musicStart ?? 0, template: selected, events: [{ ...(copyingOrderId !== null ? details.events?.[0] : undefined), title: weddingEventTitle, date: details.date, time: details.time, venue: details.venue, address: details.address, map: details.map }, ...extraEvents], companyLogo: companyAssetURL(companyRow, 'logo'), companyName: company?.company_name || undefined, companyPhone: companyRow.phone || company?.phone || undefined })
      const templateCode = templates.find(template => template.id === selected)?.template_code
      if (!templateCode) throw new Error('That design is no longer available. Choose another template.')
      if (editingOrderId) {
        const { error: updateError } = await supabase.rpc(companyRow.is_test_account ? 'update_test_order' : 'update_company_order', { p_order_id: editingOrderId, p_form_data: formData, p_phone_number: phone })
        if (updateError) throw updateError
        setShowOrderPreview(false); setEditingOrderId(null); setCopyingOrderId(null); setSelected(null); setDetails(initial); setPhoneNumber(defaultPhoneNumber); setWeddingEventTitle(initialWeddingEvent); setExtraEvents(initialExtraEvents); setShowDetails(false); setFormStep(0); setTab('Orders'); setReview(false); setPdfPrefilled(false); setPdfBrideFirst(false); setNotice('Order updated successfully.'); await refresh()
      } else {
      const companyId = companyRow.id
      const { data, error: insertError } = await supabase.from(companyRow.is_test_account ? 'test_order' : 'orders').insert({ company_id: companyId, template_code: templateCode, created_by: user.id, groom_name: formData.groom, bride_name: formData.bride, phone_number: phone, form_data: formData }).select('*').single()
      if (insertError) throw insertError
      const createdOrder = data as Order
      const { data: reserved, error: reserveError } = companyRow.is_test_account
        ? { data: { published_path: createdOrder.published_path }, error: null }
        : await supabase.rpc('reserve_company_order_path', { p_order_id: createdOrder.id, p_candidate_paths: slugVariants(createdOrder.groom_name, createdOrder.bride_name, createdOrder.form_data.brideFirst) })
      const publishedPath: string | null = reserved?.published_path || null
      setViewOrder({ ...createdOrder, published_path: publishedPath, published_url: null })
      setShowOrderPreview(false); setCopyingOrderId(null); setSelected(null); setDetails(initial); setPhoneNumber(defaultPhoneNumber); setWeddingEventTitle(initialWeddingEvent); setExtraEvents(initialExtraEvents); setShowDetails(false); setFormStep(0); setTab('Orders'); setReview(false); setPdfPrefilled(false); setPdfBrideFirst(false); await refresh()
      if (reserveError) setError(`Order created, but its URL could not be reserved yet: ${reserveError.message}`)
      }
    } catch (cause) {
      const databaseMessage = cause && typeof cause === 'object' && 'message' in cause && typeof cause.message === 'string' ? cause.message : null
      setError(cause instanceof Error ? cause.message : databaseMessage || (editingOrderId ? 'Unable to update this order.' : 'Unable to submit this order.'))
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
  return <CardTemplateContext.Provider value={{template:selected ?? 0,showCoupleIllustrations:details.showCoupleIllustrations!==false,pdfBrideFirst,onIllustrationsChange:show=>setDetails(previous=>({...previous,showCoupleIllustrations:show}))}}><main className={`workspace client-workspace ${tab === 'Templates' ? 'has-client-preview' : ''} ${tab === 'Orders' ? 'has-orders-page' : ''} ${tab === 'Overview' ? 'has-overview-page' : ''} ${showDetails ? 'show-client-details' : ''} ${showDetails && formStepCount > 0 && formStep >= formStepCount - 1 ? 'last-form-step' : ''} ${review ? 'reviewing-client-order' : ''} ${editingOrderId ? 'editing-order' : ''}`}>
    <header className="client-topbar"><label className="client-top-search"><span aria-hidden="true">⌕</span><input value={templateSearch} onChange={event=>{setTemplateSearch(event.target.value);setTab('Templates');setSelected(null);setShowOrderPreview(false)}} placeholder={tab==='Orders'?'Search orders…':tab==='Settings'?'Search settings…':'Search templates by name, category or style…'} aria-label="Search invitation designs"/></label>
    <div className="workspace-account"><span className="client-account-name">{company?.company_name || 'Company'}</span><span className="client-account-avatar" aria-hidden="true"><svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4.5 21a7.5 7.5 0 0 1 15 0"/></svg></span></div></header>
    <aside className="workspace-sidebar"><a href="/" className="client-brand"><img src={showHiddenTemplates ? '/logo-landing.png' : companyLogo} alt={company?.company_name || 'Shaadi Invites'} onError={()=>setCompanyLogo('/logo.png')}/></a><nav className="client-section-nav" aria-label="Client dashboard">{(['Overview','Templates','Orders','Settings'] as const).map(item=><button type="button" key={item} className={tab===item?'active':''} onClick={()=>{setTab(item);setShowOrderPreview(false);setSelected(item==='Templates'?(chosen?.id||allTemplates[0]?.id||null):null);setError('')}}><span aria-hidden="true">{navIcons[item]}</span>{item==='Overview'?'Dashboard':item}</button>)}</nav><section className="client-sidebar-note"><span>♕ CLIENT SUPPORT</span><h2>Need a hand?</h2><p>Our team can help you create a beautiful invitation.</p><a href="https://wa.me/917975948093?text=Hey%20I%20need%20an%20invitation%21" target="_blank" rel="noreferrer">Contact support <b>↗</b></a></section><button className="workspace-logout" aria-label="Log out" onClick={() => void signOutToLogin()}><span aria-hidden="true"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg></span><span>Log out</span></button></aside>
    <section className={`workspace-main ${tab==='Orders'?'orders-page':''}`}><header className="workspace-top"><div>{tab==='Templates'&&showDetails&&<button type="button" className="client-form-back" onClick={()=>{setShowDetails(false);setReview(false);setShowOrderPreview(false);setEditingOrderId(null);setCopyingOrderId(null)}}>← Back to templates</button>}<span className="workspace-kicker">{tab==='Orders'?'ORDERS':tab==='Templates'?(showDetails?'PERSONALISE YOUR INVITATION':'THE ART OF A BEAUTIFUL BEGINNING'):''}</span><h1>{tab==='Templates'?(showDetails?(showOrderPreview?'Preview order':editingOrderId?'Edit your invitation':'Create your invitation'):'Choose a Template'):tab==='Overview'?'Your invitation studio':tab}</h1></div>{tab==='Templates'&&<input ref={pdfInputRef} type="file" accept={invitationUploadAccept} hidden onChange={e=>{const f=e.target.files?.[0];if(f)void handlePdfUpload(f);e.target.value=''}}/>}{tab==='Orders'&&<button type="button" className="orders-new-order" onClick={()=>{setTab('Templates');setSelected(chosen?.id||allTemplates[0]?.id||null)}}><span aria-hidden="true">＋</span> New Order</button>}{tab==='Templates'&&showDetails&&!editingOrderId&&workflowHost&&!showOrderPreview&&createPortal(<div className="client-workflow-controls"><span className="client-workflow-progress" aria-hidden="true"></span><button type="button" className="client-workflow-back" disabled={formStep===0&&!review} onClick={()=>review?setReview(false):setFormStep(step=>Math.max(0,step-1))}>← Back</button><button type="button" className="client-workflow-next" onClick={()=>{ if(review){setReview(false);setShowOrderPreview(true)}else{advanceFormStep()} }}>Continue →</button></div>,workflowHost)}{tab==='Templates'&&showDetails&&!editingOrderId&&<button type="button" className={`client-upload-pdf-ai client-upload-form${pdfExtracting?' ai-extracting':''}`} disabled={pdfExtracting} onClick={()=>pdfInputRef.current?.click()}><span className="ai-invite-illustration" aria-hidden="true"><img src="/upload-card-design.png" alt=""/></span><span className="ai-label"><strong>{pdfExtracting?'Extracting…':'Upload your invitation'}</strong><small>PDF, JPG, PNG or WebP · Extract details with AI</small></span>{!pdfExtracting&&<span className="ai-upload-btn">Upload design</span>}</button>}{tab==='Templates'&&<span className="client-design-count">{allTemplates.length} carefully curated invitations</span>}</header>
      {tab==='Templates'&&<div className="client-catalog-controls"><div className="client-filter-chips"><button type="button" className={categoryFilter==='ALL'?'active':''} onClick={()=>selectCategory('ALL')}>All <span className="category-chip-count">{allTemplates.length}</span></button>{categories.map(category=><button type="button" key={category} className={categoryFilter===category?'active':''} onClick={()=>selectCategory(category)}><span className="category-chip-icon" aria-hidden="true">{categoryChipIcons[category] ?? <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3"/></svg>}</span>{category}</button>)}</div><label className="client-sort-control">Sort by<select value={templateSort} onChange={event=>setTemplateSort(event.target.value as 'CURATED'|'NAME')}><option value="CURATED">Curated</option><option value="NAME">Name</option></select></label></div>}
      {tab==='Templates'&&chosen&&<div className="client-selected-gallery"><div className="client-selected-gallery-title"><span className="workspace-kicker">THE COLLECTION</span><button type="button" onClick={()=>setShowDetails(false)}>{showDetails?'Hide details':'Choose a template'}</button></div><div key={categoryFilter} className={`client-selected-card-grid category-slide-from-${categoryDirection}`}>{templates.map(template=><article key={template.id} className={`client-selected-card ${template.id===previewTemplate?.id?'active':''}`}><button type="button" className="client-card-preview-trigger" onClick={()=>setPreviewId(template.id)} aria-label={`Preview ${template.name} on the mobile screen`}><span className="client-selected-thumb">{TEMPLATE_INTRO_VIDEOS[template.id]?<video src={TEMPLATE_INTRO_VIDEOS[template.id]} poster={TEMPLATE_THUMBNAIL_OVERRIDES[template.id]??template.thumbnail_url} autoPlay muted loop playsInline aria-label={`${template.name} intro preview`}/>:<img src={TEMPLATE_THUMBNAIL_OVERRIDES[template.id]??TEMPLATE_INTRO_IMAGES[template.id]??template.thumbnail_url} alt=""/>}{templateSettings[template.id]?.is_premium&&<span className="client-template-premium-badge">PREMIUM</span>}</span><span className="client-template-card-meta"><span className="client-template-card-copy"><strong>{template.name}</strong><small>{template.category}</small></span><TemplatePrice setting={templateSettings[template.id]}/></span></button><button type="button" className="client-selected-card-order" onClick={()=>chooseTemplate(template.id)}>Get this design <span aria-hidden="true">→</span></button></article>)}</div></div>}
      {tab !== 'Settings' && error && <p className="workspace-alert" role="alert">{error}</p>}{tab === 'Templates' && notice && <p className="workspace-success" role="status">{notice}</p>}
      {viewOrder && <div className="client-order-overlay" role="presentation" onMouseDown={event=>{if(event.target===event.currentTarget)setViewOrder(null)}}><section className={`client-order-dialog${viewOrder.status==='READY'&&viewOrder.published_url&&(!viewOrder.expires_at||new Date(viewOrder.expires_at)>new Date())?' client-order-published':''}`} role="dialog" aria-modal="true" aria-labelledby="client-order-title"><button className="dialog-close" onClick={()=>setViewOrder(null)} aria-label="Close order details">×</button>{viewOrder.status==='READY'&&viewOrder.published_url&&(!viewOrder.expires_at||new Date(viewOrder.expires_at)>new Date())?<header className="client-published-heading">
  <svg className="client-published-success" viewBox="0 0 120 64" fill="none" aria-hidden="true">
    <path className="client-published-success-rays" d="M5 32h16M24 15 13 5M24 49 13 59M99 32h16M96 15 107 5M96 49 107 59" stroke="#6ca55a" strokeWidth="2.5" strokeLinecap="round"/>
    <path d="M60.00 4.50C60.59 4.50 61.20 4.71 61.77 5.00C62.34 5.28 62.88 5.80 63.39 6.22C63.91 6.65 64.37 7.19 64.87 7.54C65.36 7.89 65.82 8.19 66.34 8.33C66.87 8.48 67.42 8.44 68.02 8.38C68.62 8.32 69.29 8.09 69.95 7.98C70.61 7.87 71.34 7.70 71.97 7.73C72.60 7.76 73.24 7.89 73.75 8.18C74.26 8.48 74.69 8.97 75.03 9.50C75.38 10.03 75.59 10.75 75.83 11.37C76.06 12.00 76.19 12.70 76.44 13.25C76.69 13.80 76.94 14.29 77.32 14.68C77.71 15.06 78.20 15.31 78.75 15.56C79.30 15.81 80.00 15.94 80.63 16.17C81.25 16.41 81.97 16.62 82.50 16.97C83.03 17.31 83.52 17.74 83.82 18.25C84.11 18.76 84.24 19.40 84.27 20.03C84.30 20.66 84.13 21.39 84.02 22.05C83.91 22.71 83.68 23.38 83.62 23.98C83.56 24.58 83.52 25.13 83.67 25.66C83.81 26.18 84.11 26.64 84.46 27.13C84.81 27.63 85.35 28.09 85.78 28.61C86.20 29.12 86.72 29.66 87.00 30.23C87.29 30.80 87.50 31.41 87.50 32.00C87.50 32.59 87.29 33.20 87.00 33.77C86.72 34.34 86.20 34.88 85.78 35.39C85.35 35.91 84.81 36.37 84.46 36.87C84.11 37.36 83.81 37.82 83.67 38.34C83.52 38.87 83.56 39.42 83.62 40.02C83.68 40.62 83.91 41.29 84.02 41.95C84.13 42.61 84.30 43.34 84.27 43.97C84.24 44.60 84.11 45.24 83.82 45.75C83.52 46.26 83.03 46.69 82.50 47.03C81.97 47.38 81.25 47.59 80.63 47.83C80.00 48.06 79.30 48.19 78.75 48.44C78.20 48.69 77.71 48.94 77.32 49.32C76.94 49.71 76.69 50.20 76.44 50.75C76.19 51.30 76.06 52.00 75.83 52.63C75.59 53.25 75.38 53.97 75.03 54.50C74.69 55.03 74.26 55.52 73.75 55.82C73.24 56.11 72.60 56.24 71.97 56.27C71.34 56.30 70.61 56.13 69.95 56.02C69.29 55.91 68.62 55.68 68.02 55.62C67.42 55.56 66.87 55.52 66.34 55.67C65.82 55.81 65.36 56.11 64.87 56.46C64.37 56.81 63.91 57.35 63.39 57.78C62.88 58.20 62.34 58.72 61.77 59.00C61.20 59.29 60.59 59.50 60.00 59.50C59.41 59.50 58.80 59.29 58.23 59.00C57.66 58.72 57.12 58.20 56.61 57.78C56.09 57.35 55.63 56.81 55.13 56.46C54.64 56.11 54.18 55.81 53.66 55.67C53.13 55.52 52.58 55.56 51.98 55.62C51.38 55.68 50.71 55.91 50.05 56.02C49.39 56.13 48.66 56.30 48.03 56.27C47.40 56.24 46.76 56.11 46.25 55.82C45.74 55.52 45.31 55.03 44.97 54.50C44.62 53.97 44.41 53.25 44.17 52.63C43.94 52.00 43.81 51.30 43.56 50.75C43.31 50.20 43.06 49.71 42.68 49.32C42.29 48.94 41.80 48.69 41.25 48.44C40.70 48.19 40.00 48.06 39.37 47.83C38.75 47.59 38.03 47.38 37.50 47.03C36.97 46.69 36.48 46.26 36.18 45.75C35.89 45.24 35.76 44.60 35.73 43.97C35.70 43.34 35.87 42.61 35.98 41.95C36.09 41.29 36.32 40.62 36.38 40.02C36.44 39.42 36.48 38.87 36.33 38.34C36.19 37.82 35.89 37.36 35.54 36.87C35.19 36.37 34.65 35.91 34.22 35.39C33.80 34.88 33.28 34.34 33.00 33.77C32.71 33.20 32.50 32.59 32.50 32.00C32.50 31.41 32.71 30.80 33.00 30.23C33.28 29.66 33.80 29.12 34.22 28.61C34.65 28.09 35.19 27.63 35.54 27.13C35.89 26.64 36.19 26.18 36.33 25.66C36.48 25.13 36.44 24.58 36.38 23.98C36.32 23.38 36.09 22.71 35.98 22.05C35.87 21.39 35.70 20.66 35.73 20.03C35.76 19.40 35.89 18.76 36.18 18.25C36.48 17.74 36.97 17.31 37.50 16.97C38.03 16.62 38.75 16.41 39.37 16.17C40.00 15.94 40.70 15.81 41.25 15.56C41.80 15.31 42.29 15.06 42.68 14.68C43.06 14.29 43.31 13.80 43.56 13.25C43.81 12.70 43.94 12.00 44.17 11.37C44.41 10.75 44.62 10.03 44.97 9.50C45.31 8.97 45.74 8.48 46.25 8.18C46.76 7.89 47.40 7.76 48.03 7.73C48.66 7.70 49.39 7.87 50.05 7.98C50.71 8.09 51.38 8.32 51.98 8.38C52.58 8.44 53.13 8.48 53.66 8.33C54.18 8.19 54.64 7.89 55.13 7.54C55.63 7.19 56.09 6.65 56.61 6.22C57.12 5.80 57.66 5.28 58.23 5.00C58.80 4.71 59.41 4.50 60.00 4.50Z" fill="#135330"/>
    <path className="client-published-success-check" pathLength="1" d="m49 32 7 7 15-15" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
  <h2 id="client-order-title">Awesome! The invitation is live</h2>
  <p>The invitation has been published and is now ready to share with your customer.</p>
</header>:<>
  <span className="workspace-kicker">ORDER #{viewOrder.id}</span>
  <span className={`status-pill status-${viewOrder.status.toLowerCase()}`}>{statusTitle[viewOrder.status]}</span>
  <h2 id="client-order-title">{viewOrder.groom_name} &amp; {viewOrder.bride_name}</h2>
  <p>{designs.find(d=>d.id===viewOrder.form_data.template)?.name} · Submitted {new Date(viewOrder.created_at).toLocaleDateString()}</p>
</>}
{viewOrder.status==='READY'&&viewOrder.published_url&&(!viewOrder.expires_at||new Date(viewOrder.expires_at)>new Date())?<section className="client-published-actions" aria-label="Share your invitation">
  <div className="client-published-links">
    {[{label:'Invitation Link',url:viewOrder.published_url!,kind:'invitation'},...(viewOrder.management_id?[{label:'Management Link',url:`${window.location.origin}/${viewOrder.management_id}`,kind:'management'}]:[])].map(link=><div className="client-published-link-row" key={link.kind}>
      <span className="client-published-link-icon">{link.kind==='invitation'?<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m10 13 4-4m-6 6-1 1a4 4 0 0 1-6-6l4-4a4 4 0 0 1 6 0m2 2 1-1a4 4 0 0 1 6 6l-4 4a4 4 0 0 1-6 0" transform="translate(1 1)"/></svg>:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m9 3 1-1h4l1 3 3 1 2 2-1 3 1 3-2 3-3 1-1 3h-4l-1-3-3-1-2-3 1-3-1-3 2-2 3-1Z"/><circle cx="12" cy="11.5" r="3"/></svg>}</span>
      <div className="client-published-link-copy"><h3>{link.label}</h3><a href={link.url} target="_blank" rel="noreferrer">{link.url}</a></div>
      <div className="client-published-link-actions">
        <a className="client-published-open" href={link.url} target="_blank" rel="noreferrer" aria-label={`Open ${link.label.toLowerCase()} in a new tab`}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M14 3h7v7m0-7L10 14m0-10H5a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2h13a2 2 0 0 0 2-2v-5"/></svg></a>
        <button type="button" aria-label={`Copy ${link.label.toLowerCase()}`} onClick={()=>void navigator.clipboard.writeText(link.url)}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="8" y="8" width="12" height="13" rx="2"/><path d="M15 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h3"/></svg>Copy</button>
      </div>
    </div>)}
  </div>
  <div className="wa-send-section">
    <h3><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M21 11.5a9 9 0 0 1-13.4 7.8L3 21l1.6-4.7A9 9 0 1 1 21 11.5Z"/><path d="m8 7 2 3-1 1a8 8 0 0 0 4 4l1-1 3 1c-1 3-4 2-6 0s-5-5-3-8Z"/></svg>Send on WhatsApp</h3>
    <div className="wa-send-row">
      <div className="client-published-phone">
        {(waPhone||viewOrder.phone_number||'').startsWith('+91')&&<span className="client-published-country">+91</span>}
        <input type="tel" aria-label={(waPhone||viewOrder.phone_number||'').startsWith('+91')?'WhatsApp phone number, country code +91':'WhatsApp phone number including country code'} placeholder="98765 43210" value={(waPhone||viewOrder.phone_number||'').replace(/^\+91\s*/,'')} onChange={e=>{setWaPhone(((waPhone||viewOrder.phone_number||'').startsWith('+91')&&!e.target.value.startsWith('+')?'+91':'')+e.target.value);setWaSent(false);setWaError('')}} disabled={waSending||waSent}/>
      </div>
      <button type="button" className="wa-send-btn" onClick={()=>void sendWhatsApp()} disabled={waSending||!(waPhone.trim()||viewOrder.phone_number?.trim())||waSent}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M21 11.5a9 9 0 0 1-13.4 7.8L3 21l1.6-4.7A9 9 0 1 1 21 11.5Z"/><path d="m8 7 2 3-1 1a8 8 0 0 0 4 4l1-1 3 1c-1 3-4 2-6 0s-5-5-3-8Z"/></svg>{waSent?'Sent ✓':waSending?'Sending…':'Send'}</button>
    </div>
    {waError&&<p className="wa-error" role="alert">{waError}</p>}
  </div>
</section>:viewOrder.status!=='CREATED'&&viewOrder.status!=='READY'&&viewOrder.expires_at&&new Date(viewOrder.expires_at)<=new Date()?<p className="workspace-alert">This invitation link has expired. Contact Shaadi Invites to renew it.</p>:viewOrder.status!=='CREATED'&&viewOrder.status!=='READY'&&<p className="form-note">Your invitation is being prepared. The public link will appear here after publication.</p>}
{!(viewOrder.status==='READY'&&viewOrder.published_url&&(!viewOrder.expires_at||new Date(viewOrder.expires_at)>new Date()))&&<dl><dt>Wedding date</dt><dd>{viewOrder.form_data.date} · {viewOrder.form_data.time}</dd><dt>Venue</dt><dd>{viewOrder.form_data.venue}, {viewOrder.form_data.address}</dd><dt>Celebrations</dt><dd><ul className="publish-celebration-list">{viewOrder.form_data.events?.length ? viewOrder.form_data.events.map((event,index)=><li key={index}>{event.title} · {event.date} · {event.venue}</li>) : <li>Wedding</li>}</ul></dd><dt><span className="publish-whatsapp-label"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M21 11.5a9 9 0 0 1-13.4 7.8L3 21l1.6-4.7A9 9 0 1 1 21 11.5Z"/><path d="m8 7 2 3-1 1a8 8 0 0 0 4 4l1-1 3 1c-1 3-4 2-6 0s-5-5-3-8Z"/></svg>WhatsApp</span></dt><dd>{viewOrder.phone_number?.trim().replace(/^\+91\s*/, '+91 ') || '—'}</dd></dl>}{viewOrder.rejection_reason&&<p className="workspace-alert"><strong>Studio note:</strong> {viewOrder.rejection_reason}</p>}{viewOrder.status==='CREATED'&&<div className="client-publish-prompt">{company?.slug&&<><button type="button" className="secondary-action" disabled={busy} onClick={()=>void previewOrder(viewOrder)}><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>{busy?'Opening preview…':'Preview invitation'}</button><p className="form-note">Opens in a new tab. Review the invitation before publishing.</p></>}<label>Wedding invitation URL<input readOnly value={viewOrder.published_url || (viewOrder.published_path ? inviteUrl(viewOrder.published_path) : 'Will be assigned when published')}/></label><p>Publish this invitation to make the link live.</p><button type="button" className="primary-action" disabled={busy} onClick={()=>void publishClientOrder(viewOrder)}>{busy?'Publishing…':'Publish invitation →'}</button></div>}</section></div>}
      {tab === 'Overview' && <div className="overview-dashboard"><section className="client-overview-welcome"><div><span className="workspace-kicker">WELCOME BACK</span><h2>Your invitation studio</h2><p>Create beautiful digital wedding invitations and manage all your orders in one place.</p></div><button type="button" className="client-overview-primary" onClick={() => { setTab('Templates'); setSelected(chosen?.id || allTemplates[0]?.id || null) }}>＋ Create an invitation</button></section><div className="metric-grid">{[
        {label:'Total orders',value:counts.total,icon:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="3"/><path d="M8 10h8M8 14h5"/></svg>,tone:'blue',change:monthOrderChange},
        {label:'Total revenue',value:formatRevenue(datedOrders),icon:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M6 6h9a3 3 0 0 1 0 6H6M8 12h8a3 3 0 0 1 0 6H6"/></svg>,tone:'green',change:revenueCoverage(datedOrders,revenueChangeLabel(monthRevenue,previousMonthRevenue,'last month'))},
        {label:"Today's orders",value:todayOrders.length,icon:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="3"/><path d="M16 2v4M8 2v4M3 10h18M8 15h2M14 15h2"/></svg>,tone:'purple',change:todayOrderChange},
        {label:"Today's revenue",value:formatRevenue(todayOrders),icon:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 6v12M8 9h6.5a2 2 0 0 1 0 4H8M9 13h6a2 2 0 0 1 0 4H8"/></svg>,tone:'gold',change:revenueCoverage(todayOrders,revenueChangeLabel(todayRevenue,yesterdayRevenue,'yesterday'))},
      ].map(metric=><article className={`metric-card metric-${metric.tone}`} key={metric.label}><span>{metric.label}</span><strong>{metric.value}</strong><i aria-hidden="true">{metric.icon}</i><small className={metric.change.startsWith('↑')?'metric-change-up':metric.change.startsWith('↓')?'metric-change-down':'metric-change-neutral'}>{metric.change.includes(' from ')?<><b>{metric.change.slice(0,metric.change.indexOf(' from '))}</b>{metric.change.slice(metric.change.indexOf(' from '))}</>:metric.change}</small></article>)}</div><div className="client-overview-columns"><section className="client-recent-orders"><div className="section-heading recent-orders-heading"><h2>Recent orders</h2><button className="text-action" onClick={() => setTab('Orders')}>View all →</button></div><OrderTable orders={orders.slice(0,5)} onSelect={setViewOrder} variant="overview"/><div className="recent-orders-footer">Showing {orders.length===0?'0':`1–${Math.min(5,orders.length)}`} of {orders.length} orders<button type="button" onClick={()=>setTab('Orders')}>View all orders →</button></div></section><aside className="client-overview-side-card"><h2>Orders by status</h2><div className="client-status-breakdown"><div className="client-status-donut" style={{ background: `conic-gradient(#557260 0 ${orders.length ? orders.filter(order=>order.status==='READY').length/orders.length*100 : 0}%, #e3a05b 0 ${orders.length ? (orders.filter(order=>order.status==='READY').length+orders.filter(order=>order.status==='IN_PROGRESS').length)/orders.length*100 : 0}%, #a87592 0 ${orders.length ? (orders.filter(order=>order.status==='READY').length+orders.filter(order=>order.status==='IN_PROGRESS').length+orders.filter(order=>order.status==='CREATED').length)/orders.length*100 : 0}%, #db7f8e 0 100%)` }}><span><strong>{orders.length}</strong><small>Orders</small></span></div><ul><li><i className="status-dot status-dot-published"/>Published <b>{orders.filter(order=>order.status==='READY').length}</b></li><li><i className="status-dot status-dot-progress"/>In progress <b>{orders.filter(order=>order.status==='IN_PROGRESS').length}</b></li><li><i className="status-dot status-dot-new"/>New <b>{orders.filter(order=>order.status==='CREATED').length}</b></li><li><i className="status-dot status-dot-changes"/>Needs changes <b>{orders.filter(order=>order.status==='REJECTED').length}</b></li></ul></div></aside></div><section className="client-popular-templates"><div className="section-heading"><h2>Popular templates</h2><button className="text-action" onClick={()=>setTab('Templates')}>View all templates →</button></div><div className="client-popular-grid">{allTemplates.slice(0,7).map(template=><button type="button" className="client-popular-template" key={template.id} onClick={()=>chooseTemplate(template.id)}><img src={TEMPLATE_THUMBNAIL_OVERRIDES[template.id] ?? template.thumbnail_url} alt=""/><strong>{template.name}</strong><small>{template.category}</small></button>)}</div></section></div>}
      {tab === 'Templates' && <>{chosen ? <div className="order-create"><div className="order-template-rail"><button className="back-action" onClick={() => setSelected(null)}>← All templates</button>{templates.map(template => <button key={template.id} className={`rail-template ${selected === template.id ? 'selected' : ''}`} onClick={() => chooseTemplate(template.id)}><img src={template.thumbnail_url} alt=""/><span>{template.name}<small>{template.category}</small></span></button>)}</div><form className="order-form" onSubmit={submitOrder}><OrderProgressBar current={review ? 3 : showOrderPreview ? 4 : formStep} onNavigate={step => { if (step === 3) { setShowOrderPreview(false); setReview(true) } else if (step === 4) { setReview(false); setShowOrderPreview(true) } else { setReview(false); setShowOrderPreview(false); setFormStep(step) } }} /><div className="form-heading"><div><span className="workspace-kicker">{editingOrderId ? `EDIT ORDER #${editingOrderId}` : copyingOrderId !== null ? `COPY OF ORDER #${copyingOrderId}` : 'NEW INVITATION ORDER'}</span><h2>{chosen.name}</h2><div className="client-couple-order-control"><span className="client-couple-order-prefix">This beautiful invitation for</span><div className={`client-couple-order-options${details.brideFirst ? " bride-first" : ""}`} role="group" aria-label="Choose which name comes first"><button type="button" className={!details.brideFirst ? "active" : ""} aria-pressed={!details.brideFirst} onClick={() => setCoupleOrder(false)}>{details.groom}</button><button type="button" className={details.brideFirst ? "active" : ""} aria-pressed={!!details.brideFirst} onClick={() => setCoupleOrder(true)}>{details.bride}</button></div></div></div><label className="form-heading-phone"><span>WhatsApp number <i>*</i></span><span className="wa-input-wrap"><img src="/whatsapp-icon.png" alt="" className="wa-icon"/><span className="wa-prefix">+91</span><input type="tel" required disabled={!!editingOrderId} value={phoneNumber} onChange={e=>setPhoneNumber(e.target.value.replace(/[^\d]/g,'').slice(0,10))} placeholder="98765 43210"/></span></label></div>{showOrderPreview ? <OrderPreviewStep details={livePreviewDetails} previewFrame={previewFrame} designCategory={chosen.category} busy={busy} editing={!!editingOrderId} draftStatus={draftStatus} templateId={selected!} companyId={company.id} onChange={setField} onFooterIllustrationChange={v=>setDetails(prev=>({...prev,footerIllustration:v||undefined}))} onBack={() => { setShowOrderPreview(false); setReview(true); setError('') }} onNavigateStep={step => { if (step === 3) { setShowOrderPreview(false); setReview(true) } else if (step === 4) { setReview(false); setShowOrderPreview(true) } else { setReview(false); setShowOrderPreview(false); setFormStep(step) } }} /> : <><fieldset><legend>01 · The couple</legend><div className="form-grid"><Field label="Groom's name" required value={details.groom} onChange={v => setField('groom',v)}/><Field label="Bride's name" required value={details.bride} onChange={v => setField('bride',v)}/><Field label="Groom's family" value={details.groomFamily} onChange={v => setField('groomFamily',v)}/><Field label="Bride's family" value={details.brideFamily} onChange={v => setField('brideFamily',v)}/><label style={{gridColumn:'1 / -1'}}>Welcome message<textarea rows={3} value={details.message} maxLength={2000} onChange={e => setField('message', e.target.value)}/></label></div></fieldset><fieldset><legend>02 · Wedding details</legend><div className="wedding-details-layout"><div className="form-grid wedding-details-grid"><Field label="Wedding celebration name" required value={weddingEventTitle} onChange={setWeddingEventTitle}/><Field label="Wedding date" type="date" required value={details.date} onChange={v => setField('date',v)}/><Field label="Ceremony time" type="time" value={details.time} onChange={v => setField('time',v)}/><Field label="Venue" required value={details.venue} onChange={v => setField('venue',v)}/><Field label="Address" required value={details.address} onChange={v => setField('address',v)}/></div><div className="celebration-location"><EventLocationPicker title={weddingEventTitle || 'Wedding'} venue={details.venue} address={details.address} value={details.map} disabled={busy} onPendingChange={updatePendingLocationCount} onChange={map => setField('map', map)}/></div></div></fieldset><fieldset><legend>03 · Celebrations</legend><p className="form-note">The wedding celebration is included from the details above.</p>{extraEvents.map((item,index)=>{const cp=CEL_PALETTE[index%7];return<div className="celebration-editor" key={index} style={{'--cel-bg':cp.headerBg,'--cel-border':cp.border,'--cel-icon':cp.icon} as React.CSSProperties}><div className="celebration-header"><span className="celebration-icon" aria-hidden="true"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg></span><span className="celebration-number">{String(index+1).padStart(2,'0')}</span><h3 className="celebration-title">{item.title||`Celebration ${index+1}`}</h3><button type="button" className="celebration-remove" onClick={()=>setExtraEvents(events=>events.filter((_,i)=>i!==index))} aria-label={`Remove celebration ${index+1}`}><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/></svg>Remove</button></div><div className="celebration-card-body"><div className="form-grid celebration-grid"><Field label="Event name" required value={item.title} onChange={v=>setExtraEvents(events=>events.map((event,i)=>i===index?{...event,title:v}:event))}/><Field label="Date" type="date" required value={item.date} onChange={v=>setExtraEvents(events=>events.map((event,i)=>i===index?{...event,date:v}:event))}/><Field label="Time" type="time" value={item.time ?? ''} onChange={v=>setExtraEvents(events=>events.map((event,i)=>i===index?{...event,time:v}:event))}/><Field label="Venue" required value={item.venue} onChange={v=>setExtraEvents(events=>events.map((event,i)=>i===index?{...event,venue:v}:event))}/><Field label="Address" required value={item.address} onChange={v=>setExtraEvents(events=>events.map((event,i)=>i===index?{...event,address:v}:event))}/></div><div className="celebration-location"><EventLocationPicker title={item.title || `Celebration ${index + 1}`} venue={item.venue} address={item.address} value={item.map || ''} disabled={busy} onPendingChange={updatePendingLocationCount} onChange={map => setExtraEvents(events=>events.map((event,i)=>i===index?{...event,map}:event))}/></div></div></div>})}<button type="button" className="celebration-add" disabled={extraEvents.length>=9} onClick={()=>setExtraEvents(events=>[...events,{title:'',date:details.date,time:'',venue:'',address:'',map:''}])}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 5v14M5 12h14"/></svg>Add another celebration</button></fieldset>{editingOrderId&&<div className="form-submit-row">{formStep===2&&!review?<button type="button" className="primary-action" disabled={busy} onClick={()=>{setShowOrderPreview(false);setReview(true)}}>Continue →</button>:<button type="submit" className="primary-action" disabled={busy}>Continue →</button>}</div>}{!editingOrderId&&<div className="form-submit-row"><button type="button" className="back-action" onClick={() => setReview(false)}>← Back</button>{formStep===2&&!review?<button type="button" className="primary-action" disabled={busy} onClick={()=>{setShowOrderPreview(false);setReview(true)}}>Continue →</button>:<button type="submit" className="primary-action" disabled={busy}>Continue →</button>}</div>}</>}</form></div> : <><section className="client-collection-intro"><div><span className="workspace-kicker">THE ART OF A BEAUTIFUL BEGINNING</span><h2>Choose a design that tells their story.</h2><p>Preview the collection and prepare a personal invitation order for your couple.</p></div><div className="client-collection-art" aria-hidden="true"><span>Shaadi Invites</span><i>✧</i></div></section><div className="client-collection-heading"><div><span className="workspace-kicker">THE COLLECTION</span><h2>Invitation designs <small>{templates.length} curated styles</small></h2></div><span className="client-collection-note">Select a design to begin an order <b>↓</b></span></div><div className="template-grid">{templates.map((template,index)=><article className="template-tile" key={template.id}><a className="template-image" href={template.preview_url} target="_blank" rel="noreferrer">{TEMPLATE_INTRO_VIDEOS[template.id]?<video src={TEMPLATE_INTRO_VIDEOS[template.id]} poster={TEMPLATE_THUMBNAIL_OVERRIDES[template.id]??template.thumbnail_url} autoPlay muted loop playsInline ref={el=>{if(el){el.muted=true;el.setAttribute('muted','');el.play().catch(()=>{})}}}/>:<img src={TEMPLATE_INTRO_IMAGES[template.id]??template.thumbnail_url} alt={`${template.name} preview`} loading="lazy"/>}<span>PREVIEW ↗</span></a><div><small>{String(index+1).padStart(2,'0')} · {template.category}</small><h2>{template.name}</h2><button className="text-action" onClick={() => chooseTemplate(template.id)}>Choose this design <b>→</b></button></div></article>)}</div></>}</>}
      {tab === 'Orders' && <><p className="workspace-lede orders-description">View and manage all invitation orders submitted by your customers.</p><div className="orders-summary"><span className="orders-summary-item"><span className="orders-summary-label">Total</span><span className="orders-summary-value">{orders.length}</span></span><span className="orders-summary-divider"/><span className="orders-summary-item"><span className="orders-summary-label">Published</span><span className="orders-summary-value">{orders.filter(o=>o.status==='READY').length}</span></span><span className="orders-summary-divider"/><span className="orders-summary-item"><span className="orders-summary-label">Pending</span><span className="orders-summary-value">{orders.filter(o=>o.status==='CREATED'||o.status==='IN_PROGRESS').length}</span></span></div><div className="orders-filters"><label className="orders-search"><span aria-hidden="true"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg></span><input value={orderSearch} onChange={e => {setOrderSearch(e.target.value);setOrdersPage(0)}} placeholder="Search by order ID, couple name, or phone…" aria-label="Search orders"/></label><div className="orders-date-filter"><span aria-hidden="true"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg></span><input type="date" value={orderDateFrom} onChange={e=>{setOrderDateFrom(e.target.value);setOrdersPage(0)}} aria-label="Submitted from"/><span className="orders-date-separator">to</span><input type="date" value={orderDateTo} onChange={e=>{setOrderDateTo(e.target.value);setOrdersPage(0)}} aria-label="Submitted to"/></div></div><OrderTable orders={filtered.slice(ordersPage*20,ordersPage*20+20)} onSelect={setViewOrder} onEdit={startEditOrder} onCopy={startCopyOrder} onCreate={orders.length===0?()=>{setTab('Templates');setSelected(chosen?.id||allTemplates[0]?.id||null)}:undefined}/>{filtered.length>20&&<div className="pagination"><button disabled={ordersPage===0} onClick={()=>setOrdersPage(p=>p-1)}>← Previous</button><span>Page {ordersPage+1} of {Math.max(1,Math.ceil(filtered.length/20))}</span><button disabled={(ordersPage+1)*20>=filtered.length} onClick={()=>setOrdersPage(p=>p+1)}>Next →</button></div>}</>}
      {tab === 'Settings' && <TemplateSettingsPanel companyName={company?.company_name || 'your company'} templates={allTemplates} settings={templateSettings} defaults={templateDefaults} error={error} canSave={Boolean(company)} onChange={editTemplateSetting} onSaveAll={saveAllTemplateSettings} onCustomizeDemo={setEditingDemo}/>}
    </section>
    {tab === 'Templates' && <aside className="client-preview-panel"><div className="client-preview-heading"><div><span className="workspace-kicker">LIVE PREVIEW</span><h2>{previewTemplate?.name || 'Invitation preview'}</h2></div><span className="preview-live-dot" aria-label="Live preview"/></div>{previewTemplate ? <><div className="client-device-frame"><div className="client-device-screen"><InvitationPreviewFrame templateId={previewTemplate.id} ref={previewFrame} title={`${previewTemplate.name} mobile invitation preview`} src={previewSrc} allow="autoplay; fullscreen" allowFullScreen /></div></div><div className="client-preview-thumbs" aria-label="Choose a design to preview">{templates.map(template=><button type="button" key={template.id} className={previewTemplate.id === template.id ? 'active' : ''} onClick={()=>setPreviewId(template.id)} aria-label={`Preview ${template.name}`}><img src={template.thumbnail_url} alt=""/></button>)}</div><a className="client-preview-open" href={previewTemplate.preview_url} target="_blank" rel="noreferrer">Preview Full Invitation <span>↗</span></a><button type="button" className="client-preview-choose" onClick={()=>chooseTemplate(previewTemplate.id)}>Get this design <span>→</span></button></> : <p className="form-note">Your invitation previews will appear here.</p>}</aside>}
    {tab === 'Templates' && showDetails && chosen && !loading && <Suspense fallback={null}><OrderTextEditor key={chosen.id} template={chosen.id} value={details.textOverrides} onChange={textOverrides => setDetails(previous => ({ ...previous, textOverrides }))} draftStatus={draftStatus}/></Suspense>}
    {editingDemo !== null && company && <TemplateDemoEditor
      templateId={editingDemo}
      templateName={allTemplates.find(t => t.id === editingDemo)?.name || 'Template'}
      companyId={company.id}
      existing={templateDefaults[editingDemo] || null}
      saving={demoSaving}
      onSave={async (demoData) => {
        if (!supabase) return
        setDemoSaving(true)
        const { error: saveError } = await supabase.from('company_template_defaults').upsert({ company_id: company.id, template_id: editingDemo, demo_data: demoData }, { onConflict: 'company_id,template_id' })
        setDemoSaving(false)
        if (saveError) { setError(saveError.message); return }
        setTemplateDefaults(prev => ({ ...prev, [editingDemo]: demoData }))
        setEditingDemo(null)
      }}
      onReset={async () => {
        if (!supabase) return
        setDemoSaving(true)
        await supabase.from('company_template_defaults').delete().eq('company_id', company.id).eq('template_id', editingDemo)
        setDemoSaving(false)
        setTemplateDefaults(prev => { const next = { ...prev }; delete next[editingDemo]; return next })
        setEditingDemo(null)
      }}
      onClose={() => setEditingDemo(null)}
      onExtractPdf={callExtract}
    />}
    {(pdfResult !== null || pdfError) && <div className="ai-extract-overlay" role="presentation" onMouseDown={e=>{if(e.target===e.currentTarget){setPdfResult(null);setPdfError('')}}}><section className="ai-extract-dialog" role="dialog" aria-modal="true"><header><span className="ai-extract-badge">AI</span><h2>Extracted Details</h2><button className="dialog-close" onClick={()=>{setPdfResult(null);setPdfError('')}} aria-label="Close">×</button></header>{pdfError?<p className="workspace-alert">{pdfError}</p>:<><div className="ai-extract-fields">{([
      ...(pdfResult?.brideFirst
        ? [['bride', 'Bride', pdfResult?.bride, pdfResult?.brideFullName], ['groom', 'Groom', pdfResult?.groom, pdfResult?.groomFullName], ['brideFamily', 'Bride\'s family', pdfResult?.brideFamily, pdfResult?.brideFamilyFull], ['groomFamily', 'Groom\'s family', pdfResult?.groomFamily, pdfResult?.groomFamilyFull]]
        : [['groom', 'Groom', pdfResult?.groom, pdfResult?.groomFullName], ['bride', 'Bride', pdfResult?.bride, pdfResult?.brideFullName], ['groomFamily', 'Groom\'s family', pdfResult?.groomFamily, pdfResult?.groomFamilyFull], ['brideFamily', 'Bride\'s family', pdfResult?.brideFamily, pdfResult?.brideFamilyFull]]),
      ['date', 'Date', pdfResult?.date, undefined],
      ['time', 'Time', pdfResult?.time, undefined],
      ['venue', 'Venue', pdfResult?.venue, undefined],
      ['address', 'Address', pdfResult?.address, undefined],
      ['message', 'Message', pdfResult?.message, pdfResult?.messageFull],
      ['dressCode', 'Dress code', pdfResult?.dressCode, undefined],
    ] as [string, string, string | undefined, string | undefined][]).filter(([,,v]) => v?.trim()).map(([key, label, short, full]) => { const hasFull = full?.trim() && full !== short; const isFull = pdfUseFull.has(key); const value = hasFull && isFull ? full : short; return <div key={key} className="ai-field"><span className="ai-field-label">{label}{hasFull&&<button type="button" className="ai-field-toggle" onClick={()=>setPdfUseFull(prev=>{const next=new Set(prev);next.has(key)?next.delete(key):next.add(key);return next})}>{isFull?'Short':'Full'}</button>}</span><span className="ai-field-value" contentEditable suppressContentEditableWarning onBlur={e=>{const text=e.currentTarget.textContent||'';setPdfResult(prev=>prev?{...prev,[key]:text}:prev)}}>{value}</span></div>})}
      {pdfResult?.events && pdfResult.events.length > 0 && <><div className="ai-field-divider">Additional Events</div>{pdfResult.events.map((ev, i) => <div key={i} className="ai-event-card">{([['title','Event', ev.title], ['date','Date', ev.date], ['time','Time', ev.time], ['venue','Venue', ev.venue], ['address','Address', ev.address]] as [string, string, string | undefined][]).filter(([,,v]) => v?.trim()).map(([evKey, l, v]) => <div key={l} className="ai-field"><span className="ai-field-label">{l}</span><span className="ai-field-value" contentEditable suppressContentEditableWarning onBlur={e=>{const text=e.currentTarget.textContent||'';setPdfResult(prev=>{if(!prev?.events)return prev;const events=[...prev.events];events[i]={...events[i],[evKey]:text};return{...prev,events}})}}>{v}</span></div>)}</div>)}</>}
    </div><footer className="ai-extract-footer"><button type="button" className="ai-fill-form-btn" onClick={()=>{if(!pdfResult)return;const full=pdfUseFull;const pick=(key:string,short?:string,long?:string)=>(full.has(key)&&long?.trim()?long:short)||'';setDetails(prev=>({...prev,groom:pick('groom',pdfResult.groom,pdfResult.groomFullName),bride:pick('bride',pdfResult.bride,pdfResult.brideFullName),groomFamily:pick('groomFamily',pdfResult.groomFamily,pdfResult.groomFamilyFull),brideFamily:pick('brideFamily',pdfResult.brideFamily,pdfResult.brideFamilyFull),brideFirst:pdfResult.brideFirst===true,date:pdfResult.date||'',time:pdfResult.time||'',venue:pdfResult.venue||'',address:pdfResult.address||'',map:'',message:pick('message',pdfResult.message,pdfResult.messageFull),dressCode:pdfResult.dressCode||'',giftNote:'',music:'',musicStart:undefined,musicEnd:undefined,gallery:'',events:[]}));setPdfBrideFirst(pdfResult.brideFirst===true);setWeddingEventTitle('Wedding');setPhoneNumber(prev=>prev||'');setExtraEvents(pdfResult.events?.length?pdfResult.events.map(ev=>({title:ev.title||'',date:ev.date||'',time:ev.time||'',venue:ev.venue||'',address:ev.address||'',map:''})):[]);setPdfPrefilled(true);setReview(true);setPdfResult(null);setPdfError('')}}><span className="ai-extract-badge">AI</span> Fill form with these details</button></footer></>}</section></div>}
  </main></CardTemplateContext.Provider>
}

type DemoEvent = { title: string; date: string; time: string; venue: string; address: string }
function TemplateDemoEditor({ templateId, templateName, companyId: _companyId, existing, saving, onSave, onReset, onClose, onExtractPdf }: { templateId: number; templateName: string; companyId: number; existing: Record<string, unknown> | null; saving: boolean; onSave: (data: Record<string, unknown>) => Promise<void>; onReset: () => Promise<void>; onClose: () => void; onExtractPdf: (base64: string, filename: string, mimeType: string) => Promise<{ groom?: string; groomFullName?: string; bride?: string; brideFullName?: string; groomFamily?: string; brideFamily?: string; date?: string; time?: string; venue?: string; address?: string; message?: string; dressCode?: string; events?: { title?: string; date?: string; time?: string; venue?: string; address?: string }[] }> }) {
  const example = invitationExample(templateId)
  const pdfRef = useRef<HTMLInputElement>(null)
  const [pdfExtracting, setPdfExtracting] = useState(false)
  const [pdfError, setPdfError] = useState('')
  const [groom, setGroom] = useState((existing?.groom as string) || '')
  const [bride, setBride] = useState((existing?.bride as string) || '')
  const [groomFamily, setGroomFamily] = useState((existing?.groomFamily as string) || '')
  const [brideFamily, setBrideFamily] = useState((existing?.brideFamily as string) || '')
  const [venue, setVenue] = useState((existing?.venue as string) || '')
  const [address, setAddress] = useState((existing?.address as string) || '')
  const [message, setMessage] = useState((existing?.message as string) || '')
  const [date, setDate] = useState((existing?.date as string) || '')
  const [time, setTime] = useState((existing?.time as string) || '')
  const [dressCode, setDressCode] = useState((existing?.dressCode as string) || '')
  const [giftNote, setGiftNote] = useState((existing?.giftNote as string) || '')
  const [events, setEvents] = useState<DemoEvent[]>(() => {
    const saved = existing?.events as DemoEvent[] | undefined
    return saved?.length ? saved : []
  })
  async function handlePdf(file: File) {
    if (pdfExtracting) return
    setPdfExtracting(true); setPdfError('')
    try {
      const mimeType = invitationUploadMimeType(file)
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => { const r = reader.result as string; resolve(r.split(',')[1]) }
        reader.onerror = () => reject(new Error('Failed to read file.'))
        reader.readAsDataURL(file)
      })
      const result = await onExtractPdf(base64, file.name, mimeType)
      if (result.groom) setGroom(result.groom)
      if (result.bride) setBride(result.bride)
      if (result.groomFamily) setGroomFamily(result.groomFamily)
      if (result.brideFamily) setBrideFamily(result.brideFamily)
      if (result.venue) setVenue(result.venue)
      if (result.address) setAddress(result.address)
      if (result.date) setDate(result.date)
      if (result.time) setTime(result.time)
      if (result.message) setMessage(result.message)
      if (result.dressCode) setDressCode(result.dressCode)
      if (result.events?.length) setEvents(result.events.map(ev => ({ title: ev.title || '', date: ev.date || '', time: ev.time || '', venue: ev.venue || '', address: ev.address || '' })))
    } catch (err) { setPdfError(err instanceof Error ? err.message : 'Failed to extract from the invitation.') }
    finally { setPdfExtracting(false) }
  }
  function handleSave() {
    const data: Record<string, unknown> = {}
    if (groom.trim()) data.groom = groom.trim()
    if (bride.trim()) data.bride = bride.trim()
    if (groomFamily.trim()) data.groomFamily = groomFamily.trim()
    if (brideFamily.trim()) data.brideFamily = brideFamily.trim()
    if (venue.trim()) data.venue = venue.trim()
    if (address.trim()) data.address = address.trim()
    if (message.trim()) data.message = message.trim()
    if (date.trim()) data.date = date.trim()
    if (time.trim()) data.time = time.trim()
    if (dressCode.trim()) data.dressCode = dressCode.trim()
    if (giftNote.trim()) data.giftNote = giftNote.trim()
    const validEvents = events.filter(e => e.title.trim())
    if (validEvents.length) data.events = validEvents
    void onSave(data)
  }
  function updateEvent(index: number, patch: Partial<DemoEvent>) { setEvents(prev => prev.map((e, i) => i === index ? { ...e, ...patch } : e)) }
  return <div className="demo-editor-overlay" role="presentation" onMouseDown={e => { if (e.target === e.currentTarget) onClose() }}>
    <section className="demo-editor-dialog" role="dialog" aria-modal="true" aria-labelledby="demo-editor-title">
      <button className="dialog-close" onClick={onClose} aria-label="Close">×</button>
      <div className="demo-editor-header">
        <div><span className="workspace-kicker">CUSTOMIZE DEMO DATA</span><h2 id="demo-editor-title">{templateName}</h2></div>
        <input ref={pdfRef} type="file" accept={invitationUploadAccept} hidden onChange={e => { const f = e.target.files?.[0]; if (f) handlePdf(f); e.target.value = '' }}/>
        <button type="button" className="demo-editor-pdf" disabled={pdfExtracting} onClick={() => pdfRef.current?.click()}>{pdfExtracting ? 'Extracting…' : 'Upload PDF or image'}</button>
      </div>
      {pdfError && <p className="workspace-alert" role="alert">{pdfError}</p>}
      <p className="demo-editor-hint">Set custom names and details for your store's template preview. Empty fields fall back to the standard example.</p>
      <div className="demo-editor-fields">
        <label>Groom's name<textarea rows={2} value={groom} onChange={e => setGroom(e.target.value)} placeholder={example?.groom || 'Groom'}/></label>
        <label>Bride's name<textarea rows={2} value={bride} onChange={e => setBride(e.target.value)} placeholder={example?.bride || 'Bride'}/></label>
        <label>Groom's family<textarea rows={3} value={groomFamily} onChange={e => setGroomFamily(e.target.value)} placeholder={example?.groomFamily || "Groom's family"}/></label>
        <label>Bride's family<textarea rows={3} value={brideFamily} onChange={e => setBrideFamily(e.target.value)} placeholder={example?.brideFamily || "Bride's family"}/></label>
        <label>Venue<textarea rows={2} value={venue} onChange={e => setVenue(e.target.value)} placeholder={example?.venue || 'Venue'}/></label>
        <label>Address<textarea rows={2} value={address} onChange={e => setAddress(e.target.value)} placeholder={example?.address || 'Address'}/></label>
        <label>Wedding date<input type="date" value={date} onChange={e => setDate(e.target.value)}/></label>
        <label>Ceremony time<input type="time" value={time} onChange={e => setTime(e.target.value)}/></label>
        <label>Dress code<textarea rows={2} value={dressCode} onChange={e => setDressCode(e.target.value)} placeholder={example?.dressCode || 'Dress code'}/></label>
        <label className="demo-editor-full">Welcome message<textarea rows={4} value={message} onChange={e => setMessage(e.target.value)} placeholder={example?.message || 'Welcome message'}/></label>
        <label className="demo-editor-full">Short note<textarea rows={3} value={giftNote} onChange={e => setGiftNote(e.target.value)} placeholder={example?.giftNote || 'Short note'}/></label>
      </div>
      <div className="demo-celebrations">
        <div className="demo-celebrations-heading"><h3>Celebrations</h3><button type="button" className="secondary-action" disabled={events.length >= 9} onClick={() => setEvents(prev => [...prev, { title: '', date: date || '', time: '', venue: '', address: '' }])}>+ Add celebration</button></div>
        {events.map((ev, i) => <div className="demo-celebration-row" key={i}>
          <div className="demo-celebration-head"><small>Celebration {i + 1}</small><button type="button" className="text-action" onClick={() => setEvents(prev => prev.filter((_, j) => j !== i))}>Remove</button></div>
          <div className="demo-editor-fields">
            <label>Event name<textarea rows={2} value={ev.title} onChange={e => updateEvent(i, { title: e.target.value })} placeholder="e.g. Mehendi, Sangeet"/></label>
            <label>Date<input type="date" value={ev.date} onChange={e => updateEvent(i, { date: e.target.value })}/></label>
            <label>Time<input type="time" value={ev.time} onChange={e => updateEvent(i, { time: e.target.value })}/></label>
            <label>Venue<textarea rows={2} value={ev.venue} onChange={e => updateEvent(i, { venue: e.target.value })} placeholder="Venue"/></label>
            <label className="demo-editor-full">Address<textarea rows={2} value={ev.address} onChange={e => updateEvent(i, { address: e.target.value })} placeholder="Address"/></label>
          </div>
        </div>)}
        {events.length === 0 && <p className="demo-editor-hint">No additional celebrations. Click "+ Add celebration" to include mehendi, sangeet, reception, etc.</p>}
      </div>
      <div className="demo-editor-actions">
        <button type="button" className="primary-action" disabled={saving} onClick={handleSave}>{saving ? 'Saving…' : 'Save Demo Data'}</button>
        {existing && <button type="button" className="secondary-action" disabled={saving} onClick={() => void onReset()}>Reset to Default</button>}
        <button type="button" className="text-action" onClick={onClose}>Cancel</button>
      </div>
    </section>
  </div>
}

function Field({ label, value, onChange, type = 'text', required = false }: { label: string; value: string; onChange: (value: string) => void; type?: string; required?: boolean }) {
  const {template,showCoupleIllustrations,pdfBrideFirst,onIllustrationsChange} = useContext(CardTemplateContext)
  const field = ({ "Groom's name":'groom', "Bride's name":'bride', 'Wedding celebration name': 'title', 'Event name': 'title', Venue: 'venue', Address: 'address' } as Record<string, string>)[label]
  const maxLength = nameTextLimit(template,field) ?? cardTextLimit(template, field) ?? (type === 'url' ? 2000 : 600)
  const multiline = Boolean(field && !['groom', 'bride'].includes(field)) || ["Groom's family", "Bride's family", 'Dress code', 'Gift note', 'Notes'].includes(label)
  const coupleFieldOrder: Record<string, number> = pdfBrideFirst ? {"Bride's name":1,"Groom's name":2,"Bride's family":3,"Groom's family":4} : {}
  return <><label style={coupleFieldOrder[label] ? {order:coupleFieldOrder[label]} : undefined}>{label}{required && <i> *</i>}{multiline && type==='text' ? <textarea rows={2} value={value} onChange={event => onChange(event.target.value)} maxLength={maxLength} required={required} style={{resize:'vertical'}}/> : <input type={type} value={value} onChange={event => onChange(event.target.value)} maxLength={maxLength} required={required}/>}</label>{[2,3,5,6,7].includes(template)&&label==="Bride's family"&&<label style={{display:'flex',alignItems:'center',gap:12,gridColumn:'1 / -1',order:-1}}><input type="checkbox" checked={showCoupleIllustrations} onChange={event=>onIllustrationsChange(event.target.checked)} style={{width:20,height:20,minHeight:0,margin:0,padding:0}}/>Show Bride &amp; Groom Illustrations</label>}</>
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
function TemplateSettingsPanel({companyName,templates,settings,defaults:_defaults,error,canSave,onChange,onSaveAll,onCustomizeDemo}:{companyName:string;templates:Template[];settings:Record<number,TemplateSettings>;defaults:Record<number,Record<string,unknown>>;error:string;canSave:boolean;onChange:(id:number,patch:Partial<TemplateSettings>)=>void;onSaveAll:()=>Promise<void>;onCustomizeDemo:(id:number)=>void}) {
  const [saved,setSaved]=useState(false)
  const [saving,setSaving]=useState(false)
  function handleChange(id:number,patch:Partial<TemplateSettings>){setSaved(false);onChange(id,patch)}
  async function handleSaveAll(){setSaving(true);await onSaveAll();setSaving(false);setSaved(true)}
  return <><div className="client-settings-intro"><div><span className="workspace-kicker">YOUR TEMPLATE CATALOG</span><h2>Configure your designs</h2><p>Set your price, optional discount, and premium status for each template. These settings belong to {companyName}.</p></div><button type="button" className={`primary-action client-settings-save${saved?' is-saved':''}`} disabled={!canSave||saving} onClick={handleSaveAll}>{saving?'Saving…':saved?'Saved ✓':'Save changes'}</button></div>{error&&<p className="workspace-alert" role="alert">{error}</p>}<div className="client-template-settings">{templates.map(template=>{const setting=settings[template.id]||{price:0,sale_type:'none' as const,sale_value:0,is_premium:false};return <article className="client-template-setting" key={template.id}><div className="client-template-setting-art"><span className="setting-art-wrap"><img src={TEMPLATE_THUMBNAIL_OVERRIDES[template.id] ?? template.thumbnail_url} alt={`${template.name} invitation cover`}/><button type="button" className="setting-demo-overlay" onClick={()=>onCustomizeDemo(template.id)}>✎ Customize</button></span><TemplatePrice setting={setting}/></div><div className="client-template-setting-content"><h3 style={{fontSize:template.name.length>20?'12px':template.name.length>14?'13px':'15px'}}>{template.name}</h3><div className="client-template-setting-fields"><label>Price (INR)<span className="client-settings-input-wrap"><i aria-hidden="true">₹</i><input type="number" min="0" step="1" value={setting.price||''} onChange={event=>handleChange(template.id,{price:event.target.value===''?0:Number(event.target.value)})}/></span></label><label>Sale type<select value={setting.sale_type} onChange={event=>handleChange(template.id,{sale_type:event.target.value as TemplateSettings['sale_type'],sale_value:event.target.value==='none'?0:setting.sale_value})}><option value="none">No sale</option><option value="percentage">Percentage discount</option><option value="fixed">Fixed discount</option></select></label>{setting.sale_type!=='none'&&<label className="client-discount-setting">{setting.sale_type==='percentage'?'Discount percentage':'Discount amount (INR)'}<span className="client-settings-input-wrap">{setting.sale_type==='fixed'&&<i aria-hidden="true">₹</i>}<input type="number" min="0" max={setting.sale_type==='percentage'?100:setting.price} step={setting.sale_type==='percentage'?'0.1':'1'} value={setting.sale_value||''} onChange={event=>handleChange(template.id,{sale_value:event.target.value===''?0:Number(event.target.value)})}/>{setting.sale_type==='percentage'&&<i aria-hidden="true">%</i>}</span></label>}</div><label className="client-premium-setting"><input type="checkbox" checked={setting.is_premium} onChange={event=>handleChange(template.id,{is_premium:event.target.checked})}/><span className="client-premium-switch" aria-hidden="true"/><span className="client-premium-copy"><b>Premium template</b></span></label></div></article>})}</div></>
}
function OrderTable({ orders, onSelect, onEdit, onCopy, onCreate, variant = 'orders' }: { orders: Order[]; onSelect?: (order:Order)=>void; onEdit?: (order:Order)=>void; onCopy?: (order:Order)=>void; onCreate?:()=>void; variant?: 'orders'|'overview' }) {
  return <div className={`table-wrap ${orders.length===0?'orders-empty-table':''}`}>
    <table className="orders-table"><thead><tr>{variant!=='overview'&&<th>Create copy</th>}<th>Order</th><th>Couple</th><th>Template</th><th>Contact</th><th>Status</th><th>Price</th>{variant==='overview'?<><th>Date</th><th>Actions</th></>:<><th>Details</th><th>Edit</th><th>Link</th></>}</tr></thead>
      <tbody>{orders.map(order => {
        const expired=Boolean(order.expires_at&&new Date(order.expires_at)<=new Date())
        const active=Boolean(order.published_url&&!expired)
        return <tr key={order.id}>
          {variant!=='overview'&&<td>{onCopy&&<button type="button" className="order-action-secondary" onClick={()=>onCopy(order)} aria-label={`Create copy of order #${order.id}`}>Create copy</button>}</td>}
          <td>#{variant==='overview'?`ORD-${String(order.id).padStart(4,'0')}`:order.id}</td>
          <td>{order.groom_name} & {order.bride_name}</td>
          <td>{designs.find(d => d.id === order.form_data.template)?.name || 'Invitation design'}</td>
          <td>{order.phone_number?.replace(/^\+91\s*/, '+91 ')||'—'}</td>
          <td><span className={`status-pill status-${order.status.toLowerCase()}`}>{variant==='overview'?({CREATED:'Pending',IN_PROGRESS:'In Progress',READY:'Completed',REJECTED:'Needs changes'}[order.status]||order.status):(statusTitle[order.status] || order.status)}</span>{order.rejection_reason && <small className="rejection-note">{order.rejection_reason}</small>}</td>
          <td>{typeof order.price==='number'?new Intl.NumberFormat('en-IN',{style:'currency',currency:'INR',maximumFractionDigits:0}).format(order.price):'—'}</td>{variant!=='overview'&&<td>{onSelect&&<button className="order-action-secondary" onClick={()=>onSelect(order)}>Details</button>}</td>}
          {variant!=='overview'&&<td>{onEdit&&<button className="order-action-secondary" onClick={()=>onEdit(order)}><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.85 0 0 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>Edit</button>}</td>}
          {variant==='overview'&&<td>{new Date(order.created_at).toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'numeric'})}</td>}
          <td className="order-actions">{variant==='overview'?<>{active?<a className="overview-view-link" href={order.published_url!} target="_blank" rel="noreferrer">↗ View</a>:onSelect&&<button className="overview-view-link" onClick={()=>onSelect(order)}>▷ Preview</button>}{active&&<button className="overview-more-action" aria-label="Copy invitation link" onClick={()=>void navigator.clipboard.writeText(order.published_url!)}>⋮</button>}</>:<>{active&&<a className="order-action-primary" href={order.published_url!} target="_blank" rel="noreferrer"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>Open</a>}{!active&&!expired&&<span className="quiet">Not published</span>}{!active&&expired&&<span className="quiet">Expired</span>}</>}</td>
        </tr>
      })}</tbody>
    </table>
    {orders.length === 0 && <div className="empty-state"><svg viewBox="0 0 240 150" role="img" aria-label="Wedding invitation illustration"><path d="M73 41 160 25l27 91-99 14z" fill="#faf7f1" stroke="#e8dfd2" strokeWidth="3"/><path d="m65 50 88-17 28 85-98 13z" fill="#fffdf9" stroke="#e9e1d5" strokeWidth="3"/><path d="M111 80c-14-13-29 7 0 24 29-17 14-37 0-24Z" fill="none" stroke="#b48a4c" strokeWidth="4"/><path d="M110 66v-9m-14 17-6-5m34 5 6-5" stroke="#c29b60" strokeWidth="3" strokeLinecap="round"/><path d="M55 124c-20-7-29-22-33-39m164 39c20-7 29-22 33-39M40 104l-13-3m26-3-1-13m150 19 13-3m-26-3 1-13" fill="none" stroke="#e9e1d5" strokeWidth="3" strokeLinecap="round"/></svg><h2>{onCreate?'No orders yet':'No matching orders'}</h2><p>{onCreate?'Your submitted invitation orders will appear here.':'Try changing your search or filters.'}</p>{onCreate&&<button type="button" className="orders-create-first" onClick={onCreate}><span aria-hidden="true">＋</span> Create Your First Order</button>}</div>}
  </div>
}
