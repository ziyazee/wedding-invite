import { useCallback, useEffect, useMemo, useState } from 'react'
import type { FormEvent, ReactNode } from 'react'
import { designs, slugVariants, inviteUrl, validateDetails } from '../invitations/model'
import type { InvitationData } from '../invitations/model'
import InvitationRenderer from '../invitations/InvitationRenderer'
import { isSupabaseConfigured, supabase } from '../lib/supabase'
import { DashboardAccess, signOutToLogin } from './DashboardAccess'
import './Workspaces.css'

type Order = { id: number; company_id: number; template_code: string; created_by: string; groom_name: string; bride_name: string; phone_number: string; form_data: InvitationData; status: string; published_path: string | null; published_url: string | null; published_at: string | null; expires_at: string | null; rejection_reason: string | null; admin_notes: string | null; created_at: string; companies?: { company_name: string } }
const states = ['CREATED','IN_PROGRESS','READY','REJECTED']
const labels: Record<string,string> = { CREATED:'New', IN_PROGRESS:'In progress', READY:'Published', REJECTED:'Rejected' }

export default function AdminDashboard() { return <DashboardAccess role="ADMIN"><AdminWorkspace/></DashboardAccess> }

function AdminWorkspace() {
  const [orders,setOrders] = useState<Order[]>([])
  const [stats,setStats] = useState({total:0,created:0,progress:0,ready:0,rejected:0})
  const [selected,setSelected] = useState<Order|null>(null)
  const [status,setStatus] = useState('ALL')
  const [companyFilter,setCompanyFilter] = useState('ALL')
  const [dateFrom,setDateFrom] = useState('')
  const [dateTo,setDateTo] = useState('')
  const [query,setQuery] = useState('')
  const [tab,setTab] = useState<'Overview'|'Orders'>('Overview')
  const [loading,setLoading] = useState(true)
  const [busy,setBusy] = useState(false)
  const [error,setError] = useState('')
  const [notice,setNotice] = useState('')
  const [notes,setNotes] = useState('')
  const [preview,setPreview] = useState(false)
  const [editingPublished,setEditingPublished] = useState(false)
  const [draft,setDraft] = useState<InvitationData|null>(null)
  const [expiresOn,setExpiresOn] = useState('')
  const [page,setPage] = useState(0)
  const pageSize = 30

  const refresh = useCallback(async () => {
    if (!supabase || !isSupabaseConfigured) { setError('Connect Supabase to load the admin order desk.'); setLoading(false); return }
    const start=page*pageSize
    const [result,createdCount,progressCount,readyCount,rejectedCount]=await Promise.all([
      supabase.from('orders').select('*, companies(company_name)',{count:'exact'}).order('created_at',{ascending:false}).range(start,start+pageSize-1),
      supabase.from('orders').select('*',{count:'exact',head:true}).eq('status','CREATED'),
      supabase.from('orders').select('*',{count:'exact',head:true}).eq('status','IN_PROGRESS'),
      supabase.from('orders').select('*',{count:'exact',head:true}).eq('status','READY'),
      supabase.from('orders').select('*',{count:'exact',head:true}).eq('status','REJECTED'),
    ])
    if(result.error)setError(result.error.message)
    else {
      const rows=(result.data||[]) as Order[]
      setOrders(rows);if(selected){const current=rows.find(item=>item.id===selected.id);if(current)setSelected(current)}
    }
    setStats({total:result.count||0,created:createdCount.count||0,progress:progressCount.count||0,ready:readyCount.count||0,rejected:rejectedCount.count||0})
    setLoading(false)
  },[page,selected])
  useEffect(()=>{void refresh()},[refresh])
  useEffect(()=>{
    if(!supabase)return
    const channel=supabase.channel('admin-order-updates').on('postgres_changes',{event:'*',schema:'public',table:'orders'},()=>{void refresh()}).subscribe()
    return()=>{void supabase!.removeChannel(channel)}
  },[refresh])
  const companyNames=useMemo(()=>Array.from(new Set(orders.map(o=>o.companies?.company_name).filter(Boolean))) as string[],[orders])
  const visible=orders.filter(o=>(status==='ALL'||o.status===status)&&(companyFilter==='ALL'||o.companies?.company_name===companyFilter)&&(!dateFrom||o.created_at.slice(0,10)>=dateFrom)&&(!dateTo||o.created_at.slice(0,10)<=dateTo)&&`${o.id} ${o.groom_name} ${o.bride_name} ${o.companies?.company_name||''}`.toLowerCase().includes(query.toLowerCase()))
  const counts=stats

  function openOrder(order:Order){setSelected(order);setNotes(order.admin_notes||'');setExpiresOn(order.expires_at?order.expires_at.slice(0,10):'');setEditingPublished(false);setDraft(null);setNotice('')}

  async function changeOrder(patch:Partial<Order>, success:string, silent=false) {
    if(!supabase||!selected)return false
    setBusy(true);if(!silent){setError(‘’);setNotice(‘’)}
    try {
      const {data,error:saveError}=await supabase.from(‘orders’).update(patch).eq(‘id’,selected.id).select(‘*, companies(company_name)’).single()
      if(saveError){if(!silent)setError(saveError.message);return false}
      const updated=data as Order
      setSelected(updated);setOrders(old=>old.map(o=>o.id===selected.id?updated:o));setNotice(success);return true
    } catch(cause) { if(!silent)setError(cause instanceof Error?cause.message:’Unable to update the order. Please retry.’);return false }
    finally { setBusy(false) }
  }
  function startProcessing(){void changeOrder({status:'IN_PROGRESS',rejection_reason:null},'Order moved into processing.')}
  function rejectOrder(){const reason=window.prompt('Share a reason with the client.');if(!reason?.trim())return;void changeOrder({status:'REJECTED',rejection_reason:reason.trim()},'Order rejected and the client will see the reason.')}
  async function publish(){
    if(!selected)return
    if(selected.published_path){
      const publishedAt=selected.published_at||new Date().toISOString()
      const expiresAt=expiresOn?new Date(`${expiresOn}T23:59:59`).toISOString():null
      if(expiresAt&&new Date(expiresAt)<=new Date(publishedAt)){setError('Choose an expiry date after the publication date.');return}
      void changeOrder({status:'READY',published_path:selected.published_path,published_url:inviteUrl(selected.published_path),published_at:publishedAt,expires_at:expiresAt,admin_notes:notes},'Invitation published. The public URL is ready to share.')
      return
    }
    const publishedAt=new Date().toISOString()
    const expiresAt=expiresOn?new Date(`${expiresOn}T23:59:59`).toISOString():null
    if(expiresAt&&new Date(expiresAt)<=new Date(publishedAt)){setError('Choose an expiry date after the publication date.');return}
    const variants=slugVariants(selected.groom_name,selected.bride_name)
    const tryPublish=async(slug:string)=>changeOrder({status:'READY',published_path:slug,published_url:inviteUrl(slug),published_at:publishedAt,expires_at:expiresAt,admin_notes:notes},'Invitation published. The public URL is ready to share.',true)
    const ok=await tryPublish(variants[0])
    if(ok)return
    // Unique constraint hit — find first available variant
    const {data:taken}=await supabase.from('orders').select('published_path').in('published_path',variants)
    const takenSet=new Set((taken||[]).map((r:{published_path:string|null})=>r.published_path))
    const available=variants.find(v=>!takenSet.has(v))
    if(!available){setError('All slug variants for this couple name are taken.');return}
    void tryPublish(available)
  }
  function saveNotes(){void changeOrder({admin_notes:notes},'Internal notes saved.')}
  function saveExpiry(){if(!selected)return;const expiresAt=expiresOn?new Date(`${expiresOn}T23:59:59`).toISOString():null;if(expiresAt&&selected.published_at&&new Date(expiresAt)<=new Date(selected.published_at)){setError('Choose an expiry date after the publication date.');return}void changeOrder({expires_at:expiresAt},expiresAt?'Invitation expiry date saved.':'Invitation expiry removed.')}
  async function savePublishedCorrection(event:FormEvent<HTMLFormElement>){event.preventDefault();if(!selected||!draft)return;try{const valid=validateDetails({...draft,template:selected.form_data.template});const saved=await changeOrder({form_data:valid,groom_name:valid.groom,bride_name:valid.bride},'Invitation details updated. Its public URL has stayed the same.');if(saved){setEditingPublished(false);setDraft(null)}}catch(cause){setError(cause instanceof Error?cause.message:'Please review the invitation details.') }}

  if(loading)return <main className="dash-loading">Opening the order desk…</main>
  if(preview&&selected)return <main className="admin-preview"><header><button className="back-action" onClick={()=>setPreview(false)}>← Back to order #{selected.id}</button><span>UNPUBLISHED PREVIEW · ORDER #{selected.id}</span></header><InvitationRenderer details={selected.form_data}/></main>
  return <main className="workspace admin-workspace"><aside className="workspace-sidebar"><a href="/" className="workspace-logo"><img src="/logo.png" alt="Shaadi Invites"/></a><p className="workspace-label">STUDIO ADMIN</p><nav>{(['Overview','Orders'] as const).map((item,index)=><button key={item} className={tab===item?'active':''} onClick={()=>{setTab(item);setSelected(null)}}><span>{index===0?'⌂':'▤'}</span>{item}</button>)}</nav><button className="workspace-logout" onClick={()=>void signOutToLogin()}>↗ <span>Log out</span></button></aside>
    <section className="workspace-main"><header className="workspace-top"><div><span className="workspace-kicker">SHAADI INVITES · ADMIN</span><h1>{selected?`Order #${selected.id}`:tab==='Overview'?'Order desk':'All orders'}</h1></div><div className="workspace-account"><span className="account-avatar">S</span><span>Shaadi Invites<small>Administrator</small></span></div></header>
      {error&&<p className="workspace-alert" role="alert">{error}</p>}{notice&&<p className="workspace-success" role="status">{notice}</p>}
      {selected ? <section className="order-detail"><div className="detail-head"><div><span className={`status-pill status-${selected.status.toLowerCase()}`}>{labels[selected.status]}</span><h2>{selected.groom_name} <em>&</em> {selected.bride_name}</h2><p>Submitted {new Date(selected.created_at).toLocaleString()} · {designs.find(d=>d.id===selected.form_data.template)?.name}</p></div><button className="back-action" onClick={()=>{setSelected(null);setPreview(false)}}>← Order list</button></div><div className="detail-grid"><article className="detail-card"><span className="workspace-kicker">CLIENT & SUBMISSION</span><dl><dt>Company</dt><dd>{selected.companies?.company_name||'Company'}</dd><dt>Submitted by</dt><dd>{selected.created_by}</dd><dt>Order reference</dt><dd>#{selected.id}</dd><dt>Status</dt><dd>{labels[selected.status]}</dd><dt>Template</dt><dd>{designs.find(d=>d.id===selected.form_data.template)?.name||'—'}</dd><dt>Phone number</dt><dd>{selected.phone_number}</dd></dl></article><article className="detail-card"><span className="workspace-kicker">WEDDING DETAILS</span><dl><dt>Date and time</dt><dd>{selected.form_data.date} · {selected.form_data.time} {selected.form_data.offset}</dd><dt>Venue</dt><dd>{selected.form_data.venue}</dd><dt>Address</dt><dd>{selected.form_data.address}</dd><dt>Groom’s family</dt><dd>{selected.form_data.groomFamily||'—'}</dd><dt>Bride’s family</dt><dd>{selected.form_data.brideFamily||'—'}</dd><dt>Message</dt><dd>{selected.form_data.message||'—'}</dd>{selected.form_data.events?.map((event,index)=><ReactFragment key={`${event.title}-${index}`}><dt>Celebration · {event.title}</dt><dd>{event.date} · {event.time} · {event.venue}{event.address?`, ${event.address}`:''}</dd></ReactFragment>)}</dl></article></div>{selected.status==='READY'&&<div className="correction-bar"><span>Invitation correction</span>{!editingPublished?<button className="secondary-action" onClick={()=>{setDraft(selected.form_data);setEditingPublished(true)}}>Edit published invitation</button>:<button className="back-action" onClick={()=>{setEditingPublished(false);setDraft(null)}}>Cancel edit</button>}</div>}{editingPublished&&draft&&<form className="correction-form" onSubmit={savePublishedCorrection}><span className="workspace-kicker">UPDATE PUBLISHED DETAILS</span><p>Save corrections and the existing URL will remain in place.</p><div className="form-grid"><Field label="Groom’s name" value={draft.groom} onChange={v=>setDraft(d=>d?{...d,groom:v}:d)}/><Field label="Bride’s name" value={draft.bride} onChange={v=>setDraft(d=>d?{...d,bride:v}:d)}/><Field label="Wedding date" type="date" value={draft.date} onChange={v=>setDraft(d=>d?{...d,date:v}:d)}/><Field label="Ceremony time" type="time" value={draft.time} onChange={v=>setDraft(d=>d?{...d,time:v}:d)}/><Field label="Venue" value={draft.venue} onChange={v=>setDraft(d=>d?{...d,venue:v}:d)}/><Field label="Address" value={draft.address} onChange={v=>setDraft(d=>d?{...d,address:v}:d)}/></div><label>Welcome message<textarea rows={3} value={draft.message} onChange={e=>setDraft(d=>d?{...d,message:e.target.value}:d)}/></label><button className="primary-action" disabled={busy}>Save invitation correction →</button></form>}{selected.rejection_reason&&<p className="workspace-alert"><strong>Reason sent to the client:</strong> {selected.rejection_reason}</p>}
        {selected.status==='READY'&&selected.published_url&&<div className="published-link"><span>PUBLIC INVITATION</span><a href={selected.published_url} target="_blank" rel="noreferrer">{selected.published_url} ↗</a><button onClick={()=>void navigator.clipboard.writeText(selected.published_url!)}>Copy link</button></div>}
        <div className="detail-actions"><div><span className="workspace-kicker">PROCESSING</span><h3>Review, preview, then publish.</h3><p>Previewing keeps the invitation private. Publishing makes the name link public.</p></div><div className="action-row">{selected.status!=='READY'&&<label>Link expiry date<input type="date" value={expiresOn} onChange={event=>setExpiresOn(event.target.value)}/></label>}{selected.status==='CREATED'&&<button className="primary-action" disabled={busy} onClick={startProcessing}>Start processing →</button>}{selected.status==='IN_PROGRESS'&&<><button className="secondary-action" disabled={busy} onClick={()=>setPreview(true)}>Preview invitation</button><button className="primary-action" disabled={busy} onClick={publish}>Publish invitation →</button></>}{selected.status==='REJECTED'&&<button className="primary-action" disabled={busy} onClick={startProcessing}>Reopen for processing</button>}{selected.status!=='READY'&&<button className="danger-action" disabled={busy} onClick={rejectOrder}>Reject with reason</button>}{selected.status==='READY'&&<><label>Link expiry date<input type="date" value={expiresOn} onChange={event=>setExpiresOn(event.target.value)}/></label><button className="secondary-action" disabled={busy} onClick={saveExpiry}>Save expiry</button></>}</div></div>
        <div className="notes-box"><label>Internal processing notes<textarea rows={3} value={notes} onChange={e=>setNotes(e.target.value)} placeholder="Visible to the studio admin team only"/></label><button className="secondary-action" disabled={busy} onClick={saveNotes}>Save notes</button></div>
      </section> : tab==='Overview'?<><p className="workspace-lede">A clear view of every client order and publication.</p><div className="metric-grid admin-metrics">{[['Total orders',counts.total],['New submissions',counts.created],['In progress',counts.progress],['Published',counts.ready],['Rejected',counts.rejected]].map(([label,value])=><article className="metric-card" key={label}><span>{label}</span><strong>{value}</strong><i>✧</i></article>)}</div><div className="section-heading"><div><span className="workspace-kicker">LATEST SUBMISSIONS</span><h2>Recent orders</h2></div><button className="text-action" onClick={()=>setTab('Orders')}>View all →</button></div><AdminOrderTable orders={orders.slice(0,8)} onSelect={openOrder}/></>:<><p className="workspace-lede">Review submitted details and move each invitation through publication.</p><div className="filters"><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search couple, company or order" aria-label="Search orders"/><select value={status} onChange={e=>setStatus(e.target.value)}><option value="ALL">All statuses</option>{states.map(s=><option key={s}>{s}</option>)}</select><select value={companyFilter} onChange={e=>setCompanyFilter(e.target.value)}><option value="ALL">All companies</option>{companyNames.map(name=><option key={name}>{name}</option>)}</select><input type="date" value={dateFrom} onChange={e=>setDateFrom(e.target.value)} aria-label="Created from date"/><input type="date" value={dateTo} onChange={e=>setDateTo(e.target.value)} aria-label="Created to date"/></div><AdminOrderTable orders={visible} onSelect={openOrder}/><div className="pagination"><button disabled={page===0} onClick={()=>{setLoading(true);setPage(v=>v-1)}}>← Previous</button><span>Page {page+1}</span><button disabled={orders.length<pageSize} onClick={()=>{setLoading(true);setPage(v=>v+1)}}>Next →</button></div></>}
    </section></main>
}

function ReactFragment({children}:{children:ReactNode;key?:string}) { return <>{children}</> }
function Field({label,value,onChange,type='text'}:{label:string;value:string;onChange:(value:string)=>void;type?:string}){return <label>{label}<input type={type} value={value} onChange={event=>onChange(event.target.value)} maxLength={type==='url'?2000:600}/></label>}
function AdminOrderTable({orders,onSelect}:{orders:Order[];onSelect:(order:Order)=>void}) { return <div className="table-wrap"><table className="orders-table"><thead><tr><th>Order</th><th>Couple</th><th>Company</th><th>Template</th><th>Submitted</th><th>Status</th><th/></tr></thead><tbody>{orders.map(order=><tr key={order.id}><td>#{order.id}</td><td>{order.groom_name} & {order.bride_name}</td><td>{order.companies?.company_name||'—'}</td><td>{designs.find(d=>d.id===order.form_data.template)?.name||'—'}</td><td>{new Date(order.created_at).toLocaleDateString()}</td><td><span className={`status-pill status-${order.status.toLowerCase()}`}>{labels[order.status]}</span></td><td><button className="row-action" onClick={()=>onSelect(order)}>Review →</button></td></tr>)}</tbody></table>{orders.length===0&&<p className="empty-state">No orders match these filters.</p>}</div> }
