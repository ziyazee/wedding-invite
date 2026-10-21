import { useLayoutEffect, useRef } from 'react'
import type { Celebration } from '../../invitations/model'
import { formatDate, formatTime } from '../../invitations/model'
import { downloadCalendar } from '../../invitations/calendar'
import { wrapCardText } from '../../invitations/cardContentFit'
import { useDesign14Carousel } from './useDesign14Carousel'
import rulesCSS from './TimelessRules.css?inline'

type NamesProps = { groom:string; bride:string; groomFamily?:string; brideFamily?:string; stacked?:boolean; separator?:string }
// Character thresholds guide sizing; measured width remains the final boundary.
const DEFAULT_NAME_CHARACTERS = 12
const WRAPPED_NAME_CHARACTERS = 16
export function TimelessNames({groom,bride,groomFamily='',brideFamily='',stacked=false,separator='&'}:NamesProps){
 const root=useRef<HTMLDivElement>(null)
 const hasFamily=Boolean(groomFamily.trim()||brideFamily.trim())
 useLayoutEffect(()=>{
  const block=root.current
  if(!block)return
  const names=Array.from(block.querySelectorAll<HTMLElement>('[data-timeless-name]'))
  const values=[groom,bride].map(value=>value.trim().toUpperCase())
  let active=true
  const fit=()=>{
   if(!active||!block.clientWidth)return
   names.forEach((node,index)=>{node.style.removeProperty('font-size');node.textContent=values[index]})
   const maximum=parseFloat(getComputedStyle(names[0]).fontSize)
   const probe=names[0].cloneNode() as HTMLElement
   probe.removeAttribute('data-timeless-name')
   probe.style.cssText='position:absolute;top:0;left:0;visibility:hidden;white-space:pre;max-width:none;width:max-content;display:block;margin:0'
   const style=getComputedStyle(names[0])
   probe.style.fontFamily=style.fontFamily
   probe.style.fontWeight=style.fontWeight
   probe.style.letterSpacing=style.letterSpacing
   block.append(probe)
   const measure=(value:string,size:number)=>{probe.style.fontSize=`${size}px`;probe.textContent=value;return probe.getBoundingClientRect().width}
   const width=block.clientWidth*.94
   const widths=values.map(value=>measure(value,maximum))
   const mustStack=stacked||hasFamily||values.some(value=>value.includes('\n'))||widths[0]+widths[1]+48>width*.8
   block.classList.toggle('is-stacked',mustStack)
   const longestLine=Math.max(0,...values.flatMap(value=>value.split('\n').map(line=>Array.from(line).length)))
   const reduction=Math.min(1,Math.max(0,(longestLine-DEFAULT_NAME_CHARACTERS)/(WRAPPED_NAME_CHARACTERS-DEFAULT_NAME_CHARACTERS)))
   const characterSize=maximum*(1-.25*reduction)
   let size=Math.min(characterSize,Math.max(maximum*.75,Math.min(maximum,maximum*width/Math.max(1,...widths))))
   const longest=Math.max(1,...values.flatMap(value=>value.split(/\s+/).map(word=>measure(word,size))))
   size=Math.min(size,size*width/longest)
   const lines=(value:string)=>value.split('\n').map(paragraph=>{
    const result:string[]=[];let line=''
    for(const word of paragraph.split(/\s+/).filter(Boolean)){
     const candidate=line?`${line} ${word}`:word
     if(line&&(Array.from(candidate).length>WRAPPED_NAME_CHARACTERS||measure(candidate,size)>width)){result.push(line);line=''}
     line=line?`${line} ${word}`:word
    }
    if(line)result.push(line)
    return result.join('\n')
   }).join('\n')
   const render=()=>names.forEach((node,index)=>{node.style.fontSize=`${size}px`;node.textContent=mustStack?lines(values[index]):values[index]})
   render()
   const opening=block.closest<HTMLElement>('.d14-rules-opening')
   if(opening){
    for(let step=0;step<40&&opening.scrollHeight>opening.clientHeight+1;step++){size*=.95;render()}
   }
   probe.remove()
  }
  let width=-1
  const resize=new ResizeObserver(entries=>{const next=entries[0]?.contentRect.width;if(next!==undefined&&next!==width){width=next;fit()}})
  resize.observe(block)
  document.fonts.addEventListener('loadingdone',fit)
  void document.fonts.ready.then(fit)
  fit()
  return()=>{active=false;resize.disconnect();document.fonts.removeEventListener('loadingdone',fit)}
 },[groom,bride,groomFamily,brideFamily,stacked,hasFamily])
 return <div ref={root} className={`d14-rules-names${stacked||hasFamily?' is-stacked':''}`}>
  <div><h2 className="d14-page-two-names" data-timeless-name>{groom.toUpperCase()}</h2>{groomFamily.trim()&&<p className="d14-page-two-family">{groomFamily}</p>}</div>
  <span className="d14-page-two-family-amp">{separator}</span>
  <div><h2 className="d14-page-two-names" data-timeless-name>{bride.toUpperCase()}</h2>{brideFamily.trim()&&<p className="d14-page-two-family">{brideFamily}</p>}</div>
 </div>
}

function artwork(title:string,index:number){
 // Reception takes priority for titles such as "Wedding reception".
 if(/reception/i.test(title))return {file:'reception',top:.61,bottom:.14}
 if(/sangeet|mehendi|henna/i.test(title))return {file:'sangeet',top:.62,bottom:.138}
 if(/wedding|marriage|nikah|muhurtham/i.test(title))return {file:'wedding',top:.615,bottom:.14}
 if(/engagement/i.test(title)||index%4===0)return {file:'engagement',top:.592,bottom:.151}
 return {file:['engagement','sangeet','wedding','reception'][index%4],top:.62,bottom:.15}
}

function TimelessCard({event,index,duplicate=false,cloneSide='',offset,couple,showIllustrations}:{event:Celebration;index:number;duplicate?:boolean;cloneSide?:string;offset:string;couple:string;showIllustrations:boolean}){
 const root=useRef<HTMLElement>(null)
 const art=artwork(event.title,index)
 const id=`d14-event-${index}${duplicate?`-loop-${cloneSide}`:''}`
 useLayoutEffect(()=>{
  const card=root.current
  if(!card)return
  let active=true
  const fit=()=>{
   if(!active||!card.clientWidth)return
   const copy=card.querySelector<HTMLElement>('.d14-engagement-content')!
   card.style.removeProperty('height')
   const required=()=>Array.from(copy.children).reduce((sum,node)=>sum+(node as HTMLElement).offsetHeight,0)+(copy.children.length-1)*(parseFloat(getComputedStyle(copy).gap)||0)
   const fits=(value:number)=>{card.style.setProperty('--d14-card-fit',String(value));return required()<=copy.clientHeight-6}
   if(!showIllustrations){card.style.setProperty('--d14-card-fit','1');return}
   if(fits(1))return
   if(!fits(0)){card.style.height=`${Math.ceil((required()+10)/(1-art.top-art.bottom))}px`;return}
   let low=0,high=1
   for(let step=0;step<9;step++){const middle=(low+high)/2;if(fits(middle))low=middle;else high=middle}
   card.style.setProperty('--d14-card-fit',String(low))
  }
  let width=-1
  const observer=new ResizeObserver(entries=>{const next=entries[0]?.contentRect.width;if(next!==undefined&&next!==width){width=next;fit()}})
  observer.observe(card)
  document.fonts.addEventListener('loadingdone',fit)
  void document.fonts.ready.then(fit)
  fit()
  return()=>{active=false;observer.disconnect();document.fonts.removeEventListener('loadingdone',fit)}
 },[event.title,event.venue,event.address,event.date,event.time,event.map,showIllustrations,art.top,art.bottom])
 return <section ref={root} id={id} className={`d14-engagement-section d14-rules-card${showIllustrations?'':' d14-rules-plain-card'}`} data-d14-name={`event-${index}`} data-carousel-clone={duplicate?'':undefined} aria-hidden={duplicate||undefined} inert={duplicate} aria-label={event.title} aria-roledescription="slide">
  {showIllustrations&&<img className="d14-engagement-art" data-couple-illustration="" src={`/design14/assets/${art.file}.png`} alt="" loading="lazy"/>}
  <article className="d14-engagement-content" style={showIllustrations?{top:`${art.top*100}%`,bottom:`${art.bottom*100}%`}:undefined}>
   <h2 className="d14-engagement-heading">{wrapCardText(event.title,18)}</h2>
   <time className="d14-engagement-date" dateTime={event.date}>{formatDate(event.date)}</time>
   {event.time&&<p className="d14-engagement-time">{formatTime(event.time)}</p>}
   <p className="d14-engagement-venue-name">{wrapCardText(event.venue,24)}</p>
   <p className="d14-engagement-venue-city">{wrapCardText(event.address,32)}</p>
   <div className="d14-rules-actions">
    {event.map.trim()&&<a href={event.map.trim()} target="_blank" rel="noreferrer">Google Maps ↗</a>}
    <button type="button" onClick={()=>downloadCalendar(event,offset,couple)}>Add to calendar</button>
   </div>
  </article>
 </section>
}

function eventTabLabel(title:string){
 if(/reception/i.test(title))return 'Reception'
 if(/engagement/i.test(title))return 'Engagement'
 if(/sangeet/i.test(title))return 'Sangeet'
 if(/wedding|marriage|nikah|muhurtham/i.test(title))return 'Marriage'
 if(/mehendi|mehndi|henna/i.test(title))return 'Mehendi'
 return title
}

export function TimelessCelebrations({opened,events:sourceEvents,offset='+05:30',couple='Wedding celebration',showIllustrations=true}:{opened:boolean;events:Celebration[];offset?:string;couple?:string;showIllustrations?:boolean}){
 const tabOrder=['Engagement','Sangeet','Marriage','Reception']
 const rank=(event:Celebration)=>{const index=tabOrder.indexOf(eventTabLabel(event.title));return index<0?tabOrder.length:index}
 const events=[...sourceEvents].sort((a,b)=>rank(a)-rank(b))
 const {galleryRef,selected,goTo}=useDesign14Carousel(opened,events.length)
 if(!events.length)return null
 const card=(index:number,duplicate=false,cloneSide='')=><TimelessCard key={`${index}-${duplicate}-${cloneSide}`} event={events[index]} index={index} duplicate={duplicate} cloneSide={cloneSide} offset={offset} couple={couple} showIllustrations={showIllustrations}/>
 return <div className="d14-event-gallery d14-rules-gallery" ref={galleryRef} role="region" aria-label="Wedding celebrations" aria-roledescription="carousel">
  <style>{rulesCSS}</style>
  <div className="d14-event-gallery-nav" role="group" aria-label="Choose an event" style={{gridTemplateColumns:`repeat(${events.length}, minmax(72px, 1fr))`}}>
   <span className="d14-event-gallery-indicator" aria-hidden="true" style={{width:`max(72px, calc((100% - ${16+6*(events.length-1)}px) / ${events.length}))`,transform:`translateX(calc(${selected} * (100% + 6px)))`}}/>
   {events.map((event,index)=><button key={index} type="button" aria-label={event.title} aria-controls={`d14-event-${index}`} aria-pressed={selected===index} onClick={()=>goTo(index)}><span className="d14-event-label">{eventTabLabel(event.title)}</span></button>)}
  </div>
  <div className="d14-event-gallery-track" tabIndex={0} aria-label="Event invitations. Swipe horizontally or use the arrow keys.">
   {card(events.length-1,true,'before')}{events.map((_,index)=>card(index))}{card(0,true,'after')}
  </div>
 </div>
}

export function TimelessNotes({dressCode='',note=''}:{dressCode?:string;note?:string}){
 return <>{dressCode.trim()&&<section className="d14-rules-note"><h2>Dress code</h2><p>{dressCode}</p></section>}{note.trim()&&<section className="d14-rules-note"><h2>A little note</h2><p>{note}</p></section>}</>
}
