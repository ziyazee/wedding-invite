import { useEffect, useMemo, useState } from 'react'
import { supabase } from '../lib/supabase'
<<<<<<< Updated upstream:src/admin/AdminCompaniesPanel.tsx
import './styles/AdminCompanies.css'
=======
import { designs } from '../invitations/model'
import type { InvitationData } from '../invitations/model'
import './AdminCompanies.css'
>>>>>>> Stashed changes:src/pages/AdminCompaniesPanel.tsx
import StoreOnboarding from './StoreOnboarding'

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

type CompanyOrder = {
  id: number
  groom_name: string
  bride_name: string
  template_code: string
  form_data: InvitationData
  status: string
  created_at: string
  published_url: string | null
  price: number | null
}

const STATUS_LABEL: Record<string, string> = { CREATED: 'New', IN_PROGRESS: 'In progress', READY: 'Published', REJECTED: 'Rejected' }

function indiaMonthRange() {
  const parts = new Intl.DateTimeFormat('en', { timeZone: 'Asia/Kolkata', year: 'numeric', month: '2-digit' }).formatToParts(new Date())
  const year = Number(parts.find(p => p.type === 'year')?.value)
  const month = Number(parts.find(p => p.type === 'month')?.value)
  const istOffsetMs = 5.5 * 60 * 60 * 1000
  return {
    start: new Date(Date.UTC(year, month - 1, 1) - istOffsetMs).toISOString(),
    end: new Date(Date.UTC(year, month, 1) - istOffsetMs).toISOString(),
  }
}

const dateLabel = (v: string) =>
  new Intl.DateTimeFormat('en-IN', { day: '2-digit', month: 'short', year: 'numeric', timeZone: 'Asia/Kolkata' }).format(new Date(v))

const money = (v: number) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(v)

function CompanyLogo({ company, large }: { company: Pick<Company, 'company_name' | 'logo_path'>; large?: boolean }) {
  return (
    <span className={`admin-company-logo${large ? ' large' : ''}`}>
      {company.logo_path
        ? <img src={company.logo_path} alt={`${company.company_name} logo`} onError={e => { e.currentTarget.style.display = 'none' }} />
        : <span>{company.company_name.slice(0, 1).toUpperCase()}</span>}
    </span>
  )
}

export default function AdminCompaniesPanel({ onTitleChange }: { onTitleChange?: (title: string | null) => void }) {
  const [revision, setRevision] = useState(0)
  const [selected, setSelected] = useState<Company | null>(null)

  function handleSelect(company: Company) {
    setSelected(company)
    onTitleChange?.(company.company_name)
  }

  function handleBack() {
    setSelected(null)
    onTitleChange?.(null)
  }

  if (selected) {
    return <CompanyDetailPage company={selected} onBack={handleBack} />
  }

  return (
    <>
      <StoreOnboarding onChange={() => setRevision(v => v + 1)} />
      <CompanyListSection key={revision} onSelect={handleSelect} />
    </>
  )
}

function CompanyListSection({ onSelect }: { onSelect: (company: Company) => void }) {
  const [companies, setCompanies] = useState<Company[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    async function load() {
      if (!supabase) { setError('Connect Supabase to load companies.'); setLoading(false); return }
      const range = indiaMonthRange()
      const { data, error: err } = await supabase.rpc('admin_company_activity', { p_month_start: range.start, p_month_end: range.end })
      if (cancelled) return
      if (err) setError(err.message)
      else setCompanies((data || []) as Company[])
      setLoading(false)
    }
    void load()
    return () => { cancelled = true }
  }, [])

  const visible = useMemo(
    () => companies.filter(c =>
      `${c.company_name} ${c.contact_name || ''} ${c.email || ''}`.toLowerCase().includes(search.trim().toLowerCase())
    ),
    [companies, search]
  )

  if (loading) return <div className="admin-companies-state">Loading companies…</div>

  return (
    <div className="admin-companies">
      <header className="admin-companies-heading">
        <div>
          <span className="workspace-kicker">CLIENT NETWORK</span>
          <h2>Companies</h2>
          <p>Active clients, order volume, and monthly activity.</p>
        </div>
        <span className="admin-company-count">
          <strong>{companies.length}</strong> active {companies.length === 1 ? 'client' : 'clients'}
        </span>
      </header>
      {error && <p className="workspace-alert" role="alert">{error}</p>}
      <div className="admin-company-search">
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search companies…" aria-label="Search companies" />
        <span>{visible.length} shown</span>
      </div>
      <div className="admin-company-cards">
        {visible.map(company => (
          <button type="button" key={company.company_id} className="admin-company-card" onClick={() => onSelect(company)}>
            <CompanyLogo company={company} />
            <strong>{company.company_name}</strong>
            <small>{company.contact_name || company.email || 'Active client'}</small>
            <div className="admin-company-card-numbers">
              <span><b>{company.total_orders}</b> {company.total_orders === 1 ? 'order' : 'orders'}</span>
              <span>{money(company.total_orders * ORDER_PRICE)}</span>
            </div>
            {company.month_orders > 0 && (
              <span className="admin-company-card-month">{company.month_orders} this month</span>
            )}
          </button>
        ))}
        {visible.length === 0 && !error && <p className="admin-companies-empty">No companies match that search.</p>}
      </div>
    </div>
  )
}

function CompanyDetailPage({ company, onBack }: { company: Company; onBack: () => void }) {
  const [orders, setOrders] = useState<CompanyOrder[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    async function load() {
      if (!supabase) { setError('Connect Supabase to load orders.'); setLoading(false); return }
      const { data, error: err } = await supabase
        .from('orders')
        .select('id, groom_name, bride_name, template_code, form_data, status, created_at, published_url, price')
        .eq('company_id', company.company_id)
        .order('created_at', { ascending: false })
      if (cancelled) return
      if (err) setError(err.message)
      else setOrders((data || []) as CompanyOrder[])
      setLoading(false)
    }
    void load()
    return () => { cancelled = true }
  }, [company.company_id])

  const totalRevenue = orders.length > 0
    ? orders.reduce((sum, o) => sum + (o.price ?? ORDER_PRICE), 0)
    : company.total_orders * ORDER_PRICE

  const monthRevenue = company.month_orders * ORDER_PRICE
  const avgRevenue = company.total_orders > 0 ? totalRevenue / company.total_orders : ORDER_PRICE

  const onboardedMonths = Math.max(1, Math.round(
    (Date.now() - new Date(company.onboarded_at).getTime()) / (30 * 24 * 60 * 60 * 1000)
  ))
  const avgPerMonth = company.total_orders / onboardedMonths
  const trend = company.month_orders >= avgPerMonth * 1.15 ? 'up'
    : company.month_orders < avgPerMonth * 0.75 && avgPerMonth > 0.5 ? 'down'
    : 'flat'

  return (
    <div className="company-detail-page">
      <div className="company-stat-row">
        <article className="company-stat-card stat-orders">
          <span>Total orders</span>
          <strong>{company.total_orders}</strong>
          <small>Since {dateLabel(company.onboarded_at)}</small>
        </article>
        <article className="company-stat-card stat-revenue">
          <span>Platform revenue</span>
          <strong>{money(totalRevenue)}</strong>
          <small>Avg {money(avgRevenue)} per order</small>
        </article>
        <article className="company-stat-card stat-month">
          <span>This month</span>
          <strong>{company.month_orders}</strong>
          <small className={`trend trend-${trend}`}>
            {trend === 'up' ? '↑ Above average' : trend === 'down' ? '↓ Below average' : '→ On track'} · {money(monthRevenue)}
          </small>
        </article>
        <article className="company-stat-card stat-uploads">
          <span>Invitation uploads</span>
          <strong>{company.pdf_uploads}</strong>
          <small>PDF uploads tracked</small>
        </article>
      </div>

      <div className="company-contact-strip">
        <span className="workspace-kicker">CONTACT & ACCOUNT</span>
        <div className="company-contact-grid">
          {company.email && (
            <div className="company-contact-item">
              <span>Email</span>
              <strong><a href={`mailto:${company.email}`}>{company.email}</a></strong>
            </div>
          )}
          {company.phone && (
            <div className="company-contact-item">
              <span>Phone</span>
              <strong>{company.phone}</strong>
            </div>
          )}
          <div className="company-contact-item">
            <span>Onboarded</span>
            <strong>{dateLabel(company.onboarded_at)}</strong>
          </div>
          {company.last_activity_at && (
            <div className="company-contact-item">
              <span>Last active</span>
              <strong>{dateLabel(company.last_activity_at)}</strong>
            </div>
          )}
        </div>
      </div>

      <section className="company-orders-section">
        <header className="company-orders-header">
          <span className="workspace-kicker">ORDER HISTORY</span>
          <h3>All orders {!loading && <span>({orders.length})</span>}</h3>
        </header>
        {error && <p className="workspace-alert" role="alert">{error}</p>}
        {loading ? (
          <p className="admin-companies-state">Loading orders…</p>
        ) : orders.length > 0 ? (
          <div className="table-wrap">
            <table className="orders-table">
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Couple</th>
                  <th>Template</th>
                  <th>Status</th>
                  <th>Submitted</th>
                  <th>Revenue</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(order => (
                  <tr key={order.id}>
                    <td>#{order.id}</td>
                    <td>{order.groom_name} & {order.bride_name}</td>
                    <td>{designs.find(d => d.id === order.form_data?.template)?.name || order.template_code}</td>
                    <td>
                      <span className={`status-pill status-${order.status.toLowerCase()}`}>
                        {STATUS_LABEL[order.status] || order.status}
                      </span>
                    </td>
                    <td>{new Date(order.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                    <td>{money(order.price ?? ORDER_PRICE)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="admin-companies-empty">No orders submitted yet.</p>
        )}
      </section>
    </div>
  )
}
