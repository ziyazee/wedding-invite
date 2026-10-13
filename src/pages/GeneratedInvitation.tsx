import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { InvitationContext } from '../invitations/context'
import type { SavedInvitation } from '../invitations/model'
import { validateDetails } from '../invitations/model'
import PersonalMusic from '../invitations/PersonalMusic'
import AnimatedInvitation from '../invitations/AnimatedInvitation'
import NewDesign from './NewDesign'
import Design4 from './Design4'
import Design2 from './Design2'
import Design8 from './Design8'
import Design9 from './Design9'
import Design10 from './Design10'
import { showcaseInvitations } from '../invitations/showcase'
export default function GeneratedInvitation(){
 const {slug}=useParams();const [record,setRecord]=useState<SavedInvitation|null>(null);const [error,setError]=useState('')
 useEffect(()=>{const abort=new AbortController();setRecord(null);setError('');const sample=showcaseInvitations[slug||''];if(sample){setRecord(sample);return()=>abort.abort()}void fetch(`/api/invitations/${encodeURIComponent(slug||'')}`,{signal:abort.signal}).then(async response=>{if(!response.headers.get('content-type')?.includes('application/json'))throw new Error('Invitation storage is unavailable on this host.');const data=await response.json();if(!response.ok)throw new Error(data.error||'Invitation not found.');data.details=validateDetails(data.details, true);setRecord(data)}).catch(e=>{if(!abort.signal.aborted)setError(e.message)});return()=>abort.abort()},[slug])
 useEffect(()=>{if(!record)return;const old=document.title;document.title=`${record.details.groom} & ${record.details.bride} — Wedding invitation`;return()=>{document.title=old}},[record])
 if(error)return <main className="studio studio-empty"><h1>Invitation unavailable</h1><p role="alert">{error}</p><Link to="/dashboard">Back to the dashboard</Link></main>
 if(!record)return <main className="studio studio-empty" role="status">Opening your invitation…</main>
 const d=record.details
 return <InvitationContext.Provider value={d}>{(d.template===1||d.template===8)&&d.music&&<PersonalMusic src={d.music}/>}{d.template===1?<NewDesign/>:d.template===2?<Design2/>:d.template===4?<Design4/>:d.template===8?<Design8/>:d.template===9?<Design9/>:d.template===10?<Design10/>:<AnimatedInvitation details={d}/>}</InvitationContext.Provider>
}
