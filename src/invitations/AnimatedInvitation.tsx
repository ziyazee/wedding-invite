import { useEffect, useRef, useState } from 'react'
import type { InvitationData } from './model'
import { formatDate, formatTime, mapURL, weddingISO } from './model'
import { downloadCalendar } from './calendar'
import { saveOrderRsvp, type RsvpSubmitRequest, type RsvpTarget } from './rsvp'
const themes: Record<number,{names:string[];floral:string;frame:string;bg:string;ink:string}>={
 3:{names:['Camille','Antoine'],floral:'/design3/assets/embroidered-swans-hero-v2.png',frame:'/design3/assets/ceremony-reception-bg-v2.webp',bg:'#F5F0E8',ink:'#536249'},
 5:{names:['Clara','Nour'],floral:'/design5/assets/bouquet_flores_majestic.png',frame:'',bg:'#f6f3ea',ink:'#485b41'},
 6:{names:['Elisa','Jhon'],floral:'/design6/assets/flower-bouquet-CBjxDcRF.png',frame:'/design6/assets/ornate-frame-new-DrDlIAz5.jpg',bg:'#f6f3ea',ink:'#61533f'},
 7:{names:['Martina','Javier'],floral:'/design7/assets/welcome-flowers-Dy0evJgO.png',frame:'/design7/assets/programme-frame-B9QNR9GL.png',bg:'#f4ede1',ink:'#635642'},
}
const escape=(value:string)=>value.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]!))
const cardinalWords=(value:number)=>{
 const small=['zero','one','two','three','four','five','six','seven','eight','nine','ten','eleven','twelve','thirteen','fourteen','fifteen','sixteen','seventeen','eighteen','nineteen']
 const tens=['','','twenty','thirty','forty','fifty','sixty','seventy','eighty','ninety']
 return value<20?small[value]:`${tens[Math.floor(value/10)]}${value%10?`-${small[value%10]}`:''}`
}
const ordinalWords=['','first','second','third','fourth','fifth','sixth','seventh','eighth','ninth','tenth','eleventh','twelfth','thirteenth','fourteenth','fifteenth','sixteenth','seventeenth','eighteenth','nineteenth','twentieth','twenty-first','twenty-second','twenty-third','twenty-fourth','twenty-fifth','twenty-sixth','twenty-seventh','twenty-eighth','twenty-ninth','thirtieth','thirty-first']
const bloomDateCopy=(iso:string)=>{
 const date=new Date(`${iso}T12:00:00Z`)
 const weekday=new Intl.DateTimeFormat('en-GB',{weekday:'long',timeZone:'UTC'}).format(date)
 const month=new Intl.DateTimeFormat('en-GB',{month:'long',timeZone:'UTC'}).format(date)
 const year=date.getUTCFullYear()
 const yearWords=year===2000?'two thousand':year>2000&&year<2100?`two thousand ${cardinalWords(year-2000)}`:String(year)
 return [`on ${weekday}`,`the ${ordinalWords[date.getUTCDate()]} of ${month}`,yearWords]
}
export default function AnimatedInvitation({details:d,rsvpTarget}:{details:InvitationData;rsvpTarget?:RsvpTarget}){
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
   if(d.template===3){
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
   const embroideredWelcome=d.template===3?sections.find(section=>section.getAttribute('aria-label')==='Camille and Antoine wedding invitation'):null
   if(embroideredWelcome){
    const welcomeCopy=embroideredWelcome.querySelector('div.absolute')
    const paragraphs=welcomeCopy?.querySelectorAll('p')
    if(paragraphs?.length){
     paragraphs[0].innerHTML='Two souls.<br>One beautiful journey.'
     paragraphs[1].textContent='With the blessings of Allah and the love of our families, we invite you to celebrate the beginning of our forever.'
     const closing=document.createElement('p')
     closing.className=paragraphs[1].className
     closing.textContent='Your presence, your prayers, and your love will make our day complete.'
     paragraphs[1].after(closing)
    }
   }
   const bloomWelcome=d.template===7?doc.querySelector<HTMLElement>('section#welcome'):null
   const bloomCeremony=d.template===7?doc.querySelector<HTMLElement>('section#wedding-events'):null
   const bloomFooter=d.template===7?doc.querySelector('footer'):null
   const embroideredFooter=d.template===3?doc.querySelector('footer'):null
   const bloomEnding=doc.createDocumentFragment()
   sections.forEach(section=>{if(section!==hero&&section!==embroideredWelcome&&section.id!=='countdown'&&section!==bloomWelcome&&section!==bloomCeremony)section.style.setProperty('display','none','important')})
   // Keep the invitation artwork, countdown and scroll effects. Video opening gates are retired.
   const personal=doc.createElement('div');personal.className=`atelier-personal atelier-template-${d.template}`
   const events=[...d.events].sort((a,b)=>`${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`))
   const eventHTML=events.map(e=>{const index=d.events.indexOf(e);return `<article class="atelier-event" ${theme.frame?`style="background-image:url('${theme.frame}')"`:''}><div class="atelier-event-copy"><p class="atelier-eyebrow">${escape(formatDate(e.date,{weekday:'long'}))}</p><h2 class="font-script">${escape(e.title)}</h2><p class="atelier-date">${escape(formatDate(e.date))}</p><p>${escape(formatTime(e.time))}</p><h3>${escape(e.venue)}</h3><p>${escape(e.address)}</p><div class="atelier-links"><a href="${escape(mapURL(e.venue,e.address,e.map))}" target="_blank" rel="noreferrer">Directions ↗</a><button data-personal-calendar="${index}">Save the date +</button></div></div></article>`}).join('')
   personal.innerHTML=`<div class="atelier-welcome"><p class="atelier-eyebrow">Together with our families</p><h2 class="font-script">${escape(title)}</h2><p>${escape(d.message)}</p>${d.groomFamily||d.brideFamily?`<p>${escape(d.groomFamily)}<br>${escape(d.brideFamily)}</p>`:''}</div><div class="atelier-events">${eventHTML}</div><p class="atelier-zone">All times UTC${escape(d.offset)}</p>${d.dressCode?`<div class="atelier-note"><h2 class="font-script">Dress code</h2><p>${escape(d.dressCode)}</p></div>`:''}${d.giftNote?`<div class="atelier-note"><h2 class="font-script">A little note</h2><p>${escape(d.giftNote)}</p></div>`:''}${d.gallery?`<div class="atelier-note"><a href="${escape(d.gallery)}" target="_blank" rel="noreferrer">Our photo gallery ↗</a></div>`:''}<div class="atelier-note"><h2 class="font-script">${escape(title)}</h2><p>${escape(formatDate(d.date))}</p></div>`
   if(d.template===7){
    const weddingEvent=d.events[0]
    const weddingEventIndex=events.indexOf(weddingEvent)
    const ceremonyCard=personal.querySelectorAll<HTMLElement>('.atelier-event')[weddingEventIndex]
    if(!bloomCeremony||!weddingEvent||!ceremonyCard)throw new Error('Could not load the Bloom celebration layout.')
    const ceremonyCopy=bloomCeremony.querySelector('[data-reveal]')
    const sectionHeading=ceremonyCopy?.querySelector('h2')
    const venue=ceremonyCopy?.querySelector('h3')
    const location=venue?.nextElementSibling
    const details=ceremonyCopy?.querySelector(':scope > .space-y-3')
    const dateRow=details?.firstElementChild
    const date=dateRow?.firstElementChild
    const time=dateRow?.lastElementChild
    const address=details?.lastElementChild
    if(!sectionHeading||!venue||!location||!date||!time||!address)throw new Error('Could not load the Bloom celebration details.')
    sectionHeading.textContent=weddingEvent.title.replace(/\s+&\s+/g,'\n& ')
    venue.textContent=weddingEvent.venue
    venue.classList.remove('whitespace-nowrap')
    const addressParts=weddingEvent.address.split(/\n|,\s*/).map(part=>part.trim()).filter(Boolean)
    const locality=addressParts.slice(1).join(', ')
    location.textContent=locality
    location.classList.remove('whitespace-nowrap')
    if(!locality)location.remove()
    const eventDate=new Date(`${weddingEvent.date}T12:00:00Z`)
    const day=eventDate.getUTCDate()
    const suffix=day%100>=11&&day%100<=13?'th':(['th','st','nd','rd'][day%10]||'th')
    date.children[0].textContent=`${formatDate(weddingEvent.date,{weekday:'long'})}, ${day}${suffix}`
    date.children[1].textContent=`of ${formatDate(weddingEvent.date,{month:'long',year:'numeric'}).replace(/ (\d{4})$/,', $1')}`
    time.textContent=formatTime(weddingEvent.time)
    address.children[0].textContent=addressParts[0]||''
    address.children[1].textContent=locality
    if(!locality)address.children[1].remove()
    const venueArt=bloomCeremony.querySelector('img')
    if(venueArt)venueArt.alt=''
    const controls=bloomCeremony.lastElementChild
    const originalButtons=controls?.querySelectorAll('button')
    if(originalButtons?.length===2){
     const directions=doc.createElement('a')
     directions.className=originalButtons[0].className
     directions.textContent='Open in Maps'
     directions.href=mapURL(weddingEvent.venue,weddingEvent.address,weddingEvent.map)
     directions.target='_blank'
     directions.rel='noreferrer'
     originalButtons[0].replaceWith(directions)
     const calendar=originalButtons[1]
     calendar.textContent='Save the date +'
     calendar.setAttribute('data-personal-calendar','0')
     for(const attribute of ['id','aria-haspopup','aria-expanded','data-state'])calendar.removeAttribute(attribute)
    }
    ceremonyCard.remove()
    personal.querySelectorAll<HTMLElement>('.atelier-event').forEach(card=>{
     const video=doc.createElement('video')
     video.src='/design7/assets/hum.mov'
     video.autoplay=true
     video.loop=true
     video.muted=true
     video.defaultMuted=true
     video.setAttribute('muted','')
     video.playsInline=true
     video.preload='metadata'
     video.setAttribute('aria-hidden','true')
     video.tabIndex=-1
     // Let the video's intrinsic aspect ratio determine its height instead of cropping it to a fixed card.
     video.style.cssText='display:block;grid-area:1 / 1;width:100%;height:auto;align-self:center;pointer-events:none'
     card.style.backgroundImage='none'
     card.style.padding='0'
     card.style.minHeight='0'
     card.style.gridTemplateColumns='minmax(0,1fr)'
     card.prepend(video)
     const copy=card.querySelector<HTMLElement>('.atelier-event-copy')
     if(copy){
      copy.style.gridArea='1 / 1'
      copy.style.position='relative'
      copy.style.zIndex='1'
      copy.style.padding='70px 17%'
     }
    })
    // Use Design 7's original markup and utility classes for its welcome section.
    // Keep it outside .atelier-personal so the generic heading/body rules cannot override it.
      const welcomeContent=bloomWelcome?.querySelector<HTMLElement>(':scope > div')
      welcomeContent?.style.setProperty('padding-top','40px')
    const familyIntro=welcomeContent?.querySelector(':scope > p')
    const nameBlock=welcomeContent?.querySelector(':scope > .space-y-2')
    const nameHeadings=nameBlock?.querySelectorAll('h3')
    const connector=nameBlock?.querySelector('p')
    const messageBlock=welcomeContent?.querySelector(':scope > .space-y-6')
    const welcomeMessage=messageBlock?.querySelector(':scope > p')
    const dateBlock=messageBlock?.querySelector(':scope > div')
    const weekday=dateBlock?.querySelector('span')
    const writtenDate=dateBlock?.querySelector('p')
    if(!bloomWelcome||!familyIntro||!nameHeadings||nameHeadings.length!==2||!connector||!messageBlock||!welcomeMessage||!weekday||!writtenDate){
     throw new Error('Could not load the Bloom welcome layout.')
    }
    familyIntro.textContent=personal.querySelector('.atelier-welcome .atelier-eyebrow')?.textContent||''
    nameHeadings[0].textContent=d.groom
    nameHeadings[1].textContent=d.bride
    connector.textContent='&'
    welcomeMessage.textContent=d.message
    welcomeMessage.classList.add('whitespace-pre-line')
    const [weekdayLine,dateLine,yearLine]=bloomDateCopy(d.date)
    weekday.textContent=weekdayLine
    writtenDate.replaceChildren(doc.createTextNode(dateLine),doc.createElement('br'),doc.createTextNode(yearLine))
    if(d.groomFamily||d.brideFamily){
     const familyDetails=doc.createElement('p')
     familyDetails.className='font-body text-base md:text-lg leading-relaxed text-sage-dark whitespace-pre-line'
     familyDetails.textContent=[d.groomFamily,d.brideFamily].filter(Boolean).join('\n')
     messageBlock.append(familyDetails)
    }
    personal.querySelector('.atelier-welcome')?.remove()
    // Restore Design 7's original RSVP and closing card outside the generic styles.
    const rsvpResponse=await fetch('/design7/rsvp.html',{signal:abort.signal})
    if(!rsvpResponse.ok)throw new Error('Could not load the Bloom RSVP layout.')
    const rsvpTemplate=doc.createElement('template')
    rsvpTemplate.innerHTML=await rsvpResponse.text()
    const rsvp=rsvpTemplate.content.querySelector<HTMLElement>('#rsvp')
    const rsvpForm=rsvp?.querySelector<HTMLFormElement>('#rsvp-form')
    const closingNames=bloomFooter?.querySelector('p.font-script')
    const closingDate=bloomFooter?.querySelector('p.section-eyebrow')
    if(!rsvp||!rsvpForm||!bloomFooter||!closingNames||!closingDate)throw new Error('Could not load the Bloom closing layout.')
    rsvpForm.dataset.storageKey=rsvpTarget?`order-rsvp-reply:${rsvpTarget.orderId}`:JSON.stringify(['bloom-rsvp-preview',d.groom,d.bride,d.date])
    rsvpForm.dataset.persistence=rsvpTarget?'server':'preview'
    const rsvpNote=rsvpForm.querySelector('.form-note')
    if(rsvpNote)rsvpNote.textContent=rsvpTarget?'Your reply will be shared with the hosts.':'Preview only. Guests can send their RSVP from the published invitation.'
    const rsvpSubmit=rsvpForm.querySelector<HTMLButtonElement>('[type="submit"]')
    if(rsvpSubmit){rsvpSubmit.textContent='Send RSVP';rsvpSubmit.disabled=false}
    const closingAmpersand=doc.createElement('span')
    closingAmpersand.className='italic'
    closingAmpersand.textContent='&'
    closingNames.replaceChildren(doc.createTextNode(`${d.groom} `),closingAmpersand,doc.createTextNode(` ${d.bride}`))
    closingDate.textContent=formatDate(d.date)
    personal.querySelector(':scope > .atelier-note:last-child')?.remove()
    bloomEnding.append(rsvp,bloomFooter)
   }
   if(d.template===3){
    const coupleNames=personal.querySelector('.atelier-welcome h2')
    if(coupleNames)coupleNames.innerHTML=`${escape(d.groom)}<br>&<br>${escape(d.bride)}`
   }
   if(d.template===3){
    personal.querySelectorAll<HTMLElement>('.atelier-event').forEach(card=>{
     card.style.position='relative'
     card.style.overflow='hidden'
     card.style.minHeight='0'
     card.style.padding='0'
     card.style.backgroundImage='none'
     card.style.display='grid'
     const video=doc.createElement('video')
     video.src='/design3/assets/celebration.mov'
     video.autoplay=true
     video.loop=true
     video.muted=true
     video.defaultMuted=true
     video.setAttribute('muted','')
     video.playsInline=true
     video.setAttribute('aria-hidden','true')
     video.style.cssText='grid-area:1 / 1;display:block;width:100%;height:auto;object-fit:contain;pointer-events:none'
     card.prepend(video)
     const copy=card.querySelector<HTMLElement>('.atelier-event-copy')
     if(copy){copy.style.gridArea='1 / 1';copy.style.position='relative';copy.style.zIndex='1';copy.style.padding='clamp(32px,10vw,80px) 20%'}
    })
   }
   if(d.template===3){
    const coupleNames=personal.querySelector('.atelier-welcome h2')
    if(coupleNames)coupleNames.innerHTML=`${escape(d.groom)}<br>&<br>${escape(d.bride)}`
    const rsvp=doc.createElement('section')
    rsvp.className='atelier-note atelier-rsvp'
    rsvp.innerHTML=`<h2 class="font-script">Kindly reply</h2><p>Please let us know if you can join us.</p><form><label>Your name<input name="fullName" type="text" maxlength="120" required></label><fieldset><legend>Will you be attending?</legend><label><input name="attendance" type="radio" value="yes" required> Joyfully accepts</label><label><input name="attendance" type="radio" value="no"> Regretfully declines</label></fieldset><label>Number of guests<input name="guestCount" type="number" min="1" max="10" value="1" required></label><label>Additional guest names, separated by commas<input name="additionalGuests" type="text" maxlength="120"></label><label>A message for the couple<textarea name="message" maxlength="1000" rows="3"></textarea></label><button type="submit">Send RSVP</button><p class="atelier-rsvp-status" role="status" aria-live="polite"></p></form>`
    personal.append(rsvp)
    const form=rsvp.querySelector<HTMLFormElement>('form')!
    form.addEventListener('submit',event=>{
     event.preventDefault()
     const values=new FormData(form)
     const attendance=String(values.get('attendance')||'')
     const additionalGuests=String(values.get('additionalGuests')||'').split(',').map(name=>name.trim()).filter(Boolean)
     const response={fullName:String(values.get('fullName')||'').trim(),attendance,guestCount:attendance==='yes'?Number(values.get('guestCount')):0,additionalGuests:attendance==='yes'?additionalGuests:[],message:String(values.get('message')||'').trim()}
     const status=rsvp.querySelector<HTMLElement>('.atelier-rsvp-status')!
     form.dispatchEvent(new doc.defaultView!.CustomEvent('invitation:rsvp-submit',{bubbles:true,cancelable:true,detail:{response,resolve:()=>{status.textContent='Thank you. Your reply has been received.';form.reset()},reject:(error:Error)=>{status.textContent=error.message}}}))
    })
   }
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
   if(d.template===7)personal.after(bloomEnding)
   if(embroideredFooter)personal.after(embroideredFooter)
   doc.querySelectorAll('footer').forEach(footer=>{if(footer!==bloomFooter&&footer!==embroideredFooter)footer.style.display='none'})
   if(d.template===7){
    // Keep Bloom's personalized hero date in the template's compact stacked style.
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
   if(d.music)doc.querySelectorAll('audio').forEach(audio=>{audio.src=d.music;if(d.template===3)audio.muted=true})
   const style=doc.createElement('style');style.textContent=`
    body,.bg-background{background-color:${theme.bg}}
    .atelier-personal{background:${theme.bg};color:${theme.ink};text-align:center;overflow:hidden;font-family:inherit}
    .atelier-template-7,.atelier-template-7~#rsvp,.atelier-template-7~footer,.atelier-template-7~footer .bg-ivory{background-color:#F5F0E8}
    .atelier-welcome,.atelier-note{max-width:680px;margin:auto;padding:55px 30px}.atelier-welcome>img{width:230px;max-height:190px;object-fit:contain;margin:0 auto 25px}
    .atelier-personal h2{font-size:42px;line-height:1.2;margin:12px 0 24px}.atelier-personal p{font-size:20px;line-height:1.6;white-space:pre-line}.atelier-personal .atelier-eyebrow{font-size:12px;letter-spacing:2px;text-transform:uppercase}
    .atelier-event{max-width:620px;min-height:580px;margin:30px auto;background-position:center;background-size:100% 100%;background-repeat:no-repeat;display:grid;place-items:center;padding:95px 20%}.atelier-event-copy{width:100%;min-width:0}.atelier-event h3{font-size:25px;line-height:1.3;margin-top:25px}.atelier-event .atelier-date{font-size:14px;font-weight:700;letter-spacing:.42em;line-height:1.15;display:flex;flex-direction:column;align-items:center;gap:.12em;padding-left:.42em;color:#7c9658}
    .atelier-links{display:flex;justify-content:center;gap:12px;flex-wrap:wrap;margin-top:24px}.atelier-links a,.atelier-links button{font:inherit;color:inherit;border:0;border-bottom:1px solid currentColor;background:none;padding:9px 2px;cursor:pointer;text-decoration:none}.atelier-zone{font-size:12px!important}.atelier-events{max-width:680px;margin:auto;padding:0 12px}
    .atelier-rsvp form{max-width:460px;margin:28px auto 0;text-align:left}.atelier-rsvp form>label,.atelier-rsvp fieldset{display:grid;gap:8px;margin:18px 0}.atelier-rsvp input,.atelier-rsvp textarea{width:100%;padding:10px;border:1px solid currentColor;background:transparent;color:inherit;font:inherit}.atelier-rsvp fieldset{border:1px solid currentColor;padding:14px}.atelier-rsvp fieldset label{display:flex;align-items:center;gap:8px}.atelier-rsvp fieldset input{width:auto}.atelier-rsvp button{display:block;margin:24px auto 0;padding:12px 24px;border:1px solid currentColor;background:transparent;color:inherit;font:inherit;cursor:pointer}.atelier-rsvp-status{text-align:center;font-size:15px!important}
    @media(max-width:600px){.atelier-event{padding:75px 17%;min-height:520px}.atelier-personal h2{font-size:33px}.atelier-personal p{font-size:18px}.atelier-event h3{font-size:23px}}
   `;doc.head.append(style)
   // The same countdown implementation now reads the selected wedding instant.
   const script=doc.querySelector<HTMLScriptElement>('script[src$="interactions.js"]')
   if(script){const js=await fetch(script.getAttribute('src')!,{signal:abort.signal});if(!js.ok)throw new Error('Could not load invitation animation.');script.removeAttribute('src');script.removeAttribute('defer');script.textContent=(await js.text()).replace(/new Date\('\d{4}-\d{2}-\d{2}T[^']+'\)/g,`new Date(${JSON.stringify(weddingISO(d))})`)}
   if(!abort.signal.aborted)setHTML('<!doctype html>'+doc.documentElement.outerHTML)
  }
  void load().catch(e=>{if(!abort.signal.aborted)setError(e instanceof Error?e.message:'Could not load design.')})
  return()=>abort.abort()
 },[d,rsvpTarget?.orderId,rsvpTarget?.path])
 if(error)return <div className="studio-empty" role="alert">{error}<p><button onClick={()=>location.reload()}>Try again</button></p></div>
 if(!html)return <div className="studio-empty" role="status">Preparing your invitation…</div>
 return <iframe ref={frame} srcDoc={html} title={`${d.groom} & ${d.bride} wedding invitation`} allow="autoplay" style={{position:'fixed',inset:0,width:'100%',height:'100%',border:0}} onLoad={()=>{
  frame.current?.contentDocument?.addEventListener('click',event=>{const button=(event.target as HTMLElement).closest<HTMLElement>('[data-personal-calendar]');if(button){const item=d.events[Number(button.dataset.personalCalendar)];if(item)downloadCalendar(item,d.offset,`${d.groom} & ${d.bride}`)}})
  frame.current?.contentDocument?.addEventListener('invitation:rsvp-submit',event=>{
   event.preventDefault()
   const {response,resolve,reject}=(event as CustomEvent<RsvpSubmitRequest>).detail
   if(!rsvpTarget){reject(new Error('Please open the published invitation to send your RSVP.'));return}
   void saveOrderRsvp(rsvpTarget,response).then(resolve,reject)
  })
 }}/>
}
