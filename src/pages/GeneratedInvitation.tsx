import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import type { SavedInvitation } from '../invitations/model'
import { validateDetails } from '../invitations/model'
import InvitationRenderer from '../invitations/InvitationRenderer'
import InvitationLoading from '../invitations/InvitationLoading'
import { showcaseInvitations } from '../invitations/showcase'
import { isSupabaseConfigured, supabase } from '../lib/supabase'
export default function GeneratedInvitation({overrideSlug}:{overrideSlug?:string}={}){
 const {orderNumber,slug:paramSlug}=useParams();const slug=overrideSlug??paramSlug;const [record,setRecord]=useState<SavedInvitation|null>(null);const [error,setError]=useState('')
 useEffect(()=>{const abort=new AbortController();setRecord(null);setError('');const path=!overrideSlug&&orderNumber?`${orderNumber}/${slug||''}`:slug||'';const sample=!orderNumber&&!overrideSlug?showcaseInvitations[slug||'']:undefined;if(sample){setRecord(sample);return()=>abort.abort()}void(async()=>{try{if(supabase&&isSupabaseConfigured){const {data,error:lookupError}=await supabase.rpc(path.startsWith('test-invite/') ? 'get_test_published_invitation' : 'get_published_invitation',{p_path:path});if(abort.signal.aborted)return;if(!lookupError&&data){const published=data as SavedInvitation;published.details=validateDetails(published.details,true);setRecord(published);return}if(orderNumber&&!overrideSlug)throw new Error(lookupError?.message||'Invitation not found.')}
 if(orderNumber&&!overrideSlug)throw new Error('Invitation not found.');const response=await fetch(`/api/invitations/${encodeURIComponent(path)}`,{signal:abort.signal});if(!response.headers.get('content-type')?.includes('application/json'))throw new Error('Invitation storage is unavailable on this host.');const data=await response.json();if(!response.ok)throw new Error(data.error||'Invitation not found.');data.details=validateDetails(data.details, true);setRecord(data)
 }catch(e){if(!abort.signal.aborted)setError(e instanceof Error?e.message:'Invitation not found.')}})();return()=>abort.abort()},[overrideSlug,orderNumber,slug])
 useEffect(()=>{if(!record)return;const old=document.title;document.title=`${record.details.groom} & ${record.details.bride} — Wedding invitation`;return()=>{document.title=old}},[record])
 if(error)return <main className="studio studio-empty"><h1>Invitation unavailable</h1><p role="alert">{error}</p><Link to="/dashboard">Back to the dashboard</Link></main>
 if(!record)return <InvitationLoading />
 const publishedOrderId=record.orderId||(orderNumber&&/^\d+$/.test(orderNumber)&&record.slug===`${orderNumber}/${slug||''}`?orderNumber:undefined)
 // Read-only comparisons on test invitations isolate the music regression on
 // the affected device. Normal invitations and saved order data are unchanged.
 const musicCheck=record.slug.startsWith('test-invite/')?new URLSearchParams(window.location.search).get('music-check'):null
 const details=musicCheck==='original'||musicCheck==='selected'
  ? {...record.details,music:musicCheck==='original'?'':record.details.music,musicStart:undefined,musicEnd:undefined}
  : record.details
 return <InvitationRenderer details={details} rsvpTarget={publishedOrderId?{orderId:publishedOrderId,path:record.slug}:undefined}/>
}
