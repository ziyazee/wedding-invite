import { useEffect, useRef, useState } from 'react'
import type { InvitationData } from './model'
import { formatDate, formatTime, mapURL, weddingISO } from './model'
import { downloadCalendar } from './calendar'
import { saveOrderRsvp, type RsvpSubmitRequest, type RsvpTarget } from './rsvp'
import { markEditorDocument, updateEditorDocument } from './editorDocument'
import { installCardContentFit, secretGardenCardCSS, wrapCardText } from './cardContentFit'
import { bloomRulesCSS, installBloomFit } from './bloomRules'
import { personalizeBloom } from './personalizeBloom'
import { personalizeEG } from './personalizeEG'
import { installOpeningNamesFit } from './installOpeningNamesFit'
import { installRsvpForm } from './installRsvpForm'
const templateFolder: Record<number, string> = { 6: 'embroidered-garden', 7: 'bloom' }
const themes: Record<number,{names:string[];floral:string;frame:string;bg:string;ink:string}>={
 6:{names:['Camille','Antoine'],floral:'/templates/embroidered-garden/assets/embroidered-swans-hero-v2-optimized.webp',frame:'/templates/embroidered-garden/assets/ceremony-reception-bg-v2.webp',bg:'#F5F0E8',ink:'#536249'},
 7:{names:['Martina','Javier'],floral:'/templates/bloom/assets/welcome-flowers-Dy0evJgO.webp',frame:'/templates/bloom/assets/programme-frame-B9QNR9GL.webp',bg:'#f4ede1',ink:'#635642'},
}
const escape=(value:string)=>value.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]!))
export default function AnimatedInvitation({details:d,rsvpTarget}:{details:InvitationData;rsvpTarget?:RsvpTarget}){
 const [html,setHTML]=useState('');const [error,setError]=useState('');const frame=useRef<HTMLIFrameElement>(null)
 const editorSource=useRef<Document | null>(null)
 const currentDetails=useRef(d)
 currentDetails.current=d
 const editorPreview=new URLSearchParams(window.location.search).get('editor')==='1'
 useEffect(()=>{
  const abort=new AbortController()
  async function load(){
   const folder=templateFolder[d.template];if(!folder)throw new Error('Could not load the invitation design.')
   const response=await fetch(`/templates/${folder}/index.html`,{signal:abort.signal});if(!response.ok)throw new Error('Could not load the invitation design.')
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
   if(d.template===6){
    const openingDate=doc.querySelectorAll<HTMLElement>('#opening .opening-name')[1]
    if(openingDate){
     const dateParts=new Intl.DateTimeFormat('en-GB',{day:'2-digit',month:'short',year:'numeric',timeZone:'UTC'}).formatToParts(new Date(`${d.date}T12:00:00Z`))
     const part=(type:Intl.DateTimeFormatPartTypes)=>dateParts.find(item=>item.type===type)?.value||''
     openingDate.innerHTML=`<span>${part('day')}</span><span>${part('month').toUpperCase()}</span><span>${part('year')}</span>`
     openingDate.setAttribute('aria-label',formatDate(d.date))
     openingDate.setAttribute('data-personalized-date','true')
     openingDate.style.cssText='display:flex;flex-direction:column;align-items:center;gap:.12em;margin-top:.75rem;color:#7c9658;font-family:var(--font-display);font-size:clamp(.85rem,2.4vw,1.05rem);font-weight:700;letter-spacing:.42em;line-height:1.15;padding-left:.42em'
    }
   }
   const sections=[...doc.querySelectorAll('section')]
   const hero=doc.querySelector('#hero')||doc.querySelector('section#opening')||sections[0]
   const embroideredWelcome=d.template===6?sections.find(section=>section.getAttribute('aria-label')==='Camille and Antoine wedding invitation'):null
   if(embroideredWelcome){
    const welcomeCopy=embroideredWelcome.querySelector('div.absolute')
    const paragraphs=welcomeCopy?.querySelectorAll('p')
    if(paragraphs?.length){
     paragraphs[0].innerHTML='Two souls.<br>One beautiful journey.'
     paragraphs[1].textContent='With the blessings of God and the love of our families, we invite you to celebrate the beginning of our forever.'
     const closing=document.createElement('p')
     closing.className=paragraphs[1].className
     closing.textContent='Your presence, your prayers, and your love will make our day complete.'
     paragraphs[1].after(closing)
    }
   }
   if(d.template===6||d.template===7){
    const openingNames=hero?.querySelector(d.template===6?'.opening-name':'h1')
    if(openingNames){
     openingNames.classList.add('atelier-opening-names')
     openingNames.parentElement?.classList.add('atelier-opening-copy')
     if(d.template===6){
      openingNames.setAttribute('data-names-layout','stacked')
      openingNames.classList.add('atelier-names-stacked')
      openingNames.innerHTML=`<span>${escape(d.groom)}</span><span>&amp;</span><span>${escape(d.bride)}</span>`
     }else{
      openingNames.classList.add('atelier-bloom-names','atelier-bloom-opening-names')
      openingNames.setAttribute('data-names-layout','stacked')
      openingNames.classList.add('atelier-names-stacked')
     }
    }
   }
   if(embroideredWelcome){
    embroideredWelcome.classList.add('atelier-embroidered-introduction')
    embroideredWelcome.querySelectorAll('p').forEach((paragraph,index)=>{
     paragraph.classList.add(index===0?'atelier-fixed-intro-heading':'atelier-fit-intro-content')
     if(index===0)paragraph.innerHTML='Two souls.<br>One beautiful journey.'
    })
   }
   const embroideredFooter=d.template===6?doc.querySelector('footer'):null
   const bloomWelcome=d.template===7?doc.querySelector<HTMLElement>('section#welcome'):null
   const bloomCeremony=d.template===7?doc.querySelector<HTMLElement>('section#wedding-events'):null
   sections.forEach(section=>{if(section!==hero&&section!==embroideredWelcome&&section.id!=='countdown'&&section!==bloomWelcome&&section!==bloomCeremony)section.style.setProperty('display','none','important')})
   const personal=doc.createElement('div');personal.className=`atelier-personal atelier-template-${d.template}`
   const events=d.template===6?[...d.events]:[...d.events].sort((a,b)=>`${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`))
   const eventHTML=events.map(e=>{const index=d.events.indexOf(e);return `<article class="atelier-event" ${theme.frame?`style="background-image:url('${theme.frame}')"`:''}><div class="atelier-event-copy"><p class="atelier-eyebrow">${escape(formatDate(e.date,{weekday:'long'}))}</p><h2 class="font-script">${escape(e.title)}</h2><p class="atelier-date">${escape(formatDate(e.date))}</p><p>${escape(formatTime(e.time))}</p><h3>${escape(e.venue)}</h3><p>${escape(e.address)}</p><div class="atelier-links"><a href="${escape(mapURL(e.venue,e.address,e.map))}" target="_blank" rel="noreferrer">Directions ↗</a><button data-personal-calendar="${index}">Save the date +</button></div></div></article>`}).join('')
   personal.innerHTML=`<div class="atelier-welcome"><p class="atelier-eyebrow">Together with our families</p><h2 class="font-script">${escape(title)}</h2><p>${escape(d.message)}</p>${d.groomFamily||d.brideFamily?`<p>${escape(d.groomFamily)}<br>${escape(d.brideFamily)}</p>`:''}</div><div class="atelier-events">${eventHTML}</div><p class="atelier-zone">All times UTC${escape(d.offset)}</p>${d.dressCode?`<div class="atelier-note"><h2 class="font-script">Dress code</h2><p>${escape(d.dressCode)}</p></div>`:''}${d.giftNote?`<div class="atelier-note"><h2 class="font-script">A little note</h2><p>${escape(d.giftNote)}</p></div>`:''}${d.gallery?`<div class="atelier-note"><a href="${escape(d.gallery)}" target="_blank" rel="noreferrer">Our photo gallery ↗</a></div>`:''}<div class="atelier-note"><h2 class="font-script"><span>${escape(d.groom)}</span><i>&</i><span>${escape(d.bride)}</span></h2><p>${escape(formatDate(d.date))}</p></div>`
   if(d.template===6||d.template===7){
    personal.querySelectorAll('.atelier-event').forEach((card,index)=>{
     const event=events[index]
     const title=card.querySelector('h2')
     const venue=card.querySelector('h3')
     const address=venue?.nextElementSibling
     for(const [field,value,limit] of [[title,event.title,18],[venue,event.venue,24],[address,event.address,32]] as const){
      if(field){field.setAttribute('data-card-text','');field.textContent=wrapCardText(value,limit)}
     }
     const directions=card.querySelector<HTMLAnchorElement>('.atelier-links a')
     if(directions)directions.hidden=!events[index].map.trim()
     const calendar=card.querySelector<HTMLButtonElement>('[data-personal-calendar]')
     if(calendar)calendar.textContent='Add to calendar'
    })
   }
   let bloomEnding: DocumentFragment | undefined
   if(d.template===7){
    const result=await personalizeBloom(doc,personal,d,theme,events,rsvpTarget,abort.signal)
    bloomEnding=result.ending
   }
   if(d.template===6) personalizeEG(doc,personal,d,theme)
   personal.querySelectorAll<HTMLElement>('.atelier-event .atelier-date').forEach(date=>{
    const calendar=date.closest('.atelier-event')?.querySelector<HTMLElement>('[data-personal-calendar]')
    const eventDate=d.events[Number(calendar?.dataset.personalCalendar)]?.date
    if(!eventDate)return
    const parts=new Intl.DateTimeFormat('en-GB',{day:'2-digit',month:'short',year:'numeric',timeZone:'UTC'}).formatToParts(new Date(`${eventDate}T12:00:00Z`))
    const part=(type:Intl.DateTimeFormatPartTypes)=>parts.find(item=>item.type===type)?.value||''
    date.innerHTML=`<span>${part('day')}</span><span>${part('month').toUpperCase()}</span><span>${part('year')}</span>`
    date.setAttribute('aria-label',formatDate(eventDate))
   })
   personal.querySelector('.atelier-zone')?.remove()
   if(embroideredWelcome){
    const countdown=doc.querySelector('#countdown')
    if(countdown){embroideredWelcome.after(countdown);countdown.after(personal)}
    else embroideredWelcome.after(personal)
   }else doc.querySelector('#countdown')?.after(personal)
   if(bloomWelcome)personal.before(bloomWelcome)
   if(bloomCeremony)personal.before(bloomCeremony)
   if(bloomEnding)personal.after(bloomEnding)
   if(embroideredFooter)personal.after(embroideredFooter)
   doc.querySelectorAll('.atelier-opening-names').forEach(block=>{
    const children=Array.from(block.children)
    for(const [index,value] of [[0,d.groom],[2,d.bride]] as const){
     const child=children[index]
     if(child)(child.querySelector('h2,h3')||child).setAttribute('data-name-input',value)
    }
   })
   const bloomFooter=d.template===7?doc.querySelector('footer'):null
   doc.querySelectorAll('footer').forEach(footer=>{if(footer!==bloomFooter&&footer!==embroideredFooter)footer.style.display='none'})
   if(d.companyLogo||d.companyName){
    const dbf=doc.createElement('footer');dbf.className='designed-by-footer'
    dbf.innerHTML=`<span class="designed-by-label">Designed by</span>${d.companyLogo?`<img class="designed-by-logo" src="${escape(d.companyLogo)}" alt="${escape(d.companyName||'Company')}"/>`:`<span class="designed-by-name">${escape(d.companyName!)}</span>`}`
    const dbfStyle=doc.createElement('style');dbfStyle.textContent=`.designed-by-footer{display:flex;align-items:center;justify-content:center;gap:6px;padding:14px 16px;background:rgba(0,0,0,.03);border-top:1px solid rgba(0,0,0,.06);font-family:system-ui,-apple-system,sans-serif}.designed-by-label{font-size:11px;letter-spacing:.04em;color:rgba(0,0,0,.4);text-transform:uppercase}.designed-by-logo{max-height:22px;width:auto;object-fit:contain;opacity:.7}.designed-by-name{font-size:13px;font-weight:600;color:rgba(0,0,0,.5)}`
    doc.head.append(dbfStyle);doc.body.append(dbf)
   }
   personal.querySelectorAll<HTMLElement>('.atelier-welcome,.atelier-event,.atelier-note').forEach(element=>element.setAttribute('data-reveal',''))
   if(d.template===7){
    const nodes=doc.createTreeWalker(hero!,NodeFilter.SHOW_TEXT)
    while(nodes.nextNode()){
     const node=nodes.currentNode
     if(!/27\s+SEP\s+2026/.test(node.textContent||''))continue
     const dateElement=node.parentElement as HTMLElement|null
     if(!dateElement)continue
     const dateParts=new Intl.DateTimeFormat('en-GB',{day:'2-digit',month:'short',year:'numeric',timeZone:'UTC'}).formatToParts(new Date(`${d.date}T12:00:00Z`))
     const part=(type:Intl.DateTimeFormatPartTypes)=>dateParts.find(item=>item.type===type)?.value||''
     dateElement.innerHTML=`<span>${part('day')}</span><span>${part('month').toUpperCase()}</span><span>${part('year')}</span>`
     dateElement.setAttribute('aria-label',formatDate(d.date))
     dateElement.style.cssText='display:flex;flex-direction:column;align-items:center;gap:.12em;color:#7c9658;font-family:"freighttextcmp-pro",serif;font-size:clamp(.85rem,2.4vw,1.05rem);font-weight:700;letter-spacing:.35em;line-height:1.15;padding-left:.35em'
    }
   }
   if(d.music)doc.querySelectorAll('audio').forEach(audio=>{audio.src=d.music;if(d.template===6)audio.muted=true})
   const style=doc.createElement('style');style.textContent=`
    body,.bg-background{background-color:${theme.bg}}
    .atelier-personal{background:${theme.bg};color:${theme.ink};text-align:center;overflow:hidden;font-family:inherit}
    .atelier-template-7,.atelier-template-7~#rsvp,.atelier-template-7~footer,.atelier-template-7~footer .bg-ivory{background-color:#F5F0E8}
    .atelier-opening-copy{width:100%;box-sizing:border-box}
    .atelier-opening-names{display:flex;justify-content:center;align-items:center;gap:.2em;width:100%;min-width:0}
    .atelier-opening-names>*{flex:0 0 auto;white-space:nowrap}
    .atelier-opening-names.atelier-names-stacked{flex-direction:column;gap:6px}
    .atelier-opening-names.atelier-names-stacked>*{max-width:100%;white-space:pre-line;overflow-wrap:anywhere;margin-block:0;text-wrap:balance}
    .atelier-opening-names [data-name-input]{white-space:pre-line!important}
    .atelier-family-names .atelier-couple-person h2{display:inline-block;white-space:nowrap}
    .atelier-family-names.atelier-names-stacked .atelier-couple-person h2{max-width:100%;white-space:normal;overflow-wrap:anywhere}
    .atelier-family-names:not(.atelier-names-stacked) .atelier-couple-person h2{margin:0}
    .atelier-family-names:not(.atelier-names-stacked){column-gap:16px}
    .atelier-template-6 .atelier-events>.atelier-event:first-child{margin-top:12px}
    .atelier-note:last-child h2{display:flex;flex-direction:column;align-items:center}.atelier-note:last-child h2 span{display:block}.atelier-note:last-child h2 i{display:block;font-size:24px}
    [data-couple-illustration][hidden]{display:none!important}
    .atelier-welcome,.atelier-note{max-width:680px;margin:auto;padding:55px 30px}.atelier-welcome>img{width:230px;max-height:190px;object-fit:contain;margin:0 auto 25px}
    .atelier-personal h2{font-size:42px;line-height:1.2;margin:12px 0 24px}.atelier-personal p{font-size:20px;line-height:1.6;white-space:pre-line}.atelier-personal .atelier-eyebrow{font-size:12px;letter-spacing:2px;text-transform:uppercase}
    .atelier-secret-garden-welcome .atelier-couple-person{min-width:0;overflow-wrap:anywhere}
    .atelier-secret-garden-welcome .atelier-couple-person h2{margin:0}
    .atelier-secret-garden-welcome .atelier-family-details{font-size:17px;line-height:1.6;margin:8px 0 0}
    .atelier-secret-garden-welcome .atelier-couple-connector{display:block;font-size:32px;line-height:1.2;margin:0}
    .atelier-secret-garden-welcome .atelier-couple-connector+.atelier-couple-person h2{margin-top:0}
    .atelier-secret-garden-welcome .atelier-couple-person+p{margin-top:32px}
    .atelier-secret-garden-welcome .atelier-family-names+p{margin-top:32px}
    .atelier-event{max-width:620px;min-height:580px;margin:30px auto;background-position:center;background-size:100% 100%;background-repeat:no-repeat;display:grid;place-items:center;padding:95px 20%}.atelier-event-copy{width:100%;min-width:0}.atelier-event h3{font-size:25px;line-height:1.3;margin-top:25px}.atelier-event .atelier-date{font-size:14px;font-weight:700;letter-spacing:.42em;line-height:1.15;display:flex;flex-direction:column;align-items:center;gap:.12em;padding-left:.42em;color:#7c9658}
    .atelier-links{display:flex;justify-content:center;gap:12px;flex-wrap:wrap;margin-top:24px}.atelier-links a,.atelier-links button{font:inherit;color:inherit;border:0;border-bottom:1px solid currentColor;background:none;padding:9px 2px;cursor:pointer;text-decoration:none}.atelier-zone{font-size:12px!important}.atelier-events{max-width:680px;margin:auto;padding:0 12px}
    .atelier-rsvp{position:relative;max-width:720px;margin:72px auto 42px;padding:54px 46px 42px;border:1px solid #ead8c4;background:#f3ecdf;text-align:left;overflow:hidden}.atelier-rsvp form{max-width:none;margin:0}.atelier-rsvp form>label,.atelier-rsvp fieldset{display:grid;gap:12px;margin:0 0 36px;font-size:23px;text-align:left}.atelier-rsvp .atelier-label-text{display:block;color:inherit}.atelier-rsvp .atelier-required,.atelier-rsvp legend span,.atelier-guest-count span{color:#bd8f7b}.atelier-rsvp input:not([type=radio]):not([type=hidden]),.atelier-rsvp textarea{box-sizing:border-box;width:100%;padding:20px;border:1px solid #ead6b9;border-radius:10px;background:#faf6ed;color:inherit;font:inherit;font-size:22px}.atelier-rsvp input::placeholder,.atelier-rsvp textarea::placeholder{color:#71805c;opacity:.85}.atelier-rsvp fieldset{display:block;border:0;padding:0}.atelier-rsvp fieldset legend{margin-bottom:10px}.atelier-rsvp fieldset label{display:inline-flex;align-items:center;gap:12px;margin:5px 22px 5px 0}.atelier-rsvp fieldset input{width:24px;height:24px;accent-color:#b88d72}.atelier-guest-count{display:flex;align-items:center;gap:30px;flex-wrap:wrap;margin:0 0 34px;font-size:23px}.atelier-guest-count p{flex-basis:100%;margin:0}.atelier-guest-count button{width:64px;height:64px;border:1px solid #ead6b9;border-radius:10px;background:transparent;color:inherit;font-size:32px;cursor:pointer}.atelier-guest-count output{min-width:26px;text-align:center}.atelier-additional-guests label{display:grid;gap:12px;margin:0 0 30px;font-size:23px}.atelier-rsvp textarea{resize:vertical;min-height:170px}.atelier-rsvp .atelier-rsvp-note{font-size:16px;text-align:left;opacity:.78}.atelier-rsvp form>button[type=submit]{width:100%;margin:22px 0 0;padding:22px;border:0;border-radius:9px;background:#bd927d;color:white;font:inherit;font-size:18px;letter-spacing:.2em;text-transform:uppercase;cursor:pointer}.atelier-rsvp-status{text-align:center;font-size:15px!important}
    [data-reveal]{opacity:0!important;transform:translateY(25px)!important;transition:opacity 800ms cubic-bezier(.22,.61,.36,1),transform 800ms cubic-bezier(.22,.61,.36,1)!important}
    [data-reveal].in-view,[data-reveal].visible{opacity:1!important;transform:none!important}
    .opening-name{transform:translateY(25px);transition:opacity 800ms cubic-bezier(.22,.61,.36,1),transform 800ms cubic-bezier(.22,.61,.36,1)}
    .opening-name:nth-child(2){transition-delay:0ms!important}
    .opening-name.visible{transform:none}
    @media(prefers-reduced-motion:reduce){[data-reveal],.opening-name{opacity:1!important;transform:none!important;transition:none!important}}
    @media(min-width:768px){.atelier-garland-wrap{width:100%}}
    @media(max-width:600px){.atelier-event{padding:75px 17%;min-height:520px}.atelier-personal h2{font-size:33px}.atelier-personal p{font-size:18px}.atelier-event h3{font-size:23px}.atelier-rsvp{padding:38px 24px 30px;margin-top:56px}.atelier-rsvp form>label,.atelier-rsvp fieldset,.atelier-guest-count,.atelier-additional-guests label{font-size:19px}.atelier-rsvp:before,.atelier-rsvp:after{width:130px;height:175px}}
   ${secretGardenCardCSS}
   ${bloomRulesCSS}
   `;doc.head.append(style)
   const script=doc.querySelector<HTMLScriptElement>('script[src$="interactions.js"]')
   if(script){const js=await fetch(script.getAttribute('src')!,{signal:abort.signal});if(!js.ok)throw new Error('Could not load invitation animation.');script.removeAttribute('src');script.removeAttribute('defer');script.textContent=(await js.text()).replace(/new Date\('\d{4}-\d{2}-\d{2}T[^']+'\)/g,`new Date(${JSON.stringify(weddingISO(d))})`)}
   if(!abort.signal.aborted){
    if(editorPreview){
     markEditorDocument(doc)
     const live=frame.current?.contentDocument
     if(live?.body.hasAttribute('data-editor-node')&&editorSource.current){
      updateEditorDocument(live,editorSource.current,doc)
     }else setHTML('<!doctype html>'+doc.documentElement.outerHTML)
     editorSource.current=doc
    }else setHTML('<!doctype html>'+doc.documentElement.outerHTML)
   }
  }
  void load().catch(e=>{if(!abort.signal.aborted&&!editorPreview)setError(e instanceof Error?e.message:'Could not load design.')})
  return()=>abort.abort()
 },[d,rsvpTarget?.orderId,rsvpTarget?.path,editorPreview])
 if(error)return <div className="studio-empty" role="alert">{error}<p><button onClick={()=>location.reload()}>Try again</button></p></div>
 if(!html)return <div className="studio-empty" role="status">Preparing your invitation…</div>
 return <iframe ref={frame} srcDoc={html} title={`${d.groom} & ${d.bride} wedding invitation`} allow="autoplay" style={{position:'fixed',inset:0,width:'100%',height:'100%',border:0}} onLoad={()=>{
  frame.current?.contentDocument?.addEventListener('click',event=>{
   const target=event.target as HTMLElement
   const latest=currentDetails.current
   if(target.closest('[data-wedding-calendar]')){
    event.preventDefault()
    downloadCalendar({title:'Wedding',date:latest.date,time:latest.time,venue:latest.venue,address:latest.address,map:latest.map},latest.offset,`${latest.groom} & ${latest.bride}`)
    return
   }
   const button=target.closest<HTMLElement>('[data-personal-calendar]')
   if(button){event.preventDefault();const item=latest.events[Number(button.dataset.personalCalendar)];if(item)downloadCalendar(item,latest.offset,`${latest.groom} & ${latest.bride}`)}
  })
  const invitationDocument=frame.current?.contentDocument
  if(invitationDocument)installCardContentFit(invitationDocument)
  if(invitationDocument)installBloomFit(invitationDocument)
  if(invitationDocument)installOpeningNamesFit(invitationDocument)
  if(invitationDocument)installRsvpForm(invitationDocument)
  frame.current?.contentDocument?.addEventListener('invitation:rsvp-submit',event=>{
   event.preventDefault()
   const {response,resolve,reject}=(event as CustomEvent<RsvpSubmitRequest>).detail
   if(!rsvpTarget){reject(new Error('Please open the published invitation to send your RSVP.'));return}
   void saveOrderRsvp(rsvpTarget,response).then(resolve,reject)
  })
 }}/>
}
