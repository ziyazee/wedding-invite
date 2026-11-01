import { useEffect, useMemo, useState } from 'react'
import { supabase } from '../lib/supabase'
import './AdminCompanies.css'

const ORDER_PRICE = 499
type Company = {
  company_id: number
  company_name: string
  contact_name: string | null
  email: string | null
  phone: string | null
  logo_path: string | null
  onboarded_at: string
  is_active: boolean
  total_orders: number
  month_orders: number
  pdf_uploads: number
  last_activity_at: string | null
}
type Activity = { id: number; kind: 'order' | 'pdf'; title: string; detail: string; created_at: string }

function indiaMonthRange() {
  const parts = new Intl.DateTimeFormat('en', { timeZone: 'Asia/Kolkata', year: 'numeric', month: '2-digit' }).formatToParts(new Date())
  const year = Number(parts.find(part => part.type === 'year')?.value)
  const month = Number(parts.find(part => part.type === 'month')?.value)
  const istOffsetMs = 5.5 * 60 * 60 * 1000
  return {
    start: new Date(Date.UTC(year, month - 1, 1) - istOffsetMs).toISOString(),
    end: new Date(Date.UTC(year, month, 1) - istOffsetMs).toISOString(),
  }
}

const dateLabel = (value: string) => new Intl.DateTimeFormat('en-IN', { day: '2-digit', month: 'short', year: 'numeric', timeZone: 'Asia/Kolkata' }).format(new Date(value))
const dateTimeLabel = (value: string) => new Intl.DateTimeFormat('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Kolkata' }).format(new Date(value))
const money = (value: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value)

export default function AdminCompaniesPanel() {
  const [companies, setCompanies] = useState<Company[]>([])
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [activities, setActivities] = useState<Activity[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [activityLoading, setActivityLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    async function load() {
      if (!supabase) { setError('Connect Supabase to load company activity.'); setLoading(false); return }
      const range = indiaMonthRange()
      const { data, error: loadError } = await supabase.rpc('admin_company_activity', { p_month_start: range.start, p_month_end: range.end })
      if (cancelled) return
      if (loadError) setError(loadError.message)
      else {
        const items = (data || []) as Company[]
        setCompanies(items)
        setSelectedId(current => current && items.some(item => item.company_id === current) ? current : items[0]?.company_id ?? null)
      }
      setLoading(false)
    }
    void load()
    return () => { cancelled = true }
  }, [])

  const selected = companies.find(company => company.company_id === selectedId) || null
  const visible = useMemo(() => companies.filter(company => `${company.company_name} ${company.contact_name || ''} ${company.email || ''}`.toLowerCase().includes(search.trim().toLowerCase())), [companies, search])

  useEffect(() => {
    let cancelled = false
    async function loadActivity() {
      if (!supabase || !selected) { setActivities([]); return }
      setActivityLoading(true)
      const [ordersResult, pdfResult] = await Promise.all([
        supabase.from('orders').select('id,groom_name,bride_name,status,created_at').eq('company_id', selected.company_id).order('created_at', { ascending: false }).limit(8),
        supabase.from('company_pdf_uploads').select('id,filename,created_at').eq('company_id', selected.company_id).order('created_at', { ascending: false }).limit(8),
      ])
      if (cancelled) return
      if (ordersResult.error || pdfResult.error) setError(ordersResult.error?.message || pdfResult.error?.message || 'Unable to load recent company activity.')
      const orderEvents: Activity[] = ((ordersResult.data || []) as { id: number; groom_name: string; bride_name: string; status: string; created_at: string }[]).map(order => ({ id: order.id, kind: 'order', title: `${order.groom_name} & ${order.bride_name}`, detail: `Order · ${order.status.replaceAll('_', ' ').toLowerCase()}`, created_at: order.created_at }))
      const pdfEvents: Activity[] = ((pdfResult.data || []) as { id: number; filename: string; created_at: string }[]).map(upload => ({ id: upload.id, kind: 'pdf', title: upload.filename, detail: 'Invitation PDF uploaded', created_at: upload.created_at }))
      setActivities([...orderEvents, ...pdfEvents].sort((a, b) => b.created_at.localeCompare(a.created_at)).slice(0, 8))
      setActivityLoading(false)
    }
    void loadActivity()
    return () => { cancelled = true }
  }, [selected?.company_id])

  if (loading) return <div className="admin-companies-state">Loading client companies…</div>
  return <div className="admin-companies">
    <header className="admin-companies-heading"><div><span className="workspace-kicker">CLIENT NETWORK</span><h2>Companies</h2><p>Active clients, order volume, and recent activity.</p></div><span className="admin-company-count"><strong>{companies.length}</strong> active {companies.length === 1 ? 'client' : 'clients'}</span></header>
    {error && <p className="workspace-alert" role="alert">{error}</p>}
    <div className="admin-company-layout">
      <section className="admin-company-list" aria-label="Active companies">
        <div className="admin-company-search"><input value={search} onChange={event => setSearch(event.target.value)} placeholder="Search companies" aria-label="Search companies"/><span>{visible.length} shown</span></div>
        <div className="admin-company-cards">{visible.map(company => <button type="button" key={company.company_id} className={`admin-company-card${company.company_id === selectedId ? ' selected' : ''}`} onClick={() => setSelectedId(company.company_id)}>
          <span className="admin-company-logo">{company.logo_path ? <img src={company.logo_path} alt={`${company.company_name} logo`} onError={event => { event.currentTarget.style.display = 'none' }}/> : <span>{company.company_name.slice(0, 1).toUpperCase()}</span>}</span>
          <strong>{company.company_name}</strong><small>{company.contact_name || company.email || 'Active client'}</small>
          <span className="admin-company-card-meta">{company.total_orders} {company.total_orders === 1 ? 'order' : 'orders'} <i>·</i> Since {dateLabel(company.onboarded_at)}</span>
        </button>)}</div>
        {visible.length === 0 && <p className="admin-companies-empty">No companies match that search.</p>}
      </section>
      {selected ? <section className="admin-company-detail" aria-label={`${selected.company_name} details`}>
        <header className="admin-company-profile"><span className="admin-company-logo large">{selected.logo_path ? <img src={selected.logo_path} alt={`${selected.company_name} logo`} onError={event => { event.currentTarget.style.display = 'none' }}/> : <span>{selected.company_name.slice(0, 1).toUpperCase()}</span>}</span><div><span className="admin-active-badge"><i/> Active client</span><h3>{selected.company_name}</h3><p>{selected.contact_name || 'Client'}{selected.email ? ` · ${selected.email}` : ''}</p></div></header>
        <div className="admin-company-facts"><div><span>Onboarded</span><strong>{dateLabel(selected.onboarded_at)}</strong></div>{selected.phone && <div><span>Phone</span><strong>{selected.phone}</strong></div>}</div>
        <div className="admin-company-metrics">
          <article><span>Orders this month</span><strong>{selected.month_orders}</strong><small>{money(selected.month_orders * ORDER_PRICE)} revenue</small></article>
          <article><span>Total orders</span><strong>{selected.total_orders}</strong><small>{money(selected.total_orders * ORDER_PRICE)} total revenue</small></article>
          <article><span>PDF uploads</span><strong>{selected.pdf_uploads}</strong><small>Tracked uploads</small></article>
        </div>
        <section className="admin-company-activity"><header><div><span className="workspace-kicker">COMPANY ACTIVITY</span><h4>Recent activity</h4></div>{selected.last_activity_at && <small>Last active {dateTimeLabel(selected.last_activity_at)}</small>}</header>
          {activityLoading ? <p className="admin-activity-empty">Loading recent activity…</p> : activities.length ? <ul>{activities.map(activity => <li key={`${activity.kind}-${activity.id}`}><span className={`admin-activity-icon ${activity.kind}`}>{activity.kind === 'pdf' ? 'PDF' : '↗'}</span><span><strong>{activity.title}</strong><small>{activity.detail}</small></span><time>{dateTimeLabel(activity.created_at)}</time></li>)}</ul> : <p className="admin-activity-empty">No orders or PDF uploads recorded yet.</p>}
        </section>
      </section> : <div className="admin-company-detail admin-company-no-selection">Select a company to see its details.</div>}
    </div>
    <p className="admin-company-revenue-note">Revenue estimate is calculated at the current fixed rate of ₹499 per submitted order. PDF upload activity is tracked from the date the activity log is enabled.</p>
  </div>
}
