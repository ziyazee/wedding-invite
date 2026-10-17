import { useEffect, useRef, useState } from 'react'
import type { InvitationData } from './model'
import { formatDate, formatTime, mapURL, weddingISO } from './model'
import { downloadCalendar } from './calendar'
const themes: Record<number,{names:string[];floral:string;frame:string;bg:string;ink:string}>={
 3:{names:['Camille','Antoine'],floral:'/design3/assets/embroidered-swans-hero-v2.png',frame:'/design3/assets/ceremony-reception-bg-v2.webp',bg:'#f6f3ea',ink:'#536249'},
 5:{names:['Clara','Nour'],floral:'/design5/assets/bouquet_flores_majestic.png',frame:'',bg:'#f6f3ea',ink:'#485b41'},
 6:{names:['Elisa','Jhon'],floral:'/design6/assets/flower-bouquet-CBjxDcRF.png',frame:'/design6/assets/ornate-frame-new-DrDlIAz5.jpg',bg:'#f6f3ea',ink:'#61533f'},
 7:{names:['Martina','Javier'],floral:'/design7/assets/welcome-flowers-Dy0evJgO.png',frame:'/design7/assets/programme-frame-B9QNR9GL.png',bg:'#f4ede1',ink:'#635642'},
}
const escape=(value:string)=>value.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]!))
export default function AnimatedInvitation({details:d}:{details:InvitationData}){
 const [html,setHTML]=useState('');const [error,setError]=useState('');const frame=useRef<HTMLIFrameElement>(null)
 useEffect(()=>{
  const abort=new AbortController()
  async function load(){
   const response=await fetch(`/design${d.template}/index.html`,{signal:abort.signal});if(!response.ok)throw new Error('Could not load the invitation design.')
   const doc=new DOMParser().parseFromString(await response.text(),'text/html');const theme=themes[d.template]
   const title=`${d.groom} & ${d.bride}`;doc.title=title
   const walker=doc.createTreeWalker(doc.body,NodeFilter.SHOW_TEXT)
   while(walker.nextNode()){
    const node=walker.currentNode;if(['SCRIPT','STYLE'].includes(node.parentElement?.tagName||''))continue
    let text=node.textContent||''
    text=text.replaceAll(theme.names[0],d.groom).replaceAll(theme.names[1],d.bride)
    text=text.replace(/June 12, 2027|October 3, 2026|September 18, 2027|27 September 2026/g,formatDate(d.date))
    node.textContent=text
   }
   const sections=[...doc.querySelectorAll('section')]
   const hero=doc.querySelector('#hero')||doc.querySelector('section#opening')||sections[0]
   sections.forEach(section=>{if(section!==hero&&section.id!=='countdown')section.style.setProperty('display','none','important')})
   // Keep the invitation artwork, countdown and scroll effects. Video opening gates are retired.
   const personal=doc.createElement('div');personal.className='atelier-personal'
   const events=[...d.events].sort((a,b)=>`${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`))
   const eventHTML=events.map(e=>{const index=d.events.indexOf(e);return `<article class="atelier-event" ${theme.frame?`style="background-image:url('${theme.frame}')"`:''}><div class="atelier-event-copy"><p class="atelier-eyebrow">${escape(formatDate(e.date,{weekday:'long'}))}</p><h2 class="font-script">${escape(e.title)}</h2><p class="atelier-date">${escape(formatDate(e.date))}</p><p>${escape(formatTime(e.time))}</p><h3>${escape(e.venue)}</h3><p>${escape(e.address)}</p><div class="atelier-links"><a href="${escape(mapURL(e.venue,e.address,e.map))}" target="_blank" rel="noreferrer">Directions ↗</a><button data-personal-calendar="${index}">Save the date +</button></div></div></article>`}).join('')
   personal.innerHTML=`<div class="atelier-welcome"><img src="${theme.floral}" alt=""><p class="atelier-eyebrow">Together with our families</p><h2 class="font-script">${escape(title)}</h2><p>${escape(d.message)}</p>${d.groomFamily||d.brideFamily?`<p>${escape(d.groomFamily)}<br>${escape(d.brideFamily)}</p>`:''}</div><div class="atelier-events">${eventHTML}</div><p class="atelier-zone">All times UTC${escape(d.offset)}</p>${d.dressCode?`<div class="atelier-note"><h2 class="font-script">Dress code</h2><p>${escape(d.dressCode)}</p></div>`:''}${d.giftNote?`<div class="atelier-note"><h2 class="font-script">A little note</h2><p>${escape(d.giftNote)}</p></div>`:''}${d.gallery?`<div class="atelier-note"><a href="${escape(d.gallery)}" target="_blank" rel="noreferrer">Our photo gallery ↗</a></div>`:''}<div class="atelier-note"><h2 class="font-script">${escape(title)}</h2><p>${escape(formatDate(d.date))}</p></div>`
   personal.querySelector('.atelier-zone')?.remove()
   doc.querySelector('#countdown')?.after(personal)
   doc.querySelectorAll('footer').forEach(footer=>footer.style.display='none')
   if(d.template===7){
    // Bloom's hero date is split across lines in a single text node.
    const nodes=doc.createTreeWalker(hero!,NodeFilter.SHOW_TEXT)
    while(nodes.nextNode()){const node=nodes.currentNode;if(/27\s+SEP\s+2026/.test(node.textContent||''))node.textContent=formatDate(d.date)}
   }
   if(d.music)doc.querySelectorAll('audio').forEach(audio=>{audio.src=d.music})
   const style=doc.createElement('style');style.textContent=`
    .atelier-personal{background:${theme.bg};color:${theme.ink};text-align:center;overflow:hidden;font-family:inherit}
    .atelier-welcome,.atelier-note{max-width:680px;margin:auto;padding:55px 30px}.atelier-welcome>img{width:230px;max-height:190px;object-fit:contain;margin:0 auto 25px}.atelier-personal h2{font-size:42px;line-height:1.2;margin:12px 0 24px}.atelier-personal p{font-size:20px;line-height:1.6;white-space:pre-line}.atelier-personal .atelier-eyebrow{font-size:12px;letter-spacing:2px;text-transform:uppercase}.atelier-event{max-width:620px;min-height:580px;margin:30px auto;background-position:center;background-size:100% 100%;background-repeat:no-repeat;display:grid;place-items:center;padding:95px 20%}.atelier-event-copy{width:100%;min-width:0}.atelier-event h3{font-size:25px;line-height:1.3;margin-top:25px}.atelier-event .atelier-date{font-size:23px}.atelier-links{display:flex;justify-content:center;gap:12px;flex-wrap:wrap;margin-top:24px}.atelier-links a,.atelier-links button{font:inherit;color:inherit;border:0;border-bottom:1px solid currentColor;background:none;padding:9px 2px;cursor:pointer;text-decoration:none}.atelier-zone{font-size:12px!important}.atelier-events{max-width:680px;margin:auto;padding:0 12px}
    @media(max-width:600px){.atelier-event{padding:75px 17%;min-height:520px}.atelier-personal h2{font-size:33px}.atelier-personal p{font-size:18px}.atelier-event h3{font-size:23px}}
   `;doc.head.append(style)
   // The same countdown implementation now reads the selected wedding instant.
   const script=doc.querySelector<HTMLScriptElement>('script[src$="interactions.js"]')
   if(script){const js=await fetch(script.getAttribute('src')!,{signal:abort.signal});if(!js.ok)throw new Error('Could not load invitation animation.');script.removeAttribute('src');script.removeAttribute('defer');script.textContent=(await js.text()).replace(/new Date\('\d{4}-\d{2}-\d{2}T[^']+'\)/g,`new Date(${JSON.stringify(weddingISO(d))})`)}
   if(!abort.signal.aborted)setHTML('<!doctype html>'+doc.documentElement.outerHTML)
  }
  void load().catch(e=>{if(!abort.signal.aborted)setError(e instanceof Error?e.message:'Could not load design.')})
  return()=>abort.abort()
 },[d])
 if(error)return <div className="studio-empty" role="alert">{error}<p><button onClick={()=>location.reload()}>Try again</button></p></div>
 if(!html)return <div className="studio-empty" role="status">Preparing your invitation…</div>
 return <iframe ref={frame} srcDoc={html} title={`${d.groom} & ${d.bride} wedding invitation`} allow="autoplay" style={{position:'fixed',inset:0,width:'100%',height:'100%',border:0}} onLoad={()=>{
  frame.current?.contentDocument?.addEventListener('click',event=>{const button=(event.target as HTMLElement).closest<HTMLElement>('[data-personal-calendar]');if(button){const item=d.events[Number(button.dataset.personalCalendar)];if(item)downloadCalendar(item,d.offset,`${d.groom} & ${d.bride}`)}})
 }}/>
}
