import { useRef, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { formatDate, validateDetails, type Celebration } from '../invitations/model'
import useGoogleFonts from '../hooks/useGoogleFonts'
import './Create.css'

function ArrowIcon() {
 return <svg className="sc-arrow" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M6 18 18 6M6 6h12v12"/></svg>
}

export default function Create() {
 useGoogleFonts('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Dancing+Script:wght@400;500&family=DM+Sans:wght@400;500&display=swap')
 const [groom,setGroom]=useState('');const [bride,setBride]=useState('')
 const [date,setDate]=useState('');const [time,setTime]=useState('')
 const [venue,setVenue]=useState('');const [events,setEvents]=useState<Celebration[]>([])
 const [saved,setSaved]=useState<{id:string;createdAt:string;status:string}|null>(null);const [busy,setBusy]=useState(false)
 const eventInputs=useRef<(HTMLInputElement|null)[]>([])
 const [error,setError]=useState('');const submitting=useRef(false)
 async function submit(e:FormEvent) {
  e.preventDefault();if(submitting.current)return;submitting.current=true;setBusy(true);setError('')
  try {
   const details=validateDetails({template:1,groom,bride,date,time,offset:'+05:30',venue,address:venue,map:'',message:'With the blessings of God and the love of our families, we invite you to celebrate the beginning of our forever.',groomFamily:'',brideFamily:'',dressCode:'',giftNote:'',music:'',gallery:'',events:[{title:'Nikah & Wedding',date,time,venue,address:venue,map:''},...events.map(event=>({...event,address:event.venue}))]})
   const response=await fetch('/api/applications/',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(details)})
   if(!response.headers.get('content-type')?.includes('application/json'))throw new Error('Unable to save right now. Please try again.')
   const result=await response.json();if(!response.ok)throw new Error(result.error||'Unable to save your application.')
   setSaved(result)
  }catch(e){setError(e instanceof Error?e.message:'Please try again.')}finally{submitting.current=false;setBusy(false)}
 }
 return <main className="simple-create"><nav className="sc-nav"><Link className="sc-brand" to="/dashboard" aria-label="Shaadi Invites home"><img src="/logo.png" alt="Shaadi Invites" /></Link><span className="sc-collection">ROYAL GRACE <i>Collection</i></span></nav><div className="sc-shell">
 <aside className="sc-story" aria-label="Your wedding stationery"><img className="sc-roses" src="/templates/royal-grace/celebration-roses.png" alt=""/><p className="sc-eyebrow">A BEAUTIFUL BEGINNING</p><div className="sc-monogram" aria-hidden="true"><span key={groom.charAt(0)}>{groom.trim().charAt(0)||'♡'}</span><i>&</i><span key={`bride-${bride.charAt(0)}`}>{bride.trim().charAt(0)||'♡'}</span></div><div className="sc-story-copy"><h2>A little invitation.<br/><em>A lifetime of love.</em></h2><div className="sc-ornament" aria-hidden="true">── ❧ ──</div><p className="sc-couple">{groom.trim()&&bride.trim()?`${groom} & ${bride}`:'Made for the two of you.'}</p><p className="sc-story-date">{date?formatDate(date):'Your forever starts here'}</p></div><span className="sc-story-foot">THOUGHTFULLY MADE. JOYFULLY SHARED.</span></aside><div className="sc-form-paper">
 {saved?<section className="sc-success" role="status"><span className="sc-eyebrow">THANK YOU</span><h1>Application received.</h1><p>{groom} & {bride}</p><p className="sc-confirmation">Your wedding details have been saved for our team to review.</p><p className="sc-reference">Reference: {saved.id}</p></section>:

 <><header className="sc-heading"><span className="sc-eyebrow">LET’S MAKE IT YOURS</span><h1>Your day.<br/><em>Your beautiful details.</em></h1><p>A few little details. An invitation full of you.</p></header><form onSubmit={submit}><fieldset disabled={busy}>
 <div className="sc-names"><label>Groom full name<input placeholder="His full name" autoComplete="off" required maxLength={80} value={groom} onChange={e=>setGroom(e.target.value)}/></label>
 <label>Bride full name<input placeholder="Her full name" autoComplete="off" required maxLength={80} value={bride} onChange={e=>setBride(e.target.value)}/></label></div>
 <div className="sc-section-rule"><span>THE WHEN & WHERE</span><i/></div><div className="sc-row"><label>Wedding date<input type="date" required value={date} onChange={e=>setDate(e.target.value)}/></label><label>Time <small>(IST)</small><input type="time" required value={time} onChange={e=>setTime(e.target.value)}/></label></div>
 <label>Venue location<input required maxLength={160} placeholder="Venue name, city" value={venue} onChange={e=>setVenue(e.target.value)}/></label>
 {events.map((event,index)=><section className="sc-event" key={index}><header><h2>{event.title||`Another moment to celebrate`}</h2><button type="button" aria-label={`Remove event ${index+1}`} onClick={()=>setEvents(old=>old.filter((_,i)=>i!==index))}>×</button></header>{(['title','date','time','venue'] as const).map(key=><label key={key}>{({title:'Event name',date:'Date',time:'Time (IST)',venue:'Venue location'})[key]}<input ref={el=>{if(key==='title')eventInputs.current[index]=el}} autoFocus={key==='title'} type={key==='date'||key==='time'?key:'text'} required maxLength={key==='title'?100:160} value={event[key]} onChange={e=>setEvents(old=>old.map((v,i)=>i===index?{...v,[key]:e.target.value}:v))}/></label>)}</section>)}
 <button className="sc-add" type="button" disabled={events.length>=9} aria-label="Add another event" onClick={()=>setEvents(old=>[...old,{title:'',date,time:'',venue:'',address:'',map:''}])}><span>+</span><div>Add another event<small>Mehendi, reception, or a little more joy</small></div><ArrowIcon/></button>
 <button className="sc-submit" type="submit" disabled={busy}><span>{busy?'Submitting…':'Submit your application'}</span><ArrowIcon/></button><p className="sc-bottom-note">A beautiful invitation begins here.</p>
 </fieldset></form></>}{error&&<p className="sc-error" role="alert">{error}</p>}</div></div><footer className="sc-footer">For the moments that become memories. <span>✧</span></footer></main>
}
