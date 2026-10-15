import { useCallback, useEffect, useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { designs, validateDetails } from '../invitations/model'
import type { Celebration, InvitationData } from '../invitations/model'
import { isSupabaseConfigured, supabase } from '../lib/supabase'
import { DashboardAccess, signOutToLogin } from './DashboardAccess'
import './Workspaces.css'

type Order = { id: number; groom_name: string; bride_name: string; status: string; created_at: string; form_data: InvitationData; published_path: string | null; published_url: string | null; published_at: string | null; expires_at: string | null; rejection_reason: string | null; template_code: string; phone_number: string }
type Template = { id: number; template_code: string; name: string; category: string; thumbnail_url: string; preview_url: string }
const initial: InvitationData = { template: 2, groom: '', bride: '', date: '', time: '17:00', offset: '+05:30', venue: '', address: '', map: '', message: 'With the blessings of our families, we invite you to celebrate the beginning of our forever.', groomFamily: '', brideFamily: '', dressCode: '', giftNote: '', music: '', gallery: '', events: [] }
const statusTitle: Record<string, string> = { CREATED: 'New', IN_PROGRESS: 'In progress', READY: 'Published', REJECTED: 'Needs changes' }

export default function ClientDashboard() {
  return <DashboardAccess role="CLIENT"><ClientWorkspace /></DashboardAccess>
}

function ClientWorkspace() {
  const [tab, setTab] = useState<'Overview' | 'Templates' | 'Orders' | 'Settings'>('Overview')
  const [orders, setOrders] = useState<Order[]>([])
  const [viewOrder, setViewOrder] = useState<Order | null>(null)
  const [templates, setTemplates] = useState<Template[]>([])
  const [company, setCompany] = useState<{ company_name: string; contact_name: string | null } | null>(null)
  const [details, setDetails] = useState(initial)
  const [phoneNumber, setPhoneNumber] = useState('')
  const [extraEvents, setExtraEvents] = useState<Celebration[]>([])
  const [selected, setSelected] = useState<number | null>(null)
  const [orderSearch, setOrderSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
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
    setTemplates((templatesResult.data || []) as Template[])
    setOrders((ordersResult.data || []) as Order[])
    if (data.user.email) {
      const { data: companyData } = await supabase.from('companies').select('id,company_name,contact_name').ilike('email', data.user.email).maybeSingle()
      setCompany(companyData)
    }
    setLoading(false)
  }, [])

  useEffect(() => { void refresh() }, [refresh])
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
  const counts = useMemo(() => ({ total: orders.length, created: orders.filter(o => o.status === 'CREATED').length, progress: orders.filter(o => o.status === 'IN_PROGRESS').length, ready: orders.filter(o => o.status === 'READY').length }), [orders])
  const filtered = orders.filter(order => (statusFilter === 'ALL' || order.status === statusFilter) && `${order.id} ${order.groom_name} ${order.bride_name}`.toLowerCase().includes(orderSearch.toLowerCase()))
  const chosen = templates.find(template => template.id === selected)
  function setField(key: keyof InvitationData, value: string) { setDetails(previous => ({ ...previous, [key]: value })) }
  function chooseTemplate(id: number) { setSelected(id); setDetails(previous => ({ ...previous, template: id })); setTab('Templates'); setNotice(''); setError(''); setReview(false) }
  async function submitOrder(event: FormEvent) {
    event.preventDefault(); if (!selected || !supabase) return
    if (!review) { setReview(true); return }
    setBusy(true); setNotice(''); setError('')
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Your session expired. Please sign in again.')
      const { data: company, error: companyError } = await supabase.from('companies').select('id').ilike('email', user.email || '').maybeSingle()
      if (companyError || !company) throw new Error('Your account is not linked to a company yet.')
      const companyId = company.id
      if (!phoneNumber.trim()) throw new Error('Please enter a phone number for this order.')
      const formData = validateDetails({ ...details, template: selected, events: [{ title: 'Wedding', date: details.date, time: details.time, venue: details.venue, address: details.address, map: details.map }, ...extraEvents] })
      const templateCode = templates.find(template => template.id === selected)?.template_code
      if (!templateCode) throw new Error('That design is no longer available. Choose another template.')
      const { data, error: insertError } = await supabase.from('orders').insert({ company_id: companyId, template_code: templateCode, created_by: user.id, groom_name: formData.groom, bride_name: formData.bride, phone_number: phoneNumber.trim(), form_data: formData }).select('id').single()
      if (insertError) throw insertError
      setNotice(`Order #${data.id} was submitted. Our studio will review it shortly.`)
      setSelected(null); setDetails(initial); setPhoneNumber(''); setExtraEvents([]); setTab('Orders'); setReview(false); await refresh()
    } catch (cause) {
      const databaseMessage = cause && typeof cause === 'object' && 'message' in cause && typeof cause.message === 'string' ? cause.message : null
      setError(cause instanceof Error ? cause.message : databaseMessage || 'Unable to submit this order.')
    }
    finally { setBusy(false) }
  }

  if (loading) return <main className="dash-loading">Preparing your invitation studio…</main>
  return <main className="workspace">
    <aside className="workspace-sidebar"><a href="/" className="workspace-logo"><img src="/logo.png" alt="Shaadi Invites" /></a><p className="workspace-label">CLIENT STUDIO</p><nav>{(['Overview','Templates','Orders','Settings'] as const).map((item, index) => <button key={item} className={tab === item ? 'active' : ''} onClick={() => { setTab(item); setSelected(null); setError('') }}><span>{['⌂','✧','▤','⚙'][index]}</span>{item}</button>)}</nav><button className="workspace-logout" onClick={() => void signOutToLogin()}>↗ <span>Log out</span></button></aside>
    <section className="workspace-main"><header className="workspace-top"><div><span className="workspace-kicker">SHAADI INVITES · PRIVATE STUDIO</span><h1>{tab === 'Overview' ? 'Your invitation studio' : tab}</h1></div><div className="workspace-account"><span className="account-avatar">{company?.company_name?.charAt(0) || 'S'}</span><span>{company?.company_name || 'Company account'}<small>Client</small></span></div></header>
      {error && <p className="workspace-alert" role="alert">{error}</p>}{notice && <p className="workspace-success" role="status">{notice}</p>}
      {viewOrder && <div className="client-order-overlay" role="presentation" onMouseDown={event=>{if(event.target===event.currentTarget)setViewOrder(null)}}><section className="client-order-dialog" role="dialog" aria-modal="true" aria-labelledby="client-order-title"><button className="dialog-close" onClick={()=>setViewOrder(null)} aria-label="Close order details">×</button><span className="workspace-kicker">ORDER #{viewOrder.id}</span><span className={`status-pill status-${viewOrder.status.toLowerCase()}`}>{statusTitle[viewOrder.status]}</span><h2 id="client-order-title">{viewOrder.groom_name} & {viewOrder.bride_name}</h2><p>{designs.find(d=>d.id===viewOrder.form_data.template)?.name} · Submitted {new Date(viewOrder.created_at).toLocaleDateString()}</p><dl><dt>Wedding date</dt><dd>{viewOrder.form_data.date} · {viewOrder.form_data.time}</dd><dt>Venue</dt><dd>{viewOrder.form_data.venue}, {viewOrder.form_data.address}</dd><dt>Celebrations</dt><dd>{viewOrder.form_data.events?.map(event=>`${event.title} · ${event.date} · ${event.venue}`).join(' / ')||'Wedding'}</dd></dl>{viewOrder.rejection_reason&&<p className="workspace-alert"><strong>Studio note:</strong> {viewOrder.rejection_reason}</p>}{viewOrder.published_url&&(!viewOrder.expires_at||new Date(viewOrder.expires_at)>new Date())?<div className="published-link"><a href={viewOrder.published_url} target="_blank" rel="noreferrer">{viewOrder.published_url} ↗</a><button onClick={()=>void navigator.clipboard.writeText(viewOrder.published_url!)}>Copy invitation link</button></div>:viewOrder.expires_at&&new Date(viewOrder.expires_at)<=new Date()?<p className="workspace-alert">This invitation link has expired. Contact Shaadi Invites to renew it.</p>:<p className="form-note">Your invitation is being prepared. The public link will appear here after publication.</p>}</section></div>}
      {tab === 'Overview' && <><p className="workspace-lede">A considered collection for your couples, with every order gathered in one place.</p><div className="metric-grid">{[['Total orders',counts.total],['New orders',counts.created],['In progress',counts.progress],['Completed',counts.ready]].map(([label,value])=><article className="metric-card" key={label}><span>{label}</span><strong>{value}</strong><i>✧</i></article>)}</div><div className="section-heading"><div><span className="workspace-kicker">YOUR RECENT ACTIVITY</span><h2>Recent orders</h2></div><button className="text-action" onClick={() => setTab('Orders')}>View all →</button></div><OrderTable orders={orders.slice(0,6)} onSelect={setViewOrder}/><section className="studio-callout"><span>✧ A new beginning, beautifully told</span><h2>Find the design that feels like them.</h2><p>Explore the collection and prepare a personalized invitation order.</p><button className="primary-action" onClick={() => setTab('Templates')}>Browse templates <b>→</b></button></section></>}
      {tab === 'Templates' && <><p className="workspace-lede">Choose from the invitation collection already in the Shaadi Invites studio.</p>{chosen ? <div className="order-create"><div className="order-template-rail"><button className="back-action" onClick={() => setSelected(null)}>← All templates</button>{templates.map(template => <button key={template.id} className={`rail-template ${selected === template.id ? 'selected' : ''}`} onClick={() => chooseTemplate(template.id)}><img src={template.thumbnail_url} alt=""/><span>{template.name}<small>{template.category}</small></span></button>)}</div><form className="order-form" onSubmit={submitOrder}><div className="form-heading"><span className="workspace-kicker">NEW INVITATION ORDER</span><h2>{chosen.name}</h2><a href={chosen.preview_url} target="_blank" rel="noreferrer">Preview design ↗</a></div><fieldset style={{display:review?'none':undefined}}><legend>01 · The couple</legend><div className="form-grid"><Field label="Groom’s name" required value={details.groom} onChange={v => setField('groom',v)}/><Field label="Bride’s name" required value={details.bride} onChange={v => setField('bride',v)}/><Field label="Groom’s family" value={details.groomFamily} onChange={v => setField('groomFamily',v)}/><Field label="Bride’s family" value={details.brideFamily} onChange={v => setField('brideFamily',v)}/><Field label="Phone number" type="tel" required value={phoneNumber} onChange={setPhoneNumber}/></div></fieldset><fieldset style={{display:review?'none':undefined}}><legend>02 · Wedding details</legend><div className="form-grid"><Field label="Wedding date" type="date" required value={details.date} onChange={v => setField('date',v)}/><Field label="Ceremony time" type="time" required value={details.time} onChange={v => setField('time',v)}/><Field label="Venue" required value={details.venue} onChange={v => setField('venue',v)}/><Field label="Address" required value={details.address} onChange={v => setField('address',v)}/><Field label="Map link" type="url" value={details.map} onChange={v => setField('map',v)}/><label>Time zone<select value={details.offset} onChange={e => setField('offset',e.target.value)}><option value="+05:30">India · UTC+05:30</option><option value="+04:00">UAE · UTC+04:00</option><option value="+00:00">UTC</option><option value="-04:00">UTC−04:00</option><option value="-05:00">UTC−05:00</option></select></label></div></fieldset><fieldset style={{display:review?'none':undefined}}><legend>03 · Celebrations and personal touches</legend><p className="form-note">The wedding celebration is included from the details above.</p>{extraEvents.map((item,index)=><div className="celebration-editor" key={index}><div className="section-heading"><h3>Additional celebration {index+1}</h3><button type="button" className="text-action" onClick={()=>setExtraEvents(events=>events.filter((_,i)=>i!==index))}>Remove</button></div><div className="form-grid"><Field label="Event name" required value={item.title} onChange={v=>setExtraEvents(events=>events.map((event,i)=>i===index?{...event,title:v}:event))}/><Field label="Date" type="date" required value={item.date} onChange={v=>setExtraEvents(events=>events.map((event,i)=>i===index?{...event,date:v}:event))}/><Field label="Time" type="time" required value={item.time} onChange={v=>setExtraEvents(events=>events.map((event,i)=>i===index?{...event,time:v}:event))}/><Field label="Venue" required value={item.venue} onChange={v=>setExtraEvents(events=>events.map((event,i)=>i===index?{...event,venue:v}:event))}/><Field label="Address" required value={item.address} onChange={v=>setExtraEvents(events=>events.map((event,i)=>i===index?{...event,address:v}:event))}/><Field label="Map link" type="url" value={item.map} onChange={v=>setExtraEvents(events=>events.map((event,i)=>i===index?{...event,map:v}:event))}/></div></div>)}<button type="button" className="secondary-action" disabled={extraEvents.length>=9} onClick={()=>setExtraEvents(events=>[...events,{title:'',date:details.date,time:'17:00',venue:'',address:'',map:''}])}>+ Add celebration</button><div className="form-grid"><Field label="Dress code" value={details.dressCode} onChange={v => setField('dressCode',v)}/><Field label="Music link" type="url" value={details.music} onChange={v => setField('music',v)}/><Field label="Photo gallery link" type="url" value={details.gallery} onChange={v => setField('gallery',v)}/></div><label>Welcome message<textarea rows={4} value={details.message} onChange={e => setField('message',e.target.value)}/></label><label>Gift note<textarea rows={2} value={details.giftNote} onChange={e => setField('giftNote',e.target.value)}/></label></fieldset>{review&&<section className="review-card"><span className="workspace-kicker">REVIEW ORDER DETAILS</span><h3>{details.groom||'Groom'} & {details.bride||'Bride'}</h3><p>{details.date||'Wedding date'} · {details.time} · {details.venue||'Venue'} · {details.address||'Address'}</p><p>Template: {chosen.name} · Additional celebrations: {extraEvents.length}</p><button type="button" className="back-action" onClick={()=>setReview(false)}>← Edit details</button></section>}<p className="form-note">Your order will be submitted for review before an invitation is created or published.</p><button className="primary-action" disabled={busy}>{busy ? 'Submitting order…' : review ? 'Submit order →' : 'Review order →'}</button></form></div> : <div className="template-grid">{templates.map((template,index)=><article className="template-tile" key={template.id}><a className="template-image" href={template.preview_url} target="_blank" rel="noreferrer"><img src={template.thumbnail_url} alt={`${template.name} preview`} loading="lazy"/><span>PREVIEW ↗</span></a><div><small>{String(index+1).padStart(2,'0')} · {template.category}</small><h2>{template.name}</h2><button className="text-action" onClick={() => chooseTemplate(template.id)}>Select this design →</button></div></article>)}</div>}</>}
      {tab === 'Orders' && <><p className="workspace-lede">Every order submitted by {company?.company_name || 'your company'}.</p><div className="filters"><input value={orderSearch} onChange={e => {setOrderSearch(e.target.value);setOrdersPage(0)}} placeholder="Search order or couple" aria-label="Search orders"/><select value={statusFilter} onChange={e => {setStatusFilter(e.target.value);setOrdersPage(0)}} aria-label="Filter by status"><option value="ALL">All statuses</option>{Object.keys(statusTitle).map(s => <option key={s}>{s}</option>)}</select></div><OrderTable orders={filtered.slice(ordersPage*20,ordersPage*20+20)} onSelect={setViewOrder}/><div className="pagination"><button disabled={ordersPage===0} onClick={()=>setOrdersPage(p=>p-1)}>← Previous</button><span>Page {ordersPage+1} of {Math.max(1,Math.ceil(filtered.length/20))}</span><button disabled={(ordersPage+1)*20>=filtered.length} onClick={()=>setOrdersPage(p=>p+1)}>Next →</button></div></>}
      {tab === 'Settings' && <div className="settings-card"><span className="workspace-kicker">COMPANY PROFILE</span><h2>{company?.company_name || 'Company profile'}</h2><p>{company?.contact_name || 'Account contact details are managed by Shaadi Invites.'}</p><p>To change your company information, contact your Shaadi Invites account administrator.</p></div>}
    </section>
  </main>
}

function Field({ label, value, onChange, type = 'text', required = false }: { label: string; value: string; onChange: (value: string) => void; type?: string; required?: boolean }) { return <label>{label}{required && <i> *</i>}<input type={type} value={value} onChange={event => onChange(event.target.value)} maxLength={type === 'url' ? 2000 : 600} required={required}/></label> }
function OrderTable({ orders, onSelect }: { orders: Order[]; onSelect?: (order:Order)=>void }) { return <div className="table-wrap"><table className="orders-table"><thead><tr><th>Order</th><th>Couple</th><th>Design</th><th>Submitted</th><th>Status</th><th>Invitation</th><th/></tr></thead><tbody>{orders.map(order => { const expired=Boolean(order.expires_at&&new Date(order.expires_at)<=new Date()); const active=Boolean(order.published_url&&!expired); return <tr key={order.id}><td>#{order.id}</td><td>{order.groom_name} & {order.bride_name}</td><td>{designs.find(d => d.id === order.form_data.template)?.name || 'Invitation design'}</td><td>{new Date(order.created_at).toLocaleDateString()}</td><td><span className={`status-pill status-${order.status.toLowerCase()}`}>{statusTitle[order.status] || order.status}</span>{order.rejection_reason && <small className="rejection-note">{order.rejection_reason}</small>}</td><td>{active?<a href={order.published_url!} target="_blank" rel="noreferrer">Open ↗</a>:expired?<span className="quiet">Expired</span>:<span className="quiet">In preparation</span>}</td><td>{onSelect&&<button className="row-action" onClick={()=>onSelect(order)}>Details →</button>}{active&&<button className="row-action" onClick={()=>void navigator.clipboard.writeText(order.published_url!)}>Copy link</button>}</td></tr>})}</tbody></table>{orders.length === 0 && <p className="empty-state">No orders found. Your submitted invitation orders will appear here.</p>}</div> }
