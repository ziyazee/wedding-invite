import { useEffect, useRef, useState } from 'react'
import type { InvitationData } from './model'
import { formatDate, formatTime, mapURL, weddingISO } from './model'
import { downloadCalendar } from './calendar'
import { saveOrderRsvp, type RsvpSubmitRequest, type RsvpTarget } from './rsvp'
const themes: Record<number,{names:string[];floral:string;frame:string;bg:string;ink:string}>={
 3:{names:['Camille','Antoine'],floral:'/design3/assets/embroidered-swans-hero-v2.png',frame:'/design3/assets/ceremony-reception-bg-v2.webp',bg:'#F5F0E8',ink:'#536249'},
 5:{names:['Clara','Nour'],floral:'/design5/assets/bouquet_flores_majestic.png',frame:'',bg:'#EFE8DA',ink:'#485b41'},
 6:{names:['Elisa','Jhon'],floral:'/design6/assets/flower-bouquet-CBjxDcRF.png',frame:'',bg:'#EFE8DA',ink:'#61533f'},
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
   const referenceDetails=doc.createDocumentFragment()
   if(d.template===5||d.template===6){
    const referenceResponse=await fetch('/design5/index.html',{signal:abort.signal})
    if(!referenceResponse.ok)throw new Error('Could not load the invitation details layout.')
    const reference=new DOMParser().parseFromString(await referenceResponse.text(),'text/html')
    const lights=reference.querySelector<HTMLImageElement>('img[src="/design5/assets/lights.png"]')
    const details=reference.querySelector<HTMLElement>('.sg-details')
    const programme=reference.querySelector('img[src="/design5/assets/timeline-banquete.png"]')?.closest('section')
    const dress=reference.querySelector('img[src="/design5/assets/dress-code-new.png"]')?.closest('section')
    if(!lights||!details||!programme||!dress)throw new Error('Could not load the invitation details sections.')
    // Reuse Design 5's artwork and content with the current template's palette.
    // Its original standalone lights must not remain below the personalized content.
    if(d.template===5)doc.querySelector('img[src="/design5/assets/lights.png"]')?.remove()
    lights.className='atelier-majestic-lights'
    lights.removeAttribute('style')
    details.classList.add('atelier-majestic-details')
    programme.classList.add('atelier-majestic-programme')
    dress.classList.add('atelier-majestic-dress')
    details.querySelector('.sg-venue-name')!.textContent=d.venue
    details.querySelector('.sg-venue-city')!.textContent=d.address
    details.querySelector('.sg-venue-time span')!.textContent=formatTime(d.time)
    const maps=details.querySelector<HTMLAnchorElement>('.sg-venue-actions a')!
    maps.href=mapURL(d.venue,d.address,d.map)
    const calendar=details.querySelector<HTMLButtonElement>('.sg-venue-actions button')!
    calendar.type='button'
    calendar.setAttribute('data-wedding-calendar','')
    const programmeImage=programme.querySelector('img')!
    programmeImage.src='/design6/assets/food.png'
    programmeImage.className='atelier-majestic-programme-art'
    const programmeList=programme.querySelector('h3')?.closest('.grid')?.parentElement
    programmeList?.parentElement?.remove()
    programme.querySelectorAll('p').forEach(paragraph=>{
     if(paragraph.textContent?.trim().toLowerCase()==='the day')paragraph.remove()
    })
    const dressHeading=dress.querySelector('h3')!
    const dressCard=dressHeading.parentElement!.parentElement!
    dressCard.classList.add('atelier-majestic-dress-card')
    dressCard.removeAttribute('style')
    if(d.dressCode.trim()){
     dressHeading.textContent=d.dressCode
     dressCard.querySelectorAll('p').forEach(paragraph=>paragraph.remove())
    }
    referenceDetails.append(lights,details,programme)
    if(d.dressCode.trim())referenceDetails.append(dress)
   }
   sections.forEach(section=>{if(section!==hero&&section!==embroideredWelcome&&section.id!=='countdown'&&section!==bloomWelcome&&section!==bloomCeremony)section.style.setProperty('display','none','important')})
   // Keep the invitation artwork, countdown and scroll effects. Video opening gates are retired.
   const personal=doc.createElement('div');personal.className=`atelier-personal atelier-template-${d.template}`
   const events=d.template===3?[...d.events]:[...d.events].sort((a,b)=>`${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`))
   const eventHTML=events.map(e=>{const index=d.events.indexOf(e);return `<article class="atelier-event" ${theme.frame?`style="background-image:url('${theme.frame}')"`:''}><div class="atelier-event-copy"><p class="atelier-eyebrow">${escape(formatDate(e.date,{weekday:'long'}))}</p><h2 class="font-script">${escape(e.title)}</h2><p class="atelier-date">${escape(formatDate(e.date))}</p><p>${escape(formatTime(e.time))}</p><h3>${escape(e.venue)}</h3><p>${escape(e.address)}</p><div class="atelier-links"><a href="${escape(mapURL(e.venue,e.address,e.map))}" target="_blank" rel="noreferrer">Directions ↗</a><button data-personal-calendar="${index}">Save the date +</button></div></div></article>`}).join('')
   personal.innerHTML=`<div class="atelier-welcome"><p class="atelier-eyebrow">Together with our families</p><h2 class="font-script">${escape(title)}</h2><p>${escape(d.message)}</p>${d.groomFamily||d.brideFamily?`<p>${escape(d.groomFamily)}<br>${escape(d.brideFamily)}</p>`:''}</div><div class="atelier-events">${eventHTML}</div><p class="atelier-zone">All times UTC${escape(d.offset)}</p>${d.dressCode?`<div class="atelier-note"><h2 class="font-script">Dress code</h2><p>${escape(d.dressCode)}</p></div>`:''}${d.giftNote?`<div class="atelier-note"><h2 class="font-script">A little note</h2><p>${escape(d.giftNote)}</p></div>`:''}${d.gallery?`<div class="atelier-note"><a href="${escape(d.gallery)}" target="_blank" rel="noreferrer">Our photo gallery ↗</a></div>`:''}<div class="atelier-note"><h2 class="font-script">${escape(title)}</h2><p>${escape(formatDate(d.date))}</p></div>`
   if(d.template===5||d.template===6){
    personal.querySelectorAll('.atelier-note').forEach(note=>{
     const heading=note.querySelector('h2')?.textContent
     if(heading==='Dress code'||(heading===title&&note.querySelector('p')?.textContent===formatDate(d.date)))note.remove()
    })
   }
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
    const contact=bloomFooter.querySelector('.bloom-invitation-contact')
    const whatsappLink=contact?.querySelector<HTMLAnchorElement>('a')
    if(whatsappLink){
     contact?.querySelector('p')?.remove()
     const label=doc.createElement('span')
     label.textContent='Contact on WhatsApp'
     whatsappLink.prepend(label)
     whatsappLink.setAttribute('aria-label','Contact on WhatsApp')
     whatsappLink.style.gap='6px'
     whatsappLink.style.fontSize='12px'
    }
    personal.querySelector(':scope > .atelier-note:last-child')?.remove()
    bloomEnding.append(rsvp,bloomFooter)
   }
   if(d.template===3){
    const coupleNames=personal.querySelector('.atelier-welcome h2')
    if(coupleNames)coupleNames.innerHTML=`${escape(d.groom)}<br>&<br>${escape(d.bride)}`
   }
   if(d.template===3){
    const mainEvent=personal.querySelector<HTMLElement>('.atelier-event')
    if(mainEvent){
     mainEvent.style.position='relative'
     mainEvent.style.overflow='visible'
     mainEvent.style.marginBottom='clamp(170px,30vw,280px)'
     const garlandWrap=doc.createElement('div')
     garlandWrap.className='atelier-garland-wrap'
     garlandWrap.style.cssText='position:absolute;top:100%;left:50%;transform:translate(-50%,-28%);width:130%;max-width:none;z-index:30;pointer-events:none'
     const garland=doc.createElement('img')
     garland.src='/design3/assets/dresscode-hanging-garland-v2.webp'
     garland.alt=''
     garland.className='swaying-garland'
     garland.setAttribute('aria-hidden','true')
     garland.style.cssText='display:block;width:100%;height:auto;transform-origin:center top;animation:garland-sway 7s ease-in-out infinite'
     garlandWrap.append(garland)
     mainEvent.append(garlandWrap)
    }
    personal.querySelectorAll<HTMLElement>('.atelier-event').forEach((card,index)=>{
     if(index===0)return
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
   if(d.template===5){
    const rsvp=doc.createElement('section')
    rsvp.className='atelier-note atelier-rsvp atelier-rsvp-secret-garden'
    rsvp.setAttribute('aria-labelledby','secret-garden-rsvp-title')
    rsvp.innerHTML=`<p class="atelier-eyebrow">The ${escape(d.groom)} &amp; ${escape(d.bride)} wedding</p><h2 id="secret-garden-rsvp-title" class="font-script">RSVP</h2><p class="atelier-rsvp-intro">Kindly reply</p><div class="atelier-rsvp-envelope" data-secret-garden-envelope><img src="/design5/assets/envelope-closed-new.png" alt="An embroidered ivory envelope" data-secret-garden-envelope-image><button type="button" data-secret-garden-open-rsvp>Open RSVP</button></div><form data-atelier-rsvp data-count-only hidden><img class="atelier-rsvp-open-envelope" src="/design5/assets/envelope-open-new.png" alt="An open embroidered ivory envelope"><fieldset><legend>Will you attend?</legend><label><input name="attendance" type="radio" value="yes" required checked> Yes, I’ll be there</label><label><input name="attendance" type="radio" value="no"> Sorry, I can’t</label></fieldset><label><span class="atelier-label-text">Full name</span><input name="fullName" type="text" maxlength="120" placeholder="Your name" required></label><div class="atelier-guest-count"><p>Number of guests</p><input name="guestCount" type="number" min="1" max="10" value="1" required><output data-guest-count hidden>1</output><button type="button" data-guest-step="-1" aria-label="Remove a guest" hidden>−</button><button type="button" data-guest-step="1" aria-label="Add a guest" hidden>+</button></div><div class="atelier-additional-guests"></div><label><span class="atelier-label-text">Message <span class="atelier-optional">(optional)</span></span><textarea name="message" maxlength="1000" rows="4"></textarea></label><button type="submit">Update RSVP</button><p class="atelier-rsvp-status" role="status" aria-live="polite"></p></form>`
    personal.append(rsvp)
   }
   if(d.template===5||d.template===6){
    doc.documentElement.classList.add('atelier-video-page')
    personal.querySelectorAll<HTMLElement>('.atelier-event').forEach(card=>{
     const video=doc.createElement('video')
     video.className='atelier-event-video'
     video.src='/design6/assets/celebrations.mov'
     video.autoplay=true
     video.loop=true
     video.muted=true
     video.defaultMuted=true
     video.setAttribute('muted','')
     video.playsInline=true
     video.preload='metadata'
     video.width=720
     video.height=1032
     video.setAttribute('aria-hidden','true')
     card.prepend(video)
    })
   }
   if(d.template===6){
    const rsvp=doc.createElement('section')
    rsvp.className='atelier-note atelier-rsvp atelier-rsvp-majestic'
    rsvp.setAttribute('aria-labelledby','majestic-rsvp-title')
    rsvp.innerHTML=`<p class="atelier-eyebrow">The ${escape(d.groom)} &amp; ${escape(d.bride)} wedding</p><h2 id="majestic-rsvp-title" class="font-script">RSVP</h2><p class="atelier-rsvp-intro">Kindly reply</p><div class="atelier-rsvp-envelope" data-secret-garden-envelope><button class="atelier-majestic-envelope-trigger" type="button" data-secret-garden-open-rsvp aria-label="Open your RSVP envelope"><img src="/design5/assets/envelope-closed-new.png" alt="A closed embroidered ivory envelope"></button><button type="button" data-secret-garden-open-rsvp>Open RSVP</button></div><form data-atelier-rsvp data-count-only hidden><fieldset><legend>Will you attend?</legend><label><input name="attendance" type="radio" value="yes" required checked> Yes, I’ll be there</label><label><input name="attendance" type="radio" value="no"> Sorry, I can’t</label></fieldset><label><span class="atelier-label-text">Full name</span><input name="fullName" type="text" maxlength="120" placeholder="Your name" required></label><div class="atelier-guest-count"><p>Number of guests</p><input name="guestCount" type="number" min="1" max="10" value="1" required><output data-guest-count hidden>1</output><button type="button" data-guest-step="-1" aria-label="Remove a guest" hidden>−</button><button type="button" data-guest-step="1" aria-label="Add a guest" hidden>+</button></div><div class="atelier-additional-guests"></div><label><span class="atelier-label-text">Message <span class="atelier-optional">(optional)</span></span><textarea name="message" maxlength="1000" rows="4"></textarea></label><button type="submit">Send RSVP</button><p class="atelier-rsvp-status" role="status" aria-live="polite"></p></form><div class="atelier-majestic-lights" aria-hidden="true"></div>`
    const openedEnvelope=doc.createElement('img')
    openedEnvelope.className='atelier-rsvp-open-envelope'
    openedEnvelope.src='/design5/assets/envelope-open-new.png'
    openedEnvelope.alt='An open embroidered ivory envelope'
    rsvp.querySelector('form')!.prepend(openedEnvelope)
    personal.append(rsvp)
    const closing=doc.createElement('section')
    closing.className='atelier-majestic-closing'
    closing.setAttribute('aria-label',`${title}, ${formatDate(d.date)}`)
    closing.innerHTML=`<h2 class="font-script">${escape(title)}</h2><p>${escape(formatDate(d.date))}</p><img src="/design5/assets/footer-flowers.png" alt="An embroidered arrangement of white roses and greenery">`
    personal.append(closing)
   }
   if(d.template===3){
    const coupleNames=personal.querySelector('.atelier-welcome h2')
    if(coupleNames)coupleNames.innerHTML=`${escape(d.groom)}<br>&<br>${escape(d.bride)}`
    const rsvp=doc.createElement('section')
    rsvp.className='atelier-note atelier-rsvp'
    rsvp.innerHTML=`<form data-atelier-rsvp><label><span class="atelier-label-text">Full name <span class="atelier-required">*</span></span><input name="fullName" type="text" maxlength="120" placeholder="Your full name" required></label><fieldset><legend>Will you be attending? <span>*</span></legend><label><input name="attendance" type="radio" value="yes" required checked> Joyfully accepts</label><label><input name="attendance" type="radio" value="no"> Regretfully declines</label></fieldset><div class="atelier-guest-count"><p>Number of guests attending <span>*</span></p><button type="button" data-guest-step="-1" aria-label="Remove a guest">−</button><output data-guest-count>1</output><button type="button" data-guest-step="1" aria-label="Add a guest">+</button><input name="guestCount" type="hidden" value="1"></div><div class="atelier-additional-guests"></div><label><span class="atelier-label-text">A personal message for the couple</span><textarea name="message" maxlength="1000" rows="4" placeholder="Write a message (optional)"></textarea></label><p class="atelier-rsvp-note">Your reply will be shared with the hosts.</p><button type="submit">Update RSVP</button><p class="atelier-rsvp-status" role="status" aria-live="polite"></p></form>`
    personal.append(rsvp)
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
   }else doc.querySelector('#countdown')?.after(referenceDetails,personal)
   if(d.template===5||d.template===6){
    const welcome=personal.querySelector('.atelier-welcome')
    const lights=doc.querySelector('.atelier-majestic-lights')
    if(welcome&&lights){
     const names=welcome.querySelector('h2')
     if(names)names.replaceChildren(doc.createTextNode(d.groom),doc.createElement('br'),doc.createTextNode('&'),doc.createElement('br'),doc.createTextNode(d.bride))
     const welcomeSection=doc.createElement('div')
     welcomeSection.className='atelier-personal'
     welcomeSection.append(welcome)
     lights.after(welcomeSection)
    }
    const dress=doc.querySelector('.atelier-majestic-dress')
    if(dress)personal.querySelector('.atelier-events')?.after(dress)
   }
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
    .atelier-video-page,.atelier-video-page body,.atelier-video-page main,.atelier-video-page .bg-background,.atelier-video-page .bg-ivory,.atelier-video-page .bg-countdown,.atelier-video-page .majestic-invitation-contact,.atelier-video-page .sg-invitation-contact{background-color:#EFE8DA}
    .atelier-template-7,.atelier-template-7~#rsvp,.atelier-template-7~footer,.atelier-template-7~footer .bg-ivory{background-color:#F5F0E8}
    .atelier-majestic-lights{display:block;width:100%;height:auto;position:relative;margin-top:-3cm;pointer-events:none}
    .atelier-majestic-details,.atelier-majestic-programme,.atelier-majestic-dress{background:#EFE8DA;color:${theme.ink}}
    .atelier-majestic-details h2,.atelier-majestic-programme h2,.atelier-majestic-dress h2{color:${theme.ink};font-size:clamp(48px,8vw,60px);line-height:1;margin-bottom:12px}
    .atelier-majestic-details [class*="text-sage"],.atelier-majestic-programme [class*="text-sage"],.atelier-majestic-dress [class*="text-sage"]{color:${theme.ink}}
    .atelier-majestic-details{padding:8px 12px 48px;overflow:hidden}
    .atelier-majestic-details .sg-details-heading{text-align:center;margin:0 0 8px}
    .atelier-majestic-details .sg-venue-card{position:relative;isolation:isolate;width:min(100%,560px);aspect-ratio:1/1.32;margin-inline:auto;display:flex;align-items:center;justify-content:center}
    .atelier-majestic-details .sg-venue-frame{position:absolute;z-index:-1;top:0;left:-16%;width:132%;max-width:none;height:100%;object-fit:contain;pointer-events:none}
    .atelier-majestic-details .sg-venue-content{width:68%;display:flex;flex-direction:column;align-items:center;gap:8px;text-align:center;overflow-wrap:anywhere}
    .atelier-majestic-details .sg-venue-content p,.atelier-majestic-details .sg-venue-content h3{margin:0}
    .atelier-majestic-details .sg-venue-heading{font-size:clamp(34px,8vw,50px);line-height:1.15}
    .atelier-majestic-details .sg-venue-name{max-width:100%;font-size:clamp(15px,4vw,21px);line-height:1.4;letter-spacing:.1em;text-transform:uppercase;text-wrap:balance}
    .atelier-majestic-details .sg-venue-city{font-size:clamp(13px,3.5vw,16px);line-height:1.4;white-space:pre-line}
    .atelier-majestic-details .sg-venue-time{display:flex;align-items:center;justify-content:center;gap:6px;font-size:clamp(13px,3.5vw,16px);line-height:1.4}
    .atelier-majestic-details .sg-venue-actions{display:flex;flex-wrap:wrap;justify-content:center;align-items:center;gap:clamp(10px,3.8vw,18px);margin:36px auto 0;width:min(100%,460px)}
    .atelier-majestic-details .sg-venue-actions a,.atelier-majestic-details .sg-venue-actions button{display:inline-flex;align-items:center;justify-content:center;gap:8px;min-height:48px;height:auto;font-family:Georgia,'Times New Roman',serif;font-size:clamp(15px,4.5vw,22px);font-weight:400;padding:12px clamp(12px,4vw,20px);border:0;border-radius:8px;background:${d.template===5?'#5a6340':'#716149'};color:#fffdf6;cursor:pointer}
    .atelier-majestic-details svg{width:20px;height:20px;flex:none}
    .atelier-majestic-programme{overflow:hidden;padding-bottom:32px}
    .atelier-majestic-programme-art{display:block;width:min(80vw,460px);height:auto;object-fit:contain;margin:auto}
    .atelier-majestic-dress{padding:48px 24px 64px}
    .atelier-majestic-dress>div{max-width:576px;margin:auto}
    .atelier-majestic-dress img{display:block;width:100%;height:auto;object-fit:contain}
    .atelier-majestic-dress-card{background:#f7f2e8;border:1px solid ${theme.ink}26;border-radius:32px;padding:32px;text-align:center}
    .atelier-majestic-dress-card h3{font-size:20px;line-height:1.5;letter-spacing:.12em;white-space:pre-line}
    .atelier-welcome,.atelier-note{max-width:680px;margin:auto;padding:55px 30px}.atelier-welcome>img{width:230px;max-height:190px;object-fit:contain;margin:0 auto 25px}
    .atelier-personal h2{font-size:42px;line-height:1.2;margin:12px 0 24px}.atelier-personal p{font-size:20px;line-height:1.6;white-space:pre-line}.atelier-personal .atelier-eyebrow{font-size:12px;letter-spacing:2px;text-transform:uppercase}
    .atelier-personal .atelier-majestic-dress h2{font-size:clamp(48px,8vw,60px);line-height:1;margin:0 0 12px}
    .atelier-personal .atelier-majestic-dress p{font-size:16px;line-height:1.625;white-space:normal}
    .atelier-personal .atelier-majestic-dress h2+p{font-size:12px}
    .atelier-personal .atelier-majestic-dress-card>p{font-size:14px}
    .atelier-event{max-width:620px;min-height:580px;margin:30px auto;background-position:center;background-size:100% 100%;background-repeat:no-repeat;display:grid;place-items:center;padding:95px 20%}.atelier-event-copy{width:100%;min-width:0}.atelier-event h3{font-size:25px;line-height:1.3;margin-top:25px}.atelier-event .atelier-date{font-size:14px;font-weight:700;letter-spacing:.42em;line-height:1.15;display:flex;flex-direction:column;align-items:center;gap:.12em;padding-left:.42em;color:#7c9658}
    .atelier-video-page .atelier-event{position:relative;isolation:isolate;aspect-ratio:720/1032;background-image:none}
    .atelier-video-page .atelier-event-video{position:absolute;inset:0;z-index:0;display:block;width:100%;height:100%;object-fit:fill;pointer-events:none}
    .atelier-video-page .atelier-event-copy{position:relative;z-index:1;top:56px}
    .atelier-video-page .atelier-event-copy h2{margin:10px 0 20px}
    .atelier-video-page .atelier-event-copy h3{margin-top:21px}
    .atelier-video-page .atelier-event-copy p:not(.atelier-date){line-height:1.5}
    .atelier-video-page .atelier-event-copy .atelier-links{margin-top:20px}
    .atelier-links{display:flex;justify-content:center;gap:12px;flex-wrap:wrap;margin-top:24px}.atelier-links a,.atelier-links button{font:inherit;color:inherit;border:0;border-bottom:1px solid currentColor;background:none;padding:9px 2px;cursor:pointer;text-decoration:none}.atelier-zone{font-size:12px!important}.atelier-events{max-width:680px;margin:auto;padding:0 12px}
    .atelier-rsvp{position:relative;max-width:720px;margin:72px auto 42px;padding:54px 46px 42px;border:1px solid #ead8c4;background:#f3ecdf;text-align:left;overflow:hidden}.atelier-rsvp form{max-width:none;margin:0}.atelier-rsvp form>label,.atelier-rsvp fieldset{display:grid;gap:12px;margin:0 0 36px;font-size:23px;text-align:left}.atelier-rsvp .atelier-label-text{display:block;color:inherit}.atelier-rsvp .atelier-required,.atelier-rsvp legend span,.atelier-guest-count span{color:#bd8f7b}.atelier-rsvp input:not([type=radio]):not([type=hidden]),.atelier-rsvp textarea{box-sizing:border-box;width:100%;padding:20px;border:1px solid #ead6b9;border-radius:10px;background:#faf6ed;color:inherit;font:inherit;font-size:22px}.atelier-rsvp input::placeholder,.atelier-rsvp textarea::placeholder{color:#71805c;opacity:.85}.atelier-rsvp fieldset{display:block;border:0;padding:0}.atelier-rsvp fieldset legend{margin-bottom:10px}.atelier-rsvp fieldset label{display:inline-flex;align-items:center;gap:12px;margin:5px 22px 5px 0}.atelier-rsvp fieldset input{width:24px;height:24px;accent-color:#b88d72}.atelier-guest-count{display:flex;align-items:center;gap:30px;flex-wrap:wrap;margin:0 0 34px;font-size:23px}.atelier-guest-count p{flex-basis:100%;margin:0}.atelier-guest-count button{width:64px;height:64px;border:1px solid #ead6b9;border-radius:10px;background:transparent;color:inherit;font-size:32px;cursor:pointer}.atelier-guest-count output{min-width:26px;text-align:center}.atelier-additional-guests label{display:grid;gap:12px;margin:0 0 30px;font-size:23px}.atelier-rsvp textarea{resize:vertical;min-height:170px}.atelier-rsvp .atelier-rsvp-note{font-size:16px;text-align:left;opacity:.78}.atelier-rsvp form>button[type=submit]{width:100%;margin:22px 0 0;padding:22px;border:0;border-radius:9px;background:#bd927d;color:white;font:inherit;font-size:18px;letter-spacing:.2em;text-transform:uppercase;cursor:pointer}.atelier-rsvp-status{text-align:center;font-size:15px!important}
    .atelier-rsvp-secret-garden{max-width:680px;margin:72px auto 54px;padding:52px 46px 44px;border:1px solid #d9ddcb;background:#EFE8DA;color:#485b41;text-align:center;font-family:Georgia,'Times New Roman',serif}
    .atelier-rsvp-secret-garden:before,.atelier-rsvp-secret-garden:after{content:'';display:block;width:min(100%,240px);height:1px;margin:0 auto 25px;background:#a9b296}
    .atelier-rsvp-secret-garden:after{margin:28px auto 0}
    .atelier-rsvp-secret-garden>.atelier-eyebrow{margin:0 0 8px;color:#748064;font-size:11px;letter-spacing:.28em;text-transform:uppercase}
    .atelier-rsvp-secret-garden>h2{margin:0 0 12px;color:#485b41;font-size:clamp(38px,8vw,52px);font-weight:400}
    .atelier-rsvp-secret-garden>.atelier-rsvp-intro{max-width:430px;margin:0 auto 38px;color:#657058;font-size:16px;line-height:1.65}
    .atelier-rsvp-secret-garden>h2{font-size:clamp(52px,12vw,68px);font-style:italic;line-height:1;margin:0 0 12px}
    .atelier-rsvp-secret-garden>.atelier-rsvp-intro{margin:0 auto 28px;font-size:14px;letter-spacing:.3em;text-transform:uppercase}
    .atelier-rsvp-envelope{display:flex;flex-direction:column;align-items:center;gap:40px;margin:34px auto 0}
    .atelier-rsvp-envelope[hidden],.atelier-rsvp form[hidden]{display:none!important}
    .atelier-rsvp-envelope img,.atelier-rsvp-open-envelope{display:block;width:min(68vw,280px);height:230px;object-fit:contain;margin:0 auto 32px}
    .atelier-rsvp-envelope button{min-width:216px;min-height:70px;padding:14px 28px;border:0;border-radius:9px;background:#6b7452;color:#fffdf6;font-family:Georgia,'Times New Roman',serif;font-size:16px;letter-spacing:.2em;text-transform:uppercase;cursor:pointer}
    .atelier-rsvp-secret-garden form{padding:0;margin:0;text-align:left}
    .atelier-rsvp-secret-garden .atelier-rsvp-open-envelope{width:min(72vw,300px);height:320px;margin:0 auto 34px}
    .atelier-rsvp-secret-garden form>label,.atelier-rsvp-secret-garden fieldset{margin-bottom:28px;font-size:18px}
    .atelier-rsvp-secret-garden .atelier-guest-count{display:block;margin-bottom:28px;font-size:18px}
    .atelier-rsvp-secret-garden .atelier-guest-count p{margin:0 0 12px}
    .atelier-rsvp-secret-garden .atelier-guest-count input[type=number]{box-sizing:border-box;width:100%;padding:18px;border:1px solid #e8cfc0;border-radius:9px;background:transparent;color:inherit;font:inherit}
    .atelier-rsvp-secret-garden .atelier-optional{font-size:.9em;font-weight:400}
    .atelier-rsvp-secret-garden fieldset{display:block;padding:0;border:0;margin:0 0 28px}
    .atelier-rsvp-secret-garden fieldset legend{margin:0 0 14px;padding:0;font-size:18px}
    .atelier-rsvp-secret-garden fieldset label{display:inline-flex;align-items:center;gap:8px;margin:0 22px 0 0;font-size:17px;white-space:nowrap}
    .atelier-rsvp-secret-garden fieldset input[type=radio]{width:22px;height:22px;margin:0;accent-color:#69734f}
    .atelier-rsvp-secret-garden .atelier-label-text,.atelier-rsvp-secret-garden .atelier-guest-count>p{font-size:18px}
    .atelier-rsvp-secret-garden input:not([type=radio]):not([type=hidden]),.atelier-rsvp-secret-garden textarea{box-sizing:border-box;width:100%;min-height:58px;padding:14px 16px;border:1.5px solid #efd2c4;border-radius:9px;background:transparent;color:#505a3c;font-family:Georgia,'Times New Roman',serif;font-size:18px;line-height:1.4}
    .atelier-rsvp-secret-garden input::placeholder,.atelier-rsvp-secret-garden textarea::placeholder{color:#71809a;opacity:1}
    .atelier-rsvp-secret-garden textarea{min-height:116px;resize:vertical}
    .atelier-rsvp-secret-garden form>label{gap:12px;margin-bottom:28px}
    .atelier-rsvp-secret-garden .atelier-guest-count{margin-bottom:28px}
    .atelier-rsvp-secret-garden form>button[type=submit]{min-height:58px;margin:4px 0 0;padding:14px;border-radius:8px;font-size:16px;letter-spacing:.02em;text-transform:none}
    .atelier-rsvp-secret-garden form>button[type=submit]{background:#5a6340;color:#f6f3ea;font-family:Georgia,'Times New Roman',serif;font-size:15px;letter-spacing:.16em}
    .atelier-rsvp-majestic{position:relative;isolation:isolate;max-width:680px;margin:72px auto 54px;padding:52px 46px 360px;border:0;background:#EFE8DA;color:#61533f;text-align:center;font-family:Georgia,'Times New Roman',serif;box-shadow:none}
    .atelier-rsvp-majestic:before,.atelier-rsvp-majestic:after{content:none;display:none}
    .atelier-rsvp-majestic>.atelier-eyebrow{margin:0 0 8px;color:#8a775b;font-size:11px;letter-spacing:.28em;text-transform:uppercase}
    .atelier-rsvp-majestic>h2{margin:0 0 12px;color:#61533f;font-size:clamp(52px,12vw,68px);font-style:italic;font-weight:400;line-height:1}
    .atelier-rsvp-majestic>.atelier-rsvp-intro{margin:0 auto 28px;color:#82745d;font-size:14px;letter-spacing:.3em;text-transform:uppercase}
    .atelier-rsvp-majestic .atelier-rsvp-envelope{position:relative;z-index:1;gap:22px;margin:24px auto 0}
    .atelier-rsvp-majestic .atelier-rsvp-envelope .atelier-majestic-envelope-trigger{position:relative;display:block;width:min(50vw,220px);height:auto;aspect-ratio:6/5;min-width:0;min-height:0;overflow:hidden;padding:0;border:0;border-radius:0;background:transparent;box-shadow:none;font:inherit;letter-spacing:normal;text-transform:none;cursor:pointer}
    .atelier-rsvp-majestic .atelier-rsvp-envelope img{position:absolute;bottom:0;left:0;display:block;box-sizing:border-box;width:100%;height:auto;margin:0}
    .atelier-rsvp-majestic .atelier-rsvp-open-envelope{display:block;width:min(72vw,300px);height:320px;object-fit:contain;margin:0 auto 34px}
    @media(max-width:600px){.atelier-rsvp-majestic .atelier-rsvp-open-envelope{height:300px}}
    .atelier-rsvp-majestic .atelier-rsvp-envelope button,.atelier-rsvp-majestic form>button[type=submit]{min-height:58px;padding:14px 28px;border:0;border-radius:2px;background:#716047;color:#fffdf6;font-family:Georgia,'Times New Roman',serif;font-size:15px;letter-spacing:.16em;text-transform:uppercase;cursor:pointer}
    .atelier-rsvp-majestic form{padding:0;margin:0;text-align:left;animation:atelier-majestic-rsvp-open .5s ease both}
    .atelier-rsvp-majestic form,.atelier-rsvp-majestic>.atelier-eyebrow,.atelier-rsvp-majestic>h2,.atelier-rsvp-majestic>.atelier-rsvp-intro{position:relative;z-index:1}
    .atelier-rsvp-majestic .atelier-majestic-lights{position:absolute;z-index:0;right:0;bottom:0;left:0;height:340px;background:url('/design6/assets/string-lights-DfoJYed-.png') center bottom/100% auto no-repeat;pointer-events:none}
    @keyframes atelier-majestic-rsvp-open{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
    .atelier-rsvp-majestic form>label,.atelier-rsvp-majestic fieldset{margin-bottom:28px;font-size:18px}
    .atelier-rsvp-majestic .atelier-guest-count{display:block;margin-bottom:28px;font-size:18px}
    .atelier-rsvp-majestic .atelier-guest-count p{margin:0 0 12px}
    .atelier-rsvp-majestic .atelier-guest-count input[type=number]{box-sizing:border-box;width:100%;padding:18px;border:1px solid #d6c8b2;border-radius:2px;background:transparent;color:inherit;font:inherit}
    .atelier-rsvp-majestic fieldset{display:block;padding:0;border:0}
    .atelier-rsvp-majestic fieldset legend{margin:0 0 14px;padding:0}
    .atelier-rsvp-majestic fieldset label{display:inline-flex;align-items:center;gap:8px;margin:0 22px 0 0}
    .atelier-rsvp-majestic fieldset input[type=radio]{width:22px;height:22px;margin:0;accent-color:#716047}
    .atelier-rsvp-majestic .atelier-label-text,.atelier-rsvp-majestic .atelier-guest-count>p{font-size:18px}
    .atelier-rsvp-majestic input:not([type=radio]):not([type=hidden]),.atelier-rsvp-majestic textarea{box-sizing:border-box;width:100%;min-height:58px;padding:14px 16px;border:1px solid #d6c8b2;border-radius:2px;background:transparent;color:inherit;font:18px Georgia,'Times New Roman',serif;line-height:1.4}
    .atelier-rsvp-majestic textarea{min-height:116px;resize:vertical}
    .atelier-rsvp-majestic form>button[type=submit]{width:100%;margin:4px 0 0}
    .atelier-rsvp-majestic .atelier-rsvp-status{text-align:center}
    @font-face{font-family:MajesticClosingCormorant;src:url('/design5/assets/cormorant-garamond-latin-300-italic-qkwBXYHn.woff2') format('woff2');font-style:italic;font-weight:300;font-display:swap}
    @font-face{font-family:MajesticClosingCormorant;src:url('/design5/assets/cormorant-garamond-latin-400-normal-B-1hWBU7.woff2') format('woff2');font-style:normal;font-weight:400;font-display:swap}
    .atelier-majestic-closing{max-width:860px;margin:0 auto 60px;padding:72px 24px 12px;background:#EFE8DA;color:#5d6241;text-align:center}
    .atelier-majestic-closing h2{margin:0;color:#5d6241;font-family:MajesticClosingCormorant,Georgia,serif;font-size:clamp(54px,20vw,90px);font-style:italic;font-weight:300;line-height:1.05}
    .atelier-majestic-closing p{margin:8px 0 70px;color:#777b60;font-family:MajesticClosingCormorant,Georgia,serif;font-size:clamp(16px,4vw,24px);font-weight:400;letter-spacing:.04em;text-transform:uppercase}
    .atelier-majestic-closing img{display:block;width:100%;height:auto;margin:0 auto;object-fit:contain}
    @media(min-width:768px){.atelier-garland-wrap{width:100%}}
    @media(max-width:600px){.atelier-event{padding:75px 17%;min-height:520px}.atelier-personal h2{font-size:33px}.atelier-personal p{font-size:18px}.atelier-event h3{font-size:23px}.atelier-rsvp{padding:38px 24px 30px;margin-top:56px}.atelier-rsvp-majestic{padding:38px 24px 400px;margin-top:56px}.atelier-rsvp-majestic .atelier-majestic-lights{height:380px}.atelier-rsvp-secret-garden{padding:38px 17px 30px}.atelier-rsvp-secret-garden .atelier-rsvp-open-envelope{height:300px}.atelier-rsvp form>label,.atelier-rsvp fieldset,.atelier-guest-count,.atelier-additional-guests label{font-size:19px}.atelier-rsvp:before,.atelier-rsvp:after{width:130px;height:175px}.atelier-rsvp-secret-garden:before,.atelier-rsvp-secret-garden:after,.atelier-rsvp-majestic:before,.atelier-rsvp-majestic:after{width:min(100%,200px);height:1px}}
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
  frame.current?.contentDocument?.addEventListener('click',event=>{
   const target=event.target as HTMLElement
   if(target.closest('[data-wedding-calendar]')){
    downloadCalendar({title:'Wedding',date:d.date,time:d.time,venue:d.venue,address:d.address,map:d.map},d.offset,`${d.groom} & ${d.bride}`)
    return
   }
   const button=target.closest<HTMLElement>('[data-personal-calendar]')
   if(button){const item=d.events[Number(button.dataset.personalCalendar)];if(item)downloadCalendar(item,d.offset,`${d.groom} & ${d.bride}`)}
  })
  const invitationDocument=frame.current?.contentDocument
  const rsvpForm=invitationDocument?.querySelector<HTMLFormElement>('[data-atelier-rsvp]')
  const rsvpSubmitButton=rsvpForm?.querySelector<HTMLButtonElement>('[type="submit"]')
  const rsvpStatusKey=d.template===6&&rsvpTarget?`majestic-rsvp-sent:${rsvpTarget.orderId}`:null
  if(rsvpStatusKey){
   try{if(window.localStorage.getItem(rsvpStatusKey)==='sent'&&rsvpSubmitButton)rsvpSubmitButton.textContent='Update RSVP'}catch{}
  }
  if(rsvpForm){
   const rsvpSection=rsvpForm.closest<HTMLElement>('.atelier-rsvp-secret-garden,.atelier-rsvp-majestic')
   const openRsvpButtons=rsvpSection?.querySelectorAll<HTMLButtonElement>('[data-secret-garden-open-rsvp]')
   openRsvpButtons?.forEach(openRsvp=>openRsvp.addEventListener('click',()=>{
    rsvpForm.hidden=false
    rsvpSection?.classList.add('is-open')
    rsvpSection?.querySelector<HTMLElement>('[data-secret-garden-envelope]')?.setAttribute('hidden','')
    rsvpForm.querySelector<HTMLInputElement>('input[name="fullName"]')?.focus({preventScroll:true})
   }))
   const guestCountInput=rsvpForm.querySelector<HTMLInputElement>('input[name="guestCount"]')!
   const guestCountOutput=rsvpForm.querySelector<HTMLOutputElement>('[data-guest-count]')!
   const guestFields=rsvpForm.querySelector<HTMLElement>('.atelier-additional-guests')!
   const guestControls=rsvpForm.querySelector<HTMLElement>('.atelier-guest-count')!
   const status=rsvpForm.querySelector<HTMLElement>('.atelier-rsvp-status')!
   let guestCount=1
   const attending=()=>rsvpForm.querySelector<HTMLInputElement>('input[name="attendance"]:checked')?.value==='yes'
   const renderGuestFields=()=>{
    const isAttending=attending()
    guestControls.hidden=!isAttending
    guestCountInput.value=String(isAttending?guestCount:0)
    guestCountOutput.value=String(isAttending?guestCount:0)
    guestFields.replaceChildren()
    if(isAttending&&!rsvpForm.hasAttribute('data-count-only'))for(let index=2;index<=guestCount;index++){
     const label=invitationDocument!.createElement('label')
     label.textContent=`Guest ${index} full name *`
     const input=invitationDocument!.createElement('input')
     input.name='additionalGuest'
     input.type='text'
     input.maxLength=120
     input.required=true
     input.placeholder=`Guest ${index} full name`
     label.append(input)
     guestFields.append(label)
    }
   }
   rsvpForm.querySelectorAll<HTMLInputElement>('input[name="attendance"]').forEach(input=>input.addEventListener('change',renderGuestFields))
   guestCountInput.addEventListener('change',()=>{guestCount=Math.max(1,Math.min(10,Number(guestCountInput.value)||1));renderGuestFields()})
   rsvpForm.querySelectorAll<HTMLButtonElement>('[data-guest-step]').forEach(button=>button.addEventListener('click',()=>{guestCount=Math.max(1,Math.min(10,guestCount+Number(button.dataset.guestStep)));renderGuestFields()}))
   renderGuestFields()
   rsvpForm.addEventListener('submit',event=>{
    event.preventDefault()
    const formData=new FormData(rsvpForm)
    const isAttending=attending()
    const response={name:String(formData.get('fullName')||'').trim(),attendance:isAttending?'yes':'no',count:isAttending?guestCount:0,guests:isAttending?[...rsvpForm.querySelectorAll<HTMLInputElement>('input[name="additionalGuest"]')].map(input=>input.value.trim()):[],message:String(formData.get('message')||'').trim()}
    rsvpForm.dispatchEvent(new CustomEvent('invitation:rsvp-submit',{bubbles:true,cancelable:true,detail:{response,resolve:()=>{status.textContent='Your RSVP has been updated.'},reject:(error:Error)=>{status.textContent=error.message}}}))
   })
  }
  frame.current?.contentDocument?.addEventListener('invitation:rsvp-submit',event=>{
   event.preventDefault()
   const {response,resolve,reject}=(event as CustomEvent<RsvpSubmitRequest>).detail
   if(!rsvpTarget){reject(new Error('Please open the published invitation to send your RSVP.'));return}
   void saveOrderRsvp(rsvpTarget,response).then(()=>{
    if(d.template===6){
     if(rsvpSubmitButton)rsvpSubmitButton.textContent='Update RSVP'
     if(rsvpStatusKey)try{window.localStorage.setItem(rsvpStatusKey,'sent')}catch{}
    }
    resolve()
   },reject)
  })
 }}/>
}
